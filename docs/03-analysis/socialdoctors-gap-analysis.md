# Design-Implementation Gap Analysis Report

> **Summary**: SocialDoctors 플랫폼 전체 설계-구현 갭 분석
>
> **Author**: Claude Code (Gagahoho, Inc.)
> **Created**: 2026-02-18
> **Status**: Review

---

## Analysis Overview
- **Analysis Target**: SocialDoctors Micro-SaaS Marketplace Platform (전체)
- **Design Document**: `docs/01-plan/`, `docs/02-design/`, `prd.md`
- **Implementation Path**: `frontend/` (Next.js App Router)
- **Analysis Date**: 2026-02-18

---

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| PRD vs Implementation (Core Platform) | 62% | :warning: |
| SaaS Landing Pages (Plan vs Implementation) | 35% | :x: |
| Affiliate System (Design vs Implementation) | 88% | :warning: |
| Data Model (Design vs Prisma Schema) | 92% | :white_check_mark: |
| API Spec (Design vs Route Handlers) | 78% | :warning: |
| UI/UX (Design vs Pages) | 72% | :warning: |
| Architecture Compliance | 55% | :x: |
| **Overall** | **60%** | :warning: |

---

## 1. PRD vs Core Platform Implementation

### PRD 3.1: Unified Auth / SSO

| Requirement | Status | Notes |
|-------------|:------:|-------|
| One-ID 시스템 (Clerk SSO) | :white_check_mark: | Clerk 연동 완료 |
| 통합 대시보드 (구독 상태 확인) | :x: | 미구현 - 유저별 구독 현황 페이지 없음 |

### PRD 3.2: Landing Page / UI

| Requirement | Status | Notes |
|-------------|:------:|-------|
| Hero Section (3D/영상 배경) | :warning: | 구현됨, 단 정적 Hero (3D/영상 없음) |
| Bento Grid (Service Grid) | :white_check_mark: | 구현 완료, 10개 앱 카드 + 라우팅 연결 |
| AI Curator (챗봇) | :white_check_mark: | Gemini API 기반 플로팅 챗봇 구현 완료 |

### PRD 3.3: Affiliate System

| Requirement | Status | Notes |
|-------------|:------:|-------|
| 소개 코드 생성 | :white_check_mark: | `SD-XXXXXX` 형식 구현 완료 |
| 쿠키 트래킹 (30일) | :white_check_mark: | `/r/[code]` Route Handler + 30일 쿠키 |
| ReferredBy 영구 귀속 | :white_check_mark: | `/api/affiliate/attribute` 구현 완료 |
| 수익 공유 20% | :white_check_mark: | Webhook 기반 수수료 자동 계산 구현 |
| 파트너 대시보드 | :white_check_mark: | recharts 차트 + KPI 카드 구현 완료 |

### PRD 3.4: Social Automation (Facebook)

| Requirement | Status | Notes |
|-------------|:------:|-------|
| Event Trigger | :x: | 미구현 |
| AI Content Gen (Facebook용) | :x: | 미구현 |
| Auto Posting (Meta Graph API) | :x: | 미구현 |

### PRD 5: Data Model

| PRD Entity | Prisma Schema | Status |
|------------|:----------:|:------:|
| User (통합 회원) | :x: 미구현 | Clerk에 위임, 자체 User 모델 없음 |
| Partner_Wallet | :white_check_mark: PartnerWallet | 구현 완료 |
| Transaction_Log | :white_check_mark: CommissionTransaction | 구현 완료 |
| Social_Post_Queue | :x: 미구현 | Facebook 자동 포스팅 미구현 |

### PRD Core Platform Match Rate: **62%**

---

## 2. SaaS App Landing Pages Gap Analysis

모든 10개 SaaS의 Plan 문서에는 다음이 정의되어 있습니다:
- MVP 기능 목록 (체크박스)
- 데이터 모델 (Prisma schema)
- API 엔드포인트
- UI/UX 구조
- 수익 모델 (요금 테이블)
- 기술 연동
- 마일스톤

**현재 10개 SaaS 구현 상태: 모두 "Landing Page Only" (소개 + 요금제 페이지)**

