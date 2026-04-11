"use client";

import { useState } from "react";

const font = "'Manrope', sans-serif";

const MOOD_LABELS: Record<number, string> = {
  1: "Very Sad", 2: "Sad", 3: "Neutral", 4: "Happy", 5: "Very Happy",
};
const MOOD_EMOJIS: Record<number, string> = {
  1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😄",
};
const MOOD_COLORS: Record<number, string> = {
  1: "#ef4444", 2: "#f97316", 3: "#eab308", 4: "#22c55e", 5: "#3b82f6",
};

export default function TrackerList({ entries }: { entries: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? entries : entries.slice(0, 7);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Recent Entries
          </p>
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginTop: "2px" }}>
            {entries.length} total logs
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {visible.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-xl border transition"
            style={{
              borderStyle:     item.optimistic ? "dashed" : "solid",
              borderColor:     "#E2DDD6",
              backgroundColor: "#F5F0E8",
              opacity:         item.optimistic ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!item.optimistic) e.currentTarget.style.borderColor = "#111111"; }}
            onMouseLeave={e => { if (!item.optimistic) e.currentTarget.style.borderColor = "#E2DDD6"; }}
          >
            {/* Emoji avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: `${MOOD_COLORS[item.mood]}18` }}
            >
              {MOOD_EMOJIS[item.mood]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: "14px", fontWeight: 700, color: MOOD_COLORS[item.mood], fontFamily: font }}>
                  {MOOD_LABELS[item.mood]}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: `${MOOD_COLORS[item.mood]}18`, color: MOOD_COLORS[item.mood], fontFamily: font, fontWeight: 600 }}
                >
                  {item.mood}/5
                </span>
                {item.optimistic && (
                  <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>saving...</span>
                )}
              </div>
              {item.notes && (
                <p className="truncate mt-0.5" style={{ fontSize: "13px", color: "#6b7280", fontFamily: font }}>
                  {item.notes}
                </p>
              )}
            </div>

            {/* Date/time */}
            <div className="text-right shrink-0">
              <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: font }}>
                {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>
                {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {entries.length > 7 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 rounded-xl border transition"
          style={{ borderColor: "#E2DDD6", fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 500 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#111111"; e.currentTarget.style.color = "#111111"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2DDD6"; e.currentTarget.style.color = "#6b7280"; }}
        >
          {showAll ? "Show less ↑" : `Show all ${entries.length} entries ↓`}
        </button>
      )}
    </div>
  );
}