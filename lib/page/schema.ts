// ---- Core Page Document Schema (V2) ----
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

// ---- V2 Action System ----

export const ACTION_TYPES = [
  "url",
  "phone",
  "email",
  "whatsapp",
  "scroll",
  "form",
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export interface Action {
  id: string;
  label: string;
  type: ActionType;
  value: string;
  style?: "primary" | "secondary" | "outline" | "ghost";
  openInNewTab?: boolean;
  metadata?: {
    whatsappMessage?: string;
    scrollTargetId?: string;
    formId?: string;
  };
}

// ---- Page Document ----

export interface PageDocument {
  meta: MetaSettings;
  brand: BrandSettings;
  assets: Asset[];
  actions: Action[];
  sections: Section[];
}

export interface MetaSettings {
  title: string;
  description: string;
  pageType: PageType;
  themeVariant: ThemeVariant;
  slug?: string;
  publishStatus?: "draft" | "published";
}

export interface BrandSettings {
  tone: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoAssetId?: string;
}

// Legacy aliases for backward compatibility
export type PageMeta = MetaSettings;
export type Brand = BrandSettings;

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
  "gallery",
  "service-area",
  "about-team",
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

// ---- Button Reference (used inside section content) ----
// Buttons reference actions by ID, NOT raw hrefs (spec Rule 1)

export interface ButtonRef {
  text: string;
  actionId: string;
  style?: "primary" | "secondary" | "outline" | "ghost";
}

// ---- Typed Section Content Interfaces ----

export interface HeroContent {
  eyebrow?: string;
  heading: string;
  subheading: string;
  // V2: action references
  buttons?: ButtonRef[];
  trustPoints?: string[];
  heroImageId?: string;
  // Legacy fields (V1 compat — migrated to buttons[] on load)
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export interface TrustBarContent {
  items: Array<{ text: string; icon?: string; iconIntent?: string }>;
}

export interface FeaturesContent {
  heading: string;
  subheading?: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
    iconIntent?: string;
    imageId?: string;
  }>;
}

export interface BenefitsContent {
  heading: string;
  subheading?: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
    iconIntent?: string;
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
    iconIntent?: string;
  }>;
}

export interface ServicesContent {
  heading: string;
  subheading?: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
    iconIntent?: string;
    imageId?: string;
    buttons?: ButtonRef[];
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
    iconIntent?: string;
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
    buttons?: ButtonRef[];
    highlighted: boolean;
    // Legacy
    ctaText?: string;
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
  buttons?: ButtonRef[];
  // Legacy
  buttonText?: string;
  buttonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export interface ContactContent {
  heading: string;
  subheading?: string;
  fields: string[];
  buttons?: ButtonRef[];
  email?: string;
  phone?: string;
  address?: string;
  // Legacy
  buttonText?: string;
}

export interface FooterContent {
  companyName: string;
  tagline?: string;
  logoAssetId?: string;
  columns: Array<{
    title: string;
    links: Array<{ text: string; href?: string; actionId?: string }>;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  copyrightYear: string;
  legalLinks?: Array<{ text: string; href?: string; actionId?: string }>;
}

// ---- V2 New Section Types ----

export interface GalleryContent {
  heading: string;
  subheading?: string;
  images: Array<{
    imageId: string;
    caption?: string;
    alt?: string;
  }>;
}

export interface ServiceAreaContent {
  heading: string;
  subheading?: string;
  areas: Array<{
    name: string;
    description?: string;
  }>;
  mapNote?: string;
}

export interface AboutTeamContent {
  heading: string;
  subheading?: string;
  description?: string;
  members?: Array<{
    name: string;
    role: string;
    bio?: string;
    imageId?: string;
  }>;
  values?: Array<{
    title: string;
    description: string;
    iconIntent?: string;
  }>;
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
  gallery: GalleryContent;
  "service-area": ServiceAreaContent;
  "about-team": AboutTeamContent;
};
