import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

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

  // Inject edit button for owner
  let html = project.page.renderedHtml;
  if (isOwner) {
    const editButton = `
      <div style="position: fixed; bottom: 24px; right: 24px; z-index: 9999;">
        <a href="/projects/${project.id}/editor"
           style="display: inline-flex; align-items: center; gap: 8px; background: #2563eb; color: white; padding: 12px 24px; border-radius: 10px; font-family: system-ui; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 12px rgba(37,99,235,0.4); transition: background 0.2s;"
           onmouseover="this.style.background='#1d4ed8'"
           onmouseout="this.style.background='#2563eb'">
          ✏️ Edit Page
        </a>
      </div>`;
    html = html.replace("</body>", `${editButton}</body>`);
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
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
