# [Analysis] affiliate-system

| 항목 | 내용 |
|------|------|
| **Feature** | affiliate-system |
| **분석일** | 2026-03-03 |
| **Phase** | Check (Gap Analysis) |
| **Match Rate** | 89% |

---

## 전체 매치율: 89%

| 카테고리 | 가중치 | 점수 |
|----------|:------:|:----:|
| API 스펙 (6개 엔드포인트) | 30% | 92% |
| 데이터 모델 (Prisma Schema) | 20% | 97% |
| 핵심 로직 (referral, webhook, 트랜잭션) | 15% | 95% |
| 페이지/UI (5개 페이지) | 15% | 85% |
| 파일 구조 (컴포넌트 분리) | 10% | 78% |
| 환경변수 | 10% | 70% |

---

## 누락 항목 (Design O, Implementation X)

| 항목 | 영향도 |
|------|:------:|
| `app/partner/layout.tsx` 파트너 전용 레이아웃 | 낮음 |
| `api/affiliate/commissions/route.ts` 별도 API (dashboard에 통합됨) | 낮음 |
| `components/partner/*` 7개 컴포넌트 분리 (page.tsx에 인라인) | 중간 |
| 대시보드 [공유] 버튼 | 낮음 |
| `.env.example` 미업데이트 (WEBHOOK_SECRET, NEXT_PUBLIC_BASE_URL) | 중간 |

## 의도적 변경 (조치 불필요)

| 항목 | Design | 구현 | 사유 |
|------|--------|------|------|
| 인증 시스템 | Clerk | NextAuth (Google OAuth) | 전체 프로젝트 전환 |
| Partner.clerkUserId | clerkUserId | userId | 인증 변경 |
| 클릭 추적 | 동기 await | fire-and-forget | 성능 개선 |
| 수수료 계산 | amount * 0.20 | Math.floor(amount * 0.20) | 소수점 방지 |

## 추가 구현 (Design X, Implementation O)

- 어드민 파트너 API (`/api/admin/partners`)
- 어드민 정산 API (`/api/admin/settlements`)
- 중복 신청/귀속 확인 로직
- PENDING/SUSPENDED 상태 배너
- 정산 거절 사유 기록

## 권장 조치

1. `.env.example` NextAuth 기반으로 업데이트
2. Design 문서를 현재 구현에 맞게 v2로 업데이트
3. (선택) dashboard 인라인 코드를 컴포넌트로 분리
