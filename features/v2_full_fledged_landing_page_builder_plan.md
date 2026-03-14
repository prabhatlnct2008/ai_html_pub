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

## V2 Scope

V2 delivers three things that V1 is missing to make the product actually work: **publishable visual quality** (AI-generated hero images, proper media pipeline), **proper CTA/action handling** (typed actions for call/WhatsApp/email/link instead of raw hrefs), and a **production-quality editor** (sidebar, theme controls, image management, publish flow).

### What V2 Delivers
1. **AI image generation** — DALL-E-powered hero images, section backgrounds, feature icons with fallback chain: user upload → AI-generated → placeholder
2. **Typed Action model** — Reusable actions (call, WhatsApp, email, link, scroll-to) replacing raw href strings on all CTAs/buttons
3. **Asset-centric media system** — All images flow through project Asset records; sections reference asset IDs, not raw URLs; clean replace/reuse/swap
4. Editor sidebar with section settings, variant picker, style controls
5. Image upload + AI generation in editor sections
6. AI section regeneration from the editor (per-section "rewrite with AI")
7. Global theme controls (colors, fonts) in a settings panel
8. Mobile/desktop preview toggle
9. Section visibility toggle
10. Better HTML output quality (SEO, accessibility, consistent CTA strategy)
11. Publish flow with custom slug editing
12. Fix V1 bugs (polling, style keys)

### What V2 Does NOT Include (Phase 3+)
- Undo/redo history
- Custom domains
- Form submission handling / analytics
- Stock image API integration (Unsplash, Pexels)
- Gallery section type
- Service area map integration
- Multi-page sites
- Drag-and-drop reordering (keep button-based for now)
- Real-time collaborative editing

---

## Implementation Steps

### Step 1: Fix V1 Bugs
**Files:** `app/projects/[id]/builder/page.tsx`, `components/editor/SectionWrapper.tsx`

- Add missing polling states to builder: `strategy_generation`, `theme_generation`, `asset_planning`, `document_assembly`
- Normalize section style keys in SectionWrapper to handle both `background_color` and `backgroundColor` consistently across all render paths
- Test full workflow end-to-end: create project → intake → workflow completes → editor loads

### Step 2: Typed Action Model
**Files:** `lib/page/schema.ts`, `lib/page/renderer.ts`, `lib/page/section-library.ts`, `components/editor/ActionEditor.tsx` (new), `components/editor/SectionWrapper.tsx`

This is a schema-level change that touches generation, rendering, and editing. Do it early before building more UI on top.

**Schema changes (`lib/page/schema.ts`):**
- Add `Action` type:
  ```
  type Action = {
    id: string
    type: "link" | "scroll-to" | "call" | "whatsapp" | "email"
    label: string
    target: string          // URL, phone number, email, or section anchor
    style: "primary" | "secondary" | "outline" | "ghost"
  }
  ```
- Add `actions: Action[]` to `PageDocument` (reusable project-level actions)
- Replace raw `primaryCtaText`/`primaryCtaHref` in HeroContent with `primaryAction: Action`, `secondaryAction?: Action`
- Replace `buttonText`/`buttonHref` in CtaBandContent with `primaryAction: Action`, `secondaryAction?: Action`
- Replace `ctaText` in PricingContent plans with `action: Action`
- Replace `buttonText` in ContactContent with `submitAction: Action`

**Renderer updates (`lib/page/renderer.ts`):**
- Add `renderAction(action: Action, brand: Brand)` function that produces the correct HTML:
  - `link`: `<a href="...">`
  - `scroll-to`: `<a href="#section-id">` with smooth scroll
  - `call`: `<a href="tel:...">`
  - `whatsapp`: `<a href="https://wa.me/...">`
  - `email`: `<a href="mailto:...">`
- Style buttons based on `action.style` + brand colors
- All section renderers use `renderAction()` instead of inline anchor tags

**Editor (`ActionEditor.tsx`):**
- Dropdown for action type (link, call, WhatsApp, email, scroll-to)
- Label text input
- Target input (adapts placeholder based on type: "Phone number", "WhatsApp number", "Email address", "URL", "Section to scroll to")
- Style picker (primary/secondary/outline/ghost)
- Used in sidebar when editing CTA buttons in any section

**Generator updates:**
- Section generator prompts produce `Action` objects instead of raw text/href pairs
- Strategy module's `ctaStrategy` maps to actual Action objects during document assembly

