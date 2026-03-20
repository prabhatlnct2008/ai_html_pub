Homepage Generator Prompt Rewrite

Below is a rewritten, stronger prompt set for your pipeline, designed to make the model more proactive, more design-opinionated, and much less likely to produce thin or generic homepage output.

⸻

What these rewrites aim to fix

The new prompts are designed to push the model to:
	•	behave like a senior strategist and homepage designer, not a cautious JSON filler
	•	make proactive design decisions without waiting for extra instructions
	•	create a homepage that feels complete, persuasive, and visually dynamic
	•	think in terms of Bootstrap-friendly layout structure and Framer-friendly motion intent
	•	avoid repetitive heading + paragraph + cards patterns unless they are actually justified
	•	enrich sections with layout intent, motion intent, proof, rhythm, and stronger microcopy

⸻

Recommended schema additions

Before the prompts, here are the optional fields your renderer should ideally support in each section:
	•	layoutHint
	•	motionHint
	•	eyebrow
	•	supportingPoints
	•	trustChips
	•	media
	•	surface
	•	emphasis
	•	badge
	•	icon
	•	ctaNote

These are not mandatory for every section, but the prompts below encourage richer structured output.

⸻

1) INFER CONTEXT

System Prompt

You are a senior business context analyst for AI-driven website generation.

Your job is to turn a short business description into a compact but commercially useful context object for downstream website planning and homepage generation.

You must infer only what is strongly supported by the input, but you should still be helpful, concrete, and decision-oriented.

You are not writing generic summaries.
You are creating a context object that will help later agents make better design, copy, layout, and conversion decisions.

What good output looks like:
- specific audience framing
- a realistic primary CTA
- a sensible tone choice
- a clear main offer
- strong differentiators grounded in the business description
- trust and conversion cues that matter for a homepage

Rules:
- Return JSON only
- Be concrete, not generic
- Do not invent niche claims unless the input strongly supports them
- Prefer commercially useful phrasing over vague brand language
- pageType must be one of: local-business, service-business, saas, coach, product-sales
- tone must be one of: professional, casual, playful, bold, elegant, friendly, authoritative

Think about:
- what the customer is actually buying
- what friction or hesitation might exist
- what benefit matters most
- what would matter on a homepage

User Prompt Template

Infer website-generation context for this business.

Business Name: {name}
Description: {description}
Location: {location or "Not provided"}
Audience Hint: {audience or "Not provided"}

Return JSON with:
{
  "businessName": "...",
  "businessDescription": "...",
  "businessType": "...",
  "targetAudience": "...",
  "primaryCta": "...",
  "tone": "professional|casual|playful|bold|elegant|friendly|authoritative",
  "pageType": "local-business|service-business|saas|coach|product-sales",
  "mainOffer": "...",
  "location": "...",
  "differentiators": ["...", "..."],
  "trustDrivers": ["...", "..."],
  "customerMotivations": ["...", "..."],
  "likelyObjections": ["...", "..."],
  "visualStyleHints": ["...", "..."]
}


⸻

2) SITE PLANNER

System Prompt

You are a senior website architecture planner and conversion-focused information architect.

Your job is to decide the optimal page structure for a small business website based on business context, audience, offer, trust needs, and conversion goal.

You are not trying to maximize page count.
You are trying to create the smallest high-performing website that:
- clearly explains the business
- builds trust fast
- supports the primary CTA
- reduces buyer hesitation
- matches the real buying journey for this business type

How to think:
- Think like a strategist, not a sitemap generator.
- Every page must earn its existence.
- If a goal can be handled well by a homepage section, do not create a separate page.
- Create separate pages only when they improve clarity, trust, SEO discoverability, or conversion flow.
- Favor simple, conversion-focused site structures for small businesses.
- The homepage should do the heaviest lifting and be the most comprehensive page.
- Use the business type, offer complexity, service area, and trust requirements to decide page count.

Decision rules:
- Always include a homepage with slug "home" and isHomepage: true.
- Include a contact page unless the site is intentionally minimal and the homepage already contains a strong contact section.
- Maximum 8 pages.
- Each page must have a unique lowercase hyphenated slug.
- Suggested sections must only use this list:
  hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer, gallery, service-area, about-team
- Every page must end with footer.
- Do not create redundant pages with slightly different wording.
- Do not create unsupported page categories.

Dynamic planning principles:
- If trust is a major purchase driver, prioritize about, testimonials, results, faq, and clear service explanation.
- If location matters, include service-area where it helps conversion.
- If pricing clarity matters, include pricing.
- If the offer is unfamiliar or process-heavy, include how-it-works and/or problem-solution.
- If the service is visual, consider gallery.
- Keep simple local businesses lean instead of bloated.

Before answering, silently assess:
- what the buyer needs to understand
- what they need to believe
- what objections are likely
- what deserves its own URL
- what can remain on the homepage

Return JSON with this exact structure:
{
  "siteGoal": "string",
  "targetAudience": "string",
  "pages": [
    {
      "slug": "home",
      "title": "Page Title",
      "purpose": "What this page achieves",
      "pageType": "local-business|service-business|saas|coach|product-sales",
      "isHomepage": true,
      "suggestedSections": ["hero", "features", "testimonials", "cta-band", "footer"]
    }
  ]
}

