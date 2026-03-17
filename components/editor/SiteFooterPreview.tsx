"use client";

import type { SiteSettings } from "@/lib/site/types";

interface Props {
  siteSettings: SiteSettings;
}

/**
 * Read-only preview of the site-wide footer shown at the bottom of the canvas.
 */
export default function SiteFooterPreview({ siteSettings }: Props) {
  const { footer, brand } = siteSettings;
  if (!footer) return null;

  return (
    <div className="group relative border-t border-dashed border-gray-300 bg-gray-900 text-gray-300">
      {/* Site footer label */}
      <div className="absolute -top-5 left-2 z-10 hidden rounded bg-gray-700 px-2 py-0.5 text-[10px] text-white group-hover:block">
        Site Footer
      </div>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Company info */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p
              className="text-lg font-bold"
              style={{ color: brand?.primaryColor || "#60a5fa" }}
            >
              {footer.companyName || siteSettings.siteName || "Company"}
            </p>
            {footer.tagline && (
              <p className="mt-1 text-sm text-gray-400">{footer.tagline}</p>
            )}
          </div>
        </div>

        {/* Footer columns */}
        {footer.columns && footer.columns.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-8 md:grid-cols-4">
            {footer.columns.map((col, i) => (
              <div key={i}>
                <h4 className="mb-2 text-sm font-semibold text-white">
                  {col.title}
                </h4>
                <ul className="space-y-1">
                  {col.links?.map((link, j) => (
                    <li key={j} className="text-sm text-gray-400">
                      {link.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
          &copy; {footer.copyrightYear || new Date().getFullYear()}{" "}
          {footer.companyName || siteSettings.siteName}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
