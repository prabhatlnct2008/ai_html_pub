import type { SectionData } from "./ai/generator";

interface GlobalStyles {
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  font_family: string;
}

interface PageMeta {
  title: string;
  description: string;
}

export function renderPageHtml(
  sections: SectionData[],
  globalStyles: GlobalStyles,
  meta: PageMeta
): string {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const sectionsHtml = sortedSections.map((s) => renderSection(s, globalStyles)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escHtml(meta.description)}">
  <title>${escHtml(meta.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(globalStyles.font_family)}:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: '${globalStyles.font_family}', system-ui, -apple-system, sans-serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section { padding: 80px 0; }
    .btn { display: inline-block; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px; transition: opacity 0.2s; cursor: pointer; border: none; }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background-color: ${globalStyles.primary_color}; color: #ffffff; }
    .btn-secondary { background-color: transparent; color: ${globalStyles.primary_color}; border: 2px solid ${globalStyles.primary_color}; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .text-center { text-align: center; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
    h2 { font-size: 36px; font-weight: 700; line-height: 1.2; margin-bottom: 12px; }
    h3 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
    @media (max-width: 768px) {
      h1 { font-size: 32px; }
      h2 { font-size: 28px; }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .section { padding: 48px 0; }
    }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

function renderSection(section: SectionData, globalStyles: GlobalStyles): string {
  const content = section.content as Record<string, unknown>;
  const style = section.style as Record<string, string>;
  const bgColor = style.background_color || "#ffffff";
  const textColor = style.text_color || "#1a1a1a";
  const padding = style.padding || "80px 0";

  const sectionStyle = `background-color: ${bgColor}; color: ${textColor}; padding: ${padding};`;

  switch (section.type) {
    case "hero":
      return renderHero(section.id, content, sectionStyle, globalStyles);
    case "features":
      return renderFeatures(section.id, content, sectionStyle);
    case "testimonials":
      return renderTestimonials(section.id, content, sectionStyle);
    case "pricing":
      return renderPricing(section.id, content, sectionStyle, globalStyles);
    case "faq":
      return renderFaq(section.id, content, sectionStyle);
    case "cta":
      return renderCta(section.id, content, sectionStyle);
    case "contact":
      return renderContact(section.id, content, sectionStyle, globalStyles);
    default:
      return `<section data-section-id="${section.id}" style="${sectionStyle}"><div class="container text-center"><p>Unknown section type: ${section.type}</p></div></section>`;
  }
}

function renderHero(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string,
  globalStyles: GlobalStyles
): string {
  return `<section data-section-id="${id}" data-section-type="hero" class="section" style="${sectionStyle}">
  <div class="container text-center" style="max-width: 800px;">
    <h1>${escHtml(content.heading as string)}</h1>
    <p style="font-size: 20px; opacity: 0.9; margin-bottom: 32px;">${escHtml(content.subheading as string)}</p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      <a href="${escHtml(content.cta_link as string)}" class="btn btn-primary">${escHtml(content.cta_text as string)}</a>
      ${content.secondary_cta_text ? `<a href="${escHtml(content.secondary_cta_link as string)}" class="btn" style="background: rgba(255,255,255,0.15); color: inherit; border: 2px solid rgba(255,255,255,0.3);">${escHtml(content.secondary_cta_text as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderFeatures(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string
): string {
  const items = (content.items as Array<{ title: string; description: string; icon: string }>) || [];
  const gridClass = items.length <= 2 ? "grid-2" : "grid-3";

  return `<section data-section-id="${id}" data-section-type="features" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${escHtml(content.heading as string)}</h2>
      ${content.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 0 auto;">${escHtml(content.subheading as string)}</p>` : ""}
    </div>
    <div class="${gridClass}">
      ${items.map((item) => `<div class="card text-center">
        <div style="font-size: 40px; margin-bottom: 16px;">${item.icon || "⭐"}</div>
        <h3>${escHtml(item.title)}</h3>
        <p style="opacity: 0.7;">${escHtml(item.description)}</p>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderTestimonials(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string
): string {
  const items = (content.items as Array<{ quote: string; author: string; role: string }>) || [];

  return `<section data-section-id="${id}" data-section-type="testimonials" class="section" style="${sectionStyle}">
  <div class="container">
    <h2 class="text-center" style="margin-bottom: 48px;">${escHtml(content.heading as string)}</h2>
    <div class="grid-${Math.min(items.length, 3)}">
      ${items.map((item) => `<div class="card">
        <p style="font-style: italic; font-size: 18px; margin-bottom: 16px;">"${escHtml(item.quote)}"</p>
        <div>
          <strong>${escHtml(item.author)}</strong>
          ${item.role ? `<br><span style="opacity: 0.6; font-size: 14px;">${escHtml(item.role)}</span>` : ""}
        </div>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderPricing(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string,
  globalStyles: GlobalStyles
): string {
  const plans = (content.plans as Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    cta_text: string;
    highlighted: boolean;
  }>) || [];

  return `<section data-section-id="${id}" data-section-type="pricing" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${escHtml(content.heading as string)}</h2>
      ${content.subheading ? `<p style="font-size: 18px; opacity: 0.7;">${escHtml(content.subheading as string)}</p>` : ""}
    </div>
    <div class="grid-${Math.min(plans.length, 3)}" style="max-width: 900px; margin: 0 auto;">
      ${plans.map((plan) => `<div class="card text-center" style="${plan.highlighted ? `border: 2px solid ${globalStyles.primary_color}; transform: scale(1.05);` : "border: 1px solid #e5e7eb;"}">
        <h3>${escHtml(plan.name)}</h3>
        <div style="font-size: 48px; font-weight: 800; margin: 16px 0;">${escHtml(plan.price)}<span style="font-size: 16px; font-weight: 400; opacity: 0.6;">${escHtml(plan.period)}</span></div>
        <ul style="list-style: none; margin-bottom: 24px; text-align: left;">
          ${plan.features.map((f) => `<li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">✓ ${escHtml(f)}</li>`).join("\n          ")}
        </ul>
        <a href="#contact" class="btn ${plan.highlighted ? "btn-primary" : "btn-secondary"}" style="width: 100%;">${escHtml(plan.cta_text)}</a>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderFaq(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string
): string {
  const items = (content.items as Array<{ question: string; answer: string }>) || [];

  return `<section data-section-id="${id}" data-section-type="faq" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 800px;">
    <h2 class="text-center" style="margin-bottom: 48px;">${escHtml(content.heading as string)}</h2>
    ${items.map((item) => `<details style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
      <summary style="font-weight: 600; font-size: 18px; cursor: pointer; list-style: none;">${escHtml(item.question)}</summary>
      <p style="margin-top: 12px; opacity: 0.7;">${escHtml(item.answer)}</p>
    </details>`).join("\n    ")}
  </div>
</section>`;
}

function renderCta(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string
): string {
  return `<section data-section-id="${id}" data-section-type="cta" class="section" style="${sectionStyle}">
  <div class="container text-center" style="max-width: 700px;">
    <h2>${escHtml(content.heading as string)}</h2>
    ${content.subheading ? `<p style="font-size: 18px; opacity: 0.9; margin-bottom: 32px;">${escHtml(content.subheading as string)}</p>` : ""}
    <a href="${escHtml((content.button_link as string) || "#contact")}" class="btn" style="background: #ffffff; color: inherit; font-weight: 700; padding: 16px 40px;">${escHtml(content.button_text as string)}</a>
  </div>
</section>`;
}

function renderContact(
  id: string,
  content: Record<string, unknown>,
  sectionStyle: string,
  globalStyles: GlobalStyles
): string {
  const fields = (content.fields as string[]) || ["name", "email", "message"];

  return `<section data-section-id="${id}" data-section-type="contact" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 600px;">
    <div class="text-center" style="margin-bottom: 32px;">
      <h2>${escHtml(content.heading as string)}</h2>
      ${content.subheading ? `<p style="font-size: 18px; opacity: 0.7;">${escHtml(content.subheading as string)}</p>` : ""}
    </div>
    <form style="display: flex; flex-direction: column; gap: 16px;">
      ${fields.map((field) => {
        if (field === "message") {
          return `<textarea placeholder="${escHtml(field.charAt(0).toUpperCase() + field.slice(1))}" rows="4" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; font-family: inherit;"></textarea>`;
        }
        return `<input type="${field === "email" ? "email" : "text"}" placeholder="${escHtml(field.charAt(0).toUpperCase() + field.slice(1))}" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; font-family: inherit;">`;
      }).join("\n      ")}
      <button type="submit" class="btn btn-primary" style="width: 100%;">${escHtml(content.button_text as string)}</button>
    </form>
  </div>
</section>`;
}

function escHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
