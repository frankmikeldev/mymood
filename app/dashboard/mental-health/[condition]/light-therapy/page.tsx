"use client";

import FeatureLayout from "@/components/FeatureLayout";

export default function LightTherapyPage() {
  const sessions = [
    {
      title: "Morning Sunlight Boost",
      description:
        "Spend 10–15 minutes in natural morning sunlight to regulate mood and improve sleep rhythm.",
      duration: "10–15 min",
    },
    {
      title: "Indoor Bright Light Session",
      description:
        "Sit near a bright window or light source while reading or journaling to enhance focus and mood.",
      duration: "15–20 min",
    },
    {
      title: "Evening Wind-Down",
      description:
        "Dim lights 1–2 hours before sleep to help your brain produce melatonin naturally.",
      duration: "1–2 hrs before bed",
    },
  ];

  return (
    <FeatureLayout
      title="Light Therapy ☀️"
      description="Light exposure plays a powerful role in regulating mood, energy, and sleep cycles."
      content={
        <div className="space-y-4">
          {sessions.map((session, i) => (
            <div
              key={i}
              className="p-5 border border-[var(--color-border)] bg-[var(--color-box)] rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{session.title}</h3>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {session.duration}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {session.description}
              </p>
            </div>
          ))}
        </div>
      }
    />
  );
}