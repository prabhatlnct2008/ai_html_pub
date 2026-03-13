"use client";

interface PlanData {
  sections: Array<{ type: string; description: string }>;
  branding: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    tone: string;
  };
  page_meta: {
    title: string;
    description: string;
  };
}

interface PlanViewerProps {
  plan: PlanData;
  status: string;
}

const sectionIcons: Record<string, string> = {
  hero: "🎯",
  features: "✨",
  testimonials: "💬",
  pricing: "💰",
  faq: "❓",
  cta: "🚀",
  contact: "📧",
};

export default function PlanViewer({ plan, status }: PlanViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Page Plan</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {plan.sections.map((section, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border bg-white p-3"
          >
            <span className="text-lg">{sectionIcons[section.type] || "📄"}</span>
            <div>
              <div className="text-sm font-medium capitalize">
                {section.type}
              </div>
              <div className="text-xs text-gray-500">{section.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Branding */}
      {plan.branding && (
        <div className="rounded-lg border bg-white p-4">
          <h4 className="mb-2 text-sm font-medium">Branding</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: plan.branding.primary_color }}
              />
              <span>Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: plan.branding.secondary_color }}
              />
              <span>Secondary</span>
            </div>
            <div className="text-gray-500">
              Font: {plan.branding.font_family}
            </div>
            <div className="text-gray-500 capitalize">
              Tone: {plan.branding.tone}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
