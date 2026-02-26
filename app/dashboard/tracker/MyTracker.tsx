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
      if (!session) {
        router.push("/login");
        return;
      }

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

  const addOptimistic = (entry: any) => {
    setCheckins((prev) => [entry, ...prev].slice(0, 30));
  };

  const onCreate = async (payload: { mood: number; notes?: string; emotion?: string }) => {
    if (!user) return;

    const temp = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      ...payload,
      created_at: new Date().toISOString(),
      optimistic: true,
    };

    addOptimistic(temp);

    try {
      const { createCheckin } = await import("@/lib/supabase/checkins");
      const saved = await createCheckin({ ...payload, user_id: user.id });
      setCheckins((prev) => [saved, ...prev.filter((c) => !c.optimistic)].slice(0, 30));
    } catch {
      setCheckins((prev) => prev.filter((c) => !c.optimistic));
      alert("Failed to save entry. Try again.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!checkins.length)
    return (
      <div className="p-6">
        <TrackerEmpty onCreate={onCreate} />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <TrackerLogForm onCreate={onCreate} />
      <TrackerChart data={checkins} />
      <TrackerList entries={checkins} />
    </div>
  );


  return (
  <div className="p-6 space-y-6">
    <TrackerLogForm onCreate={onCreate} />
    <TrackerStreak entries={checkins} /> {/* ✅ new streak card */}
    <TrackerChart data={checkins} />
    <TrackerList entries={checkins} />
  </div>
);

}
