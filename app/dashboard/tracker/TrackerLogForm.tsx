"use client";

import { useState } from "react";

const MOODS = [
  { value: 1, emoji: "😞", label: "Very Sad" },
  { value: 2, emoji: "😕", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😄", label: "Very Happy" },
];

export default function TrackerLogForm({
  onCreate,
}: {
  onCreate: (data: { mood: number; notes?: string }) => void;
}) {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;
    onCreate({ mood, notes });
    setMood(null);
    setNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">

      <h3 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-5">
        How are you feeling today?
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Mood selector */}
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border transition ${
                mood === m.value
                  ? "bg-[var(--color-text-header)] border-[var(--color-text-header)] text-[var(--color-bg-main)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-main)] text-[var(--color-text-body)] opacity-60 hover:opacity-100 hover:border-[var(--color-text-header)]"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-xs font-medium leading-tight text-center">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Mood score bar */}
        {mood && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-[var(--color-text-header)] transition-all duration-500"
                style={{ width: `${(mood / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[var(--color-text-body)] opacity-40 shrink-0">
              {mood}/5
            </span>
          </div>
        )}

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note about how you're feeling... (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-main)] text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-30 outline-none focus:border-[var(--color-text-header)] focus:border-opacity-30 resize-none transition"
        />

        <button
          type="submit"
          disabled={!mood}
          className="w-full py-3 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] font-semibold text-sm hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {submitted ? "✓ Mood Logged!" : "Log Mood"}
        </button>

      </form>
    </div>
  );
}