import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import PublishedPageClient from "./PublishedPageClient";
import { renderOnRead } from "@/lib/site/render-helpers";
import { saveRenderFailureArtifact } from "@/lib/agents/artifacts";
import { lazyRepairPageDocument } from "@/lib/page/lazy-repair";

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

  // Draft gating: page.status is canonical, doc.meta.publishStatus as fallback
  if (page.status === "draft" && !isOwner) {
    notFound();
  }
  if (page.documentJson && page.documentJson !== "{}") {
    const doc = JSON.parse(page.documentJson);
    if (doc.meta?.publishStatus === "draft" && !isOwner) {
      notFound();
    }
  }

  // Render on read: re-render from documentJson for freshest output
  // Compose with site shell (header/footer/nav) from siteSettings
  let siteSettings = null;
  if (project.siteSettings && project.siteSettings !== "{}") {
    try { siteSettings = JSON.parse(project.siteSettings); } catch { /* ignore */ }
  }
  const { html, renderError, normalizationFixes } = renderOnRead(
    page.documentJson,
    page.renderedHtml,
    siteSettings,
    { projectSlug: slug },
    true
  );

  // Lazy repair: persist normalized document back to DB if fixes were applied
  if (normalizationFixes.length > 0) {
    lazyRepairPageDocument(page.id, page.documentJson, normalizationFixes).catch(() => {});
  }

  // Persist render failure as artifact (deduplicated, attributed to correct run)
  if (renderError) {
    saveRenderFailureArtifact({
      projectId: project.id,
      pageSlug: page.slug,
      pageUpdatedAt: page.updatedAt,
      error: renderError,
    }).catch(() => {}); // fire-and-forget
  }

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

  // Draft gating for metadata: page.status is canonical, doc.meta as fallback
  if (homePage?.status === "draft") {
    const auth = await getCurrentUser();
    const isOwner = auth?.userId === project.userId;
    if (!isOwner) {
      return { title: "Page Not Found" };
    }
  } else if (homePage?.documentJson && homePage.documentJson !== "{}") {
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
