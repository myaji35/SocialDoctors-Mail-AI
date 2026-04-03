# SocialDoctors 홍보대행 연동 가이드

## 개요
SocialDoctors의 홍보대행 API를 외부 프로젝트에서 사용하기 위한 가이드입니다.
SDK 파일 하나만 복사하면 어떤 Next.js/Node.js 프로젝트에서든 즉시 연동됩니다.

---

## 1. 연동 준비 (5분)

### Step 1: API 키 발급
SocialDoctors 관리자에게 `SOCIAL_PULSE_API_KEY`를 발급받습니다.

### Step 2: SDK 파일 복사
`frontend/lib/sdk/socialdoctors-sdk.ts` 파일을 프로젝트에 복사합니다.

### Step 3: 환경변수 설정
```env
SOCIAL_PULSE_API_URL=https://app.socialdoctors.kr
SOCIAL_PULSE_API_KEY=발급받은_API_키
CALLER_APP=프로젝트_식별자     # 예: 0008_choi-pd, 0012_insuregraph
CLIENT_NAME=프로젝트_이름      # 예: 최PD, InsureGraph
CLIENT_SLUG=프로젝트_슬러그    # 예: choi-pd, insuregraph (URL-safe)
```

### Step 4: SDK 초기화
```typescript
import { SocialDoctorsSDK } from '@/lib/socialdoctors-sdk';

const sdk = new SocialDoctorsSDK({
  apiKey: process.env.SOCIAL_PULSE_API_KEY!,
  callerApp: '프로젝트_식별자',
  clientName: '프로젝트_이름',
  clientSlug: '프로젝트_슬러그',
  baseUrl: process.env.SOCIAL_PULSE_API_URL,
});
```

---

## 2. 사용 예시

### 홍보 캠페인 의뢰
```typescript
// 캠페인 생성
const { campaign } = await sdk.createCampaign({
  title: '신규 서비스 런칭 홍보',
  description: 'Facebook + Instagram 동시 발행',
  type: 'FULL_PACKAGE',
  platforms: ['FACEBOOK', 'INSTAGRAM'],
  budget: 100000,
});

// 캠페인 실행
await sdk.executeCampaign(campaign.id, {
  content: '새로운 서비스가 출시되었습니다!',
  topic: '서비스 런칭',
});

// 결과 확인
const report = await sdk.getCampaignReport(campaign.id);
```

### SNS 직접 발행
```typescript
const result = await sdk.publish({
  platform: 'FACEBOOK',
  content: '오늘의 마케팅 포스트입니다.',
  imageUrl: 'https://example.com/image.jpg',
});
```

### AI 카피 생성
```typescript
const { copy } = await sdk.generateCopy(
  '스마트폰 창업 강좌 3기 모집',
  'INSTAGRAM'
);
```

### AI 카드뉴스 생성 + 자동 발행
```typescript
const result = await sdk.createCardNews({
  topic: '신제품 출시 안내',
  templateType: 'SERVICE_INTRO',
  brandColor: '#2563EB',
  slideCount: 5,
  autoPublish: true,
  publishTo: { platform: 'FACEBOOK' },
});
```

---

## 3. 연동 프로젝트 목록

| 프로젝트 | callerApp | clientSlug | 상태 |
|---------|-----------|------------|------|
| IMPD (최PD) | 0008_choi-pd | choi-pd | 시범 연동 |
| InsureGraph Pro | 0012_insuregraph | insuregraph | 예정 |
| Townin | 0014_townin | townin | 예정 |
| ExamsGraph | 0015_examsgraph | examsgraph | 예정 |
| CEO | 0025_ceo | ceo | 기존 연동 |

---

## 4. Claude Code 연동 프롬프트 템플릿

다른 프로젝트에서 SocialDoctors 홍보대행을 연동할 때 아래 프롬프트를 사용하세요:

```
SocialDoctors 홍보대행 API를 이 프로젝트에 연동해줘.

SDK 파일: /Volumes/E_SSD/02_GitHub.nosync/0017_SocialDoctors /frontend/lib/sdk/socialdoctors-sdk.ts

연동 가이드: /Volumes/E_SSD/02_GitHub.nosync/0017_SocialDoctors /docs/sdk-integration-guide.md

설정:
- callerApp: {프로젝트_번호}_{프로젝트_이름}
- clientName: {한국어_이름}
- clientSlug: {url-safe-슬러그}

필요한 기능:
1. SDK 파일 복사 → lib/socialdoctors-sdk.ts
2. 환경변수 추가 (.env)
3. SNS 발행 API 라우트 생성 (프록시)
4. 캠페인 관리 API 라우트 생성 (프록시)
5. 발행 상태 조회 기능
```

---

## 5. API 레퍼런스

### 인증
모든 요청에 아래 헤더 필수:
```
X-Api-Key: {SOCIAL_PULSE_API_KEY}
X-Caller-App: {callerApp}
```

### 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/campaigns | 캠페인 의뢰 생성 |
| GET | /api/campaigns | 캠페인 목록 조회 |
| GET | /api/campaigns/:id | 캠페인 상세 |
| PATCH | /api/campaigns/:id | 캠페인 상태 변경 |
| POST | /api/campaigns/:id/execute | 캠페인 실행 |
| GET | /api/campaigns/:id/report | 캠페인 리포트 |
| GET | /api/campaigns/stats | 전체 통계 |
| POST | /api/social-pulse/publish | SNS 발행 |
| GET | /api/social-pulse/publish/status | 발행 상태 |
| POST | /api/social-pulse/generate-copy | AI 카피 생성 |
| GET | /api/social-pulse/channels | 채널 목록 |
| POST | /api/card-news | 카드뉴스 생성 |

---

## 6. 채널 등록 절차

외부 프로젝트에서 실제 SNS 발행을 하려면 SocialDoctors Admin에서 채널을 등록해야 합니다:

1. SocialDoctors Admin → Social Pulse → 채널 관리
2. "채널 추가" 클릭
3. clientSlug: 프로젝트 슬러그 입력
4. 플랫폼 선택 (Facebook/Instagram/X 등)
5. 해당 플랫폼의 Page ID + Access Token 입력
6. 저장

또는 API로 등록:
```bash
curl -X POST https://app.socialdoctors.kr/api/social-pulse/channels \
  -H "X-Api-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "프로젝트이름",
    "clientSlug": "project-slug",
    "platform": "FACEBOOK",
    "channelName": "페이지명",
    "pageId": "facebook-page-id",
    "accessToken": "facebook-access-token"
  }'
```
