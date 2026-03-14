import { chatCompletion, parseJSON } from "./openai-client";
import type { Section, SectionType, Brand } from "@/lib/page/schema";
import { getDefaultVariant } from "@/lib/page/section-library";
import { validateSectionContent } from "@/lib/page/validators";
import { createDefaultSection } from "@/lib/page/section-library";

interface SectionPlan {
  type: SectionType;
  description: string;
}

// Generate content for all sections in sequence
export async function generateAllSectionsV2(
  sectionSequence: SectionPlan[],
  businessContext: Record<string, unknown>,
  brand: Brand
): Promise<Section[]> {
  const sections: Section[] = [];
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
    sections.push(section);
    generatedTypes.push(plan.type);
  }

  return sections;
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
- For business-specific sections, reference the actual business type and audience`;

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
  "primaryCtaText": "Primary button text",
  "primaryCtaHref": "#contact",
  "secondaryCtaText": "Secondary button text or empty string",
  "secondaryCtaHref": "#features",
  "trustPoints": ["Short trust point 1", "Short trust point 2", "Short trust point 3"]
}`,
  "trust-bar": `{
  "items": [
    {"text": "Metric or badge text", "icon": "users"},
    {"text": "Metric or badge text", "icon": "clock"},
    {"text": "Metric or badge text", "icon": "star"},
    {"text": "Metric or badge text", "icon": "shield"}
  ]
}`,
  features: `{
  "heading": "Section heading",
  "subheading": "Brief intro text",
  "items": [
    {"title": "Feature name", "description": "2-3 sentence description", "icon": "star"},
    {"title": "Feature name", "description": "2-3 sentence description", "icon": "zap"},
    {"title": "Feature name", "description": "2-3 sentence description", "icon": "shield"}
  ]
}`,
  benefits: `{
  "heading": "Section heading about benefits",
  "subheading": "Why choose this business",
  "items": [
    {"title": "Benefit name", "description": "How this helps the customer", "icon": "check"},
    {"title": "Benefit name", "description": "How this helps the customer", "icon": "check"},
    {"title": "Benefit name", "description": "How this helps the customer", "icon": "check"},
    {"title": "Benefit name", "description": "How this helps the customer", "icon": "check"}
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
    {"step": "1", "title": "First step name", "description": "What happens in this step"},
    {"step": "2", "title": "Second step name", "description": "What happens in this step"},
    {"step": "3", "title": "Third step name", "description": "What happens in this step"}
  ]
}`,
  services: `{
  "heading": "Our Services",
  "subheading": "What we offer",
  "items": [
    {"title": "Service name", "description": "2-3 sentence description of this service", "icon": "briefcase"},
    {"title": "Service name", "description": "2-3 sentence description of this service", "icon": "briefcase"},
    {"title": "Service name", "description": "2-3 sentence description of this service", "icon": "briefcase"}
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
    {"value": "500+", "label": "Metric label"},
    {"value": "98%", "label": "Metric label"},
    {"value": "10+", "label": "Metric label"},
    {"value": "24/7", "label": "Metric label"}
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
      "ctaText": "Get Started",
      "highlighted": false
    },
    {
      "name": "Plan name",
      "price": "$XX",
      "period": "/month or one-time",
      "description": "Brief plan description",
      "features": ["All previous features", "Feature 4", "Feature 5"],
      "ctaText": "Get Started",
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
  "buttonText": "Primary action button text",
  "buttonHref": "#contact"
}`,
  contact: `{
  "heading": "Get In Touch",
  "subheading": "Supporting text about contacting",
  "fields": ["name", "email", "phone", "message"],
  "buttonText": "Send Message",
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
};
