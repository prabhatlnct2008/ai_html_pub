import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { renderPageHtml } from "@/lib/html-renderer";
import { renderPageFromDocument } from "@/lib/page/renderer";
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
    include: { page: true, pagePlan: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  if (!project.page) {
    return errorResponse("No page generated yet", 404);
  }

  return jsonResponse({
    sections: JSON.parse(project.page.sectionsJson),
    globalStyles: JSON.parse(project.page.globalStyles),
    documentJson: project.page.documentJson && project.page.documentJson !== "{}"
      ? JSON.parse(project.page.documentJson)
      : null,
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
  const { sections, globalStyles } = body;

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

  if (existingDoc) {
    // Update the PageDocument with new sections
    const updatedDoc: PageDocument = {
      ...existingDoc,
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
