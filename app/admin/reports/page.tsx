"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Download, FileText } from "lucide-react";

const supabase = createClient();

export default function AdminReports() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    const [
      { count: users },
      { count: checkins },
      { count: posts },
      { count: journals },
    ] = await Promise.all([
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase.from("checkins").select("*", { count: "exact", head: true }),
      supabase.from("community_posts").select("*", { count: "exact", head: true }),
      supabase.from("journal_entries").select("*", { count: "exact", head: true }),
    ]);
    setStats({ users, checkins, posts, journals });
    setLoading(false);
  }

  function downloadCSV() {
    if (!stats) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Users", stats.users],
      ["Total Mood Logs", stats.checkins],
      ["Community Posts", stats.posts],
      ["Journal Entries", stats.journals],
      ["Report Date", new Date().toLocaleDateString()],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mymood-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 mt-1 text-sm">Export site data and usage statistics.</p>
        </div>
        <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.users },
            { label: "Mood Logs", value: stats.checkins },
            { label: "Community Posts", value: stats.posts },
            { label: "Journal Entries", value: stats.journals },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <p className="text-2xl font-bold text-white">{(s.value || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Available exports</h2>
        <div className="space-y-3">
          {[
            { name: "User summary report", desc: "Total users, join dates, activity levels" },
            { name: "Mood analytics report", desc: "Aggregated mood trends, distribution, streaks" },
            { name: "Community report", desc: "Post counts, engagement, flagged content summary" },
            { name: "Full data export", desc: "All anonymized app data in CSV format" },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-violet-500/30 transition">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-violet-400" />
                <div>
                  <p className="text-sm text-white font-medium">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </div>
              </div>
              <button onClick={downloadCSV} className="p-2 rounded-lg hover:bg-violet-500/10 text-violet-400 transition">
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}