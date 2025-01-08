import { NextRequest, NextResponse } from "next/server";
import { pageSizeMap } from "@/utils/namespaces/page";

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  let browser;
  try {
    const { previewUrl, elementId, resume } = await request.json();
    const metadataPage = resume.data.metadata.page;
    const filename = resume.title + ".pdf";

    if (process.env.NEXT_PUBLIC_NODE_ENV !== 'development') {
      const chromium = require("@sparticuz/chromium");
      const puppeteer = require('puppeteer-core');
      
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--disable-web-security',
          '--disable-gpu',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      const puppeteer = require('puppeteer');
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-web-security',
        ],
      });
    }

    const page = await browser.newPage();
    
    // Optimize page settings
    await page.setDefaultNavigationTimeout(15000);
    await page.setViewport({
      width: 1200,  // Reduced from 1920
      height: 800,  // Reduced from 1080
      deviceScaleFactor: 1.5,  // Reduced from 2 for faster rendering
    });

    // Optimize resource loading
    await page.setRequestInterception(true);
    page.on('request', (request:any) => {
      // Only allow necessary resource types
      const resourceType = request.resourceType();
      if (['document', 'script', 'stylesheet', 'image', 'font'].includes(resourceType)) {
        request.continue();
      } else {
        request.abort();
      }
    });

    // Inject minimal image loading check
    await page.evaluateOnNewDocument(() => {
      window.addEventListener('load', () => {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
          if (!img.complete) {
            img.addEventListener('error', () => img.dataset.error = 'true');
            img.addEventListener('load', () => img.dataset.loaded = 'true');
          } else {
            img.dataset.loaded = 'true';
          }
        }
      });
    });

    // Navigate to page with optimized wait conditions
    await page.goto(previewUrl, {
      waitUntil: 'domcontentloaded',  // Changed from networkidle0 for faster loading
      timeout: 10000,
    });

    // Wait for essential content with reduced timeouts
    await Promise.all([
      page.waitForSelector(`#${elementId}`, { timeout: 5000 }),
      page.waitForFunction(() => document.fonts.ready, { timeout: 5000 }),
      // Optimized image loading check specifically for icons
      page.waitForFunction(() => {
        const images = document.getElementsByTagName('img');
        return Array.from(images).every(img => {
          // Consider small images (icons) as loaded if they have dimensions
          if (img.width > 0 && img.height > 0 && img.width <= 64 && img.height <= 64) {
            return true;
          }
          return img.dataset.loaded === 'true' || img.dataset.error === 'true';
        });
      }, { timeout: 5000 }),
    ]);

    // Short wait for final render
    await new Promise(resolve => setTimeout(resolve, 500));

    const MM_TO_PX = 3.78;
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      // @ts-ignore
      width: `${pageSizeMap[metadataPage.format].width * MM_TO_PX}px`,
      // @ts-ignore
      height: `${pageSizeMap[metadataPage.format].height * MM_TO_PX}px`,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
      timeout: 10000,
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