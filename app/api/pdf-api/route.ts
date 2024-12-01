import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { pageSizeMap } from "@/utils/namespaces/page";

export async function POST(request: NextRequest) {
  try {
    const { previewUrl, elementId, resume } = await request.json();
    const metadataPage = resume.data.metadata.page;
    const filename = resume.title+".pdf";
    console.log("PDF DETAILS:", previewUrl, elementId, filename)

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Create new page
    const page = await browser.newPage();

    // Go to the specified URL
    await page.goto(previewUrl, {
      waitUntil: "networkidle0", // Wait until network is idle
    });

    // Wait for the content to be rendered
    await page.waitForFunction(() => document.readyState === 'complete');

    // Wait for the specific element to be rendered
    await page.waitForSelector(`#${elementId}`);

    // Get the element
    const element = await page.$(`#${elementId}`);

    if (!element) {
        throw new Error(`Element with ID ${elementId} not found`);
    }
    const MM_TO_PX = 3.78;
    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true, // Include background graphics
      // @ts-ignore
      width: `${pageSizeMap[metadataPage.format].width * MM_TO_PX}px`,
      // @ts-ignore
      minHeight: `${pageSizeMap[metadataPage.format].height * MM_TO_PX}px`,
    });

    await browser.close();

    // Create response with PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { message: "Error generating PDF" },
      { status: 500 }
    );
  }
}
