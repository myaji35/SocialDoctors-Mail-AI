# SocialDoctors 카드뉴스 API 연동 프롬프트

> 다른 프로젝트에서 SocialDoctors의 카드뉴스 생성/발행 API를 연동할 때 사용하는 프롬프트입니다.
> 대상 프로젝트의 Claude Code 세션에서 아래 프롬프트를 붙여넣어 사용하세요.

---

## 사용 방법

1. 연동할 프로젝트(예: 0025_CEO, InsureGraph, CertiGraph)의 Claude Code 세션을 엽니다
2. 아래 프롬프트를 복사하여 붙여넣습니다
3. `{프로젝트명}`, `{용도}` 등 플레이스홀더를 실제 값으로 교체합니다

---

## 프롬프트

```
이 프로젝트에 SocialDoctors 카드뉴스 API 연동 기능을 추가해줘.

## 배경
SocialDoctors(app.socialdoctors.kr)는 AI 카드뉴스 자동 생성 + SNS 발행 플랫폼이야.
이 프로젝트({프로젝트명})에서 SocialDoctors API를 호출하면 카드뉴스를 자동으로 만들고 SNS에 발행할 수 있어.

## 연동 대상 API

### Base URL
- 프로덕션: https://app.socialdoctors.kr
- 로컬 개발: http://localhost:3000

### 인증 방식
모든 API 요청에 아래 헤더를 포함해야 해:
- `X-Api-Key`: SocialDoctors에서 발급받은 API 키
- `X-Caller-App`: 이 프로젝트의 식별자 (예: "{프로젝트 슬러그}")

### 환경 변수 등록
.env 파일에 아래 2개를 추가해줘:
```env
SOCIALDOCTORS_API_URL=https://app.socialdoctors.kr
SOCIALDOCTORS_API_KEY={발급받은_API_키}
```

## 구현할 기능

### 1. API 클라이언트 (lib/socialdoctors-client.ts)
SocialDoctors API를 호출하는 클라이언트 모듈을 만들어줘:

```typescript
// 필수 함수:
createCardNews(topic, templateType, options?)  // 카드뉴스 생성 (AI 콘텐츠)
renderCardNews(cardNewsId)                      // 이미지 렌더링
publishCardNews(cardNewsId, channelOptions)     // SNS 발행
createAndPublish(topic, templateType, publishTo) // 원스텝 (생성→렌더링→발행)
getCardNews(cardNewsId)                         // 카드뉴스 상세 조회
getInsights(cardNewsId)                         // 발행 성과 조회
```

### 2. 사용 가능한 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/card-news | 카드뉴스 생성 (AI 콘텐츠 자동 생성) |
| GET | /api/card-news | 목록 조회 |
| GET | /api/card-news/{id} | 상세 조회 |
| PUT | /api/card-news/{id} | 수정 |
| DELETE | /api/card-news/{id} | 삭제 |
| POST | /api/card-news/{id}/render | 이미지 렌더링 |
| POST | /api/card-news/{id}/publish | SNS 발행 |
| POST | /api/card-news/{id}/render-and-publish | 원스텝 (렌더링+발행) |
| POST | /api/card-news/{id}/duplicate | 복제 |
| GET | /api/card-news/{id}/insights | 발행 성과 조회 |
| GET | /api/card-news/templates | 템플릿 목록 |

### 3. 핵심 요청/응답 스펙

#### 카드뉴스 생성 (POST /api/card-news)
```json
{
  "topic": "이 프로젝트 홍보 콘텐츠",
  "templateType": "SERVICE_INTRO",  // SERVICE_INTRO | EDUCATION | EVENT | CUSTOM
  "brandColor": "#FF6B35",          // 선택
  "logoUrl": "https://...",         // 선택
  "autoPublish": true,              // true면 생성→렌더링→발행 자동 처리
  "publishTo": {                    // autoPublish=true일 때
    "clientSlug": "townin",         // 또는 channelId
    "platform": "FACEBOOK"
  }
}
```

#### 원스텝 렌더링+발행 (POST /api/card-news/{id}/render-and-publish)
```json
{
  "clientSlug": "townin",
  "platform": "FACEBOOK",
  "caption": "커스텀 포스팅 본문 (선택)"
}
```

#### 성과 조회 (GET /api/card-news/{id}/insights)
```json
// 응답
{
  "reach": 2500,
  "impressions": 4200,
  "likes": 180,
  "shares": 45,
  "comments": 22,
  "clicks": 120,
  "engagement_rate": 4.7,
  "fetched_at": "2026-03-17T..."
}
```

### 4. 사전 정의 콘텐츠로 생성 (AI 생략)
AI 대신 직접 슬라이드 내용을 지정할 수도 있어:
```json
{
  "topic": "보험 약관 비교 결과",
  "templateType": "EDUCATION",
  "slides": [
    { "headline": "자동차보험 갱신 전 확인!", "bodyText": "보험료 20% 절약법", "keyPoints": ["비교 필수", "특약 점검"] },
    { "headline": "3가지 핵심 비교", "bodyText": "...", "keyPoints": [...] },
    ...
  ],
  "autoPublish": true,
  "publishTo": { "clientSlug": "insure-graph", "platform": "FACEBOOK" }
}
```

### 5. UI 연동 (선택)
{용도}에 맞게 아래 중 필요한 UI를 추가해줘:
- [ ] "카드뉴스 생성" 버튼 (특정 데이터를 기반으로 SocialDoctors API 호출)
- [ ] 생성된 카드뉴스 미리보기 (이미지 썸네일 표시)
- [ ] 발행 성과 대시보드 (Insights 데이터 시각화)
- [ ] 발행 이력 목록

## 연동 시나리오: {시나리오_설명}

{이 프로젝트에서 어떤 상황에 카드뉴스를 생성하고 발행할지 구체적으로 설명}

예시:
- "사용자가 분석 결과를 확인한 후 'SNS 공유' 버튼을 누르면 자동으로 카드뉴스 생성+발행"
- "매주 월요일 자동으로 주간 리포트 카드뉴스를 생성하여 Facebook에 발행"
- "새 제품 등록 시 자동으로 홍보 카드뉴스 생성"

## 기술 참고
- SocialDoctors는 Next.js 16 + Prisma + PostgreSQL 기반
- 인증: X-Api-Key 헤더 (환경변수 SOCIAL_PULSE_API_KEY와 매칭)
- 이미지: 1080x1080px PNG, SVG→Sharp 렌더링
- Facebook: 멀티 이미지 포스팅 (미게시 사진 → attached_media 일괄 게시)
- Mock 모드: 요청에 `mockMode: true` 추가하면 실제 SNS 발행 없이 테스트 가능
```

