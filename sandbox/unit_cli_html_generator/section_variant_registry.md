# Section Variant Registry

This file is the working registry for landing-page and marketing-site sections in the unit generator.

For each section type, it lists:
- purpose
- supported variants
- required fields
- recommended minimum content expectations

The goal is to make section planning, section writing, validation, and rendering use the same contract.

---

## Global Section Shape

Every section should support these top-level fields:

- `id`
- `type`
- `variant`
- `visible`
- `order`
- `content`
- `style`
- optional `layoutHint`
- optional `motionHint`

Every `style` object should usually support:

- `backgroundColor`
- `textColor`
- `padding`
- optional `surface`
- optional `emphasis`

---

## Navigation

### `top-nav`
Purpose:
- standard horizontal navigation for marketing pages

Variants:
- `simple`
- `with-cta`
- `with-announcement`
- `transparent`
- `sticky`

Required fields:
- `siteName`
- `links[]`

Recommended minimum:
- 3 links
- optional CTA button

### `centered-nav`
Variants:
- `logo-center`
- `links-center`
- `cta-balanced`

Required fields:
- `siteName`
- `links[]`

### `split-nav`
Variants:
- `logo-left`
- `logo-center`
- `dual-rail`

Required fields:
- `siteName`
- `links[]`

### `side-nav`
Variants:
- `left-rail`
- `icon-rail`
- `section-jump`

Required fields:
- `links[]`

---

## Hero

### `hero`
Purpose:
- communicate the offer immediately
- establish relevance
- drive the main CTA

Variants:
- `centered`
- `split-image`
- `background-image`
- `video`
- `offer-focused`
- `lead-form`
- `booking`
- `comparison`
- `manifesto`
- `editorial`

Required fields:
- `heading`
- `subheading`

Recommended optional fields:
- `eyebrow`
- `badge`
- `supportingPoints[]`
- `trustChips[]`
- `buttons[]`
- `ctaNote`
- `media`

Recommended minimum:
- 1 strong CTA
- 2-4 supporting points or 2-4 trust chips

---

## Trust / Proof

### `trust-bar`
Variants:
- `simple`
- `with-icons`
- `badges`
- `logos`
- `compliance`
- `review-badges`

Required fields:
- `items[]`

Recommended minimum:
- 3 items

### `logo-cloud`
Variants:
- `mono`
- `full-color`
- `compact`
- `with-caption`

Required fields:
- `logos[]`

Recommended minimum:
- 4 logos

### `certification-strip`
Variants:
- `badges`
- `icons`
- `stacked`

Required fields:
- `items[]`

### `review-strip`
Variants:
- `stars`
- `platform-badges`
- `snippets`

Required fields:
- `items[]`

---

## Features / Benefits / Value

### `features`
Variants:
- `icon-grid`
- `cards`
- `rows`
- `list-with-icons`
- `image-cards`
- `comparison-cards`

Required fields:
- `items[]`

Each item should support:
- `title`
- `description`
- optional `icon`
- optional `image`

Recommended minimum:
- 3 items

### `benefits`
Variants:
- `icon-list`
- `cards`
- `checklist`
- `contrast-bands`
- `before-after-benefits`

Required fields:
- `items[]`

Recommended minimum:
- 3 items

### `why-us`
Variants:
- `pillars`
- `comparison`
- `story-led`
- `stacked`

Required fields:
- `items[]`

Recommended minimum:
- 3 items

### `problem-solution`
Variants:
- `two-column`
- `stacked`
- `problem-first`
- `journey-shift`

Required fields:
- `problem`
- `solution`

### `use-cases`
Variants:
- `grid`
- `tabs`
- `cards`
- `industry-columns`

Required fields:
- `items[]`

Recommended minimum:
- 3 items

---

## Services / Offer

### `services`
Variants:
- `cards`
- `image-cards`
- `alternating-rows`
- `comparison`
- `stacked-list`
- `category-groups`

Required fields:
- `items[]`

Each item should support:
- `title`
- `description`
- optional `icon`
- optional `image`

Recommended minimum:
- 3 items

### `packages`
Variants:
- `cards`
- `stacked`
- `featured`
- `tier-highlight`

Required fields:
- `plans[]`

Recommended minimum:
- 2 plans

### `deliverables`
Variants:
- `list`
- `grid`
- `grouped`

Required fields:
- `items[]`

### `offer-stack`
Variants:
- `cards`
- `checklist`
- `tiered`

Required fields:
- `items[]`

---

## Process

### `how-it-works`
Variants:
- `numbered-steps`
- `timeline`
- `zigzag`
- `horizontal`
- `cards`

Required fields:
- `steps[]`

Each step should support:
- `step`
- `title`
- `description`

Recommended minimum:
- 3 steps

### `onboarding-flow`
Variants:
- `steps`
- `phases`
- `milestones`

Required fields:
- `steps[]`

### `methodology`
Variants:
- `cards`
- `rows`
- `principles`

Required fields:
- `items[]`

---

## Testimonials / Social Proof

### `testimonials`
Variants:
- `cards`
- `carousel`
- `avatars`
- `single-highlight`
- `grid`
- `masonry`

Required fields:
- `items[]`

Each item should support:
- `quote`
- `author`
- optional `role`
- optional `rating`
- optional `image`

Recommended minimum:
- 2 items

### `customer-stories`
Variants:
- `cards`
- `featured-story`
- `stacked`

