"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/common/AuthProvider";
import { EditorProvider, useEditor } from "@/components/editor/EditorContext";
import EditorCanvas from "@/components/editor/EditorCanvas";
import EditorToolbar from "@/components/editor/EditorToolbar";
import SectionListPanel from "@/components/editor/SectionListPanel";
import SectionInspector from "@/components/editor/SectionInspector";

function EditorContent({ projectId }: { projectId: string }) {
  const { setSections, sections, globalStyles, actions, assets, meta, brand, markClean, isPreview, previewWidth } = useEditor();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [version, setVersion] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadPage = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/page`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push(`/projects/${projectId}/builder`);
          return;
        }
        throw new Error("Failed to load page");
      }
      const data = await res.json();
      setSections(data.sections, data.globalStyles, {
        actions: data.actions || [],
        assets: data.assets || [],
        meta: data.meta || {},
        brand: data.brand || {},
      });
      setSlug(data.slug);
      setVersion(data.version);
    } catch {
      setError("Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, [projectId, setSections, router]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/page`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, globalStyles, actions, assets, meta, brand }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      const data = await res.json();
      setVersion(data.version);
      markClean();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="mt-20" />;
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-lg bg-red-50 p-6 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          onClick={loadPage}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <EditorToolbar
        onSave={handleSave}
        saving={saving}
        slug={slug}
        version={version}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — Section list */}
        {!isPreview && (
          <div className="w-56 flex-shrink-0 overflow-y-auto">
            <SectionListPanel />
          </div>
        )}

        {/* Center — Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div
            className="mx-auto transition-all duration-300"
            style={{ maxWidth: previewWidth }}
          >
            <EditorCanvas />
          </div>
        </div>

        {/* Right sidebar — Inspector */}
        {!isPreview && (
          <div className="w-72 flex-shrink-0 overflow-y-auto">
            <SectionInspector />
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner className="mt-20" />
      </>
    );
  }

  return (
    <EditorProvider>
      <Navbar />
      <EditorContent projectId={projectId} />
    </EditorProvider>
  );
}
