"use client";

import { useState } from "react";
import { useEditor, type SectionData } from "./EditorContext";
import SectionControls from "./SectionControls";
import InlineEditor from "./InlineEditor";

interface SectionWrapperProps {
  section: SectionData;
  index: number;
}

export default function SectionWrapper({ section, index }: SectionWrapperProps) {
  const { sections, isPreview, updateContent, selectedSectionId, selectSection } =
    useEditor();
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedSectionId === section.id;
  const showControls = !isPreview && (hovered || isSelected);

  const bgColor = section.style.background_color || section.style.backgroundColor || "#ffffff";
  const textColor = section.style.text_color || section.style.textColor || "#1a1a1a";
  const padding = section.style.padding || "60px 0";

  const sectionStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    padding,
    position: "relative",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const update = (path: string, value: unknown) => {
    updateContent(section.id, path, value);
  };

  const renderSection = () => {
    switch (section.type) {
      case "hero": return renderHero(section, update, isPreview);
      case "trust-bar": return renderTrustBar(section, update, isPreview);
      case "features": return renderFeatures(section, update, isPreview);
      case "benefits": return renderBenefits(section, update, isPreview);
      case "problem-solution": return renderProblemSolution(section, update, isPreview);
      case "how-it-works": return renderHowItWorks(section, update, isPreview);
      case "services": return renderServices(section, update, isPreview);
      case "testimonials": return renderTestimonials(section, update, isPreview);
      case "results": return renderResults(section, update, isPreview);
      case "pricing": return renderPricing(section, update, isPreview);
      case "faq": return renderFaq(section, update, isPreview);
      case "cta-band": return renderCtaBand(section, update, isPreview);
      case "cta": return renderCtaBand(section, update, isPreview); // legacy compat
      case "contact": return renderContact(section, update, isPreview);
      case "footer": return renderFooter(section, update, isPreview);
      case "gallery": return renderGallery(section, update, isPreview);
      case "service-area": return renderServiceArea(section, update, isPreview);
      case "about-team": return renderAboutTeam(section, update, isPreview);
      default: return <p className="text-center text-gray-400">Unknown section: {section.type}</p>;
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => selectSection(section.id)}
      className={`relative transition-all ${
        !isPreview
          ? isSelected
            ? "ring-2 ring-primary-500 ring-inset"
            : hovered
            ? "ring-1 ring-primary-300 ring-inset"
            : ""
          : ""
      }`}
    >
      {showControls && (
        <SectionControls
          sectionId={section.id}
          index={index}
          totalSections={sections.length}
          sectionType={section.type}
        />
      )}

      <section style={sectionStyle} data-section-id={section.id}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {renderSection()}
        </div>
      </section>
    </div>
  );
}

// ---- Section Renderers ----

