"use client";

export default function TrackerStreak({ entries }: { entries: any[] }) {
  if (!entries.length) return null;

  // ✅ Extract unique days from check-ins
  const uniqueDays = Array.from(
    new Set(
      entries.map((e) => new Date(e.created_at).toDateString()) // normalize by day
    )
  )
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime()); // sort descending

  // ✅ Calculate streak
  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const diff =
      (uniqueDays[i].getTime() - uniqueDays[i + 1].getTime()) /
      (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  const lastLog = uniqueDays[0];
  const formattedDate = lastLog.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-4 text-[var(--color-text-body)]">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-header)]">
          🔥 Mood Streak
        </h3>
        <p className="text-sm text-[var(--color-text-body)] mt-1">
          You’ve logged moods for <b>{streak}</b>{" "}
          {streak === 1 ? "day" : "days"} in a row!
        </p>
      </div>

      <div className="text-center bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-2">
        <p className="text-[var(--color-text-header)] font-semibold text-lg">
          {streak}🔥
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Last log: {formattedDate}
        </p>
      </div>
    </div>
  );
}
