"use client";

import FeatureLayout from "@/components/FeatureLayout";

export default function BreathingExercisePage() {
  return (
    <FeatureLayout
      title="Breathing Exercise 🧘‍♂️"
      description="Follow simple guided breathing techniques to relax, reduce stress, and calm your mind."
      content={
        <div className="space-y-6">

          <div className="p-5 bg-[var(--color-box)] rounded-xl border">
            <h3 className="font-semibold mb-2">⏱ Best Time To Practice</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              • Morning — for clarity & focus. <br />
              • Before bedtime — for deep relaxation. <br />
              • Anytime you feel anxious or overwhelmed.
            </p>
          </div>

          {/* Step-by-step breathing */}
          <div className="p-5 bg-[var(--color-box)] rounded-xl border">
            <h3 className="font-semibold mb-4">🪷 4-7-8 Technique</h3>
            <ol className="list-decimal pl-4 space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>Breathe in slowly through your nose for 4 seconds.</li>
              <li>Hold your breath for 7 seconds.</li>
              <li>Exhale through your mouth for 8 seconds.</li>
              <li>Repeat for 3–4 rounds.</li>
            </ol>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((img) => (
              <div key={img} className="rounded-lg overflow-hidden shadow-sm border">
                <img
                  src={`/images/breathe${img}.jpg`} 
                  alt="Breathing"
                  className="w-full h-36 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
            {[1, 2].map((vid) => (
              <video
                key={vid}
                controls
                className="w-full rounded-lg border"
                src={`/videos/breathe${vid}.mp4`}
              />
            ))}
          </div>
        </div>
      }
    />
  );
}