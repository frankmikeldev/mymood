"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const MOOD_LABELS: Record<number, string> = {
  1: "Very Sad 😞",
  2: "Sad 😕",
  3: "Neutral 😐",
  4: "Happy 🙂",
  5: "Very Happy 😄",
};

const MOOD_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#3b82f6",
};

export default function TrackerChart({ data }: { data: any[] }) {
  const chartData = data.slice(0, 14).reverse().map((d) => ({
    day: new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: d.mood,
  }));

  const avgMood = chartData.length
    ? (chartData.reduce((acc, cur) => acc + cur.mood, 0) / chartData.length).toFixed(1)
    : null;

  const moodCounts: Record<number, number> = {};
  chartData.forEach((d) => { moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1; });
  const total = chartData.length || 1;
  const moodBreakdown = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: Number(mood),
    label: MOOD_LABELS[Number(mood)],
    value: Math.round((count / total) * 100),
    count,
  }));

  return (
    <div className="space-y-6">

      {/* Line Chart */}
      <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Mood Trend</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Last 14 entries</p>
          </div>
          {avgMood && (
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--color-accent)]">{avgMood}<span className="text-sm font-normal text-[var(--color-text-muted)]">/5</span></p>
              <p className="text-xs text-[var(--color-text-muted)]">avg mood</p>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "var(--color-box)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
              }}
              formatter={(value: any) => [MOOD_LABELS[Number(value)], "Mood"]}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={{ r: 5, fill: "var(--color-accent)", strokeWidth: 2, stroke: "var(--color-box)" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      {moodBreakdown.length > 0 && (
        <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">Mood Breakdown</h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={moodBreakdown}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {moodBreakdown.map((entry) => (
                    <Cell key={entry.mood} fill={MOOD_COLORS[entry.mood] || "var(--color-accent)"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-box)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(value: any) => [`${value}%`]}
                />
              </PieChart>
            </ResponsiveContainer>

            <ul className="space-y-2.5 text-sm w-full sm:w-auto">
              {moodBreakdown.sort((a, b) => b.count - a.count).map((m) => (
                <li key={m.mood} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: MOOD_COLORS[m.mood] }} />
                  <span className="text-[var(--color-text-primary)] flex-1">{m.label}</span>
                  <span className="text-[var(--color-text-muted)] text-xs">{m.count}x · {m.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}