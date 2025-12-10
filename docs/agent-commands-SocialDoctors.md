# Agent Commands and Capabilities

**Agent Name:** SocialDoctors Marketing Agent
**Created:** 2025-12-10
**Agent Type:** Expert Agent

## Core Capabilities Identified

Based on purpose discovery and user requirements, this agent provides:

1. **Facebook 자동 포스팅** - AI 기반 소셜 미디어 콘텐츠 생성 및 게시
2. **파트너 마케팅 자료** - 인플루언서/제휴사용 맞춤형 홍보 키트
3. **서비스별 프로모션** - 10개 SaaS 서비스의 타겟별 콘텐츠
4. **콘텐츠 전략 관리** - 캘린더, 캠페인 계획, 성과 추적
5. **브랜드 학습 및 최적화** - 가이드라인 준수 및 패턴 학습
6. **메모리 및 인사이트** - 세션 간 지식 축적 및 활용

## Command Structure

### Primary Commands

#### 1. create-post
**Trigger:** `create-post`, `포스트`, `post`
**Description:** Facebook 포스트 생성 (카피라이팅 + 해시태그 + 이미지 제안)
**Action:** Workflow reference (intent-based + interactive)
**Implementation:**
- 사용자 의도 파악 (프로모션 목적, 타겟 고객)
- 브랜드 가이드라인 로드 (sidecar/knowledge/brand-guidelines.md)
- AI 기반 카피 생성 (OpenAI API)
- 해시태그 최적화 (#SocialDoctors, #비즈니스클리닉 등)
- 카드뉴스 레이아웃 제안
- Facebook Page ID: 417103501672818 사용
- 게시 옵션 제공 (즉시/예약)

#### 2. partner-kit
**Trigger:** `partner-kit`, `파트너키트`, `kit`
**Description:** 파트너/인플루언서용 맞춤 마케팅 키트 생성
**Action:** Workflow reference (intent-based + interactive)
**Implementation:**
- 파트너 정보 수집 (채널 유형, 팔로워, 선호 스타일)
- 파트너 프로필 로드 (sidecar/knowledge/partners/)
- 제휴 링크 생성 (파트너 ID 포함)
- 다양한 포맷 생성:
  - SNS 포스트 (Instagram/Facebook)
  - 스토리/릴스 텍스트
  - 이메일 템플릿
  - 배너 이미지 사양
- 파트너별 커스터마이징 (과거 선호도 반영)
- 마케팅 키트 패키징 및 전달

#### 3. service-promo
**Trigger:** `service-promo`, `서비스홍보`, `promo`
**Description:** 특정 SaaS 서비스 홍보 콘텐츠 생성
**Action:** Workflow reference (intent-based + interactive)
**Implementation:**
- 10개 서비스 중 선택
- 서비스 정보 로드 (sidecar/knowledge/services/)
- 타겟 고객 페르소나 선택
- "비즈니스 클리닉" 컨셉 적용 (문제 진단 → 솔루션 처방)
- 다양한 콘텐츠 변형 생성 (A/B 테스트용)
- Hero Product 전략 고려
- 결과물: 포스트 3~5개 변형

#### 4. calendar
**Trigger:** `calendar`, `캘린더`, `plan`
**Description:** 주간/월간 콘텐츠 캘린더 생성
**Action:** Workflow reference (intent-based + interactive)
**Implementation:**
- 기간 설정 (주간/월간)
- 캠페인 목표 설정
- 콘텐츠 믹스 계획:
  - 서비스 프로모션 (40%)
  - 브랜드 스토리 (30%)
  - 파트너 협업 (20%)
  - 고객 후기/성공 사례 (10%)
- 최적 게시 시간 제안
- 콘텐츠 초안 생성
- 캘린더 문서 출력 (Markdown/CSV)

#### 5. learn-brand
**Trigger:** `learn-brand`, `브랜드학습`, `learn`
**Description:** 브랜드 가이드라인 및 성공 패턴 학습
**Action:** Direct action - Update sidecar knowledge files
**Implementation:**
- 대화형으로 브랜드 정보 수집:
  - 톤앤매너 (전문적? 친근한? 열정적?)
  - 핵심 메시지 및 가치
  - 비주얼 가이드라인 (컬러, 로고 사용)
  - 금지 표현 및 주의사항
- 성공한 콘텐츠 분석 및 패턴 추출
- sidecar/knowledge/brand-guidelines.md 업데이트
- 학습 내용을 memories.md에 기록
- 향후 콘텐츠 생성 시 자동 적용

#### 6. analyze
**Trigger:** `analyze`, `분석`, `performance`
**Description:** 과거 콘텐츠 성과 회상 및 개선 제안
**Action:** Prompt reference with memory recall
**Implementation:**
- memories.md에서 과거 캠페인 로드
- 성공 콘텐츠 vs 저조 콘텐츠 비교
- 패턴 분석:
  - 어떤 메시지가 효과적?
  - 어떤 시간대가 좋은가?
  - 어떤 포맷이 인기?
- 개선 제안 제공
- 트렌드 인사이트 (최근 3개월)

### Memory Management Commands (Expert Agent Specific)

#### 7. remember
**Trigger:** `remember`, `기억`, `save`
**Description:** 오늘 세션의 인사이트 저장
**Action:** Update ./sidecar/memories.md with session insights
**Implementation:**
- 현재 세션 요약
- 생성한 콘텐츠 기록
- 사용자 피드백 및 선호도
- 새로운 학습 내용
- 날짜별로 구조화하여 저장

#### 8. recall
**Trigger:** `recall`, `회상`, `history`
**Description:** 과거 캠페인 및 콘텐츠 히스토리 회상
**Action:** Load and present memories.md contents
**Implementation:**
- 특정 기간 또는 주제로 필터링
- 관련 캠페인 히스토리 제시
- 파트너별 과거 협업 내용
- 서비스별 홍보 히스토리
- 시간순 또는 주제별로 정리하여 제시

## Workflow Integration Plan

### New Workflows to Create

All workflows will follow **intent-based + interactive** pattern:

1. **create-post.workflow.md**
   - Location: `.bmad-user-memory/socialdoctors-marketing/workflows/`
   - Intent-based conversation flow
   - Interactive prompts for user input
   - Integration with brand knowledge
   - Facebook API posting capability

2. **partner-kit.workflow.md**
   - Location: `.bmad-user-memory/socialdoctors-marketing/workflows/`
   - Partner profiling and customization
   - Multi-format content generation
   - Affiliate link management

3. **service-promo.workflow.md**
   - Location: `.bmad-user-memory/socialdoctors-marketing/workflows/`
   - Service selection and targeting
   - "비즈니스 클리닉" narrative framework
   - A/B variant generation

4. **calendar.workflow.md**
   - Location: `.bmad-user-memory/socialdoctors-marketing/workflows/`
   - Strategic planning conversation
   - Content mix optimization
   - Schedule generation

### Data Flow

**Input Sources:**
- User intent and requirements (conversational)
- Sidecar knowledge base (brand, services, partners)
- Memories (past campaigns, learnings)
- Facebook Page ID: 417103501672818

**Output Destinations:**
- Facebook Page (via Meta Graph API)
- Sidecar memories.md (session tracking)
- Project output folder (content drafts)
- Partner delivery (email/file)

## Advanced Features

### 1. Context-Aware Content Generation
- Load full brand guidelines before generating
- Reference past successful content patterns
- Adapt tone based on learned preferences
- Maintain consistency across campaigns

### 2. Learning and Adaptation
- Track which content performs well
- Learn partner preferences over time
- Identify trending topics in target market
- Refine messaging based on feedback

### 3. Multi-Service Intelligence
- Understand relationships between 10 SaaS services
- Recommend service combinations
- Cross-promote strategically
- Apply "Hero Product" strategy

### 4. Partner Ecosystem Management
- Track partner performance and preferences
- Personalize kits based on channel type
- Maintain partner relationship history
- Optimize commission messaging

### 5. Error Handling
- Validate Facebook API credentials
- Handle rate limits gracefully
- Provide fallback content options
- Warn about brand guideline violations

## Implementation Notes

### Architecture-Specific Considerations

**Expert Agent Requirements:**

1. **Sidecar Structure:**
   ```
   socialdoctors-marketing-sidecar/
   ├── memories.md              # Campaign history, learnings
   ├── instructions.md          # Private directives
   ├── knowledge/
   │   ├── brand-guidelines.md  # Brand voice, visual identity
   │   ├── services/
   │   │   ├── service-01.md    # Each of 10 SaaS services
   │   │   └── ...
   │   ├── partners/
   │   │   └── partner-profiles.md  # Partner preferences
   │   └── personas/
   │       └── target-audiences.md  # Customer personas
   └── workflows/
       ├── create-post.workflow.md
       ├── partner-kit.workflow.md
       ├── service-promo.workflow.md
       └── calendar.workflow.md
   ```

2. **Critical Actions:**
   - Load memories.md on activation
   - Load instructions.md for protocols
   - Restrict access to sidecar folder only
   - Load brand-guidelines.md before content generation
   - Reference Facebook Page ID from knowledge base

3. **Integration Points:**
   - OpenAI API for content generation
   - Meta Graph API for Facebook posting
   - Image generation (DALL-E or Canva API)
   - Affiliate link generator

4. **Privacy & Security:**
   - Store Facebook access tokens securely
   - Domain-restrict to sidecar folder
   - Encrypt sensitive partner data
   - Follow GDPR compliance for user data

### Technical Requirements

- **API Credentials Needed:**
  - Facebook Page Access Token
  - OpenAI API Key
  - (Optional) Canva API for design automation

- **Dependencies:**
  - Facebook Graph API SDK
  - OpenAI Python/Node SDK
  - Markdown parser for knowledge files
  - Image processing library

- **Performance Considerations:**
  - Cache brand guidelines in session
  - Batch API calls when possible
  - Async content generation for speed

---

**Next Step:** Agent Naming - Choose a memorable name and finalize identity
