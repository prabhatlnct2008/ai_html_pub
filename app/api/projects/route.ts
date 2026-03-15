import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

// List user's projects
export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const projects = await prisma.project.findMany({
    where: { userId: auth.user.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return jsonResponse(projects);
}

// Create a new project
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const { name, businessDescription, competitorUrl } = body;

  if (!name) {
    return errorResponse("Project name is required");
  }

  const baseSlug = generateSlug(name);
  if (!baseSlug) {
    return errorResponse("Invalid project name");
  }

  const slug = await ensureUniqueSlug(baseSlug);

  // Minimal kickoff: only name + description + optional URL
  // AI will infer businessType, targetAudience, primaryCta, etc.
  const businessContext = {
    businessName: name,
    businessType: businessDescription || "",
    businessDescription: businessDescription || "",
    competitorUrl: competitorUrl || "",
    targetAudience: "",
    primaryCta: "",
    secondaryCta: "",
    // Signal that this project uses the new kickoff flow
    _kickoff: {
      status: "pending" as const,
      inferredAt: null as string | null,
      summary: null as string | null,
      confidence: {} as Record<string, string>,
      questions: [] as Array<Record<string, unknown>>,
      currentQuestionIndex: 0,
    },
  };

  const project = await prisma.project.create({
    data: {
      userId: auth.user.userId,
      name,
      slug,
      status: "draft",
      businessContext: JSON.stringify(businessContext),
    },
  });

  // Create conversation for the project
  await prisma.conversation.create({
    data: {
      projectId: project.id,
      messages: JSON.stringify([]),

      aiContext: JSON.stringify(businessContext),
    },
  });

  return jsonResponse(project, 201);
}
