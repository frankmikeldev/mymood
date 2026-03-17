"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard, Users, TrendingUp, MessageSquare,
  AlertTriangle, Apple, Lightbulb, FileBarChart,
  Settings, LogOut, Shield, Menu, X,
} from "lucide-react";

const supabase = createClient();

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Mood Data", href: "/admin/mood-data", icon: TrendingUp },
  { label: "Community", href: "/admin/community", icon: MessageSquare },
  { label: "Flagged", href: "/admin/flagged", icon: AlertTriangle, alert: true },
  { label: "Diet Plans", href: "/admin/diet-plans", icon: Apple },
  { label: "Wellness Tips", href: "/admin/tips", icon: Lightbulb },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAdmin() {

      // ✅ Skip auth check on login page
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!data) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setAdminRole(data.role);
      setAdminEmail(user.email || "");
      setLoading(false);
    }

    checkAdmin();
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // ✅ Render children directly on login page — no sidebar/layout
  if (pathname === "/admin/login") {
    return (
      <>
        {/* ✅ Override PWA meta for admin login */}
        <style>{`
          body { background: #0a0a0f !important; }
        `}</style>
        {children}
      </>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]"
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">Verifying admin access...</p>
      </div>
    </div>
  );

  return (
    <>
      {/* ✅ Hide public header/footer for admin pages via CSS */}
      <style>{`
        body > div > header,
        body > div > footer {
          display: none !important;
        }
        body > div > main {
          padding-top: 0 !important;
        }
      `}</style>

      <div className="min-h-screen flex bg-[#0a0a0f] text-white"
        style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto" }}
      >

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-60 bg-[#0f0f18] border-r border-white/5 z-40 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}>

          {/* Logo */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">MyMood Admin</p>
                <p className="text-xs text-violet-400 capitalize">
                  {adminRole?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    active
                      ? "bg-violet-600/20 text-violet-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.alert && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User + Logout */}
          <div className="p-3 border-t border-white/5 space-y-1">

            {/* Logged in as */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                {adminEmail?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white font-medium truncate">
                  {adminEmail || "Admin"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {adminRole?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0f0f18] border-b border-white/5">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-semibold text-sm">MyMood Admin</span>
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
              {adminEmail?.[0]?.toUpperCase() || "A"}
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}