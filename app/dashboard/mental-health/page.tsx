"use client";

import { useRouter } from "next/navigation";

export default function MentalHealthPage() {
  const router = useRouter();

  const conditions = [
    { name: "Anxiety", slug: "anxiety" },
    { name: "Depression", slug: "depression" },
    { name: "Stress", slug: "stress" },
    { name: "Bipolar Disorder", slug: "bipolar-disorder" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-bg)] text-center">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-[var(--color-text-primary)]">
     What condition do you want help with?
      </h1>

      {/* Buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[220px]">
        {conditions.map((c) => (
          <button
            key={c.slug}
            onClick={() => router.push(`/dashboard/mental-health/${c.slug}`)}
            className="w-full py-2 rounded-full font-medium text-white text-sm bg-[var(--color-accent)] hover:opacity-90 transition shadow-sm"
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="mt-8 text-sm text-[var(--color-text-muted)] max-w-sm">
        Choose a mental health area to get personalized tips, diet suggestions,
        and daily wellness tracking.
      </p>

      {/* Footer Disclaimer */}
      <footer className="mt-10 text-xs text-[var(--color-text-muted)]">
        ⚠️ This app is for self-reflection and wellness only. For serious
        medical concerns, please consult a licensed professional.
      </footer>
    </div>
  );
}
