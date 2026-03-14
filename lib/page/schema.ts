// ---- Core Page Document Schema ----
// This is the canonical source of truth for all page data.
// HTML is always rendered FROM this document, never stored as the source.

export const PAGE_TYPES = [
  "local-business",
  "service-business",
  "saas",
  "coach",
  "product-sales",
] as const;
export type PageType = (typeof PAGE_TYPES)[number];

export const THEME_VARIANTS = [
  "clean",
  "bold",
  "premium",
  "playful",
] as const;
export type ThemeVariant = (typeof THEME_VARIANTS)[number];

export interface PageDocument {
  meta: PageMeta;
  brand: Brand;
  assets: Asset[];
  sections: Section[];
}

export interface PageMeta {
  title: string;
  description: string;
  pageType: PageType;
  themeVariant: ThemeVariant;
}

export interface Brand {
  tone: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoUrl?: string;
}

export interface Asset {
  id: string;
  kind: "image" | "icon" | "video";
  source: "upload" | "stock" | "ai" | "placeholder";
  url: string;
  alt?: string;
}

// ---- Section System ----

export const SECTION_TYPES = [
  "hero",
  "trust-bar",
  "features",
  "benefits",
  "problem-solution",
  "how-it-works",
  "services",
  "testimonials",
  "results",
  "pricing",
  "faq",
  "cta-band",
  "contact",
  "footer",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface Section {
  id: string;
  type: SectionType;
  variant: string;
  visible: boolean;
  order: number;
  content: Record<string, unknown>;
  style: SectionStyle;
  assets?: SectionAssets;
}

export interface SectionStyle {
  backgroundColor: string;
  textColor: string;
  padding: string;
  backgroundImageId?: string;
}

export interface SectionAssets {
  imageIds?: string[];
  backgroundImageId?: string;
  iconIds?: string[];
}

// ---- Typed Section Content Interfaces ----

export interface HeroContent {
  eyebrow?: string;
  heading: string;
  subheading: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  trustPoints?: string[];
  heroImageId?: string;
}

export interface TrustBarContent {
  items: Array<{ text: string; icon?: string }>;
}

export interface FeaturesContent {
  heading: string;
  subheading?: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
    imageId?: string;
  }>;
}

export interface BenefitsContent {
  heading: string;
  subheading?: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface ProblemSolutionContent {
  heading: string;
  problem: {
    heading: string;
    description: string;
    points: string[];
  };
  solution: {
    heading: string;
    description: string;
    points: string[];
  };
}

export interface HowItWorksContent {
  heading: string;
  subheading?: string;
  steps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
}

export interface ServicesContent {
  heading: string;
  subheading?: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
    imageId?: string;
  }>;
}

export interface TestimonialsContent {
  heading: string;
  items: Array<{
    quote: string;
    author: string;
    role: string;
    avatarImageId?: string;
  }>;
}

export interface ResultsContent {
  heading: string;
  subheading?: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  description?: string;
}

export interface PricingContent {
  heading: string;
  subheading?: string;
  plans: Array<{
    name: string;
    price: string;
    period: string;
    description?: string;
    features: string[];
    ctaText: string;
    highlighted: boolean;
  }>;
}

export interface FaqContent {
  heading: string;
  subheading?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface CtaBandContent {
  heading: string;
  subheading?: string;
  buttonText: string;
  buttonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export interface ContactContent {
  heading: string;
  subheading?: string;
  fields: string[];
  buttonText: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface FooterContent {
  companyName: string;
  tagline?: string;
  columns: Array<{
    title: string;
    links: Array<{ text: string; href: string }>;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  copyrightYear: string;
  legalLinks?: Array<{ text: string; href: string }>;
}

// ---- Content type map for type-safe access ----
export type SectionContentMap = {
  hero: HeroContent;
  "trust-bar": TrustBarContent;
  features: FeaturesContent;
  benefits: BenefitsContent;
  "problem-solution": ProblemSolutionContent;
  "how-it-works": HowItWorksContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  results: ResultsContent;
  pricing: PricingContent;
  faq: FaqContent;
  "cta-band": CtaBandContent;
  contact: ContactContent;
  footer: FooterContent;
};
