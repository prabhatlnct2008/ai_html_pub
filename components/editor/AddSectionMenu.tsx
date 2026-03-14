"use client";

import { useState } from "react";
import { useEditor, type SectionData } from "./EditorContext";
import { SECTION_CATALOG, SECTION_VARIANTS, createDefaultSection } from "@/lib/page/section-library";
import type { SectionType } from "@/lib/page/schema";

interface AddSectionMenuProps {
  index: number;
}

export default function AddSectionMenu({ index }: AddSectionMenuProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  const { addSection } = useEditor();

  const handleSelectType = (type: SectionType) => {
    const variants = SECTION_VARIANTS[type];
    if (variants.length > 1) {
      setSelectedType(type);
    } else {
      handleAdd(type, variants[0]);
    }
  };

  const handleAdd = (type: SectionType, variant: string) => {
    const section = createDefaultSection(type, variant);
    // Convert to editor's SectionData format
    const editorSection: SectionData = {
      id: section.id,
      type: section.type,
      order: 0,
      content: section.content,
      style: {
        background_color: section.style.backgroundColor,
        text_color: section.style.textColor,
        padding: section.style.padding,
      },
    };
    addSection(editorSection, index);
    setOpen(false);
    setSelectedType(null);
  };

  return (
    <div className="group relative flex items-center justify-center py-1">
      <button
        onClick={() => { setOpen(!open); setSelectedType(null); }}
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 opacity-0 transition hover:border-primary-500 hover:text-primary-500 group-hover:opacity-100"
        title="Add section"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full z-30 mt-1 rounded-lg border bg-white p-3 shadow-xl" style={{ minWidth: selectedType ? "240px" : "400px" }}>
          {!selectedType ? (
            <>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Add Section</p>
              <div className="grid grid-cols-2 gap-1">
                {SECTION_CATALOG.map((meta) => (
                  <button
                    key={meta.type}
                    onClick={() => handleSelectType(meta.type)}
                    className="flex flex-col items-start rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    <span className="font-medium">{meta.label}</span>
                    <span className="text-xs text-gray-400">{meta.description}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedType(null)}
                className="mb-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Choose variant for {SECTION_CATALOG.find((m) => m.type === selectedType)?.label}
              </p>
              <div className="space-y-1">
                {SECTION_VARIANTS[selectedType].map((variant) => (
                  <button
                    key={variant}
                    onClick={() => handleAdd(selectedType, variant)}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {variant.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
