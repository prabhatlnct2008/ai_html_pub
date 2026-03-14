import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { renderPageHtml } from "@/lib/html-renderer";
import { renderPageFromDocument } from "@/lib/page/renderer";
import { normalizeDocumentActions } from "@/lib/actions/normalizer";
import type { PageDocument } from "@/lib/page/schema";

// Get page data
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { page: true, pagePlan: true, assets: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  if (!project.page) {
    return errorResponse("No page generated yet", 404);
  }

  // Parse document if available, normalize legacy actions
  let doc = project.page.documentJson && project.page.documentJson !== "{}"
    ? JSON.parse(project.page.documentJson) as PageDocument
    : null;
  if (doc) {
    doc = normalizeDocumentActions(doc);
  }

  return jsonResponse({
    sections: JSON.parse(project.page.sectionsJson),
    globalStyles: JSON.parse(project.page.globalStyles),
    // V2 fields from PageDocument
    actions: doc?.actions || [],
    assets: doc?.assets || project.assets.map((a) => ({
      id: a.id,
      kind: a.kind,
      source: a.source,
      url: a.url,
      alt: a.altText || undefined,
    })),
    meta: doc?.meta || {
      title: project.name,
      description: "",
      pageType: project.page.pageType || "service-business",
      themeVariant: project.page.themeVariant || "clean",
    },
    brand: doc?.brand || null,
    documentJson: doc,
    pageType: project.page.pageType || null,
    themeVariant: project.page.themeVariant || null,
    version: project.page.version,
    slug: project.slug,
    plan: project.pagePlan
      ? JSON.parse(project.pagePlan.planData)
      : null,
  });
}

// Save page (update sections)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { page: true, pagePlan: true, assets: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  if (!project.page) {
    return errorResponse("No page to save", 404);
  }

  const body = await request.json();
  const { sections, globalStyles, actions, assets, meta, brand } = body;

  if (!sections || !Array.isArray(sections)) {
    return errorResponse("Sections array is required");
  }

  const stylesObj = globalStyles || JSON.parse(project.page.globalStyles);
  const planData = project.pagePlan
    ? JSON.parse(project.pagePlan.planData)
    : { page_meta: { title: project.name, description: "" } };

  // Check if we have a PageDocument
  const existingDoc = project.page.documentJson && project.page.documentJson !== "{}"
    ? JSON.parse(project.page.documentJson) as PageDocument
    : null;

  let renderedHtml: string;
  let documentJson: string;

  if (existingDoc || actions || meta || brand) {
    // Build/update the PageDocument with all V2 fields
    const updatedDoc: PageDocument = {
      meta: meta || existingDoc?.meta || {
        title: project.name,
        description: "",
        pageType: project.page.pageType || "service-business",
        themeVariant: project.page.themeVariant || "clean",
      },
      brand: brand || existingDoc?.brand || {
        tone: "professional",
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        accentColor: "#f59e0b",
        fontHeading: "Inter",
        fontBody: "Inter",
      },
      assets: assets || existingDoc?.assets || [],
      actions: actions || existingDoc?.actions || [],
      sections,
    };
    documentJson = JSON.stringify(updatedDoc);
    renderedHtml = renderPageFromDocument(updatedDoc);
  } else {
    // Legacy path
    documentJson = project.page.documentJson;
    renderedHtml = renderPageHtml(sections, stylesObj, planData.page_meta);
  }

  // Atomic transaction: version backup + page update together
  const updated = await prisma.$transaction(async (tx) => {
    await tx.pageVersion.create({
      data: {
        pageId: project.page!.id,
        sectionsJson: project.page!.sectionsJson,
        globalStyles: project.page!.globalStyles,
        documentJson: project.page!.documentJson,
        versionNumber: project.page!.version,
      },
    });

    return tx.page.update({
      where: { id: project.page!.id },
      data: {
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(stylesObj),
        documentJson,
        renderedHtml,
        version: { increment: 1 },
      },
    });
  });

  return jsonResponse({
    version: updated.version,
    message: "Page saved successfully",
  });
}
