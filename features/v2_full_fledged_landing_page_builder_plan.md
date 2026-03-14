# V2 Full-Fledged Landing Page Builder — Implementation Plan

## Current State (Post-V1)

V1 established the schema-driven architecture:
- `PageDocument` as source of truth with 14 section types
- Workflow pipeline: intake → strategy → theme → asset_planning → plan → review → generation → assembly → render → save
- Section library with variants, typed content, dispatch-based renderer
- Asset model + upload endpoint (placeholder images)
- Editor with inline editing, add/reorder/delete/duplicate for all section types

### Known V1 Bugs to Fix First
1. **Builder polling missing new states** — `builder/page.tsx` doesn't poll during `strategy_generation`, `theme_generation`, `asset_planning`, `document_assembly`, causing the UI to freeze at 0%
2. **Section style key mismatch** — Editor uses `background_color` (snake_case) but new schema uses `backgroundColor` (camelCase); causes rendering issues for newly generated sections in the editor

---

## V2 Scope — Aligned with Spec

V2 transforms the system from a one-shot AI output tool into a schema-driven landing page builder. The spec defines three foundational pillars: **reusable Action model** (typed CTAs referenced by ID), **asset-centric media** (all images flow through Asset records, never raw URLs in content), and **AI image generation** (DALL-E hero/section images with fallback chain).

### What V2 Delivers (Spec §Required V2 Features)

1. **Reusable Action model** — Page-level `actions: Action[]` array. Buttons store `actionId` referencing an Action by ID. Action types: `url`, `phone`, `email`, `whatsapp`, `scroll`, `form`. WhatsApp supports prefilled message. Editor provides purpose-built action configuration UI — no raw URL editing.

2. **Asset-centric media system** — All images flow through project Asset records. Sections reference asset IDs (not URLs). Fallback chain: user upload → AI-generated → placeholder. Asset operations: upload, replace, remove, assign to section, edit alt text.

3. **AI image generation pipeline** — New workflow states `image_prompt_generation` and `image_generation`. DALL-E-powered hero images using business context, tone, theme, audience. Optional section images for services/features/testimonials. Asset records with `source: "ai"`.

4. **Semantic icon intent system** — AI generates icon intent strings (`"training"`, `"trust"`, `"speed"`) instead of literal icon names. Code maps intents to curated SVG icon components. No generic `briefcase` defaults.

5. **Three-pane editor** — Left sidebar (section list, add section, reorder, settings/brand/assets/actions tabs), center canvas (live page, section hover controls, click-to-select), right inspector (selected section/element settings, style controls, button/action controls, image assignment).

6. **Element-level editing** — Not just section-level. Item-level controls for repeatable lists: add/remove/reorder/duplicate items in features, services, testimonials, pricing plans, FAQ items, footer columns, trust bar items. Button-level controls: add/remove button, edit label, pick action, change style.

7. **Section variants per spec** — Hero: centered, split-image, background-image, offer-focused. Features: icon-grid, image-cards, list-with-icons. Services: cards, image-cards, alternating-rows. Testimonials: cards, avatars, single-highlight. CTA: centered, dual, contact-strip, whatsapp-focused. Footer: simple, multi-column, legal-heavy.

8. **New section types** — Gallery, service-area, about/team sections added to section library.

9. **Brand controls** — Logo upload, primary/secondary/accent colors, heading + body font pickers. `BrandSettings` with `logoAssetId`.

10. **Responsive preview** — Desktop, tablet (768px), and mobile (375px) preview toggle in toolbar.

11. **Page settings & publish** — Slug editing, SEO title/description, publish/unpublish status. `MetaSettings` with `publishStatus: "draft" | "published"`.

12. **Post-generation quality validation** — Validates: hero exists, footer exists, at least one CTA above fold, hero has visual for local/service pages, no placeholder copy (`Feature 1`, `Welcome to Our Business`), no irrelevant icon defaults, CTA labels/actions valid, images/alt text attached. Repair or rerun on failure.

13. **Page types** — Support: local-business, service-business, saas, coach, product-sales.

