"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, TrendingDown, Minus, Brain, Calendar, Flame, Heart, Moon } from "lucide-react";

const supabase = createClient();

const MOOD_MAP: Record<number, { label: string; color: string; emoji: string }> = {
  1: { label: "Very Sad", color: "#ef4444", emoji: "😞" },
  2: { label: "Sad", color: "#f97316", emoji: "😕" },
  3: { label: "Neutral", color: "#eab308", emoji: "😐" },
  4: { label: "Happy", color: "#22c55e", emoji: "🙂" },
  5: { label: "Very Happy", color: "#3b82f6", emoji: "😄" },
};

const INSIGHTS: Record<number, string> = {
  1: "You've been feeling very sad frequently. Small actions matter — a short walk, one text to a friend, or five minutes of sunlight can begin to shift things. Be gentle with yourself.",
  2: "Sadness has been a recurring theme. Consider journaling about what's been weighing on you, or try the Wellness Library for support strategies around sadness.",
  3: "Your mood has been mostly neutral. This can sometimes signal emotional flatness or mild burnout. Check in with yourself — is there something you've been avoiding feeling?",
  4: "You've been feeling happy fairly consistently. Keep noting what's contributing to these better days — sleep, movement, connection — so you can protect those habits.",
  5: "Your mood has been very positive lately. This is a great time to build new habits, tackle challenges, and invest in relationships while your emotional reserves are full.",
};

