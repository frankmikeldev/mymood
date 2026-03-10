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
    <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
        How are you feeling today?
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Select your mood and add an optional note.
      </p>

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
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
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
            <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-[var(--color-accent)] transition-all duration-500"
                style={{ width: `${(mood / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] shrink-0">{mood}/5</span>
          </div>
        )}

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note about how you're feeling... (optional)"
          rows={3}
          className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] resize-none transition"
        />

        <button
          type="submit"
          disabled={!mood}
          className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitted ? "✓ Mood Logged!" : "Log Mood"}
        </button>
      </form>
    </div>
  );
}