function renderHero(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as Record<string, unknown>;
  const heading = (c.heading as string) || "";
  const subheading = (c.subheading as string) || "";
  const buttons = c.buttons as Array<{ text: string; actionId: string; style?: string }> | undefined;
  const legacyCtaText = (c.primaryCtaText || c.cta_text) as string | undefined;
  const trustPoints = c.trustPoints as string[] | undefined;
  const variant = section.variant || "centered";
  const heroImageId = c.heroImageId as string | undefined;

  // Match live renderer: only show image for split-image and background-image variants
  const showsImage = (variant === "split-image" || variant === "background-image") && heroImageId;

  // Render buttons matching live renderer logic: buttons[] first, then legacy fallback, then nothing
  const renderCtaButtons = () => {
    if (buttons && buttons.length > 0) {
      return buttons.map((btn, i) => (
        <span key={i} style={{
          display: "inline-block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600,
          backgroundColor: btn.style === "outline" ? "transparent" : btn.style === "ghost" ? "rgba(255,255,255,0.15)" : "#ffffff",
          color: btn.style === "outline" || btn.style === "ghost" ? "inherit" : (section.style.background_color || section.style.backgroundColor || "#2563eb"),
          border: btn.style === "outline" ? "2px solid rgba(255,255,255,0.3)" : "none",
        }}>{btn.text}</span>
      ));
    }
    if (legacyCtaText) {
      return [
        <span key="legacy" style={{
          display: "inline-block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600,
          backgroundColor: "#ffffff",
          color: section.style.background_color || section.style.backgroundColor || "#2563eb",
        }}>{legacyCtaText}</span>
      ];
    }
    return [];
  };

  const ctaElements = renderCtaButtons();

  const textContent = (
    <>
      {isPreview ? (
        <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}>{heading}</h1>
      ) : (
        <InlineEditor value={heading} onChange={(v) => update("heading", v)} tag="h1" style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }} />
      )}
      {isPreview ? (
        <p style={{ fontSize: "20px", opacity: 0.9, marginBottom: "32px" }}>{subheading}</p>
      ) : (
        <InlineEditor value={subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "20px", opacity: 0.9, marginBottom: "32px" }} />
      )}
      {ctaElements.length > 0 && (
        <div style={{ display: "flex", gap: "16px", justifyContent: variant === "split-image" ? "flex-start" : "center", flexWrap: "wrap" }}>
          {ctaElements}
        </div>
      )}
      {trustPoints && trustPoints.length > 0 && (
        <div style={{ marginTop: "24px", display: "flex", gap: "16px", justifyContent: variant === "split-image" ? "flex-start" : "center", flexWrap: "wrap", fontSize: "14px", opacity: 0.8 }}>
          {trustPoints.map((t, i) => (
            <span key={i}>{isPreview ? `\u2713 ${t}` : <InlineEditor value={t} onChange={(v) => update(`trustPoints.${i}`, v)} tag="span" />}</span>
          ))}
        </div>
      )}
    </>
  );

  if (variant === "split-image") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
        <div style={{ flex: 1 }}>{textContent}</div>
        <div style={{ flex: 1 }}>
          {showsImage ? (
            <div style={{ width: "100%", height: "300px", borderRadius: "12px", overflow: "hidden", background: "#f3f4f6" }}>
              <div style={{ width: "100%", height: "100%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#9ca3af" }}>Hero Image</div>
            </div>
          ) : (
            <div style={{ width: "100%", height: "300px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#9ca3af" }}>
              Assign a hero image in the Section panel
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
      {textContent}
    </div>
  );
}

