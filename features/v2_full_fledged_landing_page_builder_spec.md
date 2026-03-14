# V2 Full-Fledged Landing Page Builder Spec

## Goal

Build a real landing page product, not just a text-section generator with light editing.

V2 should produce pages that feel publishable by default and editable in a deliberate, low-friction way. The system should support:

- complete page generation
- strong visual output
- structured editing
- real CTA/action handling
- image and brand management
- responsive preview
- publish-oriented settings

This spec is intentionally detailed so implementation does not drift into partial solutions.

---

## Problem Statement

The current system has improved generation workflow, but it is still incomplete as a practical landing page builder.

Current gaps:

- call, WhatsApp, email, and CTA links are not modeled cleanly
- buttons are not first-class editable elements
- media is too placeholder-heavy
- icon handling is generic rather than semantic
- hero sections are not visually strong enough by default
- editor is still section-heavy rather than element-aware
- users do not have enough control over layout variants
- publish settings are weak
- mobile preview is missing
- footer, logo, brand assets, and reusable action handling are incomplete

The result is that users can generate a page, but still cannot reliably finish and publish a polished one.

---

## V2 Product Definition

V2 should be a schema-driven landing page builder with:

1. AI-assisted page generation
2. structured page document as source of truth
3. reusable actions for CTAs
4. asset management
5. section library with variants
6. block/element-level editing
7. responsive preview
8. publish-oriented metadata and settings

The product should feel closer to a lightweight website builder than a one-shot AI output tool.

---

## V2 Success Criteria

V2 is successful if a user can:

1. create a project
2. provide minimal business context
3. get a full page plan and generated draft
4. edit text, images, buttons, and section variants
5. configure call/WhatsApp/email/URL actions cleanly
6. preview the page in desktop and mobile modes
7. save and publish a usable page without manual code edits

A generated page should usually include:

- hero
- trust bar or social proof
- services/features
- benefits or problem/solution
- process/how-it-works
- testimonials
- FAQ
- CTA band
- contact
- footer

---

## Core Product Principles

### 1. Schema First

The canonical source of truth must be a structured page document, not raw HTML.

AI should generate:

- structured content
- strategy
- semantic visual intent
- image prompts
- CTA intent

Code should handle:

- validation
- document assembly
- rendering
- editor manipulation
- persistence

### 2. Reusable Actions

Buttons and interactive CTAs must not store arbitrary raw href strings everywhere.

Use reusable action objects with typed behavior.

### 3. Asset-Based Media

All images, icons, and media should flow through a project asset system.

### 4. Deterministic Rendering

The renderer should convert structured sections to page HTML/components in a predictable way.

### 5. Graceful Fallbacks

Preferred order for media:

1. user-uploaded assets
2. AI-generated assets
3. placeholders

---

## Scope

### In Scope for V2

- richer page generation
- better hero visuals
- image generation and image uploads
- reusable CTA/action system
- section variants
- element-level editing
- mobile preview
- page settings
- publish/unpublish state
- better footer support
- logo upload
- stronger document model

### Out of Scope for Initial V2

- custom domain management
- analytics dashboard UI
- production form backend with CRM integrations
- full undo/redo timeline
- full stock image provider integration
- collaborative multi-user editing

These can come later.

---

## Required V2 Features

## 1. Page Types

Support at least:

- local-business
- service-business
- saas
- coach
- product-sales

The generator should choose one or allow the user to guide it.

## 2. Theme Variants

Support at least:

- clean
- bold
- premium
- playful

Each theme should influence:

- typography
- colors
- section spacing
- button styles
- card treatment
- hero layout direction

## 3. Section Library

Support these section types:

- hero
- trust-bar
- features
- benefits
- problem-solution
- how-it-works
- services
- testimonials
- results
- pricing
- faq
- cta-band
- contact
- footer
- gallery
- service-area
- about/team when relevant

Each section type must define:

- content schema
- supported variants
- supported asset slots
- editor controls
- default fallback content
- renderer behavior

## 4. Action System

This is mandatory for V2.

Supported action types:

- url
- phone
- email
- whatsapp
- scroll
- form

Examples:

- phone => `tel:+918882567801`
- email => `mailto:prabhatlnct2008@gmail.com`
- whatsapp => `https://wa.me/918882567801?text=Hi%20I%20want%20to%20know%20more`
- scroll => `#contact`

The editor must allow users to configure these without writing raw URLs manually.

## 5. Media / Asset System

Support:

- hero image
- card images
- testimonial avatars
- gallery images
- section background images
- logo image

Asset operations:

- upload
- replace
- remove
- assign to section
- alt text edit

## 6. Editor Upgrades

The editor must support:

- add section
- choose section variant
- change section variant later
- reorder section
- duplicate section
- hide/show section
- delete section
- edit text blocks
- edit buttons
- add/remove/reorder card items
- assign or replace images
- manage actions

## 7. Preview / Settings

Support:

- desktop preview
- tablet preview
- mobile preview
- slug editing
- SEO title
- SEO description
- publish/unpublish status

---

## Canonical Data Model

