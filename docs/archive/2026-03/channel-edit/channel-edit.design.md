# channel-edit Design Document

> **Summary**: Social Publishing Hub 채널 수정/삭제 기능 — Admin UI에 ChannelEditModal 추가
>
> **Project**: 0017_SocialDoctors
> **Version**: MVP
> **Author**: Claude Opus 4.6
> **Date**: 2026-03-02
> **Status**: Draft
> **Planning Doc**: [channel-edit.plan.md](../../01-plan/features/channel-edit.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. 기존 PATCH/DELETE API를 활용하여 Admin UI에서 채널 수정/삭제 기능 완성
2. ChannelRegisterModal의 UI 패턴(모달 스타일, 가이드 컴포넌트)을 최대한 재활용
3. 외부 서비스(0015 CertiGraph 등)에서도 채널 수정 가능하도록 API 인증 확장

### 1.2 Design Principles

- **재활용 우선**: ChannelRegisterModal의 FacebookTokenGuide, PLATFORMS 상수를 import하여 사용
- **단일 모달 패턴**: 위자드가 아닌 단일 폼 (이미 등록된 채널이므로 단계별 진행 불필요)
- **위험 영역 분리**: 삭제 기능은 모달 하단에 별도 섹션으로 분리하여 실수 방지

---

## 2. Architecture

### 2.1 Component Diagram

```
Admin Social Pulse Page
├── 좌측 패널: 채널 목록
│   ├── 채널 카드 [편집 아이콘] [토글]
│   │        ↓ 클릭
│   └── ChannelEditModal (신규)
│        ├── 읽기 전용 정보 (플랫폼, 브랜드, pageId, 등록일)
│        ├── 편집 폼 (channelName, accessToken, tokenExpiresAt)
│        ├── FacebookTokenGuide (재활용)
│        └── 위험 영역: 채널 삭제
│             └── 확인 다이얼로그
├── 우측 패널: 포스트 목록
└── ChannelRegisterModal (기존)
```

### 2.2 Data Flow

```
[편집 아이콘 클릭]
  → setEditingChannel(channel)
  → ChannelEditModal 열림

[저장하기 클릭]
  → PATCH /api/social-pulse/channels/[id]
  → Body: { channelName?, accessToken?, tokenExpiresAt? }
  → 성공: onSuccess() → loadChannels() → 토스트 메시지
  → 실패: 모달 내 에러 메시지

[채널 삭제 클릭]
  → 확인 다이얼로그
  → DELETE /api/social-pulse/channels/[id]
  → 성공: onSuccess() → loadChannels() → 토스트 메시지
  → 실패: 모달 내 에러 메시지
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| ChannelEditModal | PLATFORMS (ChannelRegisterModal) | 플랫폼 아이콘/라벨 재활용 |
| ChannelEditModal | FacebookTokenGuide (ChannelRegisterModal) | 토큰 발급 가이드 재활용 |
| ChannelEditModal | PATCH/DELETE API | 채널 수정/삭제 호출 |
| Admin Page | ChannelEditModal | 편집 모달 렌더링 |
| PATCH API | resolveAuth (lib/api-auth.ts) | 이중 인증 지원 |

---

## 3. Data Model

### 3.1 기존 SnsChannel (변경 없음)

```typescript
// Prisma schema — 이미 존재, 수정 불필요
model SnsChannel {
  id              String    @id @default(cuid())
  clientName      String
  clientSlug      String
  platform        String    // FACEBOOK | INSTAGRAM | THREADS | TIKTOK | X | YOUTUBE
  channelName     String
  pageId          String
  accessToken     String    // AES-256 암호화
  tokenExpiresAt  DateTime?
  status          String    @default("ACTIVE") // ACTIVE | INACTIVE
  metadata        Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 3.2 ChannelEditModal에서 사용할 인터페이스

```typescript
// 이미 admin/social-pulse/page.tsx에 정의된 SnsChannel interface 재활용
interface SnsChannel {
  id: string;
  clientName: string;
  clientSlug: string;
  platform: string;
  channelName: string;
  pageId: string;
  status: string;
  tokenExpiresAt: string | null;
  createdAt: string;
}

// ChannelEditModal Props
interface ChannelEditModalProps {
  channel: SnsChannel;
  onClose: () => void;
  onSuccess: () => void;
}
```

---

## 4. API Specification

### 4.1 사용할 기존 API

| Method | Path | Description | Auth | 변경사항 |
|--------|------|-------------|------|----------|
| PATCH | `/api/social-pulse/channels/[id]` | 채널 정보 수정 | Session + **API Key 추가** | resolveAuth 적용 |
| DELETE | `/api/social-pulse/channels/[id]` | 채널 삭제 | Session + **API Key 추가** | resolveAuth 적용 |

### 4.2 PATCH 상세

**Request:**
```json
{
  "channelName": "CertiGraph 공식 (수정)",  // optional
  "accessToken": "EAAnewtoken...",           // optional, 입력 시 기존 토큰 교체
  "tokenExpiresAt": "2026-05-01"             // optional
}
```

**Response (200 OK):**
```json
{
  "channel": {
    "id": "clxxx...",
    "clientName": "CertiGraph",
    "clientSlug": "certigraph",
    "platform": "FACEBOOK",
    "channelName": "CertiGraph 공식 (수정)",
    "pageId": "12345...",
    "status": "ACTIVE",
    "tokenExpiresAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-03-02T10:00:00.000Z"
  },
  "message": "채널이 업데이트되었습니다."
}
```

### 4.3 DELETE 상세

**Response (200 OK):**
```json
{
  "success": true,
  "message": "채널이 삭제되었습니다."
}
```

### 4.4 API 인증 변경 (resolveAuth 적용)

**현재**: `getServerSession(authOptions)` — 세션 인증만
**변경**: `resolveAuth(request)` — 세션 + X-Api-Key 이중 인증

```typescript
// 변경 전
const session = await getServerSession(authOptions);
if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

// 변경 후
const auth = await resolveAuth(request);
if (auth.type === 'unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

---

## 5. UI/UX Design

### 5.1 채널 카드 (수정 후)

```
┌──────────────────────────────────────────────────┐
│  [FB]  CertiGraph 공식       [✏️]  [━━ ON]      │
│  w-9   text-sm               hover   토글        │
│        CertiGraph                                │
│        text-xs                                   │
└──────────────────────────────────────────────────┘
          │
          │ ✏️ 클릭 시
          ↓
    editingChannel = channel
    → ChannelEditModal 열림
```

**편집 아이콘 동작**:
- 기본: `opacity-0` (숨김)
- 채널 카드 `group-hover`: `opacity-100`
- 아이콘: Feather 스타일 연필 SVG (stroke: currentColor, 2px)
- 크기: `w-4 h-4`
- 위치: 채널명 오른쪽, 토글 왼쪽

### 5.2 ChannelEditModal 레이아웃

```
┌──────────────────────────────────────────────┐
│  채널 정보 수정                         [X]  │
│─────────────────────────────────────────────│
│                                              │
│  ┌─ 읽기 전용 정보 ──────────────────────┐  │
│  │ 플랫폼    [FB] Facebook               │  │
│  │ 브랜드    CertiGraph                  │  │
│  │ 페이지 ID CERTIGRAPH...0001           │  │
│  │ 등록일    2026-03-02                  │  │
│  │ 상태      🟢 활성                     │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ─── 편집 가능 필드 ────────────────────     │
│                                              │
│  채널 표시 이름 *                             │
│  ┌──────────────────────────────────────┐   │
│  │ CertiGraph 공식                      │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  액세스 토큰 (새 토큰으로 교체)              │
│  ┌──────────────────────────────────────┐   │
│  │                            [보기]    │   │
│  └──────────────────────────────────────┘   │
│  🔒 비워두면 기존 토큰이 유지됩니다         │
│                                              │
│  [📖 토큰 발급 가이드 보기]  ← 접이식        │
│                                              │
│  토큰 만료일 (선택)                          │
│  ┌──────────────────────────────────────┐   │
│  │ 2026-05-01                           │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌─────────┐              ┌──────────────┐  │
│  │  취소   │              │   저장하기    │  │
│  └─────────┘              └──────────────┘  │
│                                              │
│  ─── 위험 영역 ─────────────────────────    │
│  [🗑 이 채널 삭제]                           │
│                                              │
└──────────────────────────────────────────────┘
```

### 5.3 삭제 확인 다이얼로그

```
┌──────────────────────────────────────────┐
│  ⚠️  채널 삭제                           │
│                                          │
│  'CertiGraph 공식' 채널을 삭제합니다.    │
│  이 채널의 발행 이력은 유지됩니다.       │
│                                          │
│  ┌──────────┐     ┌───────────────────┐ │
│  │   취소   │     │   삭제하기 🗑     │ │
│  └──────────┘     └───────────────────┘ │
│                    (빨간색 배경)          │
└──────────────────────────────────────────┘
```

### 5.4 User Flow

```
채널 카드 hover → 편집 아이콘 표시
  → 클릭 → ChannelEditModal 열림
    → (수정 경로) 필드 수정 → 저장 → 성공 토스트 → 목록 새로고침
    → (삭제 경로) 하단 삭제 클릭 → 확인 다이얼로그 → 삭제 → 목록 새로고침
    → (취소) 취소 또는 X → 모달 닫기
```

### 5.5 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `ChannelEditModal` | `components/social-pulse/ChannelEditModal.tsx` | 채널 편집/삭제 모달 (신규) |
| `SocialPulsePage` | `app/admin/social-pulse/page.tsx` | 편집 상태 관리, 모달 연동 (수정) |
| `PLATFORMS` | `ChannelRegisterModal.tsx` → export | 플랫폼 상수 (export 추가) |
| `FacebookTokenGuide` | `ChannelRegisterModal.tsx` → export | 토큰 가이드 (export 추가) |

---

## 6. Error Handling

### 6.1 에러 시나리오

| 시나리오 | 에러 코드 | 사용자 메시지 | 처리 |
|---------|----------|-------------|------|
| 인증 실패 | 401 | "인증이 필요합니다" | 로그인 페이지로 리다이렉트 |
| 채널 미발견 | 404 | "채널을 찾을 수 없습니다" | 모달 닫기 + 목록 새로고침 |
| 입력 오류 | 400 | "채널 이름은 필수입니다" | 모달 내 인라인 에러 표시 |
| 서버 오류 | 500 | "저장에 실패했습니다. 다시 시도해 주세요" | 모달 내 에러 표시 |
| 네트워크 오류 | - | "네트워크 오류가 발생했습니다" | 모달 내 에러 표시 |

### 6.2 에러 표시 위치

- **저장 에러**: 저장 버튼 위에 빨간색 알림 박스
- **삭제 에러**: 토스트 메시지 (모달이 닫힌 상태일 수 있음)

---

## 7. Security Considerations

- [x] 토큰 데이터는 서버에서 AES-256 암호화 (`encryptToken`) — 기존 로직 유지
- [x] 토큰 입력 필드에 `WebkitTextSecurity: 'disc'` 적용 (마스킹)
- [x] resolveAuth 적용으로 API Key 인증 시에도 유효한 키만 허용
- [x] DELETE 전 확인 다이얼로그 필수 (실수 방지)
- [ ] 비어있는 accessToken은 PATCH 시 무시 (기존 토큰 유지) — **기존 API 동작과 일치**

---

## 8. Implementation Guide

### 8.1 File Structure

```
frontend/
├── components/social-pulse/
│   ├── ChannelRegisterModal.tsx   ← 수정: PLATFORMS, FacebookTokenGuide export 추가
│   └── ChannelEditModal.tsx       ← 신규: 채널 편집/삭제 모달
├── app/admin/social-pulse/
│   └── page.tsx                   ← 수정: editingChannel 상태 + 모달 연동
└── app/api/social-pulse/channels/[id]/
    └── route.ts                   ← 수정: resolveAuth 적용
```

### 8.2 Implementation Order

1. [ ] **ChannelRegisterModal export 추가**: `PLATFORMS`, `FacebookTokenGuide`를 named export
2. [ ] **ChannelEditModal 신규 생성**: 편집 폼 + 삭제 기능
3. [ ] **Admin 페이지 수정**: `editingChannel` 상태, 편집 아이콘, ChannelEditModal 렌더
4. [ ] **API resolveAuth 적용**: PATCH/DELETE에 `resolveAuth` 교체
5. [ ] **검증**: 수정 → 저장 → 목록 반영, 삭제 → 확인 → 목록 제거

### 8.3 ChannelEditModal 핵심 코드 스펙

```typescript
// Props
interface ChannelEditModalProps {
  channel: SnsChannel;
  onClose: () => void;
  onSuccess: () => void;
}

// State
const [form, setForm] = useState({
  channelName: channel.channelName,
  accessToken: '',                    // 비워두면 기존 유지
  tokenExpiresAt: channel.tokenExpiresAt?.split('T')[0] ?? '',
});
const [showToken, setShowToken] = useState(false);
const [showTokenGuide, setShowTokenGuide] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [loading, setLoading] = useState(false);
const [deleting, setDeleting] = useState(false);
const [error, setError] = useState('');

// 저장 핸들러
const handleSave = async () => {
  const body: Record<string, unknown> = {};
  if (form.channelName !== channel.channelName) body.channelName = form.channelName;
  if (form.accessToken) body.accessToken = form.accessToken;
  if (form.tokenExpiresAt) body.tokenExpiresAt = form.tokenExpiresAt;

  // 변경사항 없으면 바로 닫기
  if (Object.keys(body).length === 0) { onClose(); return; }

  await fetch(`/api/social-pulse/channels/${channel.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

// 삭제 핸들러
const handleDelete = async () => {
  await fetch(`/api/social-pulse/channels/${channel.id}`, { method: 'DELETE' });
};
```

### 8.4 Admin 페이지 변경 스펙

```typescript
// 추가할 상태
const [editingChannel, setEditingChannel] = useState<SnsChannel | null>(null);

// 채널 카드 내부 — 편집 아이콘 추가 위치
<div key={channel.id} className="flex items-center gap-3 group py-1">
  {/* ... 기존 아이콘 + 채널명 ... */}

  {/* 편집 아이콘 (신규) */}
  <button
    onClick={() => setEditingChannel(channel)}
    className="opacity-0 group-hover:opacity-100 w-6 h-6 ..."
    title="채널 편집"
  >
    <svg>...</svg> {/* Feather edit icon */}
  </button>

  {/* 기존 토글 */}
  <button onClick={() => handleToggleChannel(channel)}>...</button>
</div>

// 모달 렌더링 — 기존 ChannelRegisterModal 옆에 추가
{editingChannel && (
  <ChannelEditModal
    channel={editingChannel}
    onClose={() => setEditingChannel(null)}
    onSuccess={() => {
      loadChannels();
      showToast('채널 정보가 수정되었습니다.');
    }}
  />
)}
```

---

## 9. Styling Convention

| 요소 | 클래스 | 참고 |
|------|--------|------|
| 모달 오버레이 | `fixed inset-0 bg-black/50 z-50` | ChannelRegisterModal과 동일 |
| 모달 컨테이너 | `bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto` | 동일 |
| 입력 필드 | `w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500` | 동일 |
| 주 버튼 | `bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl` | 동일 |
| 삭제 버튼 | `text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium` | 위험 영역 |
| 삭제 확인 버튼 | `bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl` | 확인 다이얼로그 |
| 읽기 전용 필드 | `bg-gray-50 rounded-xl border p-4 text-sm` | ChannelRegisterModal Step4 패턴 |

---

## 10. Estimated Size

| 파일 | 작업 | 예상 줄수 |
|------|------|----------|
| `ChannelRegisterModal.tsx` | 수정: 2개 export 추가 | ~4줄 |
| `ChannelEditModal.tsx` | 신규 생성 | ~180줄 |
| `admin/social-pulse/page.tsx` | 수정: 편집 상태 + 아이콘 + 모달 | ~25줄 |
| `channels/[id]/route.ts` | 수정: resolveAuth 적용 | ~10줄 |
| **총계** | | **~220줄** |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-02 | Initial design document | Claude Opus 4.6 |
