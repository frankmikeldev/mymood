"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TESTIMONIALS = [
  {
    image: "/images/testimonials/amara.jpg",
    initials: "AO",
    name: "Amara O.",
    duration: "Using MyMood for 3 months",
    text: "MyMood helped me identify that I feel worst on Monday mornings. Now I protect that time and my whole week improved.",
    bg: "#333",
  },
  {
    image: "/images/testimonials/james.jpg",
    initials: "JN",
    name: "James N.",
    duration: "Using MyMood for 2 months",
    text: "The AI chatbot is incredible. It's like having a therapist in my pocket — non-judgmental and always available.",
    bg: "#444",
  },
  {
    image: "/images/testimonials/fatima.jpg",
    initials: "FK",
    name: "Fatima K.",
    duration: "Using MyMood for 1 month",
    text: "I love that the community is anonymous. I can share how I really feel without fear of judgment. So freeing.",
    bg: "#E8521A",
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 mt-24">

      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="inline-block px-3 py-1 rounded-full border text-xs mb-4"
          style={{
            borderColor: "#D8D1C4",
            backgroundColor: "#E6E0D5",
            color: "#6b7280",
            fontWeight: 500,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          What users say
        </span>
        <h2
          className="text-3xl md:text-4xl"
          style={{
            fontWeight: 800,
            color: "#1a1a1a",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Real people, real results
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #D8D1C4" }}
          >
            <div className="flex gap-1 mb-3 text-sm" style={{ color: "#E8521A" }}>
              ★★★★★
            </div>

            <p
              className="mb-5 italic"
              style={{
                color: "#444444",
                fontSize: "15px",
                lineHeight: 1.75,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
              }}
            >
              &ldquo;{t.text}&rdquo;
            </p>

            <div className="flex items-center gap-3">

              {/* ✅ Profile image with initials fallback */}
              <div
                className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-white"
                style={{ background: t.bg, fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}
              >
                {t.image ? (
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  t.initials
                )}
              </div>

              <div>
                <p
                  style={{
                    color: "#1a1a1a",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {t.duration}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}