14. **Theme variants** — Support: clean, bold, premium, playful. Each influences typography, colors, spacing, button styles, card treatment, hero layout.

### What V2 Does NOT Include (Spec §Out of Scope)
- Custom domain management
- Analytics dashboard UI
- Production form backend with CRM integrations
- Full undo/redo timeline
- Full stock image provider integration
- Collaborative multi-user editing

---

## Canonical Data Model (Spec §Canonical Data Model)

### PageDocument
```ts
type PageDocument = {
  meta: MetaSettings
  brand: BrandSettings
  assets: Asset[]
  actions: Action[]
  sections: Section[]
}
```

### MetaSettings
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

### BrandSettings
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

### Action
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

### Asset
```ts
type Asset = {
  id: string
  kind: "image" | "icon" | "video"
  source: "upload" | "ai" | "placeholder" | "stock"
  url: string
  alt?: string
}
```

### Section
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

Buttons in section content reference actions by ID:
```ts
// Correct (spec Rule 1):
{ text: "Chat on WhatsApp", actionId: "action_whatsapp_primary" }

// Incorrect:
{ text: "Chat on WhatsApp", href: "https://wa.me/..." }
```

---

## Generation Workflow (Spec §Generation Workflow for V2)

Updated workflow states:
1. `intake` — extract structured business profile
2. `strategy_generation` — decide page type, section order, CTA strategy
3. `theme_generation` — choose colors, fonts, density, section mood
4. `asset_planning` — determine image slots and icon intent needs
5. `image_prompt_generation` — create image prompts per required asset (NEW)
6. `image_generation` — generate hero and section assets via DALL-E (NEW)
7. `plan_review` — user approves or requests changes
8. `content_generation` — generate section content with semantic element details
9. `document_assembly` — build canonical PageDocument with resolved actions + assets
10. `rendering` — render HTML from document
11. `complete`
12. `failed`

---

## Implementation Steps

### Step 1: Fix V1 Bugs
**Files:** `app/projects/[id]/builder/page.tsx`, `components/editor/SectionWrapper.tsx`

- Add missing polling states to builder: `strategy_generation`, `theme_generation`, `asset_planning`, `document_assembly`
- Normalize section style keys in SectionWrapper to handle both `background_color` and `backgroundColor` consistently
- Test full workflow end-to-end

### Step 2: Schema Overhaul — PageDocument, Action, BrandSettings, MetaSettings
**Files:** `lib/page/schema.ts`, `lib/page/section-library.ts`, `lib/page/validators.ts`

Align schema.ts with the spec's canonical data model:

**PageDocument:**
- Replace current top-level shape with `{ meta: MetaSettings, brand: BrandSettings, assets: Asset[], actions: Action[], sections: Section[] }`
- `MetaSettings`: title, description, pageType (5 types), themeVariant (4 themes), slug, publishStatus
- `BrandSettings`: tone, primaryColor, secondaryColor, accentColor, fontHeading, fontBody, logoAssetId

**Action model:**
- Add `Action` type per spec: id, label, type (`url`|`phone`|`email`|`whatsapp`|`scroll`|`form`), value, openInNewTab, metadata (whatsappMessage, scrollTargetId, formId)
- Actions are page-level: `PageDocument.actions: Action[]`
- All buttons in section content store `actionId: string` referencing an Action by ID (spec Rule 1)

**Section content updates:**
- `HeroContent`: replace `primaryCtaText`/`primaryCtaHref` with `primaryActionId: string`, `secondaryActionId?: string`
- `CtaBandContent`: replace button text/href with `primaryActionId`, `secondaryActionId`
- `PricingContent` plans: replace `ctaText` with `actionId`
- `ContactContent`: replace `buttonText` with `submitActionId`
- All section content types that have CTA buttons use `actionId` references

**Section type additions:**
- Add `gallery`, `service-area`, `about-team` to SectionType union
- Define content interfaces for each (GalleryContent, ServiceAreaContent, AboutTeamContent)

**Section model:**
- Ensure Section has: id, type, variant, visible (boolean), order (number), content, style, assets (imageIds, backgroundImageId, iconIds)

