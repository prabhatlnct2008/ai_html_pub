import { chatCompletion, parseJSON } from "./openai-client";
import type { Section, SectionType, Brand, Action, ButtonRef } from "@/lib/page/schema";
import { getDefaultVariant } from "@/lib/page/section-library";
import { validateSectionContent } from "@/lib/page/validators";
import { createDefaultSection } from "@/lib/page/section-library";

interface SectionPlan {
  type: SectionType;
  description: string;
}

export interface GenerationResult {
  sections: Section[];
  actions: Action[];
}

// Generate content for all sections in sequence, collecting actions
export async function generateAllSectionsV2(
  sectionSequence: SectionPlan[],
  businessContext: Record<string, unknown>,
  brand: Brand
): Promise<Section[]> {
  const result = await generateAllSectionsWithActions(sectionSequence, businessContext, brand);
  return result.sections;
}

// Full V2 generation that also returns collected actions
export async function generateAllSectionsWithActions(
  sectionSequence: SectionPlan[],
  businessContext: Record<string, unknown>,
  brand: Brand
): Promise<GenerationResult> {
  const sections: Section[] = [];
  const actions: Action[] = [];
  const generatedTypes: string[] = [];

  for (let i = 0; i < sectionSequence.length; i++) {
    const plan = sectionSequence[i];
    const section = await generateSingleSection(
      plan.type,
      plan.description,
      businessContext,
      brand,
      generatedTypes,
      i
    );

    // Extract actions from generated content and wire up buttonRefs
    extractAndWireActions(section, actions, businessContext);

    sections.push(section);
    generatedTypes.push(plan.type);
  }

  return { sections, actions };
}

async function generateSingleSection(
  type: SectionType,
  description: string,
  businessContext: Record<string, unknown>,
  brand: Brand,
  existingSections: string[],
  order: number
): Promise<Section> {
  const schema = SECTION_CONTENT_SCHEMAS[type];
  if (!schema) {
    return createDefaultSection(type, undefined, brand);
  }

  const prompt = `Generate content for a "${type}" section of a landing page.

BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}

BRAND:
- Tone: ${brand.tone}
- Primary Color: ${brand.primaryColor}
- Secondary Color: ${brand.secondaryColor}

SECTION PURPOSE: ${description}

OTHER SECTIONS ON THE PAGE: ${existingSections.join(", ") || "none yet"}

Respond with ONLY valid JSON matching this exact schema:
${schema}

RULES:
- Content must be specific to this business, not generic placeholder text
- Keep text concise and impactful
- Generate realistic, professional content
- Do not repeat content from other sections
- For lists/items, generate 3-4 items unless specified otherwise
- For business-specific sections, reference the actual business type and audience
- For iconIntent fields, use semantic descriptors like "training", "trust", "speed", "quality", "support", "innovation", "security", "growth", "value", "people", "health", "location", "time", "education"
- For buttons, use descriptive action text specific to the business (not generic "Click Here")`;

  const result = await chatCompletion(
    "You are a landing page content generator. Respond only with valid JSON matching the requested schema exactly.",
    prompt,
    { temperature: 0.7, maxTokens: 2000 }
  );

  const content = parseJSON<Record<string, unknown>>(result);
  if (!content) {
    return createDefaultSection(type, undefined, brand);
  }

  const section: Section = {
    id: `section-${type}-${Math.random().toString(36).substring(2, 8)}`,
    type,
    variant: getDefaultVariant(type),
    visible: true,
    order,
    content,
    style: getSectionStyle(type, brand),
  };

  // Validate and fall back if invalid
  const validation = validateSectionContent(section);
  if (!validation.valid) {
    const fallback = createDefaultSection(type, undefined, brand);
    // Merge what we got with defaults
    return {
      ...fallback,
      order,
      content: { ...fallback.content, ...content },
    };
  }

  return section;
}

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

// ---- Type-Specific Content Schemas ----

