import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import PublishedPageClient from "./PublishedPageClient";
import { renderOnRead } from "@/lib/site/render-helpers";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublishedPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { pages: true },
  });

  // Find homepage or first page
  const page = project?.pages.find((p) => p.isHomepage) || project?.pages[0];

  if (!project || !page) {
    notFound();
  }

  const auth = await getCurrentUser();
  const isOwner = auth?.userId === project.userId;

  // Enforce publish gating: draft pages only visible to owner
  if (page.documentJson && page.documentJson !== "{}") {
    const doc = JSON.parse(page.documentJson);
    if (doc.meta?.publishStatus === "draft" && !isOwner) {
      notFound();
    }
  }

  // Render on read: re-render from documentJson for freshest output
  const html = renderOnRead(page.documentJson, page.renderedHtml);
  if (!html) notFound();

  return (
    <PublishedPageClient
      html={html}
      isOwner={isOwner}
      projectId={project.id}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { pages: true, pagePlan: true },
  });

  if (!project) return { title: "Page Not Found" };

  const homePage = project.pages.find((p) => p.isHomepage) || project.pages[0];

  // Enforce publish gating for metadata too
  if (homePage?.documentJson && homePage.documentJson !== "{}") {
    const doc = JSON.parse(homePage.documentJson);
    if (doc.meta?.publishStatus === "draft") {
      const auth = await getCurrentUser();
      const isOwner = auth?.userId === project.userId;
      if (!isOwner) {
        return { title: "Page Not Found" };
      }
    }
  }

  const planData = project.pagePlan
    ? JSON.parse(project.pagePlan.planData)
    : null;

  return {
    title: planData?.page_meta?.title || project.name,
    description: planData?.page_meta?.description || "",
  };
}
