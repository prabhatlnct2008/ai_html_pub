# V1 Full Page Generator - Implementation Plan

## Current State Summary

The codebase already has a working workflow engine (`lib/workflow/`), 7 section types (hero, features, testimonials, pricing, faq, cta, contact), an editor with inline editing/reorder/delete/duplicate/add, and a sequential generation pipeline. The main gaps are: no image support, limited section types, no section variants, no footer, no structured document schema, and monolithic section generation.

---

## Phase 1 Implementation (This PR)

### Step 1: PageDocument Schema & Section Library Types
**Files:** `lib/page/schema.ts`, `lib/page/section-library.ts`

- Define `PageDocument`, `Section`, `Asset`, `Brand`, `PageMeta` types
- Define all 15 section types with typed content interfaces:
  - **Existing (enhanced):** hero, features, testimonials, pricing, faq, cta, contact
  - **New:** trust-bar, benefits, problem-solution, how-it-works, services, results, cta-band, footer
- Define variants per section type (e.g., hero: "split-image" | "centered" | "full-bleed")
- Define asset slot declarations per section type
- Add `pageType` enum: local-business, service-business, saas, coach, product-sales
- Add `themeVariant` enum: clean, bold, premium, playful

### Step 2: Database Changes
**Files:** `prisma/schema.prisma`

- Add `Asset` model (id, projectId, kind, source, url, altText, createdAt)
- Add `pageType` and `themeVariant` fields to `Page` model
- Add `documentJson` field to `Page` model (stores full PageDocument)
- Update `PageVersion` to snapshot `documentJson`
- Run `prisma db push`

### Step 3: Asset Upload System
**Files:** `lib/assets/upload.ts`, `lib/assets/placeholders.ts`, `app/api/projects/[id]/assets/route.ts`

- Upload endpoint: accepts image files, stores to `public/uploads/{projectId}/`, creates Asset record
- Placeholder system: returns placeholder image URLs by category (business, people, abstract) when no user image exists
- GET endpoint to list project assets

### Step 4: Section Renderers
**Files:** `lib/page/renderers/` (one file per section type or grouped), `lib/page/renderer.ts`

- Refactor `lib/html-renderer.ts` into a dispatch-based renderer
- Each section type gets a render function that takes typed content + variant + brand + assets → HTML string
- Renderer reads from PageDocument schema, not raw untyped JSON
- Support image slots: hero images, feature icons, testimonial avatars, background images
- Render placeholder images when asset slots are empty
- All HTML is responsive with mobile-first CSS
- Footer renderer with columns, links, legal text, social icons

### Step 5: AI Generation Pipeline Refinement
**Files:** `lib/ai/strategist.ts`, `lib/ai/theme-generator.ts`, `lib/ai/asset-planner.ts`, update `lib/ai/generator.ts`, update prompts

- **strategist.ts**: Given business context, choose pageType, determine section sequence (which of the 15 types to include and in what order), define CTA strategy
- **theme-generator.ts**: Given business context + pageType, generate brand object (colors, fonts, tone)
- **asset-planner.ts**: Given section plan, determine which sections need images and what kind
- **Refactor generator.ts**: Generate content per-section-type with type-specific prompts that output typed content matching the section schemas. Generate one section at a time instead of all at once with a single prompt.
- Add structured output validation: each AI response is validated against the section's content schema before accepting

### Step 6: Workflow Engine Updates
**Files:** `lib/workflow/types.ts`, `lib/workflow/runner.ts`, `lib/workflow/transitions.ts`, `lib/workflow/engine.ts`

- Add new states: `strategy_generation`, `theme_generation`, `asset_planning`, `document_assembly`
- Updated flow: intake → intake_complete → [competitor_analysis] → strategy_generation → theme_generation → asset_planning → plan_generation → plan_review → content_generation → document_assembly → rendering → saving → complete
- `strategy_generation`: calls strategist.ts → stores pageType + section sequence
- `theme_generation`: calls theme-generator.ts → stores brand object
- `asset_planning`: calls asset-planner.ts → creates placeholder Assets
- `document_assembly`: assembles final PageDocument from generated sections + brand + assets
- Update progress percentages for new states
- Update step definitions for UI display

### Step 7: Editor Enhancements
**Files:** `components/editor/EditorContext.tsx`, `components/editor/EditorCanvas.tsx`, `components/editor/SectionWrapper.tsx`, `components/editor/AddSectionMenu.tsx`

- Update AddSectionMenu to show all 15 section types with descriptions
- Add variant selector when adding a section (dropdown or cards showing variant options)
- Update SectionWrapper to render section type labels with the new types
- Add image upload button in sections that have asset slots (hero, features, testimonials, etc.)
- Image upload triggers POST to asset endpoint, updates section's asset references
- Update EditorContext actions for asset management
- Ensure all new section types have proper inline editing support

### Step 8: API Route Updates
**Files:** `app/api/projects/[id]/page/route.ts`, `app/api/projects/[id]/page/regenerate/route.ts`

- Page GET/PUT: read/write PageDocument alongside sectionsJson for backward compat
- Regenerate: use typed section schemas for regeneration prompts
- Save: store documentJson in Page, snapshot in PageVersion

### Step 9: Builder UI Updates
**Files:** `components/builder/WorkflowProgress.tsx`, `app/projects/[id]/builder/page.tsx`

- Add new step labels for strategy_generation, theme_generation, asset_planning, document_assembly
- Update progress bar to reflect new state count
- Show theme preview during theme_generation step (colors, fonts)

### Step 10: Build Verification & Cleanup
- Run `next build` to verify no type errors
- Test the full flow: create project → intake → workflow → editor → publish
- Remove any dead code from old renderer

---

## What This Does NOT Include (Phase 2+)

- Multiple theme variant previews / theme switcher UI
- Stock image API integration
- Mobile preview toggle in editor
- Undo/redo
- Publish settings / custom domains
- Analytics / form submissions
- Gallery section
- Service area map integration
- Logo upload in brand settings

---

## Migration Strategy

- Existing projects keep working: the renderer falls back to old sectionsJson if documentJson is absent
- New projects use the full PageDocument pipeline
- Editor works with both old and new section formats (new sections have typed content, old sections use generic Record<string, unknown>)

---

## Key Architectural Decisions

1. **PageDocument is the source of truth** — HTML is always rendered from it, never stored as the canonical format
2. **One orchestrator, specialized modules** — No agent swarm, just a workflow engine calling specialist functions
3. **Section library is code, not AI** — Section schemas, variants, and renderers are defined in code. AI fills in the content fields.
4. **Assets are project-scoped** — Each project has its own asset collection. Sections reference assets by ID.
5. **Backward compatible** — Old projects don't break. New fields are optional in the DB.
