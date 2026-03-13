export function buildSectionUpdatePrompt(
  currentSection: Record<string, unknown>,
  businessContext: Record<string, unknown>,
  userInstructions: string
): string {
  return `Update this landing page section based on the user's instructions.

CURRENT SECTION:
${JSON.stringify(currentSection, null, 2)}

BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}

USER INSTRUCTIONS: "${userInstructions}"

Return the COMPLETE updated section JSON (same structure, same id, same type).
Only change what the user requested. Keep everything else the same.
Respond with ONLY valid JSON.`;
}
