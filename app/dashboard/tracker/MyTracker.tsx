"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TrackerLogForm from "./TrackerLogForm";
import TrackerList from "./TrackerList";
import TrackerChart from "./TrackerChart";
import TrackerEmpty from "./TrackerEmpty";
import TrackerStreak from "./TrackerStreak";
import Image from "next/image";

const font = "'Manrope', sans-serif";

const WHITE_CARD = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2DDD6",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const TRUST_PILLS = [
  { label: "Daily streaks" },
  { label: "AI insights" },
  { label: "100% private" },
];

export default function MyTracker() {
  const router   = useRouter();
  const supabase = createClient();
  const [user, setUser]         = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

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

  const onCreate = async (payload: { mood?: number; notes?: string; emotion?: string; custom_mood?: string; }) => {
    if (!user) return;
    if (!payload.mood && !payload.custom_mood?.trim()) { alert("Please write something or select a mood."); return; }
    const temp = { id: `temp-${Date.now()}`, user_id: user.id, ...payload, created_at: new Date().toISOString(), optimistic: true };
    setCheckins((prev) => [temp, ...prev].slice(0, 30));
    try {
      const { createCheckin } = await import("@/lib/supabase/checkins");
      const saved = await createCheckin({ user_id: user.id, mood: payload.mood, emotion: payload.emotion, notes: payload.notes, custom_mood: payload.custom_mood });
      setCheckins((prev) => [saved, ...prev.filter((c) => !c.optimistic)].slice(0, 30));
    } catch (err: any) {
      console.error("onCreate error:", err);
      setCheckins((prev) => prev.filter((c) => !c.optimistic));
      alert(`Failed to save entry: ${err?.message || "Unknown error"}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#E2DDD6", borderTopColor: "transparent" }} />
        <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font }}>Loading your tracker...</p>
      </div>
    </div>
  );

  const Header = () => (
    <div
      className="flex flex-col md:flex-row md:items-stretch gap-6 mb-8 pb-8"
      style={{ borderBottom: "1px solid #E2DDD6" }}
    >
      {/* Left — text */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full w-fit" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#E8521A", display: "inline-block" }} />
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, fontFamily: font }}>Mood Tracker</span>
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "clamp(22px, 5vw, 32px)", color: "#111111", fontFamily: font, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "12px" }}>
          Log Your<br />Emotions
        </h1>

        <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, lineHeight: 1.65, maxWidth: "360px", marginBottom: "16px" }}>
          Track how you feel every day, spot patterns over time, and build the self-awareness that leads to lasting emotional balance.
        </p>

        <div className="flex flex-wrap gap-2">
          {TRUST_PILLS.map((p) => (
            <span key={p.label} style={{ ...WHITE_CARD, borderRadius: "999px", padding: "5px 14px", fontSize: "12px", color: "#444444", fontWeight: 500, fontFamily: font, display: "inline-block" }}>
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Right — image (below text on mobile, right on desktop) */}
      <div className="shrink-0 rounded-2xl overflow-hidden" style={{ position: "relative", backgroundColor: "#1C3A2E" }}>
        <style>{`@media (min-width: 768px) { .tracker-hero-img { width: 420px !important; height: 320px !important; } }`}</style>
        <div className="tracker-hero-img w-full rounded-2xl overflow-hidden" style={{ position: "relative", height: "200px", backgroundColor: "#1C3A2E" }}>
          <Image src="/images/mmm.png" alt="Mood tracker illustration" fill style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.9 }} priority />
        </div>
      </div>
    </div>
  );

  if (!checkins.length) return (
    <div className="min-h-screen p-4 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-2xl mx-auto">
        <Header />
        <TrackerEmpty onCreate={onCreate} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Header />
        <TrackerLogForm onCreate={onCreate} />
        <TrackerStreak entries={checkins} />
        <TrackerChart data={checkins} />
        <TrackerList entries={checkins} />
      </div>
    </div>
  );
}