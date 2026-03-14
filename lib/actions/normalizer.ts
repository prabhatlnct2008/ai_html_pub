import type { Action, ButtonRef, PageDocument } from "@/lib/page/schema";

/**
 * Normalize a legacy PageDocument that has raw hrefs into one with proper Action references.
 * This runs at load time to migrate V1 data to V2 format.
 */
export function normalizeDocumentActions(doc: PageDocument): PageDocument {
  const actions: Action[] = [...(doc.actions || [])];
  const sections = doc.sections.map((section) => {
    const content = { ...section.content };

    switch (section.type) {
      case "hero":
        migratHeroCtas(content, actions);
        break;
      case "cta-band":
        migrateCtaBandButtons(content, actions);
        break;
      case "contact":
        migrateContactButton(content, actions);
        break;
      case "pricing":
        migratePricingCtas(content, actions);
        break;
    }

    return { ...section, content };
  });

  return { ...doc, actions, sections };
}

function migratHeroCtas(
  content: Record<string, unknown>,
  actions: Action[]
): void {
  if (content.buttons && (content.buttons as ButtonRef[]).length > 0) return;

  const primaryText = content.primaryCtaText as string | undefined;
  const primaryHref = content.primaryCtaHref as string | undefined;
  const secondaryText = content.secondaryCtaText as string | undefined;
  const secondaryHref = content.secondaryCtaHref as string | undefined;

  if (!primaryText) return;

  const buttons: ButtonRef[] = [];

  const primaryAction = createActionFromHref(
    primaryText,
    primaryHref || "#contact",
    actions,
    "primary"
  );
  actions.push(primaryAction);
  buttons.push({ text: primaryText, actionId: primaryAction.id, style: "primary" });

  if (secondaryText) {
    const secondaryAction = createActionFromHref(
      secondaryText,
      secondaryHref || "#",
      actions,
      "secondary"
    );
    actions.push(secondaryAction);
    buttons.push({ text: secondaryText, actionId: secondaryAction.id, style: "secondary" });
  }

  content.buttons = buttons;
}

function migrateCtaBandButtons(
  content: Record<string, unknown>,
  actions: Action[]
): void {
  if (content.buttons && (content.buttons as ButtonRef[]).length > 0) return;

  const buttonText = (content.buttonText || content.button_text) as string | undefined;
  const buttonHref = (content.buttonHref || content.button_link) as string | undefined;
  const secondaryText = content.secondaryButtonText as string | undefined;
  const secondaryHref = content.secondaryButtonHref as string | undefined;

  if (!buttonText) return;

  const buttons: ButtonRef[] = [];

  const primaryAction = createActionFromHref(buttonText, buttonHref || "#contact", actions, "primary");
  actions.push(primaryAction);
  buttons.push({ text: buttonText, actionId: primaryAction.id, style: "primary" });

  if (secondaryText) {
    const secondaryAction = createActionFromHref(secondaryText, secondaryHref || "#", actions, "secondary");
    actions.push(secondaryAction);
    buttons.push({ text: secondaryText, actionId: secondaryAction.id, style: "secondary" });
  }

  content.buttons = buttons;
}

function migrateContactButton(
  content: Record<string, unknown>,
  actions: Action[]
): void {
  if (content.buttons && (content.buttons as ButtonRef[]).length > 0) return;

  const buttonText = (content.buttonText || content.button_text) as string | undefined;
  if (!buttonText) return;

  const action = createActionFromHref(buttonText, "#", actions, "primary");
  action.type = "form";
  actions.push(action);
  content.buttons = [{ text: buttonText, actionId: action.id, style: "primary" }];
}

function migratePricingCtas(
  content: Record<string, unknown>,
  actions: Action[]
): void {
  const plans = content.plans as Array<Record<string, unknown>> | undefined;
  if (!plans) return;

  content.plans = plans.map((plan) => {
    if (plan.buttons && (plan.buttons as ButtonRef[]).length > 0) return plan;

    const ctaText = (plan.ctaText || plan.cta_text) as string | undefined;
    if (!ctaText) return plan;

    const action = createActionFromHref(ctaText, "#contact", actions, "primary");
    actions.push(action);
    return {
      ...plan,
      buttons: [{ text: ctaText, actionId: action.id, style: "primary" }],
    };
  });
}

function createActionFromHref(
  label: string,
  href: string,
  existingActions: Action[],
  style: "primary" | "secondary"
): Action {
  const id = `action_${Math.random().toString(36).substring(2, 10)}`;

  // Detect action type from href
  let type: Action["type"] = "url";
  let value = href;

  if (href.startsWith("tel:")) {
    type = "phone";
    value = href.replace("tel:", "");
  } else if (href.startsWith("mailto:")) {
    type = "email";
    value = href.replace("mailto:", "");
  } else if (href.startsWith("https://wa.me/")) {
    type = "whatsapp";
    const url = new URL(href);
    value = url.pathname.replace("/", "");
  } else if (href.startsWith("#")) {
    type = "scroll";
    value = href.replace("#", "");
  }

  return { id, label, type, value, style };
}
