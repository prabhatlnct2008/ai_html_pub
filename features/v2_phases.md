# V2 Implementation Phases — Progress Tracker

This document tracks implementation progress for V2 of the landing page builder.
Spec: `features/v2_full_fledged_landing_page_builder_spec.md`
Plan: `features/v2_full_fledged_landing_page_builder_plan.md`

---

## Phase A: Foundation & Data Model
> Build the correct data model before any UI work.

| Step | Description | Status |
|------|-------------|--------|
| A.1 | Fix V1 bugs (builder polling, style key normalization) | DONE |
| A.2 | Action system — `Action` type, `actions[]` on PageDocument, `actionId` in section content, normalizer + resolver utilities | DONE |
| A.3 | Asset-centric media — asset ID references in sections, resolver utility, alt text support | DONE |
| A.4 | Section content contracts — button arrays with actionId, repeatable item schemas, semantic icon intent fields, gallery/service-area/about-team types | DONE |

**Exit criteria:** Schema compiles, legacy data loads without crash, `next build` passes. **ALL MET.**

---

## Phase B: Workflow & Generation
> Upgrade the AI pipeline to produce V2-quality output.

| Step | Description | Status |
|------|-------------|--------|
| B.1 | Workflow states — add `image_prompt_generation`, `image_generation`; update transitions + progress + builder polling | DONE |
| B.2 | Strategy generation — output pageType, heroVariant, sectionSequence, ctaStrategy, visualNeeds | DONE (already existed) |
| B.3 | Theme generation — primary/secondary/accent colors, heading/body fonts, density, variant | DONE (already existed) |
| B.4 | Asset planning — determine image slots, icon intent needs per section | DONE (already existed) |
| B.5 | Image prompt generation — business-specific DALL-E prompts from context | DONE |
| B.6 | Image generation — DALL-E calls, Asset records with `source: "ai"`, fallback to placeholder | DONE |
| B.7 | Content generation — actionId refs, iconIntent, no placeholder copy | DONE |
| B.8 | Document assembly — create Action objects, assign actionIds + assetIds, set variants | DONE |
| B.9 | Quality validation pass — hero/footer/CTA checks, placeholder copy detection, auto-repair | DONE |

**Exit criteria:** Full workflow produces a valid PageDocument with actions, assets, and quality-checked content. `next build` passes. **ALL MET.**

---

## Phase C: Editor & Interaction Model
> Build the three-pane editor with element-level editing.

| Step | Description | Status |
|------|-------------|--------|
| C.1 | Three-pane layout — left sidebar, center canvas, right inspector | DONE |
| C.2 | Editor state model — reducers for meta, brand, actions, assets, items, buttons, variants, visibility | DONE |
| C.3 | Section structure panel — section list, add/reorder/duplicate/hide/delete, variant switcher | DONE |
| C.4 | Element inspector — text fields, repeatable item editor, button editor, action picker, image assignment, style controls | DONE |
| C.5 | Actions panel — CRUD page-level actions, type picker, WhatsApp message, preview | DONE |
| C.6 | Assets panel — upload, list, replace, remove, alt text, assign to section | DONE |
| C.7 | Theme & page settings — brand colors/fonts/logo, slug, SEO, publish status | DONE |
| C.8 | Preview modes — desktop / tablet (768px) / mobile (375px) toggle | DONE |
| C.9 | AI section regeneration — regenerate selected section with instructions | NOT STARTED |

**Exit criteria:** Editor can manipulate the full PageDocument. All element-level operations work. `next build` passes. **ALL MET (except C.9 AI regen).**

---

## Phase D: Publish Quality & Delivery
> Polish output quality and add publish flow.

| Step | Description | Status |
|------|-------------|--------|
| D.1 | Renderer improvements — renderAction(), asset resolution, SEO/OG tags, structured data, semantic HTML, anchor IDs | DONE |
| D.2 | Publish flow — publish button, slug editing, preview URL, publish/unpublish, re-render snapshot | PARTIAL (slug editing in editor, publish URL exists) |
| D.3 | Backward compatibility — legacy href→Action normalization, legacy URL→asset wrapping, style key normalization | DONE |

**Exit criteria:** Published pages are accessible, SEO-ready, with correct CTA behavior. Old projects load without errors. `next build` passes. **ALL MET.**

---

## Post-Review Fixes
> Fixes from the V2 code review, addressing data flow, editor UX, and output quality.

| Fix | Description | Status |
|-----|-------------|--------|
| 1 | Make documentJson the canonical editor source of truth (GET returns doc.sections) | DONE |
| 2 | Add asset binding during document assembly (bindAssetsToSections) | DONE |
| 3 | Implement a real Assets panel in the editor (upload, list, preview, alt text, delete, section image assignment) | DONE |
| 4 | Persist slug and publish settings end-to-end (PUT saves slug to project, editor sends slug on save) | DONE |
| 5 | Align editor settings options with canonical schema enums (PAGE_TYPES, THEME_VARIANTS from schema.ts) | DONE |
| 6 | Make section variants materially different in the renderer (services: list/featured, testimonials: single-spotlight/minimal-list, how-it-works: timeline/horizontal, cta-band: split/card, footer: simple-centered/minimal) | DONE |
| 7 | Improve Actions UI (type-specific inputs, scroll target picker, phone/email/WhatsApp previews) | DONE |
| 8 | Extend quality validation pass (generic hero title detection, min section count, duplicate headings, asset reference validation, auto-repair broken actions/assets, hero image auto-bind) | DONE |

**All 8 fixes verified with `next build`.**

---

## Implementation Notes

- Phases are sequential: A → B → C → D
- Within each phase, steps can be parallelized where independent
- Every phase ends with `next build` verification
- Non-negotiable: Action system, asset-ID media, AI image gen, element-level editing, quality validation
