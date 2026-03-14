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

V2 focuses on making the editor **production-quality** and the generated output **truly publishable with minor edits only**. The generation pipeline is mostly solid from V1; the editor and output quality need the most work.

### What V2 Delivers
1. Editor sidebar with section settings, variant picker, style controls
2. Image upload in editor sections (hero, features, testimonials, services)
3. AI section regeneration from the editor (per-section "rewrite with AI")
4. Global theme controls (colors, fonts) in a settings panel
5. Mobile/desktop preview toggle
6. Section visibility toggle (hide without deleting)
7. Better HTML output quality (consistent CTA strategy, proper alt text, SEO tags)
8. Publish flow with custom slug editing
9. Fix V1 bugs (polling, style keys)

### What V2 Does NOT Include (Phase 3+)
- Undo/redo history
- Custom domains
- Form submission handling / analytics
- Stock image API integration (Unsplash, Pexels)
- AI image generation (DALL-E, etc.)
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
- Normalize section style keys in SectionWrapper to handle both `background_color` and `backgroundColor` (already partially done, but verify all paths)
- Test full workflow end-to-end: create project → intake → workflow completes → editor loads

### Step 2: Editor Layout Refactor — Sidebar Architecture
**Files:** `app/projects/[id]/editor/page.tsx`, `components/editor/EditorSidebar.tsx` (new), `components/editor/EditorCanvas.tsx`

- Refactor editor from full-width canvas to **canvas + right sidebar** layout (70/30 split)
- Sidebar shows contextual panel based on selection:
  - No selection: global page settings (theme, SEO, publish)
  - Section selected: section settings (variant, style, content fields, image upload)
- Sidebar tabs: "Section" | "Style" | "Page"
- Canvas stays as the main visual editing area

### Step 3: Section Settings Panel
**Files:** `components/editor/SectionSettingsPanel.tsx` (new), `components/editor/VariantPicker.tsx` (new), `components/editor/StyleControls.tsx` (new)

**SectionSettingsPanel:**
- Shows when a section is selected
- Displays section type label + variant picker
- "Regenerate with AI" button (opens instruction input)
- "Hide Section" toggle (sets `visible: false`)
- Delete button (with confirmation)

**VariantPicker:**
- Shows available variants for the selected section type
- Visual preview cards for each variant (small HTML thumbnails or labeled cards)
- Selecting a variant updates the section's `variant` field and re-renders

**StyleControls:**
- Background color picker (with presets from brand)
- Text color picker (auto-suggest based on bg contrast)
- Padding control (compact / normal / spacious)

### Step 4: Image Upload in Editor
**Files:** `components/editor/ImageUploadButton.tsx` (new), `components/editor/SectionWrapper.tsx`, `components/editor/EditorContext.tsx`

- Add `ImageUploadButton` component: click to select file, uploads to `/api/projects/[id]/assets`, returns asset URL
- Show upload button in hero, features, services, testimonials sections on hover
- When uploaded, store URL directly in section content (e.g., `heroImageId` for hero, `items[i].imageId` for features)
- Show image preview in the section with "Replace" and "Remove" overlays
- Add `UPDATE_SECTION_ASSET` action to EditorContext reducer
- Hero "split-image" variant renders the uploaded image; "centered" variant uses it as background overlay

### Step 5: AI Section Regeneration from Editor
**Files:** `components/editor/RegenerateDialog.tsx` (new), `app/api/projects/[id]/page/regenerate/route.ts`, `lib/ai/section-updater.ts`

- Add `RegenerateDialog` component: text input for instructions + "Regenerate" button
- Opens from sidebar "Regenerate with AI" button when section is selected
- Update the regenerate API to handle new section schema (typed content per section type)
- Return updated section matching the current schema (not legacy format)
- Show loading state on the section while regenerating
- On success, replace section in EditorContext

### Step 6: Global Theme Settings Panel
**Files:** `components/editor/ThemePanel.tsx` (new), `components/editor/EditorContext.tsx`

- "Page" tab in sidebar shows theme controls
- Editable fields:
  - Page title + meta description
  - Primary color (color picker)
  - Secondary color (color picker)
  - Heading font (dropdown of Google Fonts)
  - Body font (dropdown of Google Fonts)
  - Brand tone display (read-only, from generation)
- Changes to theme propagate to:
  - CSS variables in rendered HTML
  - Button/CTA colors across all sections
  - Section default backgrounds that use brand colors
- Add `UPDATE_THEME` action to EditorContext
- Store theme alongside globalStyles on save

### Step 7: Mobile/Desktop Preview Toggle
**Files:** `components/editor/EditorToolbar.tsx`, `components/editor/EditorCanvas.tsx`

- Add desktop/mobile toggle buttons to the toolbar
- Desktop: canvas renders at full width (current behavior)
- Mobile: canvas renders in a centered 375px-wide frame with phone-like border
- Purely visual — resizes the canvas wrapper, CSS media queries in rendered content handle the rest
- Store preview mode in EditorContext state

