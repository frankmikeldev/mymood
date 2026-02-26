"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProfileDropdown() {
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 w-full hover:bg-[var(--color-bg-badge)] 
                   rounded-lg transition-all"
      >
        <Image
          src="/avatar-placeholder.png"
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full border border-[var(--color-border)]"
        />
        <span className="text-[var(--color-text-header)] font-medium hidden sm:inline">
          Profile
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-12 left-0 w-48 
                       bg-[var(--color-bg-card)] border border-[var(--color-border)] 
                       shadow-lg rounded-xl overflow-hidden z-50"
          >
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 
                         text-[var(--color-text-body)] hover:bg-[var(--color-bg-badge)]"
            >
              <User className="w-4 h-4" /> My Profile
            </button>
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 
                         text-[var(--color-text-body)] hover:bg-[var(--color-bg-badge)]"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 
                         text-red-500 hover:bg-[var(--color-bg-badge)]"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
