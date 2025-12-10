# Product Requirements Document (PRD)
# Project: SocialDoctors Micro-SaaS Marketplace Platform

| 문서 정보 | 내용 |
| :--- | :--- |
| **프로젝트명** | SocialDoctors Platform Pivot |
| **버전** | v1.0 |
| **작성일** | 2025-12-10 |
| **작성자** | 강승식 (CEO) |
| **상태** | Draft (기획 단계) |

---

## 1. 개요 (Executive Summary)
### 1.1 배경 및 목적
* **배경:** 기존 의료 마케팅 도구로 사용되던 `SocialDoctors` 도메인을 10여 개의 자체 개발 SaaS를 통합하는 **마이크로 SaaS 마켓플레이스**로 피벗(Pivot).
* **목적:** 파편화된 SaaS 제품의 홍보 창구를 단일화하고, 중계인(Partner) 시스템을 도입하여 자발적인 바이럴 마케팅과 매출 증대를 유도함.
* **컨셉:** "Business Clinic" - 비즈니스/농업/생활의 문제를 진단하고 적합한 SaaS 솔루션을 처방하는 플랫폼.

### 1.2 핵심 전략 (Option A: Hero Strategy)
* **Hero Product:** 가장 경쟁력 있는 1~2개 킬러 서비스를 전면에 내세워 트래픽 유입.
* **Bento Grid:** 나머지 서비스는 모던한 그리드 형태로 노출하여 낙수 효과(Trickle-down) 유도.
* **Partner-First:** 단순 이용자가 아닌, 수익을 공유하는 '중계 파트너' 양성에 집중.

---

## 2. 타겟 오디언스 (Target Audience)
### 2.1 중계 파트너 (Primary)
* **페르소나:** 마케터, 인플루언서, 지역 거점 영업자 (예: 농자재상, 컨설턴트).
* **니즈:** 자신의 네트워크를 활용해 지속적인 부가 수익(Passive Income)을 창출하고 싶음.
* **핵심 기능:** 실시간 수익 확인, 간편한 홍보 링크 생성, 투명한 정산.

### 2.2 최종 사용자 (Secondary)
* **페르소나:** 소상공인, 농업인, 스타트업 대표 등 비효율을 해결하고 싶은 실사용자.
* **니즈:** 복잡한 설치 없이 바로 사용 가능한 직관적인 도구, 신뢰할 수 있는 플랫폼.

---

## 3. 핵심 기능 요구사항 (Functional Requirements)

### 3.1 통합 인증 및 계정 (Unified Auth / SSO)
* **One-ID 시스템:** SocialDoctors 계정 하나로 하위 10개 SaaS 서비스 자동 로그인 (SSO).
* **통합 대시보드:** 유저가 구독 중인 모든 서비스의 상태를 한눈에 파악.

### 3.2 랜딩 페이지 및 UI 구조 (Layout)
* **Hero Section (상단):**
    * 3D 인터랙티브 오브젝트 또는 고화질 루프 영상 배경.
    * 주력 SaaS의 핵심 가치 카피라이팅 및 즉시 시작 버튼(CTA).
* **Service Grid (중단):**
    * Apple/Linear 스타일의 **Bento Grid** 레이아웃 적용.
    * 각 SaaS 카드는 마우스 오버 시(Hover) 동적 효과 및 요약 스탯 표시.
* **AI Curator (우측 하단/플로팅):**
    * "어떤 도움이 필요하신가요?" 챗봇 인터페이스. 상황 입력 시 적합한 SaaS 추천.

### 3.3 파트너(중계) 시스템 (Affiliate System)
* **소개 코드(Referral Code) 생성:** 파트너 가입 시 고유 코드/링크 자동 생성.
* **추적 로직 (Attribution):**
    * 소개 링크로 유입 시 브라우저 쿠키/로컬 스토리지에 파트너 ID 저장 (유효기간: 30일~90일 설정).
    * 회원가입 시 `ReferredBy` 필드에 파트너 ID 영구 귀속.
* **수익 공유 (Revenue Share):**
    * 귀속된 회원이 10개 중 어떤 SaaS를 결제하더라도 설정된 %(예: 20%)를 파트너에게 적립.
    * 구독 갱신 시에도 지속 지급 (LTV 모델).
* **파트너 대시보드:**
    * 실시간 클릭 수, 가입자 수, 결제액, 정산 가능 금액 시각화 (Chart.js 등 활용).

### 3.4 소셜 자동화 (Facebook Integration)
* **Event Trigger:** 플랫폼 내 주요 활동 감지 (신규 파트너 가입, 대형 결제, 신규 서비스 런칭 등).
* **AI Content Gen:** 이벤트 발생 시 LLM(GPT)이 페이스북용 톤앤매너로 포스팅 문구 및 카드뉴스 이미지 생성.
* **Auto Posting:** Meta Graph API를 통해 연동된 페이스북 페이지에 자동 업로드.

---

## 4. 기술 아키텍처 (Technical Stack)

### 4.1 Frontend
* **Framework:** Next.js 14+ (App Router) - SEO 및 퍼포먼스 최적화.
* **Styling:** Tailwind CSS + Framer Motion (애니메이션/인터랙션).
* **UI Library:** Shadcn/ui (깔끔하고 모던한 컴포넌트).

### 4.2 Backend & Infrastructure
* **Server:** Node.js (NestJS) or Python (FastAPI) - 마이크로 서비스 아키텍처 고려.
* **Database:** PostgreSQL (회원/결제/파트너 데이터 관계형 처리).
* **Auth:** NextAuth.js or Keycloak (SSO 구현).
* **Deployment:** Vercel (FE) + AWS/Docker (BE).

### 4.3 Integration & API
* **Payment Gateway:** PG사 연동 및 웹훅(Webhook) 수신 서버 (개별 SaaS 결제 정보 수집용).
* **Social:** Meta Graph API (Facebook Page Publishing).
* **AI:** OpenAI API (콘텐츠 생성 및 큐레이션).

---

## 5. 데이터 모델링 (핵심 엔티티)

### User (통합 회원)
* `UUID`, `Email`, `Password`, `Role(User/Partner/Admin)`, `ReferredBy(PartnerUUID)`

### Partner_Wallet (지갑/정산)
* `PartnerUUID`, `CurrentBalance`, `TotalEarned`, `TierLevel`

### Transaction_Log (통합 결제 로그)
* `LogID`, `UserUUID`, `ServiceID(어떤 SaaS인가)`, `Amount`, `CommissionAmount`, `CreatedAt`

### Social_Post_Queue (포스팅 대기열)
* `PostID`, `Content`, `ImageURL`, `Status(Pending/Published/Failed)`, `TargetPlatform(FB)`

---

## 6. 마일스톤 및 로드맵

### Phase 1: 기반 구축 (Week 1-2)
* SocialDoctors 랜딩 페이지 디자인 (Hero + Bento Grid).
* 통합 DB 설계 및 SSO 인증 서버 구축.

### Phase 2: 파트너 시스템 (Week 3-4)
* 파트너 대시보드 개발.
* 소개 코드 생성 및 쿠키 트래킹 로직 구현.
* 결제 데이터 수집용 Webhook 리스너 개발.

### Phase 3: 자동화 및 연동 (Week 5-6)
* 페이스북 Graph API 연동 및 자동 포스팅 봇 개발.
* AI 큐레이터(챗봇) 간단 버전 탑재.

### Phase 4: 런칭 및 최적화 (Week 7~)
* 베타 오픈 및 파트너 모집.
* 트래픽 모니터링 및 UI/UX 개선.