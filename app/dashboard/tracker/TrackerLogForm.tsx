"use client";

import { useState } from "react";

export default function TrackerLogForm({
  onCreate,
}: {
  onCreate: (data: { mood: number; notes?: string }) => void;
}) {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const moods = [
    { value: 1, label: "Very Sad 😞" },
    { value: 2, label: "Sad 😕" },
    { value: 3, label: "Neutral 😐" },
    { value: 4, label: "Happy 🙂" },
    { value: 5, label: "Very Happy 😄" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return alert("Please select a mood.");
    onCreate({ mood, notes });
    setMood(null);
    setNotes("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col gap-4"
    >
      <h3 className="text-lg font-semibold text-[var(--color-text-header)] text-center">
        How are you feeling today?
      </h3>

      <div className="flex flex-wrap justify-center gap-2">
        {moods.map((m) => (
          <button
            type="button"
            key={m.value}
            onClick={() => setMood(m.value)}
            className={`px-3 py-2 rounded-lg text-sm sm:text-base transition ${
              mood === m.value
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-main)] border border-[var(--color-border)] text-[var(--color-text-body)] hover:border-[var(--color-accent)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write a quick note (optional)..."
        className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-main)] text-[var(--color-text-body)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition"
      />

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition"
      >
        Log Mood
      </button>
    </form>
  );
}
