# [Plan] card-news

| 항목 | 내용 |
|------|------|
| **Feature** | card-news (AI 카드뉴스 자동 생성) |
| **작성일** | 2026-03-17 |
| **작성자** | Claude Code (Gagahoho, Inc.) |
| **Phase** | Plan |
| **우선순위** | P1 (SNS 자동화 확장) |
| **선행 기능** | sns-publishing (archived, 96% match) |

---

## 1. 배경 및 목적

### 1.1 배경
SocialDoctors의 SNS 자동화 시스템(Social Publishing Hub)은 현재 **텍스트 카피 + 이미지 URL 기반 포스팅**까지 구현 완료된 상태이다(sns-publishing, 96% match rate로 아카이브됨).

그러나 PRD 3.4절에서 정의된 **"카드뉴스 이미지 생성"** 기능은 sns-publishing.plan.md에서 **P2(후순위)**로 분류되어 아직 미구현 상태이다.

### 1.2 왜 카드뉴스인가?
- **한국 SNS 마케팅의 핵심 콘텐츠 포맷**: Facebook/Instagram에서 카드뉴스는 텍스트 대비 **3~5배 높은 도달률**
- **파트너 바이럴 효과**: 카드뉴스는 공유하기 좋은 포맷으로, 파트너 어필리에이트 시스템의 공유율 향상
- **Pulse Marketing 에이전트에 이미 구조 정의됨**: 9슬라이드 카드뉴스 구조가 BMad 워크플로우에 상세 정의
- **클라이언트 SNS 운영 자동화의 마지막 퍼즐**: 카피 → 이미지 → 발행 전 과정 자동화 완성

### 1.3 목적
- AI를 활용해 **주제 입력만으로 멀티 슬라이드 카드뉴스 이미지를 자동 생성**
- 생성된 카드뉴스를 기존 SNS Publishing Hub와 연동하여 **원클릭 발행**
- SocialDoctors 클라이언트(소상공인/농업인)가 **디자이너 없이도 전문적인 SNS 콘텐츠 제작 가능**

---

## 2. 핵심 기능 범위 (Scope)

### IN Scope

| # | 기능 | 설명 | 우선순위 |
|---|------|------|----------|
| 1 | **카드뉴스 템플릿 시스템** | 다양한 용도별 슬라이드 템플릿 제공 (서비스 소개, 교육 콘텐츠, 이벤트 등) | P0 |
| 2 | **AI 슬라이드 콘텐츠 생성** | 주제 입력 → Gemini AI가 슬라이드별 제목/본문/키포인트 자동 생성 | P0 |
| 3 | **이미지 렌더링 엔진** | HTML/CSS 기반 슬라이드를 이미지(PNG/JPEG)로 변환 | P0 |
| 4 | **카드뉴스 에디터 UI** | 슬라이드별 텍스트 편집, 색상/폰트 변경, 미리보기 | P0 |
| 5 | **SNS Publishing 연동** | 생성된 카드뉴스를 기존 발행 시스템에 연결 (멀티 이미지 포스팅) | P0 |
| 6 | **브랜드 가이드라인 적용** | 클라이언트별 로고, 색상, 폰트 자동 적용 | P1 |
| 7 | **AI 이미지 생성 (선택)** | Gemini Imagen / DALL-E로 배경/일러스트 생성 | P2 |
| 8 | **카드뉴스 히스토리** | 생성 이력 관리, 재사용/복제 기능 | P1 |

### OUT of Scope (이번 버전)
- 영상(Video) 카드뉴스 생성 (릴스/숏츠 포맷)
- 실시간 협업 편집 (Figma 스타일)
- 외부 디자인 툴 연동 (Canva API 등)
- 인쇄용 고해상도 출력 (300dpi+)

---

## 3. 사용자 스토리

