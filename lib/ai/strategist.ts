import { chatCompletion, parseJSON } from "./openai-client";
import type { PageType, SectionType } from "@/lib/page/schema";

export interface PageStrategy {
  pageType: PageType;
  sectionSequence: Array<{ type: SectionType; description: string }>;
  ctaStrategy: {
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta?: string;
    ctaPlacement: string;
  };
}

export async function generateStrategy(
  businessContext: Record<string, unknown>,
  competitorInsights: Record<string, unknown> | null
): Promise<PageStrategy | null> {
  const prompt = `You are a landing page strategist. Analyze the business context and determine the optimal page type, section sequence, and CTA strategy.

BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}

${competitorInsights ? `COMPETITOR INSIGHTS:\n${JSON.stringify(competitorInsights, null, 2)}` : "No competitor data available."}

Respond with valid JSON:
{
  "pageType": "local-business" | "service-business" | "saas" | "coach" | "product-sales",
  "sectionSequence": [
    { "type": "<section-type>", "description": "Purpose of this section for this specific business" }
  ],
  "ctaStrategy": {
    "primaryCta": "Main button text",
    "primaryCtaHref": "#contact",
    "secondaryCta": "Optional secondary button text",
    "ctaPlacement": "Description of where CTAs should appear"
  }
}

RULES:
- Choose pageType based on the business description
- Include 8-12 sections for a complete landing page
- ALWAYS start with "hero"
- ALWAYS end with "footer"
- Include at least one "cta-band" section between content sections
- For local/service businesses: include services, how-it-works, testimonials
- For SaaS: include features, pricing, how-it-works
- For coaches: include benefits, results, testimonials
- Section types must be from: hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer
- Make descriptions specific to THIS business
- A good default sequence for a service business:
  hero, trust-bar, services, problem-solution, how-it-works, results, testimonials, faq, cta-band, contact, footer`;

  const result = await chatCompletion(
    "You are an expert landing page strategist. Respond only with valid JSON.",
    prompt,
    { temperature: 0.7, maxTokens: 2000 }
  );

  return parseJSON<PageStrategy>(result);
}