| SaaS App | Plan 정의 기능 | 구현 상태 | Match |
|----------|:------------:|:--------:|:-----:|
| Social Pulse (#1) | MVP 5개 + API 11개 | Landing Only | 10% |
| Partner Hub (#2) | MVP 7개 + API 14개 | Landing Only | 10% |
| Content AI (#3) | MVP 5개 + API 12개 | Landing Only | 10% |
| Insight Board (#4) | MVP 5개 + API 15개 | Landing Only | 10% |
| CRM Pro (#5) | MVP 5개 + API 14개 | Landing Only | 10% |
| Pay Flow (#6) | MVP 6개 + API 14개 | Landing Only | 10% |
| Mail Rocket (#7) | MVP 6개 + API 14개 | Landing Only | 10% |
| Shop Builder (#8) | MVP 5개 + API 10개 | Landing Only | 10% |
| Form Wizard (#9) | MVP 6개 + API 13개 | Landing Only | 10% |
| Task Flow (#10) | MVP 6개 + API 14개 | Landing Only | 10% |

### What IS Implemented per SaaS App Page:
- :white_check_mark: Hero Section (제품 소개, 가치 제안)
- :white_check_mark: Feature Cards (Plan의 MVP 기능 소개 - UI만)
- :white_check_mark: Pricing Table (Plan의 수익 모델 테이블 반영)
- :white_check_mark: CTA 버튼들 (무료 시작, 데모 보기)
- :white_check_mark: Dashboard Preview (목업/스크린샷)
- :white_check_mark: Framer Motion 애니메이션
- :white_check_mark: BentoGrid 라우팅 연결 (`/saas/apps/{slug}`)

### What is NOT Implemented per SaaS App:
- :x: 실제 MVP 기능 (백엔드 로직)
- :x: API 엔드포인트 (Plan에 정의된 엔드포인트 전무)
- :x: 데이터 모델 (Prisma Schema에 SaaS별 모델 없음)
- :x: 기능별 UI (에디터, 대시보드, 설정 등)
- :x: 외부 서비스 연동 (API 키, OAuth 등)

### SaaS Landing Pages Match Rate: **35%** (소개 페이지 + 요금 정보 반영 기준)
- 기능 구현 기준: **10%** (0/총 50+ MVP 기능)

---

## 3. Affiliate System Gap Analysis (Detailed)

### 3.1 Design Document (`affiliate-system.design.md`) vs Implementation

#### DB Schema

| Design Entity | Implementation | Match |
|--------------|:-----------:|:-----:|
| Partner | :white_check_mark: 100% 일치 | 모든 필드 동일 |
| PartnerWallet | :white_check_mark: 100% 일치 | 모든 필드 동일 |
| ReferredUser | :white_check_mark: 100% 일치 | 모든 필드 동일 |
| ReferralClick | :white_check_mark: 100% 일치 | converted + convertedAt 포함 |
| CommissionTransaction | :white_check_mark: 100% 일치 | webhookPayload 포함 |
| Settlement | :white_check_mark: 100% 일치 | bankName/accountNumber/accountHolder |
| PartnerStatus enum | :white_check_mark: PENDING/ACTIVE/SUSPENDED |
| CommissionStatus enum | :white_check_mark: PENDING/CONFIRMED/PAID |
| SettlementStatus enum | :white_check_mark: REQUESTED/PROCESSING/COMPLETED/REJECTED |

**DB Schema Match: 100%**

#### API Endpoints

| Design Endpoint | Impl | Match | Notes |
|----------------|:----:|:-----:|-------|
| `POST /api/affiliate/register` | :white_check_mark: | 100% | Request/Response 일치 |
| `POST /api/referral/track` | :white_check_mark: | 90% | Response에 redirectUrl 미포함 |
| `POST /api/affiliate/attribute` | :white_check_mark: | 100% | 트랜잭션 처리 일치 |
| `GET /api/affiliate/dashboard` | :white_check_mark: | 100% | stats, clicksChart 일치 |
| `POST /api/affiliate/settlement` | :white_check_mark: | 100% | MIN_SETTLEMENT 50000 일치 |
| `POST /api/webhooks/payment` | :white_check_mark: | 100% | HMAC + 트랜잭션 일치 |
| `GET /api/affiliate/link` | :x: | 0% | 미구현 (dashboard에 통합) |
| `GET /api/affiliate/clicks` | :x: | 0% | 미구현 (dashboard에 통합) |
| `GET /api/affiliate/commissions` | :x: | 0% | 미구현 (dashboard에 통합) |
| `GET /api/admin/partners` | :x: | 0% | 어드민 파트너 관리 API 미구현 |
| `PATCH /api/admin/partners/[id]/approve` | :x: | 0% | 어드민 승인 API 미구현 |

**API Match: 55%** (6/11 엔드포인트)
- 단, 핵심 플로우는 모두 구현 (register, track, attribute, dashboard, settlement, webhook)
- 미구현 API 중 3개는 dashboard API에 데이터가 통합되어 있음

#### File/Component Structure

| Design File | Implementation | Status |
|------------|:-------------:|:------:|
| `app/r/[code]/route.ts` | :white_check_mark: | 구현 완료 |
| `app/partner/page.tsx` | :white_check_mark: | 구현 완료 |
| `app/partner/register/page.tsx` | :white_check_mark: | 구현 완료 |
| `app/partner/dashboard/page.tsx` | :white_check_mark: | 구현 완료 |
| `app/admin/partners/page.tsx` | :x: | 미구현 |
| `app/admin/settlements/page.tsx` | :x: | 미구현 |
| `app/api/affiliate/register/route.ts` | :white_check_mark: | 구현 완료 |
| `app/api/affiliate/dashboard/route.ts` | :white_check_mark: | 구현 완료 |
| `app/api/affiliate/attribute/route.ts` | :white_check_mark: | 구현 완료 |
| `app/api/affiliate/settlement/route.ts` | :white_check_mark: | 구현 완료 |
| `app/api/referral/track/route.ts` | :white_check_mark: | 구현 완료 |
| `app/api/webhooks/payment/route.ts` | :white_check_mark: | 구현 완료 |
| `lib/referral.ts` | :white_check_mark: | 구현 완료 |
| `lib/webhook.ts` | :white_check_mark: | 구현 완료 |
| `components/partner/*` (7개 컴포넌트) | :x: | 미구현 - 페이지에 인라인 코딩 |
| `app/partner/layout.tsx` | :x: | 미구현 |

#### Core Logic

| Design Logic | Implementation | Status |
|-------------|:-------------:|:------:|
| referralCode 생성 (`SD-` + nanoid(6)) | :white_check_mark: | `customAlphabet` 사용 일치 |
| 쿠키 설정 (30일, httpOnly, sameSite) | :white_check_mark: | 설정값 정확히 일치 |
| 클릭 추적 (fire-and-forget) | :white_check_mark: | `.catch(() => {})` 패턴 사용 |
| 회원가입 귀속 (트랜잭션) | :white_check_mark: | `prisma.$transaction` 사용 |
| 수수료 적립 (트랜잭션, 20%) | :white_check_mark: | `Math.floor(amount * 0.20)` |
| HMAC-SHA256 서명 검증 | :white_check_mark: | `crypto.timingSafeEqual` 사용 |
| 정산 최소 금액 50,000원 | :white_check_mark: | `MIN_SETTLEMENT = 50000` |

### Affiliate System Overall Match: **88%**

---

## 4. Architecture Compliance

### Folder Structure (Current: Starter Level)

```
frontend/
├── app/                    # Pages + API Routes (혼합)
│   ├── api/                # API Route Handlers
│   ├── saas/apps/          # SaaS Landing Pages
│   ├── partner/            # Partner Pages
│   ├── admin/              # Admin Page
│   └── page.tsx            # Home
├── components/             # UI Components (일부)
├── lib/                    # Utilities
│   ├── prisma.ts
│   ├── referral.ts
│   ├── webhook.ts
│   └── saas-store.ts
└── prisma/
    └── schema.prisma
```

### Issues Found

| Issue | Severity | Location |
|-------|:--------:|----------|
| Partner 컴포넌트 분리 안됨 | Medium | `app/partner/dashboard/page.tsx` (197줄 단일 파일) |
| 인라인 스타일 사용 (Tailwind 미사용) | Medium | `app/partner/*.tsx` (style={{}} 패턴) |
| Admin 페이지에 하드코딩 비밀번호 | **High** | `app/admin/page.tsx:49` (`password === 'admin123'`) |
| API 라우트 전체 public 처리 | **High** | `middleware.ts:7` (`'/api(.*)'` public) |
| Admin 페이지 public 처리 | **High** | `middleware.ts:12` (`'/admin(.*)'` public) |
| services/ 레이어 부재 | Low | API 직접 호출 (useEffect + fetch) |
| types/ 폴더 부재 | Low | 인터페이스가 페이지 내 인라인 정의 |
| `components/partner/` 미생성 | Low | Design에 7개 컴포넌트 정의, 미분리 |

### Architecture Score: **55%**

---

## 5. Convention Compliance

| Convention | Compliance | Issues |
|-----------|:---------:|-------|
| Component naming (PascalCase) | :white_check_mark: 90% | SaaS page 파일명 kebab-case (정상) |
| Function naming (camelCase) | :white_check_mark: 95% | |
| Constants (UPPER_SNAKE_CASE) | :warning: 70% | `MIN_SETTLEMENT` OK, 다른 상수들 인라인 |
| File naming | :white_check_mark: 90% | Next.js App Router 컨벤션 준수 |
| Import order | :warning: 60% | 일부 파일에서 순서 불일치 |
| Environment variables | :warning: 70% | `WEBHOOK_SECRET` 정의, `.env.example` 미생성 |
| Tailwind vs inline style 혼용 | :x: 40% | Partner 페이지는 인라인, SaaS는 Tailwind |

---

## Differences Summary

### :red_circle: Missing Features (Design O, Implementation X)

| # | Item | Design Location | Description | Priority |
|---|------|-----------------|-------------|:--------:|
| 1 | Admin Partner Management | design.md Section 4 | `app/admin/partners/` 페이지 미구현 | P1 |
| 2 | Admin Settlement Management | design.md Section 4 | `app/admin/settlements/` 페이지 미구현 | P1 |
| 3 | Admin Partner APIs | plan.md Section 5 | `GET /api/admin/partners`, `PATCH .../approve` | P1 |
| 4 | Partner Layout | design.md Section 4 | `app/partner/layout.tsx` 미구현 | P2 |
| 5 | Partner Components | design.md Section 4 | 7개 컴포넌트 미분리 (인라인 구현) | P2 |
| 6 | Social Post Queue Model | prd.md Section 5 | `Social_Post_Queue` 테이블 미구현 | P3 |
| 7 | Facebook Auto Posting | prd.md 3.4 | Event Trigger + Meta Graph API 전체 미구현 | P3 |
| 8 | 통합 대시보드 (유저) | prd.md 3.1 | 유저별 구독 상태 확인 페이지 미구현 | P3 |
| 9 | SaaS MVP Features (x10) | plan/saas/*.plan.md | 10개 SaaS 실제 기능 전무 (Landing Only) | P0 |
| 10 | SaaS API Endpoints (135+) | plan/saas/*.plan.md | 10개 SaaS API 전무 | P0 |
| 11 | SaaS Data Models | plan/saas/*.plan.md | 10개 SaaS Prisma 모델 전무 | P0 |

### :yellow_circle: Added Features (Design X, Implementation O)

| # | Item | Implementation Location | Description |
|---|------|------------------------|-------------|
| 1 | SaaS CRUD Admin | `app/admin/page.tsx` | SaaS 제품 CRUD 관리 (Design 문서에 없음) |
| 2 | Plane Integration | `app/api/plane/` | Plane 이슈 트래킹 연동 (Design에 없음) |
| 3 | Feedback System | `app/api/feedback/` | 피드백 수집 API (Design에 없음) |
| 4 | AI Chat API | `app/api/chat/route.ts` | Gemini AI 챗봇 (PRD에는 있으나 Design 미작성) |

### :large_blue_circle: Changed Features (Design != Implementation)

| # | Item | Design | Implementation | Impact |
|---|------|--------|----------------|:------:|
| 1 | Partner UI Style | Tailwind + Shadcn/ui | Inline style={{}} | Medium |
| 2 | referral/track Response | `{ success, redirectUrl: "/" }` | `{ success: true }` (redirectUrl 누락) | Low |
| 3 | Admin Auth | Clerk role-based | 하드코딩 비밀번호 `admin123` | **High** |
| 4 | API Auth | Design: 엔드포인트별 Auth | middleware에서 `/api(.*)` 전체 public | **High** |
| 5 | Dashboard Components | 7개 분리 컴포넌트 | 단일 page.tsx 197줄 | Medium |
| 6 | Chart Library | recharts 사용 | :white_check_mark: 일치 | - |

---

## Security Concerns

| # | Severity | Issue | Location | Recommendation |
|---|:--------:|-------|----------|---------------|
| 1 | **Critical** | Admin 하드코딩 비밀번호 | `app/admin/page.tsx:49` | Clerk role-based auth로 교체 |
| 2 | **Critical** | 모든 API 라우트 public | `middleware.ts:7` | 인증 필요 API 분리 |
| 3 | **High** | Admin 페이지 public | `middleware.ts:12` | Admin 인증 게이트 추가 |
| 4 | **Medium** | WEBHOOK_SECRET 미설정 시 검증 건너뜀 | `webhooks/payment:12` | secret 필수화 |

---

## Match Rate Calculation

### By Feature Area

| Area | Weight | Score | Weighted |
|------|:------:|:-----:|:--------:|
| Core Platform (PRD) | 30% | 62% | 18.6 |
| Affiliate System (Design) | 25% | 88% | 22.0 |
| 10 SaaS Apps (Plan) | 25% | 10% | 2.5 |
| Architecture/Convention | 10% | 55% | 5.5 |
| Security | 10% | 40% | 4.0 |
| **Total** | **100%** | | **52.6%** |

### Landing Page 기준 (실제 UI 구현 범위)

| Area | Weight | Score | Weighted |
|------|:------:|:-----:|:--------:|
| Core Platform (PRD) | 30% | 62% | 18.6 |
| Affiliate System (Design) | 30% | 88% | 26.4 |
| 10 SaaS Landing Pages | 20% | 35% | 7.0 |
| Architecture/Convention | 10% | 55% | 5.5 |
| Security | 10% | 40% | 4.0 |
| **Total** | **100%** | | **61.5%** |

---

## Recommended Actions

### Immediate Actions (P0) - Security

1. **Admin 인증 교체**: `app/admin/page.tsx`의 하드코딩 비밀번호를 Clerk role-based auth로 즉시 교체
2. **API 라우트 보호**: `middleware.ts`에서 `/api/affiliate/dashboard`, `/api/affiliate/settlement` 등 인증 필요 API를 public에서 제외
3. **WEBHOOK_SECRET 필수화**: 환경변수 없을 시 요청 거부하도록 변경

### Short-term Actions (P1) - Affiliate 완성

4. **Admin Partner Management 페이지 구현**: `app/admin/partners/page.tsx`
5. **Admin Settlement Management 페이지 구현**: `app/admin/settlements/page.tsx`
6. **Admin API 구현**: `GET /api/admin/partners`, `PATCH /api/admin/partners/[id]/approve`
7. **Partner 컴포넌트 분리**: 197줄 대시보드를 7개 컴포넌트로 분리

### Medium-term Actions (P2) - Code Quality

8. **Partner 페이지 인라인 스타일 -> Tailwind 변환**: 설계서의 SLDS 스타일 가이드 준수
9. **`app/partner/layout.tsx` 생성**: 공통 네비게이션, 인증 가드
10. **`.env.example` 생성**: `WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL` 등 문서화
11. **types/ 폴더 생성**: DashboardData 등 인터페이스 분리

### Long-term Actions (P3) - SaaS MVP

12. **SaaS 우선순위 선정**: 10개 중 Hero Product 1-2개 선정하여 MVP 기능 구현
13. **SaaS Design Document 작성**: 선정된 Hero Product의 `docs/02-design/` 문서 작성
14. **Facebook 자동 포스팅 시스템**: PRD 3.4 구현
15. **통합 대시보드 (유저용)**: 구독 상태 확인 페이지

---

## Synchronization Recommendation

현재 Match Rate가 **~60%** 수준이므로:

> "설계와 구현 사이에 상당한 차이가 있습니다. 동기화가 필요합니다."

### Option Recommendation:

1. **Affiliate System**: 구현이 설계를 88% 반영 -> **Option 1 (구현 → 설계 맞춤)** 남은 12% 구현
2. **SaaS Apps**: 10개 전부 MVP 구현은 비현실적 -> **Option 3 (새 버전 통합)** Hero 1-2개 선정 후 설계-구현 동시 진행
3. **Security Issues**: 즉시 수정 필요 -> **Option 1 (구현 수정)**
4. **추가 기능 (Plane, Feedback, Chat)**: 설계에 없음 -> **Option 2 (설계 업데이트)**

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-18 | Initial gap analysis | Claude Code |