### US-01: 운영자가 서비스 홍보 카드뉴스를 생성한다
```
운영자 → SocialDoctors 어드민 접속
→ "카드뉴스 만들기" 클릭
→ 주제 입력: "CertiGraph 자격증 AI 학습 플래너 소개"
→ 템플릿 선택: "서비스 소개 (9슬라이드)"
→ AI가 슬라이드별 콘텐츠 자동 생성
→ 에디터에서 텍스트/색상 미세 조정
→ "이미지 생성" → 9장의 PNG 이미지 다운로드
→ "SNS 발행" → 기존 채널에 멀티 이미지 포스팅
```

### US-02: 클라이언트 브랜드에 맞춘 카드뉴스
```
운영자 → 클라이언트 "타운인" 선택
→ 타운인 브랜드 색상(#FF6B35) + 로고 자동 적용
→ 지역 커뮤니티 이벤트 카드뉴스 생성
→ 타운인 FB 페이지에 자동 발행
```

### US-03: 파트너가 공유할 카드뉴스 생성
```
어드민 → "파트너 공유용" 템플릿 선택
→ 서비스 혜택 + 파트너 추천 코드 포함
→ 카드뉴스 이미지 생성
→ 파트너 대시보드에서 다운로드 링크 제공
→ 파트너가 자신의 SNS에 공유
```

---

## 4. 카드뉴스 슬라이드 구조

### 4.1 서비스 소개 템플릿 (9슬라이드)
BMad Pulse Marketing 에이전트 정의 기반:

| 슬라이드 | 역할 | 콘텐츠 예시 |
|----------|------|-------------|
| 1 | **Hook** | 질문 + 충격적인 통계 ("소상공인 70%가 SNS 마케팅에 어려움") |
| 2-3 | **Problem** | 고객 페인포인트 진단 (비즈니스 클리닉 컨셉) |
| 4-5 | **Solution** | 서비스 소개 + 핵심 기능 |
| 6-7 | **Feature** | 기능 상세 브레이크다운 |
| 8 | **Proof** | 성과/후기/데이터 |
| 9 | **CTA** | 행동 유도 + 특별 오퍼 + QR코드 |

### 4.2 교육 콘텐츠 템플릿 (5슬라이드)
| 슬라이드 | 역할 |
|----------|------|
| 1 | 주제 소개 + 훅 |
| 2-3 | 핵심 정보 (데이터/통계/팁) |
| 4 | 실행 가이드 (Step-by-step) |
| 5 | CTA + 브랜드 |

### 4.3 이벤트/프로모션 템플릿 (3슬라이드)
| 슬라이드 | 역할 |
|----------|------|
| 1 | 이벤트 타이틀 + 비주얼 |
| 2 | 혜택/조건 상세 |
| 3 | 참여 방법 + CTA |

---

## 5. 기술 요구사항

### 5.1 이미지 렌더링 방식 비교

| 방식 | 장점 | 단점 | 선택 |
|------|------|------|------|
| **HTML → Canvas → PNG (html2canvas/html-to-image)** | 클라이언트 사이드, 서버 부하 없음 | 폰트/CSS 제약, 크로스브라우저 이슈 | |
| **Puppeteer/Playwright (서버사이드)** | 정확한 렌더링, 폰트 완벽 지원 | 서버 리소스 필요, Vultr 8GB에서 가능 | |
| **Satori + @vercel/og (React → SVG → PNG)** | Vercel 최적화, React 컴포넌트 재사용 | 지원 CSS 제한적 | **추천** |
| **Sharp (이미지 합성)** | 이미 설치됨, 가벼움 | 복잡한 레이아웃 어려움 | 보조 |

**권장 조합**: **Satori + Sharp**
- Satori: React 컴포넌트 → SVG 변환 (Next.js와 자연스러운 통합)
- Sharp: SVG → PNG 변환 + 이미지 최적화 (이미 프로젝트에 설치됨)

### 5.2 AI 콘텐츠 생성
- **Gemini API** (기존 social-pulse에서 사용 중): 슬라이드별 텍스트 콘텐츠 생성
- **프롬프트 구조**: 주제 + 템플릿 타입 + 슬라이드 수 → 구조화된 JSON 응답
- **P2: Gemini Imagen / DALL-E**: 배경 이미지/일러스트 생성 (선택적)

