"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0b0d12]/95 border-b border-[#1f2735]">
      <div className="max-w-6xl mx-auto px-4 py-4">

        {/* Top Bar */}
        <div className="flex items-center justify-between text-white">

          <h1 className="font-semibold text-lg">MyMood</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link
              href="/dashboard"
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/history"
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              History
            </Link>
            <Link
              href="/dashboard/insights"
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              Profile
            </Link>
          </nav>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <nav className="md:hidden mt-4 flex flex-col gap-4 text-sm font-medium">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/history"
              onClick={() => setOpen(false)}
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
            
            </Link>
            <Link
              href="/dashboard/insights"
              onClick={() => setOpen(false)}
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="text-white hover:text-[var(--color-accent)] transition-colors"
            >
              Profile
            </Link>
          </nav>
        )}

      </div>
    </header>
  );
}