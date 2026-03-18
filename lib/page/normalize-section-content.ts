/**
 * Normalize section content shapes to match renderer expectations.
 * The LLM sometimes returns raw arrays where the renderer expects
 * an object with named fields (e.g., { items: [...] } not just [...]).
 *
 * This runs BEFORE persistence so we never store malformed content.
 */

import type { Section, SectionType, PageDocument } from "./schema";

/**
 * Expected content shape per section type.
 * For each type, defines the required wrapper fields and which field
 * should receive a top-level array if the LLM returns one.
 */
const ARRAY_FIELD_MAP: Partial<Record<SectionType, string>> = {
  "trust-bar": "items",
  features: "items",
  benefits: "items",
  services: "items",
  testimonials: "items",
  faq: "items",
  "how-it-works": "steps",
  results: "stats",
  pricing: "plans",
  gallery: "images",
  "service-area": "areas",
};

/**
 * Default content scaffolds for each section type.
 * Only fields that the renderer absolutely needs to not crash.
 */
const CONTENT_DEFAULTS: Partial<Record<SectionType, Record<string, unknown>>> = {
  hero: { heading: "", subheading: "" },
  "trust-bar": { items: [] },
  features: { heading: "", items: [] },
  benefits: { heading: "", items: [] },
  "problem-solution": {
    heading: "",
    problem: { heading: "", description: "", points: [] },
    solution: { heading: "", description: "", points: [] },
  },
  "how-it-works": { heading: "", steps: [] },
  services: { heading: "", items: [] },
  testimonials: { heading: "", items: [] },
  results: { heading: "", stats: [] },
  pricing: { heading: "", plans: [] },
  faq: { heading: "", items: [] },
  "cta-band": { heading: "" },
  contact: { heading: "", fields: ["name", "email", "message"] },
  footer: { companyName: "", columns: [], copyrightYear: new Date().getFullYear().toString() },
  gallery: { heading: "", images: [] },
  "service-area": { heading: "", areas: [] },
  "about-team": { heading: "" },
};

/**
 * Normalize a single section's content to match the renderer contract.
 * Returns the normalized content and a list of fixes applied.
 */
