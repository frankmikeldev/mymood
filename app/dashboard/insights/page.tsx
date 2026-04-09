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
const font = "'Manrope', sans-serif";

const MOOD_MAP: Record<number, { label: string; color: string; emoji: string }> = {
  1: { label: "Very Sad",   color: "#ef4444", emoji: "😞" },
  2: { label: "Sad",        color: "#f97316", emoji: "😕" },
  3: { label: "Neutral",    color: "#eab308", emoji: "😐" },
  4: { label: "Happy",      color: "#22c55e", emoji: "🙂" },
  5: { label: "Very Happy", color: "#3b82f6", emoji: "😄" },
};

const WHITE_CARD = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2DDD6",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

export default function InsightsPage() {
  const [moodData, setMoodData]               = useState<any[]>([]);
  const [distribution, setDistribution]       = useState<any[]>([]);
  const [weeklyBreakdown, setWeeklyBreakdown] = useState<any[]>([]);
  const [filterDays, setFilterDays]           = useState(7);
  const [summary, setSummary]                 = useState("");
  const [loading, setLoading]                 = useState(true);
  const [downloading, setDownloading]         = useState(false);
  const [stats, setStats] = useState({
    total: 0, average: 0, topMoodNum: 0,
    trend: "neutral" as "up" | "down" | "neutral",
    streak: 0, bestDay: "", worstDay: "",
  });

  useEffect(() => { fetchMoodHistory(); }, [filterDays]);

  async function fetchMoodHistory() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - filterDays);

    const { data, error } = await supabase
      .from("checkins").select("*").eq("user_id", user.id)
      .gte("created_at", sinceDate.toISOString())
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      setLoading(false); setMoodData([]); setDistribution([]);
      setWeeklyBreakdown([]); setSummary(""); return;
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
        moodNum: Number(mood), name: MOOD_MAP[Number(mood)]?.label || mood,
        value, color: MOOD_MAP[Number(mood)]?.color || "#888",
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
        day, avg: parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)),
      }))
    );

    const avg = data.reduce((acc: number, cur: any) => acc + cur.mood, 0) / data.length;
    const topMoodNum = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 3);
    const half = Math.floor(data.length / 2);
    const firstHalfAvg  = data.slice(0, half).reduce((a: number, b: any) => a + b.mood, 0) / (half || 1);
    const secondHalfAvg = data.slice(half).reduce((a: number, b: any) => a + b.mood, 0) / (data.length - half || 1);
    const trend = secondHalfAvg > firstHalfAvg + 0.3 ? "up" : secondHalfAvg < firstHalfAvg - 0.3 ? "down" : "neutral";

    const uniqueDays = [...new Set(data.map((e: any) => new Date(e.created_at).toDateString()))];
    let streak = 0;
    for (let i = 0; i < uniqueDays.length; i++) {
      const d = new Date(uniqueDays[uniqueDays.length - 1 - i]);
      const expected = new Date(); expected.setDate(expected.getDate() - i);
      if (d.toDateString() === expected.toDateString()) streak++; else break;
    }

    const bestEntry  = data.reduce((a: any, b: any) => a.mood > b.mood ? a : b, data[0]);
    const worstEntry = data.reduce((a: any, b: any) => a.mood < b.mood ? a : b, data[0]);

    setStats({
      total: data.length, average: parseFloat(avg.toFixed(1)), topMoodNum, trend, streak,
      bestDay:  bestEntry  ? new Date(bestEntry.created_at).toLocaleDateString("en-US",  { month: "short", day: "numeric" }) : "",
      worstDay: worstEntry ? new Date(worstEntry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    });

    const topMoodInfo = MOOD_MAP[topMoodNum];
    let insight = "";
    if (avg >= 4)      insight = "You're doing well emotionally. Keep up the positive habits!";
    else if (avg >= 3) insight = "Your mood has had some ups and downs. Consider what helped on your better days.";
    else               insight = "This was a challenging period. Be gentle with yourself and consider reaching out for support.";

    setSummary(
      `Over the past ${filterDays} days, you logged ${data.length} mood entries. ` +
      `Your most frequent mood was "${topMoodInfo?.label || ""}" ${topMoodInfo?.emoji || ""}. ` +
      `Your average mood was ${avg.toFixed(1)} out of 5. ` +
      `Your mood trend is ${trend === "up" ? "improving" : trend === "down" ? "declining" : "stable"}. ` +
      `${insight}`
    );

    setLoading(false);
  }

  async function downloadPDF() {
    if (!moodData.length) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/mood-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodData, summary }),
      });
      if (!res.ok) {
        const text = await res.text();
        let errorMessage = text;
        try { const json = JSON.parse(text); errorMessage = json.error || text; } catch {}
        alert("Failed to generate report: " + errorMessage); return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `mymood-insights-${filterDays}d.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const TrendIcon = () => {
    if (stats.trend === "up")   return <TrendingUp   size={14} style={{ color: "#22c55e" }} />;
    if (stats.trend === "down") return <TrendingDown size={14} style={{ color: "#ef4444" }} />;
    return <Minus size={14} style={{ color: "#9ca3af" }} />;
  };

  const topMoodInfo = MOOD_MAP[stats.topMoodNum];

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E2DDD6", borderTopColor: "transparent" }} />
        <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font }}>Loading your insights...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              Insights
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "2px" }}>
              Track your emotional trends and patterns
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDays(d)}
                className="px-4 py-2 rounded-xl border transition text-sm"
                style={{
                  fontFamily: font,
                  fontWeight: filterDays === d ? 700 : 500,
                  backgroundColor: filterDays === d ? "#111111" : "transparent",
                  color: filterDays === d ? "#F5F0E8" : "#6b7280",
                  borderColor: filterDays === d ? "#111111" : "#E2DDD6",
                }}
                onMouseEnter={e => { if (filterDays !== d) e.currentTarget.style.borderColor = "#111111"; }}
                onMouseLeave={e => { if (filterDays !== d) e.currentTarget.style.borderColor = "#E2DDD6"; }}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {moodData.length === 0 ? (
          /* ── Empty state — beige, no data ── */
          <div
            className="text-center py-24 rounded-2xl"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
          >
            <p className="text-4xl mb-4">📭</p>
            <p style={{ fontWeight: 700, fontSize: "16px", color: "#111111", fontFamily: font }}>
              No entries for this period
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font, marginTop: "6px" }}>
              Try selecting a longer time range or log more moods in the Tracker.
            </p>
          </div>
        ) : (
          <>
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: CalendarDays, label: "Entries Logged",  value: stats.total,                                              sub: `Last ${filterDays} days`    },
                { icon: BarChart2,    label: "Avg Mood",         value: `${stats.average}/5`,                                     sub: stats.trend === "up" ? "Improving" : stats.trend === "down" ? "Declining" : "Stable", extra: <TrendIcon /> },
                { icon: Smile,        label: "Top Mood",         value: `${topMoodInfo?.emoji || ""} ${topMoodInfo?.label || "—"}`, sub: "Most frequent"               },
                { icon: TrendingUp,   label: "Current Streak",   value: `${stats.streak} day${stats.streak !== 1 ? "s" : ""}`,   sub: "Consecutive logging"         },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl"
                  style={WHITE_CARD}
                >
                  <div className="flex items-center justify-between mb-3">
                    <card.icon size={16} style={{ color: "#9ca3af" }} />
                    {card.extra}
                  </div>
                  <p style={{ fontWeight: 800, fontSize: "20px", color: "#111111", fontFamily: font }}>
                    {card.value}
                  </p>
                  <p style={{ fontSize: "12px", color: "#444444", fontFamily: font, marginTop: "2px", fontWeight: 500 }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>
                    {card.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Best / Worst Day ── */}
            {stats.bestDay && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-2xl flex items-center gap-3"
                  style={WHITE_CARD}
                >
                  <span className="text-xl">🌟</span>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>Best Day</p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#22c55e", fontFamily: font }}>
                      {stats.bestDay}
                    </p>
                  </div>
                </div>
                <div
                  className="p-4 rounded-2xl flex items-center gap-3"
                  style={WHITE_CARD}
                >
                  <span className="text-xl">💙</span>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>Hardest Day</p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#444444", fontFamily: font }}>
                      {stats.worstDay}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Wellness Insight + PDF ── */}
            <div
              className="p-6 rounded-2xl"
              style={WHITE_CARD}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="flex items-center gap-2"
                  style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}
                >
                  <FileText size={15} style={{ color: "#9ca3af" }} />
                  Wellness Insight
                </h3>
                <button
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border transition text-xs disabled:cursor-not-allowed"
                  style={{ borderColor: "#E2DDD6", color: "#6b7280", fontFamily: font, fontWeight: 500 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#111111"; e.currentTarget.style.color = "#111111"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2DDD6"; e.currentTarget.style.color = "#6b7280"; }}
                >
                  {downloading ? (
                    <><div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> Generating...</>
                  ) : (
                    <><Download size={13} /> Download PDF</>
                  )}
                </button>
              </div>
              <p style={{ fontSize: "15px", fontWeight: 400, color: "#222222", fontFamily: font, lineHeight: 1.75 }}>
                {summary}
              </p>
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="p-6 rounded-2xl" style={WHITE_CARD}>
                <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font, marginBottom: "4px" }}>
                  Mood Trend Over Time
                </h3>
                <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, marginBottom: "20px" }}>
                  Your mood score across this period
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD6" />
                    <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10, fontFamily: font }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280", fontSize: 10, fontFamily: font }} />
                    <Tooltip {...tooltipStyle} formatter={(v: any, n: any, p: any) => [`${p.payload.moodEmoji} ${p.payload.moodLabel}`, "Mood"]} />
                    <Line type="monotone" dataKey="moodScore" stroke="#E8521A" strokeWidth={2.5}
                      dot={{ r: 4, fill: "#E8521A", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-2xl" style={WHITE_CARD}>
                <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font, marginBottom: "4px" }}>
                  Mood Distribution
                </h3>
                <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, marginBottom: "20px" }}>
                  Breakdown of your moods
                </p>
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
                    <div key={entry.name} className="flex items-center gap-1.5"
                      style={{ fontSize: "12px", color: "#444444", fontFamily: font }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                      {entry.emoji} {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl lg:col-span-2" style={WHITE_CARD}>
                <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font, marginBottom: "4px" }}>
                  Average Mood by Day of Week
                </h3>
                <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, marginBottom: "20px" }}>
                  Which days do you feel best?
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD6" />
                    <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: font }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280", fontSize: 11, fontFamily: font }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="avg" fill="#E8521A" radius={[6, 6, 0, 0]} name="Avg Mood" opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* ── Mood Log Table ── */}
            <div className="p-6 rounded-2xl" style={WHITE_CARD}>
              <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font, marginBottom: "20px" }}>
                Mood Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E2DDD6" }}>
                      {["Date & Time", "Mood", "Score", "Note"].map((h) => (
                        <th
                          key={h}
                          className="pb-3 pr-6 text-left"
                          style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", fontFamily: font, textTransform: "uppercase", letterSpacing: "0.05em" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...moodData].reverse().map((entry, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: i < moodData.length - 1 ? "1px solid #E2DDD6" : "none" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F5F0E8")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="py-3 pr-6" style={{ fontSize: "13px", color: "#6b7280", fontFamily: font }}>
                          {entry.date} · {new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-3 pr-6" style={{ fontSize: "14px", fontWeight: 600, color: "#111111", fontFamily: font }}>
                          {entry.moodEmoji} {entry.moodLabel}
                        </td>
                        <td className="py-3 pr-6">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: `${MOOD_MAP[entry.moodScore]?.color || "#888"}20`,
                              color: MOOD_MAP[entry.moodScore]?.color || "#888",
                              fontFamily: font,
                              fontWeight: 600,
                            }}
                          >
                            {entry.moodScore}/5
                          </span>
                        </td>
                        <td className="py-3" style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, maxWidth: "200px" }}>
                          <span className="block truncate">{entry.notes || "—"}</span>
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