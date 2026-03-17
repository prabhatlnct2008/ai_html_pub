"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
  isOwner: boolean;
  projectId: string;
}

/**
 * Renders generated HTML in a sandboxed iframe.
 * allow-same-origin is needed so we can access contentDocument for
 * writing HTML and measuring height. The browser warns about
 * allow-scripts + allow-same-origin but the content is server-rendered,
 * not user-supplied.
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

    // Reset to 0 before measuring to break the circular dependency
    // where scrollHeight is clamped by the iframe's current height.
    const resize = () => {
      if (doc.body) {
        iframe.style.height = "0px";
        iframe.style.height = doc.documentElement.scrollHeight + "px";
      }
    };

    // Resize after content is written
    resize();

    // Re-measure after images/fonts/scripts finish loading
    if (doc.defaultView) {
      doc.defaultView.addEventListener("load", resize);
    }

    const observer = new ResizeObserver(resize);
    if (doc.body) observer.observe(doc.body);

    return () => {
      observer.disconnect();
      if (doc.defaultView) {
        doc.defaultView.removeEventListener("load", resize);
      }
    };
  }, [html]);

  return (
    <div style={{ position: "relative" }}>
      <iframe
        ref={iframeRef}
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
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
