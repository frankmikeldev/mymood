"use client";

import { useState } from "react";
import Link from "next/link";
import { Smile, Menu, X } from "lucide-react";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0b0d12]/90">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-white">
          <Smile className="w-5 h-5" />
          MyMood
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="text-white hover:text-[var(--color-accent)] transition-colors">
            Home
          </Link>
          <Link href="/login" className="text-white hover:text-[var(--color-accent)] transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-white hover:text-[var(--color-accent)] transition-colors">
            Sign Up
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
        <nav className="md:hidden mt-2 flex flex-col gap-4 px-4 pb-4 text-sm font-medium bg-[#0b0d12]/95">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-white hover:text-[var(--color-accent)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-white hover:text-[var(--color-accent)] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="text-white hover:text-[var(--color-accent)] transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      )}

    </header>
  );
}