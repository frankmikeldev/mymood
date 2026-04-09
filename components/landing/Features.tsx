"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FEATURES = [
  {
    title: "Mood Tracker",
    desc: "Log how you feel every day and watch your emotional patterns come to life over time.",
    image: "/images/mt1.webp",
  },
  {
    title: "AI Chatbot",
    desc: "A judgment-free space to talk whenever you need it — your AI companion listens and responds with care.",
    image: "/images/ai.jpg",
  },
  {
    title: "Journal",
    desc: "Write freely in your private journal. Reflect on your day, process your thoughts, and grow at your own pace.",
    image: "/images/j.jpg",
  },
  {
    title: "Insights",
    desc: "Discover what lifts you up and what drags you down with clear, AI-powered mood analytics.",
    image: "/images/in.jpeg",
  },
  {
    title: "Community",
    desc: "You are not alone. Share anonymously and find comfort in others walking the same path.",
    image: "/images/cm.png",
  },
  {
    title: "Mood Diet Plans",
    desc: "Eat better, feel better. Get personalized food suggestions based on how you are feeling today.",
    image: "/images/mf.jpeg",
  },
];

const font = "'Manrope', sans-serif";

export default function Features() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 mt-24">

      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="inline-block px-3 py-1 rounded-full border text-xs mb-4"
          style={{
            borderColor: "#D8D1C4",
            backgroundColor: "#E6E0D5",
            color: "#555555",
            fontWeight: 600,
            fontFamily: font,
            letterSpacing: "0.02em",
          }}
        >
          Everything you need
        </span>

        <h2
          className="text-3xl md:text-4xl mb-4"
          style={{
            fontWeight: 800,
            color: "#111111",
            fontFamily: font,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          From first steps to lasting habits
        </h2>

        <p
          className="max-w-xl mx-auto"
          style={{
            color: "#555555",
            fontFamily: font,
            fontWeight: 400,
            fontSize: "17px",
            lineHeight: 1.75,
          }}
        >
          Every tool you need to understand your emotions, build healthier habits,
          and feel better — day by day.
        </p>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="snap-start flex-shrink-0 flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
            style={{
              width: "calc(33.333% - 14px)",
              minWidth: "270px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2DDD6",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            }}
          >
            {/* Image top */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "210px", backgroundColor: "#E6E0D5" }}
            >
              <Image
                src={f.image}
                alt={f.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div className="p-6 flex flex-col gap-3">
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#111111",
                  fontFamily: font,
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "#444444",
                  fontFamily: font,
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: 1.8,
                }}
              >
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll dots */}
      <div className="flex justify-center gap-2 mt-6">
        {FEATURES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              const cardWidth = el.scrollWidth / FEATURES.length;
              el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
            }}
            className="rounded-full transition-all duration-300 hover:scale-125"
            style={{
              width: "7px",
              height: "7px",
              backgroundColor: "#CCCCCC",
            }}
          />
        ))}
      </div>

    </section>
  );
}