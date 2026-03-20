"use client";

import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";

const CONDITIONS = [
  { name: "Anxiety", slug: "anxiety", emoji: "😟", desc: "Worry, fear and nervous tension" },
  { name: "Depression", slug: "depression", emoji: "😔", desc: "Low mood and emotional heaviness" },
  { name: "Stress", slug: "stress", emoji: "😣", desc: "Overwhelm and tension relief" },
  { name: "Bipolar Disorder", slug: "bipolar-disorder", emoji: "🔄", desc: "Mood swings and balance" },
  { name: "Grief", slug: "grief", emoji: "💙", desc: "Processing loss and emotional pain" },
  { name: "Anger", slug: "anger", emoji: "😠", desc: "Channeling intense emotions" },
  { name: "Loneliness", slug: "loneliness", emoji: "🫂", desc: "Building connection and belonging" },
  { name: "Burnout", slug: "burnout", emoji: "😮‍💨", desc: "Recovering energy and motivation" },
  { name: "Low Self-Esteem", slug: "low-self-esteem", emoji: "🌱", desc: "Building confidence and self-worth" },
  { name: "PTSD", slug: "ptsd", emoji: "🛡️", desc: "Grounding and trauma processing" },
  { name: "OCD", slug: "ocd", emoji: "🔁", desc: "Managing intrusive thoughts" },
  { name: "Insomnia", slug: "insomnia", emoji: "🌙", desc: "Sleep support and relaxation" },
];

export default function MentalHealthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">
              Mental Health
            </h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Choose a condition to get personalized support and coping tools.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Brain size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        {/* Conditions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {CONDITIONS.map((c) => (
            <button
              key={c.slug}
              onClick={() => router.push(`/dashboard/mental-health/${c.slug}`)}
              className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-text-header)] hover:border-opacity-30 transition text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xl shrink-0 group-hover:border-[var(--color-text-header)] group-hover:border-opacity-20 transition">
                {c.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-header)] truncate">
                  {c.name}
                </p>
                <p className="text-xs text-[var(--color-text-body)] opacity-50 mt-0.5 truncate">
                  {c.desc}
                </p>
              </div>
              <svg
                className="ml-auto shrink-0 opacity-20 group-hover:opacity-60 transition"
                width="14" height="14" viewBox="0 0 10 10" fill="none"
              >
                <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl px-5 py-4">
          <p className="text-xs text-[var(--color-text-body)] opacity-40 leading-relaxed text-center">
            ⚠️ MyMood is for self-reflection and wellness only. For serious medical concerns,
            please consult a licensed mental health professional.
          </p>
        </div>

      </div>
    </div>
  );
}