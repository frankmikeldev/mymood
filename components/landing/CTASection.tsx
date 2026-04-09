"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden"
        style={{ minHeight: "360px" }}
      >
        {/* Background image */}
        <Image
          src="/images/supp.jpg"
          alt="CTA background"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay so text stays readable */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        />

        {/* Content — all relative z-10 to sit above overlay */}
        <div className="relative z-10">
          <span
            className="inline-block px-3 py-1 rounded-full border text-xs mb-5"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Get started today
          </span>

          <h2
            className="text-3xl md:text-4xl mb-3"
            style={{ fontWeight: 800, color: "#ffffff", fontFamily: "'Manrope', sans-serif" }}
          >
            Start your wellness journey today
          </h2>

          <p
            className="mb-8 max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: 1.7, fontFamily: "'Manrope', sans-serif", fontWeight: 400 }}
          >
            Join thousands of people tracking their mood and building better mental
            health habits.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontWeight: 700,
              fontSize: "15px",
              backgroundColor: "#E8521A",
              boxShadow: "0 4px 20px rgba(232, 82, 26, 0.5)",
              fontFamily: "'Manrope', sans-serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
          >
            Create your free account
            <svg width="14" height="14" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <p
            className="mt-4"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontFamily: "'Manrope', sans-serif" }}
          >
            No credit card required — free forever
          </p>
        </div>
      </motion.div>
    </section>
  );
}