User Prompt Template

Plan a multi-page website for this business:

Business Name: {businessName}
Business Type: {businessType}
Description: {businessDescription}
Target Audience: {targetAudience}
Primary CTA: {primaryCta}
Location: {location}
Main Offer: {mainOffer}
Differentiators: {differentiators}
Trust Drivers: {trustDrivers}
Customer Motivations: {customerMotivations}
Likely Objections: {likelyObjections}


⸻

3) SHARED SETTINGS / BRAND SYSTEM

System Prompt

You are a brand system designer and visual direction strategist for small business websites.

Your job is to create cohesive site-wide settings that help the later homepage generator produce a premium, conversion-friendly visual system.

You are not just picking colors.
You are defining a practical brand foundation for layout, typography, actions, and shared UI behavior.

What good output looks like:
- a color system that fits the business and audience
- a tone-consistent theme direction
- sensible font pairing
- a clean action system
- a practical header/footer structure
- navigation that reflects the actual site plan

Rules:
- Return JSON only
- themeVariant must be one of: clean, bold, premium, playful
- primaryColor, secondaryColor, accentColor must be valid hex colors
- footer links must use href
- actions should be lean, practical, and conversion-oriented
- avoid random trendy choices that do not fit the business

Design guidance:
- clean = airy, modern, clear, conversion-safe
- bold = high contrast, strong confidence, more visual energy
- premium = refined, polished, elegant, restrained confidence
- playful = friendly, bright, warm, approachable

Choose a direction that fits the business, not just the tone label.

User Prompt Template

Create shared site settings.

Business Name: {businessName}
Business Type: {businessType}
Description: {businessDescription}
Tone: {tone}
Primary CTA: {primaryCta}
Location: {location}
Visual Style Hints: {visualStyleHints}

Site Pages:
{pages}

Return JSON with:
{
  "brand": {
    "tone": "...",
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "fontHeading": "Font Name",
    "fontBody": "Font Name"
  },
  "themeVariant": "clean|bold|premium|playful",
  "actions": [
    {
      "id": "action-primary",
      "label": "...",
      "type": "url",
      "value": "#contact",
      "style": "primary"
    }
  ],
  "header": {
    "siteName": "Business Name",
    "showNav": true
  },
  "footer": {
    "companyName": "Business Name",
    "tagline": "Short line",
    "columns": [
      {
        "title": "Quick Links",
        "links": [
          { "text": "Home", "href": "/home" }
        ]
      }
    ],
    "copyrightYear": "2026"
  },
  "navigation": [
    {
      "label": "Home",
      "href": "/home"
    }
  ]
}


⸻

4) HOMEPAGE PLANNER

System Prompt

You are a senior homepage experience architect for modern small-business websites.

Your job is to plan a homepage that feels commercially sharp, visually dynamic, and conversion-oriented.

You are not just listing sections.
You are designing the flow of attention, trust, persuasion, and action.

Output goals:
- The homepage should feel complete, premium, and intentionally sequenced.
- It should balance clarity, proof, emotional reassurance, and strong calls to action.
- It should avoid flat, repetitive section planning.
- It should feel like a professionally designed homepage, not a wireframe.

Rules:
- Return JSON only
- Start with hero and end with footer
- Use only allowed section types
- Every section must include a variant
- Choose the leanest section set that still feels complete, persuasive, and professionally designed
- Prefer 7 to 10 sections when the business benefits from trust-building and conversion support
- Avoid repetitive same-density section patterns across the page

Planning principles:
- Vary the rhythm of the homepage: alternate dense and light sections, proof and explanation, emotion and utility
- Think in buyer journey order: attention -> trust -> understanding -> proof -> objections -> action
- Use homepage sections to reduce hesitation before the final CTA
- Avoid generic repeated card-grid structures unless clearly justified

Design intelligence:
- If the business is service-based, prioritize service clarity, trust, proof, process, and CTA repetition
- If the service saves time, reduces stress, or improves convenience, surface that benefit early
- If location matters, mention the service area strategically
- If the offer is unfamiliar or high-trust, include problem-solution, how-it-works, testimonials, and FAQ
- Add a CTA band before the final contact or footer when conversion intent should be reinforced

Return JSON with this exact structure:
{
  "slug": "home",
  "title": "Home",
  "pageType": "service-business",
  "sections": [
    {
      "type": "hero",
      "purpose": "Lead with offer and CTA",
      "variant": "split-with-image"
    }
  ]
}

User Prompt Template

Plan the homepage sections.

Page: {title} (/{slug})
Purpose: {purpose}
Page Type: {pageType}
Theme Variant: {themeVariant}
Suggested Sections: {suggestedSections}

Business Name: {businessName}
Business Type: {businessType}
Description: {businessDescription}
Audience: {targetAudience}
Main Offer: {mainOffer}
Location: {location}
Differentiators: {differentiators}
Trust Drivers: {trustDrivers}
Customer Motivations: {customerMotivations}
Likely Objections: {likelyObjections}

Other pages:
{otherPages}

Return JSON with:
{
  "slug": "home",
  "title": "Home",
  "pageType": "service-business",
  "sections": [
    {
      "type": "hero",
      "purpose": "Lead with offer and CTA",
      "variant": "split-with-image"
    }
  ]
}


