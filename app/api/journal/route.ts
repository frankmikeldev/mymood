import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  const supabase = await createClient();

  const summary = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Summarize this conversation into a short wellness journal entry.",
      },
      {
        role: "user",
        content: JSON.stringify(messages),
      },
    ],
  });

  const text = summary.choices[0].message.content;

  await supabase.from("journal_entries").insert({
    session_id: sessionId,
    summary: text,
  });

  return NextResponse.json({ summary: text });
}