**Legacy compat:**
- Migration function converts old `cta_text`/`cta_link` and `buttonText`/`buttonHref` to Action objects when loading old projects

### Step 3: Asset-Centric Media System
**Files:** `lib/page/schema.ts`, `lib/assets/resolver.ts` (new), `lib/page/renderer.ts`, `components/editor/EditorContext.tsx`

All media in sections flows through the Asset system. Sections store asset IDs, not URLs. This enables clean replace, reuse across sections, and a consistent upgrade path to AI-generated images.

**Asset resolver (`lib/assets/resolver.ts`):**
- `resolveAssetUrl(assetId: string, assets: Asset[]): string` — looks up asset by ID, returns URL
- `resolveAssetOrPlaceholder(assetId: string | undefined, assets: Asset[], category: PlaceholderCategory): string` — returns URL or placeholder
- Used by renderer and editor to dereference asset IDs to actual URLs

**Schema updates:**
- `HeroContent.heroImageId` already exists — keep it, ensure it's an asset ID
- `FeaturesContent.items[].imageId` — keep, maps to asset ID
- `ServicesContent.items[].imageId` — same
- `TestimonialsContent.items[].avatarImageId` — same
- Add `SectionStyle.backgroundImageId?: string` — for any section that wants a bg image

**Renderer updates:**
- All `<img>` tags and background-image styles resolve through `resolveAssetUrl()`
- If asset ID is present but asset not found, fall back to placeholder
- All images get `alt` (from Asset.alt), `loading="lazy"`, and dimensions

**Editor updates:**
- EditorContext stores `assets: Asset[]` alongside sections
- When user uploads an image, it creates an Asset record AND stores the asset ID in the section content
- Image display in sections resolves through the asset list

### Step 4: AI Image Generation
**Files:** `lib/ai/image-generator.ts` (new), `app/api/projects/[id]/assets/generate/route.ts` (new), `lib/ai/asset-planner.ts`, `lib/workflow/runner.ts`

**Image generator (`lib/ai/image-generator.ts`):**
- Uses OpenAI DALL-E 3 API (`openai.images.generate()`)
- `generateHeroImage(businessContext, brand): Promise<Asset>` — generates a hero image based on business type and brand colors
- `generateSectionImage(sectionType, description, brand): Promise<Asset>` — generates context-appropriate image
- Downloads generated image, saves to `public/uploads/{projectId}/`, creates Asset record
- Returns Asset with `source: "ai"`

**API endpoint (`/api/projects/[id]/assets/generate`):**
- POST with `{ type: "hero" | "section", sectionType?, description? }`
- Calls image generator, returns created Asset
- Rate limited: max 5 AI images per project per generation run

**Asset planner updates:**
- During workflow `asset_planning` step: instead of only creating placeholders, attempt AI generation for hero image and key section images
- Fallback chain: try AI generation → on failure, use placeholder
- Store `source: "ai"` vs `source: "placeholder"` on the Asset

**Workflow runner updates:**
- `executeAssetPlanning()` now calls image generator for hero + up to 3 key section images
- Handles failures gracefully (AI image generation is non-blocking; placeholder on failure)
- Adds generated asset IDs to the project's asset pool for section-generator to reference

**Editor integration:**
- In sidebar image section: "Generate with AI" button alongside "Upload"
- Calls the generate API, shows loading state, replaces current asset on success

### Step 5: Editor Layout Refactor — Sidebar Architecture
**Files:** `app/projects/[id]/editor/page.tsx`, `components/editor/EditorSidebar.tsx` (new), `components/editor/EditorCanvas.tsx`

- Refactor editor from full-width canvas to **canvas + right sidebar** layout (70/30 split)
- Sidebar shows contextual panel based on selection:
  - No selection: global page settings (theme, SEO, publish)
  - Section selected: section settings (variant, style, actions, image upload/generate)
- Sidebar tabs: "Section" | "Style" | "Page"
- Canvas stays as the main visual editing area

### Step 6: Section Settings Panel
**Files:** `components/editor/SectionSettingsPanel.tsx` (new), `components/editor/VariantPicker.tsx` (new), `components/editor/StyleControls.tsx` (new)

**SectionSettingsPanel:**
- Shows when a section is selected
- Section type label + variant picker
- Action editors for any CTAs in the section (using ActionEditor from Step 2)
- Image slots with Upload / Generate AI / Remove controls
- "Regenerate with AI" button (opens instruction input)
- "Hide Section" toggle
- Delete button

