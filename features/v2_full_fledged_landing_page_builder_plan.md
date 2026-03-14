# V2 Full-Fledged Landing Page Builder — Corrected Implementation Plan

## Purpose

This plan is the implementation companion to:

- [v2_full_fledged_landing_page_builder_spec.md](/Users/sonalidixit/Desktop/2026 softwares/ai_html_pub/features/v2_full_fledged_landing_page_builder_spec.md)

It replaces the earlier editor-heavy plan with one that aligns to the actual V2 requirements:

- reusable CTA/action system
- asset-first media architecture
- schema-driven editing
- stronger hero/media output
- AI image generation included in V2
- element-level editing, not just section-level editing

This plan is designed to be concrete enough that implementation does not collapse into partial UX polish while skipping the core architecture.

---

## Guiding Principles

1. Keep `PageDocument` as the canonical source of truth.
2. Do not store arbitrary raw links everywhere; use reusable `Action` objects.
3. Do not store image URLs directly as the primary section contract; use asset references.
4. Keep rendering deterministic and code-driven.
5. Add orchestration for document generation stages, but do not build a multi-agent swarm.
6. V2 must solve actual publishing problems, not only improve editor cosmetics.

---

## What V2 Must Deliver

### User-facing outcomes

When V2 is complete, the user must be able to:

1. generate a page with a visual hero and complete footer
2. configure phone, WhatsApp, email, URL, and scroll CTAs cleanly
3. upload or replace hero and section images
4. use AI-generated images when uploads are not provided
5. add, remove, reorder, duplicate, hide, and variant-switch sections
6. edit buttons, cards, trust points, FAQ items, pricing plans, and footer links
7. preview in desktop, tablet, and mobile modes
8. edit slug, SEO title, and meta description
9. publish a clean public page with correct CTA behavior

### Non-negotiable technical outcomes

V2 must include:

- `actions` in `PageDocument`
- asset-ID-based media references
- AI image generation stage in workflow
- semantic icon intent in generation
- element-level editing support
- validation/quality pass before final render

---

## What Is Wrong With The Previous Plan

The previous plan under-scoped several mandatory V2 requirements:

- it did not implement the `Action` system
- it proposed storing image URLs directly inside section content
- it pushed AI image generation to a later phase
- it focused heavily on editor panels but not enough on element data structures
- it assumed generation quality was already mostly solved

This corrected plan fixes those problems.

---

## Delivery Strategy

Implement V2 in four major tracks:

1. Foundation and data model
2. Workflow and generation improvements
3. Editor and interaction model
4. Publish quality and validation

These tracks are sequenced so that later UI work is built on the correct data model.

---

## Track 1: Foundation and Data Model

## Step 1.1: Fix Existing V1.5 Stability Issues

### Goals

Fix current workflow/editor regressions before building more features.

### Work

- fix builder polling for all workflow states
- fix current style key compatibility issues
- ensure public page route and editor route work after latest refactors
- verify current Prisma schema and generated client are in sync

### Files likely involved

- `app/projects/[id]/builder/page.tsx`
- `components/editor/SectionWrapper.tsx`
- `lib/workflow/engine.ts`
- `prisma/schema.prisma`

### Exit criteria

- full workflow reaches editor without freezing
- public page renders
- `next build` passes

---

## Step 1.2: Introduce the Action System

### Goals

Create a reusable, typed CTA/action model that solves:

- phone call links
- WhatsApp links
- email links
- URL links
- scroll links
- future form actions

### Work

- extend `PageDocument` to include `actions`
- define `Action` schema exactly as described in the spec
- create action normalizer and resolver utilities
- migrate sections that currently contain CTA href strings to use `actionId`
- add fallback compatibility for legacy content during migration

### New/updated modules

- `lib/page/schema.ts`
- `lib/actions/normalizer.ts`
- `lib/actions/resolvers.ts`
- `lib/page/validators.ts`

### Key rules

- buttons store `actionId`, not raw final hrefs
- WhatsApp supports prefilled message metadata
- phone and email values are normalized
- scroll actions target real section IDs

### Exit criteria

- hero, CTA, contact, pricing, footer links can all resolve actions
- call and WhatsApp actions are configurable in a structured way

---

## Step 1.3: Strengthen Asset-First Media Architecture

### Goals

Ensure all media flows through the project asset model cleanly.

### Work

