"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Activity, MessageSquare, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const supabase = createClient();

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, checklins: 0, posts: 0, flagged: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [moodTrend, setMoodTrend] = useState<any[]>([]);
  const [moodDist, setMoodDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [
      { count: userCount },
      { count: checkinCount },
      { count: postCount },
      { data: users },
      { data: checkins },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("checkins").select("*", { count: "exact", head: true }),
      supabase.from("community_posts").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("id, email, created_at, full_name").order("created_at", { ascending: false }).limit(5),
      supabase.from("checkins").select("mood, created_at").order("created_at", { ascending: true }).limit(200),
    ]);

    setStats({
      users: userCount || 0,
      checklins: checkinCount || 0,
      posts: postCount || 0,
      flagged: 3,
    });

    setRecentUsers(users || []);

    // Mood trend — group by day
    if (checkins) {
      const dayMap: Record<string, number[]> = {};
      checkins.forEach((c: any) => {
        const day = new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!dayMap[day]) dayMap[day] = [];
        dayMap[day].push(c.mood);
      });
      setMoodTrend(Object.entries(dayMap).slice(-14).map(([date, moods]) => ({
        date,
        avg: parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)),
      })));

      // Distribution
      const counts: Record<number, number> = {};
      checkins.forEach((c: any) => { counts[c.mood] = (counts[c.mood] || 0) + 1; });
      const LABELS: Record<number, string> = { 1: "Very Sad", 2: "Sad", 3: "Neutral", 4: "Happy", 5: "Very Happy" };
      setMoodDist(Object.entries(counts).map(([mood, count]) => ({
        label: LABELS[Number(mood)],
        count,
        pct: Math.round((count / checkins.length) * 100),
      })).sort((a, b) => b.count - a.count));
    }

    setLoading(false);
  }

  const STAT_CARDS = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Mood Logs", value: stats.checklins, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Community Posts", value: stats.posts, icon: MessageSquare, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Flagged Content", value: stats.flagged, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl">

      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Site-wide overview and activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Mood trend chart */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Site-wide mood trend (last 14 days)</h2>
          {moodTrend.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={moodTrend}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f0f18", border: "1px solid #ffffff10", borderRadius: 8 }} />
                <Area type="monotone" dataKey="avg" stroke="#7c3aed" strokeWidth={2} fill="url(#ag)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Mood distribution */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Mood distribution (all time)</h2>
          <div className="space-y-3">
            {moodDist.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">No data yet</p>
            ) : moodDist.map((m) => (
              <div key={m.label} className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 w-20 shrink-0 text-xs">{m.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-2 bg-violet-500 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="text-gray-400 text-xs w-12 text-right">{m.count}x · {m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent users */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Recent signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-white/5">
                <th className="pb-3 pr-6">User</th>
                <th className="pb-3 pr-6">Email</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                        {(u.full_name || u.email || "U")[0].toUpperCase()}
                      </div>
                      <span className="text-white text-xs">{u.full_name || "—"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-gray-400 text-xs">{u.email || "—"}</td>
                  <td className="py-3 text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}