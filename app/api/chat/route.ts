import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const { data: mood } = await supabase
      .from("mood_entries")
      .select("mood")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const currentMood = mood?.mood || "unknown";

    const { data: memories } = await supabase
      .from("user_memory")
      .select("memory")
      .eq("user_id", user.id)
      .limit(5);

    const memoryContext = memories?.map((m) => m.memory).join("\n") || "";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are MyMood's AI therapist assistant.

User mood: ${currentMood}

User memory:
${memoryContext}

Your job:

Be supportive and empathetic.
Help with stress, anxiety, sadness.
Suggest healthy coping strategies.

You can recommend:
- breathing exercises
- journaling
- walking
- meditation
- talking to friends
- sleep improvement

If the user sounds very distressed, gently suggest seeking professional help.

Keep responses supportive and short.
`,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;

    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI error" });
  }
}