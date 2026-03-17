# Planning: Dynamic Landing Page Variation

## 1. Purpose and Scope

### Purpose

Stop generated landing pages from collapsing into the same visual structure, section sequence, and layout regardless of business type. Make the generation pipeline produce intentionally different, business-appropriate output by using the variant system, theme variant, expanded section vocabulary, and context-aware styling that already partially exist in the codebase.

### Scope

**In scope:**

- Dynamic variant selection based on business type, theme variant, and section position
- Expanding strategist/planner prompts to include all 17 section types
- Making section styling use secondaryColor, accentColor, and themeVariant
- Connecting themeVariant to layout and spacing decisions
- Relaxing rigid section count constraints
- Making these changes in both the legacy section generator AND the agentic page generator agent

**Out of scope:**

- New section types beyond the existing 17
- New renderer variant branches (the existing ~8 variant-aware renderers are sufficient)
- Rewriting the renderer
- Adding new fonts or CSS frameworks
- User-facing variant selection UI in the editor (this is generation-time logic only)

---

## 2. Current-State Summary

Every generated page follows the same formula:

| Dimension | Current Behavior |
|-----------|-----------------|
| Section sequence | hero → trust-bar → services/features → problem-solution → how-it-works → results → testimonials → faq → cta-band → contact → footer |
| Section count | Always 8-12 (floor of 8 enforced by prompt) |
| Variant selection | Always first variant: hero=centered, features=icon-grid, services=cards, etc. |
| Background colors | 4 hardcoded buckets by section type category |
| Brand colors used | Only `primaryColor`; `secondaryColor` and `accentColor` are generated but never consumed |
| Theme variant | Generated (`clean`/`bold`/`premium`/`playful`) but never read by any layout or style logic |
| Section types available | 14 in strategist prompt; 3 existing types excluded (`gallery`, `service-area`, `about-team`) |

The renderer already has working variant branches for ~8 section types, but they are dead code because variant is always the default.

---

## 3. Exact Causes of Sameness

### 3a. Variant selection is static

**File:** `lib/ai/section-generator.ts:112`
```typescript
variant: getDefaultVariant(type),  // Always returns SECTION_VARIANTS[type][0]
```

**File:** `lib/page/section-library.ts:25-27`
```typescript
export function getDefaultVariant(type: SectionType): string {
  return SECTION_VARIANTS[type]?.[0] || "default";
}
```

~50 variants exist across 17 section types. Only the first is ever used.

### 3b. Section styling ignores context

**File:** `lib/ai/section-generator.ts:134-149`

`getSectionStyle()` assigns backgrounds by section type category (dark/light/white/footer). It never reads `secondaryColor`, `accentColor`, `themeVariant`, or section position.

### 3c. Strategist/planner prompts hardcode the formula

**File:** `lib/ai/strategist.ts:42-52` and `lib/ai/prompts/planner.ts:44-53`

Both prompts say "8-12 sections", "ALWAYS hero first, footer last", and provide the same "good default sequence". Business-type branching swaps 1-2 section types but keeps the same overall structure.

### 3d. Section vocabulary is artificially narrow

The strategist's allowed types list has 14 entries. Three types that exist in the section library, content schemas, and renderer are excluded: `gallery`, `service-area`, `about-team`.

### 3e. Theme variant is generated but never consumed

**File:** `lib/ai/theme-generator.ts` generates `themeVariant: "clean" | "bold" | "premium" | "playful"`. No downstream code reads it.

---

## 4. What Should Become Dynamic

| Decision | Currently | Should Be |
|----------|-----------|-----------|
| Variant per section | Always first | Selected by `selectVariant(type, pageType, themeVariant, position)` |
| Section background color | 4 hardcoded buckets | Context-aware palette using all 3 brand colors + themeVariant |
| Section padding/spacing | Always `80px 0` or `60px 0` | Adjusted by themeVariant (premium=more, bold=tighter) |
| Section count | Always 8-12 | 5-12, scaled by business complexity |
| Section types available | 14 | 17 (add gallery, service-area, about-team) |
| Hero variant | Always `centered` | Business-type-appropriate: photographers→`background-image`, SaaS→`centered`, retail→`offer-focused` |
| CTA band variant | Always `centered` | WhatsApp businesses→`whatsapp-focused`, dual-CTA→`dual`, contact-heavy→`contact-strip` |

---

## 5. How Variant Selection Should Work

### New function: `selectVariant()`