## PageDocument

Suggested shape:

```ts
type PageDocument = {
  meta: MetaSettings
  brand: BrandSettings
  assets: Asset[]
  actions: Action[]
  sections: Section[]
}
```

## MetaSettings

```ts
type MetaSettings = {
  title: string
  description: string
  pageType: "local-business" | "service-business" | "saas" | "coach" | "product-sales"
  themeVariant: "clean" | "bold" | "premium" | "playful"
  slug?: string
  publishStatus?: "draft" | "published"
}
```

## BrandSettings

```ts
type BrandSettings = {
  tone: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  logoAssetId?: string
}
```

## Action

```ts
type Action = {
  id: string
  label: string
  type: "url" | "phone" | "email" | "whatsapp" | "scroll" | "form"
  value: string
  openInNewTab?: boolean
  metadata?: {
    whatsappMessage?: string
    scrollTargetId?: string
    formId?: string
  }
}
```

## Asset

```ts
type Asset = {
  id: string
  kind: "image" | "icon" | "video"
  source: "upload" | "ai" | "placeholder" | "stock"
  url: string
  alt?: string
}
```

## Section

```ts
type Section = {
  id: string
  type: string
  variant: string
  visible: boolean
  order: number
  content: Record<string, unknown>
  style: Record<string, unknown>
  assets?: {
    imageIds?: string[]
    backgroundImageId?: string
    iconIds?: string[]
  }
}
```

---

## CTA / Action Modeling Rules

These rules are critical.

### Rule 1

Buttons should not store direct final URLs in content fields when an action can be referenced by ID.

Preferred:

```ts
{
  text: "Chat on WhatsApp",
  actionId: "action_whatsapp_primary"
}
```

Not preferred:

```ts
{
  text: "Chat on WhatsApp",
  href: "https://wa.me/..."
}
```

### Rule 2

Sections should be able to reuse actions across the page.

### Rule 3

WhatsApp actions should support an optional prefilled message.

### Rule 4

Phone and email actions should be typed and normalized.

---

## Image and Visual Strategy

## Why This Matters

Current placeholders are not enough for a polished landing page.

The hero should usually be visual.
Services and features often need supporting visuals.
Icons should be semantically relevant.

## Required V2 Visual Strategy

### Hero

Every generated page should explicitly choose one hero visual mode:

- split-image
- background-image
- centered-minimal
- product-showcase

For local-business and service-business, default to:

- split-image
- or background-image

Do not default to empty text-only hero unless intentionally chosen.

### Images

For each page, asset planning should decide:

- which sections require images
- what type of images are needed
- whether to generate or use upload/placeholder

### Icons

Do not use generic final icon tokens like `briefcase` as the visible UX choice.

Instead:

- let AI generate semantic icon intent
- map icon intent to a curated icon set in code

Example:

```ts
iconIntent: "training"
iconIntent: "trust"
iconIntent: "speed"
iconIntent: "safety"
iconIntent: "results"
```

Then renderer maps those to proper SVG/icon components.

---

## AI Image Generation Requirements

V2 should add a proper image generation stage.

Suggested pipeline:

1. asset_planning
2. image_prompt_generation
3. image_generation
4. content_generation
5. document_assembly

### Requirements

- generate hero image prompts from business context and page strategy
- generate optional image prompts for services/features/testimonials/results
- store generated images as Asset records
- mark generated assets with `source = "ai"`
- attach assets to sections by asset ID

### Fallback Order

1. uploaded image
2. AI-generated image
3. placeholder image

### Hero Image Prompt Example

For dog training:

- warm, trustworthy, premium local business aesthetic
- trainer interacting with dog
- family-friendly and believable visual
- avoid surreal or stock-looking results

The prompt generator should use:

- business type
- target audience
- tone
- page type
- theme variant
- service differentiators

---

## Generation Workflow for V2

Recommended workflow states:

- intake
- strategy_generation
- theme_generation
- asset_planning
- image_prompt_generation
- image_generation
- plan_review
- content_generation
- document_assembly
- rendering
- complete
- failed

### Workflow Responsibilities

#### intake
- extract structured business profile

#### strategy_generation
- decide page type
- decide section order
- decide CTA strategy

#### theme_generation
- choose colors, fonts, density, section mood

#### asset_planning
- determine image slots and icon intent needs

#### image_prompt_generation
- create image prompts per required asset

#### image_generation
- generate hero and section assets

#### plan_review
- user approves or requests changes

#### content_generation
- generate section content and semantic element details

#### document_assembly
- build canonical PageDocument

#### rendering
- render HTML from document

---

## Editor V2 Architecture

The editor should move to a clear three-pane model.

## Left Sidebar

- section list
- add section
- reorder sections
- page settings tab
- brand tab
- assets tab
- actions tab

## Center Canvas

- live rendered page
- section hover controls
- inline text editing where practical
- click-to-select element

## Right Inspector

- selected section settings
- selected element settings
- style controls
- button/action controls
- image assignment controls

## Top Toolbar

- save
- publish state
- desktop/tablet/mobile preview toggle
- version indicator
- open public page

