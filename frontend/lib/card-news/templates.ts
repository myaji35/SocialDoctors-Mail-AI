/**
 * Card News Template Definitions
 * 템플릿별 슬라이드 구조 정의
 */

export type TemplateType = 'SERVICE_INTRO' | 'EDUCATION' | 'EVENT' | 'CUSTOM';
export type SlideRoleType = 'HOOK' | 'PROBLEM' | 'SOLUTION' | 'FEATURE' | 'PROOF' | 'CTA' | 'INFO';

export interface TemplateDefinition {
  type: TemplateType;
  name: string;
  description: string;
  slideCount: number;
  roles: SlideRoleType[];
}

export const TEMPLATES: Record<TemplateType, TemplateDefinition> = {
  SERVICE_INTRO: {
    type: 'SERVICE_INTRO',
    name: '서비스 소개',
    description: '9슬라이드 구성: Hook → Problem → Solution → Feature → Proof → CTA',
    slideCount: 9,
    roles: ['HOOK', 'PROBLEM', 'PROBLEM', 'SOLUTION', 'SOLUTION', 'FEATURE', 'FEATURE', 'PROOF', 'CTA'],
  },
  EDUCATION: {
    type: 'EDUCATION',
    name: '교육 콘텐츠',
    description: '5슬라이드 구성: 주제 소개 → 핵심 정보 → 실행 가이드 → CTA',
    slideCount: 5,
    roles: ['HOOK', 'INFO', 'INFO', 'INFO', 'CTA'],
  },
  EVENT: {
    type: 'EVENT',
    name: '이벤트/프로모션',
    description: '3슬라이드 구성: 타이틀 → 혜택/조건 → 참여 방법',
    slideCount: 3,
    roles: ['HOOK', 'INFO', 'CTA'],
  },
  CUSTOM: {
    type: 'CUSTOM',
    name: '커스텀',
    description: '자유 구성: 슬라이드 수와 역할을 직접 지정',
    slideCount: 5,
    roles: ['HOOK', 'INFO', 'INFO', 'INFO', 'CTA'],
  },
};

export function getTemplate(type: TemplateType): TemplateDefinition {
  return TEMPLATES[type] ?? TEMPLATES.SERVICE_INTRO;
}
