"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/components/common/AuthProvider";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Project {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  building: "bg-blue-100 text-blue-800",
  generated: "bg-green-100 text-green-800",
  published: "bg-purple-100 text-purple-800",
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchProjects();
  }, [user, authLoading, router]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        setProjects(await res.json());
      } else {
        setError("Failed to load projects");
      }
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getProjectLink = (project: Project) => {
    switch (project.status) {
      case "generated":
      case "published":
        return `/projects/${project.id}/editor`;
      default:
        return `/projects/${project.id}/builder`;
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner className="mt-20" />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your landing pages
            </p>
          </div>
          <Link
            href="/projects/new"
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            + Create New Page
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed bg-white py-16 text-center">
            <div className="mb-4 text-4xl">🚀</div>
            <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
            <p className="mb-6 text-sm text-gray-500">
              Create your first AI-powered landing page
            </p>
            <Link
              href="/projects/new"
              className="inline-block rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
            >
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold">{project.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[project.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mb-4 text-xs text-gray-400">
                  Updated{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={getProjectLink(project)}
                    className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100"
                  >
                    {project.status === "generated" || project.status === "published"
                      ? "Edit"
                      : "Continue"}
                  </Link>
                  {(project.status === "generated" ||
                    project.status === "published") && (
                    <Link
                      href={`/p/${project.slug}`}
                      target="_blank"
                      className="rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      View Page
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
