"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type { Action, Asset, ButtonRef } from "@/lib/page/schema";
import type { SiteSettings, PageSummary } from "@/lib/site/types";

export interface SectionData {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  style: Record<string, string>;
  variant?: string;
  visible?: boolean;
  assets?: Record<string, unknown>;
}

export interface MetaData {
  title: string;
  description: string;
  pageType: string;
  themeVariant: string;
  slug?: string;
  publishStatus?: "draft" | "published";
}

export interface BrandData {
  tone: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoAssetId?: string;
}

// Active panel in the right sidebar
export type InspectorPanel = "section" | "actions" | "assets" | "theme" | "settings";

// Preview width presets
export type PreviewMode = "desktop" | "tablet" | "mobile";
const PREVIEW_WIDTHS: Record<PreviewMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

interface EditorState {
  sections: SectionData[];
  globalStyles: Record<string, string>;
  actions: Action[];
  assets: Asset[];
  meta: MetaData;
  brand: BrandData;
  selectedSectionId: string | null;
  isDirty: boolean;
  projectId: string;
}

type EditorAction =
  | { type: "SET_DOCUMENT"; sections: SectionData[]; globalStyles: Record<string, string>; actions?: Action[]; assets?: Asset[]; meta?: Partial<MetaData>; brand?: Partial<BrandData> }
  | { type: "UPDATE_SECTION_CONTENT"; sectionId: string; path: string; value: unknown }
  | { type: "UPDATE_SECTION_STYLE"; sectionId: string; key: string; value: string }
  | { type: "UPDATE_SECTION_VARIANT"; sectionId: string; variant: string }
  | { type: "TOGGLE_SECTION_VISIBILITY"; sectionId: string }
  | { type: "MOVE_SECTION"; sectionId: string; direction: "up" | "down" }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "DUPLICATE_SECTION"; sectionId: string }
  | { type: "ADD_SECTION"; section: SectionData; atIndex: number }
  | { type: "REPLACE_SECTION"; sectionId: string; section: SectionData }
  | { type: "SELECT_SECTION"; sectionId: string | null }
  | { type: "UPDATE_META"; updates: Partial<MetaData> }
  | { type: "UPDATE_BRAND"; updates: Partial<BrandData> }
  | { type: "ADD_ACTION"; action: Action }
  | { type: "UPDATE_ACTION"; actionId: string; updates: Partial<Action> }
  | { type: "DELETE_ACTION"; actionId: string }
  | { type: "ADD_ASSET"; asset: Asset }
  | { type: "UPDATE_ASSET"; assetId: string; updates: Partial<Asset> }
  | { type: "DELETE_ASSET"; assetId: string }
  | { type: "MARK_CLEAN" };

const DEFAULT_META: MetaData = {
  title: "",
  description: "",
  pageType: "service-business",
  themeVariant: "clean",
};

