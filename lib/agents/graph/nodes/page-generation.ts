/**
 * Graph Node: page_generation
 * Generates PageDocument for each page, persists immediately on success.
 */

import { prisma } from "@/lib/db";
import { renderPageFromDocument } from "@/lib/page/renderer";
import { autoRepairDocument } from "@/lib/page/validators";
import { normalizeDocumentContent, isSectionContentRenderable } from "@/lib/page/normalize-section-content";
import type { SiteBuildStateType } from "../site-build-state";
import { runPageGeneratorAgent } from "../../agents/page-generator";
import { appendRunLog, updateRunProgress } from "../../run-lock";
import { saveArtifact } from "../../artifacts";
import type { LogEntry, PageStatusEntry } from "../../types";
import type { PageDocument } from "@/lib/page/schema";

export async function pageGenerationNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "page_generation", message, level });
  };

  if (!state.sitePlan || !state.siteSettingsDraft) {
    log("Missing site plan or settings", "error");
    return { currentPhase: "failed", logs };
  }

  log("Starting page generation...");
  await updateRunProgress(state.runId, { currentPhase: "page_generation" });

  const pageDocuments: Record<string, PageDocument> = {};
  const pageStatuses: Record<string, PageStatusEntry> = { ...state.pageStatuses };
  const completedPages: string[] = [];
  const failedPages: string[] = [];

  // Process pages in order (homepage first)
  const orderedPages = [...state.sitePlan.pages].sort((a, b) =>
    a.isHomepage ? -1 : b.isHomepage ? 1 : 0
  );

  for (const page of orderedPages) {
    const slug = page.slug;
    const pagePlan = state.pagePlans[slug];

    if (!pagePlan) {
      log(`No plan for page "${slug}" — skipping`, "warn");
      failedPages.push(slug);
      pageStatuses[slug] = { status: "failed", retryCount: 0, issues: ["No page plan"] };
      continue;
    }

    pageStatuses[slug] = { ...pageStatuses[slug], status: "generating" };
    log(`Generating page: ${page.title} (/${slug})`);
    await appendRunLog(state.runId, {
      phase: "page_generation",
      message: `Generating: ${page.title}`,
      level: "info",
    });

    const themeVariant = state.siteSettingsDraft.themeVariant || "clean";
    const { document, error } = await runPageGeneratorAgent(
      pagePlan,
      state.siteSettingsDraft,
      state.businessContext,
      state.siteSettingsDraft.actions,
      themeVariant
    );

    if (!document) {
      log(`Failed to generate "${slug}": ${error}`, "error");
      failedPages.push(slug);
      pageStatuses[slug] = {
        status: "gen_failed",
        retryCount: (pageStatuses[slug]?.retryCount || 0) + 1,
        issues: [error || "Generation failed"],
      };
      await appendRunLog(state.runId, {
        phase: "page_generation",
        message: `Failed: ${page.title} — ${error}`,
        level: "error",
      });

      // Persist failure artifact
      await saveArtifact({
        projectId: state.projectId,
        generationRunId: state.runId,
        artifactType: "page_document_raw",
        phase: "page_generation",
        status: "failure",
        payloadJson: {},
        pageSlug: slug,
        sourceAgent: "page-generator",
        error: error || "Generation failed",
      });

      // Persist a placeholder row so the page appears in editor with failed status
      await persistFailedPage(state.projectId, page);

      continue;
    }

    // Persist raw document artifact (before normalization)
    await saveArtifact({
      projectId: state.projectId,
      generationRunId: state.runId,
      artifactType: "page_document_raw",
      phase: "page_generation",
      status: "success",
      payloadJson: document,
      pageSlug: slug,
      sourceAgent: "page-generator",
    });

    // Normalize content shapes BEFORE any other processing
    const { doc: normalizedDoc, fixes: normFixes } = normalizeDocumentContent(document);
    if (normFixes.length > 0) {
      log(`Normalized "${slug}" content: ${normFixes.join(", ")}`);
      await saveArtifact({
        projectId: state.projectId,
        generationRunId: state.runId,
        artifactType: "normalization_log",
        phase: "page_generation",
        status: "success",
        payloadJson: { fixes: normFixes },
        pageSlug: slug,
        sourceAgent: "normalizer",
      });
    }

    // Check if all sections are renderable after normalization
    const unrenderable = normalizedDoc.sections.filter((s) => !isSectionContentRenderable(s));
    if (unrenderable.length > 0) {
      const badTypes = unrenderable.map((s) => s.type).join(", ");
      log(`Warning: ${unrenderable.length} section(s) in "${slug}" may not render correctly: ${badTypes}`, "warn");
    }

    // Auto-repair document
    const { doc: repairedDoc, repairs } = autoRepairDocument(normalizedDoc);
    if (repairs.length > 0) {
      log(`Auto-repaired "${slug}": ${repairs.join(", ")}`);
    }

    // Persist normalized+repaired document artifact
    await saveArtifact({
      projectId: state.projectId,
      generationRunId: state.runId,
      artifactType: "page_document_normalized",
      phase: "page_generation",
      status: "success",
      payloadJson: repairedDoc,
      pageSlug: slug,
      sourceAgent: "page-generator",
      metadataJson: { repairs, normFixes },
    });

    pageDocuments[slug] = repairedDoc;
    completedPages.push(slug);
    pageStatuses[slug] = { status: "generated", retryCount: 0, issues: [] };

    // PERSIST IMMEDIATELY — incremental persistence
    await persistPage(state.projectId, page, repairedDoc);

    log(`Page "${slug}" generated and persisted (${repairedDoc.sections.length} sections)`);
    await appendRunLog(state.runId, {
      phase: "page_generation",
      message: `Generated: ${page.title} (${repairedDoc.sections.length} sections)`,
      level: "info",
    });

    await updateRunProgress(state.runId, {
      pagesCompleted: completedPages.length,
      pagesFailed: failedPages.length,
    });
  }

  // Determine next phase
  let nextPhase: "reviewing" | "failed" = "reviewing";
  if (completedPages.length === 0) {
    log("All pages failed — aborting", "error");
    nextPhase = "failed";
  }

  log(`Page generation complete: ${completedPages.length} succeeded, ${failedPages.length} failed`);

  return {
    pageDocuments,
    pageStatuses,
    completedPages,
    failedPages,
    currentPhase: nextPhase,
    logs,
  };
}

