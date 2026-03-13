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

  const bgColor = section.style.background_color || "#ffffff";
  const textColor = section.style.text_color || "#1a1a1a";
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
          {section.type === "hero" && renderHero(section, update, isPreview)}
          {section.type === "features" && renderFeatures(section, update, isPreview)}
          {section.type === "testimonials" && renderTestimonials(section, update, isPreview)}
          {section.type === "pricing" && renderPricing(section, update, isPreview)}
          {section.type === "faq" && renderFaq(section, update, isPreview)}
          {section.type === "cta" && renderCta(section, update, isPreview)}
          {section.type === "contact" && renderContact(section, update, isPreview)}
        </div>
      </section>
    </div>
  );
}

function renderHero(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as Record<string, string>;
  return (
    <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
      {isPreview ? (
        <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}>
          {c.heading}
        </h1>
      ) : (
        <InlineEditor
          value={c.heading as string}
          onChange={(v) => update("heading", v)}
          tag="h1"
          style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}
        />
      )}
      {isPreview ? (
        <p style={{ fontSize: "20px", opacity: 0.9, marginBottom: "32px" }}>{c.subheading}</p>
      ) : (
        <InlineEditor
          value={c.subheading as string}
          onChange={(v) => update("subheading", v)}
          tag="p"
          style={{ fontSize: "20px", opacity: 0.9, marginBottom: "32px" }}
        />
      )}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        {isPreview ? (
          <span style={{ display: "inline-block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, backgroundColor: "#ffffff", color: section.style.background_color || "#2563eb" }}>
            {c.cta_text}
          </span>
        ) : (
          <InlineEditor
            value={c.cta_text as string}
            onChange={(v) => update("cta_text", v)}
            tag="span"
            style={{ display: "inline-block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, backgroundColor: "#ffffff", color: section.style.background_color || "#2563eb" }}
          />
        )}
      </div>
    </div>
  );
}

function renderFeatures(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading: string; items: Array<{ title: string; description: string; icon: string }> };
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
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{item.icon || "⭐"}</div>
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

function renderPricing(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; plans: Array<{ name: string; price: string; period: string; features: string[]; cta_text: string; highlighted: boolean }> };
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
                  ✓ {isPreview ? f : (
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

function renderCta(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; button_text: string };
  return (
    <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
      {isPreview ? (
        <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
      ) : (
        <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
      )}
      {c.subheading && (
        isPreview ? (
          <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px" }}>{c.subheading}</p>
        ) : (
          <InlineEditor value={c.subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px" }} />
        )
      )}
      {isPreview ? (
        <span style={{ display: "inline-block", padding: "16px 40px", background: "#ffffff", color: section.style.background_color, borderRadius: "8px", fontWeight: 700 }}>{c.button_text}</span>
      ) : (
        <InlineEditor value={c.button_text} onChange={(v) => update("button_text", v)} tag="span" style={{ display: "inline-block", padding: "16px 40px", background: "#ffffff", color: section.style.background_color, borderRadius: "8px", fontWeight: 700 }} />
      )}
    </div>
  );
}

function renderContact(
  section: SectionData,
  update: (path: string, value: unknown) => void,
  isPreview: boolean
) {
  const c = section.content as { heading: string; subheading?: string; button_text: string; fields?: string[] };
  const fields = c.fields || ["name", "email", "message"];
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {isPreview ? (
          <h2 style={{ fontSize: "36px", fontWeight: 700 }}>{c.heading}</h2>
        ) : (
          <InlineEditor value={c.heading} onChange={(v) => update("heading", v)} tag="h2" style={{ fontSize: "36px", fontWeight: 700 }} />
        )}
        {c.subheading && (
          isPreview ? (
            <p style={{ fontSize: "18px", opacity: 0.7 }}>{c.subheading}</p>
          ) : (
            <InlineEditor value={c.subheading} onChange={(v) => update("subheading", v)} tag="p" style={{ fontSize: "18px", opacity: 0.7 }} />
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
          <span style={{ display: "block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, backgroundColor: "#2563eb", color: "#ffffff", textAlign: "center" }}>{c.button_text}</span>
        ) : (
          <InlineEditor value={c.button_text} onChange={(v) => update("button_text", v)} tag="span" style={{ display: "block", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, backgroundColor: "#2563eb", color: "#ffffff", textAlign: "center" }} />
        )}
      </div>
    </div>
  );
}