export default function InsightsPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);

  const [stats, setStats] = useState({
    total: 0,
    avgMood: 0,
    topMoodNum: 0,
    streak: 0,
    trend: "neutral" as "up" | "down" | "neutral",
    bestDay: "",
    worstDay: "",
    bestHour: "",
  });

  useEffect(() => {
    fetchData();
  }, [filterDays]);

  async function fetchData() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const since = new Date();
    since.setDate(since.getDate() - filterDays);

    const { data } = await supabase
      .from("checkins")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (!data || data.length === 0) { setLoading(false); return; }

    setCheckins(data);

    // Mood distribution
    const counts: Record<number, number> = {};
    data.forEach((e: any) => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    setDistribution(
      Object.entries(counts).map(([mood, value]) => ({
        mood: Number(mood),
        name: MOOD_MAP[Number(mood)]?.label || mood,
        value,
        color: MOOD_MAP[Number(mood)]?.color || "#6366f1",
        emoji: MOOD_MAP[Number(mood)]?.emoji || "",
      }))
    );

    // Weekly avg by day of week
    const dayMap: Record<string, number[]> = {};
    data.forEach((e: any) => {
      const day = new Date(e.created_at).toLocaleDateString("en-US", { weekday: "short" });
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(e.mood);
    });
    setWeeklyData(
      Object.entries(dayMap).map(([day, moods]) => ({
        day,
        avg: parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)),
      }))
    );

    // Hourly pattern
    const hourMap: Record<number, number[]> = {};
    data.forEach((e: any) => {
      const hour = new Date(e.created_at).getHours();
      if (!hourMap[hour]) hourMap[hour] = [];
      hourMap[hour].push(e.mood);
    });
    const hourly = Object.entries(hourMap)
      .map(([hour, moods]) => ({
        hour: `${hour}:00`,
        hourNum: Number(hour),
        avg: parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)),
      }))
      .sort((a, b) => a.hourNum - b.hourNum);
    setHourlyData(hourly);

    // Stats
    const avg = data.reduce((a: number, b: any) => a + b.mood, 0) / data.length;
    const topMoodNum = Number(
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 3
    );

    // Trend
    const half = Math.floor(data.length / 2);
    const firstAvg = data.slice(0, half).reduce((a: number, b: any) => a + b.mood, 0) / (half || 1);
    const secondAvg = data.slice(half).reduce((a: number, b: any) => a + b.mood, 0) / ((data.length - half) || 1);
    const trend = secondAvg > firstAvg + 0.3 ? "up" : secondAvg < firstAvg - 0.3 ? "down" : "neutral";

    // Streak
    const uniqueDays = [...new Set(data.map((e: any) => new Date(e.created_at).toDateString()))];
    let streak = 0;
    for (let i = 0; i < uniqueDays.length; i++) {
      const d = new Date(uniqueDays[uniqueDays.length - 1 - i]);
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (d.toDateString() === expected.toDateString()) streak++;
      else break;
    }

    // Best / worst
    const best = data.reduce((a: any, b: any) => a.mood > b.mood ? a : b, data[0]);
    const worst = data.reduce((a: any, b: any) => a.mood < b.mood ? a : b, data[0]);
    const bestHourEntry = hourly.sort((a, b) => b.avg - a.avg)[0];

    setStats({
      total: data.length,
      avgMood: parseFloat(avg.toFixed(1)),
      topMoodNum,
      streak,
      trend,
      bestDay: best ? new Date(best.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      worstDay: worst ? new Date(worst.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      bestHour: bestHourEntry?.hour || "",
    });

    setLoading(false);
  }

  const timeline = checkins.map((m: any) => ({
    date: new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: m.mood,
    label: MOOD_MAP[m.mood]?.label || "",
    emoji: MOOD_MAP[m.mood]?.emoji || "",
  }));

  const topMoodInfo = MOOD_MAP[stats.topMoodNum];
  const insight = INSIGHTS[stats.topMoodNum] || "Keep logging your moods to unlock personalized insights.";

  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-box)",
      border: "1px solid var(--color-border)",
      borderRadius: 8,
      color: "var(--color-text-primary)",
    },
  };

  const TrendIcon = () => {
    if (stats.trend === "up") return <TrendingUp size={16} className="text-green-400" />;
    if (stats.trend === "down") return <TrendingDown size={16} className="text-red-400" />;
    return <Minus size={16} className="text-yellow-400" />;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--color-text-muted)]">Analyzing your mood data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Mood Insights</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Understand your emotional patterns over time.</p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDays(d)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  filterDays === d
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {checkins.length === 0 ? (
          <div className="text-center py-24 bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">No mood data yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              Start logging your moods from the Tracker page to see insights here.
            </p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: "Entries", value: stats.total, sub: `Last ${filterDays} days`, color: "text-blue-400" },
                { icon: Heart, label: "Avg Mood", value: `${stats.avgMood}/5`, sub: stats.trend, color: stats.avgMood >= 4 ? "text-green-400" : stats.avgMood >= 3 ? "text-yellow-400" : "text-red-400", extra: <TrendIcon /> },
                { icon: Brain, label: "Top Mood", value: `${topMoodInfo?.emoji} ${topMoodInfo?.label || "—"}`, sub: "most frequent", color: "text-purple-400" },
                { icon: Flame, label: "Streak", value: `${stats.streak}d 🔥`, sub: "consecutive days", color: "text-orange-400" },
              ].map((card, i) => (
                <div key={i} className="p-4 bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <card.icon size={16} className={card.color} />
                    {card.extra}
                  </div>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{card.label}</p>
                  <p className="text-xs text-gray-500">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Best / Worst / Best Hour */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <p className="text-xs text-gray-400">Best Day</p>
                  <p className="text-sm font-semibold text-green-400">{stats.bestDay || "—"}</p>
                </div>
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">💙</span>
                <div>
                  <p className="text-xs text-gray-400">Hardest Day</p>
                  <p className="text-sm font-semibold text-red-400">{stats.worstDay || "—"}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-3">
                <Moon size={20} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Best Mood Hour</p>
                  <p className="text-sm font-semibold text-blue-400">{stats.bestHour || "—"}</p>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-6 bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={18} className="text-[var(--color-accent)]" />
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Personalized Insight</h2>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{insight}</p>
              {topMoodInfo && (
                <div
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    background: `${topMoodInfo.color}15`,
                    borderColor: `${topMoodInfo.color}40`,
                    color: topMoodInfo.color,
                  }}
                >
                  {topMoodInfo.emoji} Dominant mood: {topMoodInfo.label}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">Mood Timeline</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(v: any, n: any, p: any) => [`${p.payload.emoji} ${p.payload.label}`, "Mood"]}
                  />
                  <Area type="monotone" dataKey="mood" stroke="var(--color-accent)" strokeWidth={3} fill="url(#areaGrad)" dot={{ r: 4, fill: "var(--color-accent)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution */}
            <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">Mood Distribution</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
                      {distribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="space-y-2.5 text-sm w-full sm:w-auto shrink-0">
                  {distribution.sort((a, b) => b.value - a.value).map((d) => (
                    <li key={d.mood} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-[var(--color-text-primary)] flex-1">{d.emoji} {d.name}</span>
                      <span className="text-[var(--color-text-muted)] text-xs">{d.value}x</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Avg by Day */}
            <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">Average Mood by Day of Week</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="avg" fill="var(--color-accent)" radius={[6, 6, 0, 0]} name="Avg Mood" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly */}
            {hourlyData.length > 0 && (
              <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Mood by Time of Day</h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-5">When do you feel best during the day?</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="hour" tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="avg" stroke="#8b5cf6" strokeWidth={2} fill="url(#hourGrad)" dot={{ r: 3, fill: "#8b5cf6" }} name="Avg Mood" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Log Table */}
            <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">Recent Mood Log</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-[var(--color-border)]">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Mood</th>
                      <th className="pb-3 pr-4">Score</th>
                      <th className="pb-3">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...checkins].reverse().slice(0, 15).map((m, i) => {
                      const info = MOOD_MAP[m.mood];
                      return (
                        <tr key={i} className="border-b border-[var(--color-border)]/40 last:border-0">
                          <td className="py-2.5 pr-4 text-gray-400 text-xs">
                            {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-2.5 pr-4 text-white">
                            {info?.emoji} {info?.label}
                          </td>
                          <td className="py-2.5 pr-4">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ background: `${info?.color}22`, color: info?.color }}
                            >
                              {m.mood}/5
                            </span>
                          </td>
                          <td className="py-2.5 text-gray-400 text-xs truncate max-w-[180px]">
                            {m.notes || "—"}
                          </td>
                        </tr>
                      );
                    })}
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