**Validators:**
- Update `validateSectionContent()` for new content shapes
- Add post-generation quality validation function (spec §Quality Rules):
  - hero exists
  - footer exists
  - at least one CTA above fold
  - hero has visual if page type expects one
  - section titles not generic
  - no placeholder copy ("Feature 1", "Our Services", "Welcome to Our Business")
  - no irrelevant icon defaults
  - CTA labels and actions valid
  - images and alt text attached where expected
  - repair document or rerun generation stage on failure

**Section library:**
- Update variant lists per spec:
  - Hero: centered, split-image, background-image, offer-focused
  - Features: icon-grid, image-cards, list-with-icons
  - Services: cards, image-cards, alternating-rows
  - Testimonials: cards, avatars, single-highlight
  - CTA: centered, dual, contact-strip, whatsapp-focused
  - Footer: simple, multi-column, legal-heavy
- Add gallery, service-area, about-team to catalog with their variants
- `createDefaultSection()` produces Action references, not raw hrefs

**Legacy migration:**
- Conversion function maps old `cta_text`/`cta_link`, `buttonText`/`buttonHref` to Action objects on load
- Old raw image URLs continue to render; new content uses asset IDs

### Step 3: Semantic Icon Intent System
**Files:** `lib/page/icons.ts` (new), `lib/page/renderer.ts`

- Define curated icon intent map: `Record<string, SVGString>`
  - Map semantic intents (`"training"`, `"trust"`, `"speed"`, `"safety"`, `"results"`, `"quality"`, `"support"`, `"innovation"`, etc.) to well-designed SVG markup
- Section content stores `iconIntent: string` (not `icon: "briefcase"`)
- `resolveIcon(intent: string): string` returns SVG markup for the intent
- Renderer uses `resolveIcon()` for all icon rendering
- AI prompts generate `iconIntent` values per item, not literal icon names
- Fallback: unrecognized intent maps to a generic but visually appropriate icon

### Step 4: Asset-Centric Media System
**Files:** `lib/assets/resolver.ts` (new), `lib/page/renderer.ts`, `components/editor/EditorContext.tsx`

**Asset resolver (`lib/assets/resolver.ts`):**
- `resolveAssetUrl(assetId: string, assets: Asset[]): string | undefined`
- `resolveAssetOrPlaceholder(assetId: string | undefined, assets: Asset[], category: string): string`
- Used by renderer and editor to dereference asset IDs to URLs

**Renderer updates:**
- All `<img>` tags and background-image styles resolve through `resolveAssetUrl()`
- If asset ID present but not found, fall back to placeholder
- All images get `alt` (from Asset.alt), `loading="lazy"`

**Editor updates:**
- EditorContext stores `assets: Asset[]` alongside sections and `actions: Action[]`
- Image display in sections resolves through the asset list
- Asset operations: upload, replace, remove, assign to section, edit alt text

### Step 5: AI Image Generation Pipeline
**Files:** `lib/ai/image-prompt-generator.ts` (new), `lib/ai/image-generator.ts` (new), `app/api/projects/[id]/assets/generate/route.ts` (new), `lib/ai/asset-planner.ts`, `lib/workflow/types.ts`, `lib/workflow/transitions.ts`, `lib/workflow/runner.ts`, `lib/workflow/engine.ts`

**Workflow updates:**
- Add two new states: `image_prompt_generation` (after `asset_planning`) and `image_generation` (after `image_prompt_generation`)
- Update state machine transitions, progress percentages, step messages

**Image prompt generator (`lib/ai/image-prompt-generator.ts`):**
- Takes business context, page strategy, brand, and asset plan
- Generates specific image prompts per required asset using:
  - business type, target audience, tone, page type, theme variant, service differentiators
- Hero image prompt example for dog training: "warm, trustworthy, premium local business aesthetic, trainer interacting with dog, family-friendly and believable"
- Returns array of `{ assetSlot: string, prompt: string, style: string }`

