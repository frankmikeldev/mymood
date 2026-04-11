"use client";

const font = "'Manrope', sans-serif";

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
  const avgMood      = (entries.reduce((acc, e) => acc + e.mood, 0) / totalEntries).toFixed(1);
  const lastLog      = uniqueDays[0].toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  const streakMessage =
    streak >= 7 ? "You're on a roll. Keep going!" :
    streak >= 3 ? "Great consistency. Keep logging!" :
    "Every day counts. Keep going.";

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Your Progress
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font, fontWeight: 400, marginTop: "4px" }}>
            {streakMessage}
          </p>
        </div>
        <span className="text-2xl">🔥</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Day Streak", value: `${streak}🔥`, sub: "consecutive days"  },
          { label: "Total Logs", value: totalEntries,   sub: "all time"           },
          { label: "Avg Mood",   value: `${avgMood}/5`, sub: "last 30 entries"   },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}
          >
            <p style={{ fontWeight: 800, fontSize: "20px", color: "#111111", fontFamily: font }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#444444", fontFamily: font, marginTop: "4px" }}>
              {stat.label}
            </p>
            <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font, marginTop: "16px", textAlign: "right" }}>
        Last logged: {lastLog}
      </p>
    </div>
  );
}