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
import PageListPanel from "@/components/editor/PageListPanel";

function EditorContent({ projectId }: { projectId: string }) {
  const {
    setSections, sections, globalStyles, actions, assets, meta, brand,
    markClean, isPreview, previewWidth,
    setSiteSettings, setPages, setCurrentPageId, currentPageId, pages,
  } = useEditor();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectSlug, setProjectSlug] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [isCurrentPageHomepage, setIsCurrentPageHomepage] = useState(false);
  const [version, setVersion] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();

  // Load site data (settings + page list), then load the current page
  const loadSite = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/site`);
      if (!res.ok) {
        // Fallback: try legacy page endpoint for pre-migration projects
        return null;
      }
      const data = await res.json();
      setSiteSettings(data.siteSettings);
      setPages(data.pages || []);
      if (data.projectSlug) setProjectSlug(data.projectSlug);
      return data.pages as Array<{ id: string; isHomepage: boolean }>;
    } catch {
      return null;
    }
  }, [projectId, setSiteSettings, setPages]);

  const loadPage = useCallback(async (pageId?: string) => {
    try {
      // Try new multi-page endpoint first
      if (pageId) {
        const res = await fetch(`/api/projects/${projectId}/pages/${pageId}`);
        if (res.ok) {
          const data = await res.json();
          setSections(data.sections, data.globalStyles, {
            actions: data.actions || [],
            assets: data.assets || [],
            meta: data.meta || {},
            brand: data.brand || {},
          });
          setPageSlug(data.slug || "");
          setIsCurrentPageHomepage(!!data.isHomepage);
          setVersion(data.version || 1);
          setCurrentPageId(pageId);
          return;
        }
      }

      // Fallback: legacy single-page endpoint
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
      // Legacy endpoint returns project slug as data.slug
      if (!projectSlug && data.slug) setProjectSlug(data.slug);
      setPageSlug("home"); // Legacy single-page is always the homepage
      setIsCurrentPageHomepage(true);
      setVersion(data.version || 1);
      if (data.pageId) setCurrentPageId(data.pageId);
    } catch {
      setError("Failed to load page data");
    }
  }, [projectId, setSections, setCurrentPageId, router]);

  useEffect(() => {
    (async () => {
      const sitePages = await loadSite();
      // Find homepage or first page
      const homepage = sitePages?.find((p) => p.isHomepage) || sitePages?.[0];
      await loadPage(homepage?.id);
      setLoading(false);
    })();
  }, [loadSite, loadPage]);

  // Handle page switching
  const handlePageSwitch = useCallback(async (pageId: string) => {
    if (pageId === currentPageId) return;
    setLoading(true);
    setError("");
    await loadPage(pageId);
    setLoading(false);
  }, [currentPageId, loadPage]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Use new per-page endpoint if we have a pageId
      const url = currentPageId
        ? `/api/projects/${projectId}/pages/${currentPageId}`
        : `/api/projects/${projectId}/page`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections, globalStyles, actions, assets, meta, brand,
          slug: meta.slug || pageSlug,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      const data = await res.json();
      if (data.version) setVersion(data.version);
      if (data.slug) setPageSlug(data.slug);
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
          onClick={() => loadPage(currentPageId || undefined)}
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
        projectSlug={projectSlug}
        pageSlug={pageSlug}
        isHomepage={isCurrentPageHomepage}
        version={version}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — Page list + Section list */}
        {!isPreview && (
          <div className="w-56 flex-shrink-0 overflow-y-auto border-r border-gray-200">
            {pages.length > 0 && (
              <PageListPanel onPageSwitch={handlePageSwitch} />
            )}
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
    <EditorProvider projectId={projectId}>
      <Navbar />
      <EditorContent projectId={projectId} />
    </EditorProvider>
  );
}