⸻

5) HOMEPAGE GENERATOR

System Prompt

You are an elite homepage designer, conversion copywriter, and structured UI content architect.

Your task is to generate one complete homepage PageDocument that feels like it was designed by a high-end web agency.

You must be proactive.
Do not wait for more instructions.
Make strong design decisions based on the business context.

Your responsibilities:
- write persuasive, specific, non-generic copy
- shape a compelling visual hierarchy
- make each section feel intentionally designed
- create a homepage that looks complete, premium, and production-worthy
- use the planned sections, but enrich them with strong content structure and visual direction

Critical behavior:
- do not produce bland or generic layouts
- do not make every section feel the same
- do not rely on repetitive heading + paragraph + 3 cards patterns unless justified
- do not sound lazy, placeholder-like, or template-driven
- assume you are responsible for making the page impressive

Design expectations:
- the hero must feel bold and polished, with a clear primary CTA and meaningful supporting copy
- early sections should establish trust and reduce hesitation quickly
- mid-page sections should explain the offer clearly and show why it matters
- later sections should handle objections, proof, and action
- copy should feel local, relevant, and audience-aware
- use concise but rich microcopy, labels, chips, stats, and section intros where helpful

Visual direction expectations:
- for each section, include visual intent through content and style choices
- vary layout patterns across sections
- introduce contrast in section density, emphasis, and tone
- prefer premium modern web patterns over generic marketing blocks
- when appropriate, suggest layered backgrounds, cards, split layouts, badges, trust chips, process steps, highlighted stats, and visually anchored CTAs

Animation and interaction intent:
- where appropriate, include a motionHint field for each section that could later map to Framer Motion behaviors
- use tasteful modern motion, not gimmicks
- examples: fade-up stagger, parallax-soft, hover-lift cards, reveal-on-scroll, floating badge, stat count-up

Framework awareness:
- structure content so it could be rendered elegantly with Bootstrap layout primitives and enhanced with Framer Motion
- think in responsive layout terms such as container, row, col, split hero, alternating blocks, and stacked mobile order
- do not output code, but do output enough structured design intent that a renderer can implement it

Rules:
- Return JSON only
- Use the exact planned section types and variants
- Do not use placeholder copy
- Avoid generic filler such as "we are the best" or "your trusted partner"
- Mention the actual service, audience, and location when useful
- Use schema-safe content keys
- Ensure the page feels complete, not skeletal

User Prompt Template

Generate a complete homepage PageDocument.

Business Context:
- Name: {businessName}
- Description: {businessDescription}
- Type: {businessType}
- Target Audience: {targetAudience}
- Main Offer: {mainOffer}
- Location: {location}
- Tone: {tone}
- Primary CTA: {primaryCta}
- Differentiators: {differentiators}
- Trust Drivers: {trustDrivers}
- Customer Motivations: {customerMotivations}
- Likely Objections: {likelyObjections}

Brand System:
- Primary: {primaryColor}
- Secondary: {secondaryColor}
- Accent: {accentColor}
- Fonts: {fontHeading} / {fontBody}
- Theme Variant: {themeVariant}

Actions:
{actions}

Page Plan:
{pagePlan}

Requirements:
- Make the page feel premium, modern, and complete
- Include strong section-level copy, not bare minimum text
- Add visual intent for each section
- Add motionHint for each section where useful
- Add layoutHint for each section so a frontend can render it using Bootstrap grid and Framer Motion
- Include content that feels local and relevant when appropriate
- Avoid repetitive structures across sections
- Ensure the hero, trust, service explanation, proof, FAQ, CTA, and footer feel intentionally sequenced

Return JSON with:
{
  "meta": {
    "title": "...",
    "description": "...",
    "pageType": "...",
    "themeVariant": "...",
    "slug": "..."
  },
  "brand": {},
  "assets": [],
  "actions": [],
  "sections": [
    {
      "id": "section-hero-001",
      "type": "hero",
      "variant": "split-with-image",
      "visible": true,
      "order": 0,
      "layoutHint": "container > row > col-lg-6 content / col-lg-6 media",
      "motionHint": "fade-up stagger with soft image reveal",
      "content": {
        "eyebrow": "...",
        "heading": "...",
        "subheading": "...",
        "supportingPoints": ["...", "...", "..."],
        "trustChips": ["...", "...", "..."],
        "buttons": [
          { "text": "...", "actionId": "action-primary", "style": "primary" }
        ]
      },
      "style": {
        "backgroundColor": "...",
        "textColor": "...",
        "padding": "...",
        "surface": "soft-gradient",
        "emphasis": "high"
      }
    }
  ]
}


⸻

Extra proactive lines worth adding

These are the strongest anti-lazy lines. You can reuse them in either the homepage planner or homepage generator.

You must be proactive and opinionated.
Do not wait for missing instructions if a strong design decision can be inferred from the business context.
Assume you are responsible for making the homepage feel premium, complete, and visually impressive.
If a section risks feeling generic, enrich it with stronger structure, microcopy, proof elements, layout contrast, or visual emphasis.
Avoid the lazy default of repeating heading + paragraph + 3 cards across the page.
Use modern landing-page patterns such as split heroes, trust chips, step flows, testimonial cards, comparison emphasis, CTA bands, and FAQ accordions where appropriate.
Design the page with momentum: each section should advance persuasion, not merely exist.


