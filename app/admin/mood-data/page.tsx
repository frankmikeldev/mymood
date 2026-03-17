"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const supabase = createClient();

const MOOD_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Very Sad", color: "#ef4444" },
  2: { label: "Sad", color: "#f97316" },
  3: { label: "Neutral", color: "#eab308" },
  4: { label: "Happy", color: "#22c55e" },
  5: { label: "Very Happy", color: "#3b82f6" },
};

export default function AdminMoodData() {
  const [daily, setDaily] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data, count } = await supabase
      .from("checkins")
      .select("mood, created_at", { count: "exact" })
      .order("created_at", { ascending: true });

    if (!data) { setLoading(false); return; }

    setTotalLogs(count || 0);
    setAvgMood(parseFloat((data.reduce((a, b) => a + b.mood, 0) / data.length).toFixed(1)));

    // Daily logs count
    const dayCount: Record<string, number> = {};
    data.forEach((c: any) => {
      const day = new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    setDaily(Object.entries(dayCount).slice(-14).map(([date, count]) => ({ date, count })));

    // Mood distribution
    const moodCount: Record<number, number> = {};
    data.forEach((c: any) => { moodCount[c.mood] = (moodCount[c.mood] || 0) + 1; });
    setDistribution(Object.entries(moodCount).map(([mood, count]) => ({
      label: MOOD_MAP[Number(mood)]?.label,
      count,
      color: MOOD_MAP[Number(mood)]?.color,
      pct: Math.round((count / data.length) * 100),
    })));

    // By day of week
    const weekMap: Record<string, number[]> = {};
    data.forEach((c: any) => {
      const day = new Date(c.created_at).toLocaleDateString("en-US", { weekday: "short" });
      if (!weekMap[day]) weekMap[day] = [];
      weekMap[day].push(c.mood);
    });
    setWeekly(Object.entries(weekMap).map(([day, moods]) => ({
      day,
      avg: parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)),
    })));

    setLoading(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Mood Data</h1>
        <p className="text-gray-400 mt-1 text-sm">Aggregated mood analytics across all users.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total mood logs", value: totalLogs.toLocaleString() },
          { label: "Average mood (1-5)", value: `${avgMood}/5` },
          { label: "Unique moods tracked", value: distribution.length },
        ].map((s) => (
          <div key={s.label} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daily logs chart */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Daily logs (last 14 days)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0f0f18", border: "1px solid #ffffff10", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Logs" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Distribution */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Mood distribution (all users)</h2>
          <div className="space-y-3">
            {distribution.sort((a, b) => b.count - a.count).map((m) => (
              <div key={m.label} className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 w-20 shrink-0 text-xs">{m.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
                <span className="text-gray-400 text-xs w-16 text-right">{m.count} · {m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* By day of week */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Avg mood by day of week</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0f0f18", border: "1px solid #ffffff10", borderRadius: 8 }} />
              <Bar dataKey="avg" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Avg Mood" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}