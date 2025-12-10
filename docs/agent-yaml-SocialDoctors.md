# Complete Agent YAML - Pulse Marketing Agent

**Created:** 2025-12-10
**Agent Type:** Expert Agent
**Status:** ✅ Complete and Ready

---

## Agent Type

**Expert Agent** - Personal knowledge base with persistent memory

---

## Agent Directory Structure

```
.bmad/custom/src/agents/pulse-marketing/
├── pulse-marketing.agent.yaml          # Main agent configuration
└── pulse-marketing-sidecar/            # Supporting files
    ├── memories.md                     # Persistent campaign history
    ├── instructions.md                 # Private marketing protocols
    ├── knowledge/                      # Domain-specific resources
    │   ├── README.md
    │   ├── brand-guidelines.md         # SocialDoctors brand guide
    │   ├── services/
    │   │   └── _template.md            # Template for 10 services
    │   ├── partners/
    │   │   └── _template.md            # Partner profile template
    │   └── personas/
    │       └── _template.md            # Customer persona template
    └── workflows/
        ├── create-post.md              # Facebook post generation
        ├── partner-kit.md              # Partner marketing kit creation
        ├── service-promo.md            # Service promotion content
        └── calendar.md                 # Content calendar planning
```

---

## Generated Configuration

### File Location

**Main YAML:** `.bmad/custom/src/agents/pulse-marketing/pulse-marketing.agent.yaml`

### YAML Summary

```yaml
agent:
  metadata:
    name: 'Pulse'
    title: 'SaaS 마켓플레이스 홍보 전문가 + 파트너 콘텐츠 큐레이터'
    icon: '🎯'
    type: 'expert'

  persona:
    role: 'SaaS 마켓플레이스 홍보 전문가 + 파트너 콘텐츠 큐레이터'

    identity: |
      7년간 디지털 마케팅 분야에서 50개 이상의 SaaS 제품 론칭을 주도했으며,
      소셜 미디어 자동화와 파트너 생태계 구축을 전문으로 합니다.

    communication_style: |
      전문적이면서도 친근한 마케팅 컨설턴트처럼 실행 가능한 조언을 명확하게 제공

    principles:
      - 모든 콘텐츠는 타겟 고객에게 진정한 가치를 제공해야 한다
      - 브랜드 일관성은 신뢰를 구축하는 핵심이다
      - 데이터 기반 의사결정이 추측보다 우선한다
      - 파트너 성공이 곧 플랫폼의 성공이다
      - 자동화는 효율성을 위한 것이지 품질을 희생하기 위한 것이 아니다

  critical_actions:
    - Load memories and campaign history
    - Load private marketing protocols
    - Load brand guidelines before content generation
    - Domain-restricted to sidecar folder only
    - Track performance patterns
    - Reference past successful campaigns

  menu:
    - create-post: Facebook 포스트 생성
    - partner-kit: 파트너 마케팅 키트 생성
    - service-promo: 서비스 홍보 콘텐츠 생성
    - calendar: 콘텐츠 캘린더 계획
    - learn-brand: 브랜드 학습
    - analyze: 성과 분석
    - remember: 세션 저장
    - recall: 히스토리 회상
```

---

## Key Features Integrated

### ✅ Purpose and Role
- **From Discovery Phase:** SocialDoctors 마켓플레이스 홍보 자동화
- **Role Defined:** SaaS 마켓플레이스 홍보 전문가 + 파트너 콘텐츠 큐레이터
- **Core Functions:** Facebook 자동 포스팅, 파트너 키트, 콘텐츠 생성, 브랜드 학습

### ✅ Complete Persona (Four-Field System)
- **Role:** Professional title capturing expertise
- **Identity:** 7 years experience, 50+ SaaS launches
- **Communication Style:** Professional yet friendly consultant
- **Principles:** 5 core beliefs guiding decisions

### ✅ All Capabilities and Commands
1. **create-post** - Facebook post generation workflow
2. **partner-kit** - Customized partner marketing kits
3. **service-promo** - "비즈니스 클리닉" service promotion
4. **calendar** - Strategic content calendar planning
5. **learn-brand** - Brand guidelines learning
6. **analyze** - Performance analysis with memory
7. **remember** - Session insights storage
8. **recall** - Campaign history retrieval

### ✅ Agent Name and Identity
- **Name:** Pulse (펄스)
- **Icon:** 🎯 (Target precision)
- **Filename:** pulse-marketing
- **Rationale:** Represents brand's living pulse and market responsiveness

### ✅ Expert Agent Type-Specific Optimizations
- **Sidecar Files:** memories.md, instructions.md, knowledge base
- **Critical Actions:** Load memories, brand guidelines, domain restrictions
- **Persistent Learning:** Track patterns, refine over time
- **Knowledge Base:** Organized structure for services, partners, personas
- **Workflows:** 4 comprehensive intent-based workflows

---

## Implementation Highlights

### Expert Agent Architecture

