import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import PublishedPageClient from "./PublishedPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublishedPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { page: true },
  });

  if (!project || !project.page || !project.page.renderedHtml) {
    notFound();
  }

  const auth = await getCurrentUser();
  const isOwner = auth?.userId === project.userId;

  return (
    <PublishedPageClient
      html={project.page.renderedHtml}
      isOwner={isOwner}
      projectId={project.id}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { pagePlan: true },
  });

  if (!project) return { title: "Page Not Found" };

  const planData = project.pagePlan
    ? JSON.parse(project.pagePlan.planData)
    : null;

  return {
    title: planData?.page_meta?.title || project.name,
    description: planData?.page_meta?.description || "",
  };
}