Replace `getDefaultVariant(type)` with a new function that makes intentional, business-aware decisions:

```typescript
export function selectVariant(
  type: SectionType,
  context: {
    pageType: string;        // "local-business", "saas", "coach", etc.
    themeVariant: string;    // "clean", "bold", "premium", "playful"
    sectionPosition: number; // 0-indexed position in section sequence
    totalSections: number;   // total sections on page
    businessContext?: Record<string, unknown>;  // for asset/CTA awareness
  }
): string {
  // 1. Check explicit preference table (pageType × type × themeVariant)
  // 2. If no preference, use position-based selection
  // 3. If still ambiguous, use weighted random from remaining variants
  return selectedVariant;
}
```

### Preference table structure

The core of variant selection is a preference table that maps (pageType, sectionType, themeVariant) → preferred variant(s):

```typescript
const VARIANT_PREFERENCES: Record<string, Record<string, Partial<Record<string, string[]>>>> = {
  // pageType → sectionType → themeVariant → preferred variants (ordered)
  "local-business": {
    hero: {
      clean: ["centered", "split-image"],
      bold: ["background-image", "offer-focused"],
      premium: ["split-image", "background-image"],
      playful: ["centered", "split-image"],
    },
    services: {
      clean: ["cards"],
      bold: ["image-cards", "alternating-rows"],
      premium: ["alternating-rows", "image-cards"],
      playful: ["cards", "image-cards"],
    },
    // ... etc
  },
  saas: {
    hero: {
      clean: ["centered"],
      bold: ["offer-focused", "centered"],
      premium: ["split-image"],
      playful: ["centered"],
    },
    features: {
      clean: ["icon-grid"],
      bold: ["image-cards", "list-with-icons"],
      premium: ["list-with-icons"],
      playful: ["icon-grid", "image-cards"],
    },
    // ... etc
  },
  // ... other pageTypes
};
```

### Selection algorithm

1. Look up `VARIANT_PREFERENCES[pageType][sectionType][themeVariant]`
2. If found and list has entries: pick the first entry (deterministic preference)
3. If not found: fall back to position-based cycling through available variants
4. Position-based: `SECTION_VARIANTS[type][position % variantsCount]`
5. Final fallback: `SECTION_VARIANTS[type][0]` (current behavior)

**Why preference-first, not random:** We want intentional differentiation. A plumber's hero should be `split-image` because split-image heroes work well for visual service businesses. This is a design decision, not a dice roll. Randomness is only a tie-breaker when multiple variants are equally appropriate.

---

## 6. What Inputs Should Drive Variation

### 6a. Business type (`pageType`)

This is the **primary driver** of variant selection. Different business types have different visual needs:

| Business Type | Visual Characteristics |
|--------------|----------------------|
| `local-business` | Photo-forward, trust-heavy, service-area aware |
| `service-business` | Process-focused, testimonial-heavy, before/after |
| `saas` | Feature-grid, pricing-comparison, clean/minimal |
| `coach` | Personal, results-focused, testimonial-highlight |
| `product-sales` | Offer-focused, pricing-prominent, gallery-ready |

### 6b. Page type / page goal

Within a multi-page site, different pages have different needs:

- Homepage: hero-forward, broad overview, multiple CTAs
- About page: team-grid or story variant, fewer sections, more text
- Services page: alternating-rows or image-cards for services, detailed
- Contact page: form-with-info variant, minimal other sections
- Pricing page: single-featured or side-by-side pricing, FAQ nearby

### 6c. Section position

Avoid visual monotony by varying layout across the page:

- First content section after hero: use cards or grid layout (visual density)
- Middle sections: alternate between list/timeline and card layouts
- Pre-CTA sections: use social proof (testimonials, results) to build momentum
- Avoid two consecutive sections with the same layout pattern

### 6d. Theme variant

`themeVariant` should influence variant preferences:

| Theme | Hero Preference | Layout Style | Spacing | Color Usage |
|-------|----------------|-------------|---------|-------------|
| `clean` | `centered` | Minimal, white-space heavy | Generous | Primary only, muted |
| `bold` | `offer-focused` or `background-image` | Dense, high contrast | Tighter | All 3 colors, stronger |
| `premium` | `split-image` | Elegant, serif, airy | Very generous | Secondary-heavy, accent sparse |
| `playful` | `centered` with color | Rounded, colorful, varied | Medium | All 3 colors, lighter tints |

### 6e. Asset/data availability

