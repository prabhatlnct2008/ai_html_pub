"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import WorkflowProgress from "@/components/builder/WorkflowProgress";
import PlanApproval from "@/components/builder/PlanApproval";
import QuestionCard from "@/components/builder/QuestionCard";
import AgenticProgress from "@/components/builder/AgenticProgress";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/common/AuthProvider";
import type { GenerationStatusResponse } from "@/lib/agents/types";

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

type FlowMode = "detecting" | "legacy" | "agentic";

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
  const [kickoffState, setKickoffState] = useState<{
    status: string;
    summary?: string;
    questions?: Array<{
      field: string;
      question: string;
      options: string[];
      aiSuggestion?: string;
      required: boolean;
      answered: boolean;
      skipped: boolean;
      answer?: string;
    }>;
    currentQuestionIndex?: number;
  } | null>(null);
  const [kickoffLoading, setKickoffLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const kickoffTriggered = useRef(false);

  // ---- Agentic flow state ----
  const [flowMode, setFlowMode] = useState<FlowMode>("detecting");
  const [agenticRunId, setAgenticRunId] = useState<string | null>(null);
  const [agenticStatus, setAgenticStatus] = useState<GenerationStatusResponse | null>(null);
  const agenticPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const agenticTriggerRef = useRef(false);
  const pollErrorCount = useRef(0);

  // ---- Legacy workflow polling ----
  const fetchWorkflowStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/workflow`);
      if (!res.ok) return;
      const data = await res.json();
      setWorkflow(data.workflow);
      setMessages(data.messages || []);

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

  // ---- Agentic generation polling ----
  const pollAgenticStatus = useCallback(
    async (runId: string) => {
      try {
        const res = await fetch(
          `/api/projects/${projectId}/generation-status?runId=${runId}`
        );
        if (!res.ok) {
          pollErrorCount.current++;
          if (pollErrorCount.current >= 3) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "Having trouble checking generation status. Will keep trying...",
              },
            ]);
          }
          return;
        }
        pollErrorCount.current = 0;
        const data: GenerationStatusResponse = await res.json();
        setAgenticStatus(data);

        // Add phase transition messages to chat
        if (data.recentLogs.length > 0) {
          const latest = data.recentLogs[data.recentLogs.length - 1];
          if (latest.level === "info") {
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.content === latest.message) return prev;
              return [...prev, { role: "assistant", content: latest.message }];
            });
          }
        }

        // Handle terminal states
        if (data.status === "complete") {
          stopAgenticPolling();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Your website has been generated! Redirecting to the editor...",
            },
          ]);
          setTimeout(() => router.push(`/projects/${projectId}/editor`), 2000);
        } else if (data.status === "partial_complete") {
          stopAgenticPolling();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Generation completed with some pages missing. Opening the editor with available pages...",
            },
          ]);
          setTimeout(() => router.push(`/projects/${projectId}/editor`), 2000);
        } else if (data.status === "failed") {
          stopAgenticPolling();
        }
      } catch {
        pollErrorCount.current++;
      }
    },
    [projectId, router]
  );

  const startAgenticPolling = useCallback(
    (runId: string) => {
      if (agenticPollingRef.current) return;
      pollErrorCount.current = 0;
      // Immediate first poll
      pollAgenticStatus(runId);
      agenticPollingRef.current = setInterval(
        () => pollAgenticStatus(runId),
        2000
      );
    },
    [pollAgenticStatus]
  );

  const stopAgenticPolling = useCallback(() => {
    if (agenticPollingRef.current) {
      clearInterval(agenticPollingRef.current);
      agenticPollingRef.current = null;
    }
  }, []);

  // ---- Trigger agentic generation ----
  const triggerAgenticGeneration = useCallback(async () => {
    if (agenticTriggerRef.current) return;
    agenticTriggerRef.current = true;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Starting multi-page website generation...",
      },
    ]);

    try {
      const res = await fetch(`/api/projects/${projectId}/generate-site`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.status === 202 && data.runId) {
        setAgenticRunId(data.runId);
        startAgenticPolling(data.runId);
      } else if (res.status === 409 && data.existingRunId) {
        // Generation already in progress — resume polling
        setAgenticRunId(data.existingRunId);
        startAgenticPolling(data.existingRunId);
      } else {
        agenticTriggerRef.current = false;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Failed to start generation: ${data.error || "Unknown error"}`,
          },
        ]);
      }
    } catch {
      agenticTriggerRef.current = false;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to start generation. Please try again.",
        },
      ]);
    }
  }, [projectId, startAgenticPolling]);

  // ---- Retry agentic generation ----
  const handleAgenticRetry = useCallback(async () => {
    agenticTriggerRef.current = false;
    setAgenticStatus(null);
    setAgenticRunId(null);
    await triggerAgenticGeneration();
  }, [triggerAgenticGeneration]);

  // ---- Flow mode detection ----
  const detectFlowMode = useCallback(async (): Promise<FlowMode> => {
    // Step 1: Check for active agentic generation run
    try {
      const activeRes = await fetch(
        `/api/projects/${projectId}/active-generation`
      );
      if (activeRes.ok) {
        const activeData = await activeRes.json();
        setAgenticRunId(activeData.runId);
        startAgenticPolling(activeData.runId);
        return "agentic";
      }
    } catch {
      // No active run — continue checking
    }

    // Step 2: Check for completed GenerationRun (agentic project that finished)
    // We check the workflow state to detect legacy projects
    try {
      const wfRes = await fetch(`/api/projects/${projectId}/workflow`);
      if (wfRes.ok) {
        const wfData = await wfRes.json();
        const wfState = wfData.workflow?.state;
        setWorkflow(wfData.workflow);
        setMessages(wfData.messages || []);

        // Legacy project: workflow progressed past intake into plan/generation stages
        const legacyActiveStates = [
          "plan_review",
          "plan_generation_running",
          "generation_running",
          "document_assembly",
          "rendering",
          "saving",
          "competitor_analysis_running",
          "competitor_analysis_complete",
          "strategy_generation",
          "theme_generation",
          "asset_planning",
          "image_prompt_generation",
          "image_generation",
        ];
        if (legacyActiveStates.includes(wfState)) {
          return "legacy";
        }

        // Completed legacy project
        if (wfState === "complete" || wfState === "failed") {
          return "legacy";
        }
      }
    } catch {
      // ignore
    }

    // Step 3: New project — will be determined by kickoff completion
    return "agentic";
  }, [projectId, startAgenticPolling]);

  // ---- Initial load ----
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const init = async () => {
      try {
        // Fetch project name
        const projRes = await fetch(`/api/projects/${projectId}`);
        if (projRes.ok) {
          const proj = await projRes.json();
          setProjectName(proj.name);
        }

        // Detect flow mode
        const mode = await detectFlowMode();
        setFlowMode(mode);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    init();

    return () => {
      stopPolling();
      stopAgenticPolling();
    };
  }, [user, authLoading, router, projectId, detectFlowMode, stopPolling, stopAgenticPolling]);

  // Start/stop legacy polling based on workflow state (only in legacy mode)
  useEffect(() => {
    if (flowMode !== "legacy" || !workflow) return;

    const autoStates = [
      "kickoff_inferring",
      "intake_complete",
      "competitor_analysis_running",
      "competitor_analysis_complete",
      "strategy_generation",
      "theme_generation",
      "asset_planning",
      "image_prompt_generation",
      "image_generation",
      "plan_generation_running",
      "generation_running",
      "document_assembly",
      "rendering",
      "saving",
    ];

    if (autoStates.includes(workflow.state)) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [flowMode, workflow?.state, startPolling, stopPolling]);

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

  // Approve plan (legacy only)
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

  // Revise plan (legacy only)
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

  // Retry from failed state (legacy only)
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

  // Auto-trigger kickoff for new-flow projects
  const triggerKickoff = useCallback(async () => {
    if (kickoffTriggered.current) return;
    kickoffTriggered.current = true;
    setKickoffLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/kickoff`, {
        method: "POST",
      });
      if (!res.ok) {
        kickoffTriggered.current = false;
        return;
      }
      const data = await res.json();
      setKickoffState({
        status: data.status,
        summary: data.summary || data.kickoff?.summary,
        questions: data.kickoff?.questions,
        currentQuestionIndex: data.kickoff?.currentQuestionIndex || 0,
      });

      // Refresh workflow status
      await fetchWorkflowStatus();

      // If kickoff completed with no questions
      if (data.status === "complete") {
        if (data.agenticReady) {
          // Agentic: trigger generation
          setFlowMode("agentic");
          triggerAgenticGeneration();
        } else {
          // Legacy: poll workflow
          setFlowMode("legacy");
          startPolling();
        }
      }
    } catch {
      kickoffTriggered.current = false;
    } finally {
      setKickoffLoading(false);
    }
  }, [projectId, fetchWorkflowStatus, startPolling, triggerAgenticGeneration]);

  // Handle answer completion — check for agenticReady
  const handleKickoffComplete = useCallback(
    (data: { status: string; agenticReady?: boolean }) => {
      if (data.status === "complete") {
        if (data.agenticReady) {
          setFlowMode("agentic");
          triggerAgenticGeneration();
        } else {
          setFlowMode("legacy");
          startPolling();
        }
      }
    },
    [triggerAgenticGeneration, startPolling]
  );

  // Answer a kickoff question
  const handleAnswer = async (field: string, value: string) => {
    setSending(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      if (!res.ok) return;
      const data = await res.json();

      setKickoffState((prev) =>
        prev
          ? {
              ...prev,
              status: data.status,
              questions: data.kickoff?.questions || prev.questions,
              currentQuestionIndex:
                data.kickoff?.currentQuestionIndex ?? (prev.currentQuestionIndex || 0) + 1,
            }
          : prev
      );

      await fetchWorkflowStatus();
      handleKickoffComplete(data);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  // Skip a kickoff question
  const handleSkip = async (field: string) => {
    setSending(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, skipped: true }),
      });
      if (!res.ok) return;
      const data = await res.json();

      setKickoffState((prev) =>
        prev
          ? {
              ...prev,
              status: data.status,
              questions: data.kickoff?.questions || prev.questions,
              currentQuestionIndex:
                data.kickoff?.currentQuestionIndex ?? (prev.currentQuestionIndex || 0) + 1,
            }
          : prev
      );

      await fetchWorkflowStatus();
      handleKickoffComplete(data);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  // Skip all remaining questions
  const handleSkipAll = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipAll: true }),
      });
      if (!res.ok) return;
      const data = await res.json();

      setKickoffState((prev) =>
        prev ? { ...prev, status: "complete" } : prev
      );

      await fetchWorkflowStatus();
      handleKickoffComplete(data);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  // Check if this project uses the new kickoff flow on initial load
  useEffect(() => {
    if (!workflow || kickoffTriggered.current) return;
    if (workflow.state !== "intake") return;

    const checkKickoff = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const proj = await res.json();
        const ctx = typeof proj.businessContext === "string"
          ? JSON.parse(proj.businessContext)
          : proj.businessContext || {};

        if (ctx._kickoff) {
          if (ctx._kickoff.status === "pending") {
            triggerKickoff();
          } else if (ctx._kickoff.status === "questioning") {
            setKickoffState({
              status: "questioning",
              summary: ctx._kickoff.summary,
              questions: ctx._kickoff.questions,
              currentQuestionIndex: ctx._kickoff.currentQuestionIndex || 0,
            });
          } else if (ctx._kickoff.status === "inferring") {
            triggerKickoff();
          }
        }
      } catch {
        // ignore
      }
    };
    checkKickoff();
  }, [workflow, projectId, triggerKickoff]);

  const canReply = workflow?.canUserReply ?? true;
  const isAutoExecuting = workflow
    ? !workflow.canUserReply && workflow.state !== "complete" && workflow.state !== "failed"
    : false;
  const isAgenticActive = flowMode === "agentic" && agenticRunId != null;

  const getPlaceholder = () => {
    if (kickoffLoading) return "AI is analyzing your business...";
    if (kickoffState?.status === "questioning") return "Answer above or type a message...";
    if (isAgenticActive) return "AI is building your website...";
    if (!canReply) return "AI is working on your page...";
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
              {isAgenticActive
                ? "Building your multi-page website..."
                : workflow?.progressMessage || "Tell us about your business to get started"}
            </p>
          </div>

          {/* Kickoff inferring state */}
          {kickoffLoading && (
            <div className="flex items-center gap-3 bg-primary-50 px-4 py-3 text-sm text-primary-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              Understanding your business...
            </div>
          )}

          {/* Agentic generation banner */}
          {isAgenticActive &&
            agenticStatus &&
            !["complete", "partial_complete", "failed"].includes(
              agenticStatus.status
            ) && (
              <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 text-sm text-primary-700">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
                Building your website...
              </div>
            )}

          {/* Legacy status banner during auto-execution */}
          {flowMode === "legacy" && isAutoExecuting && !kickoffLoading && (
            <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 text-sm text-primary-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              {workflow?.currentStep || "Processing..."}
            </div>
          )}

          {/* Question card during questioning */}
          {kickoffState?.status === "questioning" &&
            kickoffState.questions &&
            typeof kickoffState.currentQuestionIndex === "number" &&
            kickoffState.currentQuestionIndex < kickoffState.questions.length && (
              <div className="border-b bg-gray-50 p-4">
                {kickoffState.summary && (
                  <p className="mb-3 text-sm text-gray-600">
                    {kickoffState.summary}
                  </p>
                )}
                <QuestionCard
                  question={kickoffState.questions[kickoffState.currentQuestionIndex]}
                  questionIndex={kickoffState.currentQuestionIndex}
                  totalQuestions={kickoffState.questions.length}
                  onAnswer={handleAnswer}
                  onSkip={handleSkip}
                  onSkipAll={handleSkipAll}
                  loading={sending}
                />
              </div>
            )}

          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            loading={sending}
            disabled={
              isAgenticActive ||
              !canReply ||
              workflow?.state === "plan_review" ||
              kickoffState?.status === "questioning" ||
              kickoffLoading
            }
            placeholder={getPlaceholder()}
          />
        </div>

        {/* Right: Progress Panel (45%) */}
        <div className="w-[45%] overflow-y-auto bg-gray-50 p-6">
          {/* Agentic progress — show when in agentic mode with status */}
          {flowMode === "agentic" && agenticStatus && (
            <AgenticProgress
              status={agenticStatus}
              onRetry={
                agenticStatus.status === "failed"
                  ? handleAgenticRetry
                  : undefined
              }
            />
          )}

          {/* Agentic complete state */}
          {flowMode === "agentic" &&
            agenticStatus?.status === "complete" && (
              <div className="mt-6 rounded-lg border bg-green-50 p-4 text-center">
                <p className="mb-3 text-sm font-medium text-green-800">
                  Your website has been generated!
                </p>
                <button
                  onClick={() =>
                    router.push(`/projects/${projectId}/editor`)
                  }
                  className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Open Editor
                </button>
              </div>
            )}

          {/* Agentic partial_complete state */}
          {flowMode === "agentic" &&
            agenticStatus?.status === "partial_complete" && (
              <div className="mt-6 rounded-lg border bg-amber-50 p-4 text-center">
                <p className="mb-3 text-sm font-medium text-amber-800">
                  Some pages were generated successfully.
                </p>
                <button
                  onClick={() =>
                    router.push(`/projects/${projectId}/editor`)
                  }
                  className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Open Editor
                </button>
              </div>
            )}

          {/* Legacy: Workflow progress */}
          {flowMode === "legacy" &&
            workflow &&
            workflow.steps.length > 0 && (
              <WorkflowProgress
                steps={workflow.steps}
                currentStep={workflow.currentStep}
                progressPercent={workflow.progressPercent}
                progressMessage={workflow.progressMessage}
                error={workflow.error}
                onRetry={
                  workflow.state === "failed" ? handleRetry : undefined
                }
              />
            )}

          {/* Legacy: Plan approval */}
          {flowMode === "legacy" &&
            workflow?.state === "plan_review" &&
            workflow.plan && (
              <div className="mt-6">
                <PlanApproval
                  plan={workflow.plan}
                  onApprove={handleApprovePlan}
                  onRevise={handleRevisePlan}
                  loading={sending}
                />
              </div>
            )}

          {/* Legacy: Plan display (non-review) */}
          {flowMode === "legacy" &&
            workflow?.plan &&
            workflow.state !== "plan_review" && (
              <div className="mt-6">
                <PlanApproval
                  plan={workflow.plan}
                  onApprove={handleApprovePlan}
                  onRevise={handleRevisePlan}
                  loading={true}
                />
              </div>
            )}

          {/* Empty state / kickoff state */}
          {!isAgenticActive &&
            (!workflow || workflow.steps.length === 0) &&
            !workflow?.plan &&
            !agenticStatus && (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                {kickoffLoading ? (
                  <>
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-3 border-primary-200 border-t-primary-600" />
                    <p className="text-sm font-medium text-primary-700">
                      Analyzing your business...
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Inferring audience, CTA strategy, and page structure
                    </p>
                  </>
                ) : kickoffState?.status === "questioning" ? (
                  <>
                    <p className="text-sm font-medium text-gray-600">
                      Almost ready to build
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Answer the quick question on the left, or skip to proceed
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm">
                      Your page plan and progress will appear here once the AI has
                      gathered enough information.
                    </p>
                  </>
                )}
              </div>
            )}

          {/* Legacy complete state */}
          {flowMode === "legacy" && workflow?.state === "complete" && (
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
