"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const EMOJIS = ["😊", "😌", "🙂", "😃", "🌿"];
const BENEFIT_IMAGES = [
  { src: "/images/happy1.png", text: "Understand your emotions and thoughts better." },
  { src: "/images/happy2.png", text: "Reduce stress and anxiety with mindful tracking." },
  { src: "/images/happy3.png", text: "Get personalized tips for emotional balance." },
  { src: "/images/happy4.png", text: "Build awareness and consistency for inner peace." },
];

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "Mood Tracker",
    desc: "Log your mood daily with emoji, notes, and streaks. See your emotional patterns over time.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "AI Chatbot",
    desc: "Talk to an empathetic AI anytime you need to express yourself or seek guidance.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "Journal",
    desc: "Write private entries to reflect on your day, feelings, and personal growth journey.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "Insights",
    desc: "Get AI-powered analytics on your mood trends, best days, and emotional patterns.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
    title: "Community",
    desc: "Share feelings anonymously and connect with others on the same wellness journey.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "Mood Diet Plans",
    desc: "Get food recommendations tailored to your current mood and mental state.",
  },
];

const TESTIMONIALS = [
  {
    initials: "AO",
    name: "Amara O.",
    duration: "Using MyMood for 3 months",
    text: "MyMood helped me identify that I feel worst on Monday mornings. Now I protect that time and my whole week improved.",
  },
  {
    initials: "JN",
    name: "James N.",
    duration: "Using MyMood for 2 months",
    text: "The AI chatbot is incredible. It's like having a therapist in my pocket — non-judgmental and always available.",
  },
  {
    initials: "FK",
    name: "Fatima K.",
    duration: "Using MyMood for 1 month",
    text: "I love that the community is anonymous. I can share how I really feel without fear of judgment. So freeing.",
  },
];

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

