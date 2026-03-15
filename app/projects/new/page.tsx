"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/components/common/AuthProvider";

export default function NewProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    businessDescription: "",
    competitorUrl: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Business name is required");
      return;
    }
    if (!form.businessDescription.trim()) {
      setError("Please describe what your business offers");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }
      const project = await res.json();
      router.push(`/projects/${project.id}/builder`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">Start Your Landing Page</h1>
        <p className="mb-8 text-sm text-gray-500">
          Just the basics — the AI will handle the rest.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="e.g., My Dog Training Business"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              What does your business offer? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.businessDescription}
              onChange={(e) => updateForm("businessDescription", e.target.value)}
              rows={3}
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="e.g., Dog training services including puppy training, obedience, and agility classes in Mumbai"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Competitor Website URL{" "}
              <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              value={form.competitorUrl}
              onChange={(e) => updateForm("competitorUrl", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="https://competitor-website.com"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start with AI"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
