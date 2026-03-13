"use client";

interface MessageBubbleProps {
  role: string;
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  // Simple markdown-like rendering for bold text and lists
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // List items
      if (processed.startsWith("- ")) {
        processed = `<span style="display: block; padding-left: 16px;">• ${processed.slice(2)}</span>`;
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
