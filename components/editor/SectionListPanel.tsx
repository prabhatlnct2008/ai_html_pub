"use client";

import { useState } from "react";
import { useEditor, type SectionData } from "./EditorContext";
import { SECTION_CATALOG, SECTION_VARIANTS, createDefaultSection } from "@/lib/page/section-library";
import type { SectionType } from "@/lib/page/schema";

export default function SectionListPanel() {
  const {
    sections,
    selectedSectionId,
    selectSection,
    moveSection,
    deleteSection,
    duplicateSection,
    toggleVisibility,
    addSection,
  } = useEditor();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddSection = (type: SectionType, variant: string) => {
    const section = createDefaultSection(type, variant);
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
      variant: section.variant,
      visible: true,
    };
    addSection(editorSection, sections.length);
    setShowAddMenu(false);
  };

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <h3 className="text-sm font-semibold text-gray-700">Sections</h3>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Add section"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showAddMenu && (
        <AddSectionDropdown
          onAdd={handleAddSection}
          onClose={() => setShowAddMenu(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <SectionListItem
            key={section.id}
            section={section}
            index={index}
            total={sections.length}
            isSelected={selectedSectionId === section.id}
            onSelect={() => selectSection(section.id)}
            onMoveUp={() => moveSection(section.id, "up")}
            onMoveDown={() => moveSection(section.id, "down")}
            onDuplicate={() => duplicateSection(section.id)}
            onDelete={() => { if (confirm("Delete this section?")) deleteSection(section.id); }}
            onToggleVisibility={() => toggleVisibility(section.id)}
          />
        ))}
        {sections.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-gray-400">
            No sections yet. Click + to add one.
          </p>
        )}
      </div>
    </div>
  );
}

function SectionListItem({
  section,
  index,
  total,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onToggleVisibility,
}: {
  section: SectionData;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const isHidden = section.visible === false;
  const label = SECTION_CATALOG.find((c) => c.type === section.type)?.label || section.type;

  return (
    <div
      className={`group relative border-b border-gray-100 ${
        isSelected ? "bg-primary-50" : "hover:bg-gray-50"
      } ${isHidden ? "opacity-50" : ""}`}
    >
      <button
        onClick={onSelect}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500">
          {index + 1}
        </span>
        <span className="flex-1 truncate text-sm font-medium text-gray-700">
          {label}
        </span>
        {section.variant && section.variant !== "default" && (
          <span className="truncate text-[10px] text-gray-400">
            {section.variant}
          </span>
        )}
      </button>

      {/* Hover actions */}
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={index === 0}
          className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
          title="Move up"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={index === total - 1}
          className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
          title="Move down"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          className="rounded p-0.5 text-gray-400 hover:text-gray-600"
          title={isHidden ? "Show" : "Hide"}
        >
          {isHidden ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
          className="rounded p-0.5 text-gray-400 hover:text-gray-600"
          title="More"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
        </button>
      </div>

      {showActions && (
        <div className="absolute right-0 top-full z-30 rounded-md border bg-white py-1 shadow-lg" style={{ minWidth: "120px" }}>
          <button onClick={() => { onDuplicate(); setShowActions(false); }} className="flex w-full items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
            Duplicate
          </button>
          <button onClick={() => { onDelete(); setShowActions(false); }} className="flex w-full items-center px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function AddSectionDropdown({
  onAdd,
  onClose,
}: {
  onAdd: (type: SectionType, variant: string) => void;
  onClose: () => void;
}) {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);

  const handleSelectType = (type: SectionType) => {
    const variants = SECTION_VARIANTS[type];
    if (variants && variants.length > 1) {
      setSelectedType(type);
    } else {
      onAdd(type, variants?.[0] || "default");
    }
  };

  return (
    <div className="border-b bg-gray-50 p-2">
      {!selectedType ? (
        <div className="grid grid-cols-1 gap-0.5">
          {SECTION_CATALOG.map((meta) => (
            <button
              key={meta.type}
              onClick={() => handleSelectType(meta.type)}
              className="rounded px-2 py-1.5 text-left text-xs hover:bg-white"
            >
              <span className="font-medium text-gray-700">{meta.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <button onClick={() => setSelectedType(null)} className="mb-1 text-[10px] text-gray-500 hover:text-gray-700">
            &larr; Back
          </button>
          <div className="grid grid-cols-1 gap-0.5">
            {SECTION_VARIANTS[selectedType]?.map((variant) => (
              <button
                key={variant}
                onClick={() => onAdd(selectedType, variant)}
                className="rounded px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-white"
              >
                {variant.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
