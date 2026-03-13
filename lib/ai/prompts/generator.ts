export function buildSectionGeneratorPrompt(
  sectionType: string,
  sectionDescription: string,
  businessContext: Record<string, unknown>,
  branding: Record<string, unknown>,
  existingSections: string[]
): string {
  const schemas: Record<string, string> = {
    hero: `{
  "id": "uuid",
  "type": "hero",
  "order": 0,
  "content": {
    "heading": "Main headline (powerful, concise)",
    "subheading": "Supporting text (1-2 sentences)",
    "cta_text": "Button text",
    "cta_link": "#contact",
    "secondary_cta_text": "Optional second button text or empty string",
    "secondary_cta_link": "#features"
  },
  "style": {
    "background_color": "#hex from branding",
    "text_color": "#ffffff or appropriate contrast",
    "padding": "80px 0"
  }
}`,
    features: `{
  "id": "uuid",
  "type": "features",
  "order": 0,
  "content": {
    "heading": "Section heading",
    "subheading": "Brief intro text",
    "items": [
      {"title": "Feature 1", "description": "Description", "icon": "emoji"},
      {"title": "Feature 2", "description": "Description", "icon": "emoji"},
      {"title": "Feature 3", "description": "Description", "icon": "emoji"}
    ]
  },
  "style": {
    "background_color": "#ffffff",
    "text_color": "#1a1a1a",
    "padding": "60px 0"
  }
}`,
    testimonials: `{
  "id": "uuid",
  "type": "testimonials",
  "order": 0,
  "content": {
    "heading": "Section heading",
    "items": [
      {"quote": "Testimonial text", "author": "Name", "role": "Title/Company", "avatar": ""},
      {"quote": "Testimonial text", "author": "Name", "role": "Title/Company", "avatar": ""}
    ]
  },
  "style": {
    "background_color": "#f8f9fa",
    "text_color": "#1a1a1a",
    "padding": "60px 0"
  }
}`,
    pricing: `{
  "id": "uuid",
  "type": "pricing",
  "order": 0,
  "content": {
    "heading": "Section heading",
    "subheading": "Brief pricing intro",
    "plans": [
      {
        "name": "Plan name",
        "price": "$XX",
        "period": "/month or one-time",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "cta_text": "Get Started",
        "highlighted": false
      }
    ]
  },
  "style": {
    "background_color": "#ffffff",
    "text_color": "#1a1a1a",
    "padding": "60px 0"
  }
}`,
    faq: `{
  "id": "uuid",
  "type": "faq",
  "order": 0,
  "content": {
    "heading": "Frequently Asked Questions",
    "items": [
      {"question": "Question?", "answer": "Answer text"},
      {"question": "Question?", "answer": "Answer text"}
    ]
  },
  "style": {
    "background_color": "#ffffff",
    "text_color": "#1a1a1a",
    "padding": "60px 0"
  }
}`,
    cta: `{
  "id": "uuid",
  "type": "cta",
  "order": 0,
  "content": {
    "heading": "Call to action heading",
    "subheading": "Supporting text",
    "button_text": "Button text",
    "button_link": "#contact"
  },
  "style": {
    "background_color": "#primary from branding",
    "text_color": "#ffffff",
    "padding": "60px 0"
  }
}`,
    contact: `{
  "id": "uuid",
  "type": "contact",
  "order": 0,
  "content": {
    "heading": "Get In Touch",
    "subheading": "Supporting text",
    "fields": ["name", "email", "message"],
    "button_text": "Send Message"
  },
  "style": {
    "background_color": "#f8f9fa",
    "text_color": "#1a1a1a",
    "padding": "60px 0"
  }
}`,
  };

  const schema = schemas[sectionType] || schemas["cta"];

  return `Generate content for a "${sectionType}" section of a landing page.

BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}

BRANDING:
${JSON.stringify(branding, null, 2)}

SECTION PURPOSE: ${sectionDescription}

OTHER SECTIONS ON THE PAGE: ${existingSections.join(", ")}

Generate a unique "id" field (use a format like "section-${sectionType}-xxxx" where xxxx is random).

RESPOND WITH ONLY VALID JSON matching this schema:
${schema}

RULES:
- Content must be specific to this business, not generic placeholder text
- Use the branding colors appropriately
- Do not repeat content from other sections
- Keep text concise and impactful
- Generate realistic, professional content`;
}
