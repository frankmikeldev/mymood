"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TrackerLogForm from "./TrackerLogForm";
import TrackerList from "./TrackerList";
import TrackerChart from "./TrackerChart";
import TrackerEmpty from "./TrackerEmpty";
import TrackerStreak from "./TrackerStreak";

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--color-text-muted)]">Loading your tracker...</p>
      </div>
    </div>
  );

  if (!checkins.length) return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Mood Tracker</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Log your emotions and understand your patterns.</p>
        </div>
        <TrackerEmpty onCreate={onCreate} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Mood Tracker</h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            Log your emotions and understand your patterns.
          </p>
        </div>

        <TrackerLogForm onCreate={onCreate} />
        <TrackerStreak entries={checkins} />
        <TrackerChart data={checkins} />
        <TrackerList entries={checkins} />
      </div>
    </div>
  );
}