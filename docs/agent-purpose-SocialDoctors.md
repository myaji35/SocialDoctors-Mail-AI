# Agent Purpose and Type

**Agent Name:** SocialDoctors Marketing Agent (가명)
**Created:** 2025-12-10
**Creator:** Gangseungsig

## Core Purpose

**SocialDoctors 마켓플레이스 홍보 자동화 에이전트**

이 에이전트는 SocialDoctors 마이크로 SaaS 마켓플레이스의 홍보 활동을 자동화하고 최적화합니다.

### Primary Functions

1. **소셜 미디어 콘텐츠 자동화**
   - Facebook/Instagram 포스트 자동 생성
   - AI 기반 카드뉴스 제작
   - 해시태그 및 카피라이팅 최적화
   - 콘텐츠 예약 및 일정 관리

2. **파트너/인플루언서 마케팅 자료**
   - 파트너용 홍보 템플릿 생성
   - 제휴 링크 포함한 맞춤형 마케팅 키트
   - 파트너별 개인화된 홍보 콘텐츠
   - 인플루언서 협업 자료 제작

### Value Proposition

- **시간 절약**: 수동 콘텐츠 제작 시간을 80% 단축
- **일관성**: 브랜드 가이드라인을 준수한 통일된 메시지
- **개인화**: 타겟별 맞춤형 콘텐츠 자동 생성
- **확장성**: 10개 이상의 SaaS 서비스를 효율적으로 홍보

## Target Users

**Primary Users:**
- SocialDoctors 마케팅 담당자
- 파트너/제휴사 관리자
- 콘텐츠 크리에이터

**Use Cases:**
- 주간/월간 소셜 미디어 콘텐츠 캘린더 생성
- 신규 파트너 온보딩 시 마케팅 키트 자동 제공
- 특정 SaaS 서비스 프로모션 캠페인 실행
- A/B 테스트용 다양한 콘텐츠 변형 생성

## Chosen Agent Type

**Type:** Expert Agent

### Rationale

Expert Agent 선택 이유:

1. **브랜드 지식 관리 필요**
   - SocialDoctors 브랜드 가이드라인 (톤앤매너, 비주얼 아이덴티티)
   - 10개 마이크로 SaaS 서비스별 상세 정보
   - "비즈니스 클리닉" 컨셉 및 메시징 프레임워크

2. **학습 및 개선**
   - 성공한 콘텐츠 패턴 학습
   - 파트너별 선호도 및 반응 데이터 저장
   - 타겟 고객 페르소나 지속적 업데이트

3. **세션 간 일관성**
   - 이전 세션의 콘텐츠 스타일 기억
   - 캠페인 히스토리 추적
   - 반복 작업 최적화

4. **개인 지식 베이스**
   - sidecar/knowledge/brand-guidelines.md
   - sidecar/knowledge/services/*.md (10개 서비스 정보)
   - sidecar/knowledge/partners/*.md (파트너 프로필)
   - sidecar/memories.md (학습 내용)

### Architecture Benefits

- ✓ 도메인 제한으로 안전성 확보
- ✓ 개인화된 마케팅 자산 축적
- ✓ 시간이 지남에 따라 점점 더 효과적
- ✓ 사용자별 커스터마이징 가능

## Output Path

**Agent Location:** `.bmad/custom/src/agents/socialdoctors-marketing/`

**Sidecar Structure:**
```
.bmad-user-memory/socialdoctors-marketing/
├── memories.md
├── knowledge/
│   ├── brand-guidelines.md
│   ├── services/
│   │   ├── service-01.md
│   │   └── ... (10 services)
│   ├── partners/
│   │   └── partner-profiles.md
│   └── personas/
│       └── target-audiences.md
└── workflows/
    ├── content-generation.md
    └── partner-kit-creation.md
```

## Context from Brainstorming

브레인스토밍 세션을 건너뛰었지만, 초기 대화에서 다음 인사이트를 얻었습니다:

- **문제**: 마이크로 SaaS 제품들을 마켓플레이스 형식으로 효과적으로 홍보
- **목표**: 홍보 자동화, 소셜 미디어 콘텐츠 생성, 파트너 유치 마케팅
- **컨셉**: "비즈니스 클리닉" - 문제 진단부터 SaaS 솔루션 처방까지
- **전략**: "Hero Product" 접근 - 1-2개 킬러 서비스로 트래픽 유도

---

**Next Step:** Persona Development - 에이전트의 개성과 커뮤니케이션 스타일 정의
