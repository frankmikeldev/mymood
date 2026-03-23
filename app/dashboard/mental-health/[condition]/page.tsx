"use client";

import { useState } from "react";
import {
  BookOpen, Music, Sun, Activity,
  Users, Send, Bot, X, Wind, ChevronRight, Brain,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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
  { icon: Activity, title: "Breathing Exercise", description: "4-7-8 technique for instant calm", time: "2 min", action: "breathing" },
  { icon: Music, title: "Calming Playlist", description: "Curated music for relaxation", time: "15 min", action: "playlist" },
  { icon: BookOpen, title: "Thought Journal", description: "Express your feelings safely", time: "10 min", action: "journal" },
  { icon: Sun, title: "Light Therapy", description: "Brighten your mood naturally", time: "20 min", action: "light" },
];

const immediateHelp: ImmediateHelp[] = [
  { icon: Bot, title: "Talk to AI Support", description: "Get instant emotional support", action: "chat" },
  { icon: Users, title: "Join Support Group", description: "Connect with others", action: "community" },
  { icon: Wind, title: "Guided Exercises", description: "5-minute calming activities", action: "exercises" },
];

function ModalOverlay({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold text-sm text-[var(--color-text-header)]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-bg-main)] transition text-[var(--color-text-body)] opacity-50 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function BreathingModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
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
      if (s <= 4) setPhase("inhale");
      else if (s <= 11) setPhase("hold");
      else if (s <= 19) setPhase("exhale");
      else { s = 0; setSeconds(0); setPhase("inhale"); }
    }, 1000);
    return () => clearInterval(interval);
  };

  return (
    <ModalOverlay onClose={onClose} title="Breathing Exercise">
      <div className="flex flex-col items-center gap-6 py-4">
        <div className={`w-32 h-32 rounded-full bg-[var(--color-bg-main)] border-2 border-[var(--color-text-header)] border-opacity-20 flex items-center justify-center transition-all duration-1000 ${size}`}>
          <span className="text-base font-semibold text-[var(--color-text-header)]">{phaseLabel}</span>
        </div>
        <p className="text-xs text-[var(--color-text-body)] opacity-50">4-7-8 breathing technique</p>
        {!running ? (
          <button onClick={startCycle} className="px-6 py-2.5 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition">
            Start
          </button>
        ) : (
          <p className="text-xs text-[var(--color-text-body)] opacity-40">Second {seconds} of cycle</p>
        )}
      </div>
    </ModalOverlay>
  );
}

// ✅ Journal modal now saves to Supabase journal_entries table
function JournalModal({ onClose, condition }: { onClose: () => void; condition: string }) {
  const supabase = createClient();
  const [entry, setEntry] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!entry.trim()) return;
    setSaving(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please log in to save entries."); setSaving(false); return; }

      const { error: saveError } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: `Mental Health Note — ${condition}`,
        content: entry,
        mood: "",
        created_at: new Date().toISOString(),
      });

      if (saveError) throw saveError;

      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1500);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose} title="Thought Journal">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-[var(--color-text-body)] opacity-50">
          Write freely — this will be saved to your Journal page.
        </p>
        <textarea
          className="w-full h-40 p-4 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-30 resize-none outline-none focus:border-[var(--color-text-header)] focus:border-opacity-30 transition"
          placeholder="How are you feeling right now?"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        <button
          onClick={handleSave}
          disabled={!entry.trim() || saving}
          className="px-5 py-2.5 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            "✓ Saved to Journal!"
          ) : (
            "Save to Journal"
          )}
        </button>
      </div>
    </ModalOverlay>
  );
}

