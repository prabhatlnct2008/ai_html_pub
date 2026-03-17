/**
 * Shared navigation sync utility.
 * Rebuilds siteSettings.navigation from current page records.
 * Must be called after any page mutation that affects navigation:
 *   - Create, delete, rename, slug change, showInNav toggle,
 *     navOrder change, homepage change
 */

import { prisma } from "@/lib/db";
import type { SiteSettings, NavItem } from "./types";

export async function updateSiteNavigation(projectId: string) {
  const pages = await prisma.page.findMany({
    where: { projectId },
    orderBy: { navOrder: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      isHomepage: true,
      navOrder: true,
      showInNav: true,
    },
  });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) return;

  let siteSettings: SiteSettings | null;
  try {
    siteSettings =
      project.siteSettings && project.siteSettings !== "{}"
        ? (JSON.parse(project.siteSettings) as SiteSettings)
        : null;
  } catch {
    siteSettings = null;
  }

  if (!siteSettings) return;

  siteSettings.navigation = pages.map(
    (p): NavItem => ({
      pageId: p.id,
      label: p.title || p.slug,
      slug: p.slug,
      isHomepage: p.isHomepage,
      order: p.navOrder,
      visible: p.showInNav,
    })
  );

  await prisma.project.update({
    where: { id: projectId },
    data: { siteSettings: JSON.stringify(siteSettings) },
  });
}
