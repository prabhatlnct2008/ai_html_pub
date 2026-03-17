import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { unlink } from "fs/promises";
import path from "path";

// Update asset (alt text, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id, assetId } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const asset = await prisma.asset.findFirst({
    where: { id: assetId, projectId: id },
  });
  if (!asset) {
    return errorResponse("Asset not found", 404);
  }

  const body = await request.json();
  const { altText } = body;

  const updated = await prisma.asset.update({
    where: { id: assetId },
    data: {
      ...(altText !== undefined ? { altText } : {}),
    },
  });

  return jsonResponse({ asset: updated });
}

// Delete asset (DB record + file cleanup + section reference cleanup)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id, assetId } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pages: true },
  });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }
  // Legacy compat: find homepage or first page
  const page = project.pages.find((p) => p.isHomepage) || project.pages[0];

  const asset = await prisma.asset.findFirst({
    where: { id: assetId, projectId: id },
  });
  if (!asset) {
    return errorResponse("Asset not found", 404);
  }

  // Delete file from disk if it's an upload
  if (asset.source === "upload" && asset.url.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", asset.url);
      await unlink(filePath);
    } catch {
      // File may already be gone — that's OK
    }
  }

  // Clean references from documentJson if it exists
  if (page?.documentJson && page.documentJson !== "{}") {
    try {
      const doc = JSON.parse(page.documentJson);
      let changed = false;

      if (doc.sections) {
        doc.sections = doc.sections.map((section: Record<string, unknown>) => {
          const content = { ...(section.content as Record<string, unknown>) };

          // Clear heroImageId
          if (content.heroImageId === assetId) {
            delete content.heroImageId;
            changed = true;
          }

          // Clear item-level imageIds
          const items = content.items as Array<Record<string, unknown>> | undefined;
          if (items) {
            content.items = items.map((item) => {
              if (item.imageId === assetId) { changed = true; return { ...item, imageId: undefined }; }
              if (item.avatarImageId === assetId) { changed = true; return { ...item, avatarImageId: undefined }; }
              return item;
            });
          }

          // Clear gallery image refs
          const images = content.images as Array<Record<string, unknown>> | undefined;
          if (images) {
            content.images = images.map((img) => {
              if (img.imageId === assetId) { changed = true; return { ...img, imageId: undefined }; }
              return img;
            });
          }

          // Clear member imageIds
          const members = content.members as Array<Record<string, unknown>> | undefined;
          if (members) {
            content.members = members.map((m) => {
              if (m.imageId === assetId) { changed = true; return { ...m, imageId: undefined }; }
              return m;
            });
          }

          // Clean section-level asset refs
          const sectionAssets = section.assets as Record<string, unknown> | undefined;
          if (sectionAssets?.imageIds) {
            const ids = sectionAssets.imageIds as string[];
            const filtered = ids.filter((aid) => aid !== assetId);
            if (filtered.length !== ids.length) {
              changed = true;
              return { ...section, content, assets: { ...sectionAssets, imageIds: filtered } };
            }
          }

          return { ...section, content };
        });
      }

      // Remove from doc.assets
      if (doc.assets) {
        const before = doc.assets.length;
        doc.assets = doc.assets.filter((a: { id: string }) => a.id !== assetId);
        if (doc.assets.length !== before) changed = true;
      }

      if (changed) {
        await prisma.page.update({
          where: { id: page!.id },
          data: { documentJson: JSON.stringify(doc) },
        });
      }
    } catch {
      // Document cleanup is best-effort
    }
  }

  // Delete the asset record
  await prisma.asset.delete({ where: { id: assetId } });

  return jsonResponse({ deleted: true });
}
