import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { renderPageFromDocument } from "@/lib/page/renderer";
import { normalizeDocumentActions } from "@/lib/actions/normalizer";
import { normalizeVariant } from "@/lib/page/section-library";
import type { PageDocument } from "@/lib/page/schema";
import type { SiteSettings } from "@/lib/site/types";

/**
 * GET /api/projects/[id]/pages/[pageId]
 * Get full page data for editing (sections, globalStyles, etc.)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id, pageId } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, projectId: id },
  });
  if (!page) {
    return errorResponse("Page not found", 404);
  }

  // Parse document, normalize
  let doc =
    page.documentJson && page.documentJson !== "{}"
      ? (JSON.parse(page.documentJson) as PageDocument)
      : null;
  if (doc) {
    doc = normalizeDocumentActions(doc);
    doc.sections = doc.sections.map((s) => ({
      ...s,
      variant: normalizeVariant(s.type, s.variant),
    }));
  }

  const canonicalSections =
    doc?.sections || JSON.parse(page.sectionsJson);

  // Get site-level settings for brand/actions
  let siteSettings: SiteSettings | null = null;
  if (project.siteSettings && project.siteSettings !== "{}") {
    try {
      siteSettings = JSON.parse(project.siteSettings) as SiteSettings;
    } catch {
      // ignore
    }
  }

  return jsonResponse({
    pageId: page.id,
    slug: page.slug,
    title: page.title,
    isHomepage: page.isHomepage,
    showInNav: page.showInNav,
    navOrder: page.navOrder,
    status: page.status,
    sections: canonicalSections,
    globalStyles: JSON.parse(page.globalStyles),
    // Page-level meta from doc
    meta: doc?.meta || {
      title: page.title || project.name,
      description: "",
      pageType: page.pageType || "service-business",
      themeVariant: page.themeVariant || "clean",
    },
    // Brand and actions come from site level
    brand: siteSettings?.brand || doc?.brand || null,
    actions: siteSettings?.actions || doc?.actions || [],
    assets: doc?.assets || [],
    hasDocument: !!doc,
    version: page.version,
  });
}

/**
 * PUT /api/projects/[id]/pages/[pageId]
 * Update page content (sections, styles) and/or page metadata (title, slug, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id, pageId } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, projectId: id },
  });
  if (!page) {
    return errorResponse("Page not found", 404);
  }

  const body = await request.json();
  const {
    sections,
    globalStyles,
    meta,
    assets,
    title,
    slug: newSlug,
    isHomepage,
    showInNav,
    navOrder,
    status,
  } = body;

  // Page metadata updates
  const pageUpdates: Record<string, unknown> = {};
  if (title !== undefined) pageUpdates.title = title;
  if (newSlug !== undefined) {
    // Check for duplicate slug
    if (newSlug !== page.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { projectId_slug: { projectId: id, slug: newSlug } },
      });
      if (slugExists) {
        return errorResponse(`Slug "${newSlug}" already exists`, 409);
      }
    }
    pageUpdates.slug = newSlug;
  }
  if (showInNav !== undefined) pageUpdates.showInNav = showInNav;
  if (navOrder !== undefined) pageUpdates.navOrder = navOrder;
  if (status !== undefined) pageUpdates.status = status;

  // Handle homepage toggle
  if (isHomepage === true && !page.isHomepage) {
    await prisma.page.updateMany({
      where: { projectId: id, isHomepage: true },
      data: { isHomepage: false },
    });
    pageUpdates.isHomepage = true;
  } else if (isHomepage === false) {
    pageUpdates.isHomepage = false;
  }

  // Content updates
  if (sections && Array.isArray(sections)) {
    const stylesObj = globalStyles || JSON.parse(page.globalStyles);
    const existingDoc =
      page.documentJson && page.documentJson !== "{}"
        ? (JSON.parse(page.documentJson) as PageDocument)
        : null;

    // Get brand from site settings
    let siteBrand = null;
    if (project.siteSettings && project.siteSettings !== "{}") {
      try {
        const ss = JSON.parse(project.siteSettings) as SiteSettings;
        siteBrand = ss.brand;
      } catch {
        // ignore
      }
    }

    const updatedDoc: PageDocument = {
      meta: meta || existingDoc?.meta || {
        title: page.title || project.name,
        description: "",
        pageType: page.pageType || "service-business",
        themeVariant: page.themeVariant || "clean",
      },
      brand: siteBrand || existingDoc?.brand || {
        tone: "professional",
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        accentColor: "#f59e0b",
        fontHeading: "Inter",
        fontBody: "Inter",
      },
      assets: assets || existingDoc?.assets || [],
      actions: existingDoc?.actions || [], // Actions at site level, but keep doc reference
      sections,
    };

    const documentJson = JSON.stringify(updatedDoc);
    const renderedHtml = renderPageFromDocument(updatedDoc);

    // Version backup + update
    await prisma.$transaction(async (tx) => {
      await tx.pageVersion.create({
        data: {
          pageId: page.id,
          sectionsJson: page.sectionsJson,
          globalStyles: page.globalStyles,
          documentJson: page.documentJson,
          versionNumber: page.version,
        },
      });

      await tx.page.update({
        where: { id: page.id },
        data: {
          sectionsJson: JSON.stringify(sections),
          globalStyles: JSON.stringify(stylesObj),
          documentJson,
          renderedHtml,
          version: { increment: 1 },
          ...pageUpdates,
        },
      });
    });
  } else if (Object.keys(pageUpdates).length > 0) {
    // Only metadata updates, no content changes
    await prisma.page.update({
      where: { id: page.id },
      data: pageUpdates,
    });
  }

  return jsonResponse({
    message: "Page updated",
    pageId: page.id,
  });
}

/**
 * DELETE /api/projects/[id]/pages/[pageId]
 * Delete a page. Cannot delete the last remaining page.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id, pageId } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, projectId: id },
  });
  if (!page) {
    return errorResponse("Page not found", 404);
  }

  // Don't allow deleting the last page
  const pageCount = await prisma.page.count({ where: { projectId: id } });
  if (pageCount <= 1) {
    return errorResponse("Cannot delete the last page", 400);
  }

  // If deleting homepage, promote the next page
  if (page.isHomepage) {
    const nextPage = await prisma.page.findFirst({
      where: { projectId: id, id: { not: pageId } },
      orderBy: { navOrder: "asc" },
    });
    if (nextPage) {
      await prisma.page.update({
        where: { id: nextPage.id },
        data: { isHomepage: true },
      });
    }
  }

  await prisma.page.delete({ where: { id: pageId } });

  return jsonResponse({ message: "Page deleted" });
}
