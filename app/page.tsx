import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-primary-600">PageCraft AI</h1>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-extrabold leading-tight">
            Create Stunning Landing Pages
            <br />
            <span className="text-primary-200">with AI Assistance</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100">
            Describe your business, and our AI will generate a professional
            landing page for you. Edit it visually, no coding required.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
          >
            Start Building for Free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="mb-12 text-center text-3xl font-bold">
            How It Works
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Describe Your Business",
                description:
                  "Tell our AI about your business, audience, and goals. Optionally share competitor websites for inspiration.",
              },
              {
                step: "2",
                title: "AI Generates Your Page",
                description:
                  "Our AI creates a structured plan, then generates a complete landing page tailored to your needs.",
              },
              {
                step: "3",
                title: "Edit & Publish",
                description:
                  "Use the visual editor to customize text, images, and sections. Save and publish your page instantly.",
              },
            ].map((feature) => (
              <div
                key={feature.step}
                className="rounded-xl border bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                  {feature.step}
                </div>
                <h4 className="mb-3 text-xl font-semibold">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="mb-4 text-3xl font-bold">Ready to Get Started?</h3>
          <p className="mb-8 text-gray-400">
            Create your first landing page in minutes, not hours.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-primary-700"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PageCraft AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
