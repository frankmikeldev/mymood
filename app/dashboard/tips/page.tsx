"use client";

import { useRouter } from "next/navigation";

const MOODS = [
  "Anxiety",
  "Depression",
  "Stress",
  "Loneliness",
  "Anger",
  "Grief",
  "Burnout",
  "Low Self-Esteem",
  "Overwhelm",
];

export default function TipsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Wellness Library
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            Choose a mood or mental health topic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOODS.map((mood) => (
            <div
              key={mood}
              onClick={() =>
                router.push(`/dashboard/tips/${encodeURIComponent(mood)}`)
              }
              className="cursor-pointer p-6 bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-accent)] transition"
            >
              <h3 className="text-lg font-semibold text-[var(--color-accent)]">
                {mood}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                View tips, story & recovery plan
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}