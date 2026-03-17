"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2 } from "lucide-react";

const supabase = createClient();

const MOOD_CATEGORIES = ["Anxiety","Depression","Stress","Loneliness","Anger","Grief","Burnout","Low Self-Esteem","Overwhelm"];

export default function AdminTips() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mood: "", title: "", content: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTips(); }, []);

  async function fetchTips() {
    const { data } = await supabase.from("wellness_tips").select("*").order("created_at", { ascending: false });
    setTips(data || []);
    setLoading(false);
  }

  async function saveTip() {
    if (!form.mood || !form.title || !form.content) return;
    setSaving(true);
    await supabase.from("wellness_tips").insert(form);
    setForm({ mood: "", title: "", content: "" });
    setShowForm(false);
    await fetchTips();
    setSaving(false);
  }

  async function deleteTip(id: string) {
    await supabase.from("wellness_tips").delete().eq("id", id);
    setTips((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wellness Tips</h1>
          <p className="text-gray-400 mt-1 text-sm">{tips.length} tips in database</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition">
          <Plus size={15} /> Add tip
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0f0f18] border border-violet-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">New wellness tip</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500">
              <option value="">Select mood category</option>
              {MOOD_CATEGORIES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tip title" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500" />
          </div>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write the tip content..." rows={4} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500 resize-none" />
          <div className="flex gap-3">
            <button onClick={saveTip} disabled={saving} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50">
              {saving ? "Saving..." : "Save tip"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : tips.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No tips yet. Add your first one.</div>
        ) : tips.map((tip) => (
          <div key={tip.id} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm">{tip.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 text-xs">{tip.mood}</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{tip.content}</p>
            </div>
            <button onClick={() => deleteTip(tip.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}