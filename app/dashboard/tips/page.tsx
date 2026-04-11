"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const font = "'Manrope', sans-serif";

const WHITE_CARD = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2DDD6",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const TRUST_PILLS = [
  { label: "9 topics covered" },
  { label: "AI-powered tips" },
  { label: "Evidence-based" },
];

const MOODS = [
  { label: "Anxiety",         emoji: "😟", desc: "Calm worry and nervous tension"      },
  { label: "Depression",      emoji: "😔", desc: "Lift low mood and heaviness"          },
  { label: "Stress",          emoji: "😣", desc: "Reduce overwhelm and pressure"        },
  { label: "Loneliness",      emoji: "🫂", desc: "Build connection and belonging"       },
  { label: "Anger",           emoji: "😠", desc: "Channel and cool intense emotions"    },
  { label: "Grief",           emoji: "💙", desc: "Process loss and emotional pain"      },
  { label: "Burnout",         emoji: "😮‍💨", desc: "Recover energy and motivation"    },
  { label: "Low Self-Esteem", emoji: "🌱", desc: "Build confidence and self-worth"     },
  { label: "Overwhelm",       emoji: "🌊", desc: "Regain clarity and focus"            },
];

export default function TipsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Hero Header ── */}
        <div
          className="flex flex-col md:flex-row md:items-stretch gap-6 mb-8 pb-8"
          style={{ borderBottom: "1px solid #E2DDD6" }}
        >
          {/* Left — text */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">

            <div
              className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full w-fit"
              style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#E8521A", display: "inline-block" }} />
              <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, fontFamily: font }}>
                Wellness Library
              </span>
            </div>

            <h1
              style={{
                fontWeight: 800,
                fontSize: "clamp(22px, 5vw, 32px)",
                color: "#111111",
                fontFamily: font,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: "12px",
              }}
            >
              Tips &<br />Recovery Plans
            </h1>

            <p
              style={{
                color: "#6b7280", fontSize: "14px", fontFamily: font,
                fontWeight: 400, lineHeight: 1.65,
                maxWidth: "380px", marginBottom: "16px",
              }}
            >
              Choose a mood or mental health topic to explore personalized tips, coping strategies, and step-by-step recovery plans.
            </p>

            <div className="flex flex-wrap gap-2">
              {TRUST_PILLS.map((p) => (
                <span
                  key={p.label}
                  style={{
                    ...WHITE_CARD,
                    borderRadius: "999px",
                    padding: "5px 14px",
                    fontSize: "12px",
                    color: "#444444",
                    fontWeight: 500,
                    fontFamily: font,
                    display: "inline-block",
                  }}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <>
            <style>{`
              .hero-image-wrap {
                position: relative;
                width: 100%;
                height: 200px;
                border-radius: 16px;
                overflow: hidden;
                background-color: #1C3A2E;
                flex-shrink: 0;
              }
              @media (min-width: 768px) {
                .hero-image-wrap {
                  width: 420px;
                  height: 320px;
                }
              }
            `}</style>
            <div className="hero-image-wrap">
              <Image
                src="/images/test.png"
                alt="Wellness library illustration"
                fill
                style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.9 }}
                priority
              />
            </div>
          </>

        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => router.push(`/dashboard/tips/${encodeURIComponent(mood.label)}`)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left transition"
              style={WHITE_CARD}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#111111";
                e.currentTarget.style.backgroundColor = "#F5F0E8";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#E2DDD6";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}
              >
                {mood.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}>
                  {mood.label}
                </p>
                <p className="truncate mt-0.5" style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 400 }}>
                  {mood.desc}
                </p>
              </div>

              <ChevronRight size={13} className="shrink-0" style={{ color: "#9ca3af" }} />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}