"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function TrackerChart({ data }: { data: any[] }) {
  const chartData = data
    .slice(0, 7)
    .reverse()
    .map((d) => ({
      day: new Date(d.created_at).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      mood: d.mood,
    }));

  // ✅ Average mood
  const avgMood =
    chartData.length > 0
      ? (chartData.reduce((acc, cur) => acc + cur.mood, 0) / chartData.length).toFixed(1)
      : null;

  // ✅ Mood name + emoji
  const moodLabel = (mood: number) => {
    switch (mood) {
      case 1:
        return "Very Sad 😞";
      case 2:
        return "Sad 😕";
      case 3:
        return "Neutral 😐";
      case 4:
        return "Happy 🙂";
      case 5:
        return "Very Happy 😄";
      default:
        return "";
    }
  };

  // ✅ Mood frequency for donut chart
  const moodCounts: Record<number, number> = {};
  chartData.forEach((d) => {
    moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });

  const total = chartData.length || 1;
  const moodBreakdown = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: Number(mood),
    label: moodLabel(Number(mood)),
    value: Math.round((count / total) * 100),
  }));

  const MOOD_COLORS = [
    "var(--color-accent)", // Very Sad (purple accent)
    "var(--color-accent-light)", // Sad (lighter)
    "var(--color-text-muted)", // Neutral
    "var(--color-accent-soft)", // Happy
    "var(--color-accent)", // Very Happy again for consistency
  ];

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-10">
      {/* ✅ Average Mood Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl p-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-header)]">
            Weekly Average Mood
          </h3>
          {avgMood ? (
            <p className="text-[var(--color-text-body)] text-sm mt-1">
              Based on your last {chartData.length} entries
            </p>
          ) : (
            <p className="text-[var(--color-text-body)] text-sm mt-1">
              No data yet — start logging moods!
            </p>
          )}
        </div>
        {avgMood && (
          <div className="flex items-center justify-center mt-3 sm:mt-0 gap-2 text-xl font-semibold text-[var(--color-accent)]">
            <span>{moodLabel(Number(avgMood)).split(" ")[1]}</span>
            <span>{avgMood}/5</span>
          </div>
        )}
      </div>

      {/* ✅ Line Chart */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-header)] mb-4 text-center">
          Weekly Mood Trend
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="moodLine" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-accent)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-accent)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fill: "var(--color-text-body)" }} />
            <YAxis domain={[1, 5]} tick={{ fill: "var(--color-text-body)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-body)",
              }}
              formatter={(value: any) => [`${moodLabel(Number(value))}`, "Mood"]}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="url(#moodLine)"
              strokeWidth={3}
              dot={{ r: 5, fill: "var(--color-accent)" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Mood Breakdown Donut */}
      {moodBreakdown.length > 0 && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--color-text-header)] mb-4">
            Mood Breakdown
          </h3>

          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moodBreakdown}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {moodBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={MOOD_COLORS[entry.mood - 1] || "var(--color-accent)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <ul className="space-y-2 text-sm text-[var(--color-text-body)]">
              {moodBreakdown.map((m) => (
                <li key={m.mood} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        MOOD_COLORS[m.mood - 1] || "var(--color-accent)",
                    }}
                  ></span>
                  {m.label} — {m.value}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