Some variants need specific data to be meaningful:

- `split-image` hero: only useful if image assets are available
- `gallery` section: only useful if gallery images exist or can be generated
- `service-area` section: only useful if location data exists
- `about-team` section: only useful if team info exists (can fallback to `story` variant)
- `whatsapp-focused` CTA: only useful if WhatsApp number provided

The variant selector should check `businessContext` for these signals and demote variants that require unavailable data.

---

## 7. How Section Vocabulary Should Expand

### Add 3 existing types to strategist/planner prompts

Currently excluded from the allowed types list but fully implemented in section-library, content schemas, and renderer:

| Type | When to Include | Business Types |
|------|----------------|---------------|
| `gallery` | Photography, construction, restaurants, real estate, portfolio businesses | `local-business`, `service-business`, `product-sales` |
| `service-area` | Local businesses with geographic coverage | `local-business`, `service-business` |
| `about-team` | Businesses where team/founder credibility matters | All types (especially `coach`, `service-business`) |

### Prompt changes

**`lib/ai/strategist.ts`** — Update the section types list:
```
Section types must be from: hero, trust-bar, features, benefits, problem-solution,
how-it-works, services, testimonials, results, pricing, faq, cta-band, contact,
footer, gallery, service-area, about-team
```

Add business-type rules:
```
- For visual businesses (photographers, contractors, restaurants): consider gallery
- For local businesses: consider service-area
- For businesses where team/founder credibility matters: consider about-team
```

**`lib/ai/prompts/planner.ts`** — Same changes.

**`lib/agents/prompts/site-planner.ts`** — Same changes for the agentic pipeline.

---

## 8. How Strategist/Planner Prompts Should Change

### Section count relaxation

**Current:** "Include 8-12 sections for a complete landing page"

**New:**
```
Include 5-12 sections depending on business complexity:
- Simple local businesses (plumber, barber): 5-7 sections
- Service businesses with multiple offerings: 7-9 sections
- SaaS, coaches, or complex services: 8-10 sections
- Full business websites with pricing and portfolio: 10-12 sections
Do NOT pad with unnecessary sections just to reach a count.
```

### Remove the single "good default sequence"

**Current:** "A good default sequence for a service business: hero, trust-bar, services, problem-solution, how-it-works, results, testimonials, faq, cta-band, contact, footer"

**New:** Replace with multiple example sequences by business type:
```
Example sequences by business type (adapt, do not copy verbatim):

Service business: hero, trust-bar, services, how-it-works, testimonials, cta-band, contact, footer
SaaS: hero, trust-bar, features, how-it-works, pricing, faq, testimonials, cta-band, contact, footer
Local business: hero, trust-bar, services, service-area, gallery, testimonials, cta-band, contact, footer
Coach/consultant: hero, about-team, benefits, results, testimonials, pricing, cta-band, contact, footer
Product/retail: hero, features, gallery, pricing, testimonials, faq, cta-band, contact, footer

Choose the sequence that best matches THIS business. Do not default to the same sequence every time.
```

### Add variant awareness to the agentic page planner

**`lib/agents/prompts/page-planner.ts`** — Add variant selection to the page plan output:
```
For each section, also specify a preferred variant from the available options:
- hero: centered, split-image, background-image, offer-focused
- features: icon-grid, image-cards, list-with-icons
- services: cards, image-cards, alternating-rows
- testimonials: cards, avatars, single-highlight
... etc

Choose variants that match the business type and theme, not the same default every time.
```

---

## 9. How Section Styling Should Become More Theme-Aware

### Replace `getSectionStyle()` with `getContextAwareSectionStyle()`

**File:** `lib/ai/section-generator.ts:134-149`

**New function signature:**
```typescript
function getContextAwareSectionStyle(
  type: SectionType,
  brand: Brand,
  themeVariant: string,
  position: number,
  totalSections: number
): { backgroundColor: string; textColor: string; padding: string }
```

### Color palette strategy by theme variant

| Theme | Primary Usage | Secondary Usage | Accent Usage | Neutral |
|-------|--------------|----------------|-------------|---------|
| `clean` | Hero + CTA band only | Not used for backgrounds | Hover/highlight only | `#ffffff`, `#f8f9fa` alternating |
| `bold` | Hero, CTA band, results, trust-bar | Alternating content sections | Feature highlights | `#ffffff` |
| `premium` | Hero only | Trust-bar, alternating sections | Accent borders/dividers | `#fafaf9`, `#ffffff` (warmer neutrals) |
| `playful` | Hero, CTA band | Every other content section (at 10% opacity tint) | Badge/icon backgrounds | `#ffffff` |