**Image generator (`lib/ai/image-generator.ts`):**
- Uses OpenAI DALL-E 3 API
- `generateImage(prompt: string, projectId: string): Promise<Asset>`
- Downloads generated image, saves to `public/uploads/{projectId}/`
- Creates Asset record with `source: "ai"`, `kind: "image"`
- Rate limit: max 5 AI images per project per generation run

**Asset planner updates:**
- Determines which sections require images, what type, whether to generate or placeholder
- Creates structured asset plan with slots: hero, services cards, feature icons, testimonial avatars, gallery, backgrounds

**Workflow runner updates:**
- `executeImagePromptGeneration()` — calls image prompt generator, stores prompts
- `executeImageGeneration()` — calls DALL-E for each prompt, creates Asset records
- Non-blocking: AI image failure falls back to placeholder gracefully

**Editor integration:**
- "Generate with AI" button in image controls calls `/api/projects/[id]/assets/generate`
- Shows loading state, replaces current asset on success

### Step 6: Action System — Renderer + Editor
**Files:** `lib/page/renderer.ts`, `components/editor/ActionEditor.tsx` (new), `components/editor/ActionManager.tsx` (new)

**Renderer — `renderAction()`:**
- Resolves action by ID from `PageDocument.actions[]`
- Produces correct HTML per action type:
  - `url`: `<a href="...">`
  - `phone`: `<a href="tel:+...">`
  - `email`: `<a href="mailto:...">`
  - `whatsapp`: `<a href="https://wa.me/...?text=...">`  (includes prefilled message if set)
  - `scroll`: `<a href="#section-id">` with smooth scroll
  - `form`: renders form trigger
- Styles buttons based on brand colors
- All section renderers use `renderAction()` instead of inline anchor tags

**ActionEditor component:**
- Dropdown for action type (url, phone, email, whatsapp, scroll, form)
- Label text input
- Value input (adapts placeholder: "Phone number", "WhatsApp number", "Email address", "URL", "Section to scroll to")
- WhatsApp: additional "Prefilled message" input
- `openInNewTab` checkbox (for url type)
- Style picker (primary/secondary/outline/ghost)

**ActionManager component (left sidebar "Actions" tab):**
- Lists all page-level actions
- Add new action, edit existing, delete
- Shows which sections reference each action
- Users configure actions WITHOUT writing raw URLs

**Generator updates:**
- Section generator prompts produce `actionId` references
- Document assembly creates Action objects from strategy's CTA plan
- Each page gets standard actions: primary CTA, secondary CTA, phone, email, whatsapp (if applicable)

### Step 7: Three-Pane Editor Architecture
**Files:** `app/projects/[id]/editor/page.tsx`, `components/editor/EditorSidebar.tsx` (new), `components/editor/EditorInspector.tsx` (new), `components/editor/EditorCanvas.tsx`

**Layout:**
- Left sidebar (~240px): section list, add section, reorder, tabs for Page Settings / Brand / Assets / Actions
- Center canvas (flex-1): live rendered page with section hover controls, click-to-select
- Right inspector (~320px): shows when element/section selected

**Left Sidebar tabs:**
- **Sections**: section list with drag handles (or up/down buttons), add section button, section visibility badges
- **Page Settings**: slug, SEO title, SEO description, publish status
- **Brand**: logo upload, color pickers (primary, secondary, accent), font pickers (heading, body)
- **Assets**: grid of all project assets with upload button, delete, alt text editing
- **Actions**: ActionManager — list/add/edit/delete page-level actions

**Center Canvas:**
- Renders page sections
- Section hover → shows section controls bar (move, duplicate, delete, visibility toggle)
- Click section → selects it, opens inspector
- Inline text editing where practical

**Right Inspector (when section selected):**
- Section type + variant picker
- Section-specific content fields
- Item-level controls for repeatable lists (add/remove/reorder items)
- Button/action controls (pick action from page actions list)
- Image assignment (upload, generate AI, pick from assets, remove, edit alt text)
- Style controls (background color, text color, padding, background image)
- "Regenerate with AI" button

**Top Toolbar:**
- Save button
- Publish status + publish button
- Desktop / Tablet / Mobile preview toggle
- Version indicator
- "View Live" link

