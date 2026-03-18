/**
 * Generation artifact persistence.
 * Saves intermediate agent outputs per project/run so they can be
 * inspected later for debugging and "generation history" views.
 */

import { prisma } from "@/lib/db";

export type ArtifactType =
  | "site_plan"
  | "shared_settings"
  | "page_plan"
  | "page_document_raw"
  | "page_document_normalized"
  | "review_result"
  | "repair_attempt"
  | "repair_result"
  | "terminal_summary"
  | "render_failure"
  | "normalization_log";

export interface SaveArtifactParams {
  projectId: string;
  generationRunId: string;
  artifactType: ArtifactType;
  phase: string;
  status?: "created" | "success" | "failure";
  payloadJson: unknown; // Will be JSON.stringify'd
  pageSlug?: string | null;
  attemptNumber?: number;
  sourceAgent?: string;
  error?: string;
  metadataJson?: unknown;
}

/**
 * Persist a generation artifact to the DB.
 * This is fire-and-forget — artifact persistence failures should never
 * break the generation pipeline.
 */
export async function saveArtifact(params: SaveArtifactParams): Promise<void> {
  try {
    await prisma.generationArtifact.create({
      data: {
        projectId: params.projectId,
        generationRunId: params.generationRunId,
        artifactType: params.artifactType,
        pageSlug: params.pageSlug ?? null,
        phase: params.phase,
        status: params.status || "created",
        payloadJson: safeStringify(params.payloadJson),
        attemptNumber: params.attemptNumber ?? null,
        sourceAgent: params.sourceAgent ?? null,
        error: params.error ?? null,
        metadataJson: params.metadataJson ? safeStringify(params.metadataJson) : null,
      },
    });
  } catch (err) {
    // Never let artifact persistence break the pipeline
    console.warn(
      `[artifacts] Failed to save ${params.artifactType} artifact: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

function safeStringify(val: unknown): string {
  try {
    return JSON.stringify(val);
  } catch {
    return "{}";
  }
}

/**
 * Deduplicated render-failure artifact persistence.
 *
 * Fixes two problems with naive per-request artifact writes:
 * 1. Deduplication: skips if an identical render_failure artifact already
 *    exists for this project + page within the last hour.
 * 2. Correct attribution: finds the GenerationRun that most recently
 *    touched this page (by matching runs whose time window covers
 *    page.updatedAt), falling back to the most recent run.
 *
 * Fire-and-forget — never throws.
 */
export async function saveRenderFailureArtifact(opts: {
  projectId: string;
  pageSlug: string;
  pageUpdatedAt: Date;
  error: string;
}): Promise<void> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Dedupe: skip if a matching render_failure already exists recently
    const existing = await prisma.generationArtifact.findFirst({
      where: {
        projectId: opts.projectId,
        pageSlug: opts.pageSlug,
        artifactType: "render_failure",
        error: opts.error,
        createdAt: { gte: oneHourAgo },
      },
      select: { id: true },
    });
    if (existing) return; // already recorded

    // Attribution: find the run that produced this page content.
    // Best match: a run that started before the page was last updated
    // and either completed after or is still running.
    let run = await prisma.generationRun.findFirst({
      where: {
        projectId: opts.projectId,
        startedAt: { lte: opts.pageUpdatedAt },
        OR: [
          { completedAt: { gte: opts.pageUpdatedAt } },
          { completedAt: null }, // still running
          { status: "complete" },
          { status: "partial_complete" },
        ],
      },
      orderBy: { startedAt: "desc" },
      select: { id: true },
    });

    // Fallback: most recent run for this project
    if (!run) {
      run = await prisma.generationRun.findFirst({
        where: { projectId: opts.projectId },
        orderBy: { startedAt: "desc" },
        select: { id: true },
      });
    }

    if (!run) return; // no run to attribute to

    await prisma.generationArtifact.create({
      data: {
        projectId: opts.projectId,
        generationRunId: run.id,
        artifactType: "render_failure",
        pageSlug: opts.pageSlug,
        phase: "render_on_read",
        status: "failure",
        payloadJson: safeStringify({ pageSlug: opts.pageSlug, error: opts.error }),
        sourceAgent: "renderOnRead",
        error: opts.error,
      },
    });
  } catch (err) {
    console.warn(
      `[artifacts] Failed to save render_failure artifact: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
