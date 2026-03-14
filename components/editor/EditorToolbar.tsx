"use client";

import { useEditor, type PreviewMode } from "./EditorContext";

interface EditorToolbarProps {
  onSave: () => Promise<void>;
  saving: boolean;
  slug: string;
  version: number;
}

export default function EditorToolbar({
  onSave,
  saving,
  slug,
  version,
}: EditorToolbarProps) {
  const { isDirty, isPreview, setPreview, previewMode, setPreviewMode } = useEditor();

  const previewModes: { mode: PreviewMode; label: string; icon: string }[] = [
    { mode: "desktop", label: "Desktop", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { mode: "tablet", label: "Tablet", icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { mode: "mobile", label: "Mobile", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  ];

  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-gray-700">Editor</h2>
        <span className="text-[10px] text-gray-400">v{version}</span>
        {isDirty && (
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
            Unsaved
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Preview mode toggles */}
        {isPreview && (
          <div className="mr-2 flex items-center rounded-lg bg-gray-100 p-0.5">
            {previewModes.map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`rounded-md p-1.5 transition ${
                  previewMode === mode
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title={label}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setPreview(!isPreview)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            isPreview
              ? "bg-primary-100 text-primary-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isPreview ? "Edit" : "Preview"}
        </button>

        <a
          href={`/p/${slug}`}
          target="_blank"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          Live
        </a>

        <button
          onClick={onSave}
          disabled={saving || !isDirty}
          className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
