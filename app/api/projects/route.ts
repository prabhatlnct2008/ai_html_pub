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
  const { name, businessDescription, competitorUrl, targetAudience, primaryCta, secondaryCta } = body;

  if (!name) {
    return errorResponse("Project name is required");
  }

  const baseSlug = generateSlug(name);
  if (!baseSlug) {
    return errorResponse("Invalid project name");
  }

  const slug = await ensureUniqueSlug(baseSlug);

  const businessContext = {
    businessDescription: businessDescription || "",
    competitorUrl: competitorUrl || "",
    targetAudience: targetAudience || "",
    primaryCta: primaryCta || "",
    secondaryCta: secondaryCta || "",
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
      workflowState: "intake",
      aiContext: JSON.stringify(businessContext),
    },
  });

  return jsonResponse(project, 201);
}
