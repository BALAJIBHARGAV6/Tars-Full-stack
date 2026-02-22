/* ========================================================
   AUTH LAYOUT - Minimal wrapper, each page owns its layout
   ======================================================== */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
