"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send, Bot } from "lucide-react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, sessionId }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Sorry, I couldn't respond. Please try again." },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-bg-main)]">

      {/* Header */}
      <div className="flex-none flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Bot size={18} className="text-[var(--color-text-header)]" />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--color-bg-card)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-header)]">
            MyMood Therapist
          </p>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 min-h-0">

        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Bot size={14} className="text-[var(--color-text-header)]" />
            </div>
            <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--color-bg-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-body)] leading-relaxed">
              Hi there 👋 I'm your MyMood wellness companion. How are you feeling today? I'm here to listen and support you.
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-[var(--color-text-header)]" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isUser
                    ? "bg-[var(--color-text-header)] text-[var(--color-bg-main)] rounded-br-sm"
                    : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-body)] rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Bot size={14} className="text-[var(--color-text-header)]" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--color-bg-card)] border border-[var(--color-border)] flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-[var(--color-text-body)] opacity-40 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[var(--color-text-body)] opacity-40 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[var(--color-text-body)] opacity-40 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-none px-4 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] z-10">
        <div className="flex items-end gap-3 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl px-4 py-2 focus-within:border-[var(--color-text-header)] focus-within:border-opacity-30 transition">
          <textarea
            ref={textareaRef}
            className="flex-1 min-w-0 bg-transparent text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-30 outline-none resize-none max-h-32 overflow-y-auto leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type a message..."
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] flex items-center justify-center disabled:opacity-30 transition shrink-0 mb-0.5 hover:opacity-80"
          >
            <Send size={13} />
          </button>
        </div>
        <p className="text-center text-xs text-[var(--color-text-body)] opacity-30 mt-2">
          Press Enter to send · Shift+Enter for new line · Not a substitute for professional help
        </p>
      </div>

    </div>
  );
}