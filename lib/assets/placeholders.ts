// Placeholder image system using SVG data URIs.
// These are used when no user image is available for a section slot.

const COLORS = {
  business: { bg: "#e0e7ff", fg: "#4338ca" },
  people: { bg: "#fce7f3", fg: "#be185d" },
  abstract: { bg: "#d1fae5", fg: "#047857" },
  product: { bg: "#fef3c7", fg: "#b45309" },
};

function makePlaceholderSvg(
  width: number,
  height: number,
  label: string,
  palette: { bg: string; fg: string }
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${palette.bg}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${palette.fg}" font-family="system-ui,sans-serif" font-size="${Math.min(width, height) * 0.08}" font-weight="600">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export type PlaceholderCategory = "hero" | "feature" | "testimonial" | "service" | "general";

export function getPlaceholderUrl(
  category: PlaceholderCategory,
  width = 800,
  height = 600,
  label?: string
): string {
  const labels: Record<PlaceholderCategory, string> = {
    hero: "Hero Image",
    feature: "Feature Image",
    testimonial: "Photo",
    service: "Service Image",
    general: "Image",
  };

  const palettes: Record<PlaceholderCategory, { bg: string; fg: string }> = {
    hero: COLORS.business,
    feature: COLORS.abstract,
    testimonial: COLORS.people,
    service: COLORS.product,
    general: COLORS.business,
  };

  return makePlaceholderSvg(width, height, label || labels[category], palettes[category]);
}
