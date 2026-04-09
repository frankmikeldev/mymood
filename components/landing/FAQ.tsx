"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Is MyMood free to use?",
    a: "Yes, MyMood is completely free. All features including AI chatbot, mood tracking, journal, and community are available at no cost.",
  },
  {
    q: "Is my data private and secure?",
    a: "Absolutely. Your journal entries and mood logs are private. Community posts are anonymous. We never sell your data to anyone.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes — MyMood is a PWA (Progressive Web App). Install it on Android or iPhone directly from your browser. No app store needed.",
  },
  {
    q: "Is MyMood a replacement for therapy?",
    a: "MyMood is a self-care and wellness tool, not a replacement for professional mental health care. If you are in crisis please reach out to a mental health professional.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 mt-24">
      {/* Header */}
      <div className="text-center mb-10">
        <span
          className="inline-block px-3 py-1 rounded-full border text-xs mb-4"
          style={{ borderColor: "#D8D1C4", backgroundColor: "#E6E0D5", color: "#6b7280", fontWeight: 500, fontFamily: "'Manrope', sans-serif" }}
        >
          FAQ
        </span>
        <h2
          className="text-3xl md:text-4xl"
          style={{ fontWeight: 800, color: "#1a1a1a", fontFamily: "'Manrope', sans-serif" }}
        >
          Common questions
        </h2>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #D8D1C4" }}
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span style={{ color: "#1a1a1a", fontSize: "15px", fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}>
                {faq.q}
              </span>
              <span
                className="font-bold text-xl flex-shrink-0 ml-4 transition-transform duration-200"
                style={{ color: "#E8521A", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}
              >
                +
              </span>
            </button>

            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <p style={{ color: "#444444", fontSize: "15px", lineHeight: 1.75, fontFamily: "'Manrope', sans-serif", fontWeight: 400 }}>
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}