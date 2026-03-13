"use client";

import { useEditor } from "./EditorContext";

interface SectionControlsProps {
  sectionId: string;
  index: number;
  totalSections: number;
  sectionType: string;
}

export default function SectionControls({
  sectionId,
  index,
  totalSections,
  sectionType,
}: SectionControlsProps) {
  const { moveSection, deleteSection, duplicateSection } = useEditor();

  return (
    <div className="absolute -top-0 right-2 z-20 flex items-center gap-1 rounded-b-lg bg-gray-900/90 px-2 py-1.5 shadow-lg">
      <span className="mr-2 text-xs font-medium capitalize text-gray-300">
        {sectionType}
      </span>
      <button
        onClick={() => moveSection(sectionId, "up")}
        disabled={index === 0}
        className="rounded p-1 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-30"
        title="Move up"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button
        onClick={() => moveSection(sectionId, "down")}
        disabled={index === totalSections - 1}
        className="rounded p-1 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-30"
        title="Move down"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button
        onClick={() => duplicateSection(sectionId)}
        className="rounded p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
        title="Duplicate"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        onClick={() => {
          if (confirm("Delete this section?")) deleteSection(sectionId);
        }}
        className="rounded p-1 text-red-400 hover:bg-red-900/50 hover:text-red-300"
        title="Delete"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
