"use client";

import { motion } from "framer-motion";

const PRIVACY_POINTS = [
  {
    icon: "🔒",
    title: "Private by default",
    desc: "Your entries are encrypted and visible only to you.",
  },
  {
    icon: "👤",
    title: "Anonymous community",
    desc: "Connect and share without revealing your identity.",
  },
  {
    icon: "🚫",
    title: "Zero data selling",
    desc: "We never share or sell your personal information.",
  },
];

const font = "'Manrope', sans-serif";

export default function AnonymousSection() {
  return (
    <section
      className="mt-24 py-20 px-6"
      style={{ backgroundColor: "#EEF2E6" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Lock icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#111111" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Badge */}
          <span
            className="inline-block px-3 py-1 rounded-full border text-xs mb-5"
            style={{
              borderColor: "#D8D1C4",
              backgroundColor: "rgba(0,0,0,0.05)",
              color: "#555555",
              fontWeight: 600,
              fontFamily: font,
              letterSpacing: "0.02em",
            }}
          >
            Your privacy, always
          </span>

          {/* Headline */}
          <h2
            className="text-3xl md:text-4xl mb-5"
            style={{
              fontWeight: 800,
              color: "#111111",
              fontFamily: font,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Completely anonymous.<br />
            No stigma. No limits.
          </h2>

          {/* Body */}
          <p
            className="max-w-2xl mx-auto mb-10"
            style={{
              color: "#444444",
              fontFamily: font,
              fontWeight: 400,
              fontSize: "17px",
              lineHeight: 1.75,
            }}
          >
            Your journal entries and mood logs stay private — always. Community
            posts are anonymous by default. We never sell your data, and we never
            will. Feel free to be honest with yourself.
          </p>

          {/* Three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {PRIVACY_POINTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2DDD6",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3
                  className="mb-2"
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#111111",
                    fontFamily: font,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#444444",
                    fontFamily: font,
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: 1.75,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}