"use client";

export default function TrackerStreak({ entries }: { entries: any[] }) {
  if (!entries.length) return null;

  const uniqueDays = Array.from(
    new Set(entries.map((e) => new Date(e.created_at).toDateString()))
  )
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const diff = (uniqueDays[i].getTime() - uniqueDays[i + 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  const totalEntries = entries.length;
  const avgMood = (entries.reduce((acc, e) => acc + e.mood, 0) / totalEntries).toFixed(1);
  const lastLog = uniqueDays[0].toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  const streakMessage =
    streak >= 7 ? "You're on a roll. Keep going!" :
    streak >= 3 ? "Great consistency. Keep logging!" :
    "Every day counts. Keep going.";

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest">
            Your Progress
          </h3>
          <p className="text-sm text-[var(--color-text-body)] opacity-60 mt-1">{streakMessage}</p>
        </div>
        <span className="text-2xl">🔥</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Day Streak", value: `${streak}🔥`, sub: "consecutive days" },
          { label: "Total Logs", value: totalEntries, sub: "all time" },
          { label: "Avg Mood", value: `${avgMood}/5`, sub: "last 30 entries" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl p-3 text-center"
          >
            <p className="text-xl font-bold text-[var(--color-text-header)]">{stat.value}</p>
            <p className="text-xs font-medium text-[var(--color-text-body)] opacity-60 mt-1">{stat.label}</p>
            <p className="text-xs text-[var(--color-text-body)] opacity-30">{stat.sub}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-text-body)] opacity-30 mt-4 text-right">
        Last logged: {lastLog}
      </p>
    </div>
  );
}