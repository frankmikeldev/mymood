import { PDFDocument, StandardFonts, grayscale } from "pdf-lib";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// ✅ Keep ONLY basic printable ASCII — strips ALL emoji, arrows, special chars
function stripUnsupported(text: string): string {
  return text
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moodData, summary } = await req.json();

    if (!Array.isArray(moodData) || typeof summary !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const safeMoodData = moodData.slice(0, 100);

    // ✅ Strip HTML then strip all non-ASCII
    const safeSummary = stripUnsupported(
      summary.replace(/<[^>]*>/g, "").slice(0, 1000)
    );

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { height } = page.getSize();

    // Title
    page.drawText("MyMood - Mood Report", {
      x: 50, y: height - 50, size: 22, font: boldFont,
    });

    // Generated date
    page.drawText(`Generated: ${new Date().toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    })}`, { x: 50, y: height - 80, size: 10, font });

    // Divider
    page.drawLine({
      start: { x: 50, y: height - 95 },
      end: { x: 550, y: height - 95 },
      thickness: 0.5,
      color: grayscale(0.7),
    });

    // Summary heading
    page.drawText("Wellness Insight", {
      x: 50, y: height - 120, size: 14, font: boldFont,
    });

    // ✅ Word wrap summary — all text stripped of non-ASCII before drawText
    const words = safeSummary.split(" ");
    let line = "";
    let yPos = height - 145;

    for (const word of words) {
      const testLine = line + word + " ";
      if (testLine.length > 70) {
        const safeLine = stripUnsupported(line.trim());
        if (safeLine) {
          page.drawText(safeLine, { x: 50, y: yPos, size: 11, font });
          yPos -= 18;
        }
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      const safeLine = stripUnsupported(line.trim());
      if (safeLine) {
        page.drawText(safeLine, { x: 50, y: yPos, size: 11, font });
        yPos -= 18;
      }
    }

    // Mood log heading
    yPos -= 20;
    page.drawText("Mood Log", { x: 50, y: yPos, size: 14, font: boldFont });
    yPos -= 25;

    // Column headers
    page.drawText("Date", { x: 50, y: yPos, size: 10, font: boldFont });
    page.drawText("Score", { x: 250, y: yPos, size: 10, font: boldFont });
    page.drawText("Mood", { x: 350, y: yPos, size: 10, font: boldFont });
    yPos -= 15;

    const MOOD_LABELS: Record<number, string> = {
      1: "Very Sad", 2: "Sad", 3: "Neutral", 4: "Happy", 5: "Very Happy",
    };

    for (const entry of safeMoodData) {
      if (yPos < 60) break;

      const date = stripUnsupported(String(entry.date || "")).slice(0, 30);
      const score = stripUnsupported(String(entry.moodScore || "")).slice(0, 5);
      const label = stripUnsupported(MOOD_LABELS[Number(entry.moodScore)] || "");

      if (date) page.drawText(date, { x: 50, y: yPos, size: 10, font });
      if (score) page.drawText(score, { x: 250, y: yPos, size: 10, font });
      if (label) page.drawText(label, { x: 350, y: yPos, size: 10, font });
      yPos -= 15;
    }

    // Footer
    page.drawText("MyMood - For personal wellness tracking only. Not a medical document.", {
      x: 50, y: 30, size: 8, font,
    });

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=mymood-report-${Date.now()}.pdf`,
      },
    });

  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}