### Color tinting utility

For sections that use secondaryColor or accentColor as background, generate a tinted version (10-15% opacity over white) to avoid overwhelming dark backgrounds:

```typescript
function tintColor(hex: string, opacity: number): string {
  // Convert hex to RGB, blend with white at given opacity
  // Returns a light tinted hex suitable for section backgrounds
}
```

### Padding by theme variant

| Theme | Standard Padding | Hero Padding | CTA/Footer Padding |
|-------|-----------------|-------------|-------------------|
| `clean` | `80px 0` | `100px 0` | `60px 0` |
| `bold` | `64px 0` | `80px 0` | `48px 0` |
| `premium` | `100px 0` | `120px 0` | `80px 0` |
| `playful` | `72px 0` | `88px 0` | `56px 0` |

---

## 10. How themeVariant Should Affect Layout Decisions

### Variant selection influence (via preference table)

See section 5. The preference table maps (pageType × sectionType × themeVariant) → preferred variants. This is the primary way themeVariant affects layout.

### Typography scale influence

Currently all pages use the same font sizes (52px h1, 40px h2, 24px h3). Add theme-variant CSS overrides in the renderer:

| Theme | H1 | H2 | H3 | Body line-height |
|-------|----|----|-----|-----------------|
| `clean` | 48px | 36px | 22px | 1.7 |
| `bold` | 56px | 44px | 26px | 1.6 |
| `premium` | 52px | 38px | 24px | 1.8 |
| `playful` | 48px | 36px | 22px | 1.7 |

### Card styling influence

| Theme | Border Radius | Shadow | Border |
|-------|--------------|--------|--------|
| `clean` | 8px | subtle (0 1px 3px) | none |
| `bold` | 4px | medium (0 4px 12px) | none |
| `premium` | 16px | none | 1px solid #e5e5e5 |
| `playful` | 20px | colorful (0 4px 16px accent@10%) | none |

These overrides can be injected into the renderer's global CSS block based on the theme variant stored in the page document or site settings.

---

## 11. Where Randomness Is Acceptable and Where It Is Not

### NOT acceptable (must be deterministic and intentional)

- **Hero variant:** Should always be chosen by business type + theme, never random
- **CTA band variant:** Should be chosen by CTA strategy (whatsapp → whatsapp-focused, etc.)
- **Contact variant:** Should be chosen by data availability (has phone/address → form-with-info)
- **Footer variant:** Should be chosen by site complexity (multi-page → multi-column, simple → simple)
- **Section background color:** Should follow a coherent rhythm, not random colors

### Acceptable as tie-breaker (when multiple variants are equally appropriate)

- **Features variant:** If both `icon-grid` and `image-cards` are appropriate for this business type and theme, use position-based cycling or seed-based selection
- **Testimonials variant:** If both `cards` and `avatars` work, alternate based on page position
- **How-it-works variant:** If both `numbered-steps` and `timeline` are appropriate, pick based on content length or position
- **Services variant:** If both `cards` and `alternating-rows` work, cycle based on position

### Implementation of tie-breaking

Use a deterministic seed (e.g., hash of `projectId + sectionType`) rather than `Math.random()` so that:
1. The same project regenerated produces consistent results
2. Different projects produce different results
3. No true randomness — reproducible and debuggable

```typescript
function deterministicPick(variants: string[], seed: string): string {
  const hash = simpleHash(seed);
  return variants[hash % variants.length];
}
```

---

## 12. Files/Modules to Change

### Phase 1 files (dynamic variant selection — highest impact)

| File | Change |
|------|--------|
| `lib/page/section-library.ts` | Add `selectVariant()` function with preference table; keep `getDefaultVariant()` as internal fallback |
| `lib/ai/section-generator.ts:112` | Replace `getDefaultVariant(type)` with `selectVariant(type, context)` — requires passing pageType and themeVariant through |
| `lib/ai/section-generator.ts:58-63` | Update `generateSingleSection()` signature to accept pageType and themeVariant |
| `lib/ai/section-generator.ts:18-25` | Update `generateAllSectionsV2()` / `generateAllSectionsWithActions()` to pass pageType and themeVariant |

### Phase 2 files (section vocabulary + prompt changes)