⸻

Important implementation note

These prompts will improve output quality a lot, but your current renderer still limits how “amazing” the page can look, because it does not actually support Bootstrap structure, Framer Motion, richer media treatment, or variant-aware rendering.

So the best path is:
	1.	upgrade prompts
	2.	expand schema
	3.	improve renderer
	4.	ideally move toward React/Next + Bootstrap or Tailwind + Framer Motion

⸻

Small code fixes you should make immediately
	•	change footerx to footer
	•	stop linking nav items as #slug if they are meant to be real pages
	•	stop hardcoding all CTA buttons to #contact
	•	actually use section variant in rendering
	•	let renderer support richer section fields such as layoutHint, motionHint, eyebrow, trustChips, supportingPoints, and surface

⸻

Suggested next step

Use these rewritten prompts first, then adjust your renderer so the richer output has somewhere to go.


------------------------


# Strict Enforcement Implementation Audit

This document expands every missing, partial, and weak area in the current homepage generator so it can be used as a strict implementation checklist. Nothing is minimized here. The goal is to make it extremely clear what is and is not implemented, what is broken conceptually, and what must change for the system to become truly proactive, premium, and design-capable.

---

# 1. Overall verdict

The code is not fully implementing the stronger prompt architecture, richer schema, or premium rendering vision.

It does implement a working linear pipeline:

1. infer business context
2. plan site
3. generate shared settings
4. plan homepage
5. generate homepage JSON document
6. render HTML
7. write trace JSON

That means the app is functional as an MVP.

However, the following are still true:

* the stronger prompts are not implemented in this code
* the proactiveness improvements are not implemented in a meaningful way
* the renderer is too simple for premium output
* many section types are not truly supported
* action mapping is not properly respected
* navigation is not built as a real multi-page website
* Framer and Bootstrap are not actually integrated
* variants are mostly decorative metadata, not functional instructions
* the model is still being steered toward safe, generic behavior rather than strong creative execution

So the correct interpretation is:

* **functional**: yes
* **complete relative to the original simple MVP**: mostly yes
* **complete relative to the improved premium vision**: no
* **strictly implemented end-to-end**: no

---

# 2. Strict audit of what is currently implemented

## 2.1 Environment loading

Implemented:

* reads from environment variables first
* falls back to `.env.local` and `.env`
* strips quotes around values
* stores loaded value back into `os.environ`

This part is fine for a simple script.

Not implemented / weak points:

* no support for comments at line end after variable value
* no robust `.env` parsing for escaped values
* no validation that API key format looks sane
* no warning if both `.env.local` and `.env` define conflicting values
* no test coverage

This is acceptable for MVP, but not hardened.

---

## 2.2 OpenAI API call wrapper

Implemented:

* posts to `/v1/chat/completions`
* sets `response_format` to `json_object`
* supports temperature and max tokens
* has SSL context support
* handles HTTP and URL errors

Not implemented / weak points:

* no retry logic
* no rate-limit backoff
* no timeout configuration per phase
* no request/response logging beyond final trace artifact
* no model-specific compatibility checks
* no fallback model
* no validation that returned content is actually a JSON object with expected keys
* no usage metadata capture
* no token accounting or cost logging
* no handling for structured output failure beyond exception

Important architectural point:

* the code assumes the model will return appropriate JSON, but there is no schema validator after parsing
* this means malformed or structurally incomplete output can silently propagate until rendering

Strict enforcement recommendation:

* add JSON schema validation after every model call
* fail early with clear diagnostics
* optionally auto-repair with one retry prompt

---

## 2.3 Context inference phase

### Current implementation status

Implemented:

* business name, description, location, and audience hint are passed
* the model is asked to infer:

  * businessName
  * businessDescription
  * businessType
  * targetAudience
  * primaryCta
  * tone
  * pageType
  * mainOffer
  * location
  * differentiators

This is a reasonable basic inference layer.

### What is not implemented

The stronger context model discussed earlier is not implemented. Missing fields include:

* `trustDrivers`
* `customerMotivations`
* `likelyObjections`
* `visualStyleHints`
* any notion of offer complexity
* any notion of local vs remote service dependency
* any notion of pricing sensitivity
* any notion of emotional buying drivers
* any notion of trust sensitivity
* any notion of whether outcomes are visual or non-visual

### Why this matters

Without these fields:

* the site planner has less strategic context
* the homepage planner cannot sequence the page around objections and persuasion
* the homepage generator cannot proactively shape visuals and content based on emotional or commercial reality

### Prompt strength problem

`INFER_CONTEXT_SYSTEM` is still too plain.
It says:

* return JSON only
* be concrete
* infer realistic values
* choose pageType and tone from enums

But it does not say:

* think about what the buyer is actually buying
* identify what drives trust
* infer friction points
* infer why a buyer might hesitate
* infer useful visual direction

So this phase is implemented, but only in its simpler old form.

### Strict enforcement requirement

To count as fully implemented under the stronger architecture, this phase must:

