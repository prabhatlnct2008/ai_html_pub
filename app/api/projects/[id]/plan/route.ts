import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

// Get plan
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pagePlan: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  if (!project.pagePlan) {
    return errorResponse("No plan found", 404);
  }

  return jsonResponse({
    planData: JSON.parse(project.pagePlan.planData),
    status: project.pagePlan.status,
    version: project.pagePlan.version,
  });
}