| File | Change |
|------|--------|
| `lib/ai/strategist.ts:19-52` | Expand section types, add gallery/service-area/about-team rules, relax section count, provide multiple example sequences |
| `lib/ai/prompts/planner.ts:44-53` | Same changes as strategist |
| `lib/agents/prompts/site-planner.ts` | Add expanded section types |
| `lib/agents/prompts/page-planner.ts` | Add variant selection to page plan output |

### Phase 3 files (context-aware styling)

| File | Change |
|------|--------|
| `lib/ai/section-generator.ts:134-149` | Replace `getSectionStyle()` with `getContextAwareSectionStyle()` that uses all 3 brand colors + themeVariant |
| `lib/page/renderer.ts` (global CSS section) | Add theme-variant-specific CSS overrides for typography, card styling, spacing |

### Phase 4 files (agentic pipeline integration)

| File | Change |
|------|--------|
| `lib/agents/agents/page-generator.ts` | Use `selectVariant()` instead of `getDefaultVariant()` when building page sections |
| `lib/agents/agents/shared-settings-agent.ts` | Ensure themeVariant is included in shared settings output |
| `lib/agents/graph/nodes/page-generation.ts` | Pass pageType and themeVariant to section generation |

### New files

| File | Purpose |
|------|---------|
| `lib/page/variant-selector.ts` | `selectVariant()` function, preference table, deterministic tie-breaking logic. Could live in section-library.ts instead, but a separate file keeps it testable and focused. |

---

## 13. Implementation Phases

### Phase 1: Dynamic variant selection (highest leverage, can parallel with Track 1)

**Impact:** Immediately makes every page look different. Unlocks all existing renderer variant branches.

1. Create `selectVariant()` in `lib/page/variant-selector.ts` with the preference table
2. Build the preference table for 5 business types × 10 most-used section types × 4 theme variants
3. Add deterministic tie-breaking using project ID hash
4. Replace `getDefaultVariant(type)` call in `lib/ai/section-generator.ts:112` with `selectVariant(type, context)`
5. Thread `pageType` and `themeVariant` through `generateAllSectionsV2()` → `generateSingleSection()`
6. Test: Generate pages for different business types, verify different variants are selected
7. Test: Verify renderer correctly renders non-default variants (split-image hero, timeline how-it-works, etc.)

**Estimated scope:** ~120 lines new code (preference table + selectVariant), ~20 lines changed in section-generator.

### Phase 2: Expanded section vocabulary + prompt changes

**Impact:** Photographers get galleries, local businesses get service areas, all businesses can get about/team sections.

1. Add `gallery`, `service-area`, `about-team` to strategist prompt's allowed types
2. Add business-type rules for when to use them
3. Same changes in planner prompt and agentic site-planner prompt
4. Relax section count from "8-12" to "5-12" with guidance
5. Replace single "good default sequence" with multiple business-type examples
6. Test: Generate for a photographer — expect gallery section to appear
7. Test: Generate for a local plumber — expect service-area section to appear
8. Test: Generate for a simple business — expect fewer than 8 sections

**Estimated scope:** ~40 lines of prompt changes across 3-4 files.

### Phase 3: Context-aware section styling

**Impact:** Pages no longer have identical color rhythms. Brand colors are actually used. Spacing varies by theme.

1. Replace `getSectionStyle()` with `getContextAwareSectionStyle()`
2. Implement color tinting utility for secondary/accent background usage
3. Add theme-variant-specific padding values
4. Ensure footer and dark sections still have good contrast
5. Test: Compare generated pages — `bold` theme should use more brand colors than `clean`
6. Test: Verify no white-on-white or dark-on-dark contrast issues

**Estimated scope:** ~60 lines replacing getSectionStyle, ~20 lines for tinting utility.

### Phase 4: Theme-variant CSS overrides in renderer

**Impact:** `premium` pages feel premium (more whitespace, refined typography), `bold` pages feel bold (larger type, tighter spacing).

1. Add theme-variant CSS block to `renderPageFromDocument()` in `lib/page/renderer.ts`
2. Include typography scale overrides, card styling, border-radius, shadow adjustments
3. Pass `themeVariant` through to the renderer (from page document or site settings)
4. Test: Generate `premium` vs `bold` pages — verify visible differences in spacing and type treatment

**Estimated scope:** ~40 lines of CSS generation logic in renderer.

### Phase 5: Agentic pipeline integration

**Impact:** The new agentic multi-page generator also produces varied output (not just the legacy generator).