const DEFAULT_BRAND: BrandData = {
  tone: "professional",
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  accentColor: "#f59e0b",
  fontHeading: "Inter",
  fontBody: "Inter",
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_DOCUMENT":
      return {
        ...state,
        sections: action.sections,
        globalStyles: action.globalStyles,
        actions: action.actions || [],
        assets: action.assets || [],
        meta: { ...DEFAULT_META, ...action.meta },
        brand: { ...DEFAULT_BRAND, ...action.brand },
        isDirty: false,
      };

    case "UPDATE_SECTION_CONTENT": {
      const sections = state.sections.map((s) => {
        if (s.id !== action.sectionId) return s;
        const content = { ...s.content };
        const parts = action.path.split(".");
        if (parts.length === 1) {
          content[parts[0]] = action.value;
        } else {
          const clone = JSON.parse(JSON.stringify(content));
          let target: Record<string, unknown> = clone;
          for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]] as Record<string, unknown>;
          }
          target[parts[parts.length - 1]] = action.value;
          return { ...s, content: clone };
        }
        return { ...s, content };
      });
      return { ...state, sections, isDirty: true };
    }

    case "UPDATE_SECTION_STYLE": {
      const sections = state.sections.map((s) => {
        if (s.id !== action.sectionId) return s;
        return { ...s, style: { ...s.style, [action.key]: action.value } };
      });
      return { ...state, sections, isDirty: true };
    }

    case "UPDATE_SECTION_VARIANT": {
      const sections = state.sections.map((s) =>
        s.id === action.sectionId ? { ...s, variant: action.variant } : s
      );
      return { ...state, sections, isDirty: true };
    }

    case "TOGGLE_SECTION_VISIBILITY": {
      const sections = state.sections.map((s) =>
        s.id === action.sectionId ? { ...s, visible: s.visible === false ? true : false } : s
      );
      return { ...state, sections, isDirty: true };
    }

    case "MOVE_SECTION": {
      const idx = state.sections.findIndex((s) => s.id === action.sectionId);
      if (idx === -1) return state;
      const newIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.sections.length) return state;
      const sections = [...state.sections];
      [sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]];
      return {
        ...state,
        sections: sections.map((s, i) => ({ ...s, order: i })),
        isDirty: true,
      };
    }

    case "DELETE_SECTION": {
      const sections = state.sections
        .filter((s) => s.id !== action.sectionId)
        .map((s, i) => ({ ...s, order: i }));
      return { ...state, sections, isDirty: true, selectedSectionId: null };
    }

    case "DUPLICATE_SECTION": {
      const idx = state.sections.findIndex((s) => s.id === action.sectionId);
      if (idx === -1) return state;
      const original = state.sections[idx];
      const duplicate: SectionData = {
        ...JSON.parse(JSON.stringify(original)),
        id: `section-${original.type}-${Math.random().toString(36).substring(2, 8)}`,
      };
      const sections = [...state.sections];
      sections.splice(idx + 1, 0, duplicate);
      return {
        ...state,
        sections: sections.map((s, i) => ({ ...s, order: i })),
        isDirty: true,
      };
    }

    case "ADD_SECTION": {
      const sections = [...state.sections];
      sections.splice(action.atIndex, 0, action.section);
      return {
        ...state,
        sections: sections.map((s, i) => ({ ...s, order: i })),
        isDirty: true,
      };
    }

    case "REPLACE_SECTION": {
      const sections = state.sections.map((s) =>
        s.id === action.sectionId ? { ...action.section, order: s.order } : s
      );
      return { ...state, sections, isDirty: true };
    }

    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.sectionId };

    case "UPDATE_META":
      return { ...state, meta: { ...state.meta, ...action.updates }, isDirty: true };

    case "UPDATE_BRAND":
      return { ...state, brand: { ...state.brand, ...action.updates }, isDirty: true };

    case "ADD_ACTION":
      return { ...state, actions: [...state.actions, action.action], isDirty: true };

    case "UPDATE_ACTION": {
      const actions = state.actions.map((a) =>
        a.id === action.actionId ? { ...a, ...action.updates } : a
      );
      return { ...state, actions, isDirty: true };
    }

    case "DELETE_ACTION": {
      const actions = state.actions.filter((a) => a.id !== action.actionId);
      return { ...state, actions, isDirty: true };
    }

    case "ADD_ASSET":
      return { ...state, assets: [...state.assets, action.asset], isDirty: true };

    case "UPDATE_ASSET": {
      const assets = state.assets.map((a) =>
        a.id === action.assetId ? { ...a, ...action.updates } : a
      );
      return { ...state, assets, isDirty: true };
    }

    case "DELETE_ASSET": {
      const assets = state.assets.filter((a) => a.id !== action.assetId);
      return { ...state, assets, isDirty: true };
    }

    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

