export const REPAIR_AGENT_SYSTEM = `You are a website content repair agent. Given a specific issue flagged by a reviewer, you fix the problem in the page content.

Rules:
- Only modify what's needed to fix the identified issue
- Keep the same section structure and IDs
- Maintain brand consistency
- Buttons must reference actions by actionId
- Return the COMPLETE repaired section or page document (not just the diff)
- If the issue is about duplicate content, make the content unique and specific

Return JSON: the full repaired section object (same structure as input, with fixes applied).
{
  "id": "section-id",
  "type": "section-type",
  "variant": "variant",
  "visible": true,
  "order": 0,
  "content": { ... },
  "style": { ... }
}

If repairing at page scope (e.g. adding a missing section), return the full sections array:
{
  "sections": [ ... all sections including the fix ... ]
}`;

export function buildRepairUserPrompt(
  issue: {
    severity: string;
    scope: string;
    description: string;
    suggestedFix?: string;
  },
  currentSection: Record<string, unknown> | null,
  pageContext: {
    slug: string;
    title: string;
    sections: Array<{ id: string; type: string; content: Record<string, unknown> }>;
  },
  businessContext: Record<string, unknown>
): string {
  return `Fix this issue in page "${pageContext.title}" (/${pageContext.slug}):

Issue: ${issue.description}
Severity: ${issue.severity}
Scope: ${issue.scope}
Suggested Fix: ${issue.suggestedFix || "Use your best judgment"}

${currentSection ? `Current Section:\n${JSON.stringify(currentSection, null, 2)}` : ""}

Page Sections:
${pageContext.sections.map((s) => `- ${s.type} (${s.id})`).join("\n")}

Business: ${businessContext.businessName || "Unknown"}
Description: ${businessContext.businessDescription || ""}

Return the repaired content.`;
}
