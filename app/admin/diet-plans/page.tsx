"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

const supabase = createClient();

const MOODS = ["anxiety","depression","stress","sad","anger","burnout","loneliness","overwhelm","grief","low_self_esteem","low_energy","sleep","menstruation","pms"];

export default function AdminDietPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", mood: "", foods: "", tips: "", image_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  async function fetchPlans() {
    const { data } = await supabase.from("diet_plans").select("*").order("created_at", { ascending: false });
    setPlans(data || []);
    setLoading(false);
  }

  async function saveplan() {
    if (!form.title || !form.mood || !form.description) return;
    setSaving(true);
    const foods = form.foods.split(",").map((f) => f.trim()).filter(Boolean);
    await supabase.from("diet_plans").insert({ ...form, foods });
    setForm({ title: "", description: "", mood: "", foods: "", tips: "", image_url: "" });
    setShowForm(false);
    await fetchPlans();
    setSaving(false);
  }

  async function deletePlan(id: string) {
    await supabase.from("diet_plans").delete().eq("id", id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Diet Plans</h1>
          <p className="text-gray-400 mt-1 text-sm">{plans.length} plans in database</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition"
        >
          <Plus size={15} />
          Add plan
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-[#0f0f18] border border-violet-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">New diet plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500" />
            <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500">
              <option value="">Select mood</option>
              {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500 resize-none" />
          <input value={form.foods} onChange={(e) => setForm({ ...form, foods: e.target.value })} placeholder="Foods (comma separated: Salmon, Spinach, Blueberries)" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500" />
          <input value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} placeholder="Tip" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500" />
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL (Unsplash link)" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500" />
          <div className="flex gap-3">
            <button onClick={saveplan} disabled={saving} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50">
              {saving ? "Saving..." : "Save plan"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Plans list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : plans.map((plan) => {
          const foods = Array.isArray(plan.foods) ? plan.foods : JSON.parse(plan.foods || "[]");
          return (
            <div key={plan.id} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
              {plan.image_url && (
                <img src={plan.image_url} alt={plan.title} className="w-16 h-16 rounded-xl object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm">{plan.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 text-xs">{plan.mood}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-2">{plan.description}</p>
                <p className="text-gray-500 text-xs">{foods.slice(0, 4).join(", ")}{foods.length > 4 ? ` +${foods.length - 4} more` : ""}</p>
              </div>
              <button onClick={() => deletePlan(plan.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}