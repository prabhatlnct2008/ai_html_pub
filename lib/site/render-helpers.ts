/**
 * Render-on-read helpers for composing site-level header/footer
 * around page body HTML at request time.
 */

import type { SiteSettings, SiteFooter } from "./types";
import type { BrandSettings, PageDocument } from "@/lib/page/schema";
import { renderPageFromDocument } from "@/lib/page/renderer";
import { BRAND_SITE_MANAGED } from "./types";

function esc(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Context needed for generating correct published URLs in the site shell.
 */
export interface SiteShellContext {
  /** The project's URL slug, used to build /p/{projectSlug}/... links */
  projectSlug: string;
}

/**
 * Render site-level navigation header HTML.
 * All links are absolute under /p/{projectSlug}.
 */
function renderSiteHeader(
  siteSettings: SiteSettings,
  ctx: SiteShellContext
): string {
  const { header, navigation, brand } = siteSettings;
  if (!header) return "";

  const visibleNav = navigation.filter((n) => n.visible);
  const siteName = header.siteName || siteSettings.siteName || "";
  const homeHref = `/p/${esc(ctx.projectSlug)}`;

  const navHtml =
    header.showNav && visibleNav.length > 0
      ? `<nav style="display: flex; align-items: center; gap: 24px;">
        ${visibleNav
          .map((item) => {
            // Homepage links to /p/{projectSlug}, sub-pages to /p/{projectSlug}/{pageSlug}
            const href = item.isHomepage
              ? homeHref
              : `${homeHref}/${esc(item.slug)}`;
            return `<a href="${href}" style="color: #374151; text-decoration: none; font-size: 15px; font-weight: 500; transition: color 0.2s;">${esc(item.label)}</a>`;
          })
          .join("\n        ")}
      </nav>`
      : "";

  return `<header style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 16px 0;">
  <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
    <a href="${homeHref}" style="text-decoration: none; font-size: 20px; font-weight: 700; color: ${esc(brand?.primaryColor || "#2563eb")};">${esc(siteName)}</a>
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
 * Requires projectSlug context to generate correct published URLs.
 */
export function composePageWithSiteShell(
  pageHtml: string,
  siteSettings: SiteSettings | null,
  ctx: SiteShellContext
): string {
  if (!siteSettings) return pageHtml;

  const headerHtml = renderSiteHeader(siteSettings, ctx);
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
 * Resolve brand for rendering: site settings is canonical, fall back to
 * whatever is in the page doc, then to defaults.
 */
function resolveBrand(
  siteSettings: SiteSettings | null | undefined,
  docBrand: BrandSettings | undefined
): BrandSettings {
  if (siteSettings?.brand) return siteSettings.brand;
  if (docBrand && docBrand.primaryColor !== BRAND_SITE_MANAGED.primaryColor) return docBrand;
  return BRAND_SITE_MANAGED;
}

/**
 * Re-render a page from its documentJson on read (render-on-read pattern).
 * Falls back to pre-rendered HTML if documentJson is empty.
 * Composes with site shell (header/footer) when siteSettings + context are provided.
 */
export function renderOnRead(
  documentJson: string,
  renderedHtml: string,
  siteSettings?: SiteSettings | null,
  ctx?: SiteShellContext
): string {
  let html: string;

  if (documentJson && documentJson !== "{}") {
    try {
      const doc = JSON.parse(documentJson) as PageDocument;
      // Inject site-level brand and actions into the document for rendering.
      // Page docs do not own brand or actions; site settings is canonical.
      doc.brand = resolveBrand(siteSettings, doc.brand);
      if (siteSettings?.actions?.length) doc.actions = siteSettings.actions;
      html = renderPageFromDocument(doc);
    } catch {
      html = renderedHtml;
    }
  } else {
    html = renderedHtml;
  }

  // Newly created pages have no content yet — render a minimal placeholder
  // so the published route doesn't 404 (owner can still preview the shell).
  if (!html) {
    html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page</title></head><body><div style="min-height:60vh;display:flex;align-items:center;justify-content:center;font-family:system-ui;color:#9ca3af;"><p>This page has no content yet.</p></div></body></html>`;
  }

  // Compose with site shell if siteSettings and context are provided
  if (siteSettings && ctx) {
    html = composePageWithSiteShell(html, siteSettings, ctx);
  }

  return html;
}
