import { PDFDocument, StandardFonts } from "pdf-lib";

export async function POST(req: Request) {
  const { moodData, summary } = await req.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { height } = page.getSize();

  page.drawText("Mood Report", {
    x: 50,
    y: height - 50,
    size: 24,
    font,
  });

  page.drawText(summary, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
    maxWidth: 500,
  });

  let yPosition = height - 200;

  moodData.forEach((entry: any) => {
    page.drawText(`${entry.date} - Score: ${entry.moodScore}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });
    yPosition -= 15;
  });

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=mood-report.pdf",
    },
  });
}