- confirm `Asset` model is sufficient; expand if needed
- keep section media references as asset IDs
- do not store uploaded image URLs as the primary content contract
- add helper utilities for attaching/removing/replacing assets in sections
- add alt text support and validation

### New/updated modules

- `lib/page/schema.ts`
- `lib/assets/upload.ts`
- `lib/assets/placeholders.ts`
- `lib/page/validators.ts`

### Exit criteria

- hero and repeatable sections reference assets by ID
- uploaded images and generated images can be swapped without mutating schema shape

---

## Step 1.4: Strengthen Section Content Contracts

### Goals

Move from generic section content editing to typed element-level structures.

### Work

- verify typed content contracts for all major section types
- add support for button arrays where relevant
- add repeatable item schemas for:
  - features
  - services
  - testimonials
  - pricing plans
  - FAQ items
  - footer columns
  - trust bar items
- add semantic icon intent fields where applicable

### Important requirement

Do not rely on generic `Record<string, unknown>` manipulation in editor logic where typed section helpers can be used.

### Exit criteria

- section data is stable enough for inspector-driven editing
- repeatable items have clear reducer operations

---

## Track 2: Workflow and Generation Improvements

## Step 2.1: Upgrade Workflow States

### Goals

Align workflow with V2 generation needs.

### Required workflow states

- `intake`
- `strategy_generation`
- `theme_generation`
- `asset_planning`
- `image_prompt_generation`
- `image_generation`
- `plan_review`
- `content_generation`
- `document_assembly`
- `rendering`
- `complete`
- `failed`

### Work

- update workflow types and transitions
- ensure frontend polling covers all V2 states
- ensure workflow status messages are human-readable
- preserve retry support

### Exit criteria

- workflow can progress end-to-end with image steps included
- builder progress reflects actual state accurately

---

## Step 2.2: Strategy Generation

### Goals

Generate a more intentional page strategy before content creation.

### Responsibilities

- choose page type
- choose section sequence
- determine CTA strategy
- choose hero visual mode
- determine whether gallery/about/service-area sections are relevant

### New module

- `lib/ai/strategist.ts`

### Output requirements

Strategy output must include:

- `pageType`
- `themeVariant`
- `heroVariant`
- `sectionSequence`
- `ctaStrategy`
- `visualNeeds`

### Exit criteria

- strategy drives later generation deterministically

---

## Step 2.3: Theme Generation

### Goals

Create a coherent visual system, not random colors/fonts.

### Responsibilities

- choose primary/secondary/accent colors
- choose heading/body fonts
- choose spacing density
- choose card/button treatment
- align choices to page type and tone

### New module

- `lib/ai/theme-generator.ts`

### Exit criteria

- hero, cards, buttons, and section backgrounds feel consistent

---

## Step 2.4: Asset Planning

### Goals

Determine required image slots and semantic icon needs before content assembly.

### Responsibilities

- choose which sections require images
- choose hero image requirements
- choose section image requirements
- choose testimonial avatar requirements
- define semantic icon intents per section/item

### New/updated modules

- `lib/ai/asset-planner.ts`

### Important rule

Asset planning should produce asset needs and semantic intent, not final rendered URLs embedded in content.

### Exit criteria

- every visual section has an asset plan
- semantic icon intent is available for rendering/editor use

---

## Step 2.5: Image Prompt Generation

### Goals

Generate high-quality image prompts for required assets.

### Responsibilities

- create hero image prompt
- create optional prompts for services/features/testimonials/results
- derive prompts from:
  - business type
  - tone
  - target audience
  - page type
  - theme variant
  - differentiators

### New module

- `lib/ai/image-prompt-generator.ts`

### Exit criteria

- prompts are business-specific and visually directed

---

## Step 2.6: Image Generation

### Goals

Generate real hero/section visuals in V2, not only placeholders.

### Responsibilities

- call image generation API/service
- store generated images as `Asset` records
- mark assets with `source = "ai"`
- attach assets to planned sections
- fall back to placeholders if generation fails

### New module

- `lib/ai/image-generator.ts`

### Fallback order

1. uploaded image
2. AI-generated image
3. placeholder image

### Exit criteria

- generated pages can have AI-generated hero visuals
- asset records are usable by editor and renderer

---

## Step 2.7: Content Generation

### Goals

Generate specific, non-generic section content.

### Responsibilities

- produce business-specific copy
- produce semantic button/action intent
- produce semantic icon intent
- avoid generic titles like:
  - `Welcome to Our Business`
  - `Our Services`
  - `Feature 1`

