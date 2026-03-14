"use client";

import { useState, useRef } from "react";
import { useEditor, type SectionData } from "./EditorContext";
import { SECTION_VARIANTS } from "@/lib/page/section-library";
import { PAGE_TYPES, THEME_VARIANTS } from "@/lib/page/schema";
import type { SectionType, Action, ButtonRef, Asset } from "@/lib/page/schema";

export default function SectionInspector() {
  const { getSelectedSection, activePanel, setActivePanel } = useEditor();
  const section = getSelectedSection();

  const tabs: { id: typeof activePanel; label: string }[] = [
    { id: "section", label: "Section" },
    { id: "actions", label: "Actions" },
    { id: "assets", label: "Assets" },
    { id: "theme", label: "Theme" },
    { id: "settings", label: "Page" },
  ];

  return (
    <div className="flex h-full flex-col border-l bg-white">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 px-1.5 py-2 text-[11px] font-medium transition ${
              activePanel === tab.id
                ? "border-b-2 border-primary-500 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activePanel === "section" && (
          section ? (
            <SectionPanel section={section} />
          ) : (
            <EmptyState message="Select a section to inspect its properties" />
          )
        )}
        {activePanel === "actions" && <ActionsPanel />}
        {activePanel === "assets" && <AssetsPanel />}
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
  const { updateContent, updateStyle, updateVariant, assets } = useEditor();
  const variants = SECTION_VARIANTS[section.type as SectionType] || [];

  return (
    <div className="space-y-4 p-3">
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Type</label>
        <p className="text-sm font-medium capitalize text-gray-700">{section.type.replace(/-/g, " ")}</p>
      </div>

      {variants.length > 1 && (
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Variant</label>
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

      {/* Image assignment for sections that support it */}
      {(section.type === "hero" || section.type === "gallery") && (
        <SectionImageAssignment section={section} assets={assets} />
      )}

      {/* Style controls */}
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Background Color</label>
        <div className="flex items-center gap-2">
          <input type="color" value={section.style.background_color || section.style.backgroundColor || "#ffffff"} onChange={(e) => updateStyle(section.id, "backgroundColor", e.target.value)} className="h-7 w-7 cursor-pointer rounded border" />
          <input type="text" value={section.style.background_color || section.style.backgroundColor || "#ffffff"} onChange={(e) => updateStyle(section.id, "backgroundColor", e.target.value)} className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Text Color</label>
        <div className="flex items-center gap-2">
          <input type="color" value={section.style.text_color || section.style.textColor || "#1a1a1a"} onChange={(e) => updateStyle(section.id, "textColor", e.target.value)} className="h-7 w-7 cursor-pointer rounded border" />
          <input type="text" value={section.style.text_color || section.style.textColor || "#1a1a1a"} onChange={(e) => updateStyle(section.id, "textColor", e.target.value)} className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Padding</label>
        <input type="text" value={section.style.padding || "80px 0"} onChange={(e) => updateStyle(section.id, "padding", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs" placeholder="e.g. 80px 0" />
      </div>

      <ContentFields section={section} />
      <ButtonsEditor section={section} />
    </div>
  );
}

function SectionImageAssignment({ section, assets }: { section: SectionData; assets: Asset[] }) {
  const { updateContent } = useEditor();
  const imageAssets = assets.filter((a) => a.kind === "image");
  const currentImageId = section.content.heroImageId as string | undefined;

  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {section.type === "hero" ? "Hero Image" : "Section Image"}
      </label>
      <select
        value={currentImageId || ""}
        onChange={(e) => updateContent(section.id, "heroImageId", e.target.value || undefined)}
        className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
      >
        <option value="">No image</option>
        {imageAssets.map((a) => (
          <option key={a.id} value={a.id}>
            {a.alt || a.id} ({a.source})
          </option>
        ))}
      </select>
      {currentImageId && (
        <div className="mt-1.5">
          {(() => {
            const asset = assets.find((a) => a.id === currentImageId);
            return asset ? (
              <img src={asset.url} alt={asset.alt || ""} className="h-20 w-full rounded border object-cover" />
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}

function ContentFields({ section }: { section: SectionData }) {
  const { updateContent } = useEditor();
  const content = section.content;

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
            <textarea value={(content[field.key] as string) || ""} onChange={(e) => updateContent(section.id, field.key, e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs" rows={3} />
          ) : (
            <input type="text" value={(content[field.key] as string) || ""} onChange={(e) => updateContent(section.id, field.key, e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs" />
          )}
        </div>
      ))}
      <RepeatableItemsEditor section={section} />
    </div>
  );
}

// Image-capable fields per section type
const IMAGE_FIELDS: Record<string, string> = {
  imageId: "Image",
  avatarImageId: "Avatar",
};

function RepeatableItemsEditor({ section }: { section: SectionData }) {
  const { updateContent, assets } = useEditor();
  const content = section.content;
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  let items: Array<Record<string, unknown>> | null = null;
  let itemsKey = "";

  if (Array.isArray(content.items)) { items = content.items as Array<Record<string, unknown>>; itemsKey = "items"; }
  else if (Array.isArray(content.steps)) { items = content.steps as Array<Record<string, unknown>>; itemsKey = "steps"; }
  else if (Array.isArray(content.stats)) { items = content.stats as Array<Record<string, unknown>>; itemsKey = "stats"; }
  else if (Array.isArray(content.plans)) { items = content.plans as Array<Record<string, unknown>>; itemsKey = "plans"; }
  else if (Array.isArray(content.members)) { items = content.members as Array<Record<string, unknown>>; itemsKey = "members"; }

  if (!items || items.length === 0) return null;

  const sampleItem = items[0];
  const editableFields = Object.keys(sampleItem).filter(
    (k) => typeof sampleItem[k] === "string" || typeof sampleItem[k] === "number"
  );

  // Detect image-assignable fields on items
  const imageFieldKeys = Object.keys(IMAGE_FIELDS).filter((k) =>
    items!.some((item) => k in item) ||
    (k === "imageId" && ["features", "services", "about-team"].includes(section.type)) ||
    (k === "avatarImageId" && section.type === "testimonials")
  );
  const imageAssets = assets.filter((a) => a.kind === "image");

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
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{itemsKey.charAt(0).toUpperCase() + itemsKey.slice(1)} ({items.length})</p>
        <button onClick={addItem} className="rounded p-0.5 text-gray-400 hover:text-primary-600" title="Add item">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => {
          const title = (item.title || item.name || item.question || item.text || item.value || `Item ${i + 1}`) as string;
          const isExpanded = expandedItem === i;
          return (
            <div key={i} className="rounded border border-gray-100">
              <button onClick={() => setExpandedItem(isExpanded ? null : i)} className="flex w-full items-center justify-between px-2 py-1.5 text-left text-xs">
                <span className="truncate font-medium text-gray-600">{title}</span>
                <svg className={`h-3 w-3 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isExpanded && (
                <div className="space-y-2 border-t bg-gray-50 px-2 py-2">
                  {editableFields.map((field) => (
                    <div key={field}>
                      <label className="mb-0.5 block text-[10px] text-gray-500">{field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                      {String(item[field] || "").length > 50 ? (
                        <textarea value={String(item[field] || "")} onChange={(e) => updateContent(section.id, `${itemsKey}.${i}.${field}`, e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" rows={2} />
                      ) : (
                        <input type="text" value={String(item[field] || "")} onChange={(e) => updateContent(section.id, `${itemsKey}.${i}.${field}`, e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" />
                      )}
                    </div>
                  ))}
                  {imageFieldKeys.map((imgField) => {
                    const currentId = item[imgField] as string | undefined;
                    const currentAsset = currentId ? imageAssets.find((a) => a.id === currentId) : undefined;
                    return (
                      <div key={imgField}>
                        <label className="mb-0.5 block text-[10px] text-gray-500">{IMAGE_FIELDS[imgField]}</label>
                        <select
                          value={currentId || ""}
                          onChange={(e) => updateContent(section.id, `${itemsKey}.${i}.${imgField}`, e.target.value || undefined)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                        >
                          <option value="">No image</option>
                          {imageAssets.map((a) => (
                            <option key={a.id} value={a.id}>{a.alt || a.id} ({a.source})</option>
                          ))}
                        </select>
                        {currentAsset && (
                          <img src={currentAsset.url} alt={currentAsset.alt || ""} className="mt-1 h-16 w-full rounded border object-cover" />
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => removeItem(i)} className="mt-1 text-[10px] text-red-500 hover:text-red-700">Remove item</button>
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
  const { updateContent, actions, addAction, updateAction, sections } = useEditor();
  const buttons = section.content.buttons as ButtonRef[] | undefined;

  if (!buttons || buttons.length === 0) {
    const hasLegacy = section.content.primaryCtaText || section.content.buttonText || section.content.cta_text;
    if (!hasLegacy) return null;
    return (
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Buttons</p>
        <div className="rounded border border-gray-100 p-2">
          <label className="mb-0.5 block text-[10px] text-gray-500">Button Text</label>
          <input type="text" value={(section.content.primaryCtaText || section.content.buttonText || section.content.cta_text || "") as string}
            onChange={(e) => {
              const key = section.content.primaryCtaText !== undefined ? "primaryCtaText" : section.content.buttonText !== undefined ? "buttonText" : "cta_text";
              updateContent(section.id, key, e.target.value);
            }} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" />
        </div>
      </div>
    );
  }

  const addButton = () => {
    const actionId = `action_${section.type}_${Math.random().toString(36).substring(2, 6)}`;
    const newAction: Action = { id: actionId, label: "New Button", type: "scroll", value: "#contact", style: "primary" };
    addAction(newAction);
    updateContent(section.id, "buttons", [...buttons, { text: "New Button", actionId, style: "primary" as const }]);
  };

  // Collect visible section IDs for scroll target picker
  const scrollTargets = sections.filter((s) => s.visible !== false).map((s) => ({ id: s.type, label: s.type.replace(/-/g, " ") }));

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
              <input type="text" value={btn.text} onChange={(e) => { const nb = [...buttons]; nb[i] = { ...nb[i], text: e.target.value }; updateContent(section.id, "buttons", nb); }} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] text-gray-500">Style</label>
              <select value={btn.style || "primary"} onChange={(e) => { const nb = [...buttons]; nb[i] = { ...nb[i], style: e.target.value as ButtonRef["style"] }; updateContent(section.id, "buttons", nb); }} className="w-full rounded border border-gray-200 px-2 py-1 text-xs">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            {action && <ActionFields action={action} scrollTargets={scrollTargets} />}
            <button onClick={() => updateContent(section.id, "buttons", buttons.filter((_, idx) => idx !== i))} className="text-[10px] text-red-500 hover:text-red-700">Remove</button>
          </div>
        );
      })}
    </div>
  );
}

// ---- Shared Action Fields (used in both buttons and actions panel) ----

function ActionFields({ action, scrollTargets }: { action: Action; scrollTargets?: { id: string; label: string }[] }) {
  const { updateAction } = useEditor();

  return (
    <>
      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Action Type</label>
        <select value={action.type} onChange={(e) => updateAction(action.id, { type: e.target.value as Action["type"] })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs">
          <option value="url">URL</option>
          <option value="phone">Phone Call</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="scroll">Scroll to Section</option>
          <option value="form">Form Submit</option>
        </select>
      </div>

      {action.type === "scroll" && scrollTargets ? (
        <div>
          <label className="mb-0.5 block text-[10px] text-gray-500">Scroll Target</label>
          <select value={action.value} onChange={(e) => updateAction(action.id, { value: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs">
            {scrollTargets.map((t) => (
              <option key={t.id} value={`#${t.id}`}>{t.label}</option>
            ))}
          </select>
        </div>
      ) : action.type === "phone" ? (
        <div>
          <label className="mb-0.5 block text-[10px] text-gray-500">Phone Number</label>
          <input type="tel" value={action.value} onChange={(e) => updateAction(action.id, { value: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" placeholder="+1 (555) 123-4567" />
          <p className="mt-0.5 text-[9px] text-gray-400">Renders as tel:{action.value}</p>
        </div>
      ) : action.type === "email" ? (
        <div>
          <label className="mb-0.5 block text-[10px] text-gray-500">Email Address</label>
          <input type="email" value={action.value} onChange={(e) => updateAction(action.id, { value: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" placeholder="contact@example.com" />
          <p className="mt-0.5 text-[9px] text-gray-400">Renders as mailto:{action.value}</p>
        </div>
      ) : action.type === "whatsapp" ? (
        <>
          <div>
            <label className="mb-0.5 block text-[10px] text-gray-500">WhatsApp Number</label>
            <input type="tel" value={action.value} onChange={(e) => updateAction(action.id, { value: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" placeholder="+919876543210" />
            <p className="mt-0.5 text-[9px] text-gray-400">Renders as wa.me/{action.value}</p>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] text-gray-500">Pre-filled Message</label>
            <input type="text" value={action.metadata?.whatsappMessage || ""} onChange={(e) => updateAction(action.id, { metadata: { ...action.metadata, whatsappMessage: e.target.value } })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" placeholder="Hi, I'd like to know more..." />
          </div>
        </>
      ) : action.type !== "form" ? (
        <div>
          <label className="mb-0.5 block text-[10px] text-gray-500">URL</label>
          <input type="url" value={action.value} onChange={(e) => updateAction(action.id, { value: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" placeholder="https://..." />
        </div>
      ) : null}
    </>
  );
}

// ---- Actions Panel ----

function ActionsPanel() {
  const { actions, addAction, updateAction, deleteAction, sections } = useEditor();
  const scrollTargets = sections.filter((s) => s.visible !== false).map((s) => ({ id: s.type, label: s.type.replace(/-/g, " ") }));

  const handleAdd = () => {
    const id = `action_${Math.random().toString(36).substring(2, 8)}`;
    addAction({ id, label: "New Action", type: "url", value: "#", style: "primary" });
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">Page Actions ({actions.length})</p>
        <button onClick={handleAdd} className="rounded bg-primary-50 px-2 py-1 text-[10px] font-medium text-primary-700 hover:bg-primary-100">Add Action</button>
      </div>
      {actions.length === 0 && <p className="py-4 text-center text-xs text-gray-400">No actions defined. Buttons reference actions by ID.</p>}
      {actions.map((action) => (
        <div key={action.id} className="rounded border border-gray-100 p-2 space-y-1.5">
          <div>
            <label className="mb-0.5 block text-[10px] text-gray-500">Label</label>
            <input type="text" value={action.label} onChange={(e) => updateAction(action.id, { label: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] text-gray-500">Style</label>
            <select value={action.style || "primary"} onChange={(e) => updateAction(action.id, { style: e.target.value as Action["style"] })} className="w-full rounded border border-gray-200 px-2 py-1 text-xs">
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
          <ActionFields action={action} scrollTargets={scrollTargets} />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400 font-mono">{action.id}</span>
            <button onClick={() => { if (confirm("Delete this action?")) deleteAction(action.id); }} className="text-[10px] text-red-500 hover:text-red-700">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Assets Panel ----

function AssetsPanel() {
  const { assets, addAsset, deleteAsset, projectId } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));

      const res = await fetch(`/api/projects/${projectId}/assets`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      const newAsset: Asset = {
        id: data.asset.id,
        kind: data.asset.kind,
        source: data.asset.source,
        url: data.asset.url,
        alt: data.asset.altText || undefined,
      };
      addAsset(newAsset);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">Assets ({assets.length})</p>
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded bg-primary-50 px-2 py-1 text-[10px] font-medium text-primary-700 hover:bg-primary-100 disabled:opacity-50">
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
      {assets.length === 0 && <p className="py-4 text-center text-xs text-gray-400">No assets. Upload images or generate with AI.</p>}

      <div className="space-y-2">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onDelete={async () => {
            if (!confirm("Remove this asset?")) return;
            deleteAsset(asset.id);
            try {
              await fetch(`/api/projects/${projectId}/assets/${asset.id}`, { method: "DELETE" });
            } catch { /* best effort */ }
          }} />
        ))}
      </div>
    </div>
  );
}

function AssetCard({ asset, onDelete }: { asset: Asset; onDelete: () => void }) {
  const { updateAsset, projectId } = useEditor();
  const [editingAlt, setEditingAlt] = useState(false);
  const [altText, setAltText] = useState(asset.alt || "");

  const saveAlt = async () => {
    updateAsset(asset.id, { alt: altText });
    setEditingAlt(false);
    // Persist to server
    try {
      await fetch(`/api/projects/${projectId}/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText }),
      });
    } catch { /* best effort */ }
  };

  return (
    <div className="rounded border border-gray-100 overflow-hidden">
      <div className="aspect-video bg-gray-100">
        <img src={asset.url} alt={asset.alt || ""} className="h-full w-full object-cover" />
      </div>
      <div className="p-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-500">
            {asset.source}
          </span>
          <span className="text-[9px] text-gray-400 font-mono truncate ml-1">{asset.id.substring(0, 20)}</span>
        </div>
        {editingAlt ? (
          <div className="flex gap-1">
            <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="flex-1 rounded border border-gray-200 px-1.5 py-0.5 text-[10px]" placeholder="Alt text..." />
            <button onClick={saveAlt} className="text-[10px] text-primary-600">Save</button>
          </div>
        ) : (
          <button onClick={() => setEditingAlt(true)} className="block w-full text-left text-[10px] text-gray-500 hover:text-gray-700">
            {asset.alt || "(click to add alt text)"}
          </button>
        )}
        <button onClick={onDelete} className="text-[10px] text-red-500 hover:text-red-700">Remove</button>
      </div>
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
        <select value={brand.tone} onChange={(e) => updateBrand({ tone: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs">
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="bold">Bold</option>
          <option value="playful">Playful</option>
        </select>
      </div>

      {(["primaryColor", "secondaryColor", "accentColor"] as const).map((colorKey) => (
        <div key={colorKey}>
          <label className="mb-0.5 block text-[10px] text-gray-500">{colorKey.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
          <div className="flex items-center gap-2">
            <input type="color" value={brand[colorKey]} onChange={(e) => updateBrand({ [colorKey]: e.target.value })} className="h-7 w-7 cursor-pointer rounded border" />
            <input type="text" value={brand[colorKey]} onChange={(e) => updateBrand({ [colorKey]: e.target.value })} className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs font-mono" />
          </div>
        </div>
      ))}

      {(["fontHeading", "fontBody"] as const).map((fontKey) => (
        <div key={fontKey}>
          <label className="mb-0.5 block text-[10px] text-gray-500">{fontKey === "fontHeading" ? "Heading Font" : "Body Font"}</label>
          <select value={brand[fontKey]} onChange={(e) => updateBrand({ [fontKey]: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs">
            {["Inter", "Poppins", "Montserrat", "Playfair Display", "Roboto", "Open Sans", "Lato", "Raleway", "Merriweather", "Source Sans Pro"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// ---- Settings Panel (schema-aligned) ----

function SettingsPanel() {
  const { meta, updateMeta } = useEditor();

  return (
    <div className="p-3 space-y-4">
      <p className="text-xs font-semibold text-gray-700">Page Settings</p>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Page Title</label>
        <input type="text" value={meta.title} onChange={(e) => updateMeta({ title: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs" />
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Description (SEO)</label>
        <textarea value={meta.description} onChange={(e) => updateMeta({ description: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs" rows={3} />
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Page Type</label>
        <select value={meta.pageType} onChange={(e) => updateMeta({ pageType: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs">
          {PAGE_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Theme Variant</label>
        <select value={meta.themeVariant} onChange={(e) => updateMeta({ themeVariant: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs">
          {THEME_VARIANTS.map((v) => (
            <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Slug (URL path)</label>
        <input type="text" value={meta.slug || ""} onChange={(e) => updateMeta({ slug: e.target.value })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs font-mono" placeholder="my-business-page" />
        {meta.slug && <p className="mt-0.5 text-[9px] text-gray-400">Public URL: /p/{meta.slug}</p>}
      </div>

      <div>
        <label className="mb-0.5 block text-[10px] text-gray-500">Publish Status</label>
        <select value={meta.publishStatus || "draft"} onChange={(e) => updateMeta({ publishStatus: e.target.value as "draft" | "published" })} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>
  );
}