### 5.3 신규 DB 스키마 (Prisma)

```prisma
model CardNews {
  id            String          @id @default(cuid())
  title         String          // 카드뉴스 제목
  templateType  CardTemplate    // SERVICE_INTRO | EDUCATION | EVENT | CUSTOM
  slideCount    Int             // 슬라이드 수
  brandColor    String?         // 브랜드 메인 컬러
  logoUrl       String?         // 브랜드 로고 URL
  status        CardNewsStatus  // DRAFT | GENERATING | COMPLETED | PUBLISHED
  createdBy     String          // 생성자 ID
  channelId     String?         // 발행할 SNS 채널 ID
  channel       SnsChannel?     @relation(fields: [channelId], references: [id])
  slides        CardSlide[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model CardSlide {
  id            String    @id @default(cuid())
  cardNewsId    String
  cardNews      CardNews  @relation(fields: [cardNewsId], references: [id], onDelete: Cascade)
  slideOrder    Int       // 슬라이드 순서 (1부터)
  role          String    // HOOK | PROBLEM | SOLUTION | FEATURE | PROOF | CTA
  headline      String    // 슬라이드 제목
  bodyText      String?   // 본문 텍스트
  keyPoints     String[]  // 핵심 포인트 (배열)
  imageUrl      String?   // 생성된 이미지 URL
  bgColor       String?   // 슬라이드 배경색
  createdAt     DateTime  @default(now())
}

enum CardTemplate {
  SERVICE_INTRO   // 서비스 소개 (9슬라이드)
  EDUCATION       // 교육 콘텐츠 (5슬라이드)
  EVENT           // 이벤트/프로모션 (3슬라이드)
  CUSTOM          // 커스텀
}

enum CardNewsStatus {
  DRAFT
  GENERATING
  COMPLETED
  PUBLISHED
}
```

### 5.4 신규 API 엔드포인트

```
POST /api/card-news                    ← 카드뉴스 생성 (AI 콘텐츠 생성)
GET  /api/card-news                    ← 카드뉴스 목록
GET  /api/card-news/[id]               ← 카드뉴스 상세 (슬라이드 포함)
PUT  /api/card-news/[id]               ← 카드뉴스 수정
DELETE /api/card-news/[id]             ← 카드뉴스 삭제

POST /api/card-news/[id]/generate      ← 슬라이드 이미지 렌더링 (Satori + Sharp)
POST /api/card-news/[id]/publish       ← SNS 발행 (기존 publish API 연동)

GET  /api/card-news/templates          ← 사용 가능한 템플릿 목록
```

### 5.5 프론트엔드 컴포넌트

```
frontend/app/admin/card-news/
├── page.tsx                    ← 카드뉴스 목록 (히스토리)
├── create/page.tsx             ← 카드뉴스 생성 워크플로우
├── [id]/page.tsx               ← 카드뉴스 상세/편집
└── [id]/preview/page.tsx       ← 미리보기

frontend/components/card-news/
├── TemplateSelector.tsx        ← 템플릿 선택 UI
├── SlideEditor.tsx             ← 개별 슬라이드 편집기
├── SlidePreview.tsx            ← 슬라이드 미리보기 (SLDS 스타일)
├── CardNewsTimeline.tsx        ← 슬라이드 순서 타임라인
├── BrandSettingsPanel.tsx      ← 브랜드 색상/로고 설정
└── SlideRenderer.tsx           ← Satori 기반 이미지 렌더링 컴포넌트
```

### 5.6 환경 변수 (추가 불필요)
- Gemini API: 기존 `GEMINI_API_KEY` 활용
- Sharp: 이미 설치됨 (package-lock.json 확인)
- Satori: 신규 설치 필요 (`satori`, `@resvg/resvg-js`)

---

## 6. 구현 단계 (Phases)

