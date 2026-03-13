"use client";

import { useState } from "react";
import PlanViewer from "@/components/plan/PlanViewer";

interface PlanData {
  sections: Array<{ type: string; description: string }>;
  branding: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    tone: string;
  };
  page_meta: {
    title: string;
    description: string;
  };
}

interface PlanApprovalProps {
  plan: PlanData;
  onApprove: () => Promise<void>;
  onRevise: (feedback: string) => Promise<void>;
  loading: boolean;
}

export default function PlanApproval({
  plan,
  onApprove,
  onRevise,
  loading,
}: PlanApprovalProps) {
  const [mode, setMode] = useState<"review" | "feedback">("review");
  const [feedback, setFeedback] = useState("");

  const handleRevise = async () => {
    if (!feedback.trim()) return;
    await onRevise(feedback.trim());
    setFeedback("");
    setMode("review");
  };

  return (
    <div className="space-y-4">
      <PlanViewer plan={plan} status="proposed" />

      {mode === "review" ? (
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            disabled={loading}
            className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Approve & Generate"}
          </button>
          <button
            onClick={() => setMode("feedback")}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Request Changes
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Describe what you'd like changed..."
            rows={3}
            className="w-full rounded-lg border px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRevise}
              disabled={loading || !feedback.trim()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Submit Changes"}
            </button>
            <button
              onClick={() => { setMode("review"); setFeedback(""); }}
              disabled={loading}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