1. use the rewritten stronger system prompt
2. request the richer context fields
3. validate that those fields exist and have useful content
4. provide sensible defaults if the model is weak

---

# 3. Site planner audit

## 3.1 What is implemented

The site planner currently:

* receives business name, type, description, target audience, CTA, location, main offer, differentiators
* uses a reasonable rule-based planning prompt
* returns:

  * siteGoal
  * targetAudience
  * pages[]

Each page includes:

* slug
* title
* purpose
* pageType
* isHomepage
* suggestedSections

This is working and useful.

## 3.2 What is not fully implemented

### Missing richer planning context

Because the context phase is still weak, the site planner is missing inputs such as:

* trustDrivers
* customerMotivations
* likelyObjections
* visual style cues
* offer familiarity
* price sensitivity
* whether results are visual

That means the planner cannot make higher-quality decisions consistently.

### The stronger site planner prompt is not present

The current site planner prompt is decent, but it is still missing some of the sharper dynamic instructions from the upgraded version, such as:

* explicit silent assessment of buyer understanding, trust, objections, and page-worthiness
* stronger guidance about not defaulting to standard 4-page patterns
* more detailed business-type adaptation rules
* more explicit justification logic for pages like about, pricing, gallery, service-area, faq

### No validation of returned plan

The code does not verify:

* homepage exists exactly once
* all slugs are unique
* all suggested sections are valid section types
* each page ends with footer
* page count does not exceed max
* contact requirement is met

The prompt requests these, but the code does not enforce them.

### Strict enforcement requirement

To count as fully implemented, site planning must include:

1. stronger site planner prompt
2. schema validation of pages
3. business rule validation after model response
4. automatic repair or hard failure if response violates rules

---

# 4. Shared settings / brand system audit

## 4.1 What is implemented

The shared settings phase currently generates:

* brand tone
* primaryColor
* secondaryColor
* accentColor
* fontHeading
* fontBody
* themeVariant
* actions
* header
* footer
* navigation

This is a useful start.

## 4.2 What is weak or incomplete

### Prompt is too weak

The system prompt is still:

* basic
* non-strategic
* not visually ambitious
* not tied tightly to business context

It does not push the model to think like a visual direction strategist.
It does not distinguish sufficiently between:

* safe colors and memorable colors
* generic font pairings and purposeful pairings
* action strategy and random action generation
* premium vs playful vs bold visual implications

### Footer and nav are underused

Although the model can return footer and navigation, the renderer does not consume them properly enough.

### Action system is not fully respected

The shared settings can generate action objects, but rendering hardcodes button behavior.
So the action system exists in JSON but is not fully implemented in the front end.

### No brand token expansion

The improved architecture would likely require more than three colors and two fonts. Missing shared design tokens include:

* surface colors
* muted text color
* border colors
* section spacing scale
* button style tokens
* card radius / shadow tokens
* interaction states

### Strict enforcement requirement

To count as fully implemented, this phase must:

1. use the stronger brand system prompt
2. generate a design system that is actually consumed by the renderer
3. expand into reusable visual tokens
4. align actions, footer, and navigation with actual rendered behavior

---

# 5. Homepage planner audit

## 5.1 What is implemented

The code has a homepage planner phase that:

* focuses on the homepage only
* takes page title, purpose, page type, theme variant, suggested sections, business details, and other pages
* asks for a list of sections with type, purpose, and variant

This works as a structural planning step.

## 5.2 Critical problems

### Typo remains

The prompt still says:

* `Start with hero and end with footerx`

This is an implementation defect, plain and simple.

### Section planning is too weak

The prompt still says:

* pick the smallest section set that clearly serves the page goal

That instruction biases the model toward a bare-minimum page.
It does not encourage:

* persuasion flow
* visual rhythm
* proof stacking
* objection handling
* emotional pacing
* CTA escalation

### Missing strategic inputs

The homepage planner does not get:

* trust drivers
* likely objections
* customer motivations
* visual style hints

That means it cannot intelligently choose sections for persuasion flow.

### Variants are underdefined

The planner is told every section must include a variant, but there is no guidance about:

* what kinds of variants exist
* what makes a strong variant choice
* how to vary layouts across the page
* how to avoid repetitive density and patterns

### No post-plan validation

The code does not verify:

* first section is hero
* last section is footer
* all types are allowed
* section list is not too thin
* section order aligns with logical persuasion flow

### Strict enforcement requirement

To be fully implemented, the homepage planner must:

1. use the upgraded homepage planning prompt
2. remove the typo
3. favor complete persuasive homepages, not bare-minimum homepages
4. validate section ordering and section type validity
5. optionally enforce minimum completeness heuristics based on business type

---

# 6. Homepage generator audit

## 6.1 What is implemented

The generator currently produces a page document with:

* meta
* brand
* assets
* actions
* sections

Each section can include:

* id
* type
* variant
* visible
* order
* content
* style

This is the core generation layer, and it is working.

## 6.2 What is not implemented

### Prompt is still old and weak

The current generator prompt does not include the stronger design-directive language.
It still frames the model as:

* conversion copywriter
* structured content engineer

That is too limited.
It does not frame the model as:

* elite homepage designer
* proactive visual strategist
* layout-aware system thinker
* motion-aware structured UI architect

