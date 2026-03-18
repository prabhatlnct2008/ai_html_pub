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