function renderTrustBar(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { items: Array<{ text: string; icon?: string }> };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
      {c.items?.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "15px" }}>
          {isPreview ? (
            <span>{item.text}</span>
          ) : (
            <InlineEditor value={item.text} onChange={(v) => update(`items.${i}.text`, v)} tag="span" style={{ fontWeight: 600 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function renderFeatures(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; items: Array<{ title: string; description: string; icon: string }> };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
        {c.subheading && (
          isPreview ? (
            <p style={{ fontSize: "18px", opacity: 0.7, maxWidth: "600px", margin: "8px auto 0" }}>{c.subheading}</p>
          ) : (
            <InlineEditor value={c.subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.7, maxWidth: "600px", margin: "8px auto 0" }} />
          )
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.items?.length || 3, 3)}, 1fr)`, gap: "24px" }}>
        {c.items?.map((item, i) => (
          <div key={i} style={{ background: "#ffffff", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center", color: "#1a1a1a" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{item.icon || "\u2B50"}</div>
            {isPreview ? (
              <>
                <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ opacity: 0.7 }}>{item.description}</p>
              </>
            ) : (
              <>
                <InlineEditor value={item.title} onChange={(v) => update(`items.${i}.title`, v)} tag="h3" style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }} />
                <InlineEditor value={item.description} onChange={(v) => update(`items.${i}.description`, v)} tag="p" style={{ opacity: 0.7 }} multiline />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderBenefits(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; items: Array<{ title: string; description: string }> };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
        {c.items?.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: "40px", height: "40px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{"\u2713"}</div>
            <div>
              {isPreview ? (
                <>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }}>{item.title}</h3>
                  <p style={{ opacity: 0.7 }}>{item.description}</p>
                </>
              ) : (
                <>
                  <InlineEditor value={item.title} onChange={(v) => update(`items.${i}.title`, v)} tag="h3" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }} />
                  <InlineEditor value={item.description} onChange={(v) => update(`items.${i}.description`, v)} tag="p" style={{ opacity: 0.7 }} multiline />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderProblemSolution(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as {
    heading: string;
    problem: { heading: string; description: string; points: string[] };
    solution: { heading: string; description: string; points: string[] };
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "32px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", borderLeft: "4px solid #ef4444", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {isPreview ? (
            <h3 style={{ color: "#ef4444", fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>{c.problem?.heading}</h3>
          ) : (
            <InlineEditor value={c.problem?.heading || ""} onChange={(v) => update("problem.heading", v)} tag="h3" style={{ color: "#ef4444", fontSize: "24px", fontWeight: 600, marginBottom: "12px" }} />
          )}
          {isPreview ? (
            <p style={{ opacity: 0.8, marginBottom: "16px" }}>{c.problem?.description}</p>
          ) : (
            <InlineEditor value={c.problem?.description || ""} onChange={(v) => update("problem.description", v)} tag="p" style={{ opacity: 0.8, marginBottom: "16px" }} multiline />
          )}
          <ul style={{ listStyle: "none" }}>
            {c.problem?.points?.map((p, i) => (
              <li key={i} style={{ padding: "6px 0", display: "flex", gap: "8px", color: "#1a1a1a" }}>
                <span style={{ color: "#ef4444" }}>{"\u2717"}</span>
                {isPreview ? p : <InlineEditor value={p} onChange={(v) => update(`problem.points.${i}`, v)} tag="span" />}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", borderLeft: "4px solid #2563eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {isPreview ? (
            <h3 style={{ color: "#2563eb", fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>{c.solution?.heading}</h3>
          ) : (
            <InlineEditor value={c.solution?.heading || ""} onChange={(v) => update("solution.heading", v)} tag="h3" style={{ color: "#2563eb", fontSize: "24px", fontWeight: 600, marginBottom: "12px" }} />
          )}
          {isPreview ? (
            <p style={{ opacity: 0.8, marginBottom: "16px" }}>{c.solution?.description}</p>
          ) : (
            <InlineEditor value={c.solution?.description || ""} onChange={(v) => update("solution.description", v)} tag="p" style={{ opacity: 0.8, marginBottom: "16px" }} multiline />
          )}
          <ul style={{ listStyle: "none" }}>
            {c.solution?.points?.map((p, i) => (
              <li key={i} style={{ padding: "6px 0", display: "flex", gap: "8px", color: "#1a1a1a" }}>
                <span style={{ color: "#2563eb" }}>{"\u2713"}</span>
                {isPreview ? p : <InlineEditor value={p} onChange={(v) => update(`solution.points.${i}`, v)} tag="span" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function renderHowItWorks(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; steps: Array<{ step: string; title: string; description: string }> };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.steps?.length || 3, 3)}, 1fr)`, gap: "32px", maxWidth: "900px", margin: "0 auto" }}>
        {c.steps?.map((step, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, margin: "0 auto 16px" }}>{step.step}</div>
            {isPreview ? (
              <>
                <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ opacity: 0.7 }}>{step.description}</p>
              </>
            ) : (
              <>
                <InlineEditor value={step.title} onChange={(v) => update(`steps.${i}.title`, v)} tag="h3" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }} />
                <InlineEditor value={step.description} onChange={(v) => update(`steps.${i}.description`, v)} tag="p" style={{ opacity: 0.7 }} multiline />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderServices(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  // Reuse features renderer since structure is similar
  return renderFeatures(section, update, isPreview);
}

