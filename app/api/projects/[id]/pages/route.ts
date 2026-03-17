import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import type { SiteSettings, NavItem } from "@/lib/site/types";

/**
 * GET /api/projects/[id]/pages
 * List all pages for a project, ordered by navOrder.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const pages = await prisma.page.findMany({
    where: { projectId: id },
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
      version: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return jsonResponse({ pages });
}

/**
 * POST /api/projects/[id]/pages
 * Create a new page for the project.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pages: true },
  });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const body = await request.json();
  const {
    title = "New Page",
    slug,
    pageType = "custom",
    isHomepage = false,
    showInNav = true,
    duplicateFromPageId,
  } = body;

  // Generate slug from title if not provided
  const pageSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Check for duplicate slugs within this project
  const existing = await prisma.page.findUnique({
    where: { projectId_slug: { projectId: id, slug: pageSlug } },
  });
  if (existing) {
    return errorResponse(`A page with slug "${pageSlug}" already exists`, 409);
  }

  // Calculate next navOrder
  const maxOrder = project.pages.reduce(
    (max, p) => Math.max(max, p.navOrder),
    -1
  );

  // If duplicating from an existing page, copy its content
  let sectionsJson = "[]";
  let globalStyles = "{}";
  let documentJson = "{}";

  if (duplicateFromPageId) {
    const sourcePage = await prisma.page.findFirst({
      where: { id: duplicateFromPageId, projectId: id },
    });
    if (sourcePage) {
      sectionsJson = sourcePage.sectionsJson;
      globalStyles = sourcePage.globalStyles;
      documentJson = sourcePage.documentJson;
    }
  }

  // If setting as homepage, unset current homepage
  if (isHomepage) {
    await prisma.page.updateMany({
      where: { projectId: id, isHomepage: true },
      data: { isHomepage: false },
    });
  }

  const page = await prisma.page.create({
    data: {
      projectId: id,
      title,
      slug: pageSlug,
      pageType,
      isHomepage,
      showInNav,
      navOrder: maxOrder + 1,
      sectionsJson,
      globalStyles,
      documentJson,
    },
  });

  // Update site navigation
  await updateSiteNavigation(id);

  return jsonResponse(
    {
      page: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        isHomepage: page.isHomepage,
        showInNav: page.showInNav,
        navOrder: page.navOrder,
        status: page.status,
      },
      message: "Page created",
    },
    201
  );
}

/**
 * Rebuild the navigation array in siteSettings from current pages.
 */
async function updateSiteNavigation(projectId: string) {
  const pages = await prisma.page.findMany({
    where: { projectId },
    orderBy: { navOrder: "asc" },
    select: { id: true, slug: true, title: true, navOrder: true, showInNav: true },
  });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;

  let siteSettings: SiteSettings;
  try {
    siteSettings =
      project.siteSettings && project.siteSettings !== "{}"
        ? JSON.parse(project.siteSettings)
        : null;
  } catch {
    siteSettings = null as unknown as SiteSettings;
  }

  if (!siteSettings) return;

  siteSettings.navigation = pages.map(
    (p): NavItem => ({
      pageId: p.id,
      label: p.title || p.slug,
      slug: p.slug,
      order: p.navOrder,
      visible: p.showInNav,
    })
  );

  await prisma.project.update({
    where: { id: projectId },
    data: { siteSettings: JSON.stringify(siteSettings) },
  });
}