**VariantPicker:**
- Shows available variants for the selected section type
- Labeled cards for each variant
- Selecting a variant updates the section's `variant` field and re-renders

**StyleControls:**
- Background color picker (with presets from brand)
- Text color picker (auto-suggest based on bg contrast)
- Padding control (compact / normal / spacious)
- Background image selector (from project assets)

### Step 7: Image Upload + AI Generation in Editor
**Files:** `components/editor/ImageUploadButton.tsx` (new), `components/editor/SectionWrapper.tsx`, `components/editor/EditorContext.tsx`

- `ImageUploadButton` component: click to select file, uploads to `/api/projects/[id]/assets`, returns Asset with ID
- "Generate with AI" button: calls `/api/projects/[id]/assets/generate`, returns AI-generated Asset
- Both store the asset ID in the section content field (e.g., `heroImageId`, `items[i].imageId`)
- Show image preview in the section with "Replace", "Generate AI", and "Remove" overlays
- Add `UPDATE_SECTION_ASSET` and `SET_ASSETS` actions to EditorContext reducer
- Hero "split-image" variant renders the resolved asset; "centered" variant uses it as background overlay

### Step 8: AI Section Regeneration from Editor
**Files:** `components/editor/RegenerateDialog.tsx` (new), `app/api/projects/[id]/page/regenerate/route.ts`, `lib/ai/section-updater.ts`

- `RegenerateDialog`: text input for instructions + "Regenerate" button
- Opens from sidebar "Regenerate with AI" button when section is selected
- Update regenerate API to handle new section schema with typed content and Actions
- Return updated section with proper Action objects (not raw hrefs)
- Show loading state on the section while regenerating
- On success, replace section in EditorContext

### Step 9: Global Theme Settings Panel
**Files:** `components/editor/ThemePanel.tsx` (new), `components/editor/EditorContext.tsx`

- "Page" tab in sidebar shows theme controls
- Editable fields:
  - Page title + meta description
  - Primary color (color picker)
  - Secondary color (color picker)
  - Heading font (dropdown of Google Fonts)
  - Body font (dropdown of Google Fonts)
  - Brand tone display (read-only, from generation)
- Changes to theme propagate via CSS custom properties:
  - Button/CTA colors across all sections
  - Section default backgrounds that use brand colors
- Add `UPDATE_THEME` action to EditorContext
- Store theme/brand in PageDocument on save

### Step 10: Mobile/Desktop Preview Toggle
**Files:** `components/editor/EditorToolbar.tsx`, `components/editor/EditorCanvas.tsx`

- Desktop/mobile toggle buttons in the toolbar
- Desktop: canvas renders at full width
- Mobile: canvas renders in a centered 375px-wide frame with phone-like border
- Purely visual — CSS media queries handle responsive layout
- Store preview mode in EditorContext state

### Step 11: Section Visibility Toggle
**Files:** `components/editor/SectionControls.tsx`, `components/editor/EditorContext.tsx`, `components/editor/SectionWrapper.tsx`

- Eye/eye-off icon button in SectionControls bar
- Hidden sections render with 30% opacity and a "Hidden" badge in edit mode
- Hidden sections excluded from preview mode and final render
- Add `TOGGLE_VISIBILITY` action to EditorContext reducer

### Step 12: Output Quality Improvements
**Files:** `lib/page/renderer.ts`, `lib/ai/section-generator.ts`

**Renderer improvements:**
- All CTAs render through `renderAction()` with proper `href` semantics per action type
- Add proper `<meta>` tags (og:title, og:description, og:image — using hero asset URL)
- Add structured data (JSON-LD for LocalBusiness when pageType is "local-business")
- Ensure all `<img>` tags have `alt` (from Asset), `loading="lazy"`, `width`/`height`
- Add `aria-label` to interactive elements
- Ensure consistent CTA button styling via brand CSS variables
- Add smooth scroll behavior for `scroll-to` action links
- Footer: dynamic copyright year, business contact info auto-populated
- Generate proper anchor IDs for sections (e.g., `id="services"`, `id="pricing"`)

**Generator improvements:**
- Section-generator prompts produce Action objects, not raw text/href
- Add business name and location to footer content from businessContext
- Contact section uses actual phone/email/address from businessContext
- Prompt for WhatsApp number if business context includes phone

### Step 13: Publish Flow
**Files:** `components/editor/PublishDialog.tsx` (new), `app/api/projects/[id]/publish/route.ts` (new), `components/editor/EditorToolbar.tsx`

