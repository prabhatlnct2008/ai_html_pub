"use client";

import { useEditor } from "./EditorContext";
import SectionWrapper from "./SectionWrapper";
import AddSectionMenu from "./AddSectionMenu";

export default function EditorCanvas() {
  const { sections, isPreview } = useEditor();

  return (
    <div className="min-h-full">
      {sections.map((section, index) => (
        <div key={section.id}>
          {!isPreview && <AddSectionMenu index={index} />}
          <SectionWrapper section={section} index={index} />
        </div>
      ))}
      {!isPreview && <AddSectionMenu index={sections.length} />}
    </div>
  );
}
