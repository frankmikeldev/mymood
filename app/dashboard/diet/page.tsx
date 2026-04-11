"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Apple } from "lucide-react";

const supabase = createClient();
const font = "'Manrope', sans-serif";

const MOOD_OPTIONS = [
  { value: "",               label: "All Plans",       emoji: "🍽️" },
  { value: "anxiety",        label: "Anxiety",         emoji: "😟" },
  { value: "depression",     label: "Depression",      emoji: "😔" },
  { value: "stress",         label: "Stress",          emoji: "😣" },
  { value: "sad",            label: "Sadness",         emoji: "😢" },
  { value: "anger",          label: "Anger",           emoji: "😠" },
  { value: "burnout",        label: "Burnout",         emoji: "😮‍💨" },
  { value: "loneliness",     label: "Loneliness",      emoji: "🫂" },
  { value: "overwhelm",      label: "Overwhelm",       emoji: "🌊" },
  { value: "grief",          label: "Grief",           emoji: "💙" },
  { value: "low_self_esteem",label: "Low Self-Esteem", emoji: "🌱" },
  { value: "low_energy",     label: "Low Energy",      emoji: "🔋" },
  { value: "sleep",          label: "Sleep Issues",    emoji: "😴" },
  { value: "menstruation",   label: "Menstruation",    emoji: "🌸" },
  { value: "pms",            label: "PMS",             emoji: "🌙" },
];

export default function DietPage() {
  const [diets, setDiets]           = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState<string | null>(null);

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
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div
          className="flex items-start justify-between mb-8 pb-5"
          style={{ borderBottom: "1px solid #E2DDD6" }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              Mood-Based Nutrition
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "4px" }}>
              Food plans tailored to support your mental and emotional wellbeing.
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
          >
            <Apple size={18} style={{ color: "#111111" }} />
          </div>
        </div>

        {/* ── Mood Filter Pills ── */}
        <div className="mb-6">
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Filter by mood
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className="px-3 py-1.5 rounded-xl text-xs border transition"
                style={{
                  fontFamily: font,
                  fontWeight: selectedMood === m.value ? 700 : 500,
                  backgroundColor: selectedMood === m.value ? "#111111" : "transparent",
                  color: selectedMood === m.value ? "#F5F0E8" : "#6b7280",
                  borderColor: selectedMood === m.value ? "#111111" : "#E2DDD6",
                }}
                onMouseEnter={e => { if (selectedMood !== m.value) e.currentTarget.style.borderColor = "#111111"; }}
                onMouseLeave={e => { if (selectedMood !== m.value) e.currentTarget.style.borderColor = "#E2DDD6"; }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count ── */}
        <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, marginBottom: "24px" }}>
          Showing{" "}
          <span style={{ color: "#111111", fontWeight: 600 }}>{diets.length}</span> plans
          {selectedMood && (
            <> for <span style={{ color: "#111111", fontWeight: 600 }}>{selectedLabel}</span></>
          )}
        </p>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#E2DDD6", borderTopColor: "transparent" }}
            />
          </div>
        )}

        {/* ── Diet Cards ── */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-5">

            {diets.length === 0 && (
              <div
                className="col-span-2 text-center py-20 rounded-2xl"
                style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
              >
                <p className="text-3xl mb-3">🥗</p>
                <p style={{ fontWeight: 700, fontSize: "16px", color: "#111111", fontFamily: font }}>
                  No plans found
                </p>
                <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font, marginTop: "4px" }}>
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
                  className="rounded-2xl overflow-hidden transition"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2DDD6",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#bbb")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2DDD6")}
                >
                  {/* Food Image */}
                  {diet.image_url && (
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={diet.image_url}
                        alt={diet.title}
                        className="w-full h-full object-cover"
                        style={{ opacity: 0.9 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {moodOption && (
                        <div
                          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs"
                          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", fontWeight: 600, color: "#111111", fontFamily: font }}
                        >
                          {moodOption.emoji} {moodOption.label}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5">

                    {/* No image mood badge */}
                    {!diet.image_url && moodOption && (
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs mb-3"
                        style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6", fontWeight: 600, color: "#444444", fontFamily: font }}
                      >
                        {moodOption.emoji} {moodOption.label}
                      </div>
                    )}

                    {/* Title */}
                    <h2 style={{ fontWeight: 700, fontSize: "17px", color: "#111111", fontFamily: font, lineHeight: 1.3 }}>
                      {diet.title}
                    </h2>
                    <p style={{ color: "#444444", fontSize: "15px", fontFamily: font, fontWeight: 400, marginTop: "6px", lineHeight: 1.75 }}>
                      {diet.description}
                    </p>

                    {/* Food list */}
                    <div className="mt-5">
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                        Recommended Foods
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {(isExpanded ? foods : foods.slice(0, 4)).map((food, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                            style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6", color: "#444444", fontFamily: font, fontWeight: 400 }}
                          >
                            <span>🍽️</span>
                            <span className="truncate">{food}</span>
                          </div>
                        ))}
                      </div>

                      {foods.length > 4 && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : diet.id)}
                          className="mt-3 transition"
                          style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 600 }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#111111")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                        >
                          {isExpanded ? "Show less ↑" : `+ ${foods.length - 4} more foods ↓`}
                        </button>
                      )}
                    </div>

                    {/* Tip */}
                    {diet.tips && (
                      <div
                        className="mt-4 p-3 rounded-xl"
                        style={{
                          backgroundColor: "#F5F0E8",
                          borderLeft: "3px solid #E8521A",
                          fontFamily: font,
                        }}
                      >
                        <p style={{ fontSize: "13px", color: "#444444", fontFamily: font, fontWeight: 400, lineHeight: 1.7 }}>
                          💡 {diet.tips}
                        </p>
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