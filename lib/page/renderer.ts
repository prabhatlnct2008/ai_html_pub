import type {
  PageDocument,
  Section,
  Brand,
  Asset,
  Action,
  ButtonRef,
  HeroContent,
  TrustBarContent,
  FeaturesContent,
  BenefitsContent,
  ProblemSolutionContent,
  HowItWorksContent,
  ServicesContent,
  TestimonialsContent,
  ResultsContent,
  PricingContent,
  FaqContent,
  CtaBandContent,
  ContactContent,
  FooterContent,
  GalleryContent,
  ServiceAreaContent,
  AboutTeamContent,
} from "./schema";
import { getPlaceholderUrl } from "@/lib/assets/placeholders";
import { resolveAction, getActionHref } from "@/lib/actions/resolver";
import { resolveIcon } from "./icons";

// ---- Main Render Function ----

export function renderPageFromDocument(doc: PageDocument): string {
  const visibleSections = doc.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const sectionsHtml = visibleSections
    .map((s) => renderSection(s, doc.brand, doc.assets, doc.actions))
    .join("\n");

  const fontFamilies = [doc.brand.fontHeading];
  if (doc.brand.fontBody !== doc.brand.fontHeading) {
    fontFamilies.push(doc.brand.fontBody);
  }
  const fontsParam = fontFamilies
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700;800`)
    .join("&");

  // Build structured data (LocalBusiness / Organization)
  const structuredData = buildStructuredData(doc);
  const ogType = doc.meta.pageType === "local-business" ? "business.business" : "website";
  const heroSection = visibleSections.find((s) => s.type === "hero");
  const heroContent = heroSection?.content as Record<string, unknown> | undefined;
  const ogDescription = doc.meta.description || (heroContent?.subheading as string) || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(ogDescription)}">
  <title>${esc(doc.meta.title)}</title>
  <!-- Open Graph -->
  <meta property="og:title" content="${esc(doc.meta.title)}">
  <meta property="og:description" content="${esc(ogDescription)}">
  <meta property="og:type" content="${ogType}">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(doc.meta.title)}">
  <meta name="twitter:description" content="${esc(ogDescription)}">
  ${structuredData ? `<script type="application/ld+json">${structuredData}</script>` : ""}
  <link href="https://fonts.googleapis.com/css2?${fontsParam}&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: '${doc.brand.fontBody}', system-ui, -apple-system, sans-serif; color: #1a1a1a; line-height: 1.6; }
    h1, h2, h3, h4 { font-family: '${doc.brand.fontHeading}', system-ui, -apple-system, sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section { padding: 80px 0; }
    .btn { display: inline-block; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px; transition: all 0.2s; cursor: pointer; border: none; font-family: inherit; }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary { background-color: ${doc.brand.primaryColor}; color: #ffffff; }
    .btn-secondary { background-color: transparent; color: ${doc.brand.primaryColor}; border: 2px solid ${doc.brand.primaryColor}; }
    .btn-white { background: #ffffff; color: ${doc.brand.primaryColor}; }
    .btn-outline { background: transparent; color: inherit; border: 2px solid rgba(255,255,255,0.3); }
    .btn-ghost { background: rgba(255,255,255,0.15); color: inherit; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .text-center { text-align: center; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06); }
    h1 { font-size: 52px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
    h2 { font-size: 40px; font-weight: 700; line-height: 1.2; margin-bottom: 12px; }
    h3 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
    p { line-height: 1.7; }
    img { max-width: 100%; height: auto; }
    html { scroll-behavior: smooth; }
    @media (max-width: 768px) {
      h1 { font-size: 36px; }
      h2 { font-size: 30px; }
      h3 { font-size: 20px; }
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .section { padding: 48px 0; }
      .hero-split { flex-direction: column !important; }
    }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

// ---- Section Dispatcher ----

function renderSection(section: Section, brand: Brand, assets: Asset[], actions: Action[]): string {
  const resolveAssetFn = (id?: string) => assets.find((a) => a.id === id);
  const bgColor = section.style.backgroundColor;
  const textColor = section.style.textColor;
  const padding = section.style.padding;
  const sectionStyle = `background-color: ${bgColor}; color: ${textColor}; padding: ${padding};`;
  const sectionId = section.type === "footer" ? "" : ` id="${section.type}"`;

  const renderers: Record<string, () => string> = {
    hero: () => renderHero(section, sectionStyle, brand, resolveAssetFn, actions),
    "trust-bar": () => renderTrustBar(section, sectionStyle, brand),
    features: () => renderFeatures(section, sectionStyle, brand),
    benefits: () => renderBenefits(section, sectionStyle, brand),
    "problem-solution": () => renderProblemSolution(section, sectionStyle, brand),
    "how-it-works": () => renderHowItWorks(section, sectionStyle, brand),
    services: () => renderServices(section, sectionStyle, brand),
    testimonials: () => renderTestimonials(section, sectionStyle),
    results: () => renderResults(section, sectionStyle),
    pricing: () => renderPricing(section, sectionStyle, brand, actions),
    faq: () => renderFaq(section, sectionStyle),
    "cta-band": () => renderCtaBand(section, sectionStyle, actions),
    contact: () => renderContact(section, sectionStyle, brand, actions),
    footer: () => renderFooter(section, sectionStyle, brand),
    gallery: () => renderGallery(section, sectionStyle, assets),
    "service-area": () => renderServiceArea(section, sectionStyle),
    "about-team": () => renderAboutTeam(section, sectionStyle, brand),
  };

  const render = renderers[section.type];
  if (render) return render();
  return `<section data-section-id="${section.id}"${sectionId} style="${sectionStyle}"><div class="container text-center"><p>Unknown section: ${section.type}</p></div></section>`;
}

// ---- Button Rendering ----

function renderButtons(
  buttons: ButtonRef[] | undefined,
  actions: Action[],
  brand: Brand,
  fallbackText?: string,
  fallbackHref?: string
): string {
  // V2: render from buttons array with action references
  if (buttons && buttons.length > 0) {
    return buttons.map((btn) => {
      const action = resolveAction(btn.actionId, actions);
      const href = action ? getActionHref(action) : "#";
      const style = btn.style || "primary";
      const btnClass = style === "primary" ? "btn btn-white" :
                       style === "outline" ? "btn btn-outline" :
                       style === "ghost" ? "btn btn-ghost" :
                       "btn btn-secondary";
      return `<a href="${esc(href)}" class="${btnClass}">${esc(btn.text)}</a>`;
    }).join("\n          ");
  }

  // Legacy fallback: render from raw text/href fields
  if (fallbackText) {
    return `<a href="${esc(fallbackHref || "#")}" class="btn btn-white">${esc(fallbackText)}</a>`;
  }

  return "";
}