const SECTION_CONTENT_SCHEMAS: Record<string, string> = {
  hero: `{
  "heading": "Main headline (powerful, concise, 5-10 words)",
  "subheading": "Supporting text (1-2 sentences explaining value prop)",
  "buttons": [
    {"text": "Primary action button text", "style": "primary"},
    {"text": "Secondary button text", "style": "secondary"}
  ],
  "trustPoints": ["Short trust point 1", "Short trust point 2", "Short trust point 3"]
}`,
  "trust-bar": `{
  "items": [
    {"text": "Metric or badge text", "iconIntent": "people"},
    {"text": "Metric or badge text", "iconIntent": "time"},
    {"text": "Metric or badge text", "iconIntent": "quality"},
    {"text": "Metric or badge text", "iconIntent": "trust"}
  ]
}`,
  features: `{
  "heading": "Section heading",
  "subheading": "Brief intro text",
  "items": [
    {"title": "Feature name", "description": "2-3 sentence description", "iconIntent": "innovation"},
    {"title": "Feature name", "description": "2-3 sentence description", "iconIntent": "speed"},
    {"title": "Feature name", "description": "2-3 sentence description", "iconIntent": "security"}
  ]
}`,
  benefits: `{
  "heading": "Section heading about benefits",
  "subheading": "Why choose this business",
  "items": [
    {"title": "Benefit name", "description": "How this helps the customer", "iconIntent": "quality"},
    {"title": "Benefit name", "description": "How this helps the customer", "iconIntent": "value"},
    {"title": "Benefit name", "description": "How this helps the customer", "iconIntent": "support"},
    {"title": "Benefit name", "description": "How this helps the customer", "iconIntent": "growth"}
  ]
}`,
  "problem-solution": `{
  "heading": "Overall section heading",
  "problem": {
    "heading": "The problem/challenge heading",
    "description": "1-2 sentences describing the pain",
    "points": ["Specific pain point 1", "Specific pain point 2", "Specific pain point 3"]
  },
  "solution": {
    "heading": "The solution heading",
    "description": "1-2 sentences describing the solution",
    "points": ["How we solve point 1", "How we solve point 2", "How we solve point 3"]
  }
}`,
  "how-it-works": `{
  "heading": "How It Works",
  "subheading": "Simple process description",
  "steps": [
    {"step": "1", "title": "First step name", "description": "What happens in this step", "iconIntent": "education"},
    {"step": "2", "title": "Second step name", "description": "What happens in this step", "iconIntent": "growth"},
    {"step": "3", "title": "Third step name", "description": "What happens in this step", "iconIntent": "quality"}
  ]
}`,
  services: `{
  "heading": "Our Services",
  "subheading": "What we offer",
  "items": [
    {"title": "Service name", "description": "2-3 sentence description of this service", "iconIntent": "business"},
    {"title": "Service name", "description": "2-3 sentence description of this service", "iconIntent": "innovation"},
    {"title": "Service name", "description": "2-3 sentence description of this service", "iconIntent": "support"}
  ]
}`,
  testimonials: `{
  "heading": "What Our Customers Say",
  "items": [
    {"quote": "Detailed testimonial quote (2-3 sentences)", "author": "Full Name", "role": "Title or Company"},
    {"quote": "Detailed testimonial quote (2-3 sentences)", "author": "Full Name", "role": "Title or Company"},
    {"quote": "Detailed testimonial quote (2-3 sentences)", "author": "Full Name", "role": "Title or Company"}
  ]
}`,
  results: `{
  "heading": "Our Results",
  "subheading": "Numbers that demonstrate our impact",
  "stats": [
    {"value": "500+", "label": "Metric label", "iconIntent": "people"},
    {"value": "98%", "label": "Metric label", "iconIntent": "quality"},
    {"value": "10+", "label": "Metric label", "iconIntent": "time"},
    {"value": "24/7", "label": "Metric label", "iconIntent": "support"}
  ],
  "description": "Optional supporting text about results"
}`,
  pricing: `{
  "heading": "Pricing",
  "subheading": "Choose the right plan for you",
  "plans": [
    {
      "name": "Plan name",
      "price": "$XX",
      "period": "/month or one-time",
      "description": "Brief plan description",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "buttons": [{"text": "Get Started", "style": "secondary"}],
      "highlighted": false
    },
    {
      "name": "Plan name",
      "price": "$XX",
      "period": "/month or one-time",
      "description": "Brief plan description",
      "features": ["All previous features", "Feature 4", "Feature 5"],
      "buttons": [{"text": "Get Started", "style": "primary"}],
      "highlighted": true
    }
  ]
}`,
  faq: `{
  "heading": "Frequently Asked Questions",
  "items": [
    {"question": "Common question about the business?", "answer": "Detailed answer (2-3 sentences)"},
    {"question": "Common question about the business?", "answer": "Detailed answer (2-3 sentences)"},
    {"question": "Common question about the business?", "answer": "Detailed answer (2-3 sentences)"},
    {"question": "Common question about the business?", "answer": "Detailed answer (2-3 sentences)"},
    {"question": "Common question about the business?", "answer": "Detailed answer (2-3 sentences)"}
  ]
}`,
  "cta-band": `{
  "heading": "Call to action heading",
  "subheading": "Supporting text that motivates action",
  "buttons": [
    {"text": "Primary action button text", "style": "primary"}
  ]
}`,
  contact: `{
  "heading": "Get In Touch",
  "subheading": "Supporting text about contacting",
  "fields": ["name", "email", "phone", "message"],
  "buttons": [{"text": "Send Message", "style": "primary"}],
  "email": "contact@example.com",
  "phone": "(555) 123-4567",
  "address": "123 Business St, City, State 12345"
}`,
  footer: `{
  "companyName": "Business Name",
  "tagline": "Brief tagline or description",
  "columns": [
    {
      "title": "Company",
      "links": [
        {"text": "About Us", "href": "#"},
        {"text": "Contact", "href": "#contact"},
        {"text": "Careers", "href": "#"}
      ]
    },
    {
      "title": "Services",
      "links": [
        {"text": "Service 1", "href": "#services"},
        {"text": "Service 2", "href": "#services"},
        {"text": "Pricing", "href": "#pricing"}
      ]
    }
  ],
  "socialLinks": [
    {"platform": "Facebook", "url": "#"},
    {"platform": "Instagram", "url": "#"},
    {"platform": "LinkedIn", "url": "#"}
  ],
  "copyrightYear": "${new Date().getFullYear()}",
  "legalLinks": [
    {"text": "Privacy Policy", "href": "#"},
    {"text": "Terms of Service", "href": "#"}
  ]
}`,
  gallery: `{
  "heading": "Our Work",
  "subheading": "See what we've accomplished",
  "images": [
    {"alt": "Description of image 1"},
    {"alt": "Description of image 2"},
    {"alt": "Description of image 3"},
    {"alt": "Description of image 4"}
  ]
}`,
  "service-area": `{
  "heading": "Areas We Serve",
  "subheading": "Proudly serving these communities",
  "areas": [
    {"name": "City/Area Name", "description": "Brief description of service in this area"},
    {"name": "City/Area Name", "description": "Brief description of service in this area"},
    {"name": "City/Area Name", "description": "Brief description of service in this area"}
  ]
}`,
  "about-team": `{
  "heading": "Meet Our Team",
  "subheading": "The people behind the business",
  "description": "Brief company story or team introduction",
  "members": [
    {"name": "Full Name", "role": "Job Title", "bio": "Brief bio (1-2 sentences)", "iconIntent": "people"},
    {"name": "Full Name", "role": "Job Title", "bio": "Brief bio (1-2 sentences)", "iconIntent": "people"}
  ]
}`,
};

