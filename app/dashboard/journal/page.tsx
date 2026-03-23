"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Pencil, X, Check, BookOpen } from "lucide-react";
import DOMPurify from "dompurify";

const supabase = createClient();

const MOODS = [
  { value: "happy", label: "😊 Happy" },
  { value: "sad", label: "😔 Sad" },
  { value: "anxious", label: "😟 Anxious" },
  { value: "calm", label: "😌 Calm" },
  { value: "stressed", label: "😣 Stressed" },
];

const MOOD_LABELS: Record<string, string> = {
  happy: "😊 Happy",
  sad: "😔 Sad",
  anxious: "😟 Anxious",
  calm: "😌 Calm",
  stressed: "😣 Stressed",
};

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchEntries(user.id);
      }
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

    // ✅ Sanitize before saving — strips all HTML tags
    const cleanTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [] });
    const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });

    const { data } = await supabase
      .from("journal_entries")
      .insert({ user_id: userId, title: cleanTitle, content: cleanContent, mood })
      .select()
      .single();

    if (data) setEntries((prev) => [data, ...prev]);
    setTitle("");
    setContent("");
    setMood("");
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

    // ✅ Sanitize on edit too
    const cleanTitle = DOMPurify.sanitize(editTitle, { ALLOWED_TAGS: [] });
    const cleanContent = DOMPurify.sanitize(editContent, { ALLOWED_TAGS: [] });

    const { data } = await supabase
      .from("journal_entries")
      .update({ title: cleanTitle, content: cleanContent, mood: editMood })
      .eq("id", id)
      .select()
      .single();

    if (data) setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
    setEditingId(null);
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  const inputClass = "w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-40 outline-none focus:border-[var(--color-text-header)] transition";

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">My Journal</h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Write your thoughts and track your emotions.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center">
            <BookOpen size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        {/* Create Entry */}
        <div className="mb-10 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-50 uppercase tracking-widest">
            New Entry
          </h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className={inputClass}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write what's on your mind..."
            rows={5}
            className={`${inputClass} resize-none`}
          />

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={`${inputClass} sm:w-auto`}
            >
              <option value="">Mood (optional)</option>
              {MOODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            <button
              onClick={createEntry}
              disabled={!content.trim() || saving}
              className="sm:ml-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {entries.length === 0 && (
            <div className="text-center py-20 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
              <p className="text-3xl mb-3">✍️</p>
              <p className="text-[var(--color-text-header)] font-medium">No entries yet</p>
              <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
                Write your first journal entry above
              </p>
            </div>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-text-header)] hover:border-opacity-20 transition"
            >
              {editingId === entry.id ? (

                /* Edit Mode */
                <div className="space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title..."
                    className={inputClass}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                  <select
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">No mood</option>
                    {MOODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition"
                    >
                      <Check size={13} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] text-sm hover:text-[var(--color-text-header)] transition"
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </div>

              ) : (

                /* View Mode */
                <>
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-[var(--color-text-header)] truncate">
                        {entry.title || "Untitled Entry"}
                      </h3>
                      {entry.mood && (
                        <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)] text-[var(--color-text-body)]">
                          {MOOD_LABELS[entry.mood] || entry.mood}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-2 rounded-lg text-[var(--color-text-body)] opacity-40 hover:opacity-100 hover:bg-[var(--color-bg-main)] transition"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 rounded-lg text-[var(--color-text-body)] opacity-40 hover:text-red-500 hover:opacity-100 hover:bg-[var(--color-bg-main)] transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-text-body)] opacity-80 mt-4 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">
                      {timeAgo(entry.created_at)}
                    </p>
                    <span className="text-[var(--color-text-body)] opacity-20 text-xs">·</span>
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric",
                      })} at {new Date(entry.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}