# Partner Marketing Kit Workflow

**Goal:** Create comprehensive, customized marketing kit for partners/influencers with multiple format options and affiliate integration.

**Interaction Style:** Intent-based + Interactive

---

## Workflow Steps

### 1. Partner Profile Discovery

Understand the partner through conversation:

**Partner Information:**
- "Who is this kit for?" (Name, brand/channel name)
- "What platform do they primarily use?" (Instagram, YouTube, Blog, etc.)
- "What's their audience size and demographics?"
- "What's their content style?" (educational, entertaining, lifestyle, etc.)
- "Have we worked with them before?" *[check memories]*

**Partnership Details:**
- Partnership type (affiliate, collaboration, sponsorship)
- Specific services to promote (all 10 or selected)
- Commission structure (default 20% or custom)
- Campaign duration and goals

### 2. Load Partner Context

**Check Historical Data:**
- Load partner profile from `../knowledge/partners/` if exists
- Review past collaborations from memories
- Identify preferences and successful patterns

**If New Partner:**
- Create new profile entry
- Gather baseline preferences
- Set up tracking for future optimization

### 3. Define Kit Components

Collaboratively select kit elements:

**Content Formats:**
□ Social media posts (Instagram, Facebook, Twitter)
□ Stories/Reels scripts
□ Blog post outline or full draft
□ Email template
□ Banner images (various sizes)
□ Video script
□ Presentation deck

