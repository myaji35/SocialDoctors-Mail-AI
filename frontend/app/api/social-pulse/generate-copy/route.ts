import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/api-auth';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function POST(request: NextRequest) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, platform } = body as { prompt: string; platform?: string };

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const PLATFORM_CONFIGS: Record<string, { name: string; maxChars: number; toneGuide: string; hashtagCount: string }> = {
    FACEBOOK:  { name: 'Facebook',    maxChars: 500,  toneGuide: '친근하고 정보가 풍부하게, 스토리텔링 방식',    hashtagCount: '3-5개' },
    INSTAGRAM: { name: 'Instagram',   maxChars: 300,  toneGuide: '감성적이고 비주얼 중심, 라이프스타일 강조',    hashtagCount: '최대 10개' },
    THREADS:   { name: 'Threads',     maxChars: 450,  toneGuide: '캐주얼하고 대화체, 짧고 임팩트 있게',         hashtagCount: '2-3개' },
    TIKTOK:    { name: 'TikTok',      maxChars: 300,  toneGuide: '트렌디하고 에너지 넘치게, 영상 설명+CTA 강조', hashtagCount: '3-5개' },
    X:         { name: 'X (Twitter)', maxChars: 250,  toneGuide: '간결하고 핵심만, 280자 이내로 압축',           hashtagCount: '2-3개' },
    YOUTUBE:   { name: 'YouTube',     maxChars: 500,  toneGuide: '검색 최적화 중심, 구독 유도',                  hashtagCount: '5-8개' },
  };
  const cfg = PLATFORM_CONFIGS[platform ?? 'FACEBOOK'] ?? PLATFORM_CONFIGS['FACEBOOK'];

  const geminiPrompt = `당신은 한국 소셜 미디어 마케팅 전문가입니다.
다음 주제/제품에 대해 ${cfg.name}에 최적화된 마케팅 카피를 작성해주세요.

주제: ${prompt.trim()}

요구사항:
- 톤: ${cfg.toneGuide}
- 첫 문장에 강한 훅
- 이모지 자연스럽게 활용
- 행동 유도 문구(CTA) 포함
- 관련 해시태그 ${cfg.hashtagCount}
- 전체 텍스트 ${cfg.maxChars}자 이내 (해시태그 포함)

한국어로 작성해주세요. 해시태그는 텍스트 마지막에 모아서.`;

  let copy = '';

  if (GEMINI_API_KEY) {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }

    const data = await res.json();
    copy = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } else {
    copy = `🎯 ${prompt}에 최적화된 카피:\n\n"지금이 바로 기회입니다! ${prompt}로 비즈니스를 한 단계 업그레이드하세요. 오늘만 특별 할인 🔥"\n\n#마케팅 #비즈니스 #성장 #${prompt.replace(/\s/g, '')}`;
  }

  return NextResponse.json({ copy });
}
