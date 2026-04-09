"use client";

import { useState } from "react";
import Link from "next/link";
import { Smile, Menu, X } from "lucide-react";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b"
      style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#E2DDD6" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">

        {/* Top Bar */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ fontWeight: 800, fontSize: "18px", color: "#111111", fontFamily: "'Manrope', sans-serif" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#111111" }}
            >
              <Smile className="w-4 h-4" style={{ color: "#F5F0E8" }} />
            </div>
            MyMood
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex gap-8 text-sm"
            style={{ fontWeight: 500, fontFamily: "'Manrope', sans-serif" }}
          >
            <Link
              href="/dashboard"
              style={{ color: "#444444" }}
              className="hover:opacity-70 transition-opacity"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/insights"
              style={{ color: "#444444" }}
              className="hover:opacity-70 transition-opacity"
            >
              Insights
            </Link>
            <Link
              href="/dashboard/settings"
              style={{ color: "#444444" }}
              className="hover:opacity-70 transition-opacity"
            >
              Profile
            </Link>
          </nav>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-1"
            style={{ color: "#111111" }}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <nav
            className="md:hidden mt-4 flex flex-col border-t pt-4"
            style={{ borderColor: "#E2DDD6", fontFamily: "'Manrope', sans-serif" }}
          >
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="py-3 text-sm border-b hover:opacity-70 transition-opacity"
              style={{ fontWeight: 500, color: "#444444", borderColor: "#E2DDD6" }}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/insights"
              onClick={() => setOpen(false)}
              className="py-3 text-sm border-b hover:opacity-70 transition-opacity"
              style={{ fontWeight: 500, color: "#444444", borderColor: "#E2DDD6" }}
            >
              Insights
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="py-3 text-sm hover:opacity-70 transition-opacity"
              style={{ fontWeight: 500, color: "#444444" }}
            >
              Profile
            </Link>
          </nav>
        )}

      </div>
    </header>
  );
}