// ---- Individual Section Renderers ----

function renderHero(
  section: Section,
  sectionStyle: string,
  brand: Brand,
  resolveAsset: (id?: string) => Asset | undefined,
  actions: Action[]
): string {
  const c = section.content as unknown as HeroContent;
  const heroAsset = resolveAsset(c.heroImageId);
  const heroImgUrl = heroAsset?.url || (section.variant === "split-image" ? getPlaceholderUrl("hero", 600, 500) : "");
  const hasSplitImage = section.variant === "split-image" && heroImgUrl;

  const buttonsHtml = renderButtons(
    c.buttons, actions, brand,
    c.primaryCtaText, c.primaryCtaHref
  );

  const secondaryLegacy = c.secondaryCtaText && !c.buttons?.length
    ? `<a href="${esc(c.secondaryCtaHref || "#")}" class="btn btn-ghost">${esc(c.secondaryCtaText)}</a>`
    : "";

  const trustHtml = c.trustPoints?.length
    ? `<div style="margin-top: 24px; display: flex; gap: 16px; flex-wrap: wrap;${hasSplitImage ? "" : " justify-content: center;"} font-size: 14px; opacity: 0.8;">${c.trustPoints.map((t) => `<span>&#10003; ${esc(t)}</span>`).join("")}</div>`
    : "";

  if (hasSplitImage) {
    return `<section data-section-id="${section.id}" data-section-type="hero" id="hero" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="hero-split" style="display: flex; align-items: center; gap: 48px;">
      <div style="flex: 1;">
        ${c.eyebrow ? `<p style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 12px;">${esc(c.eyebrow)}</p>` : ""}
        <h1>${esc(c.heading)}</h1>
        <p style="font-size: 20px; opacity: 0.9; margin-bottom: 32px;">${esc(c.subheading)}</p>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          ${buttonsHtml}${secondaryLegacy}
        </div>
        ${trustHtml}
      </div>
      <div style="flex: 1;">
        <img src="${esc(heroImgUrl)}" alt="${esc(heroAsset?.alt || "Hero image")}" style="width: 100%; border-radius: 12px; object-fit: cover;" loading="lazy" />
      </div>
    </div>
  </div>
</section>`;
  }

  if (section.variant === "background-image" && heroImgUrl) {
    return `<section data-section-id="${section.id}" data-section-type="hero" id="hero" class="section" style="${sectionStyle} background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${esc(heroImgUrl)}'); background-size: cover; background-position: center;">
  <div class="container text-center" style="max-width: 800px;">
    ${c.eyebrow ? `<p style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 12px;">${esc(c.eyebrow)}</p>` : ""}
    <h1>${esc(c.heading)}</h1>
    <p style="font-size: 20px; opacity: 0.9; margin-bottom: 32px;">${esc(c.subheading)}</p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      ${buttonsHtml}${secondaryLegacy}
    </div>
    ${trustHtml}
  </div>
</section>`;
  }

  // Centered variant (default)
  return `<section data-section-id="${section.id}" data-section-type="hero" id="hero" class="section" style="${sectionStyle}">
  <div class="container text-center" style="max-width: 800px;">
    ${c.eyebrow ? `<p style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 12px;">${esc(c.eyebrow)}</p>` : ""}
    <h1>${esc(c.heading)}</h1>
    <p style="font-size: 20px; opacity: 0.9; margin-bottom: 32px;">${esc(c.subheading)}</p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      ${buttonsHtml}${secondaryLegacy}
    </div>
    ${trustHtml}
  </div>
</section>`;
}

function renderTrustBar(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as TrustBarContent;
  return `<section data-section-id="${section.id}" data-section-type="trust-bar" style="${sectionStyle}">
  <div class="container">
    <div style="display: flex; justify-content: center; align-items: center; gap: 32px; flex-wrap: wrap;">
      ${c.items.map((item) => {
        const iconHtml = item.iconIntent
          ? `<span style="color: ${brand.primaryColor}; display: flex; align-items: center;">${resolveIcon(item.iconIntent)}</span>`
          : item.icon
            ? `<span style="color: ${brand.primaryColor}; font-size: 20px;">${getSimpleIcon(item.icon)}</span>`
            : "";
        return `<div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px;">
        ${iconHtml}
        <span>${esc(item.text)}</span>
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderFeatures(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as FeaturesContent;
  const gridClass = section.variant === "list-with-icons" ? "" : c.items.length <= 2 ? "grid-2" : "grid-3";

  if (section.variant === "list-with-icons") {
    return `<section data-section-id="${section.id}" data-section-type="features" id="features" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 800px;">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 8px auto 0;">${esc(c.subheading)}</p>` : ""}
    </div>
    ${c.items.map((item) => {
      const iconHtml = item.iconIntent ? resolveIcon(item.iconIntent) : getSimpleIcon(item.icon);
      return `<div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 32px;">
      <div style="flex-shrink: 0; width: 48px; height: 48px; border-radius: 12px; background: ${brand.primaryColor}15; color: ${brand.primaryColor}; display: flex; align-items: center; justify-content: center;">${iconHtml}</div>
      <div>
        <h3>${esc(item.title)}</h3>
        <p style="opacity: 0.7;">${esc(item.description)}</p>
      </div>
    </div>`;
    }).join("\n    ")}
  </div>
</section>`;
  }

  return `<section data-section-id="${section.id}" data-section-type="features" id="features" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 8px auto 0;">${esc(c.subheading)}</p>` : ""}
    </div>
    <div class="${gridClass}">
      ${c.items.map((item) => {
        const iconHtml = item.iconIntent ? resolveIcon(item.iconIntent) : getSimpleIcon(item.icon);
        return `<div class="card text-center">
        <div style="width: 56px; height: 56px; border-radius: 12px; background: ${brand.primaryColor}15; color: ${brand.primaryColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">${iconHtml}</div>
        <h3>${esc(item.title)}</h3>
        <p style="opacity: 0.7;">${esc(item.description)}</p>
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderBenefits(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as BenefitsContent;
  return `<section data-section-id="${section.id}" data-section-type="benefits" id="benefits" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 8px auto 0;">${esc(c.subheading)}</p>` : ""}
    </div>
    <div class="grid-2" style="max-width: 900px; margin: 0 auto;">
      ${c.items.map((item) => {
        const iconHtml = item.iconIntent ? resolveIcon(item.iconIntent) : `&#10003;`;
        return `<div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: ${brand.primaryColor}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px;">${iconHtml}</div>
        <div>
          <h3 style="margin-bottom: 4px;">${esc(item.title)}</h3>
          <p style="opacity: 0.7;">${esc(item.description)}</p>
        </div>
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderProblemSolution(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as ProblemSolutionContent;
  return `<section data-section-id="${section.id}" data-section-type="problem-solution" id="problem-solution" class="section" style="${sectionStyle}">
  <div class="container">
    <h2 class="text-center" style="margin-bottom: 48px;">${esc(c.heading)}</h2>
    <div class="grid-2">
      <div class="card" style="border-left: 4px solid #ef4444;">
        <h3 style="color: #ef4444; margin-bottom: 12px;">${esc(c.problem.heading)}</h3>
        <p style="margin-bottom: 16px; opacity: 0.8;">${esc(c.problem.description)}</p>
        <ul style="list-style: none;">
          ${c.problem.points.map((p) => `<li style="padding: 6px 0; display: flex; gap: 8px; align-items: center;"><span style="color: #ef4444;">&#10007;</span> ${esc(p)}</li>`).join("\n          ")}
        </ul>
      </div>
      <div class="card" style="border-left: 4px solid ${brand.primaryColor};">
        <h3 style="color: ${brand.primaryColor}; margin-bottom: 12px;">${esc(c.solution.heading)}</h3>
        <p style="margin-bottom: 16px; opacity: 0.8;">${esc(c.solution.description)}</p>
        <ul style="list-style: none;">
          ${c.solution.points.map((p) => `<li style="padding: 6px 0; display: flex; gap: 8px; align-items: center;"><span style="color: ${brand.primaryColor};">&#10003;</span> ${esc(p)}</li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

function renderHowItWorks(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as HowItWorksContent;
  const headerHtml = `<div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 8px auto 0;">${esc(c.subheading)}</p>` : ""}
    </div>`;

  if (section.variant === "timeline") {
    return `<section data-section-id="${section.id}" data-section-type="how-it-works" id="how-it-works" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 700px;">
    ${headerHtml}
    ${c.steps.map((step, i) => `<div style="display: flex; gap: 24px; margin-bottom: ${i < c.steps.length - 1 ? "0" : "0"};">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: ${brand.primaryColor}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; flex-shrink: 0;">${esc(step.step)}</div>
        ${i < c.steps.length - 1 ? `<div style="width: 2px; flex: 1; background: ${brand.primaryColor}30; margin: 8px 0;"></div>` : ""}
      </div>
      <div style="padding-bottom: 40px;">
        <h3>${esc(step.title)}</h3>
        <p style="opacity: 0.7;">${esc(step.description)}</p>
      </div>
    </div>`).join("\n    ")}
  </div>
</section>`;
  }

  if (section.variant === "horizontal") {
    return `<section data-section-id="${section.id}" data-section-type="how-it-works" id="how-it-works" class="section" style="${sectionStyle}">
  <div class="container">
    ${headerHtml}
    <div style="display: flex; align-items: flex-start; gap: 16px; max-width: 1000px; margin: 0 auto;">
      ${c.steps.map((step, i) => `<div style="flex: 1; text-align: center;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: ${brand.primaryColor}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin: 0 auto 16px;">${esc(step.step)}</div>
        <h3>${esc(step.title)}</h3>
        <p style="opacity: 0.7; font-size: 15px;">${esc(step.description)}</p>
      </div>${i < c.steps.length - 1 ? `<div style="flex-shrink: 0; margin-top: 24px; font-size: 24px; color: ${brand.primaryColor}; opacity: 0.5;">&#10132;</div>` : ""}`).join("\n      ")}
    </div>
  </div>
</section>`;
  }

  // Default: numbered-steps (centered grid)
  return `<section data-section-id="${section.id}" data-section-type="how-it-works" id="how-it-works" class="section" style="${sectionStyle}">
  <div class="container">
    ${headerHtml}
    <div class="grid-3" style="max-width: 900px; margin: 0 auto;">
      ${c.steps.map((step) => `<div class="text-center">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: ${brand.primaryColor}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; margin: 0 auto 16px;">${esc(step.step)}</div>
        <h3>${esc(step.title)}</h3>
        <p style="opacity: 0.7;">${esc(step.description)}</p>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderServices(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as ServicesContent;
  const headerHtml = `<div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 8px auto 0;">${esc(c.subheading)}</p>` : ""}
    </div>`;

  if (section.variant === "list") {
    return `<section data-section-id="${section.id}" data-section-type="services" id="services" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 800px;">
    ${headerHtml}
    ${c.items.map((item) => {
      const iconHtml = item.iconIntent ? resolveIcon(item.iconIntent) : getSimpleIcon(item.icon);
      return `<div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid rgba(0,0,0,0.08);">
      <div style="flex-shrink: 0; width: 56px; height: 56px; border-radius: 12px; background: ${brand.primaryColor}15; color: ${brand.primaryColor}; display: flex; align-items: center; justify-content: center;">${iconHtml}</div>
      <div>
        <h3>${esc(item.title)}</h3>
        <p style="opacity: 0.7;">${esc(item.description)}</p>
      </div>
    </div>`;
    }).join("\n    ")}
  </div>
</section>`;
  }

  if (section.variant === "featured") {
    const featured = c.items[0];
    const rest = c.items.slice(1);
    const featuredIcon = featured?.iconIntent ? resolveIcon(featured.iconIntent) : getSimpleIcon(featured?.icon);
    return `<section data-section-id="${section.id}" data-section-type="services" id="services" class="section" style="${sectionStyle}">
  <div class="container">
    ${headerHtml}
    ${featured ? `<div class="card" style="margin-bottom: 32px; padding: 48px; border-left: 4px solid ${brand.primaryColor};">
      <div style="display: flex; gap: 24px; align-items: flex-start;">
        <div style="flex-shrink: 0; width: 64px; height: 64px; border-radius: 16px; background: ${brand.primaryColor}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px;">${featuredIcon}</div>
        <div>
          <h3 style="font-size: 28px;">${esc(featured.title)}</h3>
          <p style="opacity: 0.7; font-size: 17px;">${esc(featured.description)}</p>
        </div>
      </div>
    </div>` : ""}
    <div class="grid-${Math.min(rest.length, 3)}">
      ${rest.map((item) => {
        const iconHtml = item.iconIntent ? resolveIcon(item.iconIntent) : getSimpleIcon(item.icon);
        return `<div class="card">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: ${brand.primaryColor}15; color: ${brand.primaryColor}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">${iconHtml}</div>
        <h3>${esc(item.title)}</h3>
        <p style="opacity: 0.7;">${esc(item.description)}</p>
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
  }

  // Default: cards grid
  return `<section data-section-id="${section.id}" data-section-type="services" id="services" class="section" style="${sectionStyle}">
  <div class="container">
    ${headerHtml}
    <div class="grid-3">
      ${c.items.map((item) => {
        const iconHtml = item.iconIntent ? resolveIcon(item.iconIntent) : getSimpleIcon(item.icon);
        return `<div class="card">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: ${brand.primaryColor}15; color: ${brand.primaryColor}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">${iconHtml}</div>
        <h3>${esc(item.title)}</h3>
        <p style="opacity: 0.7;">${esc(item.description)}</p>
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderTestimonials(section: Section, sectionStyle: string): string {
  const c = section.content as unknown as TestimonialsContent;
  const headingHtml = `<h2 class="text-center" style="margin-bottom: 48px;">${esc(c.heading)}</h2>`;

  if (section.variant === "single-spotlight" && c.items.length > 0) {
    const featured = c.items[0];
    return `<section data-section-id="${section.id}" data-section-type="testimonials" id="testimonials" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 700px;">
    ${headingHtml}
    <div class="card text-center" style="padding: 48px;">
      <p style="font-size: 24px; font-style: italic; line-height: 1.6; margin-bottom: 24px;">&ldquo;${esc(featured.quote)}&rdquo;</p>
      <div style="width: 64px; height: 64px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; color: #6b7280; margin: 0 auto 12px;">${esc(featured.author.charAt(0))}</div>
      <strong style="font-size: 18px;">${esc(featured.author)}</strong>
      ${featured.role ? `<br><span style="opacity: 0.6;">${esc(featured.role)}</span>` : ""}
    </div>
  </div>
</section>`;
  }

  if (section.variant === "minimal-list") {
    return `<section data-section-id="${section.id}" data-section-type="testimonials" id="testimonials" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 800px;">
    ${headingHtml}
    ${c.items.map((item) => `<div style="border-left: 3px solid rgba(0,0,0,0.15); padding: 24px 0 24px 24px; margin-bottom: 32px;">
      <p style="font-size: 18px; font-style: italic; line-height: 1.6; margin-bottom: 12px;">&ldquo;${esc(item.quote)}&rdquo;</p>
      <div>
        <strong>${esc(item.author)}</strong>${item.role ? ` &mdash; <span style="opacity: 0.6;">${esc(item.role)}</span>` : ""}
      </div>
    </div>`).join("\n    ")}
  </div>
</section>`;
  }

  // Default: cards grid
  return `<section data-section-id="${section.id}" data-section-type="testimonials" id="testimonials" class="section" style="${sectionStyle}">
  <div class="container">
    ${headingHtml}
    <div class="grid-${Math.min(c.items.length, 3)}">
      ${c.items.map((item) => `<div class="card">
        <p style="font-style: italic; font-size: 18px; margin-bottom: 16px; line-height: 1.6;">&ldquo;${esc(item.quote)}&rdquo;</p>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; color: #6b7280;">${esc(item.author.charAt(0))}</div>
          <div>
            <strong>${esc(item.author)}</strong>
            ${item.role ? `<br><span style="opacity: 0.6; font-size: 14px;">${esc(item.role)}</span>` : ""}
          </div>
        </div>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderResults(section: Section, sectionStyle: string): string {
  const c = section.content as unknown as ResultsContent;
  return `<section data-section-id="${section.id}" data-section-type="results" id="results" class="section" style="${sectionStyle}">
  <div class="container text-center">
    <h2 style="margin-bottom: 12px;">${esc(c.heading)}</h2>
    ${c.subheading ? `<p style="font-size: 18px; opacity: 0.8; margin-bottom: 48px;">${esc(c.subheading)}</p>` : ""}
    <div class="grid-${Math.min(c.stats.length, 4)}" style="max-width: 900px; margin: 0 auto;">
      ${c.stats.map((stat) => `<div>
        <div style="font-size: 48px; font-weight: 800; line-height: 1;">${esc(stat.value)}</div>
        <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">${esc(stat.label)}</div>
      </div>`).join("\n      ")}
    </div>
    ${c.description ? `<p style="margin-top: 32px; font-size: 18px; opacity: 0.8; max-width: 600px; margin-left: auto; margin-right: auto;">${esc(c.description)}</p>` : ""}
  </div>
</section>`;
}

function renderPricing(section: Section, sectionStyle: string, brand: Brand, actions: Action[]): string {
  const c = section.content as unknown as PricingContent;
  return `<section data-section-id="${section.id}" data-section-type="pricing" id="pricing" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7;">${esc(c.subheading)}</p>` : ""}
    </div>
    <div class="grid-${Math.min(c.plans.length, 3)}" style="max-width: 900px; margin: 0 auto;">
      ${c.plans.map((plan) => {
        const btnText = plan.buttons?.[0]?.text || plan.ctaText || "Get Started";
        const btnAction = plan.buttons?.[0]?.actionId ? resolveAction(plan.buttons[0].actionId, actions) : undefined;
        const btnHref = btnAction ? getActionHref(btnAction) : "#contact";
        return `<div class="card text-center" style="${plan.highlighted ? `border: 2px solid ${brand.primaryColor}; transform: scale(1.03); position: relative;` : "border: 1px solid #e5e7eb;"}">
        ${plan.highlighted ? `<div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: ${brand.primaryColor}; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">POPULAR</div>` : ""}
        <h3>${esc(plan.name)}</h3>
        ${plan.description ? `<p style="opacity: 0.6; font-size: 14px; margin-bottom: 8px;">${esc(plan.description)}</p>` : ""}
        <div style="font-size: 48px; font-weight: 800; margin: 16px 0;">${esc(plan.price)}<span style="font-size: 16px; font-weight: 400; opacity: 0.6;">${esc(plan.period)}</span></div>
        <ul style="list-style: none; margin-bottom: 24px; text-align: left;">
          ${plan.features.map((f) => `<li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">&#10003; ${esc(f)}</li>`).join("\n          ")}
        </ul>
        <a href="${esc(btnHref)}" class="btn ${plan.highlighted ? "btn-primary" : "btn-secondary"}" style="width: 100%;">${esc(btnText)}</a>
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderFaq(section: Section, sectionStyle: string): string {
  const c = section.content as unknown as FaqContent;
  return `<section data-section-id="${section.id}" data-section-type="faq" id="faq" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 800px;">
    <h2 class="text-center" style="margin-bottom: 48px;">${esc(c.heading)}</h2>
    ${c.subheading ? `<p class="text-center" style="font-size: 18px; opacity: 0.7; margin-top: -36px; margin-bottom: 48px;">${esc(c.subheading)}</p>` : ""}
    ${c.items.map((item) => `<details style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
      <summary style="font-weight: 600; font-size: 18px; cursor: pointer; list-style: none;">${esc(item.question)}</summary>
      <p style="margin-top: 12px; opacity: 0.7; line-height: 1.7;">${esc(item.answer)}</p>
    </details>`).join("\n    ")}
  </div>
</section>`;
}

function renderCtaBand(section: Section, sectionStyle: string, actions: Action[]): string {
  const c = section.content as unknown as CtaBandContent;
  const buttonsHtml = renderButtons(
    c.buttons, actions, {} as Brand,
    c.buttonText, c.buttonHref
  );
  const secondaryLegacy = c.secondaryButtonText && !c.buttons?.length
    ? `<a href="${esc(c.secondaryButtonHref || "#")}" class="btn btn-ghost" style="padding: 16px 40px;">${esc(c.secondaryButtonText)}</a>`
    : "";

  if (section.variant === "split") {
    return `<section data-section-id="${section.id}" data-section-type="cta-band" id="cta-band" class="section" style="${sectionStyle}">
  <div class="container">
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 32px;">
      <div style="flex: 1; min-width: 280px;">
        <h2 style="margin-bottom: 8px;">${esc(c.heading)}</h2>
        ${c.subheading ? `<p style="font-size: 18px; opacity: 0.9;">${esc(c.subheading)}</p>` : ""}
      </div>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        ${buttonsHtml}${secondaryLegacy}
      </div>
    </div>
  </div>
</section>`;
  }

  if (section.variant === "card") {
    return `<section data-section-id="${section.id}" data-section-type="cta-band" id="cta-band" class="section" style="padding: 80px 0;">
  <div class="container" style="max-width: 800px;">
    <div class="card text-center" style="padding: 56px; ${sectionStyle} border-radius: 16px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.9; margin-bottom: 32px;">${esc(c.subheading)}</p>` : ""}
      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
        ${buttonsHtml}${secondaryLegacy}
      </div>
    </div>
  </div>
</section>`;
  }

  // Default: centered
  return `<section data-section-id="${section.id}" data-section-type="cta-band" id="cta-band" class="section" style="${sectionStyle}">
  <div class="container text-center" style="max-width: 700px;">
    <h2>${esc(c.heading)}</h2>
    ${c.subheading ? `<p style="font-size: 18px; opacity: 0.9; margin-bottom: 32px;">${esc(c.subheading)}</p>` : ""}
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      ${buttonsHtml}${secondaryLegacy}
    </div>
  </div>
</section>`;
}

function renderContact(section: Section, sectionStyle: string, brand: Brand, actions: Action[]): string {
  const c = section.content as unknown as ContactContent;
  const hasContactInfo = c.email || c.phone || c.address;
  const btnText = c.buttons?.[0]?.text || c.buttonText || "Send Message";

  if (section.variant === "form-with-info" && hasContactInfo) {
    return `<section data-section-id="${section.id}" data-section-type="contact" id="contact" class="section" style="${sectionStyle}">
  <div class="container">
    <h2 class="text-center" style="margin-bottom: 8px;">${esc(c.heading)}</h2>
    ${c.subheading ? `<p class="text-center" style="font-size: 18px; opacity: 0.7; margin-bottom: 48px;">${esc(c.subheading)}</p>` : ""}
    <div class="grid-2" style="max-width: 900px; margin: 0 auto;">
      <div>
        ${c.email ? `<div style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px;"><span style="font-size: 20px;">&#9993;</span><div><div style="font-weight: 600;">Email</div><div style="opacity: 0.7;">${esc(c.email)}</div></div></div>` : ""}
        ${c.phone ? `<div style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px;"><span style="font-size: 20px;">&#9742;</span><div><div style="font-weight: 600;">Phone</div><div style="opacity: 0.7;">${esc(c.phone)}</div></div></div>` : ""}
        ${c.address ? `<div style="display: flex; gap: 12px; align-items: center;"><span style="font-size: 20px;">&#9873;</span><div><div style="font-weight: 600;">Address</div><div style="opacity: 0.7;">${esc(c.address)}</div></div></div>` : ""}
      </div>
      <div>
        ${renderContactForm(c, brand, btnText)}
      </div>
    </div>
  </div>
</section>`;
  }

  return `<section data-section-id="${section.id}" data-section-type="contact" id="contact" class="section" style="${sectionStyle}">
  <div class="container" style="max-width: 600px;">
    <div class="text-center" style="margin-bottom: 32px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7;">${esc(c.subheading)}</p>` : ""}
    </div>
    ${renderContactForm(c, brand, btnText)}
  </div>
</section>`;
}

function renderContactForm(c: ContactContent, brand: Brand, btnText: string): string {
  const fields = c.fields || ["name", "email", "message"];
  return `<form style="display: flex; flex-direction: column; gap: 16px;">
    ${fields.map((field) => {
      if (field === "message") {
        return `<textarea placeholder="${esc(field.charAt(0).toUpperCase() + field.slice(1))}" rows="4" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; font-family: inherit;"></textarea>`;
      }
      return `<input type="${field === "email" ? "email" : field === "phone" ? "tel" : "text"}" placeholder="${esc(field.charAt(0).toUpperCase() + field.slice(1))}" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; font-family: inherit;">`;
    }).join("\n    ")}
    <button type="submit" class="btn btn-primary" style="width: 100%; background-color: ${brand.primaryColor};">${esc(btnText)}</button>
  </form>`;
}

function renderFooter(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as FooterContent;
  const copyrightHtml = `<p>&copy; ${esc(c.copyrightYear)} ${esc(c.companyName)}. All rights reserved.</p>`;
  const legalHtml = c.legalLinks?.length
    ? `<div style="display: flex; gap: 24px;">${c.legalLinks.map((l) => `<a href="${esc(l.href || "#")}" style="color: inherit; text-decoration: none;">${esc(l.text)}</a>`).join("")}</div>`
    : "";
  const socialHtml = c.socialLinks?.length
    ? `<div style="display: flex; gap: 12px; margin-top: 16px;">${c.socialLinks.map((sl) => `<a href="${esc(sl.url)}" style="color: inherit; opacity: 0.6; text-decoration: none; font-size: 14px;">${esc(sl.platform)}</a>`).join("\n          ")}</div>`
    : "";

  if (section.variant === "simple-centered") {
    return `<footer data-section-id="${section.id}" data-section-type="footer" style="${sectionStyle}">
  <div class="container text-center">
    <h3 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">${esc(c.companyName)}</h3>
    ${c.tagline ? `<p style="opacity: 0.6; margin-bottom: 16px;">${esc(c.tagline)}</p>` : ""}
    ${socialHtml ? `<div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 24px;">${c.socialLinks?.map((sl) => `<a href="${esc(sl.url)}" style="color: inherit; opacity: 0.6; text-decoration: none;">${esc(sl.platform)}</a>`).join(" ") || ""}</div>` : ""}
    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; font-size: 14px; opacity: 0.6;">
      ${copyrightHtml}
      ${legalHtml ? `<div style="margin-top: 12px; display: flex; gap: 24px; justify-content: center;">${c.legalLinks?.map((l) => `<a href="${esc(l.href || "#")}" style="color: inherit; text-decoration: none;">${esc(l.text)}</a>`).join("") || ""}</div>` : ""}
    </div>
  </div>
</footer>`;
  }

  if (section.variant === "minimal") {
    return `<footer data-section-id="${section.id}" data-section-type="footer" style="${sectionStyle}">
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 14px; opacity: 0.7;">
      <span style="font-weight: 600;">${esc(c.companyName)}</span>
      ${copyrightHtml}
      ${legalHtml}
    </div>
  </div>
</footer>`;
  }

  // Default: multi-column
  return `<footer data-section-id="${section.id}" data-section-type="footer" style="${sectionStyle}">
  <div class="container">
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 48px; margin-bottom: 48px;">
      <div style="min-width: 200px;">
        <h3 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">${esc(c.companyName)}</h3>
        ${c.tagline ? `<p style="opacity: 0.6; max-width: 280px;">${esc(c.tagline)}</p>` : ""}
        ${socialHtml}
      </div>
      ${c.columns.map((col) => `<div style="min-width: 140px;">
        <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 16px;">${esc(col.title)}</h4>
        <ul style="list-style: none;">
          ${col.links.map((link) => `<li style="margin-bottom: 8px;"><a href="${esc(link.href || "#")}" style="color: inherit; text-decoration: none; opacity: 0.7; transition: opacity 0.2s;">${esc(link.text)}</a></li>`).join("\n          ")}
        </ul>
      </div>`).join("\n      ")}
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 14px; opacity: 0.6;">
      ${copyrightHtml}
      ${legalHtml}
    </div>
  </div>
</footer>`;
}

// ---- V2 New Section Renderers ----

function renderGallery(section: Section, sectionStyle: string, assets: Asset[]): string {
  const c = section.content as unknown as GalleryContent;
  return `<section data-section-id="${section.id}" data-section-type="gallery" id="gallery" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7;">${esc(c.subheading)}</p>` : ""}
    </div>
    <div class="grid-3">
      ${c.images.map((img) => {
        const asset = assets.find((a) => a.id === img.imageId);
        const url = asset?.url || getPlaceholderUrl("general", 400, 300);
        const alt = img.alt || asset?.alt || "Gallery image";
        return `<div style="border-radius: 12px; overflow: hidden;">
        <img src="${esc(url)}" alt="${esc(alt)}" style="width: 100%; height: 250px; object-fit: cover;" loading="lazy" />
        ${img.caption ? `<p style="padding: 12px; font-size: 14px; opacity: 0.7;">${esc(img.caption)}</p>` : ""}
      </div>`;
      }).join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderServiceArea(section: Section, sectionStyle: string): string {
  const c = section.content as unknown as ServiceAreaContent;
  return `<section data-section-id="${section.id}" data-section-type="service-area" id="service-area" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7;">${esc(c.subheading)}</p>` : ""}
    </div>
    <div class="grid-3">
      ${c.areas.map((area) => `<div class="card">
        <h3>${esc(area.name)}</h3>
        ${area.description ? `<p style="opacity: 0.7;">${esc(area.description)}</p>` : ""}
      </div>`).join("\n      ")}
    </div>
    ${c.mapNote ? `<p class="text-center" style="margin-top: 32px; opacity: 0.6; font-size: 14px;">${esc(c.mapNote)}</p>` : ""}
  </div>
</section>`;
}

function renderAboutTeam(section: Section, sectionStyle: string, brand: Brand): string {
  const c = section.content as unknown as AboutTeamContent;
  return `<section data-section-id="${section.id}" data-section-type="about-team" id="about" class="section" style="${sectionStyle}">
  <div class="container">
    <div class="text-center" style="margin-bottom: 48px;">
      <h2>${esc(c.heading)}</h2>
      ${c.subheading ? `<p style="font-size: 18px; opacity: 0.7; max-width: 600px; margin: 8px auto 0;">${esc(c.subheading)}</p>` : ""}
    </div>
    ${c.description ? `<p style="max-width: 700px; margin: 0 auto 48px; text-align: center; font-size: 18px; opacity: 0.8;">${esc(c.description)}</p>` : ""}
    ${c.values?.length ? `<div class="grid-3">
      ${c.values.map((v) => {
        const iconHtml = v.iconIntent ? resolveIcon(v.iconIntent) : "&#9733;";
        return `<div class="card text-center">
        <div style="width: 48px; height: 48px; border-radius: 12px; background: ${brand.primaryColor}15; color: ${brand.primaryColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">${iconHtml}</div>
        <h3>${esc(v.title)}</h3>
        <p style="opacity: 0.7;">${esc(v.description)}</p>
      </div>`;
      }).join("\n      ")}
    </div>` : ""}
    ${c.members?.length ? `<div class="grid-4" style="margin-top: 48px;">
      ${c.members.map((m) => `<div class="text-center">
        <div style="width: 100px; height: 100px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 36px; font-weight: 700; color: #6b7280;">${esc(m.name.charAt(0))}</div>
        <h3 style="font-size: 18px;">${esc(m.name)}</h3>
        <p style="opacity: 0.6; font-size: 14px;">${esc(m.role)}</p>
      </div>`).join("\n      ")}
    </div>` : ""}
  </div>
</section>`;
}

// ---- Utilities ----

function esc(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStructuredData(doc: PageDocument): string | null {
  const heroSection = doc.sections.find((s) => s.type === "hero" && s.visible);
  const contactSection = doc.sections.find((s) => s.type === "contact" && s.visible);
  const faqSection = doc.sections.find((s) => s.type === "faq" && s.visible);

  const data: Record<string, unknown>[] = [];

  // Organization / LocalBusiness
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": doc.meta.pageType === "local-business" ? "LocalBusiness" : "Organization",
    name: doc.meta.title,
    description: doc.meta.description,
  };
  if (contactSection) {
    const cc = contactSection.content as Record<string, unknown>;
    if (cc.email) org.email = cc.email;
    if (cc.phone) org.telephone = cc.phone;
    if (cc.address) org.address = { "@type": "PostalAddress", streetAddress: cc.address };
  }
  data.push(org);

  // FAQ structured data
  if (faqSection) {
    const fc = faqSection.content as { items?: Array<{ question: string; answer: string }> };
    if (fc.items && fc.items.length > 0) {
      data.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: fc.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      });
    }
  }

  if (data.length === 0) return null;
  if (data.length === 1) return JSON.stringify(data[0]);
  return JSON.stringify(data);
}

function getSimpleIcon(name?: string): string {
  const icons: Record<string, string> = {
    star: "&#9733;",
    check: "&#10003;",
    zap: "&#9889;",
    shield: "&#128737;",
    users: "&#128101;",
    clock: "&#128339;",
    phone: "&#128222;",
    mail: "&#9993;",
    briefcase: "&#128188;",
    "trending-up": "&#128200;",
    heart: "&#10084;",
    target: "&#127919;",
    award: "&#127942;",
    globe: "&#127758;",
    settings: "&#9881;",
    layers: "&#9776;",
    lock: "&#128274;",
    rocket: "&#128640;",
  };
  return icons[name || "star"] || icons["star"];
}
