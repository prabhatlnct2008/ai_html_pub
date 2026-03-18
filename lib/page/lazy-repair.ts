/**
 * Lazy repair: normalize and persist repaired page documents on read.
 *
 * When renderOnRead detects and fixes malformed section content,
 * this module persists the repaired documentJson back to the DB
 * so subsequent reads don't need to re-fix the same issues.
 *
 * Fire-and-forget — never throws, never blocks rendering.
 */

import { prisma } from "@/lib/db";
import { normalizeDocumentContent } from "./normalize-section-content";
import type { PageDocument } from "./schema";

/**
 * Re-normalize a page's documentJson and persist the repaired version.
 * Only writes if normalization actually changes the document.
 * Skipped if the page was updated since we read it (optimistic concurrency).
 */
export async function lazyRepairPageDocument(
  pageId: string,
  originalDocumentJson: string,
  fixes: string[]
): Promise<void> {
  try {
    const doc = JSON.parse(originalDocumentJson) as PageDocument;
    if (!doc.sections || doc.sections.length === 0) return;

    const { doc: normalizedDoc } = normalizeDocumentContent(doc);
    const repairedJson = JSON.stringify(normalizedDoc);

    // Skip if nothing actually changed (shouldn't happen if fixes > 0, but be safe)
    if (repairedJson === originalDocumentJson) return;

    // Optimistic update: only write if documentJson hasn't changed since we read it
    await prisma.page.updateMany({
      where: {
        id: pageId,
        documentJson: originalDocumentJson,
      },
      data: {
        documentJson: repairedJson,
      },
    });

    console.info(
      `[lazy-repair] Repaired page ${pageId}: ${fixes.length} fixes (${fixes.join("; ")})`
    );
  } catch (err) {
    console.warn(
      `[lazy-repair] Failed to repair page ${pageId}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
