import { SECTION_TYPES, type Section, type SectionType, type BrandSettings } from "./schema";

// ---- Section Variants (V2 spec) ----

export const SECTION_VARIANTS: Record<SectionType, string[]> = {
  hero: ["centered", "split-image", "background-image", "offer-focused"],
  "trust-bar": ["simple", "with-icons"],
  features: ["icon-grid", "image-cards", "list-with-icons"],
  benefits: ["icon-list", "cards"],
  "problem-solution": ["two-column", "stacked"],
  "how-it-works": ["numbered-steps", "timeline"],
  services: ["cards", "image-cards", "alternating-rows"],
  testimonials: ["cards", "avatars", "single-highlight"],
  results: ["stat-bar", "full-section"],
  pricing: ["side-by-side", "single-featured"],
  faq: ["accordion", "two-column"],
  "cta-band": ["centered", "dual", "contact-strip", "whatsapp-focused"],
  contact: ["form-only", "form-with-info"],
  footer: ["simple", "multi-column", "legal-heavy"],
  gallery: ["grid", "masonry", "carousel"],
  "service-area": ["list", "grid", "map-note"],
  "about-team": ["story", "team-grid", "values"],
};

export function getDefaultVariant(type: SectionType): string {
  return SECTION_VARIANTS[type]?.[0] || "default";
}

// ---- Section Metadata (for UI) ----

export interface SectionMeta {
  type: SectionType;
  label: string;
  description: string;
  icon: string;
}

export const SECTION_CATALOG: SectionMeta[] = [
  { type: "hero", label: "Hero", description: "Main headline, CTA buttons, and optional image", icon: "layout" },
  { type: "trust-bar", label: "Trust Bar", description: "Social proof strip with stats or badges", icon: "award" },
  { type: "features", label: "Features", description: "Key features in a grid layout", icon: "grid" },
  { type: "benefits", label: "Benefits", description: "Value propositions and advantages", icon: "check-circle" },
  { type: "problem-solution", label: "Problem / Solution", description: "Pain points and how you solve them", icon: "zap" },
  { type: "how-it-works", label: "How It Works", description: "Step-by-step process explanation", icon: "list" },
  { type: "services", label: "Services", description: "Service offerings with descriptions", icon: "briefcase" },
  { type: "testimonials", label: "Testimonials", description: "Customer quotes and reviews", icon: "message-circle" },
  { type: "results", label: "Results / Stats", description: "Key metrics and achievements", icon: "trending-up" },
  { type: "pricing", label: "Pricing", description: "Plans and pricing comparison", icon: "dollar-sign" },
  { type: "faq", label: "FAQ", description: "Frequently asked questions", icon: "help-circle" },
  { type: "cta-band", label: "CTA Band", description: "Call-to-action banner section", icon: "megaphone" },
  { type: "contact", label: "Contact", description: "Contact form and information", icon: "mail" },
  { type: "footer", label: "Footer", description: "Site footer with links and legal", icon: "minus" },
  { type: "gallery", label: "Gallery", description: "Image gallery showcase", icon: "image" },
  { type: "service-area", label: "Service Area", description: "Areas and locations served", icon: "map-pin" },
  { type: "about-team", label: "About / Team", description: "Company story and team members", icon: "users" },
];

// ---- Default Section Templates ----

