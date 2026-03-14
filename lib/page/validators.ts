import type { Section, SectionType, PageDocument, Action, ButtonRef } from "./schema";

// ---- Per-Section Content Validation ----

const REQUIRED_FIELDS: Record<string, string[]> = {
  hero: ["heading", "subheading"],
  "trust-bar": ["items"],
  features: ["heading", "items"],
  benefits: ["heading", "items"],
  "problem-solution": ["heading", "problem", "solution"],
  "how-it-works": ["heading", "steps"],
  services: ["heading", "items"],
  testimonials: ["heading", "items"],
  results: ["heading", "stats"],
  pricing: ["heading", "plans"],
  faq: ["heading", "items"],
  "cta-band": ["heading"],
  contact: ["heading", "fields"],
  footer: ["companyName", "columns", "copyrightYear"],
  gallery: ["heading", "images"],
  "service-area": ["heading", "areas"],
  "about-team": ["heading"],
};

export function validateSectionContent(section: Section): { valid: boolean; missing: string[] } {
  const required = REQUIRED_FIELDS[section.type] || [];
  const missing = required.filter((field) => {
    const val = section.content[field];
    return val === undefined || val === null || val === "";
  });
  return { valid: missing.length === 0, missing };
}

export function isValidSectionType(type: string): type is SectionType {
  const validTypes: readonly string[] = [
    "hero", "trust-bar", "features", "benefits", "problem-solution",
    "how-it-works", "services", "testimonials", "results", "pricing",
    "faq", "cta-band", "contact", "footer", "gallery", "service-area", "about-team",
  ];
  return validTypes.includes(type);
}

// ---- Post-Generation Quality Validation (V2 spec §Quality Rules) ----

export interface QualityIssue {
  severity: "error" | "warning";
  section?: string;
  message: string;
  autoRepairable: boolean;
}

const PLACEHOLDER_TITLES = [
  "feature 1", "feature 2", "feature 3",
  "service 1", "service 2", "service 3",
  "benefit 1", "benefit 2", "benefit 3",
  "our services", "our features", "welcome to our business",
  "your headline here", "company name",
  "description here", "step one", "step two", "step three",
];

export function validateDocumentQuality(doc: PageDocument): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Hero exists
  const hasHero = doc.sections.some((s) => s.type === "hero" && s.visible);
  if (!hasHero) {
    issues.push({ severity: "error", message: "Page is missing a hero section", autoRepairable: false });
  }

  // Footer exists
  const hasFooter = doc.sections.some((s) => s.type === "footer" && s.visible);
  if (!hasFooter) {
    issues.push({ severity: "error", message: "Page is missing a footer section", autoRepairable: false });
  }

  // At least one CTA above fold (hero or first 3 sections)
  const topSections = doc.sections.filter((s) => s.visible).sort((a, b) => a.order - b.order).slice(0, 3);
  const hasCtaAboveFold = topSections.some((s) => {
    const buttons = s.content.buttons as ButtonRef[] | undefined;
    if (buttons && buttons.length > 0) return true;
    if (s.type === "hero") return true; // hero always has CTA intent
    return false;
  });
  if (!hasCtaAboveFold) {
    issues.push({ severity: "warning", message: "No CTA found above the fold (first 3 sections)", autoRepairable: false });
  }

  // Hero has visual for local/service pages
  if (hasHero && (doc.meta.pageType === "local-business" || doc.meta.pageType === "service-business")) {
    const hero = doc.sections.find((s) => s.type === "hero");
    if (hero) {
      const hasImage = !!(hero.content.heroImageId || hero.assets?.imageIds?.length);
      const isVisualVariant = hero.variant === "split-image" || hero.variant === "background-image";
      if (!hasImage && isVisualVariant) {
        issues.push({
          severity: "warning",
          section: hero.id,
          message: "Hero has visual variant but no image assigned",
          autoRepairable: false,
        });
      }
    }
  }

  // Check for placeholder copy
  for (const section of doc.sections) {
    checkPlaceholderCopy(section, issues);
  }

  // Check actions resolve
  for (const section of doc.sections) {
    checkActionReferences(section, doc.actions, issues);
  }

  return issues;
}

function checkPlaceholderCopy(section: Section, issues: QualityIssue[]): void {
  const content = section.content;

  // Check heading
  const heading = content.heading as string | undefined;
  if (heading && PLACEHOLDER_TITLES.includes(heading.toLowerCase().trim())) {
    issues.push({
      severity: "warning",
      section: section.id,
      message: `Section "${section.type}" has placeholder title: "${heading}"`,
      autoRepairable: false,
    });
  }

  // Check items titles
  const items = content.items as Array<{ title?: string }> | undefined;
  if (items) {
    for (const item of items) {
      if (item.title && PLACEHOLDER_TITLES.includes(item.title.toLowerCase().trim())) {
        issues.push({
          severity: "warning",
          section: section.id,
          message: `Section "${section.type}" has placeholder item title: "${item.title}"`,
          autoRepairable: false,
        });
      }
    }
  }
}

function checkActionReferences(section: Section, actions: Action[], issues: QualityIssue[]): void {
  const buttons = section.content.buttons as ButtonRef[] | undefined;
  if (!buttons) return;

  for (const button of buttons) {
    if (button.actionId && !actions.find((a) => a.id === button.actionId)) {
      issues.push({
        severity: "error",
        section: section.id,
        message: `Button "${button.text}" references unknown action ID: "${button.actionId}"`,
        autoRepairable: false,
      });
    }
  }
}

/**
 * Auto-repair what we can in the document.
 * Returns the repaired document and list of repairs made.
 */
export function autoRepairDocument(doc: PageDocument): { doc: PageDocument; repairs: string[] } {
  const repairs: string[] = [];
  const sections = [...doc.sections];

  // Ensure footer exists
  const hasFooter = sections.some((s) => s.type === "footer" && s.visible);
  if (!hasFooter) {
    const footerSection: Section = {
      id: `section-footer-${Math.random().toString(36).substring(2, 8)}`,
      type: "footer",
      variant: "multi-column",
      visible: true,
      order: sections.length,
      content: {
        companyName: doc.meta.title || "Company",
        tagline: doc.meta.description || "",
        columns: [],
        copyrightYear: new Date().getFullYear().toString(),
      },
      style: { backgroundColor: "#111827", textColor: "#d1d5db", padding: "60px 0" },
    };
    sections.push(footerSection);
    repairs.push("Added missing footer section");
  }

  return { doc: { ...doc, sections }, repairs };
}
