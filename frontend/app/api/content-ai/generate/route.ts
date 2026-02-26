import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const TEMPLATE_PROMPTS: Record<string, string> = {
  BLOG_POST: `당신은 한국 SEO 블로그 전문가입니다. 다음 키워드로 SEO 최적화된 블로그 포스트를 작성해주세요.
키워드: {keyword}
요구사항:
- 매력적인 제목 (클릭률 높게)
- 서론 (3-4문장)
- 본문 3개 섹션 (각 섹션에 소제목 포함)
- 결론 및 행동 유도 문구
- 관련 해시태그 5개
한국어로 작성해주세요.`,

  SNS_COPY: `당신은 한국 SNS 마케팅 전문가입니다. 다음 주제로 Facebook/Instagram에 최적화된 카피를 작성해주세요.
주제: {keyword}
요구사항:
- 첫 문장에서 강한 훅 사용
- 이모지 적절히 활용
- 3-5문장의 간결한 본문
- 행동 유도 문구 (CTA)
- 관련 해시태그 10개
한국어로 작성해주세요.`,

  AD_COPY: `당신은 디지털 광고 카피라이터입니다. 다음 제품/서비스에 대한 고클릭율 광고 카피를 작성해주세요.
제품/서비스: {keyword}
요구사항:
- 헤드라인 3가지 (각각 다른 앵글)
- 서브헤드라인
- 본문 (50자 이내)
- 강력한 CTA 버튼 텍스트 3가지
한국어로 작성해주세요.`,

  EMAIL_NEWSLETTER: `당신은 이메일 마케팅 전문가입니다. 다음 주제로 높은 오픈율의 뉴스레터를 작성해주세요.
주제: {keyword}
요구사항:
- 제목 줄 (A/B 테스트용 2가지)
- 인사말
- 핵심 내용 (200-300자)
- 특별 혜택 또는 정보
- 클릭 유도 버튼 텍스트
한국어로 작성해주세요.`,

  PRODUCT_DESCRIPTION: `당신은 이커머스 상품 설명 전문가입니다. 다음 상품에 대한 상세페이지 설명을 작성해주세요.
상품: {keyword}
요구사항:
- 매력적인 상품명 제안
- 핵심 특징 5가지 (bullet point)
- 상세 설명 (150-200자)
- 사용 시나리오 2가지
- 구매 설득 문구
한국어로 작성해주세요.`,

  PRESS_RELEASE: `당신은 홍보 전문가입니다. 다음 주제로 언론 배포용 보도자료를 작성해주세요.
주제: {keyword}
요구사항:
- 헤드라인 (뉴스 가치 있게)
- 서브헤드라인
- 리드 문단 (5W1H)
- 본문 2-3 문단
- 회사 소개 (About 섹션)
- 미디어 연락처 양식
한국어로 작성해주세요.`,
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { templateType, keyword } = body as { templateType: string; keyword: string };

  if (!templateType || !keyword?.trim()) {
    return NextResponse.json({ error: 'templateType and keyword are required' }, { status: 400 });
  }

  const promptTemplate = TEMPLATE_PROMPTS[templateType];
  if (!promptTemplate) {
    return NextResponse.json({ error: 'Invalid templateType' }, { status: 400 });
  }

  const prompt = promptTemplate.replace('{keyword}', keyword.trim());

  let generatedText = '';
  let tokensUsed = 0;

  if (GEMINI_API_KEY) {
    // Gemini API 실제 호출
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }

    const data = await res.json();
    generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    tokensUsed = data.usageMetadata?.totalTokenCount ?? 0;
  } else {
    // Fallback: 목업 응답 (개발 환경)
    generatedText = `[개발 모드 - Gemini API 키 없음]\n\n키워드: "${keyword}"\n\n실제 운영 환경에서는 Gemini AI가 고품질 ${templateType} 콘텐츠를 생성합니다.`;
    tokensUsed = 0;
  }

  // DB 저장
  try {
    await prisma.content.create({
      data: {
        userId: session.user.id,
        type: templateType as never,
        keyword: keyword.trim(),
        body: generatedText,
        promptUsed: prompt,
        tokensUsed,
      },
    });
  } catch (e) {
    console.error('Content save error:', e);
  }

  return NextResponse.json({ content: generatedText, tokensUsed });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? '10');

  const contents = await prisma.content.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, type: true, keyword: true, status: true, createdAt: true, body: true },
  });

  const totalThisMonth = await prisma.content.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    },
  });

  return NextResponse.json({ contents, totalThisMonth });
}
