"use client";

import { useState, useRef, useEffect } from "react";

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "button";
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

export default function InlineEditor({
  value,
  onChange,
  tag: Tag = "p",
  className = "",
  style,
  multiline = false,
}: InlineEditorProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    const InputTag = multiline ? "textarea" : "input";
    return (
      <InputTag
        ref={inputRef as React.RefObject<HTMLTextAreaElement & HTMLInputElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full border-2 border-primary-400 bg-white/90 px-2 py-1 text-inherit outline-none"
        style={{ ...style, font: "inherit" }}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <Tag
      onClick={() => setEditing(true)}
      className={`cursor-text rounded outline-2 outline-dashed outline-transparent hover:outline-primary-400/50 ${className}`}
      style={style}
      title="Click to edit"
    >
      {value || "(click to edit)"}
    </Tag>
  );
}
