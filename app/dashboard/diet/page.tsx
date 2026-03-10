"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const supabase = createClient();

const MOOD_OPTIONS = [
  { value: "", label: "All Plans", emoji: "🍽️" },
  { value: "anxiety", label: "Anxiety", emoji: "😟" },
  { value: "depression", label: "Depression", emoji: "😔" },
  { value: "stress", label: "Stress", emoji: "😣" },
  { value: "sad", label: "Sadness", emoji: "😢" },
  { value: "anger", label: "Anger", emoji: "😠" },
  { value: "burnout", label: "Burnout", emoji: "�exhausted" },
  { value: "loneliness", label: "Loneliness", emoji: "🫂" },
  { value: "overwhelm", label: "Overwhelm", emoji: "🌊" },
  { value: "grief", label: "Grief", emoji: "💙" },
  { value: "low_self_esteem", label: "Low Self-Esteem", emoji: "🌱" },
  { value: "low_energy", label: "Low Energy", emoji: "🔋" },
  { value: "sleep", label: "Sleep Issues", emoji: "😴" },
  { value: "menstruation", label: "Menstruation", emoji: "🌸" },
  { value: "pms", label: "PMS", emoji: "🌙" },
];

const MOOD_COLORS: Record<string, string> = {
  anxiety: "#f59e0b",
  depression: "#6366f1",
  stress: "#ef4444",
  sad: "#3b82f6",
  anger: "#dc2626",
  burnout: "#78716c",
  loneliness: "#8b5cf6",
  overwhelm: "#0ea5e9",
  grief: "#64748b",
  low_self_esteem: "#22c55e",
  low_energy: "#f97316",
  sleep: "#818cf8",
  menstruation: "#ec4899",
  pms: "#a855f7",
};

export default function DietPage() {
  const [diets, setDiets] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchDiets();
  }, [selectedMood]);

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
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Mood-Based Nutrition</h1>
          <p className="text-gray-400 mt-2">
            Food plans tailored to support your mental and emotional wellbeing.
          </p>
        </div>

        {/* Mood Filter Pills */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">Filter by mood or condition:</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  selectedMood === m.value
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] text-gray-400 hover:border-[var(--color-accent)] hover:text-white"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="text-white font-medium">{diets.length}</span> plans
          {selectedMood && <> for <span className="text-[var(--color-accent)]">{selectedLabel}</span></>}
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Diet Cards */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {diets.map((diet) => {
              const color = MOOD_COLORS[diet.mood] || "var(--color-accent)";
              const isExpanded = expanded === diet.id;
              const foods: string[] = Array.isArray(diet.foods) ? diet.foods : JSON.parse(diet.foods || "[]");

              return (
                <div
                  key={diet.id}
                  className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-accent)]/40 transition"
                >
                  {/* Food Image */}
                  {diet.image_url && (
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={diet.image_url}
                        alt={diet.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* Mood badge over image */}
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ background: color }}
                      >
                        {MOOD_OPTIONS.find((m) => m.value === diet.mood)?.emoji}{" "}
                        {MOOD_OPTIONS.find((m) => m.value === diet.mood)?.label}
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Title */}
                    <h2 className="text-lg font-semibold text-white">{diet.title}</h2>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{diet.description}</p>

                    {/* Food list */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color }}>
                        Recommended Foods
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {(isExpanded ? foods : foods.slice(0, 4)).map((food, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300"
                            style={{ background: `${color}11`, border: `1px solid ${color}33` }}
                          >
                            <span className="text-base">🍽️</span>
                            <span className="truncate">{food}</span>
                          </div>
                        ))}
                      </div>

                      {foods.length > 4 && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : diet.id)}
                          className="mt-3 text-xs font-medium hover:underline transition"
                          style={{ color }}
                        >
                          {isExpanded ? "Show less ↑" : `+ ${foods.length - 4} more foods ↓`}
                        </button>
                      )}
                    </div>

                    {/* Tip */}
                    {diet.tips && (
                      <div
                        className="mt-4 p-3 rounded-xl text-xs text-gray-300 leading-relaxed"
                        style={{ background: `${color}11`, borderLeft: `3px solid ${color}` }}
                      >
                        💡 {diet.tips}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {diets.length === 0 && !loading && (
              <div className="col-span-2 text-center py-20 text-gray-500">
                No diet plans found for this mood yet.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}