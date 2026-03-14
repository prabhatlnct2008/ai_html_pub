"use client";

import { useState } from "react";
import { useEditor, type SectionData } from "./EditorContext";
import { SECTION_VARIANTS } from "@/lib/page/section-library";
import type { SectionType, Action, ButtonRef } from "@/lib/page/schema";

export default function SectionInspector() {
  const { getSelectedSection, activePanel, setActivePanel, selectedSectionId } = useEditor();
  const section = getSelectedSection();

  const tabs: { id: typeof activePanel; label: string }[] = [
    { id: "section", label: "Section" },
    { id: "actions", label: "Actions" },
    { id: "theme", label: "Theme" },
    { id: "settings", label: "Page" },
  ];

  return (
    <div className="flex h-full flex-col border-l bg-white">
      {/* Tab bar */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 px-2 py-2 text-xs font-medium transition ${
              activePanel === tab.id
                ? "border-b-2 border-primary-500 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {activePanel === "section" && (
          section ? (
            <SectionPanel section={section} />
          ) : (
            <EmptyState message="Select a section to inspect its properties" />
          )
        )}
        {activePanel === "actions" && <ActionsPanel />}
        {activePanel === "theme" && <ThemePanel />}
        {activePanel === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <p className="text-center text-xs text-gray-400">{message}</p>
    </div>
  );
}

// ---- Section Panel ----

function SectionPanel({ section }: { section: SectionData }) {
  const { updateContent, updateStyle, updateVariant } = useEditor();
  const variants = SECTION_VARIANTS[section.type as SectionType] || [];

  return (
    <div className="space-y-4 p-3">
      {/* Section type & variant */}
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Type
        </label>
        <p className="text-sm font-medium capitalize text-gray-700">
          {section.type.replace(/-/g, " ")}
        </p>
      </div>

      {variants.length > 1 && (
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Variant
          </label>
          <select
            value={section.variant || "default"}
            onChange={(e) => updateVariant(section.id, e.target.value)}
            className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
          >
            {variants.map((v) => (
              <option key={v} value={v}>
                {v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Style controls */}
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={section.style.background_color || section.style.backgroundColor || "#ffffff"}
            onChange={(e) => updateStyle(section.id, "backgroundColor", e.target.value)}
            className="h-7 w-7 cursor-pointer rounded border"
          />
          <input
            type="text"
            value={section.style.background_color || section.style.backgroundColor || "#ffffff"}
            onChange={(e) => updateStyle(section.id, "backgroundColor", e.target.value)}
            className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Text Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={section.style.text_color || section.style.textColor || "#1a1a1a"}
            onChange={(e) => updateStyle(section.id, "textColor", e.target.value)}
            className="h-7 w-7 cursor-pointer rounded border"
          />
          <input
            type="text"
            value={section.style.text_color || section.style.textColor || "#1a1a1a"}
            onChange={(e) => updateStyle(section.id, "textColor", e.target.value)}
            className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Padding
        </label>
        <input
          type="text"
          value={section.style.padding || "80px 0"}
          onChange={(e) => updateStyle(section.id, "padding", e.target.value)}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
          placeholder="e.g. 80px 0"
        />
      </div>

      {/* Content fields */}
      <ContentFields section={section} />

      {/* Buttons editor */}
      <ButtonsEditor section={section} />
    </div>
  );
}

function ContentFields({ section }: { section: SectionData }) {
  const { updateContent } = useEditor();
  const content = section.content;

  // Extract simple text fields
  const textFields: { key: string; label: string; multiline?: boolean }[] = [];
  if (typeof content.heading === "string") textFields.push({ key: "heading", label: "Heading" });
  if (typeof content.subheading === "string") textFields.push({ key: "subheading", label: "Subheading", multiline: true });
  if (typeof content.companyName === "string") textFields.push({ key: "companyName", label: "Company Name" });
  if (typeof content.tagline === "string") textFields.push({ key: "tagline", label: "Tagline" });
  if (typeof content.description === "string") textFields.push({ key: "description", label: "Description", multiline: true });
  if (typeof content.email === "string") textFields.push({ key: "email", label: "Email" });
  if (typeof content.phone === "string") textFields.push({ key: "phone", label: "Phone" });
  if (typeof content.address === "string") textFields.push({ key: "address", label: "Address" });

  if (textFields.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Content</p>
      {textFields.map((field) => (
        <div key={field.key}>
          <label className="mb-0.5 block text-[10px] text-gray-500">{field.label}</label>
          {field.multiline ? (
            <textarea
              value={(content[field.key] as string) || ""}
              onChange={(e) => updateContent(section.id, field.key, e.target.value)}
              className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={(content[field.key] as string) || ""}
              onChange={(e) => updateContent(section.id, field.key, e.target.value)}
              className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
            />
          )}
        </div>
      ))}

      {/* Items / repeatable list editor */}
      <RepeatableItemsEditor section={section} />
    </div>
  );
}

function RepeatableItemsEditor({ section }: { section: SectionData }) {
  const { updateContent } = useEditor();
  const content = section.content;
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Determine which array field to edit
  let items: Array<Record<string, unknown>> | null = null;
  let itemsKey = "";

  if (Array.isArray(content.items)) { items = content.items as Array<Record<string, unknown>>; itemsKey = "items"; }
  else if (Array.isArray(content.steps)) { items = content.steps as Array<Record<string, unknown>>; itemsKey = "steps"; }
  else if (Array.isArray(content.stats)) { items = content.stats as Array<Record<string, unknown>>; itemsKey = "stats"; }
  else if (Array.isArray(content.plans)) { items = content.plans as Array<Record<string, unknown>>; itemsKey = "plans"; }
  else if (Array.isArray(content.members)) { items = content.members as Array<Record<string, unknown>>; itemsKey = "members"; }

  if (!items || items.length === 0) return null;

  // Get editable field names from first item
  const sampleItem = items[0];
  const editableFields = Object.keys(sampleItem).filter(
    (k) => typeof sampleItem[k] === "string" || typeof sampleItem[k] === "number"
  );

  const addItem = () => {
    const newItem: Record<string, unknown> = {};
    for (const key of editableFields) {
      newItem[key] = typeof sampleItem[key] === "number" ? 0 : "";
    }
    updateContent(section.id, itemsKey, [...items!, newItem]);
    setExpandedItem(items!.length);
  };

  const removeItem = (index: number) => {
    const newItems = items!.filter((_, i) => i !== index);
    updateContent(section.id, itemsKey, newItems);
    setExpandedItem(null);
  };

  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {itemsKey.charAt(0).toUpperCase() + itemsKey.slice(1)} ({items.length})
        </p>
        <button
          onClick={addItem}
          className="rounded p-0.5 text-gray-400 hover:text-primary-600"
          title="Add item"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="space-y-1">
        {items.map((item, i) => {
          const title = (item.title || item.name || item.question || item.text || item.value || `Item ${i + 1}`) as string;
          const isExpanded = expandedItem === i;

          return (
            <div key={i} className="rounded border border-gray-100">
              <button
                onClick={() => setExpandedItem(isExpanded ? null : i)}
                className="flex w-full items-center justify-between px-2 py-1.5 text-left text-xs"
              >
                <span className="truncate font-medium text-gray-600">{title}</span>
                <svg className={`h-3 w-3 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="space-y-2 border-t bg-gray-50 px-2 py-2">
                  {editableFields.map((field) => (
                    <div key={field}>
                      <label className="mb-0.5 block text-[10px] text-gray-500">
                        {field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      </label>
                      {String(item[field] || "").length > 50 ? (
                        <textarea
                          value={String(item[field] || "")}
                          onChange={(e) => updateContent(section.id, `${itemsKey}.${i}.${field}`, e.target.value)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                          rows={2}
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(item[field] || "")}
                          onChange={(e) => updateContent(section.id, `${itemsKey}.${i}.${field}`, e.target.value)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => removeItem(i)}
                    className="mt-1 text-[10px] text-red-500 hover:text-red-700"
                  >
                    Remove item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ButtonsEditor({ section }: { section: SectionData }) {
  const { updateContent, actions, addAction, updateAction } = useEditor();
  const buttons = section.content.buttons as ButtonRef[] | undefined;

  if (!buttons || buttons.length === 0) {
    // Check for legacy button fields
    const hasLegacy = section.content.primaryCtaText || section.content.buttonText || section.content.cta_text;
    if (!hasLegacy) return null;

    return (
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Buttons</p>
        <div className="rounded border border-gray-100 p-2">
          <label className="mb-0.5 block text-[10px] text-gray-500">Button Text</label>
          <input
            type="text"
            value={(section.content.primaryCtaText || section.content.buttonText || section.content.cta_text || "") as string}
            onChange={(e) => {
              const key = section.content.primaryCtaText !== undefined ? "primaryCtaText" :
                section.content.buttonText !== undefined ? "buttonText" : "cta_text";
              updateContent(section.id, key, e.target.value);
            }}
            className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
          />
        </div>
      </div>
    );
  }

  const addButton = () => {
    const actionId = `action_${section.type}_${Math.random().toString(36).substring(2, 6)}`;
    const newAction: Action = {
      id: actionId,
      label: "New Button",
      type: "scroll",
      value: "#contact",
      style: "primary",
    };
    addAction(newAction);
    const newButtons = [...buttons, { text: "New Button", actionId, style: "primary" as const }];
    updateContent(section.id, "buttons", newButtons);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Buttons</p>
        <button onClick={addButton} className="rounded p-0.5 text-gray-400 hover:text-primary-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      {buttons.map((btn, i) => {
        const action = actions.find((a) => a.id === btn.actionId);
        return (
          <div key={i} className="rounded border border-gray-100 p-2 space-y-1.5">
            <div>
              <label className="mb-0.5 block text-[10px] text-gray-500">Text</label>
              <input
                type="text"
                value={btn.text}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[i] = { ...newButtons[i], text: e.target.value };
                  updateContent(section.id, "buttons", newButtons);
                }}
                className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] text-gray-500">Style</label>
              <select
                value={btn.style || "primary"}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[i] = { ...newButtons[i], style: e.target.value as ButtonRef["style"] };
                  updateContent(section.id, "buttons", newButtons);
                }}
                className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            {action && (
              <>
                <div>
                  <label className="mb-0.5 block text-[10px] text-gray-500">Action Type</label>
                  <select
                    value={action.type}
                    onChange={(e) => updateAction(action.id, { type: e.target.value as Action["type"] })}
                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                  >
                    <option value="url">URL</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="scroll">Scroll to</option>
                    <option value="form">Form</option>
                  </select>
                </div>
                <div>
                  <label className="mb-0.5 block text-[10px] text-gray-500">Value</label>
                  <input
                    type="text"
                    value={action.value}
                    onChange={(e) => updateAction(action.id, { value: e.target.value })}
                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                    placeholder={action.type === "phone" ? "(555) 123-4567" : action.type === "email" ? "email@example.com" : action.type === "scroll" ? "#section-id" : "https://..."}
                  />
                </div>
              </>
            )}
            <button
              onClick={() => {
                const newButtons = buttons.filter((_, idx) => idx !== i);
                updateContent(section.id, "buttons", newButtons);
              }}
              className="text-[10px] text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---- Actions Panel ----

function ActionsPanel() {
  const { actions, addAction, updateAction, deleteAction } = useEditor();

  const handleAdd = () => {
    const id = `action_${Math.random().toString(36).substring(2, 8)}`;
    addAction({
      id,
      label: "New Action",
      type: "url",
      value: "#",
      style: "primary",
    });
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">Page Actions ({actions.length})</p>
        <button onClick={handleAdd} className="rounded bg-primary-50 px-2 py-1 text-[10px] font-medium text-primary-700 hover:bg-primary-100">
          Add Action
        </button>
      </div>
      {actions.length === 0 && (
        <p className="py-4 text-center text-xs text-gray-400">No actions defined. Buttons reference actions by ID.</p>
      )}
      {actions.map((action) => (
        <div key={action.id} className="rounded border border-gray-100 p-2 space-y-1.5">
          <div>
            <label className="mb-0.5 block text-[10px] text-gray-500">Label</label>
            <input
              type="text"
              value={action.label}
              onChange={(e) => updateAction(action.id, { label: e.target.value })}
              className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="mb-0.5 block text-[10px] text-gray-500">Type</label>
              <select
                value={action.type}
                onChange={(e) => updateAction(action.id, { type: e.target.value as Action["type"] })}
                className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
              >
                <option value="url">URL</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="scroll">Scroll to</option>
                <option value="form">Form</option>
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] text-gray-500">Style</label>
              <select
                value={action.style || "primary"}
                onChange={(e) => updateAction(action.id, { style: e.target.value as Action["style"] })}
                className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] text-gray-500">Value</label>
            <input
              type="text"
              value={action.value}
              onChange={(e) => updateAction(action.id, { value: e.target.value })}
              className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400 font-mono">{action.id}</span>
            <button
              onClick={() => { if (confirm("Delete this action?")) deleteAction(action.id); }}
              className="text-[10px] text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Theme Panel ----

function ThemePanel() {
  const { brand, updateBrand } = useEditor();

  return (
    <div className="p-3 space-y-4">
      <p className="text-xs font-semibold text-gray-700">Brand & Theme</p>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Tone</label>
        <select
          value={brand.tone}
          onChange={(e) => updateBrand({ tone: e.target.value })}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="bold">Bold</option>
          <option value="elegant">Elegant</option>
          <option value="playful">Playful</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      {(["primaryColor", "secondaryColor", "accentColor"] as const).map((colorKey) => (
        <div key={colorKey}>
          <label className="mb-0.5 block text-[10px] text-gray-500">
            {colorKey.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brand[colorKey]}
              onChange={(e) => updateBrand({ [colorKey]: e.target.value })}
              className="h-7 w-7 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={brand[colorKey]}
              onChange={(e) => updateBrand({ [colorKey]: e.target.value })}
              className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs font-mono"
            />
          </div>
        </div>
      ))}

      {(["fontHeading", "fontBody"] as const).map((fontKey) => (
        <div key={fontKey}>
          <label className="mb-0.5 block text-[10px] text-gray-500">
            {fontKey === "fontHeading" ? "Heading Font" : "Body Font"}
          </label>
          <select
            value={brand[fontKey]}
            onChange={(e) => updateBrand({ [fontKey]: e.target.value })}
            className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
          >
            {["Inter", "Poppins", "Montserrat", "Playfair Display", "Roboto", "Open Sans", "Lato", "Raleway", "Merriweather", "Source Sans Pro"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// ---- Settings Panel ----

function SettingsPanel() {
  const { meta, updateMeta } = useEditor();

  return (
    <div className="p-3 space-y-4">
      <p className="text-xs font-semibold text-gray-700">Page Settings</p>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Page Title</label>
        <input
          type="text"
          value={meta.title}
          onChange={(e) => updateMeta({ title: e.target.value })}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
        />
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Description (SEO)</label>
        <textarea
          value={meta.description}
          onChange={(e) => updateMeta({ description: e.target.value })}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
          rows={3}
        />
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Page Type</label>
        <select
          value={meta.pageType}
          onChange={(e) => updateMeta({ pageType: e.target.value })}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
        >
          <option value="service-business">Service Business</option>
          <option value="local-business">Local Business</option>
          <option value="saas">SaaS</option>
          <option value="coach-consultant">Coach / Consultant</option>
          <option value="portfolio">Portfolio</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Theme Variant</label>
        <select
          value={meta.themeVariant}
          onChange={(e) => updateMeta({ themeVariant: e.target.value })}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
        >
          <option value="clean">Clean</option>
          <option value="bold">Bold</option>
          <option value="elegant">Elegant</option>
          <option value="playful">Playful</option>
          <option value="minimal">Minimal</option>
          <option value="corporate">Corporate</option>
        </select>
      </div>

      {meta.slug && (
        <div>
          <label className="mb-0.5 block text-[10px] text-gray-500">Slug</label>
          <input
            type="text"
            value={meta.slug}
            onChange={(e) => updateMeta({ slug: e.target.value })}
            className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs font-mono"
          />
        </div>
      )}
    </div>
  );
}
