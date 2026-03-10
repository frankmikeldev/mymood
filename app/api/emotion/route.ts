import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { text } = await req.json();

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Detect the main emotion in this message.

Return only one word.

Possible emotions:
happy
sad
anxious
angry
lonely
stressed
neutral
`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return NextResponse.json({
    emotion: result.choices[0].message.content,
  });
}