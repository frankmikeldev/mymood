"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Lightbulb, BookOpen, ChevronDown, ChevronUp, X, Play } from "lucide-react";

const font = "'Manrope', sans-serif";

type MoodContent = {
  story: string;
  storyFull: string;
  whyItHelps: string;
  whyItHelpsFull: string;
  tips: {
    title: string;
    description: string;
    action?: {
      label: string;
      type: "breathing" | "journal" | "link" | "video";
      href?: string;
    };
  }[];
  actionPlan: string[];
};

// ─── Breathing Modal ───────────────────────────────────────────────────────────
function BreathingModal({ onClose }: { onClose: () => void }) {
  const [started, setStarted] = useState(false);
  const [phase, setPhase]     = useState<"Inhale" | "Hold" | "Exhale" | "Hold ">("Inhale");
  const [count, setCount]     = useState(0);
  const [cycle, setCycle]     = useState(0);
  const TOTAL_CYCLES = 4;

  const PHASES: { label: "Inhale" | "Hold" | "Exhale" | "Hold "; duration: number }[] = [
    { label: "Inhale", duration: 4 },
    { label: "Hold",   duration: 4 },
    { label: "Exhale", duration: 4 },
    { label: "Hold ",  duration: 4 },
  ];

  const start = () => {
    setStarted(true);
    setPhase("Inhale");
    setCount(4);
    setCycle(0);
    runPhase(0, 0);
  };

  const runPhase = (phaseIndex: number, cycleNum: number) => {
    const current = PHASES[phaseIndex];
    setPhase(current.label);
    let remaining = current.duration;
    setCount(remaining);

    const tick = setInterval(() => {
      remaining--;
      setCount(remaining);
      if (remaining <= 0) {
        clearInterval(tick);
        const nextPhase = (phaseIndex + 1) % PHASES.length;
        const nextCycle = nextPhase === 0 ? cycleNum + 1 : cycleNum;
        if (nextCycle >= TOTAL_CYCLES) {
          setPhase("Inhale");
          setCount(0);
          setStarted(false);
          setCycle(TOTAL_CYCLES);
          return;
        }
        setCycle(nextCycle);
        runPhase(nextPhase, nextCycle);
      }
    }, 1000);
  };

  const isExpand = phase === "Inhale";
  const done     = !started && cycle === TOTAL_CYCLES;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ backgroundColor: "#F5F0E8", borderRadius: "24px", padding: "40px 32px", width: "100%", maxWidth: "420px", textAlign: "center", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#111111", fontFamily: font, marginBottom: "24px" }}>Breathing Exercise</h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: started ? (isExpand ? "180px" : "140px") : "160px", height: started ? (isExpand ? "180px" : "140px") : "160px", borderRadius: "50%", backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 1s ease-in-out" }}>
            {done ? (
              <span style={{ fontSize: "32px" }}>🎉</span>
            ) : (
              <div>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#111111", fontFamily: font }}>{started ? phase : "Inhale"}</p>
                {started && <p style={{ fontSize: "28px", fontWeight: 800, color: "#E8521A", fontFamily: font, marginTop: "4px" }}>{count}</p>}
              </div>
            )}
          </div>
        </div>
        {started && <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, marginBottom: "8px" }}>Cycle {cycle + 1} of {TOTAL_CYCLES}</p>}
        <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginBottom: "24px" }}>{done ? "Well done! You completed 4 cycles." : "4-7-8 breathing technique"}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i < (done ? TOTAL_CYCLES : cycle) ? "#E8521A" : "#E2DDD6", transition: "background-color 0.3s" }} />
          ))}
        </div>
        {!started && !done && (
          <button onClick={start} style={{ padding: "12px 40px", borderRadius: "100px", backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontSize: "15px", fontFamily: font, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(232,82,26,0.35)" }}>Start</button>
        )}
        {done && (
          <button onClick={onClose} style={{ padding: "12px 40px", borderRadius: "100px", backgroundColor: "#111111", color: "#ffffff", fontWeight: 700, fontSize: "15px", fontFamily: font, border: "none", cursor: "pointer" }}>Done</button>
        )}
      </div>
    </div>
  );
}

// ─── Challenge Action Plan ─────────────────────────────────────────────────────
type ChallengeState = "idle" | "active" | "complete";

