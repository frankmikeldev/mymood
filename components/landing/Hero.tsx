"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const AVATARS = [
  { letter: "A", bg: "#333" },
  { letter: "J", bg: "#444" },
  { letter: "F", bg: "#E8521A" },
  { letter: "K", bg: "#555" },
  { letter: "N", bg: "#D4480F" },
];

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-28 pb-16">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* LEFT — text */}
        <div className="flex-1 text-center md:text-left">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs mb-6"
            style={{ borderColor: "#D8D1C4", backgroundColor: "#E6E0D5", color: "#6b7280", fontWeight: 500 }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#E8521A" }} />
            Mental wellness for everyone
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl leading-[1.08] mb-5"
            style={{ fontWeight: 800, color: "#1a1a1a", fontFamily: "'Manrope', sans-serif" }}
          >
            Your mind<br />
            deserves a<br />
            <span style={{ color: "#E8521A" }}>daily check-in</span>
          </motion.h1>

          {/* Bold subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto md:mx-0 mb-3"
            style={{ fontSize: "22px", fontWeight: 700, color: "#222222", lineHeight: 1.65, fontFamily: "'Manrope', sans-serif" }}
          >
            Completely anonymous. No stigma. No limits.
          </motion.p>

          {/* Body paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-md mx-auto md:mx-0 mb-8"
            style={{ fontSize: "17px", fontWeight: 400, color: "#6b7280", lineHeight: 1.7, fontFamily: "'Manrope', sans-serif" }}
          >
            Track your mood, reflect with AI, connect with others, and discover
            what actually makes you feel better — all in one beautifully simple app.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 justify-center md:justify-start flex-wrap mb-10"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                fontWeight: 700,
                fontSize: "15px",
                backgroundColor: "#E8521A",
                boxShadow: "0 4px 20px rgba(232, 82, 26, 0.35)",
                fontFamily: "'Manrope', sans-serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
            >
              Start for free
              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <Link
              href="/login"
              style={{ fontSize: "15px", fontWeight: 500, color: "#6b7280", fontFamily: "'Manrope', sans-serif" }}
              className="hover:underline transition-all"
            >
              Already have an account
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 justify-center md:justify-start flex-wrap"
          >
            <div className="flex">
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs"
                  style={{
                    background: a.bg,
                    borderColor: "#F5F0E8",
                    marginLeft: i !== 0 ? "-10px" : "0",
                    fontWeight: 600,
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {a.letter}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs" style={{ color: "#E8521A" }}>★★★★★</div>
              <div className="text-xs" style={{ color: "#6b7280", fontFamily: "'Manrope', sans-serif" }}>
                <span style={{ color: "#1a1a1a", fontWeight: 600 }}>2,800+ people</span>{" "}
                tracking daily
              </div>
            </div>
          </motion.div>

        </div>

      <motion.div className="flex-1 w-full">
  <div
    className="relative w-full rounded-3xl overflow-hidden"
    style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.10)" }}
  >
    <Image
      src="/images/h.png"
      alt="MyMood wellness"
      width={600}
      height={600}
      className="w-full h-auto object-contain rounded-3xl"
      priority
    />
  </div>
</motion.div>

      </div>
    </section>
  );
}