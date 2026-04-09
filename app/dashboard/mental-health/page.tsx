"use client";

import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";

const font = "'Manrope', sans-serif";

const WHITE_CARD = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2DDD6",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const CONDITIONS = [
  { name: "Anxiety",         slug: "anxiety",         emoji: "😟", desc: "Worry, fear and nervous tension"       },
  { name: "Depression",      slug: "depression",      emoji: "😔", desc: "Low mood and emotional heaviness"      },
  { name: "Stress",          slug: "stress",          emoji: "😣", desc: "Overwhelm and tension relief"          },
  { name: "Bipolar Disorder",slug: "bipolar-disorder",emoji: "🔄", desc: "Mood swings and balance"              },
  { name: "Grief",           slug: "grief",           emoji: "💙", desc: "Processing loss and emotional pain"    },
  { name: "Anger",           slug: "anger",           emoji: "😠", desc: "Channeling intense emotions"           },
  { name: "Loneliness",      slug: "loneliness",      emoji: "🫂", desc: "Building connection and belonging"     },
  { name: "Burnout",         slug: "burnout",         emoji: "😮‍💨", desc: "Recovering energy and motivation"  },
  { name: "Low Self-Esteem", slug: "low-self-esteem", emoji: "🌱", desc: "Building confidence and self-worth"   },
  { name: "PTSD",            slug: "ptsd",            emoji: "🛡️", desc: "Grounding and trauma processing"      },
  { name: "OCD",             slug: "ocd",             emoji: "🔁", desc: "Managing intrusive thoughts"          },
  { name: "Insomnia",        slug: "insomnia",        emoji: "🌙", desc: "Sleep support and relaxation"         },
];

export default function MentalHealthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div
          className="flex items-start justify-between mb-8 pb-5"
          style={{ borderBottom: "1px solid #E2DDD6" }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              Mental Health
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "4px" }}>
              Choose a condition to get personalized support and coping tools.
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={WHITE_CARD}
          >
            <Brain size={18} style={{ color: "#111111" }} />
          </div>
        </div>

        {/* ── Conditions grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {CONDITIONS.map((c) => (
            <button
              key={c.slug}
              onClick={() => router.push(`/dashboard/mental-health/${c.slug}`)}
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
              {/* Emoji icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6" }}
              >
                {c.emoji}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate"
                  style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}
                >
                  {c.name}
                </p>
                <p
                  className="truncate mt-0.5"
                  style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 400 }}
                >
                  {c.desc}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="ml-auto shrink-0"
                width="14" height="14" viewBox="0 0 10 10" fill="none"
                style={{ color: "#9ca3af" }}
              >
                <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* ── Disclaimer — keep beige ── */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
        >
          <p
            className="text-center leading-relaxed"
            style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, fontWeight: 400 }}
          >
            ⚠️ MyMood is for self-reflection and wellness only. For serious medical concerns,
            please consult a licensed mental health professional.
          </p>
        </div>

      </div>
    </div>
  );
}