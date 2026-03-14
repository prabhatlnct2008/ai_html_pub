"use client";

interface MessageBubbleProps {
  role: string;
  content: string;
}

// Escape HTML entities to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  // Safe markdown-like rendering: escape first, then apply formatting
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Escape HTML entities FIRST to prevent XSS
      let processed = escapeHtml(line);
      // Bold (safe: content is already escaped)
      processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // List items
      if (processed.startsWith("- ")) {
        processed = `<span style="display: block; padding-left: 16px;">&bull; ${processed.slice(2)}</span>`;
      }
      // Numbered lists
      const numMatch = processed.match(/^(\d+)\.\s/);
      if (numMatch) {
        processed = `<span style="display: block; padding-left: 16px;">${processed}</span>`;
      }
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{ __html: processed }}
          style={{ display: "block", minHeight: line === "" ? "8px" : undefined }}
        />
      );
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {renderContent(content)}
      </div>
    </div>
  );
}