**Customization Level:**
- Basic (ready-to-use templates)
- Moderate (semi-customized with partner branding)
- Full (completely personalized to partner's voice)

### 4. Generate Social Media Content

Create platform-specific content:

#### Instagram Post
- Carousel post (6-10 slides) option
- Single image post option
- Caption (engaging hook + value prop + CTA)
- Hashtag strategy
- Affiliate link placement
- Partner-specific tone adaptation

#### Instagram Stories/Reels
- Story series (5-7 frames)
- Reels script with hook-content-CTA structure
- Text overlay suggestions
- Music/sound recommendations
- Swipe-up or link sticker copy

#### Facebook Post
- Longer-form storytelling option
- Personal experience angle
- Community engagement prompts
- Share-worthy value delivery

**For Each Format:**
- Adapt to partner's authentic voice
- Include clear disclosure (sponsored/affiliate)
- Embed trackable affiliate link
- Optimize for platform algorithm

### 5. Generate Extended Content

Based on selected formats:

#### Blog Post Template
- SEO-optimized title suggestions
- Article outline (intro, body, conclusion)
- Key talking points about SocialDoctors
- Personal experience integration points
- CTA sections with affiliate links
- Meta description and keywords

#### Email Template
- Subject line variations (3 options)
- Preview text
- Email body (HTML and plain text)
- Button CTAs with tracking links
- P.S. section for urgency/scarcity

#### Video Script
- Hook (first 3 seconds)
- Problem presentation
- SocialDoctors solution introduction
- Demo or walkthrough talking points
- Testimonial integration
- Clear verbal CTA with link mention

### 6. Create Visual Assets

Generate design briefs or assets:

**Banner Specs:**
- Instagram: 1080x1080, 1080x1920 (stories)
- Facebook: 1200x630
- YouTube thumbnail: 1280x720
- Blog header: 1200x600

**Design Elements:**
- Partner's branding colors/fonts
- SocialDoctors logo placement
- Key message headline
- Visual hierarchy
- CTA button design

**Asset Delivery:**
- Design brief for partner's designer
- Canva template links (if configured)
- Stock image suggestions
- Brand asset package

### 7. Affiliate Link Setup

Configure tracking and links:

**Generate Tracking Links:**
- Unique partner ID integration
- Campaign-specific parameters
- Short URL creation (bit.ly, etc.)
- QR code generation (optional)

**Link Placement Guide:**
- Where to place in each format
- How to disclose affiliate relationship
- Backup links if primary fails

**Tracking Instructions:**
- How partner can monitor performance
- Dashboard access (if applicable)
- Reporting schedule

### 8. Package & Present Kit

Organize all materials:

**Kit Structure:**
```
SocialDoctors_Partner_Kit_[PartnerName]_[Date]/
├── README.md (Usage instructions)
├── social-media/
│   ├── instagram-post.md
│   ├── instagram-stories.md
│   ├── facebook-post.md
│   └── twitter-thread.md
├── extended-content/
│   ├── blog-post-template.md
│   ├── email-template.html
│   └── video-script.md
├── visual-assets/
│   ├── design-briefs/
│   └── banner-specs.md
├── links-and-tracking/
│   ├── affiliate-links.md
│   └── disclosure-templates.md
└── brand-assets/
    ├── logo-package/
    └── brand-guidelines-summary.md
```

**Delivery Options:**
- Download as ZIP
- Share via Google Drive/Dropbox
- Email directly to partner
- Present in-app for review

### 9. Kit Customization Round

Review with user and refine:

**Feedback Prompts:**
- "Does this match the partner's voice?"
- "Any specific services to emphasize more?"
- "Should we adjust the tone anywhere?"
- "Are the CTAs clear and compelling?"

**Iterative Refinement:**
- Adjust based on feedback
- A/B test variations if requested
- Add or remove components

### 10. Usage Guidance & Support

Provide implementation support:

**Instructions for Partner:**
- Step-by-step posting guide
- Best practices for each platform
- Optimal posting times
- Engagement tips

**Templates Customization:**
- How to personalize while staying on-brand
- What NOT to change (brand safety)
- Where to insert personal stories

**Performance Expectations:**
- Realistic engagement estimates
- Commission earning projections
- Success metrics to track

### 11. Record & Track

Update knowledge base:

**Save to** `../knowledge/partners/[partner-name].md`:
- Partner profile and preferences
- Kit contents delivered
- Customization choices
- Delivery date and method

**Update memories.md:**
- Partnership context
- User feedback on kit
- Any special requirements noted

**Set Follow-up:**
- Schedule performance check-in
- Plan for kit updates if needed
- Track for future optimization

---

## Example Conversation Flow

**Agent:** "파트너 마케팅 키트를 만들어드리겠습니다! 먼저 파트너에 대해 알려주세요. 어떤 플랫폼에서 주로 활동하시나요?"

**User:** "인스타그램 인플루언서, 팔로워 10만명, 라이프스타일/비즈니스 콘텐츠"

**Agent:** *[checks memories for existing profile]*

"새로운 파트너시군요! 인스타그램 중심의 키트를 만들겠습니다. 어떤 콘텐츠 포맷이 필요하신가요?
- 인스타그램 포스트 (피드)
- 스토리즈/릴스 스크립트
- 블로그 포스트 템플릿
- 이메일 템플릿
- 배너 이미지

원하시는 것을 선택해주세요."

**User:** "인스타그램 포스트, 스토리즈, 블로그 포스트"

**Agent:** "좋습니다! 이 파트너의 톤은 어떤 스타일인가요? (전문적, 친근함, 재미있는, 영감을 주는)"

**User:** "친근하고 영감을 주는 스타일"

**Agent:** *[generates customized content]*

"파트너의 스타일에 맞춘 콘텐츠를 생성했습니다.
1. 인스타그램 포스트 (3가지 버전)
2. 스토리즈 시리즈 (7개 프레임)
3. 블로그 포스트 아웃라인

각 콘텐츠에 제휴 링크와 공개 문구가 포함되어 있습니다. 검토해주시겠어요?"

---

## Technical Implementation Notes

### Required Integrations:
- OpenAI API for content generation
- Link shortener API (bit.ly, TinyURL)
- QR code generator
- File packaging/ZIP creation
- (Optional) Canva API for design templates

### Partner Data Management:
- Store partner profiles in `knowledge/partners/`
- Track performance history in memories
- Update preferences based on feedback

### Customization Engine:
- Analyze partner's past content (if provided)
- Adapt AI generation to match voice
- Learn successful patterns per partner

---

**Workflow Complete:** Comprehensive partner marketing kit delivered and ready for deployment.