1. Update `lib/agents/agents/page-generator.ts` to use `selectVariant()`
2. Ensure `themeVariant` flows from shared settings through page generation
3. Update agentic page planner prompt to include variant guidance
4. Test: Full agentic generation produces varied sections across pages

**Estimated scope:** ~30 lines across 2-3 agent files.

---

## 14. Risks / Edge Cases

| Risk | Impact | Mitigation |
|------|--------|------------|
| Variant-specific content doesn't match renderer expectations | Broken rendering (e.g., split-image hero with no image) | `selectVariant()` checks data availability before recommending variants that need assets |
| Aggressive color usage in `bold` theme creates contrast issues | Unreadable text | Always validate text contrast ratio; fall back to white/dark text based on background luminance |
| `premium` extra padding makes pages feel too long | Users scroll more, engagement drops | Cap premium padding at 120px; keep CTA/footer sections tighter |
| Different variants produce different content schema needs | AI generates content for wrong variant | Phase 6 (future): add variant-specific content schemas; for now, content schemas are generic enough |
| Preference table grows unwieldy | Hard to maintain | Keep table focused on ~10 most impactful section types; let tie-breaking handle the rest |
| Regenerating a project produces different layout each time | Users surprised by inconsistency | Use deterministic seed (projectId hash) for tie-breaking — same project = same variant choices |
| Legacy projects regenerated through old flow get new styling | Visual mismatch with existing pages | Changes only affect new section generation; existing saved pages are not re-rendered |
| Expanding section count range allows too-short pages | Pages feel incomplete | Keep minimum at 5; ensure hero + at least 2 content sections + CTA + contact + footer |
| Some renderer variant branches have bugs (untested paths) | Broken output for non-default variants | Test all variant branches in renderer before enabling; fix any rendering bugs found |

---

## 15. Acceptance Criteria

### Must-pass

1. A plumber and a SaaS startup, generated with the same theme variant, produce visibly different section sequences
2. A plumber and a SaaS startup, generated with different theme variants (`bold` vs `premium`), produce visibly different hero layouts
3. `selectVariant()` returns different variants for different (pageType, themeVariant) combinations — not always the first variant
4. The `gallery` section appears in output when generating for a photography or portfolio business
5. The `service-area` section appears in output when generating for a local business
6. `secondaryColor` is used in at least one section background (not just `primaryColor` and hardcoded grays)
7. `accentColor` is used in at least one visual element
8. A `premium` theme produces different padding than a `bold` theme
9. Generating for a simple local business can produce fewer than 8 sections
10. The same project regenerated twice with the same context produces the same variant choices (deterministic)
11. All non-default variant rendering branches in `renderer.ts` produce valid, non-broken HTML
12. No white-on-white or dark-on-dark contrast violations in generated pages

### Should-pass

1. At least 3 different hero variants are used across 5 different business types
2. At least 2 different testimonial variants are used across generations
3. `themeVariant === "playful"` produces rounder corners and lighter color usage than `themeVariant === "bold"`
4. A coach's page includes `about-team` or `results` sections prominently
5. A SaaS page includes `pricing` and `features` sections with appropriate variants
6. CTA band variant selection is CTA-strategy-aware (WhatsApp business → `whatsapp-focused`)
7. Pages have varied background color rhythms (not always the same white → gray → brandColor pattern)

---

## 16. Sequencing Relative to Builder Integration

### Phase 1 of this track (dynamic variant selection) CAN run in parallel with Track 1 Phases 1-2

It touches completely different files:
- This: `lib/page/section-library.ts`, `lib/ai/section-generator.ts`, new `lib/page/variant-selector.ts`
- Track 1: `builder/page.tsx`, `kickoff/route.ts`, `answer/route.ts`

### Phases 2-5 of this track should follow Track 1 Phase 2

Once the builder is wired to the agentic backend, the variation improvements become testable through the product UI. Without that wiring, these changes can only be tested via API calls.

### Recommended combined timeline

1. **Track 1 Phase 1** + **Track 2 Phase 1** (parallel): Server gating + dynamic variant selection
2. **Track 1 Phase 2**: Builder trigger + basic polling
3. **Track 2 Phase 2**: Expanded vocabulary + prompt changes
4. **Track 1 Phase 3**: Progress component
5. **Track 2 Phase 3-4**: Context-aware styling + renderer overrides
6. **Track 1 Phase 4**: Polish + edge cases
7. **Track 2 Phase 5**: Agentic pipeline integration
