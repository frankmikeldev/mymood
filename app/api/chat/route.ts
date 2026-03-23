export const dynamic = 'force-dynamic';

import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

// ✅ Simple in-memory rate limiter (no external service needed)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // 20 messages per minute per user

  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) return true;

  entry.count++;
  return false;
}

export async function POST(req: Request) {
  try {
    if (!groq) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json({ error: "AI configuration error" }, { status: 500 });
    }

    // ✅ Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Rate limit check
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429 }
      );
    }

    const { messages, sessionId } = await req.json();

    // ✅ Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // ✅ Limit message history to last 20 to prevent token abuse
    const trimmedMessages = messages.slice(-20);

    // Fetch latest mood
    const { data: mood } = await supabase
      .from("mood_entries")
      .select("mood")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const currentMood = mood?.mood || "unknown";

    // Fetch memories
    const { data: memories } = await supabase
      .from("user_memory")
      .select("memory")
      .eq("user_id", user.id)
      .limit(5);

    const memoryContext = memories?.map((m) => m.memory).join("\n") || "";

    // Generate AI response
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500, // ✅ Cap response length to prevent abuse
      messages: [
        {
          role: "system",
          content: `You are MyMood's AI therapist assistant.
User mood: ${currentMood}
User memory: ${memoryContext}

Your job:
- Be supportive and empathetic.
- Help with stress, anxiety, and sadness.
- Suggest healthy coping strategies like breathing, journaling, or meditation.
- If the user is very distressed, suggest professional help.
- Never provide medical diagnoses or prescribe medication.
- Keep responses supportive and concise.`,
        },
        ...trimmedMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // ✅ Save to chat history (only if sessionId provided)
    if (sessionId) {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: reply,
      });
    }

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}