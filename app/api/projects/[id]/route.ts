import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

// Get a single project with all related data
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      conversation: true,
      pagePlan: true,
      page: true,
    },
  });

  if (!project) {
    return errorResponse("Project not found", 404);
  }

  if (project.userId !== auth.user.userId) {
    return errorResponse("Forbidden", 403);
  }

  return jsonResponse(project);
}

// Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const body = await request.json();
  const updated = await prisma.project.update({
    where: { id },
    data: {
      name: body.name ?? project.name,
      status: body.status ?? project.status,
      businessContext: body.businessContext
        ? JSON.stringify(body.businessContext)
        : project.businessContext,
      competitorData: body.competitorData
        ? JSON.stringify(body.competitorData)
        : project.competitorData,
    },
  });

  return jsonResponse(updated);
}
