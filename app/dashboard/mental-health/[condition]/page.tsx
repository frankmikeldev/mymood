"use client";

import { useState } from "react";
import {
  BookOpen, Music, Sun, Activity,
  Users, Send, Bot, X, Wind, ChevronRight, Brain,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const font = "'Manrope', sans-serif";

type CopingAction = "breathing" | "playlist" | "journal" | "light";

interface CopingStrategy {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  action: CopingAction;
}

interface ImmediateHelp {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: string;
}

interface ChatMessage {
  type: "user" | "bot";
  text: string;
  loading?: boolean;
}

const copingStrategies: CopingStrategy[] = [
  { icon: Activity, title: "Breathing Exercise", description: "4-7-8 technique for instant calm",    time: "2 min",  action: "breathing" },
  { icon: Music,    title: "Calming Playlist",   description: "Curated music for relaxation",        time: "15 min", action: "playlist"  },
  { icon: BookOpen, title: "Thought Journal",    description: "Express your feelings safely",        time: "10 min", action: "journal"   },
  { icon: Sun,      title: "Light Therapy",      description: "Brighten your mood naturally",        time: "20 min", action: "light"     },
];

const immediateHelp: ImmediateHelp[] = [
  { icon: Bot,   title: "Talk to AI Support",  description: "Get instant emotional support", action: "chat"      },
  { icon: Users, title: "Join Support Group",  description: "Connect with others",           action: "community" },
  { icon: Wind,  title: "Guided Exercises",    description: "5-minute calming activities",   action: "exercises" },
];

/* ── Modal wrapper ── */
function ModalOverlay({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #E2DDD6" }}>
          <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}>{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition"
            style={{ color: "#9ca3af" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#111111")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Breathing modal ── */
function BreathingModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase]     = useState<"inhale" | "hold" | "exhale">("inhale");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const phaseLabel = { inhale: "Inhale", hold: "Hold", exhale: "Exhale" }[phase];
  const size = phase === "inhale" || phase === "hold" ? "scale-125" : "scale-100";

  const startCycle = () => {
    setRunning(true);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setSeconds(s);
      if (s <= 4)       setPhase("inhale");
      else if (s <= 11) setPhase("hold");
      else if (s <= 19) setPhase("exhale");
      else { s = 0; setSeconds(0); setPhase("inhale"); }
    }, 1000);
    return () => clearInterval(interval);
  };

  return (
    <ModalOverlay onClose={onClose} title="Breathing Exercise">
      <div className="flex flex-col items-center gap-6 py-4">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${size}`}
          style={{ backgroundColor: "#F5F0E8", border: "2px solid #E2DDD6" }}
        >
          <span style={{ fontWeight: 600, fontSize: "15px", color: "#111111", fontFamily: font }}>{phaseLabel}</span>
        </div>
        <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>4-7-8 breathing technique</p>
        {!running ? (
          <button
            onClick={startCycle}
            className="px-6 py-2.5 rounded-xl transition hover:-translate-y-0.5"
            style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: font, boxShadow: "0 2px 12px rgba(232,82,26,0.3)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
          >
            Start
          </button>
        ) : (
          <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>Second {seconds} of cycle</p>
        )}
      </div>
    </ModalOverlay>
  );
}

/* ── Journal modal ── */
function JournalModal({ onClose, condition }: { onClose: () => void; condition: string }) {
  const supabase = createClient();
  const [entry, setEntry]   = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  const handleSave = async () => {
    if (!entry.trim()) return;
    setSaving(true); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please log in to save entries."); setSaving(false); return; }
      const { error: saveError } = await supabase.from("journal_entries").insert({
        user_id: user.id, title: `Mental Health Note — ${condition}`,
        content: entry, mood: "", created_at: new Date().toISOString(),
      });
      if (saveError) throw saveError;
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1500);
    } catch {
      setError("Failed to save. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <ModalOverlay onClose={onClose} title="Thought Journal">
      <div className="flex flex-col gap-4">
        <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font }}>
          Write freely — this will be saved to your Journal page.
        </p>
        <textarea
          className="w-full h-40 resize-none outline-none transition rounded-xl p-4"
          placeholder="How are you feeling right now?"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6", fontSize: "15px", color: "#111111", fontFamily: font, lineHeight: 1.7 }}
          onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
          onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
        />
        {error && <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: font }}>{error}</p>}
        <button
          onClick={handleSave}
          disabled={!entry.trim() || saving}
          className="px-5 py-2.5 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-0.5"
          style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: font, boxShadow: "0 2px 12px rgba(232,82,26,0.3)" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
        >
          {saving ? (
            <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : saved ? "✓ Saved to Journal!" : "Save to Journal"}
        </button>
      </div>
    </ModalOverlay>
  );
}

/* ── Light therapy modal ── */
function LightTherapyModal({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(false);
  return (
    <ModalOverlay onClose={onClose} title="Light Therapy">
      <div className="flex flex-col items-center gap-5 py-2">
        <div
          className="w-full h-32 rounded-xl flex items-center justify-center transition-all duration-700"
          style={{ background: active ? "#fef9c3" : "#F5F0E8", border: "1px solid #E2DDD6" }}
        >
          <Sun size={48} style={{ color: active ? "#92400e" : "#9ca3af", opacity: active ? 1 : 0.4, transition: "all 0.7s" }} />
        </div>
        <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: font, textAlign: "center" }}>
          Sit 30–40 cm from your screen for 20 minutes to simulate natural daylight.
        </p>
        <button
          onClick={() => setActive(!active)}
          className="px-6 py-2.5 rounded-xl transition hover:-translate-y-0.5"
          style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: font, boxShadow: "0 2px 12px rgba(232,82,26,0.3)" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
        >
          {active ? "Stop Session" : "Start Session"}
        </button>
      </div>
    </ModalOverlay>
  );
}

/* ── Playlist modal ── */
function PlaylistModal({ onClose }: { onClose: () => void }) {
  const tracks = [
    { title: "Weightless",          artist: "Marconi Union",    duration: "8:09" },
    { title: "Clair de Lune",       artist: "Debussy",          duration: "5:01" },
    { title: "Sunset Lover",        artist: "Petit Biscuit",    duration: "4:23" },
    { title: "Experience",          artist: "Ludovico Einaudi", duration: "5:15" },
    { title: "River Flows in You",  artist: "Yiruma",           duration: "3:51" },
  ];
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <ModalOverlay onClose={onClose} title="Calming Playlist">
      <div className="flex flex-col gap-1.5">
        {tracks.map((track, i) => (
          <button
            key={i}
            onClick={() => setPlaying(playing === i ? null : i)}
            className="flex items-center gap-3 p-3 rounded-xl border transition text-left"
            style={{
              borderColor: playing === i ? "#111111" : "transparent",
              backgroundColor: playing === i ? "#F5F0E8" : "transparent",
            }}
            onMouseEnter={e => { if (playing !== i) e.currentTarget.style.backgroundColor = "#F5F0E8"; }}
            onMouseLeave={e => { if (playing !== i) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0"
              style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6", fontWeight: 600, color: "#111111", fontFamily: font }}
            >
              {playing === i ? "▶" : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", fontFamily: font }} className="truncate">{track.title}</p>
              <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>{track.artist}</p>
            </div>
            <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>{track.duration}</span>
          </button>
        ))}
      </div>
    </ModalOverlay>
  );
}

/* ── Main page ── */
export default function ConditionPage() {
  const { condition } = useParams();
  const router = useRouter();
  const formattedCondition = condition
    ?.toString().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [showChatbot, setShowChatbot]   = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: "bot", text: `Hi there 💙 I'm here to listen and support you. Want to talk about ${formattedCondition}?` },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeModal, setActiveModal]   = useState<CopingAction | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage;
    setInputMessage("");
    setChatMessages((prev) => [...prev, { type: "user", text: userText }, { type: "bot", text: "", loading: true }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `You are a compassionate mental health support assistant helping someone dealing with ${formattedCondition}. Be warm, empathetic, concise and helpful. Keep responses under 3 sentences unless the user needs more detail.` },
            ...chatMessages.filter((m) => !m.loading).map((m) => ({ role: m.type === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userText },
          ],
          sessionId: `mental-health-${condition}`,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev.filter((m) => !m.loading), { type: "bot", text: data.reply || "I'm here for you. Could you tell me more about how you're feeling?" }]);
    } catch {
      setChatMessages((prev) => [...prev.filter((m) => !m.loading), { type: "bot", text: "Something went wrong. Please try again." }]);
    }
  };

  const handleImmediateHelp = (action?: string) => {
    if (action === "chat")      setShowChatbot(true);
    else if (action === "community") router.push("/dashboard/community");
    else if (action === "exercises") setActiveModal("breathing");
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 pb-5" style={{ borderBottom: "1px solid #E2DDD6" }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              {formattedCondition}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "4px" }}>
              You're not alone. Here are tools and coping strategies that may help.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
            <Brain size={18} style={{ color: "#111111" }} />
          </div>
        </div>

        {/* ── Helpful Tools ── */}
        <div className="mb-8">
          <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
            Helpful Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {immediateHelp.map((item, index) => (
              <button
                key={index}
                onClick={() => handleImmediateHelp(item.action)}
                className="flex items-center gap-3 p-4 rounded-2xl text-left transition group"
                style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#111111"; e.currentTarget.style.backgroundColor = "#E6E0D5"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2DDD6"; e.currentTarget.style.backgroundColor = "#EDE8DF"; }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}>
                  <item.icon size={17} style={{ color: "#444444" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#111111", fontFamily: font }} className="truncate">{item.title}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: font }} className="truncate">{item.description}</p>
                </div>
                <ChevronRight size={13} style={{ color: "#9ca3af" }} className="ml-auto shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Coping Strategies ── */}
        <div className="mb-8">
          <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
            Coping Strategies
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="p-5 rounded-2xl" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}>
                    <strategy.icon size={17} style={{ color: "#444444" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}>{strategy.title}</p>
                    <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>{strategy.time}</p>
                  </div>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 400, color: "#444444", fontFamily: font, lineHeight: 1.75, marginBottom: "16px" }}>
                  {strategy.description}
                </p>
                <button
                  onClick={() => setActiveModal(strategy.action)}
                  className="w-full py-2.5 rounded-xl transition hover:-translate-y-0.5"
                  style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: font, boxShadow: "0 2px 12px rgba(232,82,26,0.25)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
                >
                  Try Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="rounded-2xl px-5 py-4" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 400, textAlign: "center", lineHeight: 1.7 }}>
            ⚠️ MyMood is for self-reflection and wellness only. For serious medical concerns,
            please consult a licensed mental health professional.
          </p>
        </div>

      </div>

      {/* ── Modals ── */}
      {activeModal === "breathing" && <BreathingModal onClose={() => setActiveModal(null)} />}
      {activeModal === "journal"   && <JournalModal onClose={() => setActiveModal(null)} condition={formattedCondition || "Mental Health"} />}
      {activeModal === "light"     && <LightTherapyModal onClose={() => setActiveModal(null)} />}
      {activeModal === "playlist"  && <PlaylistModal onClose={() => setActiveModal(null)} />}

      {/* ── AI Chat bubble ── */}
      {showChatbot && (
        <div
          className="fixed bottom-4 right-4 w-[340px] sm:w-[380px] h-[520px] flex flex-col z-40 overflow-hidden rounded-2xl"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        >
          {/* Chat Header */}
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{ backgroundColor: "#F5F0E8", borderBottom: "1px solid #E2DDD6" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
                  <Bot size={15} style={{ color: "#111111" }} />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border" style={{ backgroundColor: "#22c55e", borderColor: "#F5F0E8" }} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#111111", fontFamily: font }}>AI Support</p>
                <p style={{ fontSize: "11px", color: "#22c55e", fontFamily: font, fontWeight: 500 }}>Online</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="p-1.5 rounded-lg transition"
              style={{ color: "#9ca3af" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#111111")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.type === "bot" && (
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
                    <Bot size={11} style={{ color: "#111111" }} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl break-words ${msg.type === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                  style={
                    msg.type === "user"
                      ? { backgroundColor: "#111111", color: "#F5F0E8", fontSize: "14px", lineHeight: 1.7, fontFamily: font }
                      : { backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6", color: "#222222", fontSize: "14px", lineHeight: 1.7, fontFamily: font }
                  }
                >
                  {msg.loading ? (
                    <div className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]"   style={{ backgroundColor: "#9ca3af" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]" style={{ backgroundColor: "#9ca3af" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]" style={{ backgroundColor: "#9ca3af" }} />
                    </div>
                  ) : msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 shrink-0" style={{ borderTop: "1px solid #E2DDD6" }}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}>
              <input
                className="flex-1 min-w-0 bg-transparent outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                style={{ fontSize: "14px", color: "#111111", fontFamily: font }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition shrink-0 disabled:opacity-30"
                style={{ backgroundColor: "#E8521A", color: "#ffffff" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}