"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

const font = "'Manrope', sans-serif";

export default function SubscribeSection() {
  const supabase = createClient();
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);

    const { error } = await supabase
      .from("subscriptions")
      .insert([{ email }]);

    if (error) {
      setError("This email is already subscribed or something went wrong.");
      return;
    }

    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      className="relative z-10 mt-24 mb-0 text-center py-20 px-6"
      style={{ borderTop: "1px solid #E2DDD6" }}
    >
      <h3
        className="text-2xl md:text-3xl mb-3"
        style={{
          fontWeight: 800,
          color: "#111111",
          fontFamily: font,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        Subscribe for Wellness Tips
      </h3>

      <p
        className="mb-8 max-w-xl mx-auto"
        style={{
          color: "#555555",
          fontFamily: font,
          fontWeight: 400,
          fontSize: "17px",
          lineHeight: 1.75,
        }}
      >
        Receive mindful advice, mental health insights, and self-care reminders
        right in your inbox.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:flex-1 px-4 py-3.5 rounded-full focus:outline-none transition-colors"
          style={{
            backgroundColor: "#F5F0E8",
            border: "1px solid #D8D1C4",
            color: "#111111",
            fontFamily: font,
            fontSize: "15px",
            fontWeight: 400,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
          onBlur={e => (e.currentTarget.style.borderColor = "#D8D1C4")}
          required
        />
        <button
          type="submit"
          className="px-7 py-3.5 rounded-full text-white transition-all duration-200 whitespace-nowrap hover:-translate-y-0.5"
          style={{
            fontWeight: 700,
            fontSize: "15px",
            fontFamily: font,
            backgroundColor: "#E8521A",
            boxShadow: "0 4px 20px rgba(232, 82, 26, 0.3)",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
        >
          Subscribe
        </button>
      </form>

      {submitted && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm"
          style={{ color: "#111111", fontFamily: font, fontWeight: 600 }}
        >
          Thanks for subscribing! You will start receiving tips soon. 🌿
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm"
          style={{ color: "#E8521A", fontFamily: font, fontWeight: 500 }}
        >
          {error}
        </motion.p>
      )}
    </section>
  );
}