### Phase 1: 기반 구축 (1주차)
- [ ] Prisma 스키마 추가 (CardNews, CardSlide, enum)
- [ ] 기본 CRUD API 구현 (/api/card-news/*)
- [ ] 카드뉴스 목록/생성 어드민 페이지 (SLDS 스타일)
- [ ] 3개 기본 템플릿 데이터 구조 정의

### Phase 2: AI 콘텐츠 생성 (2주차)
- [ ] Gemini AI 프롬프트 설계 (템플릿별 슬라이드 콘텐츠 생성)
- [ ] 슬라이드 에디터 UI (텍스트 편집, 미리보기)
- [ ] 슬라이드 순서 드래그 앤 드롭

### Phase 3: 이미지 렌더링 (2주차)
- [ ] Satori + Sharp 기반 이미지 생성 API
- [ ] 슬라이드 템플릿 React 컴포넌트 (Satori 호환)
- [ ] 한글 웹폰트 처리 (Noto Sans KR)
- [ ] 이미지 다운로드 (개별/전체 ZIP)

### Phase 4: SNS 연동 + 브랜드 (3주차)
- [ ] 멀티 이미지 포스팅 API 연동 (기존 publish 확장)
- [ ] 클라이언트별 브랜드 설정 (색상, 로고)
- [ ] 카드뉴스 히스토리 및 복제 기능

### Phase 5: 고도화 (4주차+, 선택)
- [ ] AI 배경 이미지 생성 (Gemini Imagen)
- [ ] 추가 템플릿 (비교표, FAQ, 인포그래픽)
- [ ] 파트너 대시보드 카드뉴스 다운로드 연동

---

## 7. 디자인 원칙

### SLDS 스타일 준수
- 카드 기반 레이아웃, `border-gray-200` 최소 테두리
- 슬라이드 에디터는 3-Column: 좌(템플릿 목록) / 중앙(슬라이드 미리보기) / 우(속성 편집)
- 입력 필드: `border-gray-300`, `text-sm`, `py-2.5` (가독성 규칙 준수)
- Feather Icons 사용 (이모지 금지)

### 카드뉴스 이미지 사양
- 해상도: 1080x1080px (Instagram 정사각형 기준)
- 파일 형식: PNG (텍스트 선명도) / JPEG (사진 배경 시)
- 최대 파일 크기: 슬라이드당 1MB 이하
- 색상: sRGB 프로파일

---

## 8. 성공 지표

| 지표 | 목표값 |
|------|--------|
| 주제 입력 → 카드뉴스 생성 완료 | < 30초 |
| 이미지 렌더링 시간 (9슬라이드) | < 10초 |
| 카드뉴스 → SNS 발행 성공률 | > 95% |
| 사용자 편집 없이 바로 사용 가능한 품질 | > 70% |

---

## 9. 위험 요소

| 위험 | 영향도 | 대응 |
|------|--------|------|
| Satori 한글 폰트 렌더링 이슈 | 높음 | Noto Sans KR woff2 번들링, 폰트 서브셋 사전 테스트 |
| Vultr 서버 메모리 제약 (8GB) | 중간 | Satori는 경량(Puppeteer 대비), 동시 렌더링 제한 (3건) |
| AI 생성 콘텐츠 품질 불균일 | 중간 | 템플릿별 프롬프트 최적화, 에디터에서 수정 가능하게 |
| Facebook 멀티 이미지 API 제약 | 낮음 | 이미 sns-publishing에서 이미지 포스팅 구현됨, 확장만 필요 |

---

## 10. 참고 자료

- **PRD**: `prd.md` 3.4절 (소셜 자동화 - 카드뉴스 이미지 생성)
- **SNS Publishing Plan**: `docs/archive/2026-02/sns-publishing/sns-publishing.plan.md` (AI-03)
- **Pulse Marketing**: `.bmad/custom/src/agents/pulse-marketing/` (카드뉴스 구조/브랜드 가이드라인)
- **CertiGraph 전략**: `docs/01-plan/certigraph-socialdoctors-strategy.md` (Facebook 카드뉴스 전략)
- **Satori**: https://github.com/vercel/satori (React → SVG)
- **Sharp**: https://sharp.pixelplumbing.com (이미지 처리, 이미 설치됨)
