# [Plan] affiliate-system

| 항목 | 내용 |
|------|------|
| **Feature** | affiliate-system |
| **작성일** | 2026-02-18 |
| **작성자** | Claude Code (Gagahoho, Inc.) |
| **Phase** | Plan |
| **우선순위** | P0 (핵심 수익 모델) |

---

## 1. 배경 및 목적

### 1.1 배경
SocialDoctors PRD에서 정의된 핵심 수익 모델인 **파트너 어필리에이트 시스템**은 현재 미구현 상태.
랜딩 페이지(MVP)는 배포되어 있으나, 실제 파트너가 수익을 창출하고 추적할 수 있는 시스템이 없음.

### 1.2 목적
- 파트너(마케터/인플루언서/영업자)가 소개 링크를 통해 유저를 유입시키고
- 유입된 유저의 **모든 SaaS 결제에 대해 자동으로 수수료(20%)를 적립**
- 파트너가 실시간으로 수익을 확인하고 정산 신청할 수 있는 시스템 구축

---

## 2. 핵심 기능 범위 (Scope)

### IN Scope

| # | 기능 | 설명 |
|---|------|------|
| 1 | **소개 링크 생성** | 파트너 고유 referral code/URL 자동 생성 |
| 2 | **쿠키 트래킹** | 소개 링크 클릭 시 파트너 ID를 쿠키에 저장 (30일) |
| 3 | **Attribution 귀속** | 회원가입 시 ReferredBy 필드에 파트너 ID 영구 귀속 |
| 4 | **수수료 계산** | 결제 발생 시 자동으로 20% 수수료 계산 및 적립 |
| 5 | **파트너 대시보드** | 클릭/가입/결제/수익 실시간 시각화 |
| 6 | **파트너 지갑** | 적립금 잔액 관리 및 정산 신청 기능 |
| 7 | **어드민 관리** | 파트너 승인/관리, 정산 처리 어드민 페이지 |
| 8 | **Webhook 수신** | 외부 SaaS 결제 이벤트 수신 및 수수료 처리 |

### OUT of Scope (이번 버전)
- 실제 PG 연동 (정산 출금) — 수동 정산으로 대체
- Facebook 자동 포스팅
- 다단계(MLM) 구조
- 티어별 수수료 차등 (고정 20%로 시작)

---

## 3. 사용자 스토리

### 파트너 관점
```
AS A 파트너(마케터/인플루언서)
I WANT TO 내 소개 링크를 통해 가입한 사람들의 결제로 수익을 얻고 싶다
SO THAT 내 네트워크를 활용한 Passive Income을 창출할 수 있다
```

- 파트너로 가입하면 고유 소개 코드(예: `SD-ABC123`)와 링크를 받는다
- 내 링크로 가입한 유저가 어떤 SaaS든 결제하면 20%가 내 지갑에 쌓인다
- 대시보드에서 클릭 수, 가입자 수, 결제액, 수익을 실시간으로 확인한다
- 일정 금액 이상 쌓이면 정산 신청을 할 수 있다

### 최종 유저 관점
```
AS A 최종 유저
I WANT TO 지인의 추천으로 SocialDoctors를 사용하고 싶다
SO THAT 신뢰할 수 있는 소개를 통해 서비스를 알게 되었으므로
```

- 파트너 링크 클릭 시 30일간 쿠키 유지
- 회원가입 시 자동으로 파트너와 연결됨 (투명하게 고지)

### 어드민 관점
```
AS A 어드민(강승식 CEO)
I WANT TO 파트너 활동과 수수료를 한눈에 관리하고 싶다
SO THAT 수익 배분과 정산을 효율적으로 처리할 수 있다
```

---

## 4. 데이터 모델 계획

### 신규 테이블