// ---- Action Extraction ----

/**
 * Extract buttons from generated content, create Action objects, and wire up ButtonRef.actionId
 */
function extractAndWireActions(
  section: Section,
  actions: Action[],
  businessContext: Record<string, unknown>
): void {
  const content = section.content;

  // Handle top-level buttons (hero, cta-band, contact)
  if (content.buttons && Array.isArray(content.buttons)) {
    content.buttons = wireButtons(content.buttons as ButtonRef[], section.type, actions, businessContext);
  }

  // Handle legacy fields — convert to buttons
  if (content.primaryCtaText && !content.buttons) {
    const btn = createButtonFromLegacy(
      content.primaryCtaText as string,
      (content.primaryCtaHref as string) || "#contact",
      "primary",
      section.type,
      actions,
      businessContext
    );
    const buttons: ButtonRef[] = [btn];
    if (content.secondaryCtaText) {
      buttons.push(createButtonFromLegacy(
        content.secondaryCtaText as string,
        (content.secondaryCtaHref as string) || "#",
        "secondary",
        section.type,
        actions,
        businessContext
      ));
    }
    content.buttons = buttons;
  }

  // Handle buttons in plans (pricing)
  if (content.plans && Array.isArray(content.plans)) {
    for (const plan of content.plans as Array<Record<string, unknown>>) {
      if (plan.buttons && Array.isArray(plan.buttons)) {
        plan.buttons = wireButtons(plan.buttons as ButtonRef[], `${section.type}-plan`, actions, businessContext);
      } else if (plan.ctaText) {
        plan.buttons = [createButtonFromLegacy(
          plan.ctaText as string,
          "#contact",
          "primary",
          `${section.type}-plan`,
          actions,
          businessContext
        )];
      }
    }
  }

  // Convert legacy icon fields to iconIntent
  if (content.items && Array.isArray(content.items)) {
    for (const item of content.items as Array<Record<string, unknown>>) {
      if (item.icon && !item.iconIntent) {
        item.iconIntent = mapLegacyIconToIntent(item.icon as string);
        delete item.icon;
      }
    }
  }
  if (content.steps && Array.isArray(content.steps)) {
    for (const step of content.steps as Array<Record<string, unknown>>) {
      if (step.icon && !step.iconIntent) {
        step.iconIntent = mapLegacyIconToIntent(step.icon as string);
        delete step.icon;
      }
    }
  }
}

