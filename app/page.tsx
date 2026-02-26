"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

const EMOJIS = ["😊", "😌", "🙂", "😃", "🌿"];
const BENEFIT_IMAGES = [
  { src: "/images/happy1.png", text: "Understand your emotions and thoughts better." },
  { src: "/images/happy2.png", text: "Reduce stress and anxiety with mindful tracking." },
  { src: "/images/happy3.png", text: "Get personalized tips for emotional balance." },
  { src: "/images/happy4.png", text: "Build awareness and consistency for inner peace." },
];

export default function HomePage() {
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setEmojiIndex((i) => (i + 1) % EMOJIS.length), 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setImageIndex((i) => (i + 1) % BENEFIT_IMAGES.length), 10000);
    return () => clearInterval(t);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);

    const { error } = await supabase.from("subscriptions").insert([{ email }]);
    if (error) {
      setError("This email is already subscribed or something went wrong.");
      return;
    }

    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="relative min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-body)] overflow-hidden transition-colors duration-300">
      {/* Background gradient animation */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, var(--color-bg-main), var(--color-bg-card), var(--color-bg-main))",
          backgroundSize: "300% 300%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-36 gap-6 md:gap-10">
        {/* Left Text */}
        <div className="flex-1 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.span
              key={emojiIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl mb-2 block"
            >
              {EMOJIS[emojiIndex]}
            </motion.span>
          </AnimatePresence>

          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text-header)] leading-tight">
            Track Your Mood <br /> Find Your Balance
          </h1>

          <p className="mt-3 text-base md:text-lg text-[var(--color-text-body)] max-w-lg mx-auto md:mx-0">
            MyMood helps you track how you feel, reflect daily, and discover practical tips to stay emotionally balanced.
          </p>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 relative flex justify-center md:justify-end"
        >
          <div className="relative w-[240px] md:w-[340px]">
            <img
              src="/images/hero1.png"
              alt="Mood visualization"
              className="w-full h-auto object-contain opacity-90"
            />
            <div className="absolute inset-0 bg-[var(--color-accent)]/20 blur-3xl rounded-full -z-10" />
          </div>
        </motion.div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="relative text-center mt-16 md:mt-20 px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[var(--color-text-header)]">
          Why Choose MyMood?
        </h2>

        <div className="relative w-full max-w-3xl mx-auto h-56 md:h-80 rounded-2xl overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={imageIndex}
              src={BENEFIT_IMAGES[imageIndex].src}
              alt={BENEFIT_IMAGES[imageIndex].text}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.03, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.03, x: -30 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        <motion.p
          key={imageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="mt-5 text-base md:text-lg text-[var(--color-text-body)]"
        >
          {BENEFIT_IMAGES[imageIndex].text}
        </motion.p>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative mt-24 text-center overflow-hidden px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text-header)] mb-10">
          What Our Users Say
        </h2>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="card"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={["/images/user1.jpg", "/images/user2.jpg", "/images/user3.jpg"][imageIndex]}
                  alt="User testimonial"
                  className="w-16 h-16 rounded-full mb-4 border border-[var(--color-border)] object-cover"
                />
                <p className="text-[var(--color-text-body)] mb-4 italic max-w-md mx-auto">
                  {
                    [
                      "MyMood helped me understand my emotions better. I feel more mindful and balanced every day!",
                      "Tracking my moods has made a big difference in managing stress. I love the calm design!",
                      "The daily tips are so helpful  it feels like having a kind, caring friend with me each day.",
                    ][imageIndex]
                  }
                </p>
                <h4 className="text-[var(--color-text-header)] font-medium">
                  {["Lina", "Aiden", "Maya"][imageIndex]}
                </h4>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex justify-center mt-6 gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === imageIndex
                    ? "bg-[var(--color-accent)] w-6"
                    : "bg-[var(--color-border)] hover:bg-[var(--color-accent)]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <section className="relative mt-20 text-center overflow-hidden py-20 px-6">
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, var(--color-bg-main), var(--color-bg-card), var(--color-bg-main))",
            backgroundSize: "300% 300%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
        />

        <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-header)] mb-4">
          Subscribe for Wellness Tips 
        </h3>
        <p className="text-[var(--color-text-body)] mb-8 max-w-xl mx-auto">
          Receive mindful advice, mental health insights, and self-care reminders right in your inbox.
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
            className="w-full sm:flex-1 px-4 py-3 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-header)] focus:outline-none focus:border-[var(--color-accent)] placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Subscribe
          </button>
        </form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-[var(--color-text-header)] text-sm"
          >
            ✅ Thanks for subscribing! You'll start receiving tips soon.
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </section>
    </main>
  );
}