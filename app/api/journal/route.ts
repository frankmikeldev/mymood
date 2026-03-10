export const dynamic = 'force-dynamic'; // Essential for Vercel builds

import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Initialize Groq safely
const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    if (!groq) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json({ error: "AI Configuration Error" }, { status: 500 });
    }

    const { messages, sessionId } = await req.json();
    const supabase = await createClient();

    // Generate the summary using Llama 3
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Summarize this conversation into a short, meaningful wellness journal entry. Focus on the user's feelings and any progress made.",
        },
        {
          role: "user",
          content: JSON.stringify(messages),
        },
      ],
      temperature: 0.5, // Slightly higher for a more "natural" sounding journal entry
    });

    const text = completion.choices[0].message.content;

    // Save to Supabase
    const { error } = await supabase.from("journal_entries").insert({
      session_id: sessionId,
      summary: text,
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ summary: text });
  } catch (err) {
    console.error("Journal API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}