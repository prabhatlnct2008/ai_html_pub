/**
 * Layout for published pages — overrides the root layout's
 * min-h-screen / bg-gray-50 so the iframe sizes to its content
 * without extra background space.
 */
export default function PublishedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Override body styles from root layout for published pages */}
      <style>{`body { min-height: 0 !important; background: #fff !important; }`}</style>
      {children}
    </>
  );
}
