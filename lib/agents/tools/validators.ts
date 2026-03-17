/**
 * Deterministic validators for agentic site generation.
 * Pure functions — no AI calls, no side effects.
 */

import type { PageDocument, Action } from "@/lib/page/schema";
import { SECTION_TYPES, type SectionType } from "@/lib/page/schema";
import type {
  SitePlan,
  SiteSettingsDraft,
  AgenticPagePlan,
} from "../types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ---- Site Plan Validator ----

export function validateSitePlan(plan: SitePlan): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!plan.pages || plan.pages.length === 0) {
    errors.push("Site plan has no pages");
    return { valid: false, errors, warnings };
  }

  // Must have homepage
  const hasHomepage = plan.pages.some((p) => p.isHomepage);
  if (!hasHomepage) {
    errors.push("Site plan must include a homepage");
  }

  // No duplicate slugs
  const slugs = plan.pages.map((p) => p.slug);
  const uniqueSlugs = new Set(slugs);
  if (uniqueSlugs.size !== slugs.length) {
    errors.push("Site plan contains duplicate page slugs");
  }

  // Max 8 pages
  if (plan.pages.length > 8) {
    warnings.push(`Site plan has ${plan.pages.length} pages — consider limiting to 8 or fewer`);
  }

  // Contact path exists (page with contact-related purpose or slug)
  const hasContactPath = plan.pages.some(
    (p) =>
      p.slug === "contact" ||
      p.purpose.toLowerCase().includes("contact") ||
      p.suggestedSections.includes("contact")
  );
  if (!hasContactPath) {
    warnings.push("No contact page or contact section found in site plan");
  }

  // Each page needs title and slug
  for (const page of plan.pages) {
    if (!page.slug || !page.title) {
      errors.push(`Page missing slug or title: ${JSON.stringify(page)}`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ---- Site Settings Validator ----

export function validateSiteSettings(settings: SiteSettingsDraft, plan: SitePlan): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Brand fields present
  if (!settings.brand) {
    errors.push("Site settings missing brand");
  } else {
    if (!settings.brand.primaryColor) errors.push("Brand missing primaryColor");
    if (!settings.brand.fontHeading) errors.push("Brand missing fontHeading");
    if (!settings.brand.fontBody) errors.push("Brand missing fontBody");
  }

  // Actions have unique IDs
  if (settings.actions) {
    const actionIds = settings.actions.map((a) => a.id);
    const uniqueIds = new Set(actionIds);
    if (uniqueIds.size !== actionIds.length) {
      errors.push("Site settings contain duplicate action IDs");
    }
  }

  // Nav items match plan pages
  if (settings.navigation && plan.pages) {
    const planSlugs = new Set(plan.pages.map((p) => p.slug));
    for (const nav of settings.navigation) {
      if (!planSlugs.has(nav.slug)) {
        warnings.push(`Nav item "${nav.label}" references unknown slug: ${nav.slug}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ---- Page Plan Validator ----

export function validatePagePlan(
  plan: AgenticPagePlan,
  otherPlans: AgenticPagePlan[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!plan.sections || plan.sections.length === 0) {
    errors.push("Page plan has no sections");
    return { valid: false, errors, warnings };
  }

  // Validate section types
  const validTypes = new Set<string>(SECTION_TYPES);
  for (const section of plan.sections) {
    if (!validTypes.has(section.type)) {
      errors.push(`Invalid section type: ${section.type}`);
    }
  }

  // Check for exact duplicate of another page
  for (const other of otherPlans) {
    if (other.slug === plan.slug) continue;
    const thisTypes = plan.sections.map((s) => s.type).join(",");
    const otherTypes = other.sections.map((s) => s.type).join(",");
    if (thisTypes === otherTypes && plan.title === other.title) {
      warnings.push(`Page plan "${plan.slug}" is identical to "${other.slug}"`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ---- Page Document Validator ----

export function validatePageDocument(
  doc: PageDocument,
  availableActions: Action[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!doc.sections || doc.sections.length === 0) {
    errors.push("Page document has no sections");
    return { valid: false, errors, warnings };
  }

  if (!doc.meta || !doc.meta.title) {
    errors.push("Page document missing meta.title");
  }

  if (!doc.brand) {
    errors.push("Page document missing brand");
  }

  // Check action references
  const actionIds = new Set([
    ...doc.actions.map((a) => a.id),
    ...availableActions.map((a) => a.id),
  ]);

  for (const section of doc.sections) {
    const buttons = section.content.buttons as Array<{ actionId?: string }> | undefined;
    if (buttons) {
      for (const btn of buttons) {
        if (btn.actionId && !actionIds.has(btn.actionId)) {
          warnings.push(
            `Section "${section.type}" button references unknown action: ${btn.actionId}`
          );
        }
      }
    }
  }

  // Check visible section count
  const visible = doc.sections.filter((s) => s.visible);
  if (visible.length < 3) {
    warnings.push(`Page has only ${visible.length} visible sections`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ---- Site Navigation Validator ----

export function validateSiteNavigation(
  navigation: Array<{ slug: string; label: string }>,
  pageSlugs: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const pageSlugSet = new Set(pageSlugs);

  for (const nav of navigation) {
    if (!pageSlugSet.has(nav.slug)) {
      errors.push(`Nav item "${nav.label}" references non-existent page: ${nav.slug}`);
    }
  }

  // Check for orphan pages (pages not in nav)
  const navSlugs = new Set(navigation.map((n) => n.slug));
  for (const slug of pageSlugs) {
    if (!navSlugs.has(slug)) {
      warnings.push(`Page "${slug}" is not in navigation`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