---

## 프로젝트별 사용 예시

### 0025_CEO 프로젝트
```
프로젝트명: 0025_CEO
프로젝트 슬러그: 0025_ceo
용도: 광고 캠페인 콘텐츠 자동 생성
시나리오: CEO 대시보드에서 "광고 콘텐츠 생성" 버튼 → 카드뉴스 자동 생성 → 타운인 FB 발행
```

### InsureGraph Pro 프로젝트
```
프로젝트명: InsureGraph Pro
프로젝트 슬러그: insure-graph
용도: 보험 분석 결과 SNS 공유
시나리오: 약관 비교 완료 후 "SNS 공유" → 분석 데이터를 사전 정의 슬라이드로 전달 → 자동 발행
```

### CertiGraph 프로젝트
```
프로젝트명: CertiGraph
프로젝트 슬러그: certi-graph
용도: 합격 축하 / 시험 정보 콘텐츠
시나리오: 모의시험 만점 이벤트 → 자동 트리거 → autoPublish로 전자동 발행
```

---

## 체크리스트

연동 완료 후 확인:
- [ ] `.env`에 `SOCIALDOCTORS_API_URL`, `SOCIALDOCTORS_API_KEY` 등록
- [ ] API 클라이언트 모듈 생성 (`lib/socialdoctors-client.ts`)
- [ ] Mock 모드로 테스트 (`mockMode: true`)
- [ ] 실제 발행 테스트 (테스트 채널 사용)
- [ ] 에러 핸들링 (401 Unauthorized, 404 Not Found 등)
- [ ] 발행 성과 조회 확인

---

> **문서 버전**: v1.0 (2026-03-17)
> **SocialDoctors API 버전**: card-news v1.1
> **관리자**: Gagahoho, Inc.
