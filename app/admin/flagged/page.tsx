"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AlertTriangle, CheckCircle, Trash2, Flag } from "lucide-react";

const supabase = createClient();

export default function AdminFlaggedPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => { fetchFlags(); }, []);

  async function fetchFlags() {
    setLoading(true);
    const { data, error } = await supabase
      .from("flagged_content")
      .select("*")
      .eq("resolved", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching flags:", error.message);
      setLoading(false);
      return;
    }

    setFlags(data || []);
    setLoading(false);
  }

  async function resolve(id: string) {
    await supabase
      .from("flagged_content")
      .update({ resolved: true })
      .eq("id", id);
    setFlags((prev) => prev.filter((f) => f.id !== id));
  }

  async function remove(id: string) {
    await supabase
      .from("flagged_content")
      .delete()
      .eq("id", id);
    setFlags((prev) => prev.filter((f) => f.id !== id));
  }

  const filtered = filter === "all" ? flags : flags.filter((f) => f.severity === filter);

  const SEVERITY_STYLES: Record<string, { badge: string; border: string; icon: string }> = {
    high: {
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
      border: "border-red-500/20",
      icon: "bg-red-500/10 text-red-400",
    },
    medium: {
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      border: "border-amber-500/20",
      icon: "bg-amber-500/10 text-amber-400",
    },
    low: {
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      border: "border-blue-500/20",
      icon: "bg-blue-500/10 text-blue-400",
    },
  };

  const counts = {
    all: flags.length,
    high: flags.filter((f) => f.severity === "high").length,
    medium: flags.filter((f) => f.severity === "medium").length,
    low: flags.filter((f) => f.severity === "low").length,
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Flagged Content</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {flags.length} item{flags.length !== 1 ? "s" : ""} need review
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Flag size={18} className="text-red-400" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs border transition capitalize flex items-center gap-1.5 ${
              filter === f
                ? "border-violet-500 bg-violet-500/10 text-violet-300"
                : "border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            {f}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
              filter === f ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-500"
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          Loading flagged content...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#0f0f18] border border-white/5 rounded-2xl">
          <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
          <p className="text-white font-semibold">All clear</p>
          <p className="text-gray-500 text-sm mt-1">
            No flagged content {filter !== "all" ? `with ${filter} severity` : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((flag) => {
            const style = SEVERITY_STYLES[flag.severity] || SEVERITY_STYLES.medium;
            return (
              <div
                key={flag.id}
                className={`bg-[#0f0f18] border rounded-2xl p-5 ${style.border}`}
              >
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.icon}`}>
                    <AlertTriangle size={14} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs border font-medium capitalize ${style.badge}`}>
                        {flag.severity}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{flag.type}</span>
                      {flag.ref && (
                        <>
                          <span className="text-xs text-gray-700">·</span>
                          <span className="text-xs text-gray-500">{flag.ref}</span>
                        </>
                      )}
                      <span className="text-xs text-gray-600 ml-auto">
                        {new Date(flag.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{flag.content}</p>
                    {flag.user_id && (
                      <p className="text-xs text-gray-600 mt-2">
                        User: {flag.user_id.slice(0, 12)}...
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => resolve(flag.id)}
                      className="p-2 rounded-lg hover:bg-green-500/10 text-green-400 transition"
                      title="Mark resolved"
                    >
                      <CheckCircle size={15} />
                    </button>
                    <button
                      onClick={() => remove(flag.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}