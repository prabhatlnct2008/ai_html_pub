"use client";

import { useEditor } from "./EditorContext";
import SectionWrapper from "./SectionWrapper";
import AddSectionMenu from "./AddSectionMenu";
import SiteHeaderPreview from "./SiteHeaderPreview";
import SiteFooterPreview from "./SiteFooterPreview";

export default function EditorCanvas() {
  const { sections, isPreview, siteSettings } = useEditor();

  return (
    <div className="min-h-full">
      {/* Site-level header (read-only preview) */}
      {siteSettings?.header && (
        <SiteHeaderPreview siteSettings={siteSettings} />
      )}

      {/* Page sections */}
      {sections.map((section, index) => (
        <div key={section.id}>
          {!isPreview && <AddSectionMenu index={index} />}
          <SectionWrapper section={section} index={index} />
        </div>
      ))}
      {!isPreview && <AddSectionMenu index={sections.length} />}

      {/* Site-level footer (read-only preview) */}
      {siteSettings?.footer && (
        <SiteFooterPreview siteSettings={siteSettings} />
      )}
    </div>
  );
}