### New/updated modules

- `lib/ai/section-generator.ts`
- `lib/ai/prompts/*`

### Exit criteria

- output feels authored for the business, not template-ish

---

## Step 2.8: Document Assembly

### Goals

Assemble the final `PageDocument` using:

- strategy
- theme
- assets
- actions
- sections

### Responsibilities

- create reusable `Action` objects
- assign action IDs to buttons
- assign asset IDs to sections/items
- set section variants
- ensure section order and visibility are valid

### Important rule

The final source of truth is `PageDocument`, not generated raw HTML.

### Exit criteria

- renderer can build a full page from assembled document alone

---

## Step 2.9: Quality Pass

### Goals

Validate the generated document before render and publish.

### Checks

- hero exists
- footer exists
- at least one CTA above the fold
- hero has image if page type expects it
- actions resolve correctly
- no generic placeholder titles
- no irrelevant generic icon defaults
- images and alt text exist where required
- contact section uses real business contact info where available

### New module

- `lib/page/validators.ts`

### Repair strategy

- fix deterministically where possible
- rerun targeted generation stage if necessary

### Exit criteria

- final output passes document-level validation

---

## Track 3: Editor and Interaction Model

## Step 3.1: Editor Layout Refactor

### Goals

Move to a true three-pane editing experience.

### Layout

- left: structure/navigation panel
- center: live canvas
- right: contextual inspector

### New files

- `components/editor/EditorSidebar.tsx`
- `components/editor/EditorInspector.tsx`

### Exit criteria

- page editing no longer depends on ad hoc inline-only manipulation

---

## Step 3.2: Editor State Model Expansion

### Goals

Support true element-level editing through structured reducer actions.

### Required reducer capabilities

- update page meta
- update brand
- add/update/delete action
- add/update/remove/replace asset reference
- add/remove/reorder sections
- duplicate/hide/show section
- change section variant
- add/remove/reorder repeatable items
- add/remove/update buttons

### Files

- `components/editor/EditorContext.tsx`

### Exit criteria

- editor can manipulate the full `PageDocument`, not just text blobs

---

## Step 3.3: Section Structure Panel

### Goals

Give users control over overall page composition.

### Features

- section list
- add section
- move section up/down
- duplicate section
- hide/show section
- delete section
- variant switcher

### Files

- `components/editor/SectionListPanel.tsx`
- `components/editor/VariantPicker.tsx`

### Exit criteria

- user can control section structure without editing JSON-like content

---

## Step 3.4: Element Inspector

### Goals

Support element-level editing for selected section content.

### Inspector capabilities

- text fields
- repeatable item editor
- button editor
- CTA/action picker
- image assignment
- style controls

### Specific editing targets

- hero eyebrow, heading, subheading, trust points, buttons
- features/services cards
- testimonials items
- pricing plans
- FAQ items
- footer columns and links

### Files

- `components/editor/SectionSettingsPanel.tsx`
- `components/editor/RepeatableItemEditor.tsx`
- `components/editor/ButtonEditor.tsx`
- `components/editor/StyleControls.tsx`

### Exit criteria

- user can add/remove/reorder buttons and card items

---

## Step 3.5: Actions Panel

### Goals

Make CTA behavior first-class and reusable.

### Features

- create action
- edit action
- delete action
- preview resolved link
- choose type: url / phone / email / whatsapp / scroll / form
- configure WhatsApp prefilled message

### Files

- `components/editor/ActionsPanel.tsx`

### Exit criteria

- call and WhatsApp buttons are easy to configure correctly

---

## Step 3.6: Assets Panel

### Goals

Make media manageable and reusable.

### Features

- upload asset
- list uploaded assets
- list AI-generated assets
- replace assigned image
- remove image
- edit alt text
- assign existing asset to selected section

### Files

- `components/editor/AssetsPanel.tsx`
- `components/editor/ImageUploadButton.tsx`

### Exit criteria

- users can control hero and section imagery without breaking content structure

---

## Step 3.7: Theme and Page Settings Panel

### Goals

Support global editing and publish-facing metadata.

### Features

- title
- meta description
- slug
- publish status
- primary/secondary/accent colors
- heading/body font
- logo assignment

### Files

- `components/editor/ThemePanel.tsx`
- `components/editor/PageSettingsPanel.tsx`

### Exit criteria

- users can control page identity and SEO without leaving the editor

---

## Step 3.8: Preview Modes

### Goals

Support responsive verification in editor.

### Modes

