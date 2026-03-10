"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Pencil, X, Check } from "lucide-react";

const supabase = createClient();

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

  // Edit state
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

    const { data } = await supabase.from("journal_entries").insert({
      user_id: userId,
      title,
      content,
      mood,
    }).select().single();

    if (data) {
      setEntries((prev) => [data, ...prev]);
    }

    setTitle("");
    setContent("");
    setMood("");
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

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    if (!editContent.trim()) return;

    const { data } = await supabase
      .from("journal_entries")
      .update({ title: editTitle, content: editContent, mood: editMood })
      .eq("id", id)
      .select()
      .single();

    if (data) {
      setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
    }

    setEditingId(null);
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">My Journal</h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            Write your thoughts and track your emotions.
          </p>
        </div>

        {/* Create Entry */}
        <div className="mb-10 bg-[var(--color-box)] border border-[var(--color-border)] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            New Entry
          </h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Journal title (optional)..."
            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg p-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[var(--color-accent)] transition"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write what's on your mind..."
            rows={4}
            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg p-3 text-sm text-white placeholder:text-gray-500 resize-none outline-none focus:border-[var(--color-accent)] transition"
          />

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full bg-[var(--color-box)] border border-[var(--color-border)] rounded-lg p-3 text-sm text-white outline-none focus:border-[var(--color-accent)] transition"
          >
            <option value="">Select mood (optional)</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😔 Sad</option>
            <option value="anxious">😟 Anxious</option>
            <option value="calm">😌 Calm</option>
            <option value="stressed">😣 Stressed</option>
          </select>

          <button
            onClick={createEntry}
            disabled={!content.trim()}
            className="px-5 py-2 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition disabled:opacity-40"
          >
            Save Entry
          </button>
        </div>

        {/* Entries */}
        <div className="space-y-6">
          {entries.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-10">
              No journal entries yet. Write your first one above ✍️
            </p>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-xl p-5"
            >
              {editingId === entry.id ? (
                /* ── Edit Mode ── */
                <div className="space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title..."
                    className="w-full bg-transparent border border-[var(--color-border)] rounded-lg p-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[var(--color-accent)] transition"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border border-[var(--color-border)] rounded-lg p-3 text-sm text-white resize-none outline-none focus:border-[var(--color-accent)] transition"
                  />
                  <select
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                    className="w-full bg-[var(--color-box)] border border-[var(--color-border)] rounded-lg p-3 text-sm text-white outline-none"
                  >
                    <option value="">No mood</option>
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😔 Sad</option>
                    <option value="anxious">😟 Anxious</option>
                    <option value="calm">😌 Calm</option>
                    <option value="stressed">😣 Stressed</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm hover:opacity-90 transition"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] text-gray-400 text-sm hover:text-white transition"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View Mode ── */
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {entry.title || "Untitled Entry"}
                      </h3>
                      {entry.mood && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                          {MOOD_LABELS[entry.mood] || entry.mood}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(entry)}
                        className="text-gray-400 hover:text-[var(--color-accent)] transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mt-4 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  <p className="text-xs text-gray-500 mt-4">
                    🕐 {timeAgo(entry.created_at)} &nbsp;·&nbsp;{" "}
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric",
                    })} at {new Date(entry.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}