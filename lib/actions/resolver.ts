import type { Action } from "@/lib/page/schema";

/**
 * Resolve an action by ID from the page-level actions array.
 */
export function resolveAction(
  actionId: string | undefined,
  actions: Action[]
): Action | undefined {
  if (!actionId) return undefined;
  return actions.find((a) => a.id === actionId);
}

/**
 * Generate the correct href for an action based on its type.
 */
export function getActionHref(action: Action): string {
  switch (action.type) {
    case "url":
      return action.value;
    case "phone":
      return `tel:${normalizePhone(action.value)}`;
    case "email":
      return `mailto:${action.value}`;
    case "whatsapp": {
      const phone = normalizePhone(action.value).replace("+", "");
      const msg = action.metadata?.whatsappMessage;
      const url = `https://wa.me/${phone}`;
      return msg ? `${url}?text=${encodeURIComponent(msg)}` : url;
    }
    case "scroll":
      return `#${action.metadata?.scrollTargetId || action.value}`;
    case "form":
      return "#";
    default:
      return action.value || "#";
  }
}

/**
 * Get HTML attributes for an action link.
 */
export function getActionAttrs(action: Action): string {
  const attrs: string[] = [];
  attrs.push(`href="${escAttr(getActionHref(action))}"`);

  if (action.type === "url" && action.openInNewTab) {
    attrs.push('target="_blank"');
    attrs.push('rel="noopener noreferrer"');
  }

  if (action.type === "scroll") {
    attrs.push('style="scroll-behavior: smooth;"');
  }

  if (action.type === "phone") {
    attrs.push(`aria-label="Call ${escAttr(action.label)}"`);
  }

  if (action.type === "whatsapp") {
    attrs.push(`aria-label="WhatsApp ${escAttr(action.label)}"`);
  }

  return attrs.join(" ");
}

function normalizePhone(value: string): string {
  // Strip everything except digits and leading +
  const cleaned = value.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

function escAttr(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
