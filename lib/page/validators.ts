import type { Section, SectionType, PageDocument, Action, Asset, ButtonRef } from "./schema";

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
  "lorem ipsum", "untitled", "heading", "subheading",
  "enter title", "title here", "add title",
];

const GENERIC_HERO_TITLES = [
  "welcome", "welcome to our website", "home",
  "your business name", "hero title",
  "we are the best", "number one",
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

  // Hero has a non-generic title
  if (hasHero) {
    const hero = doc.sections.find((s) => s.type === "hero");
    const heroHeading = (hero?.content.heading as string || "").toLowerCase().trim();
    if (heroHeading && GENERIC_HERO_TITLES.includes(heroHeading)) {
      issues.push({
        severity: "warning",
        section: hero!.id,
        message: `Hero has generic title: "${hero!.content.heading}"`,
        autoRepairable: false,
      });
    }
  }

  // Check minimum meaningful sections (hero + at least 2 body + footer)
  const visibleSections = doc.sections.filter((s) => s.visible);
  if (visibleSections.length < 4) {
    issues.push({
      severity: "warning",
      message: `Page has only ${visibleSections.length} section(s) — consider at least 4 for a complete page`,
      autoRepairable: false,
    });
  }

  // Check for duplicate section headings
  const headings = doc.sections
    .filter((s) => s.visible && s.content.heading)
    .map((s) => (s.content.heading as string).toLowerCase().trim());
  const seen = new Set<string>();
  for (const h of headings) {
    if (seen.has(h)) {
      issues.push({
        severity: "warning",
        message: `Duplicate section heading: "${h}"`,
        autoRepairable: false,
      });
    }
    seen.add(h);
  }

  // Check for placeholder copy
  for (const section of doc.sections) {
    checkPlaceholderCopy(section, issues);
  }

  // Check actions resolve
  for (const section of doc.sections) {
    checkActionReferences(section, doc.actions, issues);
  }

  // Check assets referenced actually exist
  for (const section of doc.sections) {
    checkAssetReferences(section, doc.assets, issues);
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
        autoRepairable: true,
      });
    }
  }
}

function checkAssetReferences(section: Section, assets: Asset[], issues: QualityIssue[]): void {
  const assetIds = new Set(assets.map((a) => a.id));

  // Check heroImageId
  const heroImgId = section.content.heroImageId as string | undefined;
  if (heroImgId && !assetIds.has(heroImgId)) {
    issues.push({
      severity: "warning",
      section: section.id,
      message: `Section "${section.type}" references missing asset: "${heroImgId}"`,
      autoRepairable: true,
    });
  }

  // Check gallery images
  const images = section.content.images as Array<{ imageId?: string }> | undefined;
  if (images) {
    for (const img of images) {
      if (img.imageId && !assetIds.has(img.imageId)) {
        issues.push({
          severity: "warning",
          section: section.id,
          message: `Gallery image references missing asset: "${img.imageId}"`,
          autoRepairable: true,
        });
      }
    }
  }

  // Check section-level asset refs
  if (section.assets?.imageIds) {
    for (const id of section.assets.imageIds) {
      if (!assetIds.has(id)) {
        issues.push({
          severity: "warning",
          section: section.id,
          message: `Section "${section.type}" asset list references missing asset: "${id}"`,
          autoRepairable: true,
        });
      }
    }
  }
}

/**
 * Auto-repair what we can in the document.
 * Returns the repaired document and list of repairs made.
 */
export function autoRepairDocument(doc: PageDocument): { doc: PageDocument; repairs: string[] } {
  const repairs: string[] = [];
  let sections = [...doc.sections];
  const actions = [...doc.actions];
  const assetIds = new Set(doc.assets.map((a) => a.id));

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

  // Repair broken action references — remove buttons with invalid actionIds
  sections = sections.map((section) => {
    const buttons = section.content.buttons as ButtonRef[] | undefined;
    if (!buttons) return section;

    const validButtons = buttons.filter((btn) => {
      if (!btn.actionId) return true;
      return actions.some((a) => a.id === btn.actionId);
    });

    if (validButtons.length < buttons.length) {
      repairs.push(`Removed ${buttons.length - validButtons.length} broken button(s) from "${section.type}"`);
      return { ...section, content: { ...section.content, buttons: validButtons } };
    }
    return section;
  });

  // Repair broken asset references — clear refs to missing assets
  sections = sections.map((section) => {
    const content = { ...section.content };
    let changed = false;

    // Clear broken heroImageId
    const heroImgId = content.heroImageId as string | undefined;
    if (heroImgId && !assetIds.has(heroImgId)) {
      delete content.heroImageId;
      changed = true;
    }

    // Clear broken gallery image refs
    const images = content.images as Array<{ imageId?: string }> | undefined;
    if (images) {
      content.images = images.map((img) => {
        if (img.imageId && !assetIds.has(img.imageId)) {
          changed = true;
          return { ...img, imageId: undefined };
        }
        return img;
      });
    }

    // Clean section-level asset refs
    if (section.assets?.imageIds) {
      const validIds = section.assets.imageIds.filter((id) => assetIds.has(id));
      if (validIds.length < section.assets.imageIds.length) {
        changed = true;
        return { ...section, content, assets: { ...section.assets, imageIds: validIds } };
      }
    }

    if (changed) {
      repairs.push(`Cleaned broken asset references in "${section.type}"`);
      return { ...section, content };
    }
    return section;
  });

  // Auto-bind hero image if hero has visual variant but no image, and assets are available
  const heroSection = sections.find((s) => s.type === "hero" && s.visible);
  if (heroSection) {
    const hasVisualVariant = heroSection.variant === "split-image" || heroSection.variant === "background-image";
    const hasImage = !!(heroSection.content.heroImageId as string);
    if (hasVisualVariant && !hasImage && doc.assets.length > 0) {
      const heroAsset = doc.assets.find((a) => a.kind === "image");
      if (heroAsset) {
        sections = sections.map((s) =>
          s.id === heroSection.id
            ? { ...s, content: { ...s.content, heroImageId: heroAsset.id } }
            : s
        );
        repairs.push(`Auto-assigned hero image from available assets`);
      }
    }
  }

  return { doc: { ...doc, sections, actions }, repairs };
}