```prisma
// 파트너 정보
model Partner {
  id            String   @id @default(cuid())
  userId        String   @unique  // Clerk User ID
  referralCode  String   @unique  // 소개 코드 (SD-XXXXXX)
  name          String
  email         String
  phone         String?
  status        PartnerStatus @default(PENDING)  // PENDING/ACTIVE/SUSPENDED
  tier          PartnerTier   @default(BASIC)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  wallet        PartnerWallet?
  referrals     User[]         @relation("ReferredBy")
  clicks        ReferralClick[]
}

// 파트너 지갑
model PartnerWallet {
  id             String   @id @default(cuid())
  partnerId      String   @unique
  partner        Partner  @relation(fields: [partnerId], references: [id])
  currentBalance Float    @default(0)
  totalEarned    Float    @default(0)
  pendingAmount  Float    @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  transactions   CommissionTransaction[]
  settlements    Settlement[]
}

// 수수료 거래 내역
model CommissionTransaction {
  id             String   @id @default(cuid())
  walletId       String
  wallet         PartnerWallet @relation(...)
  referredUserId String   // 결제한 유저
  serviceId      String   // 어떤 SaaS
  paymentAmount  Float    // 결제 금액
  commissionRate Float    @default(0.20)  // 20%
  commissionAmount Float  // 수수료 금액
  status         CommissionStatus @default(PENDING)
  createdAt      DateTime @default(now())
}

// 클릭 추적
model ReferralClick {
  id          String   @id @default(cuid())
  partnerId   String
  partner     Partner  @relation(...)
  ipAddress   String?
  userAgent   String?
  converted   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

// User 모델에 추가 필드
model User {
  // 기존 필드...
  referredById  String?   // 파트너 ID
  referredBy    Partner?  @relation("ReferredBy", fields: [referredById], references: [id])
}
```

---

## 5. API 엔드포인트 계획

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/affiliate/register` | 파트너 신청 |
| `GET` | `/api/affiliate/dashboard` | 대시보드 데이터 |
| `GET` | `/api/affiliate/link` | 소개 링크 조회 |
| `GET` | `/api/affiliate/clicks` | 클릭 내역 |
| `GET` | `/api/affiliate/commissions` | 수수료 내역 |
| `POST` | `/api/affiliate/settlement` | 정산 신청 |
| `POST` | `/api/referral/track` | 클릭 추적 (공개) |
| `POST` | `/api/webhooks/payment` | 결제 Webhook 수신 |
| `GET` | `/api/admin/partners` | 파트너 목록 (어드민) |
| `PATCH` | `/api/admin/partners/[id]/approve` | 파트너 승인 (어드민) |

---

## 6. 페이지 구조 계획

```
frontend/app/
├── partner/
│   ├── page.tsx              ← 파트너 신청 랜딩
│   ├── dashboard/
│   │   └── page.tsx          ← 파트너 대시보드
│   ├── register/
│   │   └── page.tsx          ← 파트너 가입 폼
│   └── [code]/
│       └── page.tsx          ← 소개 링크 랜딩 (트래킹용)
├── admin/
│   ├── partners/
│   │   └── page.tsx          ← 파트너 관리 (기존 admin 확장)
│   └── settlements/
│       └── page.tsx          ← 정산 관리
└── api/
    ├── affiliate/
    │   ├── register/route.ts
    │   ├── dashboard/route.ts
    │   ├── link/route.ts
    │   ├── commissions/route.ts
    │   └── settlement/route.ts
    ├── referral/
    │   └── track/route.ts
    └── webhooks/
        └── payment/route.ts
```

---

## 7. 기술적 고려사항

### 쿠키 트래킹
- `ref` 쿠키: 파트너 referralCode 저장 (30일 만료)
- GDPR 준수: 개인정보 최소 수집, 투명한 고지
- middleware.ts에서 소개 링크(`/partner/[code]`) 처리

### 보안
- Webhook: HMAC 서명 검증으로 위조 방지
- 수수료 계산: 서버사이드에서만 처리 (클라이언트 조작 불가)
- 어드민 API: Clerk role-based 접근 제어

### 데이터베이스
- 기존 Prisma 스키마에 신규 테이블 추가
- PostgreSQL 트랜잭션으로 수수료 적립 원자성 보장

---

## 8. 마일스톤

| Phase | 기간 | 내용 |
|-------|------|------|
| **Phase 1** | 1일 | DB 스키마 + 기본 파트너 가입/쿠키 트래킹 |
| **Phase 2** | 1일 | 수수료 계산 로직 + Webhook 리스너 |
| **Phase 3** | 1일 | 파트너 대시보드 UI |
| **Phase 4** | 0.5일 | 어드민 파트너 관리 + 정산 |
| **Phase 5** | 0.5일 | 테스트 및 통합 검증 |

**총 예상 기간: 4일**

---

## 9. 성공 지표 (KPI)

- 파트너 가입 → 소개 링크 생성 → 클릭 추적 → 회원가입 귀속 → 수수료 적립 전체 플로우 동작
- 어드민에서 파트너 현황 실시간 확인 가능
- 클릭~가입 전환율 측정 가능
