export const dynamic = 'force-dynamic'; // 1. Fixes the Vercel Build Error

import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 2. Initialize safely to prevent "Missing API Key" crashes during build
const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    // Check if Groq was initialized
    if (!groq) {
      console.error("GROQ_API_KEY is missing from environment variables");
      return NextResponse.json({ error: "AI Configuration Error" }, { status: 500 });
    }

    const { messages, sessionId } = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Mood
    const { data: mood } = await supabase
      .from("mood_entries")
      .select("mood")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const currentMood = mood?.mood || "unknown";

    // Fetch Memories
    const { data: memories } = await supabase
      .from("user_memory")
      .select("memory")
      .eq("user_id", user.id)
      .limit(5);

    const memoryContext = memories?.map((m) => m.memory).join("\n") || "";

    // Generate AI Response
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
            You are MyMood's AI therapist assistant.
            User mood: ${currentMood}
            User memory: ${memoryContext}

            Your job:
            - Be supportive and empathetic.
            - Help with stress, anxiety, and sadness.
            - Suggest healthy coping strategies like breathing, journaling, or meditation.
            - If the user is very distressed, suggest professional help.
            Keep responses supportive and short.
          `,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;

    // Save to History
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}