interface EditorContextType {
  sections: SectionData[];
  globalStyles: Record<string, string>;
  actions: Action[];
  assets: Asset[];
  meta: MetaData;
  brand: BrandData;
  selectedSectionId: string | null;
  isDirty: boolean;
  projectId: string;
  isPreview: boolean;
  previewMode: PreviewMode;
  previewWidth: string;
  activePanel: InspectorPanel;
  // Site-level state
  siteSettings: SiteSettings | null;
  pages: PageSummary[];
  currentPageId: string | null;
  setSiteSettings: (settings: SiteSettings) => void;
  setPages: (pages: PageSummary[]) => void;
  setCurrentPageId: (pageId: string) => void;
  setPreview: (v: boolean) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setActivePanel: (panel: InspectorPanel) => void;
  dispatch: React.Dispatch<EditorAction>;
  // Section operations
  setSections: (sections: SectionData[], globalStyles: Record<string, string>, extra?: { actions?: Action[]; assets?: Asset[]; meta?: Partial<MetaData>; brand?: Partial<BrandData> }) => void;
  updateContent: (sectionId: string, path: string, value: unknown) => void;
  updateStyle: (sectionId: string, key: string, value: string) => void;
  updateVariant: (sectionId: string, variant: string) => void;
  toggleVisibility: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  deleteSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  addSection: (section: SectionData, atIndex: number) => void;
  replaceSection: (sectionId: string, section: SectionData) => void;
  selectSection: (sectionId: string | null) => void;
  // Document operations
  updateMeta: (updates: Partial<MetaData>) => void;
  updateBrand: (updates: Partial<BrandData>) => void;
  addAction: (action: Action) => void;
  updateAction: (actionId: string, updates: Partial<Action>) => void;
  deleteAction: (actionId: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updates: Partial<Asset>) => void;
  deleteAsset: (assetId: string) => void;
  markClean: () => void;
  // Helpers
  getSelectedSection: () => SectionData | undefined;
  getAction: (actionId: string) => Action | undefined;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children, projectId = "" }: { children: ReactNode; projectId?: string }) {
  const [state, dispatch] = useReducer(editorReducer, {
    sections: [],
    globalStyles: {},
    actions: [],
    assets: [],
    meta: DEFAULT_META,
    brand: DEFAULT_BRAND,
    selectedSectionId: null,
    isDirty: false,
    projectId,
  });

  const [isPreview, setPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [activePanel, setActivePanel] = useState<InspectorPanel>("section");

  // Site-level state
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const setSections = useCallback(
    (sections: SectionData[], globalStyles: Record<string, string>, extra?: { actions?: Action[]; assets?: Asset[]; meta?: Partial<MetaData>; brand?: Partial<BrandData> }) =>
      dispatch({ type: "SET_DOCUMENT", sections, globalStyles, ...extra }),
    []
  );
  const updateContent = useCallback(
    (sectionId: string, path: string, value: unknown) =>
      dispatch({ type: "UPDATE_SECTION_CONTENT", sectionId, path, value }),
    []
  );
  const updateStyle = useCallback(
    (sectionId: string, key: string, value: string) =>
      dispatch({ type: "UPDATE_SECTION_STYLE", sectionId, key, value }),
    []
  );
  const updateVariant = useCallback(
    (sectionId: string, variant: string) =>
      dispatch({ type: "UPDATE_SECTION_VARIANT", sectionId, variant }),
    []
  );
  const toggleVisibility = useCallback(
    (sectionId: string) => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", sectionId }),
    []
  );
  const moveSection = useCallback(
    (sectionId: string, direction: "up" | "down") =>
      dispatch({ type: "MOVE_SECTION", sectionId, direction }),
    []
  );
  const deleteSection = useCallback(
    (sectionId: string) => dispatch({ type: "DELETE_SECTION", sectionId }),
    []
  );
  const duplicateSection = useCallback(
    (sectionId: string) => dispatch({ type: "DUPLICATE_SECTION", sectionId }),
    []
  );
  const addSection = useCallback(
    (section: SectionData, atIndex: number) =>
      dispatch({ type: "ADD_SECTION", section, atIndex }),
    []
  );
  const replaceSection = useCallback(
    (sectionId: string, section: SectionData) =>
      dispatch({ type: "REPLACE_SECTION", sectionId, section }),
    []
  );
  const selectSection = useCallback(
    (sectionId: string | null) =>
      dispatch({ type: "SELECT_SECTION", sectionId }),
    []
  );
  const updateMeta = useCallback(
    (updates: Partial<MetaData>) => dispatch({ type: "UPDATE_META", updates }),
    []
  );
  const updateBrand = useCallback(
    (updates: Partial<BrandData>) => dispatch({ type: "UPDATE_BRAND", updates }),
    []
  );
  const addAction = useCallback(
    (action: Action) => dispatch({ type: "ADD_ACTION", action }),
    []
  );
  const updateAction = useCallback(
    (actionId: string, updates: Partial<Action>) =>
      dispatch({ type: "UPDATE_ACTION", actionId, updates }),
    []
  );
  const deleteAction = useCallback(
    (actionId: string) => dispatch({ type: "DELETE_ACTION", actionId }),
    []
  );
  const addAsset = useCallback(
    (asset: Asset) => dispatch({ type: "ADD_ASSET", asset }),
    []
  );
  const updateAsset = useCallback(
    (assetId: string, updates: Partial<Asset>) =>
      dispatch({ type: "UPDATE_ASSET", assetId, updates }),
    []
  );
  const deleteAsset = useCallback(
    (assetId: string) => dispatch({ type: "DELETE_ASSET", assetId }),
    []
  );
  const markClean = useCallback(() => dispatch({ type: "MARK_CLEAN" }), []);

  const getSelectedSection = useCallback(
    () => state.sections.find((s) => s.id === state.selectedSectionId),
    [state.sections, state.selectedSectionId]
  );
  const getAction = useCallback(
    (actionId: string) => state.actions.find((a) => a.id === actionId),
    [state.actions]
  );

  return (
    <EditorContext.Provider
      value={{
        ...state,
        isPreview,
        previewMode,
        previewWidth: PREVIEW_WIDTHS[previewMode],
        activePanel,
        siteSettings,
        pages,
        currentPageId,
        setSiteSettings,
        setPages,
        setCurrentPageId,
        setPreview,
        setPreviewMode,
        setActivePanel,
        dispatch,
        setSections,
        updateContent,
        updateStyle,
        updateVariant,
        toggleVisibility,
        moveSection,
        deleteSection,
        duplicateSection,
        addSection,
        replaceSection,
        selectSection,
        updateMeta,
        updateBrand,
        addAction,
        updateAction,
        deleteAction,
        addAsset,
        updateAsset,
        deleteAsset,
        markClean,
        getSelectedSection,
        getAction,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
