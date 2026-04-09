"use client";

import { useState } from "react";
import Link from "next/link";
import { Smile, Menu, X } from "lucide-react";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b"
      style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#E2DDD6" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg hover:opacity-80 transition-opacity"
          style={{ fontWeight: 800, color: "#111111", fontFamily: "'Manrope', sans-serif" }}
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
          className="hidden md:flex items-center gap-8 text-sm"
          style={{ fontWeight: 500, fontFamily: "'Manrope', sans-serif" }}
        >
          <Link href="/" style={{ color: "#444444" }} className="hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link href="/about" style={{ color: "#444444" }} className="hover:opacity-70 transition-opacity">
            About
          </Link>
          <Link href="/privacy" style={{ color: "#444444" }} className="hover:opacity-70 transition-opacity">
            Privacy
          </Link>
          <Link href="/terms" style={{ color: "#444444" }} className="hover:opacity-70 transition-opacity">
            Terms
          </Link>
          <Link href="/login" style={{ color: "#444444" }} className="hover:opacity-70 transition-opacity">
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontWeight: 700,
              backgroundColor: "#E8521A",
              boxShadow: "0 4px 20px rgba(232,82,26,0.35)",
              fontFamily: "'Manrope', sans-serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
          >
            Get Started
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
          className="md:hidden flex flex-col gap-1 px-6 pb-5 pt-1 border-t"
          style={{ backgroundColor: "rgba(255,255,255,0.98)", borderColor: "#E2DDD6" }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/login", label: "Login" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm border-b transition-opacity hover:opacity-70"
              style={{
                fontWeight: 500,
                color: "#444444",
                fontFamily: "'Manrope', sans-serif",
                borderColor: "#E2DDD6",
              }}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white text-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{
              fontWeight: 700,
              backgroundColor: "#E8521A",
              fontFamily: "'Manrope', sans-serif",
              boxShadow: "0 4px 20px rgba(232,82,26,0.35)",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
}