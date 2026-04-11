"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const font = "'Manrope', sans-serif";

const MOODS = [
  { value: 1, emoji: "😞", label: "Very Sad",  color: "#ef4444" },
  { value: 2, emoji: "😕", label: "Sad",        color: "#f97316" },
  { value: 3, emoji: "😐", label: "Neutral",    color: "#eab308" },
  { value: 4, emoji: "🙂", label: "Happy",      color: "#22c55e" },
  { value: 5, emoji: "😄", label: "Very Happy", color: "#3b82f6" },
];

export default function TrackerEmpty({
  onCreate,
}: {
  // ✅ Updated to match MyTracker and TrackerLogForm
  onCreate: (data: {
    mood?: number;
    custom_mood?: string;
    notes?: string;
  }) => void;
}) {
  const [mood, setMood]             = useState<number | null>(null);
  const [customMood, setCustomMood] = useState("");
  const [notes, setNotes]           = useState("");
  const [dropdownOpen, setDropdown] = useState(false);

  const selectedMood = MOODS.find((m) => m.value === mood);
  const canSubmit    = mood !== null || customMood.trim().length > 0;

  const handleLog = () => {
    if (!canSubmit) return;
    onCreate({
      mood:        mood ?? undefined,
      custom_mood: customMood.trim() || undefined,
      notes:       notes.trim() || undefined,
    });
    setMood(null);
    setCustomMood("");
    setNotes("");
  };

  return (
    <div className="space-y-4">

      {/* Welcome card */}
      <div
        className="text-center rounded-2xl p-10"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2DDD6",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div className="text-4xl mb-4">🌱</div>
        <h3 style={{ fontWeight: 700, fontSize: "17px", color: "#111111", fontFamily: font, marginBottom: "8px" }}>
          Start Your Mood Journey
        </h3>
        <p style={{ fontSize: "15px", color: "#6b7280", fontFamily: font, fontWeight: 400, maxWidth: "360px", margin: "0 auto", lineHeight: 1.75 }}>
          Log your first mood below. Over time you will see patterns, streaks, and insights about your emotional wellbeing.
        </p>
      </div>

      {/* Log form */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2DDD6",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          How are you feeling right now?
        </p>

        {/* ✅ Free text first */}
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", fontFamily: font, marginBottom: "8px" }}>
            What's on your mind?
            <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: "6px", fontSize: "13px" }}>(optional)</span>
          </p>
          <textarea
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            placeholder="Write freely about how you're feeling today..."
            rows={4}
            className="w-full resize-none outline-none transition rounded-xl"
            style={{
              padding: "14px 16px",
              fontSize: "15px",
              fontFamily: font,
              color: "#111111",
              backgroundColor: "#F5F0E8",
              border: "1px solid #E2DDD6",
              lineHeight: 1.75,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
          />
          <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font, textAlign: "right", marginTop: "4px" }}>
            {customMood.length} characters
          </p>
        </div>

        {/* ✅ Mood dropdown */}
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", fontFamily: font, marginBottom: "8px" }}>
            Tag a mood score
            <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: "6px", fontSize: "13px" }}>(optional)</span>
          </p>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdown(!dropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl transition"
              style={{
                padding: "13px 16px",
                backgroundColor: selectedMood ? "#111111" : "#F5F0E8",
                border: `1px solid ${selectedMood ? "#111111" : "#E2DDD6"}`,
                fontFamily: font,
              }}
            >
              <div className="flex items-center gap-2.5">
                {selectedMood ? (
                  <>
                    <span style={{ fontSize: "20px" }}>{selectedMood.emoji}</span>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", fontFamily: font }}>
                      {selectedMood.label}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: "15px", fontWeight: 400, color: "#9ca3af", fontFamily: font }}>
                    Select a mood score...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedMood && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setMood(null); setDropdown(false); }}
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: font,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    clear
                  </span>
                )}
                <ChevronDown
                  size={16}
                  style={{
                    color: selectedMood ? "#ffffff" : "#9ca3af",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </div>
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2DDD6",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                }}
              >
                {MOODS.map((m) => (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => { setMood(m.value); setDropdown(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 transition"
                    style={{ fontFamily: font }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F5F0E8")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: "22px" }}>{m.emoji}</span>
                      <div className="text-left">
                        <p style={{ fontSize: "15px", fontWeight: 600, color: "#111111", fontFamily: font }}>
                          {m.label}
                        </p>
                        <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>
                          Score {m.value}/5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                      {mood === m.value && <Check size={14} style={{ color: "#E8521A" }} />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedMood && (
            <div className="flex items-center gap-3 mt-3 px-1">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2DDD6" }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(selectedMood.value / 5) * 100}%`,
                    backgroundColor: selectedMood.color,
                  }}
                />
              </div>
              <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, fontWeight: 600 }}>
                {selectedMood.value}/5
              </span>
            </div>
          )}
        </div>

        {/* ✅ Short note */}
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", fontFamily: font, marginBottom: "8px" }}>
            Add a short note
            <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: "6px", fontSize: "13px" }}>(optional)</span>
          </p>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. after gym, bad sleep, work stress..."
            className="w-full rounded-xl outline-none transition"
            style={{
              padding: "12px 16px",
              fontSize: "15px",
              fontFamily: font,
              color: "#111111",
              backgroundColor: "#F5F0E8",
              border: "1px solid #E2DDD6",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
          />
        </div>

        {!canSubmit && (
          <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, textAlign: "center", fontStyle: "italic" }}>
            Write something or select a mood to log your entry
          </p>
        )}

        {/* ✅ Submit */}
        <button
          onClick={handleLog}
          disabled={!canSubmit}
          className="w-full py-3 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
          style={{
            backgroundColor: "#E8521A",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "15px",
            fontFamily: font,
            boxShadow: canSubmit ? "0 2px 12px rgba(232,82,26,0.3)" : "none",
          }}
          onMouseEnter={e => { if (canSubmit) e.currentTarget.style.backgroundColor = "#D4480F"; }}
          onMouseLeave={e => { if (canSubmit) e.currentTarget.style.backgroundColor = "#E8521A"; }}
        >
          Log My First Mood
        </button>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { emoji: "📈", title: "See Trends",    desc: "Visualize your emotional patterns over time" },
          { emoji: "🔥", title: "Build Streaks", desc: "Stay consistent and earn daily streaks"      },
          { emoji: "💡", title: "Gain Insights", desc: "Understand what affects your mood most"      },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2DDD6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#111111", fontFamily: font }}>
              {item.title}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 400, marginTop: "4px", lineHeight: 1.7 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}