export function normalizeSectionContent(
  section: Section
): { content: Record<string, unknown>; fixes: string[] } {
  const fixes: string[] = [];
  let content = section.content;
  const stype = section.type as SectionType;

  // Fix 0: Guarantee content is an object before any property access.
  // The LLM can return a string, number, boolean, null, or undefined.
  if (content === null || content === undefined) {
    content = {};
    fixes.push(`Replaced null/undefined content with empty object for ${stype}`);
  } else if (typeof content === "string") {
    // A bare string — use it as the heading if the type normally has one
    const defaults = CONTENT_DEFAULTS[stype];
    if (defaults && "heading" in defaults) {
      content = { heading: content as unknown as string };
    } else {
      content = {};
    }
    fixes.push(`Replaced string content with object for ${stype}`);
  } else if (typeof content === "number" || typeof content === "boolean") {
    content = {};
    fixes.push(`Replaced primitive content (${typeof content}) with empty object for ${stype}`);
  }

  // Fix 1: If content is a raw array, wrap it in the expected field
  if (Array.isArray(content)) {
    const wrapperField = ARRAY_FIELD_MAP[stype];
    if (wrapperField) {
      content = { [wrapperField]: content };
      fixes.push(`Wrapped raw array in "${wrapperField}" for ${stype}`);
    } else {
      // Fallback: store as items
      content = { items: content };
      fixes.push(`Wrapped unknown raw array in "items" for ${stype}`);
    }
  }

  // Fix 2: If the expected array field is missing but there's a top-level array
  // in a wrongly-named field, remap it
  const expectedArrayField = ARRAY_FIELD_MAP[stype];
  if (expectedArrayField && !content[expectedArrayField]) {
    // Check common misnaming patterns
    const remappings: Record<string, string[]> = {
      items: ["features", "benefits", "services", "testimonials", "faqs", "questions"],
      steps: ["items", "process"],
      stats: ["items", "metrics", "statistics", "results"],
      plans: ["items", "tiers"],
      images: ["items", "photos"],
      areas: ["items", "locations", "regions"],
    };

    const candidates = remappings[expectedArrayField] || [];
    for (const candidate of candidates) {
      if (Array.isArray(content[candidate])) {
        content = { ...content, [expectedArrayField]: content[candidate] };
        delete (content as Record<string, unknown>)[candidate];
        fixes.push(`Remapped "${candidate}" to "${expectedArrayField}" for ${stype}`);
        break;
      }
    }
  }

  // Fix 3: Ensure required scaffold fields exist with defaults
  const defaults = CONTENT_DEFAULTS[stype];
  if (defaults) {
    for (const [key, defaultVal] of Object.entries(defaults)) {
      if (content[key] === undefined || content[key] === null) {
        content = { ...content, [key]: defaultVal };
        fixes.push(`Added missing default "${key}" for ${stype}`);
      }
    }
  }

  // Fix 4: problem-solution specific — ensure problem/solution are objects
  if (stype === "problem-solution") {
    if (typeof content.problem === "string") {
      content = { ...content, problem: { heading: content.problem as string, description: "", points: [] } };
      fixes.push("Converted string problem to object for problem-solution");
    }
    if (typeof content.solution === "string") {
      content = { ...content, solution: { heading: content.solution as string, description: "", points: [] } };
      fixes.push("Converted string solution to object for problem-solution");
    }
    // Ensure points arrays exist
    const prob = content.problem as Record<string, unknown> | undefined;
    const sol = content.solution as Record<string, unknown> | undefined;
    if (prob && !Array.isArray(prob.points)) {
      content = { ...content, problem: { ...prob, points: [] } };
      fixes.push("Added missing points array to problem");
    }
    if (sol && !Array.isArray(sol.points)) {
      content = { ...content, solution: { ...sol, points: [] } };
      fixes.push("Added missing points array to solution");
    }
  }

  // Fix 5: Ensure array fields contain arrays, not other types
  if (expectedArrayField && content[expectedArrayField] !== undefined && !Array.isArray(content[expectedArrayField])) {
    content = { ...content, [expectedArrayField]: [] };
    fixes.push(`Reset non-array "${expectedArrayField}" to empty array for ${stype}`);
  }

  // Fix 6: Ensure section has basic required structure fields
  if (!content.heading && defaults?.heading !== undefined && stype !== "trust-bar") {
    // heading is already defaulted above, but ensure it's a string
    if (typeof content.heading !== "string") {
      content = { ...content, heading: String(content.heading || "") };
    }
  }

  return { content, fixes };
}

/**
 * Normalize all sections in a PageDocument.
 * Returns the normalized doc and aggregate fixes list.
 */
export function normalizeDocumentContent(
  doc: PageDocument
): { doc: PageDocument; fixes: string[] } {
  const allFixes: string[] = [];

  const normalizedSections = doc.sections.map((section) => {
    const { content, fixes } = normalizeSectionContent(section);
    allFixes.push(...fixes);
    return { ...section, content };
  });

  return {
    doc: { ...doc, sections: normalizedSections },
    fixes: allFixes,
  };
}

/**
 * Validate that a section's content is renderable.
 * Returns false if the content shape would cause a render crash.
 */
export function isSectionContentRenderable(section: Section): boolean {
  const stype = section.type as SectionType;
  const c = section.content;

  switch (stype) {
    case "trust-bar":
      return Array.isArray(c.items);
    case "features":
    case "benefits":
    case "services":
      return !!c.heading && Array.isArray(c.items);
    case "how-it-works":
      return !!c.heading && Array.isArray(c.steps);
    case "testimonials":
      return !!c.heading && Array.isArray(c.items);
    case "results":
      return !!c.heading && Array.isArray(c.stats);
    case "pricing":
      return !!c.heading && Array.isArray(c.plans);
    case "faq":
      return !!c.heading && Array.isArray(c.items);
    case "problem-solution":
      return !!c.heading && typeof c.problem === "object" && typeof c.solution === "object";
    case "contact":
      return !!c.heading && Array.isArray(c.fields);
    case "footer":
      return !!c.companyName;
    case "gallery":
      return !!c.heading && Array.isArray(c.images);
    case "service-area":
      return !!c.heading && Array.isArray(c.areas);
    case "about-team":
      return !!c.heading;
    case "hero":
      return !!c.heading;
    case "cta-band":
      return !!c.heading;
    default:
      return true; // Unknown types pass through
  }
}
