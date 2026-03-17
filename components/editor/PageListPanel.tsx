"use client";

import { useState, useRef, useEffect } from "react";
import { useEditor } from "./EditorContext";
import type { PageSummary } from "@/lib/site/types";

interface PageListPanelProps {
  onPageSwitch: (pageId: string) => void;
}

export default function PageListPanel({ onPageSwitch }: PageListPanelProps) {
  const { pages, currentPageId, projectId, setPages } = useEditor();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when adding
  useEffect(() => {
    if (isAdding && inputRef.current) inputRef.current.focus();
  }, [isAdding]);

  const refreshPages = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages);
      }
    } catch {
      // silent
    }
  };

  const handleAddPage = async () => {
    const title = newTitle.trim() || "New Page";
    setIsAdding(false);
    setNewTitle("");
    try {
      const res = await fetch(`/api/projects/${projectId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const data = await res.json();
        await refreshPages();
        onPageSwitch(data.page.id);
      }
    } catch {
      // silent
    }
  };

  const handleDuplicate = async (pageId: string) => {
    setMenuOpenId(null);
    const page = pages.find((p) => p.id === pageId);
    try {
      const res = await fetch(`/api/projects/${projectId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${page?.title || "Page"} (Copy)`,
          duplicateFromPageId: pageId,
        }),
      });
      if (res.ok) {
        await refreshPages();
      }
    } catch {
      // silent
    }
  };

  const handleDelete = async (pageId: string) => {
    setMenuOpenId(null);
    if (pages.length <= 1) return;
    if (!confirm("Delete this page?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/pages/${pageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshPages();
        if (pageId === currentPageId) {
          const remaining = pages.filter((p) => p.id !== pageId);
          if (remaining.length > 0) onPageSwitch(remaining[0].id);
        }
      }
    } catch {
      // silent
    }
  };

  const handleSetHomepage = async (pageId: string) => {
    setMenuOpenId(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHomepage: true }),
      });
      if (res.ok) {
        await refreshPages();
      }
    } catch {
      // silent
    }
  };

  const handleToggleNav = async (pageId: string) => {
    setMenuOpenId(null);
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showInNav: !page.showInNav }),
      });
      if (res.ok) {
        await refreshPages();
      }
    } catch {
      // silent
    }
  };

  if (pages.length === 0) return null;

  return (
    <div className="border-b border-gray-200 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Pages
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Add page"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add page input */}
      {isAdding && (
        <div className="mb-2">
          <input
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddPage();
              if (e.key === "Escape") { setIsAdding(false); setNewTitle(""); }
            }}
            onBlur={() => { if (newTitle.trim()) handleAddPage(); else { setIsAdding(false); setNewTitle(""); } }}
            placeholder="Page name..."
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
      )}

      <ul className="space-y-0.5">
        {pages.map((page) => {
          const isActive = page.id === currentPageId;
          return (
            <li key={page.id} className="group relative">
              <div className="flex items-center">
                <button
                  onClick={() => onPageSwitch(page.id)}
                  className={`flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page.isHomepage && (
                    <span className="text-xs flex-shrink-0" title="Homepage">&#127968;</span>
                  )}
                  {!page.showInNav && (
                    <span className="text-xs flex-shrink-0 text-gray-400" title="Hidden from nav">&#128065;</span>
                  )}
                  <span className="truncate">
                    {page.title || page.slug || "Untitled"}
                  </span>
                </button>
                {/* Context menu button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === page.id ? null : page.id); }}
                  className="invisible rounded p-1 text-gray-400 hover:bg-gray-200 group-hover:visible"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="4" r="2" />
                    <circle cx="10" cy="10" r="2" />
                    <circle cx="10" cy="16" r="2" />
                  </svg>
                </button>
              </div>

              {/* Context menu */}
              {menuOpenId === page.id && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {!page.isHomepage && (
                    <MenuItem onClick={() => handleSetHomepage(page.id)}>
                      Set as homepage
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => handleToggleNav(page.id)}>
                    {page.showInNav ? "Hide from nav" : "Show in nav"}
                  </MenuItem>
                  <MenuItem onClick={() => handleDuplicate(page.id)}>
                    Duplicate
                  </MenuItem>
                  {pages.length > 1 && (
                    <MenuItem onClick={() => handleDelete(page.id)} danger>
                      Delete
                    </MenuItem>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-3 py-1.5 text-left text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