### Step 8: Item-Level Editing Controls
**Files:** `components/editor/ItemListEditor.tsx` (new), `components/editor/SectionWrapper.tsx`, `components/editor/EditorInspector.tsx`

For repeatable lists in sections, the inspector provides:
- **Add item** button at bottom of list
- **Remove item** button per item (with confirm)
- **Reorder items** (up/down buttons per item)
- **Duplicate item** button per item

Applies to:
- Features items
- Services items
- Testimonials items
- Pricing plans
- FAQ items
- Footer columns/links
- Trust bar items
- Gallery images

Each item shows editable fields:
- Text fields (title, description, quote, etc.)
- Image assignment (upload, pick from assets, generate)
- Icon intent picker (dropdown of available intents)
- Action picker (for items with CTAs)

**Button-level controls:**
- Add button to section
- Remove button
- Edit button label
- Pick action (from page actions list)
- Change button style (primary/secondary/outline/ghost)

### Step 9: Section Variants — Renderers + Switcher
**Files:** `lib/page/renderer.ts`, `components/editor/VariantPicker.tsx` (new)

**Renderer — variant-specific rendering:**
Per spec §Required Section Variants, implement distinct rendering for each variant:

- **Hero**: centered (text-centered, minimal), split-image (text left + image right), background-image (full-bleed bg with overlay text), offer-focused (prominent offer/discount)
- **Features**: icon-grid (grid of icon+text cards), image-cards (cards with images), list-with-icons (vertical list)
- **Services**: cards (equal-width cards), image-cards (cards with hero images), alternating-rows (left-right alternating)
- **Testimonials**: cards (grid of quote cards), avatars (circular avatars + quotes), single-highlight (one featured + smaller quotes)
- **CTA**: centered (single centered CTA), dual (two buttons side-by-side), contact-strip (inline contact info + CTA), whatsapp-focused (WhatsApp-branded CTA)
- **Footer**: simple (one-line), multi-column (links organized in columns), legal-heavy (legal text prominent)

**VariantPicker component:**
- Shows in inspector when section selected
- Visual preview cards for each variant
- Selecting a variant updates section.variant and re-renders
- Available at generation time AND changeable later in editor

### Step 10: Brand Controls + Logo Upload
**Files:** `components/editor/BrandPanel.tsx` (new), `app/api/projects/[id]/brand/route.ts` (new), `components/editor/EditorContext.tsx`

**BrandPanel (left sidebar "Brand" tab):**
- Logo upload (creates Asset with `kind: "image"`, stores `logoAssetId` in BrandSettings)
- Primary color picker (with preset swatches)
- Secondary color picker
- Accent color picker
- Heading font dropdown (curated list of Google Fonts)
- Body font dropdown (curated list of Google Fonts)

**Brand API:**
- PUT endpoint to update brand settings
- Logo upload creates Asset record, returns asset ID

**Theme propagation:**
- Brand changes update CSS custom properties
- Live preview in canvas without full re-render
- On save, brand stored in PageDocument

### Step 11: Responsive Preview (Desktop / Tablet / Mobile)
**Files:** `components/editor/EditorToolbar.tsx`, `components/editor/EditorCanvas.tsx`, `components/editor/EditorContext.tsx`

- Three toggle buttons in toolbar: Desktop / Tablet / Mobile
- Desktop: canvas full width
- Tablet: canvas 768px centered with device frame border
- Mobile: canvas 375px centered with phone-like border
- Store preview mode in EditorContext
- CSS media queries in rendered HTML handle responsive layout
- Preview mode purely visual — constrains canvas container width

### Step 12: Page Settings + Publish Flow
**Files:** `components/editor/PageSettingsPanel.tsx` (new), `components/editor/PublishDialog.tsx` (new), `app/api/projects/[id]/publish/route.ts` (new), `components/editor/EditorToolbar.tsx`

**PageSettingsPanel (left sidebar "Page Settings" tab):**
- Slug editor (validates uniqueness)
- SEO title input
- SEO description textarea
- Publish status indicator

