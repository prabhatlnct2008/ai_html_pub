import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import PublishedPageClient from "../PublishedPageClient";
import { renderOnRead } from "@/lib/site/render-helpers";
import { saveArtifact } from "@/lib/agents/artifacts";

interface Props {
  params: Promise<{ slug: string; pageSlug: string }>;
}

export default async function PublishedSubPage({ params }: Props) {
  const { slug, pageSlug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) notFound();

  // Find the specific page by slug within this project
  const page = await prisma.page.findUnique({
    where: { projectId_slug: { projectId: project.id, slug: pageSlug } },
  });

  if (!page) notFound();

  const auth = await getCurrentUser();
  const isOwner = auth?.userId === project.userId;

  // Draft gating
  if (page.status === "draft" && !isOwner) {
    notFound();
  }

  if (page.documentJson && page.documentJson !== "{}") {
    const doc = JSON.parse(page.documentJson);
    if (doc.meta?.publishStatus === "draft" && !isOwner) {
      notFound();
    }
  }

  // Render on read with site shell composition
  let siteSettings = null;
  if (project.siteSettings && project.siteSettings !== "{}") {
    try { siteSettings = JSON.parse(project.siteSettings); } catch { /* ignore */ }
  }
  const { html, renderError } = renderOnRead(
    page.documentJson,
    page.renderedHtml,
    siteSettings,
    { projectSlug: slug },
    true
  );

  // Persist render failure as artifact (fire-and-forget, tied to most recent run)
  if (renderError) {
    const latestRun = await prisma.generationRun.findFirst({
      where: { projectId: project.id },
      orderBy: { startedAt: "desc" },
      select: { id: true },
    });
    if (latestRun) {
      saveArtifact({
        projectId: project.id,
        generationRunId: latestRun.id,
        artifactType: "render_failure",
        phase: "render_on_read",
        status: "failure",
        payloadJson: { pageSlug, error: renderError },
        pageSlug,
        sourceAgent: "renderOnRead",
        error: renderError,
      }).catch(() => {}); // fire-and-forget
    }
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
  const { slug, pageSlug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return { title: "Page Not Found" };

  const page = await prisma.page.findUnique({
    where: { projectId_slug: { projectId: project.id, slug: pageSlug } },
  });

  if (!page) return { title: "Page Not Found" };

  // Use page-level meta from documentJson
  if (page.documentJson && page.documentJson !== "{}") {
    try {
      const doc = JSON.parse(page.documentJson);
      return {
        title: doc.meta?.title || page.title || project.name,
        description: doc.meta?.description || "",
      };
    } catch {
      // fall through
    }
  }

  return {
    title: page.title || project.name,
    description: "",
  };
}
