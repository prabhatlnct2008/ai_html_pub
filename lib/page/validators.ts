import type { Section, SectionType, SECTION_TYPES } from "./schema";

// Validate that AI-generated section content has the required fields for its type.
// Returns the section as-is if valid, or patches missing fields with defaults.

const REQUIRED_FIELDS: Record<string, string[]> = {
  hero: ["heading", "subheading", "primaryCtaText", "primaryCtaHref"],
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
  "cta-band": ["heading", "buttonText", "buttonHref"],
  contact: ["heading", "fields", "buttonText"],
  footer: ["companyName", "columns", "copyrightYear"],
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
    "faq", "cta-band", "contact", "footer",
  ];
  return validTypes.includes(type);
}
