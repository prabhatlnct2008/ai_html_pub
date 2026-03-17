"use client";

import type { SiteSettings } from "@/lib/site/types";

interface Props {
  siteSettings: SiteSettings;
}

/**
 * Read-only preview of the site-wide header shown at the top of the canvas.
 * Clicking it hints the user to edit via site settings.
 */
export default function SiteHeaderPreview({ siteSettings }: Props) {
  const { header, navigation, brand } = siteSettings;
  if (!header?.showNav && !header?.siteName) return null;

  const visibleNav = navigation.filter((n) => n.visible);

  return (
    <div className="group relative border-b border-dashed border-gray-300 bg-white">
      {/* Site header label */}
      <div className="absolute -top-5 left-2 z-10 hidden rounded bg-gray-700 px-2 py-0.5 text-[10px] text-white group-hover:block">
        Site Header
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="text-lg font-bold"
            style={{ color: brand?.primaryColor || "#2563eb" }}
          >
            {header.siteName || siteSettings.siteName || "Site Name"}
          </span>
        </div>
        {header.showNav && visibleNav.length > 0 && (
          <nav className="flex items-center gap-4">
            {visibleNav.map((item) => (
              <span
                key={item.pageId}
                className="text-sm text-gray-600"
              >
                {item.label}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
