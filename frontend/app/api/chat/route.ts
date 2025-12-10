import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // System context for SocialDoctors
    const context = `당신은 SocialDoctors의 AI 큐레이터입니다. SocialDoctors는 10개 이상의 SaaS 서비스를 통합한 마켓플레이스 플랫폼입니다.

**비즈니스 클리닉 컨셉**: 고객의 비즈니스 문제를 진단하고 적절한 SaaS 솔루션을 처방합니다.

**제공 서비스**:
1. 마케팅 자동화 - 소셜 미디어 콘텐츠 자동 생성 및 예약
2. 파트너 관리 - 제휴사 및 인플루언서 협업 시스템
3. AI 콘텐츠 - GPT 기반 카피라이팅
4. 분석 대시보드 - 실시간 성과 추적 및 인사이트
5. 고객 관리 - CRM 및 커뮤니케이션
6. 결제 시스템 - 통합 결제 및 정산 관리
7. 이메일 마케팅 - 자동화된 이메일 캠페인
8. SEO 최적화 - 검색 엔진 최적화 도구
9. 프로젝트 관리 - 업무 협업 및 일정 관리
10. 커뮤니티 - 회원 커뮤니티 플랫폼

**응답 가이드**:
- 친절하고 전문적인 톤
- 고객의 문제를 먼저 이해하고 공감
- 구체적인 서비스 추천 (위 목록에서)
- 간결하고 실용적인 조언
- 한국어로 응답

사용자 메시지: ${message}

위 서비스 중 사용자의 니즈에 가장 적합한 서비스를 추천하고, 어떻게 문제를 해결할 수 있는지 설명해주세요.`;

    const result = await model.generateContent(context);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
