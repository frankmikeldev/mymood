"use client";

import { useState } from "react";

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
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest">
            Recent Entries
          </h3>
          <p className="text-sm text-[var(--color-text-body)] opacity-50 mt-0.5">
            {entries.length} total logs
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {visible.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-4 p-3 rounded-xl border transition ${
              item.optimistic
                ? "border-dashed border-[var(--color-border)] opacity-50"
                : "border-[var(--color-border)] bg-[var(--color-bg-main)] hover:border-[var(--color-text-header)] hover:border-opacity-20"
            }`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: `${MOOD_COLORS[item.mood]}18` }}
            >
              {MOOD_EMOJIS[item.mood]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: MOOD_COLORS[item.mood] }}>
                  {MOOD_LABELS[item.mood]}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: `${MOOD_COLORS[item.mood]}18`,
                    color: MOOD_COLORS[item.mood],
                  }}
                >
                  {item.mood}/5
                </span>
                {item.optimistic && (
                  <span className="text-xs text-[var(--color-text-body)] opacity-40">saving...</span>
                )}
              </div>
              {item.notes && (
                <p className="text-xs text-[var(--color-text-body)] opacity-50 mt-0.5 truncate">
                  {item.notes}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-[var(--color-text-body)] opacity-40">
                {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-[var(--color-text-body)] opacity-30">
                {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {entries.length > 7 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-body)] opacity-50 hover:opacity-100 hover:border-[var(--color-text-header)] transition"
        >
          {showAll ? "Show less ↑" : `Show all ${entries.length} entries ↓`}
        </button>
      )}
    </div>
  );
}