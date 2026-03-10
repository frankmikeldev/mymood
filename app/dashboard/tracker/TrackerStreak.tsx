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
    streak >= 7 ? "You're on fire! 🔥 Keep it up!" :
    streak >= 3 ? "Great consistency! Keep going 💪" :
    "Every day counts. Keep logging! 🌱";

  return (
    <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Progress</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{streakMessage}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-2xl">
          🔥
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Day Streak", value: `${streak}🔥`, sub: "consecutive days" },
          { label: "Total Logs", value: totalEntries, sub: "all time entries" },
          { label: "Avg Mood", value: `${avgMood}/5`, sub: "last 30 entries" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-3 text-center"
          >
            <p className="text-xl font-bold text-[var(--color-accent)]">{stat.value}</p>
            <p className="text-xs font-medium text-[var(--color-text-primary)] mt-1">{stat.label}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{stat.sub}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 text-right">
        Last logged: {lastLog}
      </p>
    </div>
  );
}