- "Publish" button in toolbar (distinct from "Save")
- `PublishDialog` shows:
  - Current slug (editable)
  - Preview of published URL
  - "Publish" / "Update" button
- Publish API:
  - Sets project status to "published"
  - Re-renders final HTML from current PageDocument (with all assets resolved, actions rendered)
  - Saves rendered HTML
  - Returns public URL
- Add "Published" badge to dashboard for published projects

### Step 14: Build Verification & Cleanup
- Run `next build` to verify no type errors
- Test full flow: create project → intake → workflow (with AI images) → editor → edit actions → upload/generate images → change theme → publish
- Remove dead code
- Verify backward compatibility with existing projects

---

## File Inventory (New + Modified)

### New Files
- `lib/ai/image-generator.ts` — DALL-E image generation
- `lib/assets/resolver.ts` — Asset ID → URL resolution
- `app/api/projects/[id]/assets/generate/route.ts` — AI image generation endpoint
- `app/api/projects/[id]/publish/route.ts` — Publish endpoint
- `components/editor/EditorSidebar.tsx` — Sidebar container with tabs
- `components/editor/SectionSettingsPanel.tsx` — Section-level controls
- `components/editor/VariantPicker.tsx` — Variant selection cards
- `components/editor/StyleControls.tsx` — Color/padding pickers
- `components/editor/ImageUploadButton.tsx` — Image upload + AI generate for sections
- `components/editor/ActionEditor.tsx` — CTA/action type editor
- `components/editor/RegenerateDialog.tsx` — AI regeneration prompt
- `components/editor/ThemePanel.tsx` — Global theme/SEO settings
- `components/editor/PublishDialog.tsx` — Publish flow modal

### Modified Files
- `lib/page/schema.ts` — Action type, updated section content interfaces
- `lib/page/renderer.ts` — `renderAction()`, asset resolution, SEO/a11y
- `lib/page/section-library.ts` — Default sections with Action objects
- `lib/ai/section-generator.ts` — Prompts produce Action objects, better content
- `lib/ai/asset-planner.ts` — AI image generation during planning
- `lib/ai/section-updater.ts` — Support new schema with Actions
- `lib/workflow/runner.ts` — AI image generation in asset_planning step
- `app/projects/[id]/builder/page.tsx` — Fix polling states
- `app/projects/[id]/editor/page.tsx` — Sidebar layout integration
- `components/editor/EditorContext.tsx` — Assets state, theme actions, visibility, action editing
- `components/editor/EditorCanvas.tsx` — Mobile preview support
- `components/editor/EditorToolbar.tsx` — Mobile toggle, publish button
- `components/editor/SectionWrapper.tsx` — Asset resolution, action rendering, visibility
- `components/editor/SectionControls.tsx` — Visibility toggle
- `components/editor/AddSectionMenu.tsx` — Default actions in new sections
- `app/api/projects/[id]/page/route.ts` — Load/save with assets
- `app/api/projects/[id]/page/regenerate/route.ts` — New schema support

---

## Key Architectural Decisions

1. **Sidebar, not modals** — Section settings live in a persistent sidebar, not floating modals (Webflow/Squarespace pattern).
2. **Asset-centric media** — Sections reference asset IDs. All images resolve through `lib/assets/resolver.ts`. This enables clean replace, reuse, and consistent AI-generation upgrade path. No raw URLs in section content.
3. **Typed Actions replace raw hrefs** — Every button/CTA is an `Action` object with `type`, `label`, `target`, `style`. The renderer produces the correct HTML per action type. The editor provides a purpose-built ActionEditor. No more storing arbitrary href strings.
4. **AI images are first-class** — The fallback chain is: user upload → AI-generated → placeholder. AI generation happens during workflow (non-blocking) and is available on-demand in the editor.
5. **CSS custom properties for theming** — Theme changes apply via CSS variables. Live preview is instant without re-rendering all sections.
6. **Mobile preview is visual only** — No separate mobile renderer. Responsive CSS handles it; we constrain the canvas width.
7. **Publish = snapshot** — Publishing re-renders and saves final HTML with all assets resolved and actions rendered.

---

## Migration / Compatibility

- All changes are additive — no breaking changes to existing data
- Legacy sections with `cta_text`/`cta_link` or `buttonText`/`buttonHref` are auto-converted to Action objects on load
- Sections with raw image URLs (pre-V2) continue to render; new uploads create proper Asset records
- Existing projects without theme data use defaults
- Old `background_color` (snake_case) style keys are normalized on load