### Missing anti-lazy language

The current prompt does not say things like:

* be proactive and opinionated
* do not wait for more instructions
* avoid repetitive heading + paragraph + 3 cards patterns
* enrich any section that risks feeling generic
* assume responsibility for making the page impressive

That means the model is still likely to be safe and bland.

### Missing richer section fields

The improved architecture required fields such as:

* `layoutHint`
* `motionHint`
* `eyebrow`
* `supportingPoints`
* `trustChips`
* `media`
* `surface`
* `emphasis`
* `badge`
* `icon`
* `ctaNote`

These are not meaningfully present in the current prompt or defaults.

### Missing sequencing expectations

The improved version should explicitly require:

* bold hero
* early trust
* mid-page understanding
* later proof and objection handling
* final CTA reinforcement

That is not fully specified.

### No schema validation

The code does not validate that generated sections contain enough content for rendering.
It also does not verify data shape per section type.

For example:

* a services section might lack `items`
* a testimonials section might have malformed items
* a results section might have no stats
* a footer might omit company data

The script will still render something weak or broken.

### Strict enforcement requirement

To be fully implemented, homepage generation must:

1. use the upgraded system prompt
2. use the richer user prompt
3. request richer section fields
4. validate content shape per section type
5. reject or repair incomplete documents

---

# 7. Ensure-defaults audit

## 7.1 What is implemented

`ensure_defaults()` currently ensures:

* meta exists
* title, description, pageType, themeVariant, slug defaults are set
* brand exists
* assets/actions/sections arrays exist
* each section gets id, visible, order, variant, content, style
* style gets fallback backgroundColor, textColor, padding

This is useful.

## 7.2 What is incomplete

### No support for richer fields

There are no defaults for:

* layoutHint
* motionHint
* eyebrow
* supportingPoints
* trustChips
* media
* surface
* emphasis

### No section-type-aware defaults

A more complete implementation would set defaults differently depending on section type.
For example:

* hero defaults should include buttons array, trust chips, maybe eyebrow
* features/services should default to items array
* faq should default to items array
* footer should default companyName/tagline/columns/year

### No validation or repair logic

This function only adds generic defaults. It does not:

* validate section shape
* ensure footer exists
* ensure hero exists
* ensure sections are sorted by order
* remove invalid sections
* fill missing arrays where section renderers expect them

### Strict enforcement requirement

To be fully implemented, `ensure_defaults()` should evolve into a combined:

* normalization layer
* validation layer
* section-type-aware repair layer

---

# 8. Renderer audit: major architectural gap

This is the single biggest implementation gap relative to the premium vision.

## 8.1 What is implemented

The renderer outputs a single static HTML document with:

* embedded CSS
* sticky header
* simple nav
* section rendering for several section types
* cards, grids, buttons, stats, faq, footer

This is a valid simple renderer.

## 8.2 What is not implemented

### No Bootstrap

There is no:

* Bootstrap CSS import
* Bootstrap grid usage
* Bootstrap spacing system
* Bootstrap container/row/col patterns
* Bootstrap navbar
* Bootstrap utility classes
* Bootstrap buttons or accordions

Therefore Bootstrap is **not implemented**, even though the goal mentions it.

### No Framer Motion

There is no:

* React
* Framer Motion library
* animation system
* motion wrappers
* scroll reveal behavior
* animation mapping from content schema

Therefore Framer Motion is **not implemented**.

### No React/Next rendering model

The current output is a raw HTML string.
That means:

* no componentization
* no reusable JSX section components
* no client-side animation hooks
* no easy library-based extension

### No media treatment

The richer homepage vision needs:

* hero images / placeholders
* split layouts
* image cards
* layered backgrounds
* decorative surfaces
* badges and floating UI

The current renderer does not support these.

### No variant-aware layouts

The renderer does not really behave differently based on `variant`.
This is a very serious gap.

Variants should drive:

* alignment
* content/media split
* card density
* layout order
* alternating blocks
* compact vs expansive section treatment

Right now variants are mostly ignored.

### No layoutHint mapping

Even if prompts generated `layoutHint`, the renderer would ignore it.

### No motionHint mapping

Even if prompts generated `motionHint`, the renderer would ignore it.

### No themeVariant-aware rendering

The shared `themeVariant` exists, but rendering does not meaningfully adapt layouts, surfaces, shadows, borders, or type treatment based on it.

### Strict enforcement requirement

To count as fully implemented, the renderer must either:

## Path A: improved static renderer

* map `variant` to actual layout patterns
* map `layoutHint` to HTML structure
* map `surface` and `emphasis` to visual treatments
* map `actions` to real links
* support richer content structures
* handle all section types intentionally

## Path B: proper front-end renderer

* switch to React or Next.js
* use Bootstrap or another design system intentionally
* use Framer Motion for motion hints
* render section components based on schema

Without one of those, the premium design goal is not implemented.

---

# 9. Section-type support audit

The `SECTION_TYPES` list includes:

* hero
* trust-bar
* features
* benefits
* problem-solution
* how-it-works
* services
* testimonials
* results
* pricing
* faq
* cta-band
* contact
* footer
* gallery
* service-area
* about-team

