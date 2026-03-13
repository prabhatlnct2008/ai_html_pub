"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import WorkflowProgress from "@/components/builder/WorkflowProgress";
import PlanApproval from "@/components/builder/PlanApproval";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/common/AuthProvider";

interface Message {
  role: string;
  content: string;
}

interface WorkflowStep {
  name: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  error?: string;
}

interface PlanData {
  sections: Array<{ type: string; description: string }>;
  branding: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    tone: string;
  };
  page_meta: { title: string; description: string };
}

interface WorkflowStatus {
  state: string;
  currentStep: string;
  steps: WorkflowStep[];
  canUserReply: boolean;
  progressPercent: number;
  progressMessage: string;
  error: string | null;
  plan?: PlanData;
  redirectTo?: string;
}

export default function BuilderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [projectName, setProjectName] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWorkflowStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/workflow`);
      if (!res.ok) return;
      const data = await res.json();
      setWorkflow(data.workflow);
      setMessages(data.messages || []);

      // Handle redirect (e.g., when complete)
      if (data.workflow?.redirectTo) {
        stopPolling();
        setTimeout(() => router.push(data.workflow.redirectTo), 1500);
      }
    } catch {
      // ignore polling errors
    }
  }, [projectId, router]);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(fetchWorkflowStatus, 1500);
  }, [fetchWorkflowStatus]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const init = async () => {
      try {
        const [projRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetchWorkflowStatus(),
        ]);
        if (projRes.ok) {
          const proj = await projRes.json();
          setProjectName(proj.name);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, authLoading, router, projectId, fetchWorkflowStatus]);

  // Start/stop polling based on workflow state
  useEffect(() => {
    if (!workflow) return;

    const autoStates = [
      "intake_complete",
      "competitor_analysis_running",
      "competitor_analysis_complete",
      "plan_generation_running",
      "generation_running",
      "rendering",
      "saving",
    ];

    if (autoStates.includes(workflow.state)) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [workflow?.state, startPolling, stopPolling]);

  // Send intake message
  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setSending(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setMessages(data.messages || []);
      setWorkflow(data.workflow);

      // If workflow is now auto-executing, start polling
      if (data.workflow && !data.workflow.canUserReply) {
        startPolling();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  // Approve plan
  const handleApprovePlan = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/approve-plan`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve plan");
      const data = await res.json();
      setWorkflow(data.workflow);
      startPolling();
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  // Revise plan
  const handleRevisePlan = async (feedback: string) => {
    setSending(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/revise-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      if (!res.ok) throw new Error("Failed to revise plan");
      const data = await res.json();
      setWorkflow(data.workflow);
      if (data.messages) setMessages(data.messages);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  // Retry from failed state
  const handleRetry = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/retry`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to retry");
      const data = await res.json();
      setWorkflow(data.workflow);
      startPolling();
    } catch {
      // ignore
    }
  };

  const canReply = workflow?.canUserReply ?? true;
  const isAutoExecuting = workflow
    ? !workflow.canUserReply && workflow.state !== "complete" && workflow.state !== "failed"
    : false;

  const getPlaceholder = () => {
    if (!canReply) return "Please wait while the AI processes...";
    if (workflow?.state === "intake") {
      return messages.length === 0
        ? "Describe your business to get started..."
        : "Answer the questions...";
    }
    if (workflow?.state === "plan_review") {
      return "Use the buttons on the right to approve or request changes";
    }
    return "Type your message...";
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner className="mt-20" />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-57px)]">
        {/* Left: Chat Panel (55%) */}
        <div className="flex w-[55%] flex-col border-r">
          <div className="border-b bg-white px-4 py-3">
            <h2 className="font-semibold">{projectName || "AI Builder"}</h2>
            <p className="text-xs text-gray-500">
              {workflow?.progressMessage || "Tell us about your business to get started"}
            </p>
          </div>

          {/* Status banner during auto-execution */}
          {isAutoExecuting && (
            <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 text-sm text-primary-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              {workflow?.currentStep || "Processing..."}
            </div>
          )}

          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            loading={sending}
            disabled={!canReply || workflow?.state === "plan_review"}
            placeholder={getPlaceholder()}
          />
        </div>

        {/* Right: Workflow Progress + Plan (45%) */}
        <div className="w-[45%] overflow-y-auto bg-gray-50 p-6">
          {/* Workflow progress - always show when steps exist */}
          {workflow && workflow.steps.length > 0 && (
            <WorkflowProgress
              steps={workflow.steps}
              currentStep={workflow.currentStep}
              progressPercent={workflow.progressPercent}
              progressMessage={workflow.progressMessage}
              error={workflow.error}
              onRetry={workflow.state === "failed" ? handleRetry : undefined}
            />
          )}

          {/* Plan approval - show when in plan_review state */}
          {workflow?.state === "plan_review" && workflow.plan && (
            <div className="mt-6">
              <PlanApproval
                plan={workflow.plan}
                onApprove={handleApprovePlan}
                onRevise={handleRevisePlan}
                loading={sending}
              />
            </div>
          )}

          {/* Plan display (non-review, just viewing) */}
          {workflow?.plan && workflow.state !== "plan_review" && (
            <div className="mt-6">
              <PlanApproval
                plan={workflow.plan}
                onApprove={handleApprovePlan}
                onRevise={handleRevisePlan}
                loading={true}
              />
            </div>
          )}

          {/* Empty state */}
          {(!workflow || workflow.steps.length === 0) && !workflow?.plan && (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
              <div className="mb-3 text-4xl">📋</div>
              <p className="text-sm">
                Your page plan and progress will appear here once the AI has
                gathered enough information.
              </p>
            </div>
          )}

          {/* Complete state */}
          {workflow?.state === "complete" && (
            <div className="mt-6 rounded-lg border bg-green-50 p-4 text-center">
              <p className="mb-3 text-sm font-medium text-green-800">
                Your landing page has been generated!
              </p>
              <button
                onClick={() => router.push(`/projects/${projectId}/editor`)}
                className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
              >
                Open Editor
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
