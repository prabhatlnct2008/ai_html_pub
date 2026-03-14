"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
  isOwner: boolean;
  projectId: string;
}

/**
 * Renders generated HTML in a sandboxed iframe to prevent XSS.
 * The iframe has no access to the parent page's cookies, JS context, or DOM.
 */
export default function PublishedPageClient({ html, isOwner, projectId }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();

    // Dynamically resize iframe to match content height
    const resize = () => {
      if (doc.body) {
        iframe.style.height = doc.body.scrollHeight + "px";
      }
    };

    // Resize after load and on window resize
    resize();
    const observer = new ResizeObserver(resize);
    if (doc.body) observer.observe(doc.body);

    return () => observer.disconnect();
  }, [html]);

  return (
    <div style={{ position: "relative" }}>
      <iframe
        ref={iframeRef}
        sandbox="allow-same-origin"
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
          minHeight: "100vh",
        }}
        title="Published Page"
      />
      {isOwner && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
          <a
            href={`/projects/${projectId}/editor`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#2563eb",
              color: "white",
              padding: "12px 24px",
              borderRadius: 10,
              fontFamily: "system-ui",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
            }}
          >
            Edit Page
          </a>
        </div>
      )}
    </div>
  );
}
