/**
 * Context-aware variant selection and styling.
 *
 * Replaces the old getDefaultVariant() (always returns first variant) and
 * getSectionStyle() (4 hardcoded buckets) with business-aware selection.
 *
 * Selection priority:
 *   1. Business type + page goal + section position + themeVariant + asset/data availability
 *   2. Weighted randomness as secondary tie-breaker (deterministic via projectId seed)
 *
 * Pattern: "planner decides, generator respects, normalizer enforces"
 */

import type { SectionType, ThemeVariant, PageType, BrandSettings } from "./schema";
import { SECTION_VARIANTS } from "./section-library";

// ---- Selection Context ----

export interface VariantSelectionContext {
  sectionType: SectionType;
  pageType: PageType | string;
  themeVariant: ThemeVariant | string;
  sectionPosition: number;
  totalSections: number;
  /** Whether the page has image assets available (e.g., hero images) */
  hasImages?: boolean;
  /** Whether testimonials/reviews data is available */
  hasTestimonials?: boolean;
  /** Whether team member data is available */
  hasTeamData?: boolean;
  /** Whether pricing data is available */
  hasPricingData?: boolean;
  /** Deterministic seed for tie-breaking (e.g., projectId hash) */
  seed?: string;
}

// ---- Preference Table ----
// Maps (pageType, sectionType, themeVariant) → ordered preference list.
// Falls back to generic preferences if no specific match.

type PreferenceKey = `${string}:${string}:${string}`;

const PREFERENCES: Record<PreferenceKey, string[]> = {
  // ---- Hero variants by business type × theme ----
  "local-business:hero:clean": ["split-image", "centered"],
  "local-business:hero:bold": ["background-image", "split-image"],
  "local-business:hero:premium": ["background-image", "centered"],
  "service-business:hero:clean": ["centered", "split-image"],
  "service-business:hero:bold": ["split-image", "background-image"],
  "service-business:hero:premium": ["background-image", "split-image"],
  "saas:hero:clean": ["centered", "split-image"],
  "saas:hero:bold": ["centered", "offer-focused"],
  "saas:hero:premium": ["split-image", "centered"],
  "coach:hero:clean": ["centered", "split-image"],
  "coach:hero:bold": ["background-image", "centered"],
  "coach:hero:premium": ["background-image", "split-image"],
  "product-sales:hero:clean": ["split-image", "offer-focused"],
  "product-sales:hero:bold": ["offer-focused", "split-image"],
  "product-sales:hero:premium": ["split-image", "background-image"],

  // ---- Features variants by theme ----
  "*:features:clean": ["icon-grid", "list-with-icons"],
  "*:features:bold": ["image-cards", "icon-grid"],
  "*:features:premium": ["image-cards", "list-with-icons"],
  "*:features:playful": ["icon-grid", "image-cards"],

  // ---- Services by business type ----
  "local-business:services:*": ["image-cards", "cards"],
  "service-business:services:*": ["alternating-rows", "image-cards"],
  "saas:services:*": ["cards", "image-cards"],

  // ---- Testimonials by theme ----
  "*:testimonials:clean": ["cards", "avatars"],
  "*:testimonials:bold": ["single-highlight", "cards"],
  "*:testimonials:premium": ["single-highlight", "avatars"],
  "*:testimonials:playful": ["avatars", "cards"],

  // ---- CTA band by theme ----
  "*:cta-band:clean": ["centered", "dual"],
  "*:cta-band:bold": ["dual", "centered"],
  "*:cta-band:premium": ["centered", "contact-strip"],

  // ---- How-it-works by theme ----
  "*:how-it-works:clean": ["numbered-steps", "timeline"],
  "*:how-it-works:bold": ["timeline", "numbered-steps"],
  "*:how-it-works:premium": ["timeline", "numbered-steps"],

  // ---- FAQ by theme ----
  "*:faq:clean": ["accordion", "two-column"],
  "*:faq:bold": ["two-column", "accordion"],
  "*:faq:premium": ["accordion", "two-column"],

  // ---- Contact by theme ----
  "*:contact:clean": ["form-with-info", "form-only"],
  "*:contact:bold": ["form-only", "form-with-info"],
  "*:contact:premium": ["form-with-info", "form-only"],

  // ---- Footer by theme ----
  "*:footer:clean": ["multi-column", "simple"],
  "*:footer:bold": ["simple", "multi-column"],
  "*:footer:premium": ["multi-column", "legal-heavy"],

  // ---- Gallery by business type ----
  "local-business:gallery:*": ["grid", "masonry"],
  "service-business:gallery:*": ["masonry", "grid"],
  "*:gallery:premium": ["masonry", "carousel"],

  // ---- About/Team by theme ----
  "*:about-team:clean": ["story", "values"],
  "*:about-team:bold": ["team-grid", "story"],
  "*:about-team:premium": ["story", "team-grid"],
};

