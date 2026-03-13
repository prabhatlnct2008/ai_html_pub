import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  const auth = await getCurrentUser();
  if (!auth) {
    return errorResponse("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return errorResponse("User not found", 404);
  }

  return jsonResponse(user);
}