## 9.1 Which are truly rendered with dedicated behavior?

Dedicated-ish rendering exists for:

* hero
* features
* benefits
* services
* how-it-works
* testimonials
* results
* faq
* contact
* cta-band
* footer

## 9.2 Which are not truly implemented?

These are listed as allowed section types but do not have meaningful custom renderers:

* trust-bar
* problem-solution
* pricing
* gallery
* service-area
* about-team

These fall through to a generic renderer.

That means they are **allowed**, but not **implemented** in a useful way.

## 9.3 Why this matters

If the model plans one of those sections, the output quality drops because the section is reduced to:

* a heading
* a paragraph

That completely defeats the value of section planning.

## 9.4 Strict enforcement requirement

Each supported section type must have:

* a dedicated content shape
* a dedicated render path
* intentional layout options
* validation rules

Example expectations:

### trust-bar

Should support:

* chips
* logos
* trust statements
* service facts

### problem-solution

Should support:

* problem bullets
* solution bullets
* before/after framing
* emotionally resonant copy

### pricing

Should support:

* tiers or packages
* features per plan
* highlighted plan
* CTA per plan

### gallery

Should support:

* image list
* captions
* layout variants like masonry or grid

### service-area

Should support:

* list of neighborhoods / zones / cities
* service notes
* CTA for availability confirmation

### about-team

Should support:

* intro copy
* team member cards
* expertise / values

Until these exist, section support is incomplete.

---

# 10. Actions audit

## 10.1 What is implemented

The shared settings phase can generate `actions`.
The page document also includes an `actions` array.
Buttons reference `actionId`.

So action metadata exists.

## 10.2 What is not implemented

In rendering, button links are still hardcoded to `#contact`.

That means:

* `actionId` is ignored
* action lookup is ignored
* alternate CTAs are ignored
* section-specific CTA behaviors are ignored

## 10.3 Strict enforcement requirement

A real action system must:

* create an action lookup map
* resolve button `actionId` to actual href/value/type
* support primary and secondary actions
* support external URLs, anchors, and page links
* gracefully handle missing action IDs
* allow different buttons to go to different destinations

Until then, actions are only partially implemented.

---

# 11. Navigation audit

## 11.1 What is implemented

The renderer creates nav items from `site_plan.pages`.

## 11.2 What is wrong

It links them as:

* `#home`
* `#services`
* `#about`
* etc.

That is not correct for a multi-page site plan.
These are page slugs, not section anchors.

## 11.3 What is missing

A real implementation should choose one of these approaches:

### Option A: single-page app with homepage sections only

Then page plan should not pretend the site has multiple pages.

### Option B: multi-page output

Then renderer should:

* generate separate files for each page
* link nav items to page URLs
* possibly use page-specific content generators

Right now the system is mixed:

* site planner builds multiple pages
* renderer outputs only one homepage
* nav points to fake anchors

That means multi-page behavior is not really implemented.

---

# 12. Footer audit

## 12.1 What is implemented

Footer rendering exists.
It supports:

* companyName
* tagline
* columns with links
* copyrightYear

## 12.2 What is weak

* footer prompt examples still use anchor-like hrefs instead of real page paths
* footer rendering is visually basic
* footer does not adapt to themeVariant
* footer does not consume shared footer object automatically if page generator omits section-level footer content
* no social links support
* no contact information support

This is acceptable for MVP, but not premium.

---

# 13. Meta / SEO audit

## 13.1 What is implemented

The page document includes:

* meta.title
* meta.description
* meta.pageType
* meta.themeVariant
* meta.slug

These are rendered into `<title>` and meta description.

## 13.2 What is missing

No support for:

* Open Graph
* Twitter cards
* canonical URL
* robots directives
* JSON-LD schema
* local business schema
* favicon
* structured SEO section metadata

For an “amazing” homepage generator, SEO support is still thin.

---

# 14. Styling system audit

## 14.1 What is implemented

Inline CSS defines:

* color variables
* typography sizing
* simple container
* cards
* buttons
* grid
* stats
* FAQ
* footer responsiveness

This is enough for a neat simple page.

## 14.2 What is missing for premium output

* no font imports
* no actual use of selected heading/body fonts
* no refined spacing scale
* no elevation system
* no theme-specific style changes
* no gradient or surface system
* no image treatment
* no premium hero backgrounds
* no badge styles
* no chip styles
* no hover animations
* no section separators
* no alternating section compositions

This styling system is minimal and static.
It does not justify the aspiration of premium output.

---

# 15. Variant support audit

## 15.1 What is implemented

Each section can have a `variant` field.
A default `centered` variant is assigned if missing.

## 15.2 What is not implemented

The renderer does not substantially use section variants.

This means:

* planner effort is wasted
* generator effort is wasted
* page diversity is suppressed

## 15.3 Strict enforcement requirement

For each section type, define variant behaviors.

Examples:

### hero

* centered
* split-with-image
* split-with-card-stack
* full-bleed-overlay

### services

* three-card-grid
* icon-grid
* alternating-detail-blocks

### testimonials

* card-carousel-ready
* quote-grid
* highlighted-featured-testimonial

### pricing

* 3-tier
* compact-package-list
* highlighted-popular-plan

Each variant must map to actual rendering behavior.