**Publish flow:**
- "Publish" button in toolbar (separate from "Save")
- PublishDialog shows: current slug, preview URL, publish/unpublish toggle
- Publish API:
  - Sets `publishStatus` to "published"
  - Re-renders final HTML from PageDocument (all assets resolved, all actions rendered)
  - Saves rendered HTML
  - Returns public URL
- "Published" badge on dashboard
- Unpublish sets status back to "draft"

### Step 13: Output Quality — Renderer + Generator Improvements
**Files:** `lib/page/renderer.ts`, `lib/ai/section-generator.ts`, `lib/page/validators.ts`

**Renderer improvements:**
- All CTAs render through `renderAction()` with proper `href` semantics
- Proper `<meta>` tags: og:title, og:description, og:image (hero asset URL)
- Structured data: JSON-LD for LocalBusiness when pageType is "local-business"
- All `<img>` tags: `alt` from Asset, `loading="lazy"`, width/height
- `aria-label` on interactive elements
- Consistent CTA button styling via brand CSS variables
- Smooth scroll behavior for `scroll` action links
- Footer: dynamic copyright year, business contact info auto-populated
- Proper section anchor IDs (`id="services"`, `id="pricing"`)
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- Hero: for local-business and service-business, default to split-image or background-image (not text-only)

**Generator improvements:**
- Section generator prompts produce `actionId` references, not raw text/href
- Business name and location in footer from businessContext
- Contact section uses actual phone/email/address from businessContext
- WhatsApp action auto-created if business context includes phone
- Section generator uses `iconIntent` for features/services items
- No placeholder copy in generated output ("Feature 1", "Welcome to Our Business")

**Post-generation quality pass:**
- Run quality validation after document assembly
- Auto-repair: add missing footer, add missing CTA, replace placeholder text
- Log warnings for items that couldn't be auto-repaired

### Step 14: Build Verification & End-to-End Testing
- Run `next build` to verify no type errors
- Test full flow: create project → intake → workflow (with image prompts + AI images) → editor → three-pane layout → edit actions → upload/generate images → change variants → brand controls → item-level editing → mobile/tablet preview → publish
- Verify backward compatibility with existing V1 projects
- Remove dead code from legacy paths
- Verify quality validation catches bad output

---

## File Inventory (New + Modified)

### New Files
- `lib/page/icons.ts` — Semantic icon intent → SVG mapping
- `lib/assets/resolver.ts` — Asset ID → URL resolution
- `lib/ai/image-prompt-generator.ts` — AI image prompt generation from business context
- `lib/ai/image-generator.ts` — DALL-E image generation
- `app/api/projects/[id]/assets/generate/route.ts` — AI image generation endpoint
- `app/api/projects/[id]/brand/route.ts` — Brand settings endpoint
- `app/api/projects/[id]/publish/route.ts` — Publish endpoint
- `components/editor/EditorSidebar.tsx` — Left sidebar with tabs
- `components/editor/EditorInspector.tsx` — Right inspector panel
- `components/editor/ActionEditor.tsx` — Single action type/value editor
- `components/editor/ActionManager.tsx` — Page-level action list management
- `components/editor/VariantPicker.tsx` — Section variant selection
- `components/editor/StyleControls.tsx` — Background/text color/padding
- `components/editor/BrandPanel.tsx` — Brand controls (logo, colors, fonts)
- `components/editor/PageSettingsPanel.tsx` — Slug, SEO, publish status
- `components/editor/ItemListEditor.tsx` — Repeatable item add/remove/reorder
- `components/editor/ImageUploadButton.tsx` — Image upload + AI generate
- `components/editor/RegenerateDialog.tsx` — AI section regeneration prompt
- `components/editor/PublishDialog.tsx` — Publish flow modal