/**
 * Look up preferred variants from the preference table.
 * Tries exact match, then wildcarded lookups.
 */
function lookupPreferences(
  pageType: string,
  sectionType: string,
  themeVariant: string
): string[] {
  // Exact match
  const exact = PREFERENCES[`${pageType}:${sectionType}:${themeVariant}` as PreferenceKey];
  if (exact) return exact;

  // Wildcard theme
  const wildTheme = PREFERENCES[`${pageType}:${sectionType}:*` as PreferenceKey];
  if (wildTheme) return wildTheme;

  // Wildcard pageType
  const wildPage = PREFERENCES[`*:${sectionType}:${themeVariant}` as PreferenceKey];
  if (wildPage) return wildPage;

  // Double wildcard
  const wildBoth = PREFERENCES[`*:${sectionType}:*` as PreferenceKey];
  if (wildBoth) return wildBoth;

  return [];
}

/**
 * Simple deterministic hash for tie-breaking.
 */
function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Select the best variant for a section based on context.
 * This is the primary replacement for getDefaultVariant().
 */
export function selectVariant(ctx: VariantSelectionContext): string {
  const allVariants = SECTION_VARIANTS[ctx.sectionType];
  if (!allVariants || allVariants.length === 0) return "default";
  if (allVariants.length === 1) return allVariants[0];

  // 1. Get preference-ordered candidates
  const preferred = lookupPreferences(ctx.pageType, ctx.sectionType, ctx.themeVariant);

  // 2. Filter by data/asset availability
  const available = filterByAvailability(preferred.length > 0 ? preferred : allVariants, ctx);

  if (available.length === 0) {
    // Fallback: first variant that doesn't require missing data
    return filterByAvailability(allVariants, ctx)[0] || allVariants[0];
  }

  if (available.length === 1) return available[0];

  // 3. Tie-break with deterministic weighted randomness
  if (ctx.seed) {
    const seedStr = `${ctx.seed}:${ctx.sectionType}:${ctx.sectionPosition}`;
    const idx = hashSeed(seedStr) % available.length;
    return available[idx];
  }

  return available[0];
}

/**
 * Filter variants by data/asset availability.
 * E.g., don't pick split-image hero if no images available.
 */
function filterByAvailability(
  variants: string[],
  ctx: VariantSelectionContext
): string[] {
  return variants.filter((v) => {
    // Hero: image variants need images
    if (ctx.sectionType === "hero" && (v === "split-image" || v === "background-image")) {
      if (ctx.hasImages === false) return false;
    }

    // About-team: team-grid needs team data
    if (ctx.sectionType === "about-team" && v === "team-grid") {
      if (ctx.hasTeamData === false) return false;
    }

    return true;
  });
}

// ---- Context-Aware Section Styling ----

/**
 * Replaces the old getSectionStyle() with styling that uses
 * all 3 brand colors + themeVariant + section position.
 */