function ChallengeActionPlan({
  steps,
  mood,
  onSaveToSupabase,
}: {
  steps: string[];
  mood: string;
  onSaveToSupabase?: (mood: string, stepsCompleted: number) => Promise<void>;
}) {
  const router = useRouter();
  const [state, setState]           = useState<ChallengeState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving]         = useState(false);

  const progress = state === "complete"
    ? 100
    : state === "active"
    ? Math.round(((currentStep) / steps.length) * 100)
    : 0;

  const handleStart = () => {
    setState("active");
    setCurrentStep(0);
  };

  const handleMarkDone = async () => {
    const next = currentStep + 1;
    if (next >= steps.length) {
      setState("complete");
      // save to supabase
      if (onSaveToSupabase) {
        setSaving(true);
        try { await onSaveToSupabase(mood, steps.length); } catch {}
        setSaving(false);
      }
    } else {
      setCurrentStep(next);
    }
  };

  const handleMoreChallenges = () => {
    // reload same page to get next challenge set (future: rotate sets)
    setState("idle");
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLibrary = () => {
    router.push("/dashboard/tips");
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Recommended Action Plan
        </p>
        {state === "active" && (
          <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, fontWeight: 500 }}>
            Step {currentStep + 1} of {steps.length}
          </p>
        )}
        {state === "idle" && (
          <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, fontWeight: 500 }}>
            {steps.length} steps
          </p>
        )}
        {state === "complete" && (
          <p style={{ fontSize: "12px", color: "#22c55e", fontFamily: font, fontWeight: 600 }}>
            Complete ✓
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ backgroundColor: "#E2DDD6" }}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: state === "complete" ? "#22c55e" : "#E8521A",
          }}
        />
      </div>

      {/* ── STATE: idle — show start button ── */}
      {state === "idle" && (
        <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
          <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, lineHeight: 1.65, marginBottom: "20px", maxWidth: "340px", margin: "0 auto 20px" }}>
            {steps.length} guided steps to help you today.<br />Complete one at a time, at your own pace.
          </p>
          <button
            onClick={handleStart}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#1C3A2E",
              color: "#F5F0E8",
              border: "none",
              borderRadius: "999px",
              padding: "13px 28px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: font,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#24503E")}
            onMouseLeave={e => (e.currentTarget.style.background = "#1C3A2E")}
          >
            <Play size={14} fill="#F5F0E8" />
            Start Today's Challenge
          </button>
        </div>
      )}

      {/* ── STATE: active — show one step at a time ── */}
      {state === "active" && (
        <div>
          {/* Step indicator dots */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: i < currentStep ? "#1C3A2E" : i === currentStep ? "#E8521A" : "#E2DDD6",
                  transition: "background-color 0.3s",
                }}
              />
            ))}
          </div>

          {/* Step label */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#E8521A", fontFamily: font, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
            Step {currentStep + 1} of {steps.length}
          </p>

          {/* Step text */}
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#111111", fontFamily: font, lineHeight: 1.55, marginBottom: "24px" }}>
            {steps[currentStep]}
          </p>

          {/* Mark done button */}
          <button
            onClick={handleMarkDone}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#E8521A",
              color: "#ffffff",
              border: "none",
              borderRadius: "999px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: font,
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 4px 16px rgba(232,82,26,0.25)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#D4480F")}
            onMouseLeave={e => (e.currentTarget.style.background = "#E8521A")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {currentStep === steps.length - 1 ? "Complete Challenge" : "Mark as Done"}
          </button>
        </div>
      )}

      {/* ── STATE: complete — celebration + CTAs ── */}
      {state === "complete" && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
          <p style={{ fontSize: "18px", fontWeight: 800, color: "#1C3A2E", fontFamily: font, marginBottom: "6px" }}>
            Well done! Challenge complete.
          </p>
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, lineHeight: 1.65, marginBottom: "24px" }}>
            You completed all {steps.length} steps for today's {mood} challenge.
            {saving ? " Saving your progress..." : ""}
          </p>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #E2DDD6", marginBottom: "20px" }} />

          <p style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", fontFamily: font, marginBottom: "14px" }}>
            Do you want more challenges?
          </p>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleMoreChallenges}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#E8521A",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                padding: "12px 22px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: font,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(232,82,26,0.25)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#D4480F")}
              onMouseLeave={e => (e.currentTarget.style.background = "#E8521A")}
            >
              Yes, give me more
            </button>
            <button
              onClick={handleBackToLibrary}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: "#6b7280",
                border: "1.5px solid #E2DDD6",
                borderRadius: "999px",
                padding: "11px 20px",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: font,
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#9ca3af")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2DDD6")}
            >
              Back to library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mood Content ──────────────────────────────────────────────────────────────