function LightTherapyModal({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(false);

  return (
    <ModalOverlay onClose={onClose} title="Light Therapy">
      <div className="flex flex-col items-center gap-5 py-2">
        <div
          className="w-full h-32 rounded-xl flex items-center justify-center transition-all duration-700 border border-[var(--color-border)]"
          style={{ background: active ? "#fef9c3" : "var(--color-bg-main)" }}
        >
          <Sun size={48} className="transition-all duration-700" style={{ color: active ? "#92400e" : "var(--color-text-body)", opacity: active ? 1 : 0.3 }} />
        </div>
        <p className="text-xs text-[var(--color-text-body)] opacity-50 text-center">
          Sit 30–40 cm from your screen for 20 minutes to simulate natural daylight.
        </p>
        <button
          onClick={() => setActive(!active)}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition"
        >
          {active ? "Stop Session" : "Start Session"}
        </button>
      </div>
    </ModalOverlay>
  );
}

function PlaylistModal({ onClose }: { onClose: () => void }) {
  const tracks = [
    { title: "Weightless", artist: "Marconi Union", duration: "8:09" },
    { title: "Clair de Lune", artist: "Debussy", duration: "5:01" },
    { title: "Sunset Lover", artist: "Petit Biscuit", duration: "4:23" },
    { title: "Experience", artist: "Ludovico Einaudi", duration: "5:15" },
    { title: "River Flows in You", artist: "Yiruma", duration: "3:51" },
  ];
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <ModalOverlay onClose={onClose} title="Calming Playlist">
      <div className="flex flex-col gap-1.5">
        {tracks.map((track, i) => (
          <button
            key={i}
            onClick={() => setPlaying(playing === i ? null : i)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition text-left ${
              playing === i
                ? "border-[var(--color-text-header)] border-opacity-20 bg-[var(--color-bg-main)]"
                : "border-transparent hover:bg-[var(--color-bg-main)]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xs font-medium text-[var(--color-text-header)] shrink-0">
              {playing === i ? "▶" : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-header)] truncate">{track.title}</p>
              <p className="text-xs text-[var(--color-text-body)] opacity-40">{track.artist}</p>
            </div>
            <span className="text-xs text-[var(--color-text-body)] opacity-40 shrink-0">{track.duration}</span>
          </button>
        ))}
      </div>
    </ModalOverlay>
  );
}

export default function ConditionPage() {
  const { condition } = useParams();
  const router = useRouter();
  const formattedCondition = condition
    ?.toString()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      text: `Hi there 💙 I'm here to listen and support you. Want to talk about ${formattedCondition}?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeModal, setActiveModal] = useState<CopingAction | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage("");

    setChatMessages((prev) => [
      ...prev,
      { type: "user", text: userText },
      { type: "bot", text: "", loading: true },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a compassionate mental health support assistant helping someone dealing with ${formattedCondition}. Be warm, empathetic, concise and helpful. Keep responses under 3 sentences unless the user needs more detail.`,
            },
            ...chatMessages
              .filter((m) => !m.loading)
              .map((m) => ({
                role: m.type === "user" ? "user" : "assistant",
                content: m.text,
              })),
            { role: "user", content: userText },
          ],
          sessionId: `mental-health-${condition}`,
        }),
      });

      const data = await res.json();

      setChatMessages((prev) => [
        ...prev.filter((m) => !m.loading),
        {
          type: "bot",
          text: data.reply || "I'm here for you. Could you tell me more about how you're feeling?",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev.filter((m) => !m.loading),
        { type: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  // ✅ Community navigates to community page
  const handleImmediateHelp = (action?: string) => {
    if (action === "chat") setShowChatbot(true);
    else if (action === "community") router.push("/dashboard/community");
    else if (action === "exercises") setActiveModal("breathing");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">
              {formattedCondition}
            </h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              You're not alone. Here are tools and coping strategies that may help.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Brain size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        {/* Helpful Tools */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-4">
            Helpful Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {immediateHelp.map((item, index) => (
              <button
                key={index}
                onClick={() => handleImmediateHelp(item.action)}
                className="flex items-center gap-3 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-text-header)] hover:border-opacity-20 transition text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <item.icon size={17} className="text-[var(--color-text-header)] opacity-60" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-header)] truncate">{item.title}</p>
                  <p className="text-xs text-[var(--color-text-body)] opacity-40 truncate">{item.description}</p>
                </div>
                <ChevronRight size={13} className="ml-auto shrink-0 text-[var(--color-text-body)] opacity-20 group-hover:opacity-60 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Coping Strategies */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-4">
            Coping Strategies
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="p-5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <strategy.icon size={17} className="text-[var(--color-text-header)] opacity-60" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-header)]">{strategy.title}</p>
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">{strategy.time}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-body)] opacity-60 mb-4 leading-relaxed">
                  {strategy.description}
                </p>
                <button
                  onClick={() => setActiveModal(strategy.action)}
                  className="w-full py-2.5 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition"
                >
                  Try Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl px-5 py-4">
          <p className="text-xs text-[var(--color-text-body)] opacity-40 text-center leading-relaxed">
            ⚠️ MyMood is for self-reflection and wellness only. For serious medical concerns,
            please consult a licensed mental health professional.
          </p>
        </div>

      </div>

      {/* Modals */}
      {activeModal === "breathing" && <BreathingModal onClose={() => setActiveModal(null)} />}
      {/* ✅ Pass condition to JournalModal so it saves with context */}
      {activeModal === "journal" && (
        <JournalModal
          onClose={() => setActiveModal(null)}
          condition={formattedCondition || "Mental Health"}
        />
      )}
      {activeModal === "light" && <LightTherapyModal onClose={() => setActiveModal(null)} />}
      {activeModal === "playlist" && <PlaylistModal onClose={() => setActiveModal(null)} />}

      {/* AI Chat */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-[340px] sm:w-[380px] h-[520px] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl flex flex-col z-40 overflow-hidden">

          {/* Chat Header */}
          <div className="px-4 py-3 bg-[var(--color-bg-main)] border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-[var(--color-text-header)]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-[var(--color-bg-main)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-header)]">AI Support</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="p-1.5 rounded-lg hover:bg-[var(--color-bg-card)] transition text-[var(--color-text-body)] opacity-40 hover:opacity-100"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.type === "bot" && (
                  <div className="w-6 h-6 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <Bot size={11} className="text-[var(--color-text-header)]" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                    msg.type === "user"
                      ? "bg-[var(--color-text-header)] text-[var(--color-bg-main)] rounded-br-sm"
                      : "bg-[var(--color-bg-main)] text-[var(--color-text-header)] border border-[var(--color-border)] rounded-bl-sm"
                  }`}
                >
                  {msg.loading ? (
                    <div className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 bg-[var(--color-text-body)] opacity-40 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-[var(--color-text-body)] opacity-40 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-[var(--color-text-body)] opacity-40 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--color-border)] shrink-0">
            <div className="flex items-center gap-2 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-3 py-2">
              <input
                className="flex-1 min-w-0 bg-transparent text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-30 outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-7 h-7 rounded-lg bg-[var(--color-text-header)] text-[var(--color-bg-main)] flex items-center justify-center disabled:opacity-30 transition shrink-0 hover:opacity-80"
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