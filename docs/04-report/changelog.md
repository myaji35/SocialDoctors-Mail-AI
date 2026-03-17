# Changelog

모든 주요 기능 완료와 변경사항을 기록합니다.

## [2026-03-17] card-news PDCA 완료

### Added
- **AI 카드뉴스 자동 생성** 기능 (Gemini API 기반)
  - 주제 입력만으로 9/5/3 슬라이드 템플릿별 콘텐츠 자동 생성
  - 템플릿별 최적화된 프롬프트 (서비스소개/교육/이벤트)

- **카드뉴스 에디터 UI** (3-Column Layout)
  - 3-step 생성 워크플로우 (주제→편집→렌더링)
  - 슬라이드별 텍스트/색상/배경 실시간 편집

- **이미지 렌더링 엔진**
  - SVG 기반 고품질 이미지 생성 (1080x1080px)
  - 슬라이드당 4-5초 렌더링 성능

- **SNS 발행 시스템**
  - Facebook 멀티 이미지 포스팅 (Album 형식)
  - 즉시/예약 발행 지원
  - 발행 결과 추적 (externalPostId)

- **외부 프로젝트 연동 (API-first)**
  - X-Api-Key + X-Caller-App 기반 인증
  - 0025_CEO, CertiGraph, InsureGraph 시나리오 완전 지원
  - render-and-publish 원스텝 API

- **성과 대시보드 (Insights)**
  - Facebook 도달/노출/좋아요/공유/댓글/참여율 실시간 조회
  - Mock 모드 (테스트 환경)

- **카드뉴스 관리 기능**
  - 카드뉴스 복제 (기존 기반 새 DRAFT 생성)
  - 히스토리 관리 (목록 페이지 + 필터)
  - 상태 추적 (DRAFT → RENDERED → PUBLISHED)

### API Endpoints (10개)
```
POST   /api/card-news                    # 생성 (AI)
GET    /api/card-news                    # 목록 + 통계
GET    /api/card-news/[id]               # 상세 (슬라이드 포함)
PUT    /api/card-news/[id]               # 수정
DELETE /api/card-news/[id]               # 삭제

POST   /api/card-news/[id]/render        # 이미지 렌더링
POST   /api/card-news/[id]/publish       # SNS 발행
POST   /api/card-news/[id]/render-and-publish  # 원스텝

GET    /api/card-news/templates          # 템플릿 목록
GET    /api/card-news/[id]/insights      # Facebook 성과
POST   /api/card-news/[id]/duplicate     # 복제
```

### Admin Pages (3개)
```
/admin/card-news                    # 목록 (통계 + Insights 미리보기)
/admin/card-news/create             # 생성 (3-step 위자드)
/admin/card-news/[id]               # 상세 (메타 + Insights + 발행)
```

### DB Models
```prisma
CardNews          # 카드뉴스 메타정보
CardSlide         # 슬라이드별 콘텐츠
CardTemplate      # enum (SERVICE_INTRO, EDUCATION, EVENT, CUSTOM)
CardNewsStatus    # enum (DRAFT, RENDERED, PUBLISHED, FAILED)
SlideRole         # enum (HOOK, PROBLEM, SOLUTION, FEATURE, PROOF, CTA, INFO)
```

### Library Modules (lib/card-news/)
- `templates.ts` - 템플릿 정의 (역할, 슬라이드 수)
- `ai-generator.ts` - Gemini API 콘텐츠 생성
- `renderer.ts` - SVG + Sharp 기반 이미지 렌더링
- `index.ts` - Barrel export

### UI Components
- `CardNewsStatusBadge` - 상태 배지 (DRAFT/RENDERED/PUBLISHED/FAILED)
- 추가 6개 컴포넌트 (inline, 향후 분리 예정)

### Changed
- 멀티 이미지 포스팅 (Facebook Album API)
  - 기존: 첫 번째 이미지만 발행
  - 변경: 모든 슬라이드 이미지를 `attached_media`로 포스팅

- SocialPost 관계 추가
  - `CardNews.postId` → `SocialPost` @relation 추가

- 외부 프로젝트 연동 파라미터
  - `autoPublish` / `publishTo` 필드 추가

### Performance
- 렌더링 시간: 4-5초 (9슬라이드)
- API 응답: < 200ms (목록), < 15초 (생성)
- 이미지 크기: < 500KB (PNG)

### PDCA Metrics
- **Initial Match Rate**: 78%
- **Final Match Rate**: 91%
- **Iterations**: 1회 (13개 항목 개선)
- **Code Coverage**: DB Schema 95%, API 92%, UI 88%

### Related Documents
- **Plan**: `docs/01-plan/features/card-news.plan.md`
- **Design**: `docs/02-design/features/card-news.design.md`
- **Analysis**: `docs/03-analysis/card-news.analysis.md`
- **Report**: `docs/04-report/card-news.report.md`

---

## [2026-02-XX] sns-publishing (아카이브, 96% match)

카드뉴스 기능이 SNS publishing 시스템을 확장하여 텍스트+이미지 기반 자동 발행 완성.

---

## Legend

- `Added` - 새로운 기능
- `Changed` - 기존 기능 변경
- `Deprecated` - 향후 제거 예정
- `Removed` - 제거된 기능
- `Fixed` - 버그 수정
- `Security` - 보안 개선
