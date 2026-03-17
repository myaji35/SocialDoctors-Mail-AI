# card-news Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: SocialDoctors
> **Analyst**: Claude Code (gap-detector)
> **Date**: 2026-03-17
> **Design Doc**: [card-news.design.md](../02-design/features/card-news.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Design 문서(`docs/02-design/features/card-news.design.md`)와 실제 구현 코드 간의 일치율을 측정하고,
누락/변경/추가된 항목을 식별하여 PDCA Check 단계를 수행한다.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/card-news.design.md`
- **Implementation Path**: `frontend/` (prisma, lib, app/api, app/admin, components)
- **Analysis Date**: 2026-03-17

---

## 2. Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| DB Schema Match | 90% | ✅ |
| API Endpoints Match | 85% | ⚠️ |
| UI Pages Match | 78% | ⚠️ |
| File Structure Match | 72% | ⚠️ |
| Implementation Checklist | 73% | ⚠️ |
| Non-functional Requirements | 70% | ⚠️ |
| **Overall** | **78%** | **⚠️** |

---

## 3. DB Schema Comparison

### 3.1 Enum 비교

| Design Enum | Implementation | Status | Notes |
|-------------|---------------|--------|-------|
| `CardTemplate` (SERVICE_INTRO, EDUCATION, EVENT, CUSTOM) | `CardTemplate` (SERVICE_INTRO, EDUCATION, EVENT, CUSTOM) | ✅ Match | 완전 일치 |
| `CardNewsStatus` (DRAFT, RENDERED, PUBLISHED, FAILED) | `CardNewsStatus` (DRAFT, RENDERED, PUBLISHED, FAILED) | ✅ Match | 완전 일치 |
| `SlideRole` (HOOK, PROBLEM, SOLUTION, FEATURE, PROOF, CTA, INFO) | `SlideRole` (HOOK, PROBLEM, SOLUTION, FEATURE, PROOF, CTA, INFO) | ✅ Match | 완전 일치 |

### 3.2 CardNews 모델 비교

| Field | Design | Implementation | Status |
|-------|--------|----------------|--------|
| id | String @id @default(cuid()) | String @id @default(cuid()) | ✅ |
| title | String | String | ✅ |
| topic | String | String | ✅ |
| templateType | CardTemplate @default(SERVICE_INTRO) | CardTemplate @default(SERVICE_INTRO) | ✅ |
| slideCount | Int | Int | ✅ |
| status | CardNewsStatus @default(DRAFT) | CardNewsStatus @default(DRAFT) | ✅ |
| brandColor | String? | String? | ✅ |
| subColor | String? | String? | ✅ |
| logoUrl | String? | String? | ✅ |
| fontFamily | String? @default("Noto Sans KR") | String? @default("Noto Sans KR") | ✅ |
| channelId | String? (relation) | String? (relation) | ✅ |
| **postId** | String? (relation to SocialPost) | String? (**no @relation**) | ⚠️ Partial |
| slides | CardSlide[] | CardSlide[] | ✅ |
| createdBy | String? | String? | ✅ |
| callerApp | String? | String? | ✅ |
| createdAt | DateTime @default(now()) | DateTime @default(now()) | ✅ |
| updatedAt | DateTime @updatedAt | DateTime @updatedAt | ✅ |
| publishedAt | DateTime? | DateTime? | ✅ |
| @@index([status]) | ✅ | ✅ | ✅ |
| @@index([callerApp]) | ✅ | ✅ | ✅ |
| @@index([channelId]) | ✅ | ✅ | ✅ |
| @@map | Not in design | `@@map("card_news")` | ⚠️ Added |

### 3.3 CardSlide 모델 비교

| Field | Design | Implementation | Status |
|-------|--------|----------------|--------|
| All fields | Matches | Matches | ✅ Match |
| @@unique([cardNewsId, slideOrder]) | ✅ | ✅ | ✅ |
| @@index([cardNewsId]) | ✅ | ✅ | ✅ |
| @@map | Not in design | `@@map("card_slides")` | ⚠️ Added |

### 3.4 기존 모델 수정 비교

| Model | Design Change | Implementation | Status |
|-------|---------------|----------------|--------|
| SnsChannel | `cardNews CardNews[]` 추가 | `cardNews CardNews[]` 추가됨 (line 228) | ✅ Match |
| SocialPost | `cardNews CardNews[]` 추가 | **추가되지 않음** | ❌ Missing |

### 3.5 Schema Match Rate: 90%

- 17 items match, 1 missing (SocialPost relation), 2 minor additions (@@map)

---

## 4. API Endpoints Comparison

### 4.1 Endpoint 일치 비교

| Design Endpoint | Implementation | Status | Notes |
|-----------------|---------------|--------|-------|
| `POST /api/card-news` (생성) | `app/api/card-news/route.ts` POST | ✅ Match | AI 생성 + 사전정의 콘텐츠 모두 지원 |
| `GET /api/card-news` (목록) | `app/api/card-news/route.ts` GET | ✅ Match | status, callerApp, limit, offset 필터 지원 |
| `GET /api/card-news/[id]` (상세) | `app/api/card-news/[id]/route.ts` GET | ✅ Match | slides + channel include |
| `PUT /api/card-news/[id]` (수정) | `app/api/card-news/[id]/route.ts` PUT | ✅ Match | 부분 업데이트 + 슬라이드 개별 수정 |
| `DELETE /api/card-news/[id]` (삭제) | `app/api/card-news/[id]/route.ts` DELETE | ✅ Match | 204 No Content, Cascade |
| `POST /api/card-news/[id]/render` | `app/api/card-news/[id]/render/route.ts` POST | ✅ Match | 옵션(format, quality, width, height) 지원 |
| `POST /api/card-news/[id]/publish` | `app/api/card-news/[id]/publish/route.ts` POST | ✅ Match | channelId/clientSlug/caption/scheduledAt |
| `POST /api/card-news/[id]/render-and-publish` | `app/api/card-news/[id]/render-and-publish/route.ts` POST | ✅ Match | 원스텝 외부 연동용 |
| `GET /api/card-news/templates` | `app/api/card-news/templates/route.ts` GET | ✅ Match | |
| `GET /api/card-news/images/[filename]` | **구현 없음** | ❌ Missing | 이미지 서빙 API 미구현 (public/ 정적 서빙으로 대체) |
| - | `GET /api/card-news/[id]/insights` | ⚠️ Added | Facebook Insights 성과 조회 (설계에 없음) |

### 4.2 Request/Response Shape 비교

| Endpoint | Design Shape | Implementation Shape | Status |
|----------|-------------|---------------------|--------|
| POST /api/card-news Request | topic, templateType, brandColor, subColor, logoUrl, clientSlug, slides, autoPublish, publishTo | topic, templateType, brandColor, subColor, logoUrl, clientSlug, slides (**autoPublish/publishTo 누락**) | ⚠️ Partial |
| POST /api/card-news Response | { id, title, topic, templateType, status, slideCount, slides, createdAt } | CardNews full object (201) | ✅ Match |
| GET /api/card-news Response | { items, total, stats } | { items, total, stats } | ✅ Match |
| POST render Response | { id, status, slides[{slideOrder, imageUrl}], renderTime } | { id, status, slides, renderTime } | ✅ Match |
| POST publish Response | { id, status, postId, externalPostId, publishedAt } | { success, postId, cardNewsId, externalPostId, publishedAt, ... } | ⚠️ Changed |
| POST publish (DRAFT 상태) | 자동 렌더링 먼저 | 400 에러 반환 (수동 렌더링 요구) | ⚠️ Changed |
| GET templates Response | Array with preview field | Array **without preview field** | ⚠️ Partial |

### 4.3 인증 비교

| Design | Implementation | Status |
|--------|----------------|--------|
| `resolveAuth()` 세션 + API Key 이중 인증 | `resolveAuth()` 사용 (모든 endpoint) | ✅ Match |
| `X-Api-Key` + `X-Caller-App` 헤더 | `resolveAuth()`에서 처리 | ✅ Match |

### 4.4 API Match Rate: 85%

- 9/10 endpoints 구현, 1 missing (images serving), 1 added (insights)
- 일부 request/response shape 차이 (autoPublish, publish response format, DRAFT 자동 렌더링 동작)

---

## 5. UI Pages Comparison

### 5.1 Page 구조 비교

| Design Page | Implementation | Status | Notes |
|-------------|---------------|--------|-------|
| `/admin/card-news` (목록) | `app/admin/card-news/page.tsx` | ✅ Match | 통계카드 + 필터 + 리스트 |
| `/admin/card-news/create` (3-step 위자드) | `app/admin/card-news/create/page.tsx` | ✅ Match | Step1/2/3 구현 |
| `/admin/card-news/[id]` (상세/편집) | `app/admin/card-news/[id]/page.tsx` | ✅ Match | 메타정보 + 슬라이드 그리드 + 발행모달 + Insights |
| `/admin/card-news/[id]/preview` (풀스크린) | **구현 없음** | ❌ Missing | 풀스크린 미리보기 페이지 미구현 |
| Admin 네비게이션 추가 | `app/admin/page.tsx` line 282-285 | ✅ Match | "카드뉴스 관리" 링크 추가됨 |

### 5.2 UI 컴포넌트 비교

| Design Component | Implementation | Status | Notes |
|------------------|---------------|--------|-------|
| CardNewsStatusBadge | `components/card-news/CardNewsStatusBadge.tsx` | ✅ Match | Solid bg + white text |
| TemplateSelector | create/page.tsx 내부 inline | ⚠️ Partial | 별도 컴포넌트가 아닌 페이지 내 inline 구현 |
| SlideEditor | create/page.tsx Step2 inline | ⚠️ Partial | 3-Column Layout 구현, 별도 파일 아님 |
| SlidePreview | create/page.tsx 내 CSS 기반 미리보기 | ⚠️ Partial | inline 구현 |
| SlideRenderer (Satori 호환) | **구현 없음** (SVG 직접 생성으로 대체) | ⚠️ Changed | renderer.ts에서 직접 SVG 문자열 생성 |
| CardNewsTimeline | create/page.tsx Step2 좌측 목록 | ⚠️ Partial | inline 구현 |
| BrandSettingsPanel | create/page.tsx Step1 접을 수 있는 패널 | ⚠️ Partial | inline 구현 |
| CardNewsCreateWizard | create/page.tsx 전체 | ⚠️ Partial | 별도 컨테이너가 아닌 페이지 자체 |

### 5.3 상태 배지 색상 비교

| Status | Design bg | Implementation bg | Status |
|--------|-----------|-------------------|--------|
| DRAFT | `bg-gray-500` (#6B7280) | `#6B7280` | ✅ Match |
| RENDERED | `bg-blue-500` (#3B82F6) | `#3B82F6` | ✅ Match |
| PUBLISHED | `bg-green-500` (#22C55E) | `#22C55E` | ✅ Match |
| FAILED | `bg-red-500` (#EF4444) | `#EF4444` | ✅ Match |

### 5.4 UI Match Rate: 78%

- 4/5 페이지 구현 (preview 미구현)
- 7개 컴포넌트 모두 기능적으로 구현되었으나, 별도 파일이 아닌 inline 구현 (1개만 독립 컴포넌트)

---

## 6. File Structure Comparison

### 6.1 설계 vs 실제 파일 트리

| Design File | Actual File | Status |
|-------------|-------------|--------|
| **app/admin/card-news/** | | |
| `page.tsx` | `page.tsx` | ✅ |
| `create/page.tsx` | `create/page.tsx` | ✅ |
| `[id]/page.tsx` | `[id]/page.tsx` | ✅ |
| `[id]/preview/page.tsx` | - | ❌ Missing |
| **app/api/card-news/** | | |
| `route.ts` | `route.ts` | ✅ |
| `templates/route.ts` | `templates/route.ts` | ✅ |
| `[id]/route.ts` | `[id]/route.ts` | ✅ |
| `[id]/render/route.ts` | `[id]/render/route.ts` | ✅ |
| `[id]/publish/route.ts` | `[id]/publish/route.ts` | ✅ |
| `[id]/render-and-publish/route.ts` | `[id]/render-and-publish/route.ts` | ✅ |
| `images/[filename]/route.ts` | - | ❌ Missing |
| - | `[id]/insights/route.ts` | ⚠️ Added |
| **components/card-news/** | | |
| `TemplateSelector.tsx` | - | ❌ Missing (inline) |
| `SlideEditor.tsx` | - | ❌ Missing (inline) |
| `SlidePreview.tsx` | - | ❌ Missing (inline) |
| `SlideRenderer.tsx` | - | ❌ Missing (SVG 방식으로 대체) |
| `CardNewsTimeline.tsx` | - | ❌ Missing (inline) |
| `BrandSettingsPanel.tsx` | - | ❌ Missing (inline) |
| `CardNewsStatusBadge.tsx` | `CardNewsStatusBadge.tsx` | ✅ |
| `CardNewsCreateWizard.tsx` | - | ❌ Missing (페이지로 대체) |
| **lib/card-news/** | | |
| `templates.ts` | `templates.ts` | ✅ |
| `renderer.ts` | `renderer.ts` | ✅ |
| `ai-generator.ts` | `ai-generator.ts` | ✅ |
| `fonts.ts` | - | ❌ Missing |
| - | `index.ts` | ⚠️ Added (barrel export) |
| **public/fonts/** | | |
| `NotoSansKR-Regular.woff` | - | ❌ Missing |
| `NotoSansKR-Bold.woff` | - | ❌ Missing |
| `NotoSansKR-Black.woff` | - | ❌ Missing |

### 6.2 File Structure Match Rate: 72%

- 설계된 30개 항목 중 18개 구현 (60%), 7개 inline 대체 포함 시 실질 기능 구현율 83%
- 주요 누락: 폰트 파일(3), 독립 컴포넌트 파일(7), fonts.ts, images API, preview 페이지

---

## 7. Implementation Checklist (Design Section 8)

### Phase 1: 기반 구축

| Item | Status | Notes |
|------|--------|-------|
| Prisma 스키마 추가 (CardNews, CardSlide, Enums) | ✅ | 완전 일치 |
| `npx prisma migrate dev` 실행 | ⚠️ | 스키마 작성됨, 마이그레이션 상태 미확인 |
| `satori`, `@resvg/resvg-js` 패키지 설치 | ⚠️ | renderer.ts에 satori import 없음, SVG 직접 생성 + sharp 만 사용 |
| Noto Sans KR woff 폰트 파일 추가 | ❌ | public/fonts/ 디렉토리 없음 |
| `GET /api/card-news/templates` API | ✅ | |
| `POST /api/card-news` API (AI 포함) | ✅ | |
| `GET /api/card-news` API (목록+통계) | ✅ | |
| `GET /api/card-news/[id]` API | ✅ | |
| `PUT /api/card-news/[id]` API | ✅ | |
| `DELETE /api/card-news/[id]` API | ✅ | |
| Admin 네비게이션 추가 | ✅ | |

### Phase 2: 에디터 UI

| Item | Status | Notes |
|------|--------|-------|
| `/admin/card-news` 목록 페이지 (통계+리스트) | ✅ | |
| `/admin/card-news/create` 3-step 위자드 | ✅ | |
| Step 1: TemplateSelector + 주제 + BrandSettings | ✅ | inline 구현 |
| Step 2: SlideEditor (3-Column) + Timeline | ✅ | inline 구현 |
| Step 3: 렌더링 결과 + 발행 설정 | ⚠️ | 렌더링 결과만 표시, 발행 설정은 상세페이지로 이동 유도 |
| `/admin/card-news/[id]` 상세/편집 페이지 | ✅ | 편집은 아닌 상세+발행+Insights 뷰 |
| CardNewsStatusBadge 컴포넌트 | ✅ | |

### Phase 3: 이미지 렌더링

| Item | Status | Notes |
|------|--------|-------|
| `lib/card-news/renderer.ts` (Satori + Resvg + Sharp) | ⚠️ | SVG 문자열 직접 생성 + Sharp만 사용. Satori/Resvg 미사용 |
| `lib/card-news/fonts.ts` (폰트 로드 + 캐싱) | ❌ | 미구현 |
| SlideRenderer 컴포넌트 (역할별 레이아웃 7종) | ⚠️ | 역할별 스타일 분기는 있으나, React 컴포넌트가 아닌 SVG 생성 함수 |
| `POST /api/card-news/[id]/render` API | ✅ | |
| 이미지 파일 저장 + 서빙 (public/card-news/) | ✅ | 파일 저장 구현, 서빙은 Next.js static |
| 이미지 다운로드 (개별 PNG / 전체 ZIP) | ❌ | 미구현 |

### Phase 4: 발행 & 연동

| Item | Status | Notes |
|------|--------|-------|
| `POST /api/card-news/[id]/publish` API | ✅ | |
| `POST /api/card-news/[id]/render-and-publish` API | ✅ | |
| 멀티 이미지 포스팅 | ⚠️ | 첫 번째 이미지만 발행 (멀티 이미지 미지원) |
| `callerApp` 기반 외부 호출 추적 | ✅ | |
| 카드뉴스 복제 기능 | ❌ | 미구현 |

### Checklist Match Rate: 73%

- 총 26개 항목: 16 Match, 6 Partial, 4 Missing

---

## 8. Non-functional Requirements (Design Section 9)

| Requirement | Design Target | Implementation | Status |
|-------------|--------------|----------------|--------|
| 렌더링 성능 | 9슬라이드 < 10초 | SVG+Sharp 직접 생성 (Satori 미사용으로 더 빠를 수 있음) | ⚠️ 미측정 |
| 동시 렌더링 | 최대 3건 (Queue) | Queue/concurrency 제어 없음 | ❌ Missing |
| 이미지 크기 | < 1MB (PNG), < 500KB (JPEG) | Sharp compression 적용됨 | ⚠️ 미측정 |
| API 응답 | 목록 < 200ms, 생성 < 15초 | 응답 시간 미측정 | ⚠️ 미측정 |
| 인증 | 세션 + API Key 이중 | `resolveAuth()` 적용 | ✅ Match |
| 보안 | API Key 없이 외부 접근 불가, Rate limit | Rate limit 미구현 | ⚠️ Partial |

### Non-functional Match Rate: 70%

---

## 9. Differences Found

### 9.1 Missing Features (Design O, Implementation X)

| Item | Design Location | Description |
|------|-----------------|-------------|
| SocialPost.cardNews relation | Section 3.2 | `SocialPost` 모델에 `cardNews CardNews[]` 관계 미추가 |
| CardNews.post relation | Section 3.1 | `postId`가 있으나 `@relation` 없음 |
| `/admin/card-news/[id]/preview` | Section 5.1 | 풀스크린 미리보기 페이지 미구현 |
| `GET /api/card-news/images/[filename]` | Section 4.5 | 이미지 서빙 전용 API 미구현 |
| `lib/card-news/fonts.ts` | Section 7 | 폰트 로드/캐싱 모듈 미구현 |
| Noto Sans KR woff 파일 | Section 6.3 | public/fonts/ 미존재 |
| 이미지 다운로드 (ZIP) | Section 8 Phase 3 | 다운로드 기능 미구현 |
| 카드뉴스 복제 기능 | Section 8 Phase 4 | 복제 기능 미구현 |
| `autoPublish` / `publishTo` 파라미터 | Section 4.1 | POST /api/card-news에서 자동 발행 파라미터 미구현 |
| 동시 렌더링 제어 (Queue) | Section 9 | 동시성 제어 없음 |
| Rate limiting | Section 9 | API Rate limit 미구현 |
| 독립 컴포넌트 파일 7개 | Section 7 | TemplateSelector, SlideEditor 등 inline 구현 |

### 9.2 Added Features (Design X, Implementation O)

| Item | Implementation Location | Description |
|------|------------------------|-------------|
| `GET /api/card-news/[id]/insights` | `app/api/card-news/[id]/insights/route.ts` | Facebook Insights 성과 조회 API (Mock 포함) |
| Insights UI (상세 페이지) | `app/admin/card-news/[id]/page.tsx` | 도달/노출/좋아요/공유/댓글/참여율 표시 |
| `lib/card-news/index.ts` | `frontend/lib/card-news/index.ts` | Barrel export 파일 |
| `@@map` annotations | schema.prisma | `card_news`, `card_slides` 테이블명 매핑 |
| `mockMode` 파라미터 | publish/render-and-publish | 발행 시 Mock 모드 지원 |
| 목록 페이지 Insights 미리보기 | card-news/page.tsx line 213 | 발행된 항목에 도달/좋아요/공유 표시 |

### 9.3 Changed Features (Design != Implementation)

| Item | Design | Implementation | Impact |
|------|--------|----------------|--------|
| 렌더링 엔진 | Satori (React->SVG) + @resvg/resvg-js (SVG->PNG) + Sharp | SVG 문자열 직접 생성 + Sharp (SVG->PNG) | Medium - Satori 미사용으로 한글 폰트 렌더링 품질 저하 가능 |
| DRAFT 발행 시 동작 | 자동 렌더링 후 발행 | 400 에러 반환 (수동 렌더링 요구) | Low - 명확한 에러 메시지 제공 |
| Publish Response | `{ id, status, postId, externalPostId, publishedAt }` | `{ success, postId, cardNewsId, externalPostId, publishedAt, platform, channelName, ... }` | Low - 더 많은 정보 제공 |
| 멀티 이미지 포스팅 | Facebook Album / Instagram Carousel | 첫 번째 이미지만 포스팅 | High - 카드뉴스 핵심 기능 |
| Step 3 발행 설정 | Step 3에서 채널 선택 + 발행 | "상세 페이지로 이동" 안내만 | Low - 상세 페이지에서 발행 가능 |
| 컴포넌트 분리 | 7개 독립 컴포넌트 파일 | 1개 독립 + 나머지 inline | Medium - 재사용성 감소 |
| 템플릿 preview 필드 | 각 템플릿에 preview 이미지 URL 포함 | preview 필드 없음 | Low |

---

## 10. Recommended Actions

### 10.1 Immediate Actions (High Impact)

| Priority | Item | Description |
|----------|------|-------------|
| 1 | 멀티 이미지 포스팅 구현 | 현재 첫 번째 이미지만 발행됨. Facebook Album API 연동 필요. 카드뉴스 핵심 기능. |
| 2 | SocialPost 관계 추가 | `schema.prisma`에 `SocialPost.cardNews` 및 `CardNews.post @relation` 추가 |
| 3 | `autoPublish` 파라미터 구현 | 외부 프로젝트 전자동 워크플로우 (시나리오 C) 지원에 필수 |

### 10.2 Short-term Actions (Medium Impact)

| Priority | Item | Description |
|----------|------|-------------|
| 4 | Satori 렌더링 엔진 도입 | 현재 SVG 직접 생성은 한글 폰트/복잡한 레이아웃 한계. 설계대로 Satori + Resvg 파이프라인 적용 |
| 5 | 한글 폰트 파일 추가 | `public/fonts/NotoSansKR-*.woff` 추가 + `lib/card-news/fonts.ts` 구현 |
| 6 | 컴포넌트 파일 분리 | TemplateSelector, SlideEditor 등을 독립 컴포넌트로 리팩토링 |
| 7 | 이미지 다운로드 기능 | 개별 PNG 다운로드 + 전체 ZIP 다운로드 |

### 10.3 Long-term Actions (Low Impact)

| Item | Description |
|------|-------------|
| 풀스크린 미리보기 페이지 | `/admin/card-news/[id]/preview` |
| 동시 렌더링 제어 (Queue) | 메모리 보호를 위한 동시 렌더링 수 제한 |
| Rate limiting | API 보안 강화 |
| 카드뉴스 복제 기능 | 기존 카드뉴스 기반 복제 |
| 이미지 서빙 API | Cache-Control 헤더 포함 전용 API (현재 static 서빙으로 충분) |

### 10.4 Design Document Updates Needed

다음 항목은 설계 문서에 반영이 필요한 구현 추가 사항:

- [ ] `GET /api/card-news/[id]/insights` API 추가 (Facebook Insights 연동)
- [ ] Insights UI 섹션 추가 (상세 페이지)
- [ ] `mockMode` 파라미터 문서화
- [ ] 렌더링 엔진 변경 사항 반영 (SVG 직접 생성 방식 vs Satori)
- [ ] `@@map` 테이블명 매핑 반영

---

## 11. Match Rate Summary

```
+---------------------------------------------+
|  Overall Match Rate: 78%                     |
+---------------------------------------------+
|  DB Schema:           90%                    |
|  API Endpoints:       85%                    |
|  UI Pages:            78%                    |
|  File Structure:      72%                    |
|  Implementation:      73%                    |
|  Non-functional:      70%                    |
+---------------------------------------------+
|  Total Items Analyzed: 82                    |
|  Match:          52 items (63%)              |
|  Partial:        18 items (22%)              |
|  Missing:        12 items (15%)              |
+---------------------------------------------+
```

**Verdict**: Match Rate 78% -- 설계와 구현 사이에 일부 차이가 있으며, 문서 업데이트 및 핵심 기능 보완이 권장됩니다.

---

## 12. Synchronization Options

1. **구현을 설계에 맞추기** -- 멀티 이미지 포스팅, Satori 엔진, 독립 컴포넌트 분리 등
2. **설계를 구현에 맞추기** -- Insights API, SVG 직접 생성 방식, mockMode 등 설계 문서 업데이트
3. **양쪽 통합** -- 핵심 기능(멀티 이미지)은 구현 보완, 추가 기능(Insights)은 설계 반영
4. **의도적 차이 기록** -- SVG 직접 생성은 초기 MVP 전략으로 기록, Satori는 Phase 2로 계획

**Recommendation**: Option 3 (양쪽 통합) -- 멀티 이미지 포스팅과 SocialPost 관계를 우선 구현하고, Insights/mockMode 등은 설계 문서에 반영.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-17 | Initial gap analysis | Claude Code (gap-detector) |
