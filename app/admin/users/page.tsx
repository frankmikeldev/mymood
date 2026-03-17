"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Search, Users } from "lucide-react";

const supabase = createClient();

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  async function fetchUsers() {
    setLoading(true);

    // ✅ Now also fetching email from user_profiles
    const { data: profiles, error } = await supabase
      .from("user_profiles")
      .select("id, name, email, notifications, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error.message);
      setLoading(false);
      return;
    }

    const withDetails = await Promise.all(
      (profiles || []).map(async (u: any) => {

        const { count } = await supabase
          .from("checkins")
          .select("*", { count: "exact", head: true })
          .eq("user_id", u.id);

        const { data: lastCheckin } = await supabase
          .from("checkins")
          .select("created_at")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        let status = "inactive";
        if (lastCheckin?.created_at) {
          const daysSince = (Date.now() - new Date(lastCheckin.created_at).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince <= 7) status = "active";
          else if (daysSince <= 30) status = "idle";
          else status = "inactive";
        }

        return {
          ...u,
          checkin_count: count || 0,
          status,
        };
      })
    );

    setUsers(withDetails);
    setFiltered(withDetails);
    setLoading(false);
  }

  const STATUS_STYLES: Record<string, string> = {
    active: "bg-green-500/10 text-green-400",
    idle: "bg-amber-500/10 text-amber-400",
    inactive: "bg-white/5 text-gray-500",
  };

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {users.length} total registered users
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center">
          <Users size={18} className="text-violet-400" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Active (last 7 days)",
            value: users.filter((u) => u.status === "active").length,
            color: "text-green-400",
          },
          {
            label: "Idle (last 30 days)",
            value: users.filter((u) => u.status === "idle").length,
            color: "text-amber-400",
          },
          {
            label: "Inactive",
            value: users.filter((u) => u.status === "inactive").length,
            color: "text-gray-400",
          },
        ].map((s) => (
          <div key={s.label} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0f0f18] border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-white/5">
                <th className="px-6 py-4 font-medium">Full Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Mood Logs</th>
                <th className="px-6 py-4 font-medium">Account Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition"
                  >
                    {/* Full name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {/* ✅ fallback to email initial if no name */}
                          {(u.name || u.email || "U")[0].toUpperCase()}
                        </div>
                        <p className="text-white font-medium text-xs">
                          {/* ✅ show "No name set" in grey if null */}
                          {u.name || (
                            <span className="text-gray-500 italic">No name set</span>
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {/* ✅ show actual email or dash */}
                      {u.email || "—"}
                    </td>

                    {/* Mood logs */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-medium">
                        {u.checkin_count} logs
                      </span>
                    </td>

                    {/* Account status */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_STYLES[u.status]}`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}