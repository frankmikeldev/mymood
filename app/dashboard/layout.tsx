import DashboardHeader from "@/components/layout/DashboardHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <DashboardHeader />
      <main className="pt-20 px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}