Required fields:
- `items[]`

### `case-study-preview`
Variants:
- `grid`
- `spotlight`
- `before-after`

Required fields:
- `items[]`

---

## Results

### `results`
Variants:
- `stat-bar`
- `metric-cards`
- `full-section`
- `contrast-strip`

Required fields:
- `stats[]`

Each stat should support:
- `value`
- `label`

Recommended minimum:
- 2 stats

### `before-after`
Variants:
- `slider`
- `side-by-side`
- `story-pair`

Required fields:
- `items[]`

### `roi`
Variants:
- `cards`
- `calculator-teaser`
- `stats-led`

Required fields:
- `items[]` or `stats[]`

---

## Pricing

### `pricing`
Variants:
- `side-by-side`
- `single-featured`
- `table`
- `tier-comparison`
- `stacked-cards`
- `contrast-featured`

Required fields:
- `plans[]`

Each plan should support:
- `name`
- `price`
- `description`
- `features[]`

Recommended minimum:
- 2 plans

### `custom-quote`
Variants:
- `cta-box`
- `form-inline`
- `advisor-style`

Required fields:
- `heading`
- optional `subheading`
- `buttons[]`

### `billing-toggle`
Variants:
- `monthly-yearly`
- `usage-based`

Required fields:
- `plans[]`

---

## FAQ / Objections

### `faq`
Variants:
- `accordion`
- `two-column`
- `vertical`
- `side-panel`
- `categorized`
- `tabs`

Required fields:
- `items[]`

Each item should support:
- `question`
- `answer`

Recommended minimum:
- 4 items

### `objection-handling`
Variants:
- `cards`
- `qna`
- `comparison`

Required fields:
- `items[]`

### `myth-vs-fact`
Variants:
- `split-list`
- `cards`
- `table`

Required fields:
- `items[]`

---

## CTA / Conversion

### `cta-band`
Variants:
- `centered`
- `dual`
- `contact-strip`
- `whatsapp-focused`
- `demo`
- `booking`
- `urgency`

Required fields:
- `heading`
- `buttons[]`

Recommended optional fields:
- `subheading`
- `eyebrow`
- `badge`
- `supportingPoints[]`
- `trustChips[]`
- `ctaNote`

### `sticky-cta`
Variants:
- `bottom-bar`
- `floating-pill`
- `corner-button`

Required fields:
- `buttons[]`

---

## Contact / Lead Capture

### `contact`
Variants:
- `form-only`
- `form-with-info`
- `booking`
- `scheduler`
- `map-contact`
- `chat-first`

Required fields:
- `details[]`

Recommended optional fields:
- `heading`
- `subheading`
- `formFields[]`
- `buttons[]`

### `newsletter`
Variants:
- `inline`
- `box`
- `split`

Required fields:
- `heading`
- `button`

---

## About / Brand

### `about-team`
Variants:
- `story`
- `team-grid`
- `values`
- `founder-led`
- `culture-led`

Required fields:
- `items[]`

Recommended minimum:
- 2 items

### `founder-note`
Variants:
- `letter`
- `spotlight`
- `portrait`

Required fields:
- `heading`
- `body`

### `timeline`
Variants:
- `vertical`
- `milestones`
- `horizontal`

Required fields:
- `items[]`

---

## Gallery / Media

### `gallery`
Variants:
- `grid`
- `masonry`
- `carousel`
- `before-after`
- `captioned`

Required fields:
- `items[]`

Each item should support:
- `title`
- optional `description`
- optional `image`

Recommended minimum:
- 3 items

### `video-showcase`
Variants:
- `grid`
- `featured`
- `playlist`

Required fields:
- `items[]`

---

## Location / Coverage

### `service-area`
Variants:
- `list`
- `grid`
- `map-note`
- `city-groups`

Required fields:
- `areas[]`

Recommended minimum:
- 3 areas

### `locations`
Variants:
- `cards`
- `map`
- `branches`

Required fields:
- `items[]`

---

## Footer

### `footer`
Purpose:
- close the page cleanly
- provide navigation, trust, and contact continuity

Variants:
- `simple`
- `multi-column`
- `legal-heavy`
- `sitemap`
- `contact-heavy`
- `social-heavy`
- `newsletter`
- `location`
- `minimal-brand`
- `brand-story`
- `services-heavy`
- `cta-footer`
- `app-links`
- `community`
- `trust-heavy`
- `map-footer`
- `directory-style`
- `split-footer`
- `stacked-footer`
- `centered-footer`

Required fields:
- `companyName`
- `tagline`
- `columns[]`
- `copyrightYear`

Each column should support:
- `title`
- `links[]`

Each link should support:
- `text`
- `href`

Recommended minimum:
- 1 brand block
- 2 useful columns for most non-minimal variants

---

## Recommended First-Wave Product Registry

These are the best core section types to stabilize first:

- `top-nav`
- `hero`
- `trust-bar`
- `features`
- `benefits`
- `problem-solution`
- `how-it-works`
- `services`
- `testimonials`
- `results`
- `pricing`
- `faq`
- `cta-band`
- `contact`
- `about-team`
- `footer`

---

## Recommended Second-Wave Additions

- `logo-cloud`
- `gallery`
- `service-area`
- `customer-stories`
- `case-study-preview`
- `before-after`
- `newsletter`
- `founder-note`
- `locations`
- `video-showcase`

