"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Shield } from "lucide-react";

const supabase = createClient();

export default function AdminSettings() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("moderator");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchAdmins(); }, []);

  async function fetchAdmins() {
    const { data } = await supabase
      .from("admin_users")
      .select("id, role, created_at");
    setAdmins(data || []);
    setLoading(false);
  }

  async function addAdmin() {
    if (!newEmail) return;
    setSaving(true);
    const { data: user } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", newEmail)
      .single();

    if (!user) { setMsg("User not found. They must have an account first."); setSaving(false); return; }

    await supabase.from("admin_users").insert({ id: user.id, role: newRole });
    setNewEmail("");
    setMsg("Admin added successfully.");
    await fetchAdmins();
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function removeAdmin(id: string) {
    await supabase.from("admin_users").delete().eq("id", id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage admin accounts and roles.</p>
      </div>

      {/* Add admin */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Shield size={15} className="text-violet-400" /> Add admin user
        </h2>
        <div className="flex gap-3 flex-wrap">
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="User email address"
            className="flex-1 min-w-48 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500"
          >
            <option value="moderator">Moderator</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button
            onClick={addAdmin}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {msg && <p className={`text-xs ${msg.includes("not found") ? "text-red-400" : "text-green-400"}`}>{msg}</p>}
      </div>

      {/* Admins list */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Admin accounts</h2>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
          ) : admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">A</div>
                <div>
                  <p className="text-sm text-white font-medium">{admin.id.slice(0, 12)}...</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${admin.role === "super_admin" ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-400"}`}>
                    {admin.role.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {new Date(admin.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <button onClick={() => removeAdmin(admin.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}