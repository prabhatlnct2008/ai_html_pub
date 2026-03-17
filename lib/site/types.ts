// ---- Site-Level Types ----
// These types define the site-wide settings stored in Project.siteSettings JSON.

import type { Action, BrandSettings, FooterContent, Asset } from "@/lib/page/schema";

/** Navigation link entry in the site nav */
export interface NavItem {
  pageId: string;
  label: string;
  slug: string;
  isHomepage: boolean;
  order: number;
  visible: boolean;
}

/** Site-wide header configuration */
export interface SiteHeader {
  logoAssetId?: string;
  siteName?: string;
  showNav: boolean;
  ctaActionId?: string;
}

/** Site-wide footer (extracted from page sections during migration) */
export interface SiteFooter extends FooterContent {
  /** If true, footer has been extracted from page-level to site-level */
  extracted?: boolean;
}

/** Social media link */
export interface SocialLink {
  platform: string;
  url: string;
}

/** Contact information */
export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

/**
 * SiteSettings is stored as JSON in Project.siteSettings.
 * It holds all site-wide configuration that applies across pages.
 */
export interface SiteSettings {
  /** Explicit migration version. Incremented when migration logic changes. */
  migrationVersion?: number;
  siteName?: string;
  logoAssetId?: string;
  faviconAssetId?: string;
  brand: BrandSettings;
  actions: Action[];
  navigation: NavItem[];
  header: SiteHeader;
  footer: SiteFooter | null;
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
}

/** Current migration version. Bump this when migration logic changes. */
export const CURRENT_MIGRATION_VERSION = 1;

/**
 * Sentinel brand value stored in page documents to indicate that brand
 * is managed at the site level. The renderer will always overlay this
 * with the real brand from siteSettings before rendering.
 * Uses valid CSS defaults so rendering still works if site settings are missing.
 */
export const BRAND_SITE_MANAGED: BrandSettings = {
  tone: "professional",
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  accentColor: "#f59e0b",
  fontHeading: "Inter",
  fontBody: "Inter",
};

/** Default empty site settings for new or unmigrated projects */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand: {
    tone: "professional",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    accentColor: "#f59e0b",
    fontHeading: "Inter",
    fontBody: "Inter",
  },
  actions: [],
  navigation: [],
  header: {
    showNav: true,
  },
  footer: null,
  socialLinks: [],
  contactInfo: {},
};

/** Summary of a page for the page list / site map */
export interface PageSummary {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  isHomepage: boolean;
  showInNav: boolean;
  navOrder: number;
  status: string;
}
