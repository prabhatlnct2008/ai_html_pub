"use client";

import type { GenerationStatusResponse } from "@/lib/agents/types";

interface AgenticProgressProps {
  status: GenerationStatusResponse;
  onRetry?: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  planning: "Planning site structure...",
  settings: "Generating brand & settings...",
  page_planning: "Planning page layouts...",
  page_generation: "Generating pages",
  reviewing: "Reviewing site quality...",
  repairing: "Fixing issues...",
  finalizing: "Finalizing site...",
  complete: "Generation complete!",
  partial_complete: "Partially complete",
  failed: "Generation failed",
};

const PHASE_ORDER = [
  "planning",
  "settings",
  "page_planning",
  "page_generation",
  "reviewing",
  "repairing",
  "finalizing",
];

function getPhaseIndex(phase: string): number {
  const idx = PHASE_ORDER.indexOf(phase);
  return idx >= 0 ? idx : -1;
}

function getProgressPercent(status: GenerationStatusResponse): number {
  const phase = status.currentPhase;
  const idx = getPhaseIndex(phase);
  if (idx < 0) return 0;

  const basePercent = (idx / PHASE_ORDER.length) * 100;

  // Within page_generation, add granular progress based on page counts
  if (phase === "page_generation" && status.progress.pagesPlanned > 0) {
    const pageProgress = status.progress.pagesCompleted / status.progress.pagesPlanned;
    const phaseWidth = 100 / PHASE_ORDER.length;
    return basePercent + pageProgress * phaseWidth;
  }

  return basePercent;
}

export default function AgenticProgress({ status, onRetry }: AgenticProgressProps) {
  const isTerminal = ["complete", "partial_complete", "failed"].includes(status.status);
  const isFailed = status.status === "failed";
  const isPartial = status.status === "partial_complete";
  const progressPercent = isTerminal ? 100 : getProgressPercent(status);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {isTerminal ? "Generation Result" : "Building Your Website"}
        </h3>
        {!isTerminal && (
          <span className="text-xs text-gray-500">
            {Math.round(progressPercent)}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFailed
              ? "bg-red-500"
              : isPartial
                ? "bg-amber-500"
                : "bg-primary-600"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Phase label + page count */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">
          {PHASE_LABELS[status.currentPhase] || status.currentPhase}
        </p>
        {status.currentPhase === "page_generation" &&
          status.progress.pagesPlanned > 0 && (
            <p className="text-xs text-gray-500">
              Generating pages ({status.progress.pagesCompleted} of{" "}
              {status.progress.pagesPlanned})
              {status.progress.pagesFailed > 0 && (
                <span className="text-amber-600">
                  {" "}
                  ({status.progress.pagesFailed} failed)
                </span>
              )}
            </p>
          )}
      </div>

      {/* Phase steps */}
      <div className="space-y-1">
        {PHASE_ORDER.map((phase) => {
          const currentIdx = getPhaseIndex(status.currentPhase);
          const phaseIdx = getPhaseIndex(phase);
          const isDone = isTerminal || phaseIdx < currentIdx;
          const isCurrent = phaseIdx === currentIdx && !isTerminal;

          return (
            <div key={phase} className="flex items-center gap-2 text-xs">
              {isDone ? (
                <span className="text-green-600">&#10003;</span>
              ) : isCurrent ? (
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              ) : (
                <span className="text-gray-300">&#9679;</span>
              )}
              <span
                className={
                  isDone
                    ? "text-gray-500"
                    : isCurrent
                      ? "font-medium text-gray-900"
                      : "text-gray-400"
                }
              >
                {PHASE_LABELS[phase]?.replace("...", "") || phase}
              </span>
            </div>
          );
        })}
      </div>

      {/* Review score */}
      {status.reviewScore != null && (
        <div className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
          Quality score: <span className="font-semibold">{status.reviewScore}/100</span>
        </div>
      )}

      {/* Recent log messages */}
      {status.recentLogs.length > 0 && (
        <div className="max-h-32 overflow-y-auto rounded-md bg-gray-50 p-2">
          {status.recentLogs.slice(-5).map((log, i) => (
            <p
              key={i}
              className={`text-xs ${
                log.level === "error"
                  ? "text-red-600"
                  : log.level === "warn"
                    ? "text-amber-600"
                    : "text-gray-500"
              }`}
            >
              {log.message}
            </p>
          ))}
        </div>
      )}

      {/* Error message */}
      {isFailed && status.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{status.error}</p>
        </div>
      )}

      {/* Partial completion warning */}
      {isPartial && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-700">
            Some pages failed to generate. The successfully generated pages are available in the editor.
          </p>
        </div>
      )}

      {/* Retry button for failed state */}
      {isFailed && onRetry && (
        <button
          onClick={onRetry}
          className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Retry Generation
        </button>
      )}
    </div>
  );
}
