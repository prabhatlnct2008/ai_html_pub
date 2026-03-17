/**
 * Lazy migration: converts a legacy single-page project to multi-page site format.
 * Called on-demand when a project's siteSettings is empty/default.
 *
 * Migration steps:
 * 1. Parse existing page's documentJson for brand, actions, footer
 * 2. Build SiteSettings with extracted data
 * 3. Set the existing page as homepage with proper slug/title
 * 4. Remove footer section from page sections (moved to site-level)
 * 5. Update Project.siteSettings and Page fields atomically
 */

import { prisma } from "@/lib/db";
import type { PageDocument, Section } from "@/lib/page/schema";
import type { SiteSettings, NavItem } from "./types";
import { DEFAULT_SITE_SETTINGS } from "./types";

/**
 * Check if a project needs migration (siteSettings is empty or "{}")
 */
export function needsMigration(siteSettingsRaw: string): boolean {
  if (!siteSettingsRaw || siteSettingsRaw === "{}") return true;
  try {
    const parsed = JSON.parse(siteSettingsRaw);
    // If it's an empty object or missing brand, it needs migration
    return !parsed.brand;
  } catch {
    return true;
  }
}

/**
 * Perform lazy migration for a project.
 * Returns the migrated SiteSettings.
 */
export async function migrateProjectToMultiPage(
  projectId: string
): Promise<SiteSettings> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { pages: true },
  });

  if (!project) throw new Error("Project not found for migration");

  // Find the existing page (legacy projects have exactly one)
  const page = project.pages[0];

  // Start with defaults
  const siteSettings: SiteSettings = JSON.parse(
    JSON.stringify(DEFAULT_SITE_SETTINGS)
  );
  siteSettings.siteName = project.name;

  if (page) {
    // Parse documentJson if available
    let doc: PageDocument | null = null;
    if (page.documentJson && page.documentJson !== "{}") {
      try {
        doc = JSON.parse(page.documentJson) as PageDocument;
      } catch {
        // Invalid JSON, proceed with defaults
      }
    }

    // Extract brand from page document to site level
    if (doc?.brand) {
      siteSettings.brand = { ...doc.brand };
    }

    // Extract actions from page document to site level
    if (doc?.actions && doc.actions.length > 0) {
      siteSettings.actions = [...doc.actions];
    }

    // Extract footer from page sections to site level
    let sectionsWithoutFooter = doc?.sections || [];
    const footerSection = sectionsWithoutFooter.find(
      (s) => s.type === "footer"
    );
    if (footerSection) {
      siteSettings.footer = {
        ...(footerSection.content as SiteSettings["footer"] & object),
        extracted: true,
      };
      // Remove footer from page sections
      sectionsWithoutFooter = sectionsWithoutFooter.filter(
        (s) => s.type !== "footer"
      );
    }

    // Build navigation entry for the homepage
    const navItem: NavItem = {
      pageId: page.id,
      label: page.title || project.name || "Home",
      slug: page.slug || "home",
      order: 0,
      visible: true,
    };
    siteSettings.navigation = [navItem];

    // Build site header
    siteSettings.header = {
      logoAssetId: doc?.brand?.logoAssetId,
      siteName: project.name,
      showNav: true,
    };

    // Extract social links from footer content if present
    if (
      footerSection?.content &&
      (footerSection.content as Record<string, unknown>).socialLinks
    ) {
      siteSettings.socialLinks = (
        footerSection.content as Record<string, unknown>
      ).socialLinks as SiteSettings["socialLinks"];
    }

    // Perform atomic update: set page as homepage + update siteSettings + clean page sections
    const updatedDoc = doc
      ? {
          ...doc,
          sections: sectionsWithoutFooter.map((s, i) => ({
            ...s,
            order: i,
          })),
          // Remove brand and actions from page doc (now site-level)
          brand: siteSettings.brand,
          actions: [], // Actions are now at site level
        }
      : null;

    await prisma.$transaction([
      // Update the page: set as homepage with proper fields
      prisma.page.update({
        where: { id: page.id },
        data: {
          isHomepage: true,
          slug: page.slug || "home",
          title: page.title || project.name || "Home",
          pageType: page.pageType || "custom",
          showInNav: true,
          navOrder: 0,
          status: page.status || "draft",
          ...(updatedDoc
            ? {
                documentJson: JSON.stringify(updatedDoc),
                sectionsJson: JSON.stringify(sectionsWithoutFooter),
              }
            : {}),
        },
      }),
      // Update project siteSettings
      prisma.project.update({
        where: { id: projectId },
        data: {
          siteSettings: JSON.stringify(siteSettings),
        },
      }),
    ]);
  } else {
    // No page exists yet — just store defaults
    await prisma.project.update({
      where: { id: projectId },
      data: {
        siteSettings: JSON.stringify(siteSettings),
      },
    });
  }

  return siteSettings;
}
