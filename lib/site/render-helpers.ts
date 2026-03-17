/**
 * Render-on-read helpers for composing site-level header/footer
 * around page body HTML at request time.
 */

import type { SiteSettings, SiteFooter } from "./types";
import type { BrandSettings, PageDocument } from "@/lib/page/schema";
import { renderPageFromDocument } from "@/lib/page/renderer";

function esc(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Render site-level navigation header HTML.
 */
function renderSiteHeader(
  siteSettings: SiteSettings
): string {
  const { header, navigation, brand } = siteSettings;
  if (!header) return "";

  const visibleNav = navigation.filter((n) => n.visible);
  const siteName = header.siteName || siteSettings.siteName || "";

  const navHtml =
    header.showNav && visibleNav.length > 0
      ? `<nav style="display: flex; align-items: center; gap: 24px;">
        ${visibleNav
          .map(
            (item) =>
              `<a href="/${esc(item.slug === "home" ? "" : item.slug)}" style="color: #374151; text-decoration: none; font-size: 15px; font-weight: 500; transition: color 0.2s;">${esc(item.label)}</a>`
          )
          .join("\n        ")}
      </nav>`
      : "";

  return `<header style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 16px 0;">
  <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
    <a href="/" style="text-decoration: none; font-size: 20px; font-weight: 700; color: ${esc(brand?.primaryColor || "#2563eb")};">${esc(siteName)}</a>
    ${navHtml}
  </div>
</header>`;
}

/**
 * Render site-level footer HTML from extracted footer data.
 */
function renderSiteFooter(
  footer: SiteFooter,
  brand: BrandSettings | undefined,
  siteName?: string
): string {
  const companyName = footer.companyName || siteName || "Company";
  const copyrightYear = footer.copyrightYear || String(new Date().getFullYear());

  const socialHtml = footer.socialLinks?.length
    ? `<div style="display: flex; gap: 12px; margin-top: 16px;">${footer.socialLinks.map((sl) => `<a href="${esc(sl.url)}" style="color: inherit; opacity: 0.6; text-decoration: none; font-size: 14px;">${esc(sl.platform)}</a>`).join("\n          ")}</div>`
    : "";

  const legalHtml = footer.legalLinks?.length
    ? `<div style="display: flex; gap: 24px;">${footer.legalLinks.map((l) => `<a href="${esc(l.href || "#")}" style="color: inherit; text-decoration: none;">${esc(l.text)}</a>`).join("")}</div>`
    : "";

  const columnsHtml =
    footer.columns && footer.columns.length > 0
      ? footer.columns
          .map(
            (col) => `<div style="min-width: 140px;">
        <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 16px;">${esc(col.title)}</h4>
        <ul style="list-style: none;">
          ${col.links.map((link) => `<li style="margin-bottom: 8px;"><a href="${esc(link.href || "#")}" style="color: inherit; text-decoration: none; opacity: 0.7;">${esc(link.text)}</a></li>`).join("\n          ")}
        </ul>
      </div>`
          )
          .join("\n      ")
      : "";

  return `<footer style="background-color: #111827; color: #d1d5db; padding: 64px 0 32px;">
  <div class="container">
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 48px; margin-bottom: 48px;">
      <div style="min-width: 200px;">
        <h3 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">${esc(companyName)}</h3>
        ${footer.tagline ? `<p style="opacity: 0.6; max-width: 280px;">${esc(footer.tagline)}</p>` : ""}
        ${socialHtml}
      </div>
      ${columnsHtml}
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 14px; opacity: 0.6;">
      <p>&copy; ${esc(copyrightYear)} ${esc(companyName)}. All rights reserved.</p>
      ${legalHtml}
    </div>
  </div>
</footer>`;
}

/**
 * Compose a full page HTML with site header and footer injected.
 * The page body comes from pre-rendered or render-on-read HTML.
 * Header/footer come from siteSettings and are rendered at request time.
 */
export function composePageWithSiteShell(
  pageHtml: string,
  siteSettings: SiteSettings | null
): string {
  if (!siteSettings) return pageHtml;

  const headerHtml = renderSiteHeader(siteSettings);
  const footerHtml = siteSettings.footer
    ? renderSiteFooter(siteSettings.footer, siteSettings.brand, siteSettings.siteName)
    : "";

  if (!headerHtml && !footerHtml) return pageHtml;

  // Inject header after <body> and footer before </body>
  let result = pageHtml;

  if (headerHtml) {
    const bodyIdx = result.indexOf("<body>");
    if (bodyIdx !== -1) {
      const insertAt = bodyIdx + "<body>".length;
      result =
        result.slice(0, insertAt) + "\n" + headerHtml + "\n" + result.slice(insertAt);
    }
  }

  if (footerHtml) {
    const bodyEndIdx = result.lastIndexOf("</body>");
    if (bodyEndIdx !== -1) {
      result =
        result.slice(0, bodyEndIdx) + "\n" + footerHtml + "\n" + result.slice(bodyEndIdx);
    }
  }

  return result;
}

/**
 * Re-render a page from its documentJson on read (render-on-read pattern).
 * Falls back to pre-rendered HTML if documentJson is empty.
 * Composes with site shell (header/footer) when siteSettings is provided.
 */
export function renderOnRead(
  documentJson: string,
  renderedHtml: string,
  siteSettings?: SiteSettings | null
): string {
  let html: string;

  if (documentJson && documentJson !== "{}") {
    try {
      const doc = JSON.parse(documentJson) as PageDocument;
      // Inject site-level brand and actions into the document for rendering.
      // The page doc may have stale/empty brand/actions; site settings is canonical.
      if (siteSettings) {
        if (siteSettings.brand) doc.brand = siteSettings.brand;
        if (siteSettings.actions?.length) doc.actions = siteSettings.actions;
      }
      html = renderPageFromDocument(doc);
    } catch {
      html = renderedHtml;
    }
  } else {
    html = renderedHtml;
  }

  // Compose with site shell if siteSettings provided
  if (siteSettings) {
    html = composePageWithSiteShell(html, siteSettings);
  }

  return html;
}