export function getContextAwareSectionStyle(
  sectionType: SectionType,
  brand: BrandSettings | { primaryColor: string; secondaryColor?: string; accentColor?: string },
  themeVariant: ThemeVariant | string,
  sectionPosition: number,
  totalSections: number
): { backgroundColor: string; textColor: string; padding: string } {
  const primary = brand.primaryColor || "#2563eb";
  const secondary = ("secondaryColor" in brand ? brand.secondaryColor : undefined) || "#f0f4ff";
  const accent = ("accentColor" in brand ? brand.accentColor : undefined) || "#f59e0b";

  // Footer is always dark
  if (sectionType === "footer") {
    return { backgroundColor: "#111827", textColor: "#d1d5db", padding: getPadding(themeVariant, "footer") };
  }

  // Results/stats section: use accent color as background.
  // This gives the stats section a distinct identity separate from primary CTA.
  if (sectionType === "results") {
    const accentIsDark = !isLightColor(accent);
    return {
      backgroundColor: accent,
      textColor: accentIsDark ? "#ffffff" : "#1a1a1a",
      padding: getPadding(themeVariant, "accent"),
    };
  }

  // CTA band: use primary color
  if (sectionType === "cta-band") {
    return { backgroundColor: primary, textColor: "#ffffff", padding: getPadding(themeVariant, "accent") };
  }

  // Hero: primary for bold/premium, accent tint for playful, white for clean
  if (sectionType === "hero") {
    if (themeVariant === "bold" || themeVariant === "premium") {
      return { backgroundColor: primary, textColor: "#ffffff", padding: getPadding(themeVariant, "hero") };
    }
    if (themeVariant === "playful") {
      // Playful hero uses a light tint of the accent color for warmth
      return {
        backgroundColor: tintColor(accent, 0.85),
        textColor: "#1a1a1a",
        padding: getPadding(themeVariant, "hero"),
      };
    }
    return { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: getPadding(themeVariant, "hero") };
  }

  // Trust bar: accent on bold/playful themes, secondary otherwise.
  // This prevents it from blending into the same light gray as other sections.
  if (sectionType === "trust-bar") {
    if (themeVariant === "bold" || themeVariant === "playful") {
      return {
        backgroundColor: tintColor(accent, 0.9),
        textColor: "#374151",
        padding: getPadding(themeVariant, "compact"),
      };
    }
    return { backgroundColor: secondary, textColor: "#374151", padding: getPadding(themeVariant, "compact") };
  }

  // Pricing section: accent tint background for visual distinction
  if (sectionType === "pricing") {
    return {
      backgroundColor: tintColor(accent, 0.92),
      textColor: "#1a1a1a",
      padding: getPadding(themeVariant, "body"),
    };
  }

  // Alternating white/light pattern for body sections using secondary color
  const isEvenPosition = sectionPosition % 2 === 0;
  if (isEvenPosition) {
    return { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: getPadding(themeVariant, "body") };
  }

  // Odd body sections: light variant of secondary or neutral gray
  return {
    backgroundColor: isLightColor(secondary) ? secondary : "#f9fafb",
    textColor: "#1a1a1a",
    padding: getPadding(themeVariant, "body"),
  };
}

/**
 * Theme-aware padding values.
 */
function getPadding(themeVariant: string, sectionRole: string): string {
  const paddings: Record<string, Record<string, string>> = {
    clean: { hero: "80px 0", body: "64px 0", accent: "48px 0", compact: "24px 0", footer: "48px 0" },
    bold: { hero: "96px 0", body: "72px 0", accent: "56px 0", compact: "24px 0", footer: "48px 0" },
    premium: { hero: "112px 0", body: "80px 0", accent: "64px 0", compact: "32px 0", footer: "64px 0" },
    playful: { hero: "80px 0", body: "56px 0", accent: "48px 0", compact: "20px 0", footer: "40px 0" },
  };

  return paddings[themeVariant]?.[sectionRole] || paddings.clean[sectionRole] || "64px 0";
}

/**
 * Check if a hex color is light (for background contrast decisions).
 */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

/**
 * Create a tinted (lightened) version of a hex color by mixing with white.
 * factor=0.0 → original color, factor=1.0 → pure white.
 */
function tintColor(hex: string, factor: number): string {
  const c = hex.replace("#", "");
  if (c.length < 6) return hex;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const tr = Math.round(r + (255 - r) * factor);
  const tg = Math.round(g + (255 - g) * factor);
  const tb = Math.round(b + (255 - b) * factor);
  return `#${tr.toString(16).padStart(2, "0")}${tg.toString(16).padStart(2, "0")}${tb.toString(16).padStart(2, "0")}`;
}

/**
 * Validate that a variant is valid for its section type.
 * Returns the variant if valid, or the first valid variant as fallback.
 */
export function normalizeVariantStrict(sectionType: SectionType, variant: string): string {
  const valid = SECTION_VARIANTS[sectionType];
  if (!valid) return "default";
  if (valid.includes(variant)) return variant;
  return valid[0];
}
