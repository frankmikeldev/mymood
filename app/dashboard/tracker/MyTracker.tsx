"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TrackerLogForm from "./TrackerLogForm";
import TrackerList from "./TrackerList";
import TrackerChart from "./TrackerChart";
import TrackerEmpty from "./TrackerEmpty";
import TrackerStreak from "./TrackerStreak";
import { Activity } from "lucide-react";

export default function MyTracker() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
      try {
        const { getRecentCheckins } = await import("@/lib/supabase/checkins");
        const rows = await getRecentCheckins(session.user.id, 30);
        setCheckins(rows ?? []);
      } catch (err) {
        console.error("Error loading checkins:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router, supabase]);

  const onCreate = async (payload: { mood: number; notes?: string; emotion?: string }) => {
    if (!user) return;
    const temp = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      ...payload,
      created_at: new Date().toISOString(),
      optimistic: true,
    };
    setCheckins((prev) => [temp, ...prev].slice(0, 30));
    try {
      const { createCheckin } = await import("@/lib/supabase/checkins");
      const saved = await createCheckin({ ...payload, user_id: user.id });
      setCheckins((prev) => [saved, ...prev.filter((c) => !c.optimistic)].slice(0, 30));
    } catch {
      setCheckins((prev) => prev.filter((c) => !c.optimistic));
      alert("Failed to save entry. Try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-text-header)] border-t-transparent animate-spin opacity-40" />
        <p className="text-sm text-[var(--color-text-body)] opacity-40">Loading your tracker...</p>
      </div>
    </div>
  );

  if (!checkins.length) return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">Mood Tracker</h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Log your emotions and understand your patterns.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Activity size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>
        <TrackerEmpty onCreate={onCreate} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">Mood Tracker</h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Log your emotions and understand your patterns.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Activity size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>
        <TrackerLogForm onCreate={onCreate} />
        <TrackerStreak entries={checkins} />
        <TrackerChart data={checkins} />
        <TrackerList entries={checkins} />
      </div>
    </div>
  );
}