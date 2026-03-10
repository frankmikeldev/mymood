"use client";

import { useState } from "react";
import {
  Heart,
  BookOpen,
  Music,
  Sun,
  Activity,
  Users,
  Send,
  Bot,
  X,
  Wind,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type CopingAction = "breathing" | "playlist" | "journal" | "light";

interface CopingStrategy {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  action: CopingAction;
  color: string;
}

interface ImmediateHelp {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const copingStrategies: CopingStrategy[] = [
  {
    icon: Activity,
    title: "Breathing Exercise",
    description: "4-7-8 technique for instant calm",
    time: "2 min",
    action: "breathing",
    color: "#6EE7B7",
  },
  {
    icon: Music,
    title: "Calming Playlist",
    description: "Curated music for relaxation",
    time: "15 min",
    action: "playlist",
    color: "#A78BFA",
  },
  {
    icon: BookOpen,
    title: "Thought Journal",
    description: "Express your feelings safely",
    time: "10 min",
    action: "journal",
    color: "#93C5FD",
  },
  {
    icon: Sun,
    title: "Light Therapy",
    description: "Brighten your mood naturally",
    time: "20 min",
    action: "light",
    color: "#FCD34D",
  },
];

const immediateHelp: ImmediateHelp[] = [
  {
    icon: Bot,
    title: "Talk to AI Support",
    description: "Get instant emotional support",
    action: "chat",
  },
  {
    icon: Users,
    title: "Join Support Group",
    description: "Connect with others",
    action: "group",
  },
  {
    icon: Wind,
    title: "Guided Exercises",
    description: "5-minute calming activities",
    action: "exercises",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BreathingModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const phaseLabel = { inhale: "Inhale", hold: "Hold", exhale: "Exhale" }[phase];
  const phaseColor = {
    inhale: "#6EE7B7",
    hold: "#FCD34D",
    exhale: "#93C5FD",
  }[phase];

  const startCycle = () => {
    setRunning(true);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setSeconds(s);
      if (s <= 4) setPhase("inhale");
      else if (s <= 11) setPhase("hold");
      else if (s <= 19) setPhase("exhale");
      else {
        s = 0;
        setSeconds(0);
        setPhase("inhale");
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  return (
    <ModalOverlay onClose={onClose} title="Breathing Exercise 🌬️">
      <div className="flex flex-col items-center gap-8 py-4">
        <div
          className="w-36 h-36 rounded-full flex items-center justify-center text-2xl font-bold text-white transition-all duration-1000"
          style={{
            background: phaseColor,
            transform: phase === "inhale" ? "scale(1.25)" : phase === "hold" ? "scale(1.25)" : "scale(1)",
            boxShadow: `0 0 40px ${phaseColor}88`,
          }}
        >
          {phaseLabel}
        </div>
        <p className="text-[var(--color-text-muted)] text-sm">4-7-8 breathing technique</p>
        {!running ? (
          <button
            onClick={startCycle}
            className="px-6 py-3 rounded-full bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition"
          >
            Start
          </button>
        ) : (
          <p className="text-[var(--color-text-muted)] text-sm">Second {seconds} of cycle</p>
        )}
      </div>
    </ModalOverlay>
  );
}

function JournalModal({ onClose }: { onClose: () => void }) {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!entry.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModalOverlay onClose={onClose} title="Thought Journal 📓">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Write freely — no judgement, just expression.
        </p>
        <textarea
          className="w-full h-48 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="How are you feeling right now?"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition"
        >
          {saved ? "✓ Saved!" : "Save Entry"}
        </button>
      </div>
    </ModalOverlay>
  );
}

function LightTherapyModal({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(false);

  return (
    <ModalOverlay onClose={onClose} title="Light Therapy ☀️">
      <div className="flex flex-col items-center gap-6 py-4">
        <div
          className="w-full h-40 rounded-2xl transition-all duration-700 flex items-center justify-center"
          style={{
            background: active
              ? "linear-gradient(135deg, #FEF9C3, #FCD34D, #FBBF24)"
              : "var(--color-bg)",
            boxShadow: active ? "0 0 60px #FCD34D88" : "none",
          }}
        >
          <Sun
            size={64}
            color={active ? "#92400E" : "var(--color-text-muted)"}
            className="transition-all duration-700"
            style={{ transform: active ? "scale(1.2)" : "scale(1)" }}
          />
        </div>
        <p className="text-sm text-[var(--color-text-muted)] text-center max-w-xs">
          Sit 30–40 cm from your screen for 20 minutes. This simulates natural daylight to boost mood.
        </p>
        <button
          onClick={() => setActive(!active)}
          className="px-6 py-3 rounded-full font-semibold text-white transition"
          style={{ background: "var(--color-accent)" }}
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
    <ModalOverlay onClose={onClose} title="Calming Playlist 🎵">
      <div className="flex flex-col gap-2">
        {tracks.map((track, i) => (
          <button
            key={i}
            onClick={() => setPlaying(playing === i ? null : i)}
            className="flex items-center justify-between p-3 rounded-xl transition hover:bg-[var(--color-accent)]/10 border border-transparent hover:border-[var(--color-border)]"
            style={{ background: playing === i ? "var(--color-accent)10" : undefined }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: playing === i ? "var(--color-accent)" : "#64748B" }}
              >
                {playing === i ? "▶" : i + 1}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{track.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{track.artist}</p>
              </div>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">{track.duration}</span>
          </button>
        ))}
      </div>
    </ModalOverlay>
  );
}

function ModalOverlay({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--color-accent)]/10 transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConditionPage() {
  const { condition } = useParams();
  const formattedCondition = condition
    ?.toString()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Chat state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: `Hi there 💙 I'm here to listen and support you. Want to talk about ${formattedCondition}?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Modal state
  const [activeModal, setActiveModal] = useState<CopingAction | null>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { type: "user", text: inputMessage },
      {
        type: "bot",
        text: "I hear you. It's okay to feel this way. Would you like tips, journaling, or mood support?",
      },
    ]);
    setInputMessage("");
  };

  const handleImmediateHelp = (action?: string) => {
    if (action === "chat") setShowChatbot(true);
    else if (action === "journal") setActiveModal("journal");
    else if (action === "exercises") setActiveModal("breathing");
    // "group" could route elsewhere
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-purple-500 flex items-center justify-center">
          <Heart size={42} color="white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{formattedCondition}</h1>
        <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
          You're not alone. Here are emotional wellness tools and coping strategies that may help.
        </p>
      </div>

      {/* Immediate Help */}
      <section className="mb-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Helpful Tools 💡</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {immediateHelp.map((item, index) => (
            <button
              key={index}
              onClick={() => handleImmediateHelp(item.action)}
              className="p-5 rounded-xl bg-[var(--color-box)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition flex flex-col text-left group"
            >
              <div className="p-3 rounded-lg bg-[var(--color-accent)]/10 w-fit mb-3 group-hover:bg-[var(--color-accent)]/20 transition">
                <item.icon size={24} color="var(--color-accent)" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-accent)] font-medium opacity-0 group-hover:opacity-100 transition">
                Open <ChevronRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Coping Strategies */}
      <section className="mb-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Coping Strategies 🌿</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {copingStrategies.map((strategy, index) => (
            <div
              key={index}
              className="p-6 bg-[var(--color-box)] border border-[var(--color-border)] rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${strategy.color}22` }}
                >
                  <strategy.icon size={24} color={strategy.color} />
                </div>
                <div>
                  <h3 className="font-semibold">{strategy.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{strategy.time}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">{strategy.description}</p>
              <button
                onClick={() => setActiveModal(strategy.action)}
                className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
                style={{ background: strategy.color === "#FCD34D" ? "#D97706" : "var(--color-accent)" }}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Coping Modals ── */}
      {activeModal === "breathing" && <BreathingModal onClose={() => setActiveModal(null)} />}
      {activeModal === "journal" && <JournalModal onClose={() => setActiveModal(null)} />}
      {activeModal === "light" && <LightTherapyModal onClose={() => setActiveModal(null)} />}
      {activeModal === "playlist" && <PlaylistModal onClose={() => setActiveModal(null)} />}

      {/* ── AI Chat Modal ── */}
      {/* ── AI Chat Modal ── */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-[340px] sm:w-[380px] h-[520px] rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl flex flex-col z-40">
          
          {/* Header */}
          <div className="p-3 bg-[var(--color-accent)] text-white flex justify-between items-center rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm">AI Support</p>
                <p className="text-xs text-white/70">Always here for you</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition"
            >
              <X size={17} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0f172a]">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.type === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                    <Bot size={12} color="white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words
                    ${msg.type === "user"
                      ? "bg-[var(--color-accent)] text-white rounded-br-sm"
                      : "bg-[#1e293b] text-gray-100 border border-white/10 rounded-bl-sm"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-[#0f172a] rounded-b-2xl shrink-0">
            <div className="flex items-center gap-2 bg-[#1e293b] border border-white/10 rounded-full px-3 py-2">
              <input
                className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center disabled:opacity-40 transition shrink-0"
              >
                <Send size={13} color="white" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}