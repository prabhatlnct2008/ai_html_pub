import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { renderPageHtml } from "@/lib/html-renderer";
import { renderPageFromDocument } from "@/lib/page/renderer";
import { normalizeDocumentActions } from "@/lib/actions/normalizer";
import { normalizeVariant } from "@/lib/page/section-library";
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
    include: { pages: true, pagePlan: true, assets: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  // Legacy compat: find homepage or first page
  const page = project.pages.find((p) => p.isHomepage) || project.pages[0];
  if (!page) {
    return errorResponse("No page generated yet", 404);
  }

  // Parse document if available, normalize legacy actions
  let doc = page.documentJson && page.documentJson !== "{}"
    ? JSON.parse(page.documentJson) as PageDocument
    : null;
  if (doc) {
    doc = normalizeDocumentActions(doc);
    // Normalize legacy variant names to canonical
    doc.sections = doc.sections.map((s) => ({
      ...s,
      variant: normalizeVariant(s.type, s.variant),
    }));
  }

  // V2: prefer documentJson sections as canonical source; fall back to sectionsJson for legacy
  const canonicalSections = doc?.sections || JSON.parse(page.sectionsJson);

  return jsonResponse({
    sections: canonicalSections,
    globalStyles: JSON.parse(page.globalStyles),
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
      pageType: page.pageType || "service-business",
      themeVariant: page.themeVariant || "clean",
    },
    brand: doc?.brand || null,
    hasDocument: !!doc,
    pageType: page.pageType || null,
    themeVariant: page.themeVariant || null,
    version: page.version,
    slug: project.slug,
    pageId: page.id,
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
    include: { pages: true, pagePlan: true, assets: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  // Legacy compat: find homepage or first page
  const page = project.pages.find((p) => p.isHomepage) || project.pages[0];
  if (!page) {
    return errorResponse("No page to save", 404);
  }

  const body = await request.json();
  const { sections, globalStyles, actions, assets, meta, brand, slug: newSlug } = body;

  if (!sections || !Array.isArray(sections)) {
    return errorResponse("Sections array is required");
  }

  const stylesObj = globalStyles || JSON.parse(page.globalStyles);
  const planData = project.pagePlan
    ? JSON.parse(project.pagePlan.planData)
    : { page_meta: { title: project.name, description: "" } };

  // Check if we have a PageDocument
  const existingDoc = page.documentJson && page.documentJson !== "{}"
    ? JSON.parse(page.documentJson) as PageDocument
    : null;

  let renderedHtml: string;
  let documentJson: string;

  if (existingDoc || actions || meta || brand) {
    // Build/update the PageDocument — this is the canonical source of truth
    const updatedDoc: PageDocument = {
      meta: meta || existingDoc?.meta || {
        title: project.name,
        description: "",
        pageType: page.pageType || "service-business",
        themeVariant: page.themeVariant || "clean",
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
    documentJson = page.documentJson;
    renderedHtml = renderPageHtml(sections, stylesObj, planData.page_meta);
  }

  // Atomic transaction: version backup + page update + slug persist
  const updated = await prisma.$transaction(async (tx) => {
    await tx.pageVersion.create({
      data: {
        pageId: page.id,
        sectionsJson: page.sectionsJson,
        globalStyles: page.globalStyles,
        documentJson: page.documentJson,
        versionNumber: page.version,
      },
    });

    // Persist slug changes back to project
    if (newSlug && typeof newSlug === "string" && newSlug !== project.slug) {
      await tx.project.update({
        where: { id },
        data: { slug: newSlug },
      });
    }

    return tx.page.update({
      where: { id: page.id },
      data: {
        // sectionsJson kept as backward-compat mirror
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(stylesObj),
        // documentJson is the canonical payload
        documentJson,
        renderedHtml,
        version: { increment: 1 },
      },
    });
  });

  return jsonResponse({
    version: updated.version,
    slug: newSlug || project.slug,
    message: "Page saved successfully",
  });
}
