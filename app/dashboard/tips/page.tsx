"use client";

import { useRouter } from "next/navigation";
import { Lightbulb, ChevronRight } from "lucide-react";

const MOODS = [
  { label: "Anxiety", emoji: "😟", desc: "Calm worry and nervous tension" },
  { label: "Depression", emoji: "😔", desc: "Lift low mood and heaviness" },
  { label: "Stress", emoji: "😣", desc: "Reduce overwhelm and pressure" },
  { label: "Loneliness", emoji: "🫂", desc: "Build connection and belonging" },
  { label: "Anger", emoji: "😠", desc: "Channel and cool intense emotions" },
  { label: "Grief", emoji: "💙", desc: "Process loss and emotional pain" },
  { label: "Burnout", emoji: "😮‍💨", desc: "Recover energy and motivation" },
  { label: "Low Self-Esteem", emoji: "🌱", desc: "Build confidence and self-worth" },
  { label: "Overwhelm", emoji: "🌊", desc: "Regain clarity and focus" },
];

export default function TipsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">
              Wellness Library
            </h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Choose a mood or mental health topic to explore tips and recovery plans.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Lightbulb size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => router.push(`/dashboard/tips/${encodeURIComponent(mood.label)}`)}
              className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-text-header)] hover:border-opacity-30 transition text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xl shrink-0 group-hover:border-opacity-30 transition">
                {mood.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-header)] truncate">
                  {mood.label}
                </p>
                <p className="text-xs text-[var(--color-text-body)] opacity-50 mt-0.5 truncate">
                  {mood.desc}
                </p>
              </div>
              <ChevronRight
                size={13}
                className="shrink-0 text-[var(--color-text-body)] opacity-20 group-hover:opacity-60 transition"
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}