### Modified Files
- `lib/page/schema.ts` — PageDocument, Action, MetaSettings, BrandSettings, new section types, actionId in content
- `lib/page/renderer.ts` — renderAction(), asset resolution, icon intent, variant renderers, SEO/a11y, semantic HTML
- `lib/page/section-library.ts` — Updated variants per spec, new section types, default actions
- `lib/page/validators.ts` — Post-generation quality validation, updated content validation
- `lib/ai/section-generator.ts` — Produces actionId refs, iconIntent, no placeholder copy
- `lib/ai/asset-planner.ts` — Structured asset planning with image slots and icon intents
- `lib/ai/strategist.ts` — Page type selection, CTA strategy with Action definitions
- `lib/ai/theme-generator.ts` — Theme variant influence on layout
- `lib/workflow/types.ts` — Add image_prompt_generation and image_generation states
- `lib/workflow/transitions.ts` — Updated state machine, progress percentages
- `lib/workflow/runner.ts` — New handlers for image prompt gen and image gen
- `lib/workflow/engine.ts` — Step messages for new states
- `app/projects/[id]/builder/page.tsx` — Fix polling states
- `app/projects/[id]/editor/page.tsx` — Three-pane layout
- `components/editor/EditorContext.tsx` — Assets state, actions state, theme, visibility, item-level ops
- `components/editor/EditorCanvas.tsx` — Responsive preview, click-to-select
- `components/editor/EditorToolbar.tsx` — Preview toggle (3 modes), publish button
- `components/editor/SectionWrapper.tsx` — Asset resolution, action rendering, visibility, icon intent
- `components/editor/SectionControls.tsx` — Visibility toggle
- `components/editor/AddSectionMenu.tsx` — New section types, default actions
- `app/api/projects/[id]/page/route.ts` — Load/save with assets + actions
- `app/api/projects/[id]/page/regenerate/route.ts` — New schema support

---

## Key Architectural Decisions

1. **Actions referenced by ID** (spec Rule 1) — Buttons store `actionId`, not `href`. Actions are page-level reusable objects. This enables a single WhatsApp number change to update all CTAs site-wide.

2. **Asset-centric media** (spec §Core Principles §3) — Sections reference asset IDs. All images resolve through `lib/assets/resolver.ts`. Enables clean replace, reuse across sections, and AI-generation upgrade path.

3. **Three-pane editor** (spec §Editor V2 Architecture) — Left sidebar (section list + tabs), center canvas, right inspector. Closer to Webflow/Squarespace pattern than current two-pane layout.

4. **Semantic icon intent** (spec §Icons) — AI generates intents, code maps to SVGs. No generic icon tokens as visible output.

5. **Two-step image pipeline** (spec §AI Image Generation) — Separate `image_prompt_generation` and `image_generation` workflow states. Prompts use full business context. Fallback chain: upload → AI → placeholder.

6. **Post-generation quality validation** (spec §Quality Rules) — Automated check after document assembly. Auto-repair where possible, rerun generation stage if needed.

7. **CSS custom properties for theming** — Theme changes apply via CSS variables. Live preview instant without full re-render.

8. **Publish = snapshot** — Publishing re-renders and saves final HTML with all assets resolved and actions rendered.

9. **Responsive preview is visual** — No separate mobile renderer. CSS media queries handle responsive layout; preview constrains canvas width.

---

## Migration / Compatibility

- All changes are additive — no breaking changes to existing data
- Legacy sections with `cta_text`/`cta_link` or `buttonText`/`buttonHref` auto-converted to Action objects on load
- Sections with raw image URLs (pre-V2) continue to render; new uploads create proper Asset records
- Existing projects without theme data use defaults
- Old `background_color` (snake_case) style keys normalized on load
- Old `icon: "briefcase"` strings mapped through icon intent system as best-effort

---

## Priority Order (Spec §Priority Order)

### Phase A (Steps 1-6)
- Fix V1 bugs
- Schema overhaul (Action model, BrandSettings, MetaSettings, new section types)
- Semantic icon intent
- Asset-centric media
- AI image generation pipeline
- Action system renderer + editor

### Phase B (Steps 7-11)
- Three-pane editor
- Item-level editing
- Section variants
- Brand controls + logo
- Responsive preview

### Phase C (Steps 12-14)
- Page settings + publish flow
- Output quality (SEO, a11y, quality validation)
- Build verification + end-to-end testing