const MOOD_CONTENT: Record<string, MoodContent> = {
  Anxiety: {
    story:
      "Sarah used to freeze before every meeting, heart racing, palms sweating. She felt like everyone could see her panic. Over time, she learned to pause, breathe, and reframe her thoughts — and slowly, the fog of anxiety began to lift.",
    storyFull: `Sarah was 28 when the panic attacks started. It began subtly — a racing heart before a presentation, a sudden urge to cancel plans. She told herself everyone felt this way. By 30, she couldn't board a train without gripping the handrail until her knuckles turned white.

Every morning started with a mental checklist of everything that could go wrong. What if she said something stupid at the meeting? What if her boss noticed she was struggling? What if the chest tightness meant something was seriously wrong with her heart? She visited three doctors in one year. Each told her she was physically healthy. That somehow made it worse.

She stopped going to dinner parties. She declined the promotion that required traveling. She started ordering groceries online to avoid the checkout line. Her world was shrinking, and she knew it — but knowing didn't stop it.

The turning point came unexpectedly. Her sister dragged her to a breathwork class. Sarah sat in the back, arms crossed, convinced it was nonsense. But when the instructor asked them to breathe in for four counts and out for six, something shifted. Her shoulders dropped. Her jaw unclenched. For the first time in months, she felt her body as a safe place.

She started small. Five minutes of breathing every morning before her phone. A journal where she wrote down her fears and then wrote the realistic alternative next to each one. She learned about the nervous system — how anxiety is the body's alarm system stuck in the "on" position, not a sign that danger is real.

Recovery wasn't linear. There were weeks she slid back. But each time she recovered faster. Two years later, Sarah accepted a role that required monthly travel. She still feels nervous — but now she knows the difference between a feeling passing through and a life sentence.

Her advice to anyone in the thick of it: don't fight the anxiety. Get curious about it. Ask it what it's protecting you from. The answer, she says, is always worth knowing.`,
    whyItHelps:
      "Anxiety isn't a character flaw — it's an overactive alarm system. Sarah's story shows that avoidance feels like relief but quietly shrinks your world. The real shift came not from fighting anxiety, but from getting curious about it.",
    whyItHelpsFull: `Sarah's story teaches us that anxiety isn't a character flaw or a sign of weakness — it's an overactive alarm system, and alarm systems can be recalibrated.

What her journey shows is that avoidance, while it feels like relief in the moment, quietly shrinks your world. Every meeting she skipped, every plan she cancelled, every promotion she declined felt like safety — but it was actually the anxiety winning ground. The turning point wasn't a dramatic cure. It was one breathwork class, one shifted shoulder, one unclenched jaw.

The science behind this is real: when you breathe slowly and deliberately, you activate the parasympathetic nervous system — the body's "rest and digest" mode — which directly counters the fight-or-flight response anxiety triggers. That's not a wellness trend. That's physiology.

What Sarah's story teaches you specifically is this: you don't have to fight your anxiety to recover from it. Fighting it gives it more energy. Instead, get curious. Notice it. Name it. Ask what it's trying to protect you from. The answer is almost always something worth knowing — a boundary that needs setting, a fear that needs examining, a belief that needs updating.

The practical steps that helped Sarah — morning breathing, written fear challenges, gradual exposure — work because they retrain the brain through repetition. Every time you face a feared situation and survive it, you write new evidence over the old story. Slowly, the story changes.

If you're in the thick of anxiety right now, the most important thing her story offers is proof that the fog lifts. Not all at once. But it lifts.`,
    tips: [
      {
        title: "Box Breathing",
        description: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times to calm your nervous system instantly.",
        action: { label: "Try the exercise", type: "breathing" },
      },
      {
        title: "Name Your Fear",
        description: "Write down exactly what you're anxious about. Giving it a name reduces its power over your mind.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Limit Caffeine",
        description: "Caffeine amplifies anxiety symptoms. Try switching to herbal tea in the afternoon and notice the difference.",
        action: { label: "See herbal tea suggestions", type: "link", href: "/dashboard/tips/herbal-tea" },
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Tense and release each muscle group from your feet upward to release physical tension stored in your body.",
        action: { label: "Watch tutorial", type: "video", href: "/dashboard/tips/pmr-tutorial" },
      },
    ],
    actionPlan: [
      "Morning: 5-minute breathing exercise before checking your phone",
      "Midday: Write one worry down and challenge it with a realistic alternative",
      "Evening: No screens 30 minutes before bed — read or stretch instead",
      "Weekly: Identify one avoided situation and take one small step toward it",
    ],
  },
  Depression: {
    story:
      "Marcus spent months barely getting out of bed. Everything felt grey and pointless. His turning point was committing to just one tiny action each day — a short walk, a phone call. Those small wins slowly rebuilt his sense of self.",
    storyFull: `Marcus was the kind of person who always had a plan. Five-year goals, morning routines, color-coded calendars. So when the heaviness arrived, he didn't recognize it for what it was. He thought he was just tired. Tired turned into exhausted. Exhausted turned into something he had no word for.

Getting out of bed felt like climbing a mountain with no summit. He'd lie there for hours, not sleeping, not thinking — just existing in a gray static. Food lost its taste. Music he'd loved for years felt like noise. His friends noticed he'd gone quiet. He told them he was busy.

The worst part, he said later, wasn't the sadness. It was the numbness. At least sadness means you can feel something. This was like being wrapped in cotton — cut off from everything, including himself.

His sister came to visit and found the apartment dark at 2pm, dishes piled up, Marcus in the same clothes he'd worn three days before. She didn't lecture him. She just sat down next to him and said, "We're going for a walk. Just to the end of the street. That's all."

He went. It was hard. It felt pointless. But they walked to the end of the street.

His therapist later called it behavioral activation — doing before feeling, not waiting until you feel ready because with depression, ready never comes. Marcus started with one task a day. Not a productive task. Just a human one. He made his bed. He texted a friend. He sat in the sun for ten minutes.

Weeks passed. The cotton started to thin. Color came back slowly, the way dawn comes — barely noticeable until suddenly it isn't dark anymore.

Marcus now volunteers at a men's mental health group. He tells them the same thing his sister told him: just to the end of the street. That's all. Start there.`,
    whyItHelps:
      "Depression removes the motivation you need to recover from it. Marcus's story shows that action doesn't follow feeling — it creates it. One small step, taken before you feel ready, is how the cycle breaks.",
    whyItHelpsFull: `Marcus's story is about the particular cruelty of depression: it removes the very motivation you need to recover from it. You can't "just get up" when getting up feels impossible. Telling someone with depression to think positively is like telling someone with a broken leg to walk it off.

What his story teaches is the concept of behavioral activation — one of the most evidence-backed approaches to depression that exists. The brain, when depressed, has reduced dopamine and serotonin activity. It stops signaling reward, which is why nothing feels worth doing. Behavioral activation works by doing anyway. Not because you feel like it, but because action — any action — begins to restart the reward circuit. Motion creates emotion, not the other way around.

Marcus's sister didn't try to fix him. She didn't give him a pep talk or a reading list. She gave him one step: to the end of the street. That's the correct scale when someone is at the bottom. Not "turn your life around." Just the street.

What this means for you is that the task is never as big as depression makes it feel. Depression catastrophizes effort. A shower feels like a marathon. An email feels like a thesis. The truth is that once you start — once you take the first physical action — the next one becomes marginally easier. The momentum is real, even when it's invisible.

The other thing Marcus's story teaches is that shame is depression's accomplice. The dark apartment, the same clothes, the deflecting friends — shame kept him isolated, and isolation kept him depressed. Letting one person in broke the circuit.

You don't need to be fixed to be helped. You just need to get to the end of the street.`,
    tips: [
      {
        title: "Behavioral Activation",
        description: "Schedule one enjoyable or meaningful activity daily, even if small. Action comes before motivation, not after.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Sunlight Exposure",
        description: "Get outside within an hour of waking. Natural light boosts serotonin and helps regulate your sleep-wake cycle.",
        action: { label: "Watch tutorial", type: "video", href: "/dashboard/tips/sunlight-tutorial" },
      },
      {
        title: "Reach Out to One Person",
        description: "Isolation worsens depression. Send one text or make one call — connection is medicine.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Track Small Wins",
        description: "Write down 3 things you did today, no matter how minor. This trains your brain to notice progress.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "Morning: Get dressed and step outside for at least 10 minutes",
      "Midday: Eat a nourishing meal and drink water — basic care matters",
      "Afternoon: Do one task from your to-do list, however small",
      "Evening: Write 3 things that existed today, even neutral ones",
    ],
  },
  Stress: {
    story:
      "Aisha was juggling work deadlines, family duties, and no time for herself. She was snapping at everyone she loved. When she started blocking just 20 minutes a day as her own, her ability to cope with everything else transformed.",
    storyFull: `Aisha hadn't taken a full breath in what felt like years. Between the project deadlines, school pickups, ageing parents, and a partner who meant well but didn't quite see the invisible load she was carrying — her life had become a constant sprint with no finish line.

She was efficient. Everyone said so. "I don't know how you do it," colleagues told her, and she smiled because she didn't know how to say: I don't do it, I just haven't collapsed yet.

The snapping started small. A sharp word to her daughter over spilled juice. A cold silence after her partner forgot to call. She'd feel guilt immediately — hot and heavy — which added to the pile. She was stressed about being stressed.

Her breaking point was a Tuesday afternoon in the office bathroom. She sat on the lid of the toilet for eleven minutes, unable to go back out. Not crying. Not thinking. Just — stopped. Like a machine that had finally overheated.

Her doctor suggested therapy. Aisha laughed. "I don't have time for therapy." Her doctor looked at her and said, "That's exactly why you need it."

She couldn't commit to weekly sessions, so she started with one change: 20 minutes every morning that belonged to no one but her. Before the kids woke up. Before her phone. Before the day could claim her. She made tea. She sat by the window. Sometimes she wrote. Sometimes she just watched the garden.

It seemed too small to matter. It mattered enormously.

Those 20 minutes became a psychological anchor. They reminded her that she existed as a person, not just a function. From that base, she could negotiate workloads more clearly, say no with less guilt, and notice her body's stress signals before they escalated.

She still gets overwhelmed. The difference now is she catches it — and she has a place to return to.`,
    whyItHelps:
      "Aisha's story shows the difference between endurance and sustainability. She was performing coping while quietly running out of fuel. Twenty minutes of protected time reminded her she was a person, not just a function — and that changed everything.",
    whyItHelpsFull: `Aisha's story is a portrait of what happens when high competence becomes a trap. She was capable of carrying everything, so she was never asked to put any of it down. The people around her saw someone who was coping. She was not coping. She was performing coping while quietly running out of fuel.

What her story teaches is the difference between endurance and sustainability. Endurance is pushing through. Sustainability is building a life that doesn't require constant pushing. Aisha had mastered endurance. She had never been taught sustainability.

The physiological reality of chronic stress is serious: elevated cortisol over long periods disrupts sleep architecture, impairs memory consolidation, weakens immune function, and increases inflammation. Your body was designed for short bursts of stress followed by recovery — not a continuous low-grade emergency. When recovery never comes, the system begins to degrade.

What changed everything for Aisha wasn't a productivity system or a new time management method. It was 20 minutes of ownership. Time that answered to no one. That might sound small, but psychologically it's enormous — it represents the difference between being an agent in your own life and being a resource in everyone else's.

Her story teaches you that rest is not a reward for finishing. It's a prerequisite for continuing. The people who protect their recovery time aren't less productive — research consistently shows they're more focused, more creative, and more resilient than those who don't.

The invitation from Aisha's story is to find your 20 minutes. Not to optimize them. Not to make them productive. Just to let them belong to you.`,
    tips: [
      {
        title: "The 2-Minute Rule",
        description: "If a task takes less than 2 minutes, do it now. Clearing small tasks reduces mental clutter significantly.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Prioritize Ruthlessly",
        description: "List your tasks and mark only 3 as truly important today. Everything else is secondary.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Body Scan Meditation",
        description: "Spend 5 minutes scanning your body from head to toe, noticing where you hold tension and consciously releasing it.",
        action: { label: "Watch tutorial", type: "video", href: "/dashboard/tips/body-scan-tutorial" },
      },
      {
        title: "Set a Worry Window",
        description: "Designate 15 minutes per day to worry. Outside that window, postpone stress thoughts until your next session.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "Morning: Write your top 3 priorities before opening any apps",
      "Midday: Take a real lunch break — away from your desk",
      "Afternoon: 5-minute body scan or walk when energy dips",
      "Evening: Review what you accomplished, not what you didn't finish",
    ],
  },
  Loneliness: {
    story:
      "After moving to a new city, James ate alone every night and felt invisible. He started volunteering on weekends — not to make friends, just to be around people with purpose. Slowly, genuine connections formed naturally.",
    storyFull: `James moved to the city at 32 with a job offer and a suitcase. He was excited for exactly three weeks. Then the evenings started.

After work, the apartment was silent in a way his hometown never was. He'd eat dinner standing at the kitchen counter, scrolling his phone, watching other people's lives flicker past. He knew logically that social media wasn't real. Emotionally, every photo of a crowded table felt like a personal verdict.

He tried. He went to a work happy hour and stood at the edge of conversations, laughing slightly too late at the jokes. He downloaded three different social apps and deleted them within a week. He called his mother every day, sometimes twice, which worried her.

The thing about loneliness that nobody talks about, James said later, is that it doesn't just feel sad. It feels shameful. Like there's something wrong with you that other people can see. Like you've been quietly disqualified from belonging.

A coworker mentioned a community garden on Saturdays. James dismissed it for a month. Then one grey October morning, with nothing else to fill the day, he went.

He didn't make friends that day. He just dug in dirt next to a retired teacher named Gloria who talked continuously about tomatoes. He went back the next week. And the next. Gloria introduced him to the others. The others became familiar. Familiar became something he looked forward to.

Connection, James learned, doesn't arrive. It accumulates. It's built in small repeated moments of showing up — not performing, just being present alongside other people who are also just trying to fill their Saturdays with something real.

He still has lonely evenings. But they feel different now. Less like exile, more like intermission.`,
    whyItHelps:
      "James's story reveals that loneliness isn't usually about lacking social skills — it's about lacking repeated, low-pressure proximity to others. Connection doesn't arrive dramatically. It accumulates, quietly, through showing up.",
    whyItHelpsFull: `James's story carries an insight that most people who are lonely never hear: the problem usually isn't a lack of social skill or likeability. It's a lack of repeated, low-stakes proximity to others over time. That's it. That's often the whole thing.

We've been sold a narrative that connection happens through grand gestures — meaningful conversations, instant chemistry, "finding your people." For most people, connection happens the way James found it: through Gloria talking about tomatoes on a Saturday morning, week after week, until familiarity became fondness.

Research in social psychology consistently shows that the primary driver of friendship formation is proximity plus repetition. You become friends with people you keep showing up near. Not because you performed well or said the right things. Just because you were there, reliably, over time.

What his story also teaches is that loneliness carries a shame payload that makes recovery harder. If you feel like your loneliness means something is wrong with you, you're less likely to take the social risks that could end it. The shame is the cage. Recognizing that loneliness is a universal human signal — not a personal verdict — is the first step to moving through it.

James didn't go to the garden to make friends. He went because it was Saturday and he had nothing else. That low-stakes entry point is crucial. High-pressure social situations amplify the fear of rejection. Low-pressure, purpose-driven environments — a class, a volunteer group, a shared hobby — take the performance anxiety out of the equation.

His story tells you: don't wait until you feel ready to connect. Show up somewhere, regularly, without an agenda. Let time do the rest.`,
    tips: [
      {
        title: "Join a Group Activity",
        description: "Find a class, club, or volunteer group around an interest. Shared activities create natural conversation and connection.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Deepen Existing Ties",
        description: "Reach out to someone you've lost touch with. A simple 'thinking of you' message can restart meaningful relationships.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Be Present in Public",
        description: "Visit a café or park without headphones. Simply being open to the world around you invites small moments of connection.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Practice Self-Compassion",
        description: "Loneliness often comes with shame. Remind yourself it's a universal human experience, not a personal failing.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "This week: Send one message to someone you haven't spoken to in a while",
      "This week: Find one local or online group that shares your interests",
      "Daily: Smile and make brief eye contact with people around you",
      "Monthly: Commit to one recurring social activity, even digitally",
    ],
  },
  Anger: {
    story:
      "David used to explode over small things and then spend days feeling guilty. Learning to notice the physical signs of anger — the heat, the clenched jaw — before reacting gave him a pause that changed everything.",
    storyFull: `David's father had a temper. His grandfather too, apparently. In his family, anger was weather — it arrived without warning, everyone adjusted, and nobody talked about it afterward. David grew up thinking this was simply how men were built.

His wife was the first person to say it plainly: "Your anger is scaring me." They'd been married four years. He stood in the kitchen after she said it, stunned — not because it wasn't true, but because someone had finally named it.

He wasn't violent. He'd never broken anything, never raised a hand. But the volume, the door-slamming, the cold silence that lasted days — it had weight. It took up space in their home. Their daughter had started flinching at loud sounds.

David agreed to see a therapist because his marriage was on the line. He sat in the first session convinced he was there to explain himself, to contextualize the anger. Instead, the therapist asked: "Where do you feel it in your body before it comes out?"

He'd never thought about it that way. He started paying attention. The jaw, he noticed first. Then the heat up the back of his neck. Then the shortening breath. These were signals — early warning signs that arrived a full thirty seconds before the eruption. Thirty seconds was enough.

He practiced the pause. Not suppression — he'd been taught that anger denied becomes anger multiplied. Just a pause. A step back. A breath. The question: "What do I actually need right now?"

Often the answer was recognition. Often it was rest. Rarely was it what he was about to say.

Two years on, David coaches junior managers on communication. He tells them the pause isn't weakness. The pause is the most powerful thing he ever learned.`,
    whyItHelps:
      "Anger is a signal, not a problem. David's story shows it usually points to unmet needs beneath the surface. Learning to catch the body's early cues — before the explosion — creates a pause that turns reaction into response.",
    whyItHelpsFull: `David's story dismantles a myth most of us grew up with: that anger is either unleashed or suppressed. Explode or bury it. His story — and the research — shows there's a third path: understand it and direct it.

Anger is the most misunderstood emotion because it's loud. It draws attention to itself and away from what it's actually about. David's outbursts weren't really about the things that triggered them. They were about unmet needs, accumulated pressure, and a lifelong absence of any model for processing strong emotion. The anger was the symptom. The cause was underneath.

What neuroscience tells us is that the "amygdala hijack" — the moment anger takes over before rational thought can intervene — happens in milliseconds. The prefrontal cortex, which handles judgment and consequence-awareness, gets bypassed. That's why people say things in anger they immediately regret: literally, the thinking part of the brain wasn't running the show.

The pause that David's therapist taught him works by inserting enough time for the prefrontal cortex to come back online. Ten seconds is often enough. In those ten seconds, you move from reaction to response — from the anger driving to you driving with the anger in the passenger seat.

His story also teaches something important about the body's role. Anger is physiological — adrenaline, elevated heart rate, muscle tension. Talking about it while still physiologically activated is often counterproductive. Physical movement — a walk, exercise, even cold water on the face — helps metabolize the chemistry before the conversation happens.

Most importantly: David's daughter stopped flinching. That's the real measure. Anger managed well doesn't damage the people you love.`,
    tips: [
      {
        title: "Spot the Physical Cues",
        description: "Notice where anger lives in your body — tight chest, clenched jaw, heat. Early awareness gives you time to respond instead of react.",
        action: { label: "Try breathing exercise", type: "breathing" },
      },
      {
        title: "The 10-Second Pause",
        description: "Before responding when angry, count slowly to 10. This simple gap engages your rational brain and prevents regrettable reactions.",
        action: { label: "Try breathing exercise", type: "breathing" },
      },
      {
        title: "Identify the Need",
        description: "Ask yourself: what boundary was crossed or what need isn't being met? Anger usually protects something important.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Physical Release",
        description: "Exercise, punch a pillow, or go for a fast walk. Physical movement processes the adrenaline behind anger safely.",
        action: { label: "Watch tutorial", type: "video", href: "/dashboard/tips/anger-release-tutorial" },
      },
    ],
    actionPlan: [
      "Daily: Notice 3 moments when irritation starts and name the trigger",
      "Weekly: Journal about one anger moment — what happened, what you needed",
      "Practice: Use 'I feel...' statements instead of blame in conflicts",
      "Long-term: Consider therapy if anger patterns are affecting relationships",
    ],
  },
  Grief: {
    story:
      "After losing her mother, Nina found herself laughing at something and then drowning in guilt for it. A grief counselor helped her understand that joy and grief can coexist — that healing isn't forgetting, it's learning to carry love differently.",
    storyFull: `Nina's mother died on a Wednesday in March, just after the cherry trees bloomed. She'd been sick for two years, so everyone said Nina was "prepared." Nina nodded and accepted the casseroles. She did not feel prepared. She felt like the floor had been removed.

Grief, she discovered, doesn't behave. It doesn't follow the stages she'd read about in the waiting rooms of hospitals. It arrived sideways — in the cereal aisle at the supermarket, in the particular way afternoon light hit the kitchen table, in the absent habit of reaching for her phone to call someone who no longer had a phone to answer.

Four months after the funeral, Nina laughed — genuinely, helplessly laughed — at a video her friend sent. And then felt a wave of shame so physical it took her breath away. How could she laugh? What kind of daughter laughed?

Her grief counselor, a quiet woman named Dr. Reyes, asked her to describe her mother. Nina talked for forty minutes without stopping — the stories, the smell of her perfume, the way she mispronounced certain words her whole life and refused to be corrected. Dr. Reyes listened and then said: "That laugh was hers too, in a way. She gave you the capacity for joy. Using it isn't betrayal. It's inheritance."

Nina held that thought for a long time.

Grief, she came to understand, is not a problem to solve. It's a presence to integrate. Her mother didn't disappear from her life — she changed form. She became the cherry trees in March, the careful way Nina now folds towels (just like she was taught), the voice in her head that says "wear the good coat, you never know."

On the first anniversary, Nina planted a tree in her garden. She cried the whole time. She also hummed her mother's favorite song. Both felt right.`,
    whyItHelps:
      "Nina's story shows that grief has no deadline and no correct form. Joy doesn't betray loss — it coexists with it. Healing isn't about moving on. It's about finding new ways to carry love forward.",
    whyItHelpsFull: `Nina's story teaches something that our culture is deeply uncomfortable with: grief doesn't end, and it's not supposed to. The goal of grieving is not to get over the loss. It's to integrate it — to carry it in a way that allows you to also carry a life.

We live in a culture that gives people three to five business days for bereavement and then expects them to function. This is not based on how grief works. It's based on how productivity works. The two are not the same, and confusing them causes enormous suffering.

What grief counseling and research have established is that grief moves in waves, not stages. The "five stages" model was never meant to be a sequential checklist — its author said so explicitly. You don't move from denial to acceptance like levels in a game. You move between all of them, sometimes in the same afternoon, sometimes in the same hour.

Nina's guilt at laughing is one of the most common grief experiences, and one of the least talked about. Joy doesn't betray grief. Joy and grief are not opposites. They are both expressions of love — one for what was, one for what still is. Learning to hold both without letting either cancel the other out is the real work.

What her story teaches you practically is the power of continuing bonds — the psychological concept that healthy grieving doesn't require detaching from the person you've lost, but rather finding new ways to maintain connection. Planting a tree. Cooking their recipe. Passing down their way of folding towels. These aren't signs of being "stuck." They're signs of love finding a new form.

If you're grieving, her story offers this: you don't have to choose between honoring your loss and continuing to live. Both are acts of love. Both are allowed.`,
    tips: [
      {
        title: "Let Grief Move Through You",
        description: "Don't rush or suppress grief. Set aside time to feel it fully — cry, remember, honor. Suppression prolongs it.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Create a Ritual",
        description: "Light a candle, visit a place, or write a letter on special dates. Rituals give grief a container and honor what was lost.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Talk About Them",
        description: "Share memories of who or what you lost. Speaking their name keeps connection alive and eases the loneliness of grief.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Be Patient With Yourself",
        description: "Grief can resurface for years. This isn't failure — it's love. Treat each wave with the same compassion you'd offer a friend.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "Daily: Allow yourself one moment to feel without judgment",
      "Weekly: Write a memory or letter to who or what you've lost",
      "Monthly: Do something that honors them or brings you meaning",
      "When ready: Consider a grief support group or counselor",
    ],
  },
  Burnout: {
    story:
      "Priya was the highest performer on her team and the first to break. She hadn't taken a real day off in two years. Recovery began not with productivity hacks, but with radical permission to do nothing — and mean it.",
    storyFull: `Priya's calendar was a mosaic of back-to-back blocks. She was proud of it. Productivity was her identity — the girl who stayed late, the one who always delivered, the person the team turned to when something was truly urgent.

She didn't notice the burnout arriving because it arrived disguised as fatigue, and fatigue was normal. Of course she was tired. Tired people push through. That's what you do.

The morning she couldn't get out of the car in the office parking lot was the morning she finally admitted something was wrong. She sat there for twenty-five minutes, engine off, unable to open the door. Not because she was sad. Not because something specific had happened. She was simply... empty. Like a phone that shows fully charged but dies the moment you open an app.

Her manager suggested leave. Priya's first instinct was to negotiate it down to a long weekend. Her therapist, when she finally saw one, asked a question that stopped her cold: "What do you enjoy — not for what it produces, just for itself?"

She couldn't answer. She tried to think of hobbies and realized everything she did was optimized. She ran to hit targets. She read to learn. She cooked to meal prep. There was nothing she did purely for the pleasure of it.

Recovery started there — not with sleep, not with supplements, but with learning to exist without output. She sat in the garden and did nothing. It was excruciating at first. Then gradually less so. She started painting — terribly, without any intention of improving. She began to remember that she was a person, not a function.

Returning to work, she renegotiated her role. Boundaries that once felt selfish began to feel like maintenance. She started leaving on time. The team survived. She survived, better.

Burnout, she says now, was the most expensive lesson she ever learned. Also, in some ways, the most valuable.`,
    whyItHelps:
      "Priya's story shows that burnout isn't laziness — it's what happens when competence becomes a trap. Recovery required not better productivity habits, but permission to simply exist without producing anything at all.",
    whyItHelpsFull: `Priya's story exposes the particular trap of high performers: competence becomes a liability. The more reliably you deliver, the more is placed on your plate, until the plate breaks — and because you've always delivered, no one saw it coming. Including you.

Burnout is now recognized by the World Health Organization as an occupational phenomenon characterized by three dimensions: exhaustion, cynicism toward your work, and a reduced sense of professional efficacy. It is not weakness. It is not a mood. It is a physiological and psychological state that requires genuine recovery — not a long weekend, not a vacation you spend anxious about returning.

What Priya's story teaches is that burnout strips you of your identity beyond performance. She couldn't answer what she enjoyed because everything had been instrumentalized. This is one of burnout's most insidious effects: it colonizes your inner life. Even rest becomes a performance — are you recovering efficiently? Is this the optimal recovery activity?

The antidote, as her story shows, is not more productivity. It's purposeless joy. Doing something badly, without goals, without tracking. Painting terribly. Walking without a destination. This isn't indulgence — it's the reactivation of the neural pathways associated with intrinsic motivation, which burnout suppresses.

Her story also teaches the importance of systems-level change, not just individual coping. She didn't just recover and return to the same conditions. She renegotiated her role. Burnout that isn't addressed structurally tends to recur. Individual resilience is necessary but not sufficient — the environment has to change too.

What you can take from Priya is this: recovery requires permission. Permission to be unproductive. Permission to be a person, not a function. That permission may have to come from you first, before anyone else offers it.`,
    tips: [
      {
        title: "Audit Your Energy Drains",
        description: "List everything draining you — tasks, people, habits. Identify what you can eliminate, delegate, or reduce right now.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Protect Non-Negotiable Rest",
        description: "Block time in your calendar for rest the same way you schedule meetings. Rest is productive — it's where recovery happens.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Reconnect With Joy",
        description: "Do one thing purely for enjoyment this week, with no productivity goal. Burnout disconnects you from what makes life worth living.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Set Micro-Boundaries",
        description: "Start with one small boundary: no emails after 8pm, one lunch break per day. Small limits rebuild your sense of agency.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "This week: Identify and remove or reduce your top energy drain",
      "Daily: Take at least one full break where you're not consuming content",
      "Weekly: Do one activity that has nothing to do with work or productivity",
      "Long-term: Reassess your workload and have an honest conversation about capacity",
    ],
  },
  "Low Self-Esteem": {
    story:
      "Every compliment Zoe received, she deflected. She was convinced she wasn't good enough. The shift came when a therapist asked her to treat herself with the same kindness she gave her best friend — and she realized she never had.",
    storyFull: `Zoe could tell you exactly what was wrong with her. The list was long, detailed, and immediately accessible — as if she kept it pinned to the front of her mind at all times. Too loud. Not smart enough for the room. Too much, yet somehow never enough.

She was likeable. Everyone said so. Good at her job, funny at dinner parties, the person friends called when they needed honest advice. She gave that advice generously, warmly, without judgment. She could not give the same to herself.

Compliments slid off her like water. "You did so well in that presentation." — "I just got lucky." "You look great." — "I've been meaning to lose weight." She had a deflection for everything. Receiving goodness felt dangerous, like standing in a door frame during an earthquake — the structure might not hold.

The origin, she found in therapy, wasn't mysterious. A critical parent. A school environment that ranked and sorted children by visible performance. Years of absorbing the message that worth was conditional — earned through achievement, appearance, usefulness.

Her therapist, on an ordinary Tuesday, asked: "If your best friend spoke to herself the way you speak to yourself, what would you say to her?" Zoe started to answer and then stopped. She felt something crack open — not painfully, but the way a window opens to let in air.

She would never speak to her friend that way. Not in a million years.

The work was slow. It involved catching the critical voice mid-sentence and asking, "Is this true? Is this kind? Is this necessary?" It involved writing down evidence that contradicted the narrative. It involved doing things she was afraid of and surviving them.

Zoe still has hard days. The inner critic still shows up. But now she recognizes it as a voice, not the truth — and she knows she doesn't have to believe everything she thinks.`,
    whyItHelps:
      "Zoe's story shows that low self-esteem isn't a realistic self-assessment — it's a rigged filter. Compliments bounced off while criticism stuck. The work wasn't positive thinking. It was catching the inner critic and asking: would I say this to someone I love?",
    whyItHelpsFull: `Zoe's story illustrates one of the most painful paradoxes of low self-esteem: you can be genuinely loved, visibly capable, and objectively doing well — and still be convinced, in a very private part of yourself, that you are not enough.

Low self-esteem is rarely about a realistic assessment of your qualities. It's about an internalized narrative — often built in childhood, often reinforced by systems that conditioned worth on performance, appearance, or compliance — that filters out confirming evidence and amplifies disconfirming evidence. Compliments bounce off. Criticism sticks. The ledger is rigged.

What cognitive behavioral research consistently shows is that self-esteem is not a fixed trait. It's a cognitive habit. And habits can be changed through systematic, repeated practice. Not through affirmations or positive thinking — those rarely work on deep-seated beliefs because the brain knows when it doesn't believe what it's saying. Through evidence-gathering. Through behavior that contradicts the belief. Through the accumulation of experiences the old story cannot explain away.

Zoe's therapist used a classic and powerful intervention: the compassionate observer. If you wouldn't speak to your best friend the way you speak to yourself, you have identified a double standard that is costing you enormously. The work is to close that gap — not by lowering your standards for others, but by raising your standards for how you treat yourself.

Her story also teaches something important about the origin of the inner critic. It usually isn't your voice. It's an internalized voice — a parent, a teacher, a culture — that you've been carrying so long it feels like yours. Part of recovery is recognizing: this is not me. This is a voice I learned. I can learn a different one.

You are not a project to be fixed. You are a person learning to see yourself more honestly. That process takes time, and it is worth every bit of it.`,
    tips: [
      {
        title: "Challenge the Inner Critic",
        description: "When a self-critical thought appears, ask: 'Would I say this to a friend?' If not, rewrite it as you would for someone you love.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Evidence Journal",
        description: "Write down 3 things you handled well each day. Over time, this builds an evidence base that contradicts the narrative of inadequacy.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Stop Comparing Timelines",
        description: "Social comparison is self-esteem's enemy. Your path is your own. Unfollow accounts that make you feel lesser.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Do Things You're Good At",
        description: "Regularly engaging in activities where you have competence rebuilds confidence through experience, not just affirmation.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "Daily: Write 3 things you did well — however small",
      "Weekly: Do one thing outside your comfort zone and reflect on it",
      "Practice: Replace 'I'm bad at this' with 'I'm still learning this'",
      "Long-term: Consider CBT or therapy to address deep-rooted beliefs",
    ],
  },
  Overwhelm: {
    story:
      "Tom had 47 browser tabs open — literally and mentally. He couldn't start anything because everything felt equally urgent. His breakthrough was a simple rule: close all tabs, write one thing, do that one thing first.",
    storyFull: `Tom's to-do list had a to-do list. He tracked tasks in three apps, two notebooks, and a system of colored sticky notes that had long since lost their meaning. The irony was not lost on him: he was so organized about his disorganization that he'd built a second job out of managing the anxiety of the first.

Every morning he'd open his laptop and feel the familiar drop in his stomach. Everything was urgent. Everything was connected to everything else. Starting anything meant not starting something else, which meant falling behind, which meant— and there the spiral began.

He missed two deadlines in one month. Both for small things. The smallness made it worse. If he couldn't manage the small things, what did that say about him?

His wife noticed he'd started sleeping badly, finishing other people's sentences with the wrong words, forgetting things he'd known for years. She told him he looked like a computer running too many programs at once.

That image stayed with him.

He took a Saturday and did something that felt radical: he wrote every single open task, worry, commitment, and half-formed idea onto individual pieces of paper and spread them on the floor. His entire mental load, externalized. It covered most of the living room.

He stood in the middle of it and, for the first time in months, felt something other than panic. He felt the problem had edges. It was large, but it was finite. It could be sorted.

He spent the day organizing — not everything, just into piles: urgent, important, someday, not mine to carry. The "not mine to carry" pile was the largest. He photographed it, then threw it away.

The following Monday, he opened one app. He wrote one task. He did that task first.

Overwhelm, he realized, had convinced him that everything was equally heavy. The work was learning to weigh things honestly — and to put most of them down.`,
    whyItHelps:
      "Tom's story shows that overwhelm isn't really about having too much to do — it's about the brain trying to hold everything at once. Externalizing the load, then honestly weighing it, reveals that most of it was never as urgent or even as yours as it felt.",
    whyItHelpsFull: `Tom's story captures something that most advice about overwhelm misses: the problem is rarely that you have too much to do. It's that everything feels equally urgent, which means your brain can't prioritize, which means it can't start, which means everything piles higher, which means it feels even more urgent. The spiral is the problem, not the workload.

Cognitive load theory explains this well: the working memory — the part of your brain that actively processes information — has a very limited capacity. When you try to hold too many open tasks in your head simultaneously, you exceed that capacity. The result isn't just inefficiency. It's a kind of mental paralysis where starting anything feels like the wrong choice because you should be starting something else.

The solution Tom found — the physical brain dump — works because it externalizes the cognitive load. Once it's on paper, your brain doesn't have to keep holding it. This is why writing things down genuinely reduces anxiety, not just organizationally, but neurologically. The open loops are closed (or at least contained).

What his story also teaches is the importance of honest prioritization. Everything on Tom's list was "urgent" until he examined it closely. The "not mine to carry" pile — his largest — is revelatory. Overwhelm is frequently inflated by tasks that were never really yours, obligations that were assumed rather than chosen, and standards that nobody but you is holding you to.

The one-task rule he adopted isn't about productivity. It's about cognitive mercy. When the brain has one clear target, it can focus. When it has forty equal targets, it freezes. Giving yourself permission to do one thing and consider that enough for the moment is not lowering your standards. It's working with your neurology instead of against it.

Tom's story tells you: the pile has edges. It is survivable. Start with the paper.`,
    tips: [
      {
        title: "Brain Dump Everything",
        description: "Write every task, worry, and obligation on paper. Getting it out of your head and onto a page immediately reduces cognitive overwhelm.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Pick Just One Thing",
        description: "From your list, choose the single most important or urgent item. Do only that until it's done or you've made meaningful progress.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Time-Block Your Day",
        description: "Assign tasks to specific time slots rather than keeping a floating to-do list. Structure reduces the anxiety of 'I should be doing something.'",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
      {
        title: "Say No to One Thing",
        description: "Overwhelm is often a capacity problem. Identify one commitment you can decline, postpone, or delegate this week.",
        action: { label: "Write in Journal", type: "journal", href: "/dashboard/journal" },
      },
    ],
    actionPlan: [
      "Morning: Brain dump everything on your mind before starting work",
      "Daily: Choose your ONE most important task and do it first",
      "Weekly: Review and cut anything that doesn't truly need to be on your list",
      "Practice: End each day by writing tomorrow's top 3 — close the mental tabs",
    ],
  },
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MoodTipsPage() {
  const { mood }    = useParams();
  const router      = useRouter();
  const decodedMood = decodeURIComponent(mood as string);
  const content     = MOOD_CONTENT[decodedMood];

  const [storyExpanded, setStoryExpanded] = useState(false);
  const [whyExpanded,   setWhyExpanded]   = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);

  const handleTipAction = (tip: MoodContent["tips"][0]) => {
    if (!tip.action) return;
    if (tip.action.type === "breathing") { setBreathingOpen(true); return; }
    if (tip.action.href) router.push(tip.action.href);
  };

  // placeholder — wire up real Supabase call here
  const handleSaveChallenge = async (mood: string, stepsCompleted: number) => {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("challenge_completions").insert([{
        user_id: user.id,
        mood,
        steps_completed: stepsCompleted,
        completed_at: new Date().toISOString(),
      }]);
    } catch (err) {
      console.error("Failed to save challenge:", err);
    }
  };

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p style={{ fontSize: "15px", color: "#6b7280", fontFamily: font }}>
          No content found for "{decodedMood}".
        </p>
      </div>
    );
  }

  return (
    <>
      {breathingOpen && <BreathingModal onClose={() => setBreathingOpen(false)} />}

      <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
        <div className="max-w-3xl mx-auto space-y-5">

          {/* ── Header ── */}
          <div className="flex items-start justify-between pb-5" style={{ borderBottom: "1px solid #E2DDD6" }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
                {decodedMood} Support Guide
              </h1>
              <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "4px" }}>
                Personalized support, practical steps and gentle guidance.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}>
              <Lightbulb size={18} style={{ color: "#111111" }} />
            </div>
          </div>

          {/* ── Story ── */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={14} style={{ color: "#9ca3af" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                A Short Story
              </p>
            </div>
            {!storyExpanded ? (
              <>
                <p style={{ fontSize: "15px", fontWeight: 400, color: "#444444", fontFamily: font, lineHeight: 1.8 }}>{content.story}</p>
                <button onClick={() => setStoryExpanded(true)} className="mt-4 flex items-center gap-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#E8521A", fontFamily: font, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Read full story <ChevronDown size={14} />
                </button>
              </>
            ) : (
              <>
                {content.storyFull.split("\n\n").map((p, i) => (
                  <p key={i} style={{ fontSize: "15px", fontWeight: 400, color: "#444444", fontFamily: font, lineHeight: 1.8, marginBottom: "16px" }}>{p}</p>
                ))}
                <button onClick={() => setStoryExpanded(false)} style={{ fontSize: "13px", fontWeight: 600, color: "#E8521A", fontFamily: font, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <ChevronUp size={14} /> Show less
                </button>
              </>
            )}
          </div>

          {/* ── Why It Helps ── */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              Why This Helps
            </p>
            {!whyExpanded ? (
              <>
                <p style={{ fontSize: "15px", fontWeight: 400, color: "#444444", fontFamily: font, lineHeight: 1.8 }}>{content.whyItHelps}</p>
                <button onClick={() => setWhyExpanded(true)} style={{ fontSize: "13px", fontWeight: 600, color: "#E8521A", fontFamily: font, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                  Read more <ChevronDown size={14} />
                </button>
              </>
            ) : (
              <>
                {content.whyItHelpsFull.split("\n\n").map((p, i) => (
                  <p key={i} style={{ fontSize: "15px", fontWeight: 400, color: "#444444", fontFamily: font, lineHeight: 1.8, marginBottom: "16px" }}>{p}</p>
                ))}
                <button onClick={() => setWhyExpanded(false)} style={{ fontSize: "13px", fontWeight: 600, color: "#E8521A", fontFamily: font, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <ChevronUp size={14} /> Show less
                </button>
              </>
            )}
          </div>

          {/* ── Practical Tips ── */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
              Practical Tips
            </p>
            <div className="space-y-3">
              {content.tips.map((tip, index) => (
                <div key={index} className="p-5 rounded-2xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6", fontWeight: 700, color: "#E8521A", fontFamily: font }}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font, marginBottom: "4px" }}>{tip.title}</h3>
                      <p style={{ fontSize: "15px", fontWeight: 400, color: "#444444", fontFamily: font, lineHeight: 1.75 }}>{tip.description}</p>
                      {tip.action && (
                        <button
                          onClick={() => handleTipAction(tip)}
                          style={{ fontSize: "13px", fontWeight: 600, color: "#E8521A", fontFamily: font, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                        >
                          {tip.action.label} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Challenge Action Plan (replaces old checklist) ── */}
          <ChallengeActionPlan
            steps={content.actionPlan}
            mood={decodedMood}
            onSaveToSupabase={handleSaveChallenge}
          />

        </div>
      </div>
    </>
  );
}