async function persistFailedPage(
  projectId: string,
  page: { slug: string; title: string; isHomepage: boolean; pageType: string }
): Promise<void> {
  const existing = await prisma.page.findUnique({
    where: { projectId_slug: { projectId, slug: page.slug } },
  });

  if (existing) {
    // Update existing row to reflect failure and hide from nav
    await prisma.page.update({
      where: { id: existing.id },
      data: { status: "failed", showInNav: false },
    });
  } else {
    const pageCount = await prisma.page.count({ where: { projectId } });
    await prisma.page.create({
      data: {
        projectId,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        isHomepage: page.isHomepage,
        showInNav: false,
        navOrder: page.isHomepage ? 0 : pageCount,
        status: "failed",
      },
    });
  }
}

async function persistPage(
  projectId: string,
  page: { slug: string; title: string; isHomepage: boolean; pageType: string },
  doc: PageDocument
): Promise<void> {
  let renderedHtml = "";
  try {
    renderedHtml = renderPageFromDocument(doc);
  } catch (err) {
    // Render failure is non-fatal — we still have documentJson
    // But log it so it's inspectable
    console.warn(`[page-generation] Render failed for ${page.slug}: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Upsert page
  const existing = await prisma.page.findUnique({
    where: { projectId_slug: { projectId, slug: page.slug } },
  });

  if (existing) {
    await prisma.page.update({
      where: { id: existing.id },
      data: {
        title: page.title,
        pageType: page.pageType,
        isHomepage: page.isHomepage,
        documentJson: JSON.stringify(doc),
        renderedHtml,
        sectionsJson: JSON.stringify(doc.sections),
        globalStyles: JSON.stringify(doc.brand),
        status: "draft",
        themeVariant: doc.meta.themeVariant || "clean",
      },
    });
  } else {
    // Count existing pages for navOrder
    const pageCount = await prisma.page.count({ where: { projectId } });

    await prisma.page.create({
      data: {
        projectId,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        isHomepage: page.isHomepage,
        showInNav: true,
        navOrder: page.isHomepage ? 0 : pageCount,
        documentJson: JSON.stringify(doc),
        renderedHtml,
        sectionsJson: JSON.stringify(doc.sections),
        globalStyles: JSON.stringify(doc.brand),
        status: "draft",
        themeVariant: doc.meta.themeVariant || "clean",
      },
    });
  }
}
