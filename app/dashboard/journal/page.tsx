"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Pencil, X, Check, BookOpen } from "lucide-react";
import DOMPurify from "dompurify";

const supabase = createClient();
const font = "'Manrope', sans-serif";

const MOODS = [
  { value: "happy",    label: "😊 Happy"   },
  { value: "sad",      label: "😔 Sad"     },
  { value: "anxious",  label: "😟 Anxious" },
  { value: "calm",     label: "😌 Calm"    },
  { value: "stressed", label: "😣 Stressed"},
];

const MOOD_LABELS: Record<string, string> = {
  happy:    "😊 Happy",
  sad:      "😔 Sad",
  anxious:  "😟 Anxious",
  calm:     "😌 Calm",
  stressed: "😣 Stressed",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#F5F0E8",
  border: "1px solid #E2DDD6",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "15px",
  fontFamily: font,
  fontWeight: 400,
  color: "#111111",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function JournalPage() {
  const [entries, setEntries]         = useState<any[]>([]);
  const [title, setTitle]             = useState("");
  const [content, setContent]         = useState("");
  const [mood, setMood]               = useState("");
  const [userId, setUserId]           = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editTitle, setEditTitle]     = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood]       = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); fetchEntries(user.id); }
    });
    const channel = supabase
      .channel("journal-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "journal_entries" }, () => {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) fetchEntries(user.id);
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchEntries(uid: string) {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) setEntries(data);
  }

  async function createEntry() {
    if (!content.trim() || !userId) return;
    setSaving(true);
    const cleanTitle   = DOMPurify.sanitize(title,   { ALLOWED_TAGS: [] });
    const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    const { data } = await supabase
      .from("journal_entries")
      .insert({ user_id: userId, title: cleanTitle, content: cleanContent, mood })
      .select().single();
    if (data) setEntries((prev) => [data, ...prev]);
    setTitle(""); setContent(""); setMood("");
    setSaving(false);
  }

  async function deleteEntry(id: string) {
    await supabase.from("journal_entries").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function startEdit(entry: any) {
    setEditingId(entry.id);
    setEditTitle(entry.title || "");
    setEditContent(entry.content);
    setEditMood(entry.mood || "");
  }

  function cancelEdit() { setEditingId(null); }

  async function saveEdit(id: string) {
    if (!editContent.trim()) return;
    const cleanTitle   = DOMPurify.sanitize(editTitle,   { ALLOWED_TAGS: [] });
    const cleanContent = DOMPurify.sanitize(editContent, { ALLOWED_TAGS: [] });
    const { data } = await supabase
      .from("journal_entries")
      .update({ title: cleanTitle, content: cleanContent, mood: editMood })
      .eq("id", id).select().single();
    if (data) setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
    setEditingId(null);
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8 pb-5" style={{ borderBottom: "1px solid #E2DDD6" }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              My Journal
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "2px" }}>
              Write your thoughts and track your emotions.
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
          >
            <BookOpen size={18} style={{ color: "#111111" }} />
          </div>
        </div>

        {/* ── New Entry Box — X/Twitter composer style ── */}
        <div
          className="mb-6 rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
        >
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            New Entry
          </p>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            style={{ ...inputStyle }}
            onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            style={{ ...inputStyle, resize: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
          />

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              style={{ ...inputStyle, width: "auto", fontSize: "13px", padding: "8px 12px" }}
            >
              <option value="">Mood (optional)</option>
              {MOODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            <button
              onClick={createEntry}
              disabled={!content.trim() || saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                backgroundColor: "#E8521A",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: font,
                boxShadow: "0 2px 12px rgba(232,82,26,0.3)",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <><Check size={14} /> Post Entry</>
              )}
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderBottom: "1px solid #E2DDD6", marginBottom: "0" }} />

        {/* ── Entries — X/Twitter feed style ── */}
        <div>
          {entries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-3xl mb-3">✍️</p>
              <p style={{ fontWeight: 700, color: "#111111", fontFamily: font, fontSize: "16px" }}>
                No entries yet
              </p>
              <p style={{ color: "#6b7280", fontFamily: font, fontSize: "14px", marginTop: "4px" }}>
                Write your first entry above
              </p>
            </div>
          )}

          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="py-5 px-1 transition-colors"
              style={{
                borderBottom: idx < entries.length - 1 ? "1px solid #E2DDD6" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE8DF")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {editingId === entry.id ? (

                /* ── Edit Mode ── */
                <div
                  className="rounded-2xl p-5 space-y-3"
                  style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
                >
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title..."
                    style={{ ...inputStyle }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
                  />
                  <select
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                    style={{ ...inputStyle }}
                  >
                    <option value="">No mood</option>
                    {MOODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full transition"
                      style={{ backgroundColor: "#111111", color: "#F5F0E8", fontSize: "13px", fontWeight: 700, fontFamily: font }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#333")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#111111")}
                    >
                      <Check size={13} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition"
                      style={{ borderColor: "#E2DDD6", color: "#444444", fontSize: "13px", fontFamily: font }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F5F0E8")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </div>

              ) : (

                /* ── View Mode — feed row ── */
                <div className="flex gap-4">

                  {/* Avatar dot — like X profile pic */}
                  <div
                    className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm mt-0.5"
                    style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontFamily: font }}
                  >
                    ✍️
                  </div>

                  <div className="flex-1 min-w-0">

                    {/* Top row: title + timestamp + actions */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}>
                          {entry.title || "Untitled Entry"}
                        </span>
                        {entry.mood && (
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{ fontSize: "12px", fontFamily: font, fontWeight: 500, color: "#6b7280", backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}
                          >
                            {MOOD_LABELS[entry.mood] || entry.mood}
                          </span>
                        )}
                        <span style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font }}>
                          · {timeAgo(entry.created_at)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-1.5 rounded-lg transition"
                          style={{ color: "#9ca3af" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#111111")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 rounded-lg transition"
                          style={{ color: "#9ca3af" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Entry content */}
                    <p
                      className="whitespace-pre-wrap"
                      style={{ fontSize: "15px", fontWeight: 400, color: "#222222", fontFamily: font, lineHeight: 1.7 }}
                    >
                      {entry.content}
                    </p>

                    {/* Full date below */}
                    <p
                      className="mt-2"
                      style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}
                    >
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric",
                      })} at {new Date(entry.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}