"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Download,
  CalendarDays, Smile, BarChart2, FileText,
} from "lucide-react";

const supabase = createClient();

const MOOD_MAP: Record<number, { label: string; color: string; emoji: string }> = {
  1: { label: "Very Sad", color: "#ef4444", emoji: "😞" },
  2: { label: "Sad", color: "#f97316", emoji: "😕" },
  3: { label: "Neutral", color: "#eab308", emoji: "😐" },
  4: { label: "Happy", color: "#22c55e", emoji: "🙂" },
  5: { label: "Very Happy", color: "#3b82f6", emoji: "😄" },
};

export default function HistoryPage() {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [weeklyBreakdown, setWeeklyBreakdown] = useState<any[]>([]);
  const [filterDays, setFilterDays] = useState(7);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    topMoodNum: 0,
    trend: "neutral" as "up" | "down" | "neutral",
    streak: 0,
    bestDay: "",
    worstDay: "",
  });

  useEffect(() => { fetchMoodHistory(); }, [filterDays]);

  async function fetchMoodHistory() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - filterDays);

    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", sinceDate.toISOString())
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      setLoading(false);
      setMoodData([]);
      setDistribution([]);
      setWeeklyBreakdown([]);
      setSummary("");
      return;
    }

    const formatted = data.map((entry: any) => ({
      date: new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      moodScore: entry.mood,
      moodLabel: MOOD_MAP[entry.mood]?.label || "",
      moodEmoji: MOOD_MAP[entry.mood]?.emoji || "",
      notes: entry.notes,
      created_at: entry.created_at,
    }));
    setMoodData(formatted);

    const counts: Record<number, number> = {};
    data.forEach((entry: any) => { counts[entry.mood] = (counts[entry.mood] || 0) + 1; });
    setDistribution(
      Object.entries(counts).map(([mood, value]) => ({
        moodNum: Number(mood),
        name: MOOD_MAP[Number(mood)]?.label || mood,
        value,
        color: MOOD_MAP[Number(mood)]?.color || "#888",
        emoji: MOOD_MAP[Number(mood)]?.emoji || "",
      }))
    );

    const dayMap: Record<string, number[]> = {};
    data.forEach((entry: any) => {
      const day = new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short" });
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(entry.mood);
    });
    setWeeklyBreakdown(
      Object.entries(dayMap).map(([day, moods]) => ({
        day,
        avg: parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)),
      }))
    );

    const avg = data.reduce((acc: number, cur: any) => acc + cur.mood, 0) / data.length;
    const topMoodNum = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 3);

    const half = Math.floor(data.length / 2);
    const firstHalfAvg = data.slice(0, half).reduce((a: number, b: any) => a + b.mood, 0) / (half || 1);
    const secondHalfAvg = data.slice(half).reduce((a: number, b: any) => a + b.mood, 0) / (data.length - half || 1);
    const trend = secondHalfAvg > firstHalfAvg + 0.3 ? "up" : secondHalfAvg < firstHalfAvg - 0.3 ? "down" : "neutral";

    const uniqueDays = [...new Set(data.map((e: any) => new Date(e.created_at).toDateString()))];
    let streak = 0;
    for (let i = 0; i < uniqueDays.length; i++) {
      const d = new Date(uniqueDays[uniqueDays.length - 1 - i]);
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (d.toDateString() === expected.toDateString()) streak++;
      else break;
    }

    const bestEntry = data.reduce((a: any, b: any) => a.mood > b.mood ? a : b, data[0]);
    const worstEntry = data.reduce((a: any, b: any) => a.mood < b.mood ? a : b, data[0]);

    setStats({
      total: data.length,
      average: parseFloat(avg.toFixed(1)),
      topMoodNum,
      trend,
      streak,
      bestDay: bestEntry ? new Date(bestEntry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      worstDay: worstEntry ? new Date(worstEntry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    });

    const topMoodInfo = MOOD_MAP[topMoodNum];
    let insight = "";
    if (avg >= 4) insight = "You're doing well emotionally. Keep up the positive habits!";
    else if (avg >= 3) insight = "Your mood has had some ups and downs. Consider what helped on your better days.";
    else insight = "This was a challenging period. Be gentle with yourself and consider reaching out for support.";

    setSummary(
      `Over the past ${filterDays} days, you logged ${data.length} mood entries. ` +
      `Your most frequent mood was "${topMoodInfo?.label || ""}" ${topMoodInfo?.emoji || ""}. ` +
      `Your average mood was ${avg.toFixed(1)} out of 5. ` +
      `Your mood trend is ${trend === "up" ? "improving 📈" : trend === "down" ? "declining 📉" : "stable ➡️"}. ` +
      `${insight}`
    );

    setLoading(false);
  }

  async function downloadPDF() {
    const res = await fetch("/api/mood-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moodData, summary }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mood-report.pdf";
    a.click();
  }

  const TrendIcon = () => {
    if (stats.trend === "up") return <TrendingUp size={14} className="text-green-400" />;
    if (stats.trend === "down") return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-[var(--color-text-body)]" />;
  };

  const topMoodInfo = MOOD_MAP[stats.topMoodNum];

  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-bg-card)",
      border: "1px solid var(--color-border)",
      borderRadius: 8,
      color: "var(--color-text-header)",
    },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--color-text-header)] border-t-transparent rounded-full animate-spin opacity-40" />
        <p className="text-sm text-[var(--color-text-body)] opacity-40">Loading your mood history...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">Mood History</h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Track your emotional trends and insights
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDays(d)}
                className={`px-4 py-2 rounded-xl border text-sm transition ${
                  filterDays === d
                    ? "border-[var(--color-text-header)] bg-[var(--color-text-header)] text-[var(--color-bg-main)] font-medium"
                    : "border-[var(--color-border)] text-[var(--color-text-body)] opacity-60 hover:opacity-100 hover:border-[var(--color-text-header)]"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {moodData.length === 0 ? (
          <div className="text-center py-24 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-base font-semibold text-[var(--color-text-header)]">No entries for this period</p>
            <p className="text-sm text-[var(--color-text-body)] opacity-50 mt-2">
              Try selecting a longer time range or log more moods in the Tracker.
            </p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: CalendarDays,
                  label: "Entries Logged",
                  value: stats.total,
                  sub: `Last ${filterDays} days`,
                },
                {
                  icon: BarChart2,
                  label: "Avg Mood",
                  value: `${stats.average}/5`,
                  sub: stats.trend === "up" ? "Improving" : stats.trend === "down" ? "Declining" : "Stable",
                  extra: <TrendIcon />,
                },
                {
                  icon: Smile,
                  label: "Top Mood",
                  value: `${topMoodInfo?.emoji || ""} ${topMoodInfo?.label || "—"}`,
                  sub: "Most frequent",
                },
                {
                  icon: TrendingUp,
                  label: "Current Streak",
                  value: `${stats.streak} day${stats.streak !== 1 ? "s" : ""}`,
                  sub: "Consecutive logging",
                },
              ].map((card, i) => (
                <div key={i} className="p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <card.icon size={16} className="text-[var(--color-text-body)] opacity-40" />
                    {card.extra}
                  </div>
                  <p className="text-xl font-bold text-[var(--color-text-header)]">{card.value}</p>
                  <p className="text-xs text-[var(--color-text-body)] opacity-50 mt-1">{card.label}</p>
                  <p className="text-xs text-[var(--color-text-body)] opacity-30">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Best / Worst Day */}
            {stats.bestDay && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl flex items-center gap-3">
                  <span className="text-xl">🌟</span>
                  <div>
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">Best Day</p>
                    <p className="text-sm font-semibold text-green-400">{stats.bestDay}</p>
                  </div>
                </div>
                <div className="p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl flex items-center gap-3">
                  <span className="text-xl">💙</span>
                  <div>
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">Hardest Day</p>
                    <p className="text-sm font-semibold text-[var(--color-text-body)] opacity-60">{stats.worstDay}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary + PDF */}
            <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[var(--color-text-header)] flex items-center gap-2 text-sm">
                  <FileText size={15} className="opacity-50" />
                  Wellness Insight
                </h3>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] opacity-60 hover:opacity-100 hover:border-[var(--color-text-header)] transition text-xs"
                >
                  <Download size={13} /> Download PDF
                </button>
              </div>
              <p className="text-sm text-[var(--color-text-body)] opacity-70 leading-relaxed">{summary}</p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Line Chart */}
              <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
                <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-header)]">Mood Trend Over Time</h3>
                <p className="text-xs text-[var(--color-text-body)] opacity-40 mb-5">Your mood score across this period</p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" tick={{ fill: "var(--color-text-body)", fontSize: 10 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-body)", fontSize: 10 }} />
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(v: any, n: any, p: any) => [`${p.payload.moodEmoji} ${p.payload.moodLabel}`, "Mood"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="moodScore"
                      stroke="var(--color-text-header)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-text-header)", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
                <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-header)]">Mood Distribution</h3>
                <p className="text-xs text-[var(--color-text-body)] opacity-40 mb-5">Breakdown of your moods</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={distribution} dataKey="value" outerRadius={75} innerRadius={35}>
                      {distribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {distribution.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-[var(--color-text-body)] opacity-60">
                      <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                      {entry.emoji} {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl lg:col-span-2">
                <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-header)]">Average Mood by Day of Week</h3>
                <p className="text-xs text-[var(--color-text-body)] opacity-40 mb-5">Which days do you feel best?</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="day" tick={{ fill: "var(--color-text-body)", fontSize: 11 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-body)", fontSize: 11 }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="avg" fill="var(--color-text-header)" radius={[6, 6, 0, 0]} name="Avg Mood" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Mood Log Table */}
            <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
              <h3 className="mb-5 text-sm font-semibold text-[var(--color-text-header)]">Mood Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[var(--color-text-body)] opacity-40 border-b border-[var(--color-border)]">
                      <th className="pb-3 pr-6 font-medium">Date & Time</th>
                      <th className="pb-3 pr-6 font-medium">Mood</th>
                      <th className="pb-3 pr-6 font-medium">Score</th>
                      <th className="pb-3 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...moodData].reverse().map((entry, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-main)] transition">
                        <td className="py-3 pr-6 text-[var(--color-text-body)] opacity-40 text-xs">
                          {entry.date} · {new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-3 pr-6 text-[var(--color-text-header)] text-sm">
                          {entry.moodEmoji} {entry.moodLabel}
                        </td>
                        <td className="py-3 pr-6">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: `${MOOD_MAP[entry.moodScore]?.color || "#888"}18`,
                              color: MOOD_MAP[entry.moodScore]?.color || "#888",
                            }}
                          >
                            {entry.moodScore}/5
                          </span>
                        </td>
                        <td className="py-3 text-[var(--color-text-body)] opacity-40 text-xs max-w-[200px] truncate">
                          {entry.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
}