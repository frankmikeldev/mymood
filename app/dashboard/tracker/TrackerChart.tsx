"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const font = "'Manrope', sans-serif";

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
    day:  new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: d.mood,
  }));

  const avgMood = chartData.length
    ? (chartData.reduce((acc, cur) => acc + cur.mood, 0) / chartData.length).toFixed(1)
    : null;

  const moodCounts: Record<number, number> = {};
  chartData.forEach((d) => { moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1; });
  const total = chartData.length || 1;
  const moodBreakdown = Object.entries(moodCounts).map(([mood, count]) => ({
    mood:  Number(mood),
    label: MOOD_LABELS[Number(mood)],
    value: Math.round((count / total) * 100),
    count,
  }));

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2DDD6",
      borderRadius: 8,
      color: "#111111",
      fontFamily: font,
      fontSize: "13px",
    },
  };

  return (
    <div className="space-y-4">

      {/* Line Chart — white card */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Mood Trend
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginTop: "2px" }}>
              Last 14 entries
            </p>
          </div>
          {avgMood && (
            <div className="text-right">
              <p style={{ fontFamily: font }}>
                <span style={{ fontWeight: 800, fontSize: "24px", color: "#111111" }}>{avgMood}</span>
                <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 400 }}>/5</span>
              </p>
              <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>avg mood</p>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD6" />
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: font }} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280", fontSize: 11, fontFamily: font }} />
            <Tooltip {...tooltipStyle} formatter={(value: any) => [MOOD_LABELS[Number(value)], "Mood"]} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#E8521A"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#E8521A", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Breakdown — white card */}
      {moodBreakdown.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
            Mood Breakdown
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={moodBreakdown}
                  dataKey="value"
                  nameKey="label"
                  cx="50%" cy="50%"
                  innerRadius={40} outerRadius={70}
                  paddingAngle={4}
                >
                  {moodBreakdown.map((entry) => (
                    <Cell key={entry.mood} fill={MOOD_COLORS[entry.mood] || "#888"} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(value: any) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2.5 w-full sm:w-auto">
              {moodBreakdown.sort((a, b) => b.count - a.count).map((m) => (
                <li key={m.mood} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: MOOD_COLORS[m.mood] }} />
                  <span className="flex-1" style={{ fontSize: "13px", color: "#444444", fontFamily: font }}>{m.label}</span>
                  <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>{m.count}x · {m.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}