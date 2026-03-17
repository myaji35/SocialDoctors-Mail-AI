/**
 * AI Card News Content Generator
 * Gemini API를 사용하여 슬라이드별 콘텐츠 자동 생성
 */

import { getTemplate, type TemplateType, type SlideRoleType } from './templates';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeneratedSlide {
  slideOrder: number;
  role: SlideRoleType;
  headline: string;
  bodyText: string;
  keyPoints: string[];
}

const ROLE_DESCRIPTIONS: Record<SlideRoleType, string> = {
  HOOK: '관심을 끄는 질문이나 충격적인 통계. 20자 이내 헤드라인.',
  PROBLEM: '고객의 페인포인트를 진단. 공감을 유도하는 문제 제기.',
  SOLUTION: '해결책 제시. 서비스/제품의 핵심 가치를 명확하게.',
  FEATURE: '구체적인 기능이나 장점을 상세히 설명.',
  PROOF: '성과 데이터, 고객 후기, 신뢰도를 높이는 증거.',
  CTA: '행동 유도. 지금 시작하세요! 특별 오퍼. QR코드/링크 안내.',
  INFO: '핵심 정보를 전달. 데이터, 팁, 가이드 등.',
};

export async function generateSlideContents(
  topic: string,
  templateType: TemplateType
): Promise<GeneratedSlide[]> {
  const template = getTemplate(templateType);

  const roleList = template.roles
    .map((role, i) => `  ${i + 1}. role: "${role}" - ${ROLE_DESCRIPTIONS[role]}`)
    .join('\n');

  const systemPrompt = `당신은 한국 SNS 마케팅 전문가입니다.
"비즈니스 클리닉" 컨셉 — 문제를 진단하고 솔루션을 처방하는 톤으로 작성합니다.
카드뉴스 슬라이드 콘텐츠를 JSON 배열로 생성해주세요.

주제: ${topic}
템플릿: ${template.name} (${template.slideCount}슬라이드)

슬라이드 구조:
${roleList}

각 슬라이드에 대해 아래 JSON 배열로만 응답하세요 (설명 없이 JSON만):
[
  {
    "slideOrder": 1,
    "role": "HOOK",
    "headline": "20자 이내 임팩트 있는 제목",
    "bodyText": "50자 이내 보조 설명",
    "keyPoints": ["핵심 포인트 1", "핵심 포인트 2"]
  }
]

규칙:
- headline: 최대 20자, 강렬하게
- bodyText: 최대 60자
- keyPoints: 최대 3개, 각 20자 이내
- 한국어로 작성
- JSON만 출력 (마크다운 코드블록 없이)`;

  if (!GEMINI_API_KEY) {
    return generateMockSlides(topic, template.roles);
  }

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
      }),
    });

    if (!res.ok) {
      console.error('Gemini API error:', res.status);
      return generateMockSlides(topic, template.roles);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // JSON 파싱 (코드블록 감싸기 처리)
    const jsonStr = text.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
    const slides: GeneratedSlide[] = JSON.parse(jsonStr);

    // 역할 순서 보정
    return slides.map((slide, i) => ({
      ...slide,
      slideOrder: i + 1,
      role: template.roles[i] ?? slide.role,
    }));
  } catch (error) {
    console.error('AI generation failed, using mock:', error);
    return generateMockSlides(topic, template.roles);
  }
}

function generateMockSlides(topic: string, roles: SlideRoleType[]): GeneratedSlide[] {
  const mockContent: Record<SlideRoleType, (topic: string) => Omit<GeneratedSlide, 'slideOrder' | 'role'>> = {
    HOOK: (t) => ({
      headline: `${t.slice(0, 10)}의 비밀`,
      bodyText: `지금 바로 알아보세요! 놀라운 변화가 시작됩니다.`,
      keyPoints: ['높은 성공률', '검증된 방법'],
    }),
    PROBLEM: (t) => ({
      headline: '이런 고민 있으신가요?',
      bodyText: `${t}을 시작하기 어려우셨다면, 당신만 그런 것이 아닙니다.`,
      keyPoints: ['시간 부족', '방법을 모름', '비용 부담'],
    }),
    SOLUTION: (t) => ({
      headline: '해결책을 찾았습니다',
      bodyText: `${t}으로 모든 고민을 한 번에 해결하세요.`,
      keyPoints: ['간편한 시작', '전문가 지원'],
    }),
    FEATURE: (t) => ({
      headline: '핵심 기능',
      bodyText: `${t}이 제공하는 특별한 기능을 확인하세요.`,
      keyPoints: ['AI 자동화', '실시간 분석', '맞춤 추천'],
    }),
    PROOF: () => ({
      headline: '검증된 성과',
      bodyText: '이미 많은 분들이 변화를 경험했습니다.',
      keyPoints: ['만족도 95%', '사용자 1만명+'],
    }),
    CTA: () => ({
      headline: '지금 시작하세요!',
      bodyText: '오늘 가입하면 30일 무료 체험. 놓치지 마세요!',
      keyPoints: ['무료 체험', '간편 가입'],
    }),
    INFO: (t) => ({
      headline: '알아두면 좋은 정보',
      bodyText: `${t} 관련 핵심 정보를 정리했습니다.`,
      keyPoints: ['핵심 포인트 1', '핵심 포인트 2', '핵심 포인트 3'],
    }),
  };

  return roles.map((role, i) => ({
    slideOrder: i + 1,
    role,
    ...mockContent[role](topic),
  }));
}
