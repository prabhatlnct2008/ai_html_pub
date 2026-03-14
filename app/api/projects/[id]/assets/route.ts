import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// List project assets
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const assets = await prisma.asset.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });

  return jsonResponse({ assets });
}

// Upload asset
export async function POST(
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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const altText = formData.get("altText") as string | null;

  if (!file) {
    return errorResponse("No file provided");
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return errorResponse("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG");
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return errorResponse("File too large. Maximum 5MB");
  }

  // Create upload directory
  const uploadDir = path.join(process.cwd(), "public", "uploads", id);
  await mkdir(uploadDir, { recursive: true });

  // Generate safe filename
  const ext = path.extname(file.name) || ".png";
  const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadDir, safeName);

  // Write file
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  // Create asset record
  const asset = await prisma.asset.create({
    data: {
      projectId: id,
      kind: "image",
      source: "upload",
      url: `/uploads/${id}/${safeName}`,
      altText: altText || file.name,
    },
  });

  return jsonResponse({ asset }, 201);
}
