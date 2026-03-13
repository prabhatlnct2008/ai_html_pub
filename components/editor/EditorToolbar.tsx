"use client";

import { useEditor } from "./EditorContext";

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
  const { isDirty, isPreview, setPreview } = useEditor();

  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold">Page Editor</h2>
        <span className="text-xs text-gray-400">v{version}</span>
        {isDirty && (
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreview(!isPreview)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            isPreview
              ? "bg-primary-100 text-primary-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isPreview ? "Edit Mode" : "Preview"}
        </button>

        <a
          href={`/p/${slug}`}
          target="_blank"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          View Live
        </a>

        <button
          onClick={onSave}
          disabled={saving || !isDirty}
          className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