---

# 16. Business-rule enforcement audit

## 16.1 What is missing across the pipeline

The prompts describe many rules, but the code does not enforce them after the model responds.

Missing hard validations include:

* homepage must exist
* exactly one homepage should exist
* page slugs must be unique
* section types must be valid
* homepage should start with hero
* homepage should end with footer
* pages should end with footer
* contact requirement should be met
* page count should be within allowed range
* sections should not be empty shells
* footer should have meaningful content
* CTA should exist on key sections

Without post-response validation, the system relies too heavily on prompt compliance.

## 16.2 Strict enforcement requirement

Add validation functions such as:

* `validate_business_context()`
* `validate_site_plan()`
* `validate_shared_settings()`
* `validate_page_plan()`
* `validate_page_document()`

And either:

* fail hard with readable diagnostics, or
* re-prompt with a repair instruction

---

# 17. Prompt implementation audit

This section compares the discussed stronger architecture against what is actually in the code.

## 17.1 Infer context prompt

Status: **not upgraded**

Missing:

* strategy framing
* trust drivers
* objections
* motivations
* visual hints

## 17.2 Site planner prompt

Status: **partially decent, not fully upgraded**

Missing:

* deeper dynamic planning logic
* stronger non-template warning
* silent assessment guidance
* richer page-worthiness logic

## 17.3 Shared settings prompt

Status: **not upgraded enough**

Missing:

* visual strategy framing
* stronger design direction selection logic
* stronger action system guidance

## 17.4 Homepage planner prompt

Status: **weak and flawed**

Problems:

* typo `footerx`
* overly minimal bias
* no persuasion-flow language
* no visual rhythm guidance

## 17.5 Homepage generator prompt

Status: **most important missing upgrade**

Missing:

* proactive stance
* anti-lazy instructions
* visual hierarchy direction
* layout and motion intent
* premium design accountability

Overall prompt implementation verdict:

* the stronger prompt system is **not implemented**

---

# 18. Framer / Bootstrap claim audit

This deserves a separate strict note because it directly addresses the stated ambition.

## 18.1 Bootstrap status

Not implemented.

Reason:

* no Bootstrap CSS
* no Bootstrap classes
* no Bootstrap layout system
* no Bootstrap components

## 18.2 Framer Motion status

Not implemented.

Reason:

* no React
* no Framer Motion import
* no motion component mapping
* no animation runtime

## 18.3 Strict conclusion

The current code does **not** use Bootstrap or Framer accordingly.
It only produces plain static HTML/CSS.

Any claim beyond that would be inaccurate.

---

# 19. Multi-page website claim audit

## 19.1 What the planner does

The planner creates a site plan with multiple pages.

## 19.2 What the app outputs

The app outputs only one HTML file: the homepage.

## 19.3 Strict conclusion

A real multi-page website generator is **not implemented**.
What exists is:

* a multi-page planner
* a single-page generator and renderer

Those are not the same thing.

---

# 20. Minimal-to-complete migration checklist

This section turns the audit into a strict build order.

## Phase 1: Prompt replacement

Replace all current prompts with the upgraded versions.

Must change:

* `INFER_CONTEXT_SYSTEM`
* `infer_context_user_prompt()`
* `SITE_PLANNER_SYSTEM`
* `site_planner_user_prompt()`
* `SHARED_SETTINGS_SYSTEM`
* `shared_settings_user_prompt()`
* `PAGE_PLANNER_SYSTEM`
* `page_planner_user_prompt()`
* `PAGE_GENERATOR_SYSTEM`
* `page_generator_user_prompt()`

## Phase 2: Schema expansion

Add and normalize richer fields:

* trustDrivers
* customerMotivations
* likelyObjections
* visualStyleHints
* layoutHint
* motionHint
* eyebrow
* supportingPoints
* trustChips
* media
* surface
* emphasis
* badge
* icon
* ctaNote

## Phase 3: Validation layer

Add validators for every response type.

## Phase 4: Renderer completion

Implement dedicated renderers for all section types.
Implement action resolution.
Implement variant-aware layouts.
Implement richer section fields.
Fix nav behavior.
Use selected fonts.

## Phase 5: Premium rendering path

Choose one:

* better static HTML renderer
* React/Next renderer with Bootstrap or Tailwind and Framer Motion

## Phase 6: Multi-page generation

If true multi-page generation is required:

* generate all pages, not just homepage
* render each page to its own HTML file
* link navigation properly

---

# 21. Strict final conclusion

No, everything is not implemented.

A more exact conclusion is:

## Implemented

* basic end-to-end homepage generation pipeline
* simple prompt-driven site planning and homepage generation
* basic HTML renderer
* trace output

## Partially implemented

* shared settings
* action model in JSON
* section variant metadata
* multi-page planning logic

## Not implemented

* stronger premium prompts
* anti-lazy proactive homepage generation behavior
* richer schema needed for premium design
* Bootstrap-based rendering
* Framer Motion integration
* full support for all section types
* action resolution in rendering
* proper multi-page output
* real variant-aware rendering
* strict schema validation and repair
* true premium visual system

That is the strict enforcement answer.

The code is a good MVP, but it is not yet the completed version of the more ambitious architecture discussed earlier.
