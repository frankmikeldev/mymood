"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, TrendingUp, Users, User } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: TrendingUp, label: "Insights", href: "/dashboard/insights" },
  { icon: Users, label: "Community", href: "/dashboard/community" },
  { icon: User, label: "Profile", href: "/dashboard/settings" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-card)] border-t border-[var(--color-border)]">
      <div
        className="flex items-center justify-around h-16"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/dashboard/"
              : pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition"
            >
              {/* Pill indicator */}
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                  active
                    ? "bg-[var(--color-text-header)]"
                    : "bg-transparent"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-[var(--color-bg-main)]"
                      : "text-[var(--color-text-body)] opacity-50"
                  }
                />
              </div>
              <span
                className={`text-xs transition ${
                  active
                    ? "text-[var(--color-text-header)] font-medium"
                    : "text-[var(--color-text-body)] opacity-40"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}