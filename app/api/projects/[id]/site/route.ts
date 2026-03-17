import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { needsMigration, migrateProjectToMultiPage } from "@/lib/site/migration";
import type { SiteSettings } from "@/lib/site/types";

/**
 * GET /api/projects/[id]/site
 * Returns site settings and page list. Triggers lazy migration if needed.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      pages: {
        orderBy: { navOrder: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          pageType: true,
          isHomepage: true,
          showInNav: true,
          navOrder: true,
          status: true,
        },
      },
    },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  // Lazy migration: if siteSettings is empty, migrate from legacy single-page
  let siteSettings: SiteSettings;
  if (needsMigration(project.siteSettings)) {
    siteSettings = await migrateProjectToMultiPage(id);
    // Re-fetch pages after migration (homepage flag may have changed)
    const updated = await prisma.project.findUnique({
      where: { id },
      include: {
        pages: {
          orderBy: { navOrder: "asc" },
          select: {
            id: true,
            slug: true,
            title: true,
            pageType: true,
            isHomepage: true,
            showInNav: true,
            navOrder: true,
            status: true,
          },
        },
      },
    });
    return jsonResponse({
      siteSettings,
      pages: updated?.pages || [],
      projectName: project.name,
      projectSlug: project.slug,
      status: project.status,
    });
  }

  siteSettings = JSON.parse(project.siteSettings) as SiteSettings;

  return jsonResponse({
    siteSettings,
    pages: project.pages,
    projectName: project.name,
    projectSlug: project.slug,
    status: project.status,
  });
}

/**
 * PUT /api/projects/[id]/site
 * Update site-level settings (brand, actions, navigation, header, footer, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const body = await request.json();
  const { siteSettings } = body;

  if (!siteSettings || typeof siteSettings !== "object") {
    return errorResponse("siteSettings object is required");
  }

  // Merge with existing settings (partial updates allowed)
  const existing = project.siteSettings !== "{}"
    ? (JSON.parse(project.siteSettings) as SiteSettings)
    : null;

  const merged: SiteSettings = {
    ...(existing || {}),
    ...siteSettings,
  } as SiteSettings;

  await prisma.project.update({
    where: { id },
    data: {
      siteSettings: JSON.stringify(merged),
    },
  });

  return jsonResponse({
    siteSettings: merged,
    message: "Site settings updated",
  });
}