function wireButtons(
  buttons: ButtonRef[],
  sectionType: string,
  actions: Action[],
  businessContext: Record<string, unknown>
): ButtonRef[] {
  return buttons.map((btn, idx) => {
    if (btn.actionId) return btn; // already wired
    const actionId = `action_${sectionType}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
    const action: Action = {
      id: actionId,
      label: btn.text,
      type: "scroll",
      value: "#contact",
      style: btn.style || "primary",
    };

    // Infer action type from business context
    if (businessContext.contactPhone && sectionType === "hero" && idx === 0) {
      action.type = "phone";
      action.value = businessContext.contactPhone as string;
    } else if (businessContext.contactEmail && sectionType === "contact") {
      action.type = "email";
      action.value = businessContext.contactEmail as string;
    }

    actions.push(action);
    return { text: btn.text, actionId, style: btn.style || "primary" };
  });
}

function createButtonFromLegacy(
  text: string,
  href: string,
  style: "primary" | "secondary",
  sectionType: string,
  actions: Action[],
  businessContext: Record<string, unknown>
): ButtonRef {
  const actionId = `action_${sectionType}_${style}_${Math.random().toString(36).substring(2, 6)}`;
  const action: Action = {
    id: actionId,
    label: text,
    type: inferActionType(href),
    value: href,
    style,
  };
  actions.push(action);
  return { text, actionId, style };
}

function inferActionType(href: string): Action["type"] {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp";
  if (href.startsWith("#")) return "scroll";
  return "url";
}

const LEGACY_ICON_MAP: Record<string, string> = {
  star: "quality",
  check: "trust",
  "check-circle": "trust",
  shield: "security",
  zap: "speed",
  clock: "time",
  users: "people",
  user: "people",
  heart: "health",
  briefcase: "business",
  "map-pin": "location",
  award: "quality",
  target: "growth",
  "trending-up": "growth",
  globe: "innovation",
  phone: "support",
  mail: "support",
  settings: "innovation",
  code: "innovation",
  book: "education",
  dollar: "value",
};

function mapLegacyIconToIntent(icon: string): string {
  return LEGACY_ICON_MAP[icon] || icon;
}
