"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep this so all dashboard routes share theme + structure
  return <>{children}</>;
}
