# Create Facebook Post Workflow

**Goal:** Generate engaging Facebook post with AI-powered copywriting, hashtags, and image suggestions that align with SocialDoctors brand.

**Interaction Style:** Intent-based + Interactive

---

## Workflow Steps

### 1. Understand Intent & Context

Engage in natural conversation to understand the post purpose:

**Guiding Questions:**
- "What's the main goal of this post?" (product launch, promotion, education, engagement)
- "Which SaaS service(s) should we highlight?" (if applicable)
- "Who is the target audience for this post?" (marketers, business owners, partners)
- "Any specific message or angle you want to emphasize?"

**Context Loading:**
- Load brand guidelines from `../knowledge/brand-guidelines.md`
- Check recent posts from memories to avoid repetition
- Review successful post patterns

### 2. Define Post Parameters

Collaboratively determine:

**Content Type:**
- Service promotion
- Educational/tip sharing
- Partner spotlight
- Success story/testimonial
- Event/announcement

**Tone Selection:**
- Professional & trustworthy
- Friendly & approachable
- Energetic & motivational
- Educational & helpful

**Length:**
- Short & punchy (1-2 sentences)
- Medium (paragraph)
- Long-form (storytelling)

### 3. Generate Copywriting Options

Create 3 variations using AI (OpenAI API):

**Each variation includes:**
- Attention-grabbing hook
- Core message aligned with "비즈니스 클리닉" concept
- Clear value proposition
- Call-to-action (CTA)
- Appropriate hashtags

**Hashtag Strategy:**
- Always include: #SocialDoctors #비즈니스클리닉
- Add 3-5 relevant category/function hashtags
- Include service-specific tags if applicable

**Example Structure:**
```
[Hook question or bold statement]

[Problem diagnosis in 1-2 sentences]

[SocialDoctors solution prescription]

[Benefit highlight]

[Clear CTA]

#SocialDoctors #비즈니스클리닉 #추가해시태그들
```

### 4. Present Options to User

Display all 3 variations with explanations:

**For each option:**
- Why this hook works for target audience
- How it aligns with brand voice
- Expected engagement level
- Best posting time suggestion

**User feedback:**
- Which variation resonates?
- Any adjustments needed?
- Combine elements from multiple options?

### 5. Refine Selected Copy

Based on user feedback:
- Adjust tone or messaging
- Strengthen CTA
- Optimize hashtag mix
- Fine-tune length

**Brand Guideline Check:**
- ✓ Tone matches guidelines
- ✓ No forbidden language
- ✓ Value-first approach
- ✓ Accurate claims only

### 6. Image/Visual Suggestions

Recommend visual content:

**Card News (카드뉴스):**
- Multi-slide educational content
- Statistics or data visualization
- Step-by-step guides

**Single Image:**
- Product screenshot
- Infographic
- Stock photo suggestion

**Video:**
- Short demo clip
- Customer testimonial
- Behind-the-scenes

**Design Brief:**
- Suggested layout and composition
- Key text overlays
- Brand colors and fonts
- Mood and style

### 7. Posting Options

Present options for publication:

**Option A: Manual Posting**
- Provide final copy to paste
- Image specifications and suggestions
- Optimal posting time recommendation

**Option B: Scheduled Post**
- Save draft for later review
- Set reminder for optimal time
- Track in content calendar

**Option C: Immediate API Post** (if configured)
- Post directly to Facebook Page 417103501672818
- Confirm before publishing
- Monitor initial engagement

### 8. Record & Learn

After posting:

**Update memories.md with:**
- Post content and purpose
- Target audience and goals
- Timestamp and context
- User feedback on process

**Track for analysis:**
- Post performance (to be updated later)
- What worked well
- What to try differently next time

---

## Example Conversation Flow

**Agent:** "안녕하세요! Facebook 포스트를 만들어드리겠습니다. 어떤 내용의 포스트를 원하시나요?"

**User:** "신규 파트너 모집 포스트"

**Agent:** "좋습니다! 파트너 모집 포스트를 만들겠습니다. 몇 가지 질문드릴게요:
1. 어떤 파트너를 주로 타겟하시나요? (인플루언서, 마케팅 에이전시, 영업대리점 등)
2. 강조하고 싶은 혜택이 있나요? (수수료율, 지원 프로그램 등)
3. 톤은 어떻게 하실까요? (전문적 vs 친근함)"

**User:** "인플루언서 대상, 20% 수수료 강조, 친근하게"

**Agent:** *[loads brand guidelines, checks past partner posts]*

"알겠습니다! 인플루언서를 대상으로 20% 수수료를 강조하는 친근한 톤의 포스트 3가지 버전을 만들어드리겠습니다..."

*[generates 3 copy variations]*

**Agent:** "이 3가지 옵션 중 어떤 것이 가장 마음에 드시나요? 또는 조합하고 싶은 요소가 있으신가요?"

---

## Technical Implementation Notes

### Required Integrations:
- OpenAI API for copy generation
- Facebook Graph API for posting (optional)
- Image generation API (optional - DALL-E, Canva)

### Error Handling:
- If API unavailable: provide manual copywriting guidance
- If brand guidelines missing: use default SocialDoctors voice
- If memories inaccessible: proceed without historical context

### Performance Optimization:
- Cache brand guidelines in session
- Reuse successful templates
- Learn from high-performing posts

---

**Workflow Complete:** User has finalized Facebook post ready for publication or scheduling.
