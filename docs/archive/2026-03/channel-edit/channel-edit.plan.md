# Plan: Social Publishing Hub - 채널 수정/삭제 기능

## 개요

| 항목 | 내용 |
|------|------|
| Feature | `channel-edit` |
| 프로젝트 | 0017_SocialDoctors |
| 대상 페이지 | `/admin/social-pulse` |
| 현재 상태 | PATCH/DELETE API 존재, Admin UI 편집 폼/삭제 버튼 미구현 |
| 목표 | 채널 정보(이름, 토큰, 만료일) 수정 + 채널 삭제 기능을 Admin UI에 추가 |

## 현재 상태 분석

### 이미 구현된 것 (재활용 가능)

| 구분 | 파일 | 상태 |
|------|------|------|
| PATCH API | `app/api/social-pulse/channels/[id]/route.ts` | 존재 (channelName, accessToken, tokenExpiresAt, status 수정 가능) |
| DELETE API | `app/api/social-pulse/channels/[id]/route.ts` | 존재 |
| 채널 목록 조회 | `app/api/social-pulse/channels/route.ts` | 존재 |
| 채널 등록 모달 | `components/social-pulse/ChannelRegisterModal.tsx` | 4단계 위자드, PLATFORMS 상수/가이드 등 재활용 가능 |
| 상태 토글 | `admin/social-pulse/page.tsx` | handleToggleChannel로 ACTIVE/INACTIVE 전환 |

### 미구현 (GAP)

| 기능 | 설명 |
|------|------|
| 채널 편집 모달 | channelName, accessToken, tokenExpiresAt 수정 UI |
| 채널 삭제 버튼 | 확인 다이얼로그 포함 삭제 기능 |
| PATCH API Key 인증 | 현재 세션 인증만 지원 (외부 서비스에서 채널 수정 불가) |
| 채널 상세 정보 표시 | pageId, 토큰 만료일, metadata 등 현재 카드에 미표시 |

## 구현 범위

### 1. ChannelEditModal 컴포넌트 (신규)

**파일**: `components/social-pulse/ChannelEditModal.tsx`

**기능**:
- 선택된 채널의 현재 정보를 폼에 표시
- 수정 가능 필드:
  - `channelName` (채널 표시 이름)
  - `accessToken` (새 토큰으로 교체)
  - `tokenExpiresAt` (토큰 만료일)
- 읽기 전용 필드 (참고 표시):
  - `platform` (플랫폼)
  - `clientName` / `clientSlug` (브랜드)
  - `pageId` (페이지 ID)
  - `status` (상태)
  - `createdAt` (등록일)
- ChannelRegisterModal의 토큰 가이드(FacebookTokenGuide) 재활용
- PATCH `/api/social-pulse/channels/[id]` 호출

**UI 패턴**:
- ChannelRegisterModal과 동일한 모달 스타일 (rounded-2xl, shadow-2xl)
- 단일 폼 (위자드 불필요 - 이미 등록된 채널이므로)

### 2. 채널 삭제 기능

**위치**: ChannelEditModal 하단 또는 채널 카드 컨텍스트 메뉴

**기능**:
- "채널 삭제" 버튼 (빨간색, 하단 배치)
- 확인 다이얼로그: "'{channelName}' 채널을 삭제하시겠습니까? 이 채널의 발행 이력은 유지됩니다."
- DELETE `/api/social-pulse/channels/[id]` 호출

### 3. Admin 페이지 수정

**파일**: `app/admin/social-pulse/page.tsx`

**변경사항**:
- 채널 카드에 "편집" 버튼(연필 아이콘) 추가 (hover 시 표시)
- 클릭 시 ChannelEditModal 열기
- `editingChannel` 상태 추가
- ChannelEditModal import 및 렌더링

### 4. PATCH API에 resolveAuth 적용 (선택)

**파일**: `app/api/social-pulse/channels/[id]/route.ts`

**변경사항**:
- `getServerSession` → `resolveAuth` 교체
- 외부 서비스(0015 CertiGraph 등)에서도 채널 정보 수정 가능

## 수정 대상 파일

| 파일 | 작업 | 우선순위 |
|------|------|----------|
| `components/social-pulse/ChannelEditModal.tsx` | **신규**: 채널 편집 모달 | P0 |
| `app/admin/social-pulse/page.tsx` | **수정**: 편집 버튼 + 모달 연동 | P0 |
| `app/api/social-pulse/channels/[id]/route.ts` | **수정**: resolveAuth 적용 | P1 |

## UI 스케치

### 채널 카드 (수정 후)

```
┌─────────────────────────────────────────┐
│ [FB] CertiGraph 공식     [✏️] [⚡ ON]  │
│      CertiGraph                         │
└─────────────────────────────────────────┘
       │                        │
       │ hover 시 표시          │ 기존 토글
       ↓
   ChannelEditModal 열기
```

### ChannelEditModal

```
┌──────────────────────────────────────────┐
│  채널 정보 수정                    [X]   │
│──────────────────────────────────────────│
│                                          │
│  플랫폼: Facebook        (읽기 전용)     │
│  브랜드: CertiGraph      (읽기 전용)     │
│  페이지 ID: CERTIGRA...  (읽기 전용)     │
│  등록일: 2026-03-02      (읽기 전용)     │
│                                          │
│  ────────────────────────────────────    │
│                                          │
│  채널 표시 이름 *                         │
│  ┌──────────────────────────────────┐    │
│  │ CertiGraph 공식                   │    │
│  └──────────────────────────────────┘    │
│                                          │
│  액세스 토큰 (새 토큰으로 교체)           │
│  ┌──────────────────────────────────┐    │
│  │ ●●●●●●●●●●●●●●  [보기]          │    │
│  └──────────────────────────────────┘    │
│  🔒 입력 시 기존 토큰이 교체됩니다       │
│                                          │
│  토큰 만료일 (선택)                       │
│  ┌──────────────────────────────────┐    │
│  │ 2026-05-01                        │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌────────┐              ┌────────────┐  │
│  │  취소  │              │  저장하기   │  │
│  └────────┘              └────────────┘  │
│                                          │
│  ─── 위험 영역 ─────────────────────    │
│  [🗑️ 채널 삭제]                          │
│                                          │
└──────────────────────────────────────────┘
```

## 검증 방법

1. `/admin/social-pulse` 접속 → 채널 카드 hover → 편집 아이콘 표시 확인
2. 편집 아이콘 클릭 → ChannelEditModal 열림 확인
3. 채널명 수정 → 저장 → 목록에 반영 확인
4. 토큰 교체 → 저장 → DB에 새 암호화 토큰 저장 확인
5. 채널 삭제 → 확인 다이얼로그 → 삭제 → 목록에서 제거 확인
6. (선택) curl로 PATCH API Key 인증 테스트

## 의존성

- 없음 (기존 API 활용, 신규 패키지 불필요)

## 예상 작업량

- ChannelEditModal: ~150줄 (ChannelRegisterModal 패턴 재활용)
- Admin 페이지 수정: ~30줄
- API resolveAuth: ~5줄
- **총: ~185줄 추가/수정**
