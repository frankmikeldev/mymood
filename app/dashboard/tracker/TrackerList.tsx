"use client";

import { useState } from "react";

const MOOD_LABELS: Record<number, string> = {
  1: "Very Sad",
  2: "Sad",
  3: "Neutral",
  4: "Happy",
  5: "Very Happy",
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
    <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Entries</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{entries.length} total logs</p>
        </div>
      </div>

      <ul className="space-y-2">
        {visible.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-4 p-3 rounded-xl border transition ${
              item.optimistic
                ? "border-dashed border-[var(--color-accent)]/40 opacity-60"
                : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent)]/40"
            }`}
          >
            {/* Mood indicator */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
              style={{ background: `${MOOD_COLORS[item.mood]}22` }}
            >
              {MOOD_EMOJIS[item.mood]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: MOOD_COLORS[item.mood] }}
                >
                  {MOOD_LABELS[item.mood]}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: `${MOOD_COLORS[item.mood]}22`,
                    color: MOOD_COLORS[item.mood],
                  }}
                >
                  {item.mood}/5
                </span>
                {item.optimistic && (
                  <span className="text-xs text-[var(--color-text-muted)]">saving...</span>
                )}
              </div>
              {item.notes && (
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{item.notes}</p>
              )}
            </div>

            {/* Date */}
            <div className="text-right shrink-0">
              <p className="text-xs text-[var(--color-text-muted)]">
                {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] opacity-60">
                {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {entries.length > 7 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition"
        >
          {showAll ? "Show less ↑" : `Show all ${entries.length} entries ↓`}
        </button>
      )}
    </div>
  );
}