export function createDefaultSection(
  type: SectionType,
  variant?: string,
  brand?: Partial<BrandSettings>
): Section {
  const id = `section-${type}-${Math.random().toString(36).substring(2, 8)}`;
  const v = variant || getDefaultVariant(type);
  const primary = brand?.primaryColor || "#2563eb";

  const defaults: Record<SectionType, { content: Record<string, unknown>; style: { backgroundColor: string; textColor: string; padding: string } }> = {
    hero: {
      content: {
        heading: "Your Headline Here",
        subheading: "A compelling subheadline that explains your value proposition",
        buttons: [
          { text: "Get Started", actionId: "", style: "primary" },
          { text: "Learn More", actionId: "", style: "secondary" },
        ],
      },
      style: { backgroundColor: primary, textColor: "#ffffff", padding: "80px 0" },
    },
    "trust-bar": {
      content: {
        items: [
          { text: "500+ Happy Clients", iconIntent: "people" },
          { text: "10+ Years Experience", iconIntent: "experience" },
          { text: "4.9 Star Rating", iconIntent: "quality" },
          { text: "24/7 Support", iconIntent: "support" },
        ],
      },
      style: { backgroundColor: "#f8f9fa", textColor: "#374151", padding: "24px 0" },
    },
    features: {
      content: {
        heading: "Our Features",
        subheading: "What makes us different",
        items: [
          { title: "Feature 1", description: "Description here", iconIntent: "quality" },
          { title: "Feature 2", description: "Description here", iconIntent: "speed" },
          { title: "Feature 3", description: "Description here", iconIntent: "safety" },
        ],
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
    benefits: {
      content: {
        heading: "Why Choose Us",
        subheading: "The advantages of working with us",
        items: [
          { title: "Benefit 1", description: "Description here", iconIntent: "trust" },
          { title: "Benefit 2", description: "Description here", iconIntent: "results" },
          { title: "Benefit 3", description: "Description here", iconIntent: "support" },
        ],
      },
      style: { backgroundColor: "#f8f9fa", textColor: "#1a1a1a", padding: "80px 0" },
    },
    "problem-solution": {
      content: {
        heading: "We Solve Your Problems",
        problem: {
          heading: "The Challenge",
          description: "Many businesses struggle with...",
          points: ["Pain point 1", "Pain point 2", "Pain point 3"],
        },
        solution: {
          heading: "Our Solution",
          description: "We provide...",
          points: ["Solution 1", "Solution 2", "Solution 3"],
        },
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
    "how-it-works": {
      content: {
        heading: "How It Works",
        subheading: "Simple steps to get started",
        steps: [
          { step: "1", title: "Step One", description: "Description here" },
          { step: "2", title: "Step Two", description: "Description here" },
          { step: "3", title: "Step Three", description: "Description here" },
        ],
      },
      style: { backgroundColor: "#f8f9fa", textColor: "#1a1a1a", padding: "80px 0" },
    },
    services: {
      content: {
        heading: "Our Services",
        subheading: "What we offer",
        items: [
          { title: "Service 1", description: "Description here", iconIntent: "business" },
          { title: "Service 2", description: "Description here", iconIntent: "professional" },
          { title: "Service 3", description: "Description here", iconIntent: "innovation" },
        ],
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
    testimonials: {
      content: {
        heading: "What Our Customers Say",
        items: [
          { quote: "Amazing service!", author: "John Doe", role: "Customer" },
          { quote: "Highly recommended!", author: "Jane Smith", role: "Customer" },
        ],
      },
      style: { backgroundColor: "#f8f9fa", textColor: "#1a1a1a", padding: "80px 0" },
    },
    results: {
      content: {
        heading: "Our Results",
        subheading: "Numbers that speak for themselves",
        stats: [
          { value: "500+", label: "Happy Clients" },
          { value: "98%", label: "Satisfaction Rate" },
          { value: "10+", label: "Years Experience" },
        ],
      },
      style: { backgroundColor: primary, textColor: "#ffffff", padding: "60px 0" },
    },
    pricing: {
      content: {
        heading: "Pricing",
        subheading: "Choose the right plan",
        plans: [
          {
            name: "Basic", price: "$29", period: "/month",
            features: ["Feature 1", "Feature 2"],
            buttons: [{ text: "Get Started", actionId: "", style: "secondary" }],
            highlighted: false,
          },
          {
            name: "Pro", price: "$59", period: "/month",
            features: ["All Basic", "Feature 3"],
            buttons: [{ text: "Get Started", actionId: "", style: "primary" }],
            highlighted: true,
          },
        ],
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
    faq: {
      content: {
        heading: "Frequently Asked Questions",
        items: [
          { question: "How does it work?", answer: "It's simple and easy." },
          { question: "What's included?", answer: "Everything you need." },
        ],
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
    "cta-band": {
      content: {
        heading: "Ready to Get Started?",
        subheading: "Join us today",
        buttons: [{ text: "Get Started", actionId: "", style: "primary" }],
      },
      style: { backgroundColor: primary, textColor: "#ffffff", padding: "60px 0" },
    },
    contact: {
      content: {
        heading: "Get In Touch",
        subheading: "We'd love to hear from you",
        fields: ["name", "email", "message"],
        buttons: [{ text: "Send Message", actionId: "", style: "primary" }],
      },
      style: { backgroundColor: "#f8f9fa", textColor: "#1a1a1a", padding: "80px 0" },
    },
    footer: {
      content: {
        companyName: "Company Name",
        tagline: "Your trusted partner",
        columns: [
          {
            title: "Company",
            links: [
              { text: "About", href: "#" },
              { text: "Contact", href: "#contact" },
            ],
          },
          {
            title: "Services",
            links: [
              { text: "Our Services", href: "#services" },
              { text: "Pricing", href: "#pricing" },
            ],
          },
        ],
        copyrightYear: new Date().getFullYear().toString(),
        legalLinks: [
          { text: "Privacy Policy", href: "#" },
          { text: "Terms of Service", href: "#" },
        ],
      },
      style: { backgroundColor: "#111827", textColor: "#d1d5db", padding: "60px 0" },
    },
    gallery: {
      content: {
        heading: "Gallery",
        subheading: "See our work",
        images: [],
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
    "service-area": {
      content: {
        heading: "Areas We Serve",
        subheading: "Proudly serving these locations",
        areas: [
          { name: "Area 1", description: "Serving this community" },
          { name: "Area 2", description: "Serving this community" },
        ],
      },
      style: { backgroundColor: "#f8f9fa", textColor: "#1a1a1a", padding: "80px 0" },
    },
    "about-team": {
      content: {
        heading: "About Us",
        subheading: "Our story and team",
        description: "We are passionate about delivering excellence.",
        members: [],
        values: [
          { title: "Quality", description: "We never compromise on quality", iconIntent: "quality" },
          { title: "Trust", description: "Building lasting relationships", iconIntent: "trust" },
        ],
      },
      style: { backgroundColor: "#ffffff", textColor: "#1a1a1a", padding: "80px 0" },
    },
  };

  const def = defaults[type];
  return {
    id,
    type,
    variant: v,
    visible: true,
    order: 0,
    content: def.content,
    style: def.style,
  };
}

// ---- Legacy Conversion ----
// Convert old-format sections (from existing pages) to new schema

export function convertLegacySection(legacy: {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  style: Record<string, string>;
}): Section {
  const type = mapLegacyType(legacy.type);
  const content = mapLegacyContent(legacy.type, legacy.content);

  return {
    id: legacy.id,
    type,
    variant: getDefaultVariant(type),
    visible: true,
    order: legacy.order,
    content,
    style: {
      backgroundColor: legacy.style.background_color || legacy.style.backgroundColor || "#ffffff",
      textColor: legacy.style.text_color || legacy.style.textColor || "#1a1a1a",
      padding: legacy.style.padding || "80px 0",
    },
  };
}

function mapLegacyType(type: string): SectionType {
  if (type === "cta") return "cta-band";
  if ((SECTION_TYPES as readonly string[]).includes(type)) return type as SectionType;
  return "cta-band"; // fallback
}

function mapLegacyContent(
  legacyType: string,
  content: Record<string, unknown>
): Record<string, unknown> {
  switch (legacyType) {
    case "hero":
      return {
        heading: content.heading,
        subheading: content.subheading,
        primaryCtaText: content.cta_text,
        primaryCtaHref: content.cta_link,
        secondaryCtaText: content.secondary_cta_text,
        secondaryCtaHref: content.secondary_cta_link,
        trustPoints: content.trust_points,
      };
    case "pricing": {
      const plans = (content.plans as Array<Record<string, unknown>>) || [];
      return {
        heading: content.heading,
        subheading: content.subheading,
        plans: plans.map((p) => ({
          name: p.name,
          price: p.price,
          period: p.period,
          features: p.features,
          ctaText: p.cta_text || p.ctaText,
          highlighted: p.highlighted,
        })),
      };
    }
    case "cta":
      return {
        heading: content.heading,
        subheading: content.subheading,
        buttonText: content.button_text,
        buttonHref: content.button_link,
      };
    case "contact":
      return {
        heading: content.heading,
        subheading: content.subheading,
        fields: content.fields,
        buttonText: content.button_text || content.buttonText,
        email: content.email,
        phone: content.phone,
        address: content.address,
      };
    default:
      return content;
  }
}
