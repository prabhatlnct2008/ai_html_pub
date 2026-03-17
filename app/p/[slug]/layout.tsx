/**
 * Layout for published pages — overrides the root layout's
 * min-h-screen / bg-gray-50 so the iframe can size to its content.
 */
export default function PublishedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-0 bg-white">{children}</div>;
}
