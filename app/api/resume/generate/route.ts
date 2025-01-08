import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { pageSizeMap } from "@/utils/namespaces/page";

export async function POST(request: NextRequest) {
  let browser;
  try {
    const { previewUrl, elementId, resume } = await request.json();
    const metadataPage = resume.data.metadata.page;
    const filename = resume.title+".pdf";

    // Launch browser with increased timeout
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
    });

    // Create new page with increased timeout
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // 60 seconds timeout

    // Set viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2, // Higher resolution
    });

    // Go to the specified URL with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto(previewUrl, {
          waitUntil: ["networkidle0", "domcontentloaded"],
          timeout: 60000,
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retry
      }
    }

    // Wait for critical content
    await Promise.all([
      page.waitForFunction(() => document.readyState === 'complete'),
      page.waitForSelector(`#${elementId}`, { timeout: 60000 }),
      // Wait for fonts to load
      page.waitForFunction(() => document.fonts.ready),
      // Wait for images to load
      page.waitForFunction(() => 
        Array.from(document.images).every((img) => img.complete)
      ),
    ]);

    // Additional wait for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get the element
    const element = await page.$(`#${elementId}`);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    const MM_TO_PX = 3.78;
    // Generate PDF with specific settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      // @ts-ignore
      width: `${pageSizeMap[metadataPage.format].width * MM_TO_PX}px`,
      // @ts-ignore
      height: `${pageSizeMap[metadataPage.format].height * MM_TO_PX}px`,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
      timeout: 60000,
    });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { message: "Error generating PDF", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
