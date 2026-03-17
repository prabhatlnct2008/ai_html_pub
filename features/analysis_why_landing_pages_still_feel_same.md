# Analysis: Why Landing Pages Still Look and Feel the Same

## 1. Executive Summary

Every generated landing page follows the same visual and structural formula regardless of business type: hero → trust-bar → services/features → problem-solution → how-it-works → results → testimonials → faq → cta-band → contact → footer. Every section uses the first variant in its list (e.g., hero is always "centered", features always "icon-grid", testimonials always "cards"). Section backgrounds cycle between exactly 4 hardcoded palettes (brand-primary, `#f8f9fa`, `#ffffff`, `#111827`) determined solely by section type, not by business context. The `themeVariant` (clean/bold/premium/playful) is generated and stored but never read by any layout or rendering logic. The net result: a plumbing company, a SaaS startup, and a yoga studio all produce pages with identical structure, identical visual rhythm, and nearly identical layout — differing only in text content and brand color.

## 2. Root Causes: Hardcoded, Templated, Prompt-Driven, or Renderer-Limited?

**All four.** The sameness is a stack-wide problem, not a single point of failure:

| Layer | Root Cause | Impact |
|-------|-----------|--------|
| **Strategy (hardcoded)** | Strategist prompt hardcodes "8-12 sections", "ALWAYS hero first, footer last", and gives the same "good default sequence" for all business types | Identical section order |
| **Planning (prompt-driven)** | Planner prompt repeats the same rules and provides only 14 section types, with the same recommended sequence | Nearly identical section lists |
| **Section generation (templated)** | `getDefaultVariant(type)` always returns `SECTION_VARIANTS[type][0]` — first variant only | Identical layout per section type |
| **Styling (hardcoded)** | `getSectionStyle()` assigns backgrounds by type category, ignoring brand/theme | Identical color rhythm |
| **Rendering (renderer-limited)** | Renderer has variant branches for ~8 section types but receives only default variants, so branches are dead code in practice | Layout variety exists in code but is unreachable |
| **Theme (stored but unused)** | `themeVariant` is generated but never influences layout selection, spacing, or visual treatment | Theme is cosmetic metadata only |

## 3. Where Generation Collapses Into a Single Formula

### 3a. Strategy layer: one sequence for all businesses

**File:** `lib/ai/strategist.ts`, lines 19-52

The strategy prompt says:
```
- Include 8-12 sections for a complete landing page
- ALWAYS start with "hero"
- ALWAYS end with "footer"
- Include at least one "cta-band" section between content sections
- A good default sequence for a service business:
  hero, trust-bar, services, problem-solution, how-it-works, results, testimonials, faq, cta-band, contact, footer
```

This "good default sequence" is echoed verbatim in the planner prompt (`lib/ai/prompts/planner.ts`, line 53). The AI receives the same template sequence for every generation, and with no counter-pressure (no variant instructions, no layout directives, no example alternatives), it reliably produces a near-identical ordered list every time.

The business-type branching is minimal:
- "For local/service businesses: include services, how-it-works, testimonials"
- "For SaaS: include features, pricing, how-it-works"
- "For coaches: include benefits, results, testimonials"

These swap 1-2 section types but keep the same overall formula. There is no guidance for radically different structures like: a single long-form sales page, a portfolio-centric layout, a booking-focused page, or a product showcase grid.

### 3b. Section type palette is narrow and redundant

**File:** `lib/ai/strategist.ts`, line 49; `lib/ai/prompts/planner.ts`, line 49

The allowed section types are:
```
hero, trust-bar, features, benefits, problem-solution, how-it-works,
services, testimonials, results, pricing, faq, cta-band, contact, footer
```

These 14 types are heavily weighted toward "professional service" landing pages. Missing from the strategist's vocabulary: `gallery`, `service-area`, `about-team` — all three exist in the section library (`lib/page/section-library.ts`, lines 5-23) with defined variants, content schemas (`lib/ai/section-generator.ts`, lines 322-349), and renderer support (`lib/page/renderer.ts`), but they are excluded from the strategist's allowed types list. A photographer, contractor, or restaurant would benefit enormously from gallery/service-area sections, but the AI cannot select them.

