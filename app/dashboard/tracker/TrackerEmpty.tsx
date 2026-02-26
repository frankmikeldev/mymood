"use client";

export default function TrackerEmpty({
  onCreate,
}: {
  onCreate: (data: { mood: number; notes?: string }) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-10 shadow-sm">
      <h3 className="text-xl font-semibold text-[var(--color-text-header)] mb-2">
        No Mood Entries Yet
      </h3>
      <p className="text-[var(--color-text-body)] mb-6">
        Start by logging your first mood to begin tracking your emotional
        journey 🌱
      </p>
      <button
        onClick={() => onCreate({ mood: 3 })}
        className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 transition"
      >
        Log Your First Mood
      </button>
    </div>
  );
}
