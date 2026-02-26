"use client";

import { useState } from "react";
import {
  Heart,
  Phone,
  BookOpen,
  Music,
  Sun,
  Activity,
  Users,
  Sparkles,
  Send,
  Bot,
} from "lucide-react";
import { useParams } from "next/navigation";

const copingStrategies = [
  { icon: Activity, title: "Breathing Exercise", description: "4-7-8 technique for instant calm", time: "2 min" },
  { icon: Music, title: "Calming Playlist", description: "Curated music for relaxation", time: "15 min" },
  { icon: BookOpen, title: "Thought Journal", description: "Express your feelings safely", time: "10 min" },
  { icon: Sun, title: "Light Therapy", description: "Brighten your mood naturally", time: "20 min" },
];

const immediateHelp = [
  { icon: Bot, title: "Talk to AI Support", description: "Get instant emotional support", action: "chat" },
  { icon: Users, title: "Join Support Group", description: "Connect with others" },
  { icon: BookOpen, title: "Guided Exercises", description: "5-minute calming activities" },
];

export default function ConditionPage() {
  const { condition } = useParams();
  const formattedCondition = condition
    ?.toString()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: `Hi there 💙 I'm here to listen and support you. Want to talk about ${formattedCondition}?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

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
              onClick={() => item.action === "chat" && setShowChatbot(true)}
              className="p-5 rounded-xl bg-[var(--color-box)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition flex flex-col text-left"
            >
              <div className="p-3 rounded-lg bg-[var(--color-accent)]/10 w-fit mb-3">
                <item.icon size={24} color="var(--color-accent)" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
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
                <strategy.icon size={26} color="var(--color-accent)" />
                <div>
                  <h3 className="font-semibold">{strategy.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{strategy.time}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">{strategy.description}</p>
              <button className="w-full px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90">
                Try Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI Chat Modal */}
      {showChatbot && (
        <div className="fixed bottom-5 right-5 w-80 max-h-[500px] rounded-xl bg-[var(--color-box)] border shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[var(--color-accent)] text-white flex justify-between rounded-t-xl">
            <div className="flex items-center gap-2">
              <Bot size={22} />
              <span>AI Support</span>
            </div>
            <button onClick={() => setShowChatbot(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm 
                  ${msg.type === "user" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-bg)] border border-[var(--color-border)]"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg bg-transparent text-sm"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="px-3 py-2 bg-[var(--color-accent)] text-white rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
