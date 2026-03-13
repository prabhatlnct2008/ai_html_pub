"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  type ReactNode,
} from "react";

export interface SectionData {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  style: Record<string, string>;
}

interface EditorState {
  sections: SectionData[];
  globalStyles: Record<string, string>;
  selectedSectionId: string | null;
  isDirty: boolean;
}

type EditorAction =
  | { type: "SET_SECTIONS"; sections: SectionData[]; globalStyles: Record<string, string> }
  | { type: "UPDATE_SECTION_CONTENT"; sectionId: string; path: string; value: unknown }
  | { type: "UPDATE_SECTION_STYLE"; sectionId: string; key: string; value: string }
  | { type: "MOVE_SECTION"; sectionId: string; direction: "up" | "down" }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "DUPLICATE_SECTION"; sectionId: string }
  | { type: "ADD_SECTION"; section: SectionData; atIndex: number }
  | { type: "REPLACE_SECTION"; sectionId: string; section: SectionData }
  | { type: "SELECT_SECTION"; sectionId: string | null }
  | { type: "MARK_CLEAN" };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_SECTIONS":
      return {
        ...state,
        sections: action.sections,
        globalStyles: action.globalStyles,
        isDirty: false,
      };

    case "UPDATE_SECTION_CONTENT": {
      const sections = state.sections.map((s) => {
        if (s.id !== action.sectionId) return s;
        const content = { ...s.content };
        // Support nested paths like "items.0.title"
        const parts = action.path.split(".");
        if (parts.length === 1) {
          content[parts[0]] = action.value;
        } else {
          // Deep clone and set
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

    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

interface EditorContextType {
  sections: SectionData[];
  globalStyles: Record<string, string>;
  selectedSectionId: string | null;
  isDirty: boolean;
  isPreview: boolean;
  setPreview: (v: boolean) => void;
  dispatch: React.Dispatch<EditorAction>;
  setSections: (sections: SectionData[], globalStyles: Record<string, string>) => void;
  updateContent: (sectionId: string, path: string, value: unknown) => void;
  updateStyle: (sectionId: string, key: string, value: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  deleteSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  addSection: (section: SectionData, atIndex: number) => void;
  replaceSection: (sectionId: string, section: SectionData) => void;
  selectSection: (sectionId: string | null) => void;
  markClean: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, {
    sections: [],
    globalStyles: {},
    selectedSectionId: null,
    isDirty: false,
  });

  const [isPreview, setPreview] = useState(false);

  const setSections = useCallback(
    (sections: SectionData[], globalStyles: Record<string, string>) =>
      dispatch({ type: "SET_SECTIONS", sections, globalStyles }),
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
  const markClean = useCallback(() => dispatch({ type: "MARK_CLEAN" }), []);

  return (
    <EditorContext.Provider
      value={{
        ...state,
        isPreview,
        setPreview,
        dispatch,
        setSections,
        updateContent,
        updateStyle,
        moveSection,
        deleteSection,
        duplicateSection,
        addSection,
        replaceSection,
        selectSection,
        markClean,
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