**Why Expert Agent:**
- Needs persistent memory across sessions
- Must learn and adapt from campaign performance
- Requires personal knowledge base (brand, services, partners)
- Domain-restricted for security and focus
- Long-term relationship with continuous improvement

**Sidecar Implementation:**
- ✅ memories.md for campaign history
- ✅ instructions.md for private protocols
- ✅ brand-guidelines.md for brand consistency
- ✅ Structured knowledge folders (services, partners, personas)
- ✅ 4 comprehensive workflows (create-post, partner-kit, service-promo, calendar)

### Facebook Integration
- **Page ID:** 417103501672818
- **Configured:** Via install_config
- **Ready For:** Meta Graph API integration when credentials provided

### Workflow System
All workflows follow **intent-based + interactive** pattern:
- Natural conversation flow
- Contextual adaptation
- Load brand knowledge automatically
- Reference past performance
- Generate multiple options
- Iterate based on feedback

### Knowledge Management
- **Templates Provided:** For services, partners, personas
- **Scalable:** Add 10+ services as they're defined
- **Learning:** Updates based on campaign results
- **Cross-Reference:** Intelligent recommendations across knowledge base

---

## Output Configuration

### Installation Path
`.bmad/custom/src/agents/pulse-marketing/`

### Sidecar Path
`.bmad/custom/src/agents/pulse-marketing/pulse-marketing-sidecar/`

### Memory Management
- Campaign history persists in memories.md
- Brand learning accumulates in knowledge base
- Partner preferences tracked per profile
- Performance patterns guide future content

---

## Next Steps

### 1. Installation
```bash
# Agent is ready at this location:
cd .bmad/custom/src/agents/pulse-marketing/

# Install the agent (when BMAD installer available)
bmad agent-install
```

### 2. Initial Setup
- Customize brand-guidelines.md with SocialDoctors specifics
- Add first service file to services/ folder
- Create primary target persona in personas/
- (Optional) Configure Facebook API credentials

### 3. First Use
- Invoke agent: `/pulse` or `*`
- Try `learn-brand` to input brand information
- Create first post with `create-post`
- Agent will remember everything for next time

### 4. Ongoing Optimization
- After each campaign, use `remember` to save insights
- Regularly update service information as features evolve
- Add partner profiles as partnerships develop
- Review and refine brand guidelines quarterly

---

## Technical Requirements

### Required for Full Functionality:
- [ ] Facebook Page Access Token (for auto-posting)
- [ ] OpenAI API Key (for AI content generation)
- [ ] (Optional) Canva API (for design automation)

### Integration Points:
- Meta Graph API (Facebook posting)
- OpenAI API (content generation)
- Link shortener API (partner tracking)
- Image generation (DALL-E or Canva)

---

## Validation Checklist

- [x] Valid YAML syntax
- [x] Metadata includes `type: "expert"`
- [x] critical_actions loads sidecar files explicitly
- [x] critical_actions enforces domain restrictions
- [x] Sidecar folder structure created and populated
- [x] memories.md has clear section structure
- [x] instructions.md contains core directives
- [x] Menu actions reference workflows correctly
- [x] All 4 workflow files created with detailed steps
- [x] Knowledge base templates provided
- [x] Install config includes Facebook Page ID
- [x] Agent folder named consistently: `pulse-marketing/`
- [x] YAML file named: `pulse-marketing.agent.yaml`
- [x] Sidecar folder named: `pulse-marketing-sidecar/`
- [x] All discovered elements from previous steps integrated
- [x] Four-field persona system properly implemented
- [x] Brand "비즈니스 클리닉" concept embedded throughout

---

## Journey Summary

**What We Created Together:**

1. **Purpose Discovery** - Identified need for SocialDoctors marketplace promotion automation
2. **Persona Development** - Crafted professional yet friendly marketing consultant personality
3. **Capability Design** - Built 8 comprehensive commands with workflows
4. **Identity Establishment** - Named "Pulse" with meaningful rationale
5. **YAML Building** - Generated complete expert agent with full infrastructure

**From Idea to Reality:**
- Started with concept of "마이크로 SaaS 홍보"
- Discovered specific needs (Facebook posting, partner kits)
- Shaped personality aligned with brand
- Built comprehensive system with learning capabilities
- Created complete, production-ready agent

---

## Support & Documentation

**Agent Documentation:**
- Main README: `pulse-marketing-sidecar/knowledge/README.md`
- Brand Guidelines: `pulse-marketing-sidecar/knowledge/brand-guidelines.md`
- Instructions: `pulse-marketing-sidecar/instructions.md`

**Templates for Adding Content:**
- Service: `knowledge/services/_template.md`
- Partner: `knowledge/partners/_template.md`
- Persona: `knowledge/personas/_template.md`

**Workflows:**
- All workflows in `workflows/` folder
- Each workflow has detailed step-by-step instructions
- Intent-based + interactive design

---

**Status: ✅ COMPLETE**

The Pulse Marketing Agent is fully built and ready for installation!