- desktop
- tablet
- mobile

### Files

- `components/editor/EditorToolbar.tsx`
- `components/editor/EditorCanvas.tsx`

### Exit criteria

- users can preview mobile layout before publishing

---

## Step 3.9: AI Section Regeneration

### Goals

Allow targeted AI refinement within the editor.

### Features

- regenerate selected section
- optional instructions
- preserve schema shape
- preserve asset references where possible

### Files

- `components/editor/RegenerateDialog.tsx`
- `lib/ai/section-updater.ts`
- `app/api/projects/[id]/page/regenerate/route.ts`

### Exit criteria

- user can improve one section without rerunning the whole page

---

## Track 4: Publish Quality and Delivery

## Step 4.1: Renderer Improvements

### Goals

Improve final page quality and semantics.

### Requirements

- resolve actions correctly
- resolve asset references correctly
- better SEO tags
- OG tags
- structured data where relevant
- image alt text
- accessible button labels
- cleaner footer rendering
- stable anchor IDs for scroll actions

### Files

- `lib/page/renderer.ts`

### Exit criteria

- published page reflects final document accurately and accessibly

---

## Step 4.2: Publish Flow

### Goals

Make publish/update a clear workflow.

### Features

- explicit publish button
- slug editing
- preview public URL
- publish/unpublish state
- save latest rendered snapshot

### Files

- `components/editor/PublishDialog.tsx`
- `app/api/projects/[id]/publish/route.ts`
- `components/editor/EditorToolbar.tsx`

### Exit criteria

- user can reliably publish and revisit the final page

---

## Step 4.3: Backward Compatibility

### Goals

Avoid breaking older projects while migrating architecture.

### Work

- legacy href fields can be normalized into `Action` objects when loading
- legacy asset URLs can be wrapped/mapped into assets when loading
- legacy style keys can be normalized
- old projects should open in editor without hard failure

### Exit criteria

- existing projects load and can be upgraded lazily

---

## Proposed File Inventory

## New Files

- `lib/actions/normalizer.ts`
- `lib/actions/resolvers.ts`
- `lib/ai/strategist.ts`
- `lib/ai/theme-generator.ts`
- `lib/ai/image-prompt-generator.ts`
- `lib/ai/image-generator.ts`
- `lib/page/validators.ts`
- `components/editor/EditorSidebar.tsx`
- `components/editor/EditorInspector.tsx`
- `components/editor/SectionListPanel.tsx`
- `components/editor/RepeatableItemEditor.tsx`
- `components/editor/ButtonEditor.tsx`
- `components/editor/ActionsPanel.tsx`
- `components/editor/AssetsPanel.tsx`
- `components/editor/PageSettingsPanel.tsx`
- `components/editor/PublishDialog.tsx`

## Major Modified Files

- `lib/page/schema.ts`
- `lib/workflow/types.ts`
- `lib/workflow/transitions.ts`
- `lib/workflow/runner.ts`
- `lib/workflow/engine.ts`
- `lib/ai/asset-planner.ts`
- `lib/ai/section-generator.ts`
- `lib/ai/section-updater.ts`
- `lib/page/renderer.ts`
- `components/editor/EditorContext.tsx`
- `components/editor/EditorCanvas.tsx`
- `components/editor/EditorToolbar.tsx`
- `components/editor/SectionWrapper.tsx`
- `components/editor/SectionControls.tsx`
- `app/projects/[id]/builder/page.tsx`
- `app/projects/[id]/editor/page.tsx`
- `app/api/projects/[id]/page/regenerate/route.ts`
- `app/api/projects/[id]/publish/route.ts`

---

## Recommended Delivery Phases

## Phase A: Foundation

- fix current workflow bugs
- add `Action` model to document
- add resolver/normalizer layer
- keep assets reference-based
- normalize legacy data

## Phase B: Generation Upgrade

- strategy generation
- theme generation
- asset planning
- image prompt generation
- AI image generation
- document assembly
- quality validation

## Phase C: Editor Upgrade

- three-pane editor
- section list and variants
- element inspector
- actions panel
- assets panel
- preview modes

## Phase D: Publish Quality

- renderer improvements
- publish flow
- metadata/SEO
- backward compatibility hardening

---

## Final Note For Implementation

If implementation pressure forces tradeoffs, do not cut:

- action system
- asset-ID-based media architecture
- AI image generation for at least hero images
- element-level editing support

Those are not optional polish items. They are the core of V2.
