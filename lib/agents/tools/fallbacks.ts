/**
 * Fallback generators for agentic site generation.
 * Used when an agent fails after all retries.
 * Pure functions — deterministic, no AI calls.
 */

import type { SectionType } from "@/lib/page/schema";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site/types";
import type {
  SitePlan,
  SiteSettingsDraft,
  AgenticPagePlan,
} from "../types";

// ---- Fallback Site Plan ----

export function buildFallbackSitePlan(
  businessContext: Record<string, unknown>
): SitePlan {
  const businessName = (businessContext.businessName as string) || "My Business";
  const businessType = (businessContext.businessType as string) || "service-business";

  return {
    siteGoal: `Website for ${businessName}`,
    targetAudience: (businessContext.targetAudience as string) || "general audience",
    pages: [
      {
        slug: "home",
        title: `${businessName} - Home`,
        purpose: "Main landing page showcasing the business",
        pageType: businessType,
        isHomepage: true,
        suggestedSections: ["hero", "features", "testimonials", "cta-band", "footer"],
      },
      {
        slug: "contact",
        title: "Contact Us",
        purpose: "Contact information and inquiry form",
        pageType: "custom",
        isHomepage: false,
        suggestedSections: ["hero", "contact", "footer"],
      },
    ],
  };
}

// ---- Fallback Site Settings ----

export function buildFallbackSettings(
  businessContext: Record<string, unknown>
): SiteSettingsDraft {
  const businessName = (businessContext.businessName as string) || "My Business";
  const email = businessContext.contactEmail as string | undefined;
  const phone = businessContext.contactPhone as string | undefined;

  return {
    brand: { ...DEFAULT_SITE_SETTINGS.brand },
    actions: [
      {
        id: "action-primary-cta",
        label: (businessContext.primaryCta as string) || "Get Started",
        type: "url",
        value: "#contact",
        style: "primary",
      },
      ...(phone
        ? [
            {
              id: "action-call",
              label: "Call Us",
              type: "phone" as const,
              value: phone,
              style: "secondary" as const,
            },
          ]
        : []),
      ...(email
        ? [
            {
              id: "action-email",
              label: "Email Us",
              type: "email" as const,
              value: email,
              style: "outline" as const,
            },
          ]
        : []),
    ],
    navigation: [
      { pageId: "", label: "Home", slug: "home", isHomepage: true, order: 0, visible: true },
      { pageId: "", label: "Contact", slug: "contact", isHomepage: false, order: 1, visible: true },
    ],
    header: {
      siteName: businessName,
      showNav: true,
      ctaActionId: "action-primary-cta",
    },
    footer: {
      companyName: businessName,
      tagline: (businessContext.businessDescription as string) || "",
      columns: [],
      copyrightYear: new Date().getFullYear().toString(),
    },
    socialLinks: [],
    contactInfo: {
      email,
      phone,
    },
  };
}

// ---- Fallback Page Plan ----

const DEFAULT_SECTIONS_BY_PAGE_TYPE: Record<string, SectionType[]> = {
  home: ["hero", "trust-bar", "features", "testimonials", "cta-band", "footer"],
  about: ["hero", "about-team", "cta-band", "footer"],
  services: ["hero", "services", "how-it-works", "cta-band", "footer"],
  contact: ["hero", "contact", "faq", "footer"],
  pricing: ["hero", "pricing", "faq", "cta-band", "footer"],
  gallery: ["hero", "gallery", "cta-band", "footer"],
  default: ["hero", "features", "cta-band", "footer"],
};

export function buildFallbackPagePlan(
  slug: string,
  title: string,
  pageType: string
): AgenticPagePlan {
  const sectionTypes =
    DEFAULT_SECTIONS_BY_PAGE_TYPE[slug] ||
    DEFAULT_SECTIONS_BY_PAGE_TYPE[pageType] ||
    DEFAULT_SECTIONS_BY_PAGE_TYPE.default;

  return {
    slug,
    title,
    pageType,
    sections: sectionTypes.map((type) => ({
      type,
      purpose: `${type} section for ${title}`,
    })),
  };
}
