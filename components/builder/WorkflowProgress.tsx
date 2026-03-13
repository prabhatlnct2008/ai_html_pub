"use client";

interface WorkflowStep {
  name: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  error?: string;
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  currentStep: string;
  progressPercent: number;
  progressMessage: string;
  error: string | null;
  onRetry?: () => void;
}

export default function WorkflowProgress({
  steps,
  progressPercent,
  progressMessage,
  error,
  onRetry,
}: WorkflowProgressProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-gray-500">{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">{progressMessage}</p>
      </div>

      {/* Steps list */}
      <div className="space-y-1">
        {steps.map((step) => (
          <div
            key={step.name}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
              step.status === "in_progress"
                ? "bg-primary-50 text-primary-800"
                : step.status === "completed"
                ? "text-gray-600"
                : step.status === "failed"
                ? "bg-red-50 text-red-700"
                : "text-gray-400"
            }`}
          >
            <span className="flex-shrink-0">
              {step.status === "completed" && (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {step.status === "in_progress" && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              )}
              {step.status === "pending" && (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              {step.status === "failed" && (
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <span className={step.status === "in_progress" ? "font-medium" : ""}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-medium text-red-800">Error</p>
          <p className="mb-3 text-sm text-red-600">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
