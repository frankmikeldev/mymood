"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Apple } from "lucide-react";

const supabase = createClient();

const MOOD_OPTIONS = [
  { value: "", label: "All Plans", emoji: "🍽️" },
  { value: "anxiety", label: "Anxiety", emoji: "😟" },
  { value: "depression", label: "Depression", emoji: "😔" },
  { value: "stress", label: "Stress", emoji: "😣" },
  { value: "sad", label: "Sadness", emoji: "😢" },
  { value: "anger", label: "Anger", emoji: "😠" },
  { value: "burnout", label: "Burnout", emoji: "😮‍💨" },
  { value: "loneliness", label: "Loneliness", emoji: "🫂" },
  { value: "overwhelm", label: "Overwhelm", emoji: "🌊" },
  { value: "grief", label: "Grief", emoji: "💙" },
  { value: "low_self_esteem", label: "Low Self-Esteem", emoji: "🌱" },
  { value: "low_energy", label: "Low Energy", emoji: "🔋" },
  { value: "sleep", label: "Sleep Issues", emoji: "😴" },
  { value: "menstruation", label: "Menstruation", emoji: "🌸" },
  { value: "pms", label: "PMS", emoji: "🌙" },
];

export default function DietPage() {
  const [diets, setDiets] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchDiets(); }, [selectedMood]);

  async function fetchDiets() {
    setLoading(true);
    let query = supabase.from("diet_plans").select("*").order("created_at");
    if (selectedMood) query = query.eq("mood", selectedMood);
    const { data } = await query;
    if (data) setDiets(data);
    setLoading(false);
  }

  const selectedLabel = MOOD_OPTIONS.find((m) => m.value === selectedMood)?.label || "All Plans";

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">
              Mood-Based Nutrition
            </h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Food plans tailored to support your mental and emotional wellbeing.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Apple size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        {/* Mood Filter Pills */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-3">
            Filter by mood
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`px-3 py-1.5 rounded-xl text-xs border transition ${
                  selectedMood === m.value
                    ? "bg-[var(--color-text-header)] border-[var(--color-text-header)] text-[var(--color-bg-main)] font-medium"
                    : "border-[var(--color-border)] text-[var(--color-text-body)] opacity-60 hover:opacity-100 hover:border-[var(--color-text-header)]"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-[var(--color-text-body)] opacity-40 mb-6">
          Showing <span className="text-[var(--color-text-header)] opacity-100 font-medium">{diets.length}</span> plans
          {selectedMood && (
            <> for <span className="text-[var(--color-text-header)] opacity-100">{selectedLabel}</span></>
          )}
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-text-header)] border-t-transparent animate-spin opacity-40" />
          </div>
        )}

        {/* Diet Cards */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-5">
            {diets.length === 0 && (
              <div className="col-span-2 text-center py-20 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
                <p className="text-3xl mb-3">🥗</p>
                <p className="text-[var(--color-text-header)] font-medium">No plans found</p>
                <p className="text-[var(--color-text-body)] opacity-40 text-sm mt-1">
                  No diet plans found for this mood yet.
                </p>
              </div>
            )}

            {diets.map((diet) => {
              const isExpanded = expanded === diet.id;
              const foods: string[] = Array.isArray(diet.foods)
                ? diet.foods
                : JSON.parse(diet.foods || "[]");
              const moodOption = MOOD_OPTIONS.find((m) => m.value === diet.mood);

              return (
                <div
                  key={diet.id}
                  className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-text-header)] hover:border-opacity-20 transition"
                >
                  {/* Food Image */}
                  {diet.image_url && (
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={diet.image_url}
                        alt={diet.title}
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* Mood badge */}
                      {moodOption && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-header)]">
                          {moodOption.emoji} {moodOption.label}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    {/* No image mood badge */}
                    {!diet.image_url && moodOption && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-header)] mb-3">
                        {moodOption.emoji} {moodOption.label}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-base font-semibold text-[var(--color-text-header)]">
                      {diet.title}
                    </h2>
                    <p className="text-[var(--color-text-body)] opacity-60 text-sm mt-1 leading-relaxed">
                      {diet.description}
                    </p>

                    {/* Food list */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-3">
                        Recommended Foods
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {(isExpanded ? foods : foods.slice(0, 4)).map((food, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] text-xs text-[var(--color-text-body)] opacity-80"
                          >
                            <span>🍽️</span>
                            <span className="truncate">{food}</span>
                          </div>
                        ))}
                      </div>

                      {foods.length > 4 && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : diet.id)}
                          className="mt-3 text-xs text-[var(--color-text-body)] opacity-50 hover:opacity-100 transition font-medium"
                        >
                          {isExpanded ? "Show less ↑" : `+ ${foods.length - 4} more foods ↓`}
                        </button>
                      )}
                    </div>

                    {/* Tip */}
                    {diet.tips && (
                      <div className="mt-4 p-3 rounded-xl bg-[var(--color-bg-main)] border-l-2 border-[var(--color-text-header)] border-opacity-20 text-xs text-[var(--color-text-body)] opacity-60 leading-relaxed">
                        💡 {diet.tips}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}