### 3c. Variant selection is completely static

**File:** `lib/ai/section-generator.ts`, line 112

```typescript
variant: getDefaultVariant(type),
```

**File:** `lib/page/section-library.ts`, lines 25-27

```typescript
export function getDefaultVariant(type: SectionType): string {
  return SECTION_VARIANTS[type]?.[0] || "default";
}
```

The system defines 2-4 variants per section type (~50 total across 17 types):

| Section Type | Available Variants | Always Used |
|-------------|-------------------|-------------|
| hero | centered, split-image, background-image, offer-focused | centered |
| features | icon-grid, image-cards, list-with-icons | icon-grid |
| services | cards, image-cards, alternating-rows | cards |
| testimonials | cards, avatars, single-highlight | cards |
| how-it-works | numbered-steps, timeline | numbered-steps |
| cta-band | centered, dual, contact-strip, whatsapp-focused | centered |
| contact | form-only, form-with-info | form-only |
| footer | simple, multi-column, legal-heavy | simple |
| faq | accordion, two-column | accordion |
| pricing | side-by-side, single-featured | side-by-side |

The variant is never selected dynamically. No code path examines the business context, theme variant, or page type to choose a more appropriate variant. The renderer (`lib/page/renderer.ts`) has working conditional branches for variant-specific rendering (e.g., `split-image` hero at line 194, `timeline` how-it-works at line 400, `single-highlight` testimonials at line 516), but these branches are never reached because the variant is always the first one in the list.

### 3d. Section styling is type-categorical, not context-aware

**File:** `lib/ai/section-generator.ts`, lines 134-149

```typescript
function getSectionStyle(type: SectionType, brand: Brand) {
  const darkBgTypes: SectionType[] = ["hero", "cta-band", "results"];
  const lightAltBgTypes: SectionType[] = ["trust-bar", "benefits", "testimonials", "how-it-works", "contact"];
  const footerType: SectionType[] = ["footer"];

  if (footerType.includes(type)) {
    return { backgroundColor: "#111827", textColor: "#d1d5db", padding: "60px 0" };
  }
  if (darkBgTypes.includes(type)) {
    return { backgroundColor: brand.primaryColor, textColor: "#ffffff", padding: "80px 0" };
  }
  if (lightAltBgTypes.includes(type)) {
    return { backgroundColor: "#f8f9fa", textColor: "#1a1a1a", padding: "80px 0" };
  }
  return { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" };
}
```

This creates a rigid visual rhythm: dark (brand color) → light gray → white → dark → light gray → white → dark footer. Every page has this same rhythm because the assignment is by section type, not by position, context, or theme. The `brand.secondaryColor` and `brand.accentColor` are never used in section styling. Padding is always `80px 0` or `60px 0` — never varies by theme variant.

## 4. What Decisions Are Not Being Made Dynamically

### 4a. No dynamic variant selection

**Decision that should happen:** "This is a photography business, so the hero should be `background-image` and we should include a `gallery` section with `masonry` layout."

**What actually happens:** Hero is always `centered`. Gallery is never selected because it's not in the strategist's allowed types.

### 4b. No dynamic section count or density

**Decision that should happen:** "This is a simple local plumber — 5-6 focused sections are better than 10+ information-heavy ones."

**What actually happens:** Always 8-12 sections. The prompt floor of 8 means every page has substantial length regardless of whether the business warrants it.

### 4c. No dynamic spacing or visual weight

**Decision that should happen:** "This premium coaching brand should have generous whitespace and larger typography; this discount retailer should be denser and more action-oriented."

**What actually happens:** All sections use identical padding (`80px 0`), identical font sizes (52px h1, 40px h2, 24px h3), identical card styling. The `themeVariant` field that could drive these decisions exists but is never consulted.

### 4d. No dynamic CTA strategy per section

**Decision that should happen:** "A WhatsApp-first business in India should use the `whatsapp-focused` CTA band variant."

**What actually happens:** CTA band is always `centered` variant with a generic button.

### 4e. No section-type selection based on assets/capabilities

**Decision that should happen:** "This business has a gallery of project photos — use the gallery section. This restaurant needs a menu section."

**What actually happens:** Section selection comes from a fixed list of 14 types with no awareness of what assets or data the business has.

## 5. Does Theme Change Without Layout Change?

**Yes — theme is purely cosmetic.** Specifically:

### 5a. Theme variant is generated but never consumed

**File:** `lib/ai/theme-generator.ts`, lines 30-31

The theme generator outputs:
```json
{
  "brand": { "tone": "...", "primaryColor": "...", ... },
  "themeVariant": "clean" | "bold" | "premium" | "playful"
}
```

**File:** `lib/ai/section-generator.ts`

The section generator receives `brand` (colors and fonts) but never receives or checks `themeVariant`. No code anywhere does:
```typescript
if (themeVariant === "bold") { /* use larger type, bolder colors, more contrast */ }
if (themeVariant === "premium") { /* use more whitespace, serif fonts, muted palette */ }
```

### 5b. Brand colors affect only two places

1. `brand.primaryColor` → hero/cta-band/results background, button color
2. Everything else → hardcoded `#ffffff`, `#f8f9fa`, `#111827`

`brand.secondaryColor` and `brand.accentColor` are generated by the theme generator but **never used in section styling or rendering**. They exist in the `Brand` type, are stored in the database, but no code reads them for visual decisions.

### 5c. Font choices work but don't change layout

The theme generator picks appropriate fonts (Playfair Display for premium, Poppins for modern, etc.) and these are applied in the renderer's CSS. But font choice alone doesn't change the visual feel enough to differentiate pages when every other visual parameter (spacing, layout, variant, color rhythm) is identical.

## 6. Exact Code References

| Issue | File | Line(s) | What Happens |
|-------|------|---------|--------------|
| Default variant always selected | `lib/ai/section-generator.ts` | 112 | `variant: getDefaultVariant(type)` → always first variant |
| `getDefaultVariant` returns `[0]` | `lib/page/section-library.ts` | 25-27 | `return SECTION_VARIANTS[type]?.[0]` |
| Hardcoded section style by type | `lib/ai/section-generator.ts` | 134-149 | `getSectionStyle()` — 4 buckets, no context |
| Strategy hardcodes sequence | `lib/ai/strategist.ts` | 42-52 | "ALWAYS hero first", "good default sequence" literal |
| Planner repeats same rules | `lib/ai/prompts/planner.ts` | 44-53 | Same 14 types, same constraints, same sequence |
| Section types exclude gallery/area/team | `lib/ai/strategist.ts` | 49 | 14 types, missing 3 that exist in library |
| Theme variant never consumed | `lib/ai/section-generator.ts` | entire file | No reference to `themeVariant` |
| Secondary/accent colors unused | `lib/ai/section-generator.ts` | 134-149 | Only `brand.primaryColor` referenced |
| Generator prompt schemas are rigid | `lib/ai/section-generator.ts` | 153-350 | Fixed JSON shapes steer AI into identical content structures |
| Content schema in prompt template | `lib/ai/prompts/generator.ts` | 10-138 | Even fewer schemas than section-generator.ts (7 vs 17) |
| Renderer variant branches unreachable | `lib/page/renderer.ts` | 194, 286, 400, 455, 516, 642, 689, 742 | Code exists for variant rendering but default variant always selected |

## 7. What Needs To Change

### 7a. Dynamic variant selection (highest impact)

Replace `getDefaultVariant(type)` with a function that considers:
- **Business type** (pageType): A photographer gets `split-image` hero; a SaaS gets `centered`
- **Theme variant**: `bold` theme → `offer-focused` hero, `dual` CTA band; `premium` → `background-image` hero, `single-highlight` testimonials
- **Section position**: First content section after hero could be cards; second could be alternating-rows
- **Randomized selection with weights**: Even random variant selection across the available options would dramatically improve variety

Implementation: Create `selectVariant(type, pageType, themeVariant, position)` that returns a context-appropriate variant using a weighted lookup table. This is ~50-80 lines of code and would unlock all existing renderer variant branches.

### 7b. Expand the strategist's section vocabulary

Add `gallery`, `service-area`, and `about-team` to the strategist's and planner's allowed section types. Add business-type rules:
- Photographers/contractors/restaurants → include `gallery`
- Local businesses → include `service-area`
- All businesses → optionally include `about-team`

This is a prompt change in 2 files.

### 7c. Make section styling context-aware

Replace `getSectionStyle()` with a function that uses `brand.secondaryColor`, `brand.accentColor`, `themeVariant`, and section position to create more varied color rhythms. For example:
- `premium` theme → use secondary color for alternating backgrounds, accent for highlights
- `bold` theme → higher contrast, more sections with brand-colored backgrounds
- `playful` theme → more color variety, lighter palette overall

### 7d. Connect themeVariant to layout decisions

The `themeVariant` should influence:
- Variant selection (7a above)
- Padding/spacing (`premium` → more whitespace, `bold` → tighter)
- Typography scale (`bold` → larger headings, `premium` → more contrast between heading/body sizes)
- Card styling (rounded corners, shadow depth, border treatments)

### 7e. Relax the rigid section count constraint

Change "8-12 sections" to "5-12 sections" and add guidance:
- Simple local businesses: 5-7 sections
- Full service businesses: 8-10 sections
- SaaS with pricing/features: 10-12 sections

### 7f. Improve content schema variety

The `SECTION_CONTENT_SCHEMAS` in `lib/ai/section-generator.ts` (lines 153-350) provide exactly one JSON shape per section type. The AI is heavily steered by these schemas to produce identical content structures. Consider:
- Providing variant-specific schemas (e.g., `hero-centered` vs `hero-split-image` have different content needs)
- Allowing the AI more flexibility in content structure within sections

## 8. Recommendation

**Phase 1 (quick wins, 1-2 days):**

1. **Replace `getDefaultVariant()` with `selectVariant()`** — a lookup function that picks variants based on business type, theme variant, and/or weighted randomization. This single change unlocks all existing renderer variant branches and immediately makes pages look different from each other. Estimated: ~80 lines, 1 file new + 1 file edit.

2. **Add gallery/service-area/about-team to strategist allowed types** — 2 prompt edits. Instantly expands the section vocabulary for appropriate businesses.

3. **Use secondaryColor and accentColor in `getSectionStyle()`** — Replace the 4-bucket categorical system with a context-aware palette that uses all three brand colors. Estimated: ~30 lines changed in 1 file.

**Phase 2 (meaningful differentiation, 2-3 days):**

4. **Wire themeVariant to variant selection and styling** — Build the lookup table that maps (themeVariant × sectionType) → preferred variant + style overrides. This makes "bold" sites look bold and "premium" sites look premium.

5. **Relax section count constraints** — Allow shorter pages for simpler businesses.

6. **Add variant-specific content schemas** — So that a `split-image` hero asks for image description while a `centered` hero doesn't.

**Phase 3 (structural differentiation, 3-5 days):**

7. **Allow the agentic page planner to choose variants** — The new agentic system's page planner agent should select variants per-section based on the site plan, business context, and theme. This moves variant selection from a static function to an AI decision.

8. **Add page-type-specific templates** — Instead of one "good default sequence" for all businesses, provide 4-5 distinct page structures (portfolio, booking-focused, long-form sales, product showcase, local SEO) and let the planner choose.

**The single highest-leverage change is #1: replacing `getDefaultVariant()`.** It requires no new rendering code, no new sections, no new prompts — just routing existing variant-capable code to the right variant. Every page generated after this change will have noticeably different layouts across the ~8 section types that already have variant-specific rendering.