export default function HomePage() {
  // ✅ Fixed — use createClient instead of importing supabase directly
  const supabase = createClient();

  const [emojiIndex, setEmojiIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <main className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

      {/* Grid background */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-36">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left — copy */}
          <div className="flex-1 text-center md:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Mental wellness for everyone
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">
              Your mind<br />
              deserves a<br />
              <span className="text-[#e2e8f0]">daily check-in</span>
            </h1>

            <p className="text-base md:text-lg text-gray-400 max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
              Track your mood, reflect with AI, connect with others, and discover what actually makes you feel better — all in one beautifully simple app.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-10">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0a0a0f] font-semibold text-sm hover:bg-gray-100 transition"
              >
                Start for free
                <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition"
              >
                Already have an account
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
              <div className="flex">
                {[
                  { letter: "A", bg: "#374151" },
                  { letter: "J", bg: "#1e3a5f" },
                  { letter: "F", bg: "#064e3b" },
                  { letter: "K", bg: "#7f1d1d" },
                  { letter: "N", bg: "#78350f" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-white text-xs font-semibold"
                    style={{ background: a.bg, marginLeft: i !== 0 ? "-8px" : "0" }}
                  >
                    {a.letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-amber-400 text-xs">★★★★★</div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-300 font-medium">2,800+ people</span> tracking daily
                </div>
              </div>
              <div className="flex gap-5 ml-2">
                {[
                  { val: "18k+", lbl: "Mood logs" },
                  { val: "Free", lbl: "Always" },
                ].map((s) => (
                  <div key={s.lbl} className="text-center">
                    <p className="text-base font-bold text-white">{s.val}</p>
                    <p className="text-xs text-gray-600">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — app mockup */}
          <div className="flex-1 relative flex justify-center md:justify-end">

            {/* Notification floating card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -top-4 right-0 md:right-4 z-10 bg-[#0f0f18] border border-white/8 rounded-xl p-3 w-44"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
                    <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-500">MyMood · now</span>
              </div>
              <p className="text-xs font-medium text-white">Time to check in</p>
              <p className="text-xs text-gray-500">How are you feeling today?</p>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-56 md:w-64 bg-[#0f0f18] border border-white/8 rounded-[28px] p-4 z-10"
            >
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-xs text-gray-600">9:41</span>
                <div className="w-12 h-2 bg-white/5 rounded-full" />
                <span className="text-xs text-gray-600">100%</span>
              </div>

              <p className="text-xs text-gray-600">Good morning,</p>
              <p className="text-sm font-semibold text-white mb-4">Frank 👋</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { val: "7🔥", lbl: "Day streak", color: "text-white", w: "70%", bg: "bg-white" },
                  { val: "4.2", lbl: "Avg mood", color: "text-green-400", w: "84%", bg: "bg-green-500" },
                ].map((c) => (
                  <div key={c.lbl} className="bg-white/4 rounded-xl p-2.5">
                    <p className={`text-base font-bold ${c.color}`}>{c.val}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{c.lbl}</p>
                    <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full rounded-full ${c.bg} opacity-60`} style={{ width: c.w }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 mb-3">
                {["😞","😕","😐","🙂","😄"].map((e, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center py-2 rounded-lg text-sm ${
                      i === 3
                        ? "bg-white/15 border border-white/20"
                        : "bg-white/4"
                    }`}
                  >
                    {e}
                  </div>
                ))}
              </div>

              <div className="bg-white/4 rounded-xl p-2.5">
                <p className="text-xs text-gray-600 mb-2">Mood this week</p>
                <div className="flex items-end gap-1 h-8">
                  {[40, 65, 45, 85, 60, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: h > 70 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-10 -left-4 md:-left-8 bg-[#0f0f18] border border-white/8 rounded-xl p-3 w-36"
            >
              <p className="text-base font-bold text-white">18,392</p>
              <p className="text-xs text-gray-600">Mood logs today</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M2 8l3-6 3 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs text-green-400">+12% this week</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 mt-28">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs mb-4">
            Everything you need
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            One app for your entire wellness journey
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            From daily mood tracking to AI insights — MyMood has every tool to help you understand and improve your emotional health.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 hover:border-white/15 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-white">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="relative z-10 text-center mt-28 px-6 max-w-4xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs mb-4">
          Why MyMood
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Why Choose MyMood?
        </h2>
        <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden border border-white/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={imageIndex}
              src={BENEFIT_IMAGES[imageIndex].src}
              alt={BENEFIT_IMAGES[imageIndex].text}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              initial={{ opacity: 0, scale: 1.03, x: 30 }}
              animate={{ opacity: 0.8, scale: 1, x: 0 }}
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
          className="mt-5 text-base md:text-lg text-gray-400"
        >
          {BENEFIT_IMAGES[imageIndex].text}
        </motion.p>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 mt-28">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs mb-4">
            What users say
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Real people, real results
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5"
            >
              <div className="flex gap-1 mb-3 text-amber-400 text-sm">★★★★★</div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-xs font-semibold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.duration}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 mt-28">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Common questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-4"
                  >
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0f0f18] border border-white/8 rounded-2xl p-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Start your wellness journey today
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base">
            Join thousands of people tracking their mood and building better mental health habits.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0a0a0f] font-semibold hover:bg-gray-100 transition"
          >
            Create your free account
            <svg width="14" height="14" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5 2l3 3-3 3" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="text-xs text-gray-700 mt-4">
            No credit card required — free forever
          </p>
        </motion.div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <section className="relative z-10 mt-28 text-center py-20 px-6 border-t border-white/5">
        <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Subscribe for Wellness Tips
        </h3>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto text-sm">
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
            className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-[#0f0f18] border border-white/8 text-white focus:outline-none focus:border-white/20 placeholder-gray-600 text-sm"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-white text-[#0a0a0f] font-semibold text-sm hover:bg-gray-100 transition whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-green-400 text-sm"
          >
            Thanks for subscribing! You will start receiving tips soon.
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