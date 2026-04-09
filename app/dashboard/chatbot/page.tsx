"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send, Bot } from "lucide-react";

const font = "'Manrope', sans-serif";

export default function ChatbotPage() {
  const [messages, setMessages]   = useState<any[]>([]);
  const [input, setInput]         = useState("");
  const [sessionId]               = useState(uuidv4());
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, sessionId }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Sorry, I couldn't respond. Please try again." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "#F5F0E8", fontFamily: font }}
    >

      {/* ── Header ── */}
      <div
        className="flex-none flex items-center gap-3 px-5 py-4 border-b z-10"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2DDD6" }}
      >
        <div className="relative">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}
          >
            <Bot size={18} style={{ color: "#111111" }} />
          </div>
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ backgroundColor: "#22c55e", borderColor: "#FFFFFF" }}
          />
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#111111", fontFamily: font }}>
            MyMood Therapist
          </p>
          <p style={{ fontSize: "12px", color: "#22c55e", fontFamily: font, fontWeight: 500 }}>
            Online
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 min-h-0">

        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex items-end gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
            >
              <Bot size={14} style={{ color: "#111111" }} />
            </div>
            <div
              className="max-w-[75%] px-4 py-3 rounded-2xl rounded-bl-sm"
              style={{
                backgroundColor: "#EDE8DF",
                border: "1px solid #E2DDD6",
                fontSize: "15px",
                fontWeight: 400,
                color: "#222222",
                lineHeight: 1.7,
                fontFamily: font,
              }}
            >
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
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
                >
                  <Bot size={14} style={{ color: "#111111" }} />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 whitespace-pre-wrap break-words ${
                  isUser ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"
                }`}
                style={
                  isUser
                    ? {
                        backgroundColor: "#111111",
                        color: "#F5F0E8",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.7,
                        fontFamily: font,
                      }
                    : {
                        backgroundColor: "#EDE8DF",
                        border: "1px solid #E2DDD6",
                        color: "#222222",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.7,
                        fontFamily: font,
                      }
                }
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
            >
              <Bot size={14} style={{ color: "#111111" }} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
              style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
            >
              <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]"   style={{ backgroundColor: "#9ca3af" }} />
              <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]" style={{ backgroundColor: "#9ca3af" }} />
              <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]" style={{ backgroundColor: "#9ca3af" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div
        className="flex-none px-4 py-4 border-t z-10"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2DDD6" }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-2 transition"
          style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}
          onFocus={() => {}}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 min-w-0 bg-transparent outline-none resize-none max-h-32 overflow-y-auto"
            style={{
              fontSize: "15px",
              fontWeight: 400,
              color: "#111111",
              fontFamily: font,
              lineHeight: 1.6,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 mb-0.5 disabled:opacity-30 hover:-translate-y-0.5"
            style={{ backgroundColor: "#E8521A", color: "#ffffff" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
          >
            <Send size={13} />
          </button>
        </div>
        <p
          className="text-center mt-2"
          style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}
        >
          Press Enter to send · Shift+Enter for new line · Not a substitute for professional help
        </p>
      </div>

    </div>
  );
}