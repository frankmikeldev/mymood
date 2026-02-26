"use client";

import { useState, useEffect } from "react";
import { Smile, Menu, X, User, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-[#0b0d12]/95 shadow-lg border-b border-[#1f2735]"
          : "bg-[#0b0d12]/80"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 text-white">
        {/* ==== Mobile Layout ==== */}
        <div className="flex items-center justify-between w-full md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-md hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg text-white hover:opacity-90 transition"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)]">
              <Smile className="w-5 h-5 text-white" />
            </div>
            MyMood
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-white/10 transition"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-300" />
              ) : (
                <Moon className="w-6 h-6 text-white" />
              )}
            </button>
            <Link
              href="/login"
              className="p-2 rounded-md hover:bg-white/10 transition"
            >
              <User className="w-6 h-6 text-white" />
            </Link>
          </div>
        </div>

        {/* ==== Desktop Layout ==== */}
        <div className="hidden md:flex items-center justify-between w-full">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg text-white hover:opacity-90 transition"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)]">
              <Smile className="w-5 h-5 text-white" />
            </div>
            MyMood
          </Link>

          <nav className="flex gap-8 text-sm font-medium">
            {[
              ["Home", "/"],
              ["Mood", "/mood"],
              ["Tips", "/tips"],
              ["Diets", "/diets"],
              ["Settings", "/settings"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-gray-300 hover:text-white transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-white/10 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-300" />
              ) : (
                <Moon className="w-6 h-6 text-white" />
              )}
            </button>

            <Link href="/login" className="btn btn-primary text-sm font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* ==== Mobile Sidebar ==== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dim Background */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[#0b0d12] text-white shadow-2xl z-50 flex flex-col"
            >
              {/* Logo / Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                    <Smile className="w-5 h-5 text-white" />
                  </div>
                  MyMood
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-white/10 transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Navigation Links with Accent Background */}
              <nav className="flex flex-col gap-4 text-sm font-medium bg-[var(--color-accent)] flex-1 p-6">
                {[
                  ["Home", "/"],
                  ["Mood", "/mood"],
                  ["Tips", "/tips"],
                  ["Diets", "/diets"],
                  ["Settings", "/settings"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/90 hover:text-white transition"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Footer Controls */}
              <div className="p-6 border-t border-white/20 flex items-center justify-between bg-[#0b0d12]">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-white/10 transition"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-yellow-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-white" />
                  )}
                </button>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition"
                >
                  <User className="w-5 h-5" /> Login
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
