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
| B.1 | Workflow states — add `image_prompt_generation`, `image_generation`; update transitions + progress + builder polling | NOT STARTED |
| B.2 | Strategy generation — output pageType, heroVariant, sectionSequence, ctaStrategy, visualNeeds | NOT STARTED |
| B.3 | Theme generation — primary/secondary/accent colors, heading/body fonts, density, variant | NOT STARTED |
| B.4 | Asset planning — determine image slots, icon intent needs per section | NOT STARTED |
| B.5 | Image prompt generation — business-specific DALL-E prompts from context | NOT STARTED |
| B.6 | Image generation — DALL-E calls, Asset records with `source: "ai"`, fallback to placeholder | NOT STARTED |
| B.7 | Content generation — actionId refs, iconIntent, no placeholder copy | NOT STARTED |
| B.8 | Document assembly — create Action objects, assign actionIds + assetIds, set variants | NOT STARTED |
| B.9 | Quality validation pass — hero/footer/CTA checks, placeholder copy detection, auto-repair | NOT STARTED |

**Exit criteria:** Full workflow produces a valid PageDocument with actions, assets, and quality-checked content. `next build` passes.

---

## Phase C: Editor & Interaction Model
> Build the three-pane editor with element-level editing.

| Step | Description | Status |
|------|-------------|--------|
| C.1 | Three-pane layout — left sidebar, center canvas, right inspector | NOT STARTED |
| C.2 | Editor state model — reducers for meta, brand, actions, assets, items, buttons, variants, visibility | NOT STARTED |
| C.3 | Section structure panel — section list, add/reorder/duplicate/hide/delete, variant switcher | NOT STARTED |
| C.4 | Element inspector — text fields, repeatable item editor, button editor, action picker, image assignment, style controls | NOT STARTED |
| C.5 | Actions panel — CRUD page-level actions, type picker, WhatsApp message, preview | NOT STARTED |
| C.6 | Assets panel — upload, list, replace, remove, alt text, assign to section | NOT STARTED |
| C.7 | Theme & page settings — brand colors/fonts/logo, slug, SEO, publish status | NOT STARTED |
| C.8 | Preview modes — desktop / tablet (768px) / mobile (375px) toggle | NOT STARTED |
| C.9 | AI section regeneration — regenerate selected section with instructions | NOT STARTED |

**Exit criteria:** Editor can manipulate the full PageDocument. All element-level operations work. `next build` passes.

---

## Phase D: Publish Quality & Delivery
> Polish output quality and add publish flow.

| Step | Description | Status |
|------|-------------|--------|
| D.1 | Renderer improvements — renderAction(), asset resolution, SEO/OG tags, structured data, semantic HTML, anchor IDs | NOT STARTED |
| D.2 | Publish flow — publish button, slug editing, preview URL, publish/unpublish, re-render snapshot | NOT STARTED |
| D.3 | Backward compatibility — legacy href→Action normalization, legacy URL→asset wrapping, style key normalization | NOT STARTED |

**Exit criteria:** Published pages are accessible, SEO-ready, with correct CTA behavior. Old projects load without errors. `next build` passes.

---

## Implementation Notes

- Phases are sequential: A → B → C → D
- Within each phase, steps can be parallelized where independent
- Every phase ends with `next build` verification
- Non-negotiable: Action system, asset-ID media, AI image gen, element-level editing, quality validation
