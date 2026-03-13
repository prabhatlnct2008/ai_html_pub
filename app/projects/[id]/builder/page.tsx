"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import PlanViewer from "@/components/plan/PlanViewer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/common/AuthProvider";

interface Message {
  role: string;
  content: string;
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

export default function BuilderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [workflowState, setWorkflowState] = useState<string>("intake");
  const [plan, setPlan] = useState<{ planData: PlanData; status: string } | null>(null);
  const [projectStatus, setProjectStatus] = useState<string>("draft");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [projectName, setProjectName] = useState("");

  const loadConversation = useCallback(async () => {
    try {
      const [convRes, projRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/conversation`),
        fetch(`/api/projects/${projectId}`),
      ]);

      if (convRes.ok) {
        const data = await convRes.json();
        setMessages(data.conversation?.messages || []);
        setWorkflowState(data.conversation?.workflowState || "intake");
        setPlan(data.plan);
        setProjectStatus(data.projectStatus);
      }

      if (projRes.ok) {
        const proj = await projRes.json();
        setProjectName(proj.name);
        if (proj.status === "generated" || proj.status === "published") {
          router.push(`/projects/${projectId}/editor`);
          return;
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) loadConversation();
  }, [user, authLoading, router, loadConversation]);

  const sendMessage = async (message: string) => {
    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setSending(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      setMessages(data.messages);
      setWorkflowState(data.workflowState);
      if (data.plan) setPlan(data.plan);
      setProjectStatus(data.projectStatus);

      // If generation is complete, redirect to editor
      if (data.workflowState === "complete") {
        setTimeout(() => {
          router.push(`/projects/${projectId}/editor`);
        }, 2000);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const getPlaceholder = () => {
    switch (workflowState) {
      case "intake":
        return messages.length === 0
          ? "Describe your business to get started..."
          : "Answer the AI's questions...";
      case "plan_review":
        return 'Type "approve" to proceed or suggest changes...';
      default:
        return "Type your message...";
    }
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
        {/* Left: Chat Panel */}
        <div className="flex w-1/2 flex-col border-r">
          <div className="border-b bg-white px-4 py-3">
            <h2 className="font-semibold">{projectName || "AI Builder"}</h2>
            <p className="text-xs text-gray-500">
              {workflowState === "intake" && "Gathering information about your business"}
              {workflowState === "competitor_analysis" && "Analyzing competitor website..."}
              {workflowState === "planning" && "Creating your page plan..."}
              {workflowState === "plan_review" && "Review and approve your page plan"}
              {workflowState === "generation" && "Generating your landing page..."}
              {workflowState === "complete" && "Your page is ready!"}
            </p>
          </div>
          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            loading={sending}
            disabled={workflowState === "generation" || workflowState === "complete"}
            placeholder={getPlaceholder()}
          />
        </div>

        {/* Right: Structured Output Panel */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 p-6">
          {plan ? (
            <PlanViewer plan={plan.planData} status={plan.status} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
              <div className="mb-3 text-4xl">📋</div>
              <p className="text-sm">
                Your page plan will appear here once the AI has gathered enough
                information.
              </p>
            </div>
          )}

          {workflowState === "complete" && (
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