function renderTestimonials(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; items: Array<{ quote: string; author: string; role: string }> };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.items?.length || 2, 3)}, 1fr)`, gap: "24px" }}>
        {c.items?.map((item, i) => (
          <div key={i} style={{ background: "#ffffff", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", color: "#1a1a1a" }}>
            {isPreview ? (
              <p style={{ fontStyle: "italic", fontSize: "18px", marginBottom: "16px" }}>&ldquo;{item.quote}&rdquo;</p>
            ) : (
              <InlineEditor value={item.quote} onChange={(v) => update(`items.${i}.quote`, v)} tag="p" style={{ fontStyle: "italic", fontSize: "18px", marginBottom: "16px" }} multiline />
            )}
            <div>
              {isPreview ? (
                <strong>{item.author}</strong>
              ) : (
                <InlineEditor value={item.author} onChange={(v) => update(`items.${i}.author`, v)} tag="span" style={{ fontWeight: 700 }} />
              )}
              {item.role && (
                <div style={{ opacity: 0.6, fontSize: "14px" }}>
                  {isPreview ? item.role : (
                    <InlineEditor value={item.role} onChange={(v) => update(`items.${i}.role`, v)} tag="span" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderResults(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; stats: Array<{ value: string; label: string }> };
  return (
    <div style={{ textAlign: "center" }}>
      {isPreview ? (
        <h2 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "12px" }}>{c.heading}</h2>
      ) : (
        <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700, marginBottom: "12px" }} />
      )}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.stats?.length || 3, 4)}, 1fr)`, gap: "32px", maxWidth: "900px", margin: "32px auto 0" }}>
        {c.stats?.map((stat, i) => (
          <div key={i}>
            {isPreview ? (
              <div style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
            ) : (
              <InlineEditor value={stat.value} onChange={(v) => update(`stats.${i}.value`, v)} tag="div" style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1 }} />
            )}
            {isPreview ? (
              <div style={{ fontSize: "16px", opacity: 0.8, marginTop: "8px" }}>{stat.label}</div>
            ) : (
              <InlineEditor value={stat.label} onChange={(v) => update(`stats.${i}.label`, v)} tag="div" style={{ fontSize: "16px", opacity: 0.8, marginTop: "8px" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderPricing(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; plans: Array<{ name: string; price: string; period: string; features: string[]; ctaText?: string; cta_text?: string; highlighted: boolean }> };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.plans?.length || 2, 3)}, 1fr)`, gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
        {c.plans?.map((plan, i) => (
          <div key={i} style={{ background: "#ffffff", borderRadius: "12px", padding: "32px", textAlign: "center", border: plan.highlighted ? "2px solid #2563eb" : "1px solid #e5e7eb", color: "#1a1a1a" }}>
            {isPreview ? (
              <h3 style={{ fontSize: "24px", fontWeight: 600 }}>{plan.name}</h3>
            ) : (
              <InlineEditor value={plan.name} onChange={(v) => update(`plans.${i}.name`, v)} tag="h3" style={{ fontSize: "24px", fontWeight: 600 }} />
            )}
            <div style={{ fontSize: "48px", fontWeight: 800, margin: "16px 0" }}>
              {isPreview ? plan.price : (
                <InlineEditor value={plan.price} onChange={(v) => update(`plans.${i}.price`, v)} tag="span" style={{ fontSize: "48px", fontWeight: 800 }} />
              )}
              <span style={{ fontSize: "16px", fontWeight: 400, opacity: 0.6 }}>{plan.period}</span>
            </div>
            <ul style={{ listStyle: "none", marginBottom: "24px", textAlign: "left" }}>
              {plan.features.map((f, fi) => (
                <li key={fi} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  {"\u2713"} {isPreview ? f : (
                    <InlineEditor value={f} onChange={(v) => update(`plans.${i}.features.${fi}`, v)} tag="span" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFaq(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; items: Array<{ question: string; answer: string }> };
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
      </div>
      {c.items?.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid #e5e7eb", padding: "20px 0" }}>
          {isPreview ? (
            <>
              <div style={{ fontWeight: 600, fontSize: "18px" }}>{item.question}</div>
              <p style={{ marginTop: "12px", opacity: 0.7 }}>{item.answer}</p>
            </>
          ) : (
            <>
              <InlineEditor value={item.question} onChange={(v) => update(`items.${i}.question`, v)} tag="h3" style={{ fontWeight: 600, fontSize: "18px" }} />
              <InlineEditor value={item.answer} onChange={(v) => update(`items.${i}.answer`, v)} tag="p" style={{ marginTop: "12px", opacity: 0.7 }} multiline />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function renderCtaBand(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as Record<string, unknown>;
  const heading = (c.heading as string) || "";
  const subheading = (c.subheading as string) || "";
  const buttons = c.buttons as Array<{ text: string; actionId: string; style?: string }> | undefined;
  const legacyButtonText = (c.buttonText || c.button_text) as string | undefined;

  // Match live renderer: buttons[] first, then legacy fallback, then nothing
  const renderCtaButtons = () => {
    if (buttons && buttons.length > 0) {
      return buttons.map((btn, i) => (
        <span key={i} style={{
          display: "inline-block", padding: "16px 40px", borderRadius: "8px", fontWeight: 700,
          background: btn.style === "outline" ? "transparent" : btn.style === "ghost" ? "rgba(255,255,255,0.15)" : "#ffffff",
          color: btn.style === "outline" || btn.style === "ghost" ? "inherit" : (section.style.background_color || section.style.backgroundColor),
          border: btn.style === "outline" ? "2px solid rgba(255,255,255,0.3)" : "none",
        }}>{btn.text}</span>
      ));
    }
    if (legacyButtonText) {
      return [
        <span key="legacy" style={{
          display: "inline-block", padding: "16px 40px", background: "#ffffff",
          color: section.style.background_color || section.style.backgroundColor,
          borderRadius: "8px", fontWeight: 700,
        }}>{legacyButtonText}</span>
      ];
    }
    return [];
  };

  const ctaElements = renderCtaButtons();

  return (
    <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
      {isPreview ? (
        <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{heading}</h2>
      ) : (
        <InlineEditor value={heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
      )}
      {subheading && (
        isPreview ? (
          <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px" }}>{subheading}</p>
        ) : (
          <InlineEditor value={subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px" }} />
        )
      )}
      {ctaElements.length > 0 && (
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          {ctaElements}
        </div>
      )}
    </div>
  );
}

function renderContact(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as Record<string, unknown>;
  const heading = (c.heading as string) || "";
  const subheading = (c.subheading as string) || "";
  const buttonText = (c.buttonText || c.button_text) as string || "Send Message";
  const fields = (c.fields as string[]) || ["name", "email", "message"];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{heading}</h2>
        ) : (
          <InlineEditor value={heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
        {subheading && (
          isPreview ? (
            <p style={{ fontSize: "18px", opacity: 0.7 }}>{subheading}</p>
          ) : (
            <InlineEditor value={subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.7 }} />
          )
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {fields.map((field) => (
          field === "message" ? (
            <textarea key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} rows={4} disabled style={{ width: "100%", padding: "12px 16px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "16px" }} />
          ) : (
            <input key={field} type="text" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} disabled style={{ width: "100%", padding: "12px 16px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "16px" }} />
          )
        ))}
        {isPreview ? (
          <span style={{ display: "block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, backgroundColor: "#2563eb", color: "#ffffff", textAlign: "center" }}>{buttonText}</span>
        ) : (
          <InlineEditor value={buttonText} onChange={(v) => update(c.buttonText !== undefined ? "buttonText" : "button_text", v)} tag="span" style={{ display: "block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, backgroundColor: "#2563eb", color: "#ffffff", textAlign: "center" }} />
        )}
      </div>
    </div>
  );
}

function renderFooter(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as {
    companyName: string;
    tagline?: string;
    columns?: Array<{ title: string; links: Array<{ text: string; href: string }> }>;
    copyrightYear?: string;
    legalLinks?: Array<{ text: string; href: string }>;
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "48px", marginBottom: "48px" }}>
        <div style={{ minWidth: "200px" }}>
          {isPreview ? (
            <h3 style={{ color: "#ffffff", fontSize: "22px", marginBottom: "8px" }}>{c.companyName}</h3>
          ) : (
            <InlineEditor value={c.companyName || ""} onChange={(v) => update("companyName", v)} tag="h3" style={{ color: "#ffffff", fontSize: "22px", marginBottom: "8px" }} />
          )}
          {c.tagline && (
            isPreview ? (
              <p style={{ opacity: 0.6, maxWidth: "280px" }}>{c.tagline}</p>
            ) : (
              <InlineEditor value={c.tagline} onChange={(v) => update("tagline", v)} tag="p" style={{ opacity: 0.6, maxWidth: "280px" }} />
            )
          )}
        </div>
        {c.columns?.map((col, ci) => (
          <div key={ci} style={{ minWidth: "140px" }}>
            {isPreview ? (
              <h4 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>{col.title}</h4>
            ) : (
              <InlineEditor value={col.title} onChange={(v) => update(`columns.${ci}.title`, v)} tag="h4" style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, marginBottom: "16px" }} />
            )}
            <ul style={{ listStyle: "none" }}>
              {col.links.map((link, li) => (
                <li key={li} style={{ marginBottom: "8px", opacity: 0.7 }}>
                  {isPreview ? link.text : (
                    <InlineEditor value={link.text} onChange={(v) => update(`columns.${ci}.links.${li}.text`, v)} tag="span" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", fontSize: "14px", opacity: 0.6 }}>
        <p>&copy; {c.copyrightYear || new Date().getFullYear()} {c.companyName}. All rights reserved.</p>
      </div>
    </div>
  );
}

function renderGallery(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; images?: Array<{ imageId?: string; caption?: string; alt?: string }> };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading || ""} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
        {c.subheading && (
          isPreview ? (
            <p style={{ fontSize: "18px", opacity: 0.7, maxWidth: "600px", margin: "8px auto 0" }}>{c.subheading}</p>
          ) : (
            <InlineEditor value={c.subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.7, maxWidth: "600px", margin: "8px auto 0" }} />
          )
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.images?.length || 3, 3)}, 1fr)`, gap: "16px" }}>
        {c.images?.map((img, i) => (
          <div key={i} style={{ borderRadius: "12px", overflow: "hidden", background: "#f3f4f6", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {img.imageId ? (
              <div style={{ width: "100%", height: "100%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#9ca3af" }}>Image</div>
            ) : (
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>No image assigned</div>
            )}
            {img.caption && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "#fff", padding: "8px", fontSize: "13px" }}>
                {isPreview ? img.caption : (
                  <InlineEditor value={img.caption} onChange={(v) => update(`images.${i}.caption`, v)} tag="span" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderServiceArea(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; areas?: Array<{ name: string; description?: string }>; mapNote?: string };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading || ""} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
        {c.subheading && (
          isPreview ? (
            <p style={{ fontSize: "18px", opacity: 0.7 }}>{c.subheading}</p>
          ) : (
            <InlineEditor value={c.subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.7 }} />
          )
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.areas?.length || 3, 3)}, 1fr)`, gap: "20px", maxWidth: "900px", margin: "0 auto" }}>
        {c.areas?.map((area, i) => (
          <div key={i} style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", color: "#1a1a1a" }}>
            {isPreview ? (
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>{area.name}</h3>
            ) : (
              <InlineEditor value={area.name} onChange={(v) => update(`areas.${i}.name`, v)} tag="h3" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }} />
            )}
            {area.description && (
              isPreview ? (
                <p style={{ opacity: 0.7 }}>{area.description}</p>
              ) : (
                <InlineEditor value={area.description} onChange={(v) => update(`areas.${i}.description`, v)} tag="p" style={{ opacity: 0.7 }} multiline />
              )
            )}
          </div>
        ))}
      </div>
      {c.mapNote && (
        <div style={{ textAlign: "center", marginTop: "24px", opacity: 0.6, fontStyle: "italic" }}>
          {isPreview ? c.mapNote : (
            <InlineEditor value={c.mapNote} onChange={(v) => update("mapNote", v)} tag="p" />
          )}
        </div>
      )}
    </div>
  );
}

function renderAboutTeam(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as {
    heading: string;
    subheading?: string;
    description?: string;
    members?: Array<{ name: string; role: string; bio?: string; imageId?: string }>;
    values?: Array<{ title: string; description: string }>;
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading || ""} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
        {c.subheading && (
          isPreview ? (
            <p style={{ fontSize: "18px", opacity: 0.7 }}>{c.subheading}</p>
          ) : (
            <InlineEditor value={c.subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.7 }} />
          )
        )}
      </div>
      {c.description && (
        <div style={{ maxWidth: "700px", margin: "0 auto 48px", textAlign: "center" }}>
          {isPreview ? (
            <p style={{ fontSize: "16px", opacity: 0.8, lineHeight: 1.7 }}>{c.description}</p>
          ) : (
            <InlineEditor value={c.description} onChange={(v) => update("description", v)} tag="p" style={{ fontSize: "16px", opacity: 0.8, lineHeight: 1.7 }} multiline />
          )}
        </div>
      )}
      {c.members && c.members.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.members.length, 3)}, 1fr)`, gap: "32px", marginBottom: "48px" }}>
          {c.members.map((member, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#e5e7eb", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#9ca3af" }}>
                {member.imageId ? "Photo" : "No photo"}
              </div>
              {isPreview ? (
                <>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }}>{member.name}</h3>
                  <p style={{ opacity: 0.6, fontSize: "14px", marginBottom: "8px" }}>{member.role}</p>
                  {member.bio && <p style={{ opacity: 0.7, fontSize: "14px" }}>{member.bio}</p>}
                </>
              ) : (
                <>
                  <InlineEditor value={member.name} onChange={(v) => update(`members.${i}.name`, v)} tag="h3" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }} />
                  <InlineEditor value={member.role} onChange={(v) => update(`members.${i}.role`, v)} tag="p" style={{ opacity: 0.6, fontSize: "14px", marginBottom: "8px" }} />
                  {member.bio && <InlineEditor value={member.bio} onChange={(v) => update(`members.${i}.bio`, v)} tag="p" style={{ opacity: 0.7, fontSize: "14px" }} multiline />}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {c.values && c.values.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.values.length, 3)}, 1fr)`, gap: "24px" }}>
          {c.values.map((val, i) => (
            <div key={i} style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center", color: "#1a1a1a" }}>
              {isPreview ? (
                <>
                  <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>{val.title}</h4>
                  <p style={{ opacity: 0.7 }}>{val.description}</p>
                </>
              ) : (
                <>
                  <InlineEditor value={val.title} onChange={(v) => update(`values.${i}.title`, v)} tag="h4" style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }} />
                  <InlineEditor value={val.description} onChange={(v) => update(`values.${i}.description`, v)} tag="p" style={{ opacity: 0.7 }} multiline />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
