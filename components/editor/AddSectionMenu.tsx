"use client";

import { useState } from "react";
import { useEditor, type SectionData } from "./EditorContext";

const SECTION_TEMPLATES: Record<string, () => SectionData> = {
  hero: () => ({
    id: `section-hero-${Math.random().toString(36).substring(2, 8)}`,
    type: "hero",
    order: 0,
    content: {
      heading: "Your Headline Here",
      subheading: "A compelling subheadline that explains your value proposition",
      cta_text: "Get Started",
      cta_link: "#contact",
      secondary_cta_text: "Learn More",
      secondary_cta_link: "#features",
    },
    style: { background_color: "#2563eb", text_color: "#ffffff", padding: "80px 0" },
  }),
  features: () => ({
    id: `section-features-${Math.random().toString(36).substring(2, 8)}`,
    type: "features",
    order: 0,
    content: {
      heading: "Our Features",
      subheading: "What makes us different",
      items: [
        { title: "Feature 1", description: "Description here", icon: "⭐" },
        { title: "Feature 2", description: "Description here", icon: "🚀" },
        { title: "Feature 3", description: "Description here", icon: "💡" },
      ],
    },
    style: { background_color: "#ffffff", text_color: "#1a1a1a", padding: "60px 0" },
  }),
  testimonials: () => ({
    id: `section-testimonials-${Math.random().toString(36).substring(2, 8)}`,
    type: "testimonials",
    order: 0,
    content: {
      heading: "What Our Customers Say",
      items: [
        { quote: "Amazing service!", author: "John Doe", role: "Customer", avatar: "" },
        { quote: "Highly recommended!", author: "Jane Smith", role: "Customer", avatar: "" },
      ],
    },
    style: { background_color: "#f8f9fa", text_color: "#1a1a1a", padding: "60px 0" },
  }),
  pricing: () => ({
    id: `section-pricing-${Math.random().toString(36).substring(2, 8)}`,
    type: "pricing",
    order: 0,
    content: {
      heading: "Pricing",
      subheading: "Choose the right plan",
      plans: [
        { name: "Basic", price: "$29", period: "/month", features: ["Feature 1", "Feature 2"], cta_text: "Get Started", highlighted: false },
        { name: "Pro", price: "$59", period: "/month", features: ["All Basic", "Feature 3"], cta_text: "Get Started", highlighted: true },
      ],
    },
    style: { background_color: "#ffffff", text_color: "#1a1a1a", padding: "60px 0" },
  }),
  faq: () => ({
    id: `section-faq-${Math.random().toString(36).substring(2, 8)}`,
    type: "faq",
    order: 0,
    content: {
      heading: "Frequently Asked Questions",
      items: [
        { question: "How does it work?", answer: "It's simple and easy." },
        { question: "What's included?", answer: "Everything you need." },
      ],
    },
    style: { background_color: "#ffffff", text_color: "#1a1a1a", padding: "60px 0" },
  }),
  cta: () => ({
    id: `section-cta-${Math.random().toString(36).substring(2, 8)}`,
    type: "cta",
    order: 0,
    content: {
      heading: "Ready to Get Started?",
      subheading: "Join us today",
      button_text: "Get Started",
      button_link: "#contact",
    },
    style: { background_color: "#2563eb", text_color: "#ffffff", padding: "60px 0" },
  }),
  contact: () => ({
    id: `section-contact-${Math.random().toString(36).substring(2, 8)}`,
    type: "contact",
    order: 0,
    content: {
      heading: "Get In Touch",
      subheading: "We'd love to hear from you",
      fields: ["name", "email", "message"],
      button_text: "Send Message",
    },
    style: { background_color: "#f8f9fa", text_color: "#1a1a1a", padding: "60px 0" },
  }),
};

const sectionLabels: Record<string, string> = {
  hero: "🎯 Hero",
  features: "✨ Features",
  testimonials: "💬 Testimonials",
  pricing: "💰 Pricing",
  faq: "❓ FAQ",
  cta: "🚀 CTA",
  contact: "📧 Contact",
};

interface AddSectionMenuProps {
  index: number;
}

export default function AddSectionMenu({ index }: AddSectionMenuProps) {
  const [open, setOpen] = useState(false);
  const { addSection } = useEditor();

  const handleAdd = (type: string) => {
    const template = SECTION_TEMPLATES[type];
    if (template) {
      addSection(template(), index);
    }
    setOpen(false);
  };

  return (
    <div className="group relative flex items-center justify-center py-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 opacity-0 transition hover:border-primary-500 hover:text-primary-500 group-hover:opacity-100"
        title="Add section"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full z-30 mt-1 rounded-lg border bg-white p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-1" style={{ minWidth: "280px" }}>
            {Object.entries(sectionLabels).map(([type, label]) => (
              <button
                key={type}
                onClick={() => handleAdd(type)}
                className="rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
