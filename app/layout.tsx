import type { Metadata } from "next";
import { AuthProvider } from "@/components/common/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Landing Page Generator",
  description:
    "Create beautiful landing pages with AI assistance. No coding required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
