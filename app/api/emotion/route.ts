export const dynamic = 'force-dynamic'; // Fixes the Vercel Build Error

import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Initialize Groq safely
const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    if (!groq) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json({ error: "AI Configuration Error" }, { status: 500 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const result = await groq.chat.completions.create({
      // Llama 3 is excellent at following "one word only" instructions
      model: "llama-3.3-70b-versatile", 
      messages: [
        {
          role: "system",
          content: `
            Detect the main emotion in this message.
            Return ONLY one word from this list:
            happy, sad, anxious, angry, lonely, stressed, neutral.
            Do not include punctuation or extra text.
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0, // Keeps the answer consistent and focused
    });

    const detectedEmotion = result.choices[0].message.content?.toLowerCase().trim();

    return NextResponse.json({
      emotion: detectedEmotion,
    });
  } catch (err) {
    console.error("Emotion Detection Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}