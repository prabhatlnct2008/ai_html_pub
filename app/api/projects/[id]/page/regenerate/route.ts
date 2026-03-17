import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { regenerateSection } from "@/lib/ai/section-updater";
import type { SectionData } from "@/lib/ai/generator";

// Regenerate a single section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pages: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  // Legacy compat: find homepage or first page
  const page = project.pages.find((p) => p.isHomepage) || project.pages[0];
  if (!page) {
    return errorResponse("No page found", 404);
  }

  const body = await request.json();
  const { sectionId, instructions } = body;

  if (!sectionId) {
    return errorResponse("Section ID is required");
  }

  const sections = JSON.parse(page.sectionsJson) as SectionData[];
  const sectionIndex = sections.findIndex((s) => s.id === sectionId);

  if (sectionIndex === -1) {
    return errorResponse("Section not found");
  }

  const currentSection = sections[sectionIndex];
  const businessContext = JSON.parse(project.businessContext);

  const updated = await regenerateSection(
    currentSection,
    businessContext,
    instructions || "Improve this section"
  );

  if (!updated) {
    return errorResponse("Failed to regenerate section. Please try again.", 500);
  }

  // Replace section in array
  sections[sectionIndex] = updated;

  return jsonResponse({
    section: updated,
    sections, // Return full array so frontend can update state
  });
}
