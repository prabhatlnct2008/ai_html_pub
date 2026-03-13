import { chatCompletion, parseJSON } from "./openai-client";
import { buildSectionGeneratorPrompt } from "./prompts/generator";
import type { PagePlanData } from "./planner";

export interface SectionData {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  style: Record<string, unknown>;
}

export async function generateAllSections(
  plan: PagePlanData,
  businessContext: Record<string, unknown>
): Promise<SectionData[]> {
  const sections: SectionData[] = [];
  const sectionTypes: string[] = [];

  for (let i = 0; i < plan.sections.length; i++) {
    const sectionPlan = plan.sections[i];
    sectionTypes.push(sectionPlan.type);

    const prompt = buildSectionGeneratorPrompt(
      sectionPlan.type,
      sectionPlan.description,
      businessContext,
      plan.branding,
      sectionTypes.slice(0, i) // sections generated so far
    );

    const result = await chatCompletion(
      "You are a landing page content generator. Respond only with valid JSON.",
      prompt,
      { temperature: 0.7, maxTokens: 1500 }
    );

    const section = parseJSON<SectionData>(result);
    if (section) {
      section.order = i;
      sections.push(section);
    } else {
      // Fallback: create a minimal section with placeholder content
      sections.push(createFallbackSection(sectionPlan.type, i, plan.branding));
    }
  }

  return sections;
}

function createFallbackSection(
  type: string,
  order: number,
  branding: PagePlanData["branding"]
): SectionData {
  const id = `section-${type}-${Math.random().toString(36).substring(2, 8)}`;
  const defaults: Record<string, Record<string, unknown>> = {
    hero: {
      heading: "Welcome to Our Business",
      subheading: "We help you achieve your goals",
      cta_text: "Get Started",
      cta_link: "#contact",
      secondary_cta_text: "Learn More",
      secondary_cta_link: "#features",
    },
    features: {
      heading: "Our Features",
      subheading: "What makes us different",
      items: [
        { title: "Feature 1", description: "Description of feature 1", icon: "⭐" },
        { title: "Feature 2", description: "Description of feature 2", icon: "🚀" },
        { title: "Feature 3", description: "Description of feature 3", icon: "💡" },
      ],
    },
    testimonials: {
      heading: "What Our Customers Say",
      items: [
        { quote: "Great service!", author: "John Doe", role: "Customer", avatar: "" },
        { quote: "Highly recommended!", author: "Jane Smith", role: "Customer", avatar: "" },
      ],
    },
    pricing: {
      heading: "Our Pricing",
      subheading: "Choose the right plan for you",
      plans: [
        { name: "Basic", price: "$29", period: "/month", features: ["Feature 1", "Feature 2"], cta_text: "Get Started", highlighted: false },
        { name: "Pro", price: "$59", period: "/month", features: ["All Basic features", "Feature 3", "Feature 4"], cta_text: "Get Started", highlighted: true },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions",
      items: [
        { question: "How does it work?", answer: "It's simple and easy to use." },
        { question: "What's included?", answer: "Everything you need to get started." },
      ],
    },
    cta: {
      heading: "Ready to Get Started?",
      subheading: "Join thousands of satisfied customers",
      button_text: "Get Started Now",
      button_link: "#contact",
    },
    contact: {
      heading: "Get In Touch",
      subheading: "We'd love to hear from you",
      fields: ["name", "email", "message"],
      button_text: "Send Message",
    },
  };

  return {
    id,
    type,
    order,
    content: defaults[type] || defaults["cta"],
    style: {
      background_color: type === "hero" || type === "cta" ? branding.primary_color : "#ffffff",
      text_color: type === "hero" || type === "cta" ? "#ffffff" : "#1a1a1a",
      padding: "60px 0",
    },
  };
}
