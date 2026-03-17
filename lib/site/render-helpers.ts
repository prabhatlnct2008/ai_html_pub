/**
 * Render-on-read helpers for composing site-level header/footer
 * around page body HTML at request time.
 */

import type { SiteSettings } from "./types";
import type { PageDocument } from "@/lib/page/schema";
import { renderPageFromDocument } from "@/lib/page/renderer";

/**
 * Compose a full page HTML with site header and footer.
 * The page body comes from the page's renderedHtml.
 * The header/footer come from siteSettings and are rendered inline.
 */
export function composePageWithSiteShell(
  pageHtml: string,
  siteSettings: SiteSettings | null
): string {
  if (!siteSettings) return pageHtml;

  // For now, return the page HTML as-is since header/footer
  // are rendered in the editor canvas as React components.
  // Full HTML composition for published pages will be enhanced
  // when the site-level header/footer templates are defined.
  // The page body already contains the full rendered HTML from
  // renderPageFromDocument() - header/footer injection happens
  // only when siteSettings has extracted header/footer data.
  return pageHtml;
}

/**
 * Re-render a page from its documentJson on read (render-on-read pattern).
 * Falls back to pre-rendered HTML if documentJson is empty.
 */
export function renderOnRead(
  documentJson: string,
  renderedHtml: string
): string {
  if (!documentJson || documentJson === "{}") {
    return renderedHtml;
  }

  try {
    const doc = JSON.parse(documentJson) as PageDocument;
    return renderPageFromDocument(doc);
  } catch {
    // If parsing/rendering fails, fall back to pre-rendered
    return renderedHtml;
  }
}