### Step 8: Section Visibility Toggle
**Files:** `components/editor/SectionControls.tsx`, `components/editor/EditorContext.tsx`, `components/editor/SectionWrapper.tsx`

- Add eye/eye-off icon button to SectionControls bar
- Hidden sections render with 30% opacity and a "Hidden" badge in edit mode
- Hidden sections are excluded from preview mode and final render
- Add `TOGGLE_VISIBILITY` action to EditorContext reducer
- Section `visible` field is saved and respected by renderer

### Step 9: Output Quality Improvements
**Files:** `lib/page/renderer.ts`, `lib/ai/section-generator.ts`

**Renderer improvements:**
- Add proper `<meta>` tags (og:title, og:description, og:image)
- Add structured data (JSON-LD for LocalBusiness when pageType is "local-business")
- Ensure all `<img>` tags have `alt`, `loading="lazy"`, proper `width`/`height` attributes
- Add `aria-label` to interactive elements
- Add print stylesheet basics
- Ensure consistent CTA button styling (all CTAs use brand primary)
- Add smooth scroll behavior for anchor links
- Footer: ensure copyright year is dynamic, all links work

**Generator improvements:**
- Improve section-generator prompts to produce more specific, less generic content
- Add business name and location to footer content automatically
- Ensure contact section includes actual contact info from businessContext
- Generate proper anchor IDs for sections (e.g., `id="services"`, `id="pricing"`)

### Step 10: Publish Flow
**Files:** `components/editor/PublishDialog.tsx` (new), `app/api/projects/[id]/publish/route.ts` (new), `components/editor/EditorToolbar.tsx`

- Add "Publish" button to toolbar (distinct from "Save")
- `PublishDialog` shows:
  - Current slug (editable)
  - Preview of published URL
  - "Publish" / "Update" button
- Publish API:
  - Sets project status to "published"
  - Re-renders final HTML from current PageDocument
  - Saves the rendered HTML
  - Returns the public URL
- Published page (`/p/[slug]`) already works — just need to ensure it serves the latest rendered HTML
- Add "Published" badge to dashboard for published projects

### Step 11: Build Verification & Cleanup
- Run `next build` to verify no type errors
- Test full flow: create project → intake → workflow → editor → edit sections → upload image → change theme → publish
- Remove any dead code
- Verify backward compatibility with existing projects

---

## File Inventory (New + Modified)

### New Files
- `components/editor/EditorSidebar.tsx` — Sidebar container with tabs
- `components/editor/SectionSettingsPanel.tsx` — Section-level controls
- `components/editor/VariantPicker.tsx` — Variant selection cards
- `components/editor/StyleControls.tsx` — Color/padding pickers
- `components/editor/ImageUploadButton.tsx` — Image upload for sections
- `components/editor/RegenerateDialog.tsx` — AI regeneration prompt
- `components/editor/ThemePanel.tsx` — Global theme/SEO settings
- `components/editor/PublishDialog.tsx` — Publish flow modal
- `app/api/projects/[id]/publish/route.ts` — Publish endpoint

### Modified Files
- `app/projects/[id]/builder/page.tsx` — Fix polling states
- `app/projects/[id]/editor/page.tsx` — Sidebar layout integration
- `components/editor/EditorContext.tsx` — New actions (theme, visibility, assets)
- `components/editor/EditorCanvas.tsx` — Mobile preview support
- `components/editor/EditorToolbar.tsx` — Mobile toggle, publish button
- `components/editor/SectionWrapper.tsx` — Image rendering, visibility styling
- `components/editor/SectionControls.tsx` — Visibility toggle button
- `lib/page/renderer.ts` — SEO/accessibility/output quality
- `lib/ai/section-generator.ts` — Better prompts, anchor IDs
- `lib/ai/section-updater.ts` — Support new schema format
- `app/api/projects/[id]/page/regenerate/route.ts` — New schema support

---

## Key Architectural Decisions

1. **Sidebar, not modals** — Section settings live in a persistent sidebar, not floating modals. This is standard for page builders (Webflow, Squarespace, Wix pattern).
2. **Image URLs in content, not separate asset references** — For V2 simplicity, uploaded image URLs go directly into section content fields. The Asset DB record is for project-level tracking. No complex asset-ID resolution layer.
3. **CSS variables for theming** — Theme changes (colors, fonts) apply via CSS custom properties in the rendered HTML. This makes live preview instant without re-rendering all sections.
4. **Mobile preview is visual only** — No separate mobile renderer. The responsive CSS handles it; we just constrain the canvas width.
5. **Publish = snapshot** — Publishing re-renders and saves final HTML. The published page serves static HTML. No runtime rendering.

---

## Migration / Compatibility

- All changes are additive — no breaking changes to existing data
- Existing projects continue to work in the editor (snake_case style keys are handled)
- New sections use camelCase style keys going forward
- Theme settings are optional — old projects without theme data use defaults