---

## Editor V2 Functional Requirements

## Section-Level Controls

- add section
- duplicate section
- delete section
- move section up/down
- hide/show section
- change section variant

## Item-Level Controls

For repeatable lists:

- add feature
- remove feature
- reorder feature
- duplicate feature

Same for:

- services
- testimonials
- pricing plans
- FAQ items
- footer columns
- trust bar items

## Button-Level Controls

Users must be able to:

- add button
- remove button
- edit button label
- pick action
- change button style

## Image Controls

Users must be able to:

- upload image
- replace image
- remove image
- assign existing asset
- edit alt text

## Brand Controls

Users must be able to:

- upload logo
- set primary color
- set secondary color
- set accent color
- set heading font
- set body font

---

## Required Section Variants

## Hero

- centered
- split-image
- background-image
- offer-focused

## Features

- icon-grid
- image-cards
- list-with-icons

## Services

- cards
- image-cards
- alternating rows

## Testimonials

- cards
- avatars
- single-highlight + quotes

## CTA

- centered single CTA
- dual CTA
- contact strip
- WhatsApp-focused CTA

## Footer

- simple footer
- multi-column footer
- legal-heavy footer

---

## Missing Features That Must Be Addressed in V2

The current plan explicitly excludes several items. V2 should include these if the goal is a serious builder.

### Must-Have for V2

- mobile preview toggle
- logo upload
- stronger image handling
- CTA/action editing
- publish settings
- richer footer support
- better hero visuals

### Should-Have for V2

- theme switcher or at least theme variant controls
- gallery section
- service area/map section
- analytics hooks
- form submission configuration

### Later

- undo/redo
- stock image API integration
- custom domains
- analytics dashboards

---

## Technical Architecture Recommendation

Do not build a swarm of autonomous agents.

Use:

- one workflow orchestrator
- multiple specialized generation modules
- structured state transitions
- validated structured outputs

Suggested folder structure:

```text
lib/
  workflow/
    engine.ts
    runner.ts
    transitions.ts
    types.ts
  ai/
    intake.ts
    strategist.ts
    theme-generator.ts
    asset-planner.ts
    image-prompt-generator.ts
    image-generator.ts
    section-generator.ts
    seo-generator.ts
  page/
    schema.ts
    renderer.ts
    section-library.ts
    validators.ts
  actions/
    normalizer.ts
    resolvers.ts
  assets/
    upload.ts
    placeholders.ts
```

---

## Database Changes Recommended

If the current DB does not yet capture everything below, add it.

### Asset

Keep and expand Asset support as needed.

### Page / PageVersion

Persist the full canonical page document.

### Optional: PageAction Table

If actions should be normalized in DB instead of only embedded in `documentJson`, introduce one. If not, keep actions inside the page document and version the whole document.

### Optional: Publish Settings

If publish settings expand, either:

- keep them in document meta
- or introduce a separate settings object/table

---

## Renderer Rules

The renderer must:

- render from structured document
- resolve asset references
- resolve action references
- produce semantic HTML
- remain deterministic

The renderer must not depend on AI to provide raw layout HTML as the source of truth.

---

## Quality Rules

Claude should implement a post-generation quality pass that validates:

- hero exists
- footer exists
- at least one CTA appears above the fold
- hero has a visual if page type expects one
- section titles are not generic
- no placeholder copy like `Feature 1`, `Our Services`, `Welcome to Our Business`
- no irrelevant icon defaults like `briefcase` for unrelated businesses
- CTA labels and actions are valid
- images and alt text are attached where expected

If validation fails:

- repair the document
- or rerun the relevant generation stage

---

## Priority Order for Implementation

## Phase A

- action system
- button editing
- hero image support improvements
- logo upload
- image upload and assignment

## Phase B

- section variants
- richer editor inspector
- mobile preview
- page settings

## Phase C

- AI image generation
- semantic icon system
- gallery and service area sections
- stronger footer and publish polish

---

## Explicit Implementation Requests for Claude

If Claude is implementing this, the following must be treated as hard requirements:

1. Introduce a reusable Action model for call, WhatsApp, email, URL, scroll, and form.
2. Buttons must reference actions by ID rather than storing arbitrary href strings everywhere.
3. Hero sections must support image-driven variants and prefer them by default for local/service pages.
4. Add image generation and upload support using the existing Asset pipeline.
5. Replace generic icon strings as visible output with semantic icon intent plus a curated icon renderer.
6. Extend the editor to support element-level editing, not just section-level editing.
7. Add desktop/tablet/mobile preview.
8. Add slug and SEO settings.
9. Ensure footer and CTA strategy are always present in generated pages.
10. Keep the whole system schema-driven and render from PageDocument.

---

## Non-Negotiable Outcomes

When V2 is done, the user must be able to:

- generate a visually credible landing page
- configure call and WhatsApp buttons cleanly
- replace hero images and section images
- add/remove sections and buttons
- edit all key text and CTA elements
- preview on mobile
- publish a complete page with footer and proper CTA behavior

If these are not possible, V2 is still incomplete.
