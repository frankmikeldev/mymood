"use client";

import { useState } from "react";

const MOODS = [
  { value: 1, emoji: "😞", label: "Very Sad" },
  { value: 2, emoji: "😕", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😄", label: "Very Happy" },
];

export default function TrackerEmpty({
  onCreate,
}: {
  onCreate: (data: { mood: number; notes?: string }) => void;
}) {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!mood) return;
    onCreate({ mood, notes });
  };

  return (
    <div className="space-y-6">

      {/* Empty state hero */}
      <div className="text-center bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-10">
        <div className="text-5xl mb-4">🌱</div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Start Your Mood Journey
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
          Log your first mood below. Over time, you'll see patterns, streaks, and insights about your emotional wellbeing.
        </p>
      </div>

      {/* Inline first log */}
      <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6">
        <h4 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          How are you feeling right now?
        </h4>

        <div className="grid grid-cols-5 gap-2 mb-5">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition ${
                mood === m.value
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-xs font-medium text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling? (optional)"
          rows={2}
          className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] resize-none transition mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={!mood}
          className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Log My First Mood 🌱
        </button>
      </div>

      {/* Why track section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { emoji: "📈", title: "See Trends", desc: "Visualize your emotional patterns over time" },
          { emoji: "🔥", title: "Build Streaks", desc: "Stay consistent and earn daily streaks" },
          { emoji: "💡", title: "Gain Insights", desc: "Understand what affects your mood most" },
        ].map((item) => (
          <div key={item.title} className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{item.emoji}</div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}