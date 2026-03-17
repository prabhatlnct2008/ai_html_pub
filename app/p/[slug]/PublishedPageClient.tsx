"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  html: string;
  isOwner: boolean;
  projectId: string;
}

/**
 * Resize script injected into the iframe HTML.
 * Posts the document height to the parent via postMessage
 * so the parent can size the iframe without needing same-origin access.
 */
const RESIZE_SCRIPT = `<script>
(function(){
  function postHeight(){
    var h = document.documentElement.scrollHeight;
    window.parent.postMessage({type:'iframe-resize',height:h},'*');
  }
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);
  new ResizeObserver(postHeight).observe(document.body);
  postHeight();
})();
</script>`;

function injectResizeScript(html: string): string {
  const idx = html.lastIndexOf("</body>");
  if (idx !== -1) {
    return html.slice(0, idx) + RESIZE_SCRIPT + html.slice(idx);
  }
  return html + RESIZE_SCRIPT;
}

/**
 * Renders generated HTML in a sandboxed iframe to prevent XSS.
 * Uses srcdoc (no allow-same-origin) so the iframe cannot access
 * the parent page's cookies, JS context, or DOM.
 */
export default function PublishedPageClient({ html, isOwner, projectId }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(0);

  const srcdoc = injectResizeScript(html);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "iframe-resize" && typeof e.data.height === "number") {
        setHeight(e.data.height);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
          height: height > 0 ? height : undefined,
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
