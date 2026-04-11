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

const font = "'Manrope', sans-serif";

export default function Hero() {
  return (
    <section
      className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-28 pb-16"
      style={{ backgroundColor: "#F5F2EB" }}
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* LEFT — text */}
        <div className="flex-1 text-left">

          {/* Headline — Wysa style: plain line + orange block highlight */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontWeight: 800,
              fontSize: "clamp(40px, 6vw, 64px)",
              color: "#1A1A1A",
              fontFamily: font,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "28px",
            }}
          >
            Your mind<br />
            deserves a<br />
            {/* Orange block highlight — exactly like Wysa "redefined" */}
            <span
              style={{
                display: "inline",
                backgroundColor: "#E8521A",
                color: "#FFFFFF",
                padding: "2px 10px 4px",
                borderRadius: "4px",
              }}
            >
              daily check-in
            </span>
          </motion.h1>

          {/* Bold subline — Wysa: "Completely anonymous. No stigma. No limits." */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.5,
              fontFamily: font,
              marginBottom: "16px",
              maxWidth: "480px",
            }}
          >
            Completely anonymous. No stigma. No limits.
          </motion.p>

          {/* Body paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#3D3D3D",
              lineHeight: 1.75,
              fontFamily: font,
              marginBottom: "16px",
              maxWidth: "480px",
            }}
          >
            Track your mood, reflect with AI, connect with others, and discover
            what actually makes you feel better — all in one beautifully simple app.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#3D3D3D",
              lineHeight: 1.75,
              fontFamily: font,
              marginBottom: "32px",
              maxWidth: "480px",
            }}
          >
            Whether it is self-care, guided reflection, or daily habits —
            MyMood makes it easier to take the next step.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center gap-4 flex-wrap mb-10"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                fontWeight: 700,
                fontSize: "15px",
                backgroundColor: "#E8521A",
                fontFamily: font,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
            >
              Start for free
            </Link>

            <Link
              href="/login"
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#3D3D3D",
                fontFamily: font,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Already have an account
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <div className="flex">
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs"
                  style={{
                    background: a.bg,
                    borderColor: "#F5F2EB",
                    marginLeft: i !== 0 ? "-10px" : "0",
                    fontWeight: 600,
                    fontFamily: font,
                  }}
                >
                  {a.letter}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs" style={{ color: "#E8521A" }}>★★★★★</div>
              <div className="text-xs" style={{ color: "#5C5C5C", fontFamily: font }}>
                <span style={{ color: "#1A1A1A", fontWeight: 600 }}>2,800+ people</span>{" "}
                tracking daily
              </div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT — image flush, no shadow, no border, like Wysa */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="relative w-full rounded-2xl overflow-hidden">
            <Image
              src="/images/h.png"
              alt="MyMood wellness"
              width={600}
              height={600}
              className="w-full h-auto object-cover rounded-2xl"
              priority
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}