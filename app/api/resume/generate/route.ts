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
          '--enable-async-dns', // Enable async DNS lookups
          '--no-first-run',     // Skip first run tasks
          '--no-sandbox',
          '--disable-setuid-sandbox',
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
    
    // Set shorter timeout for initial page load
    await page.setDefaultNavigationTimeout(20000);
    
    // Set viewport
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1.5,
    });

    // Enable request interception
    await page.setRequestInterception(true);

    // Track failed image requests
    const failedImages = new Set();

    // Handle requests
    page.on('request', (request: { resourceType: () => any; url: () => any; continue: () => void; abort: () => void; }) => {
      const resourceType = request.resourceType();
      if (resourceType === 'image') {
        // Store the image URL
        const imageUrl = request.url();
        // Only proceed with the request if we haven't seen it fail before
        if (!failedImages.has(imageUrl)) {
          request.continue();
        } else {
          request.abort();
        }
      } else if (['document', 'script', 'stylesheet', 'font'].includes(resourceType)) {
        request.continue();
      } else {
        request.abort();
      }
    });

    // Handle failed requests
    page.on('requestfailed', (request: { resourceType: () => string; url: () => unknown; }) => {
      if (request.resourceType() === 'image') {
        failedImages.add(request.url());
      }
    });

    console.log("FAILED IMAGES:", failedImages)

    // Inject code to handle image loading
    await page.evaluateOnNewDocument(() => {
      window.addEventListener('load', () => {
        const images = document.getElementsByTagName('img');
        console.log("IMAGES TO LOAD:", images)
        for (let img of images) {
          // Force reload any images that failed to load
          if (!img.complete || img.naturalHeight === 0) {
            const originalSrc = img.src;
            img.src = '';  // Clear the src
            setTimeout(() => {
              img.src = originalSrc;  // Retry loading
            }, 100);
          }
          
          // Add load/error listeners
          img.addEventListener('load', () => {
            img.dataset.loaded = 'true';
          });
          
          img.addEventListener('error', () => {
            img.dataset.error = 'true';
          });
        }
      });
    });

    // Navigate to page
    await page.goto(previewUrl, {
      waitUntil: 'networkidle0',  // Wait until network is quiet
      timeout: 20000,
    });

    // Wait for content and manually check images
    await Promise.all([
      page.waitForSelector(`#${elementId}`, { timeout: 20000 }),
      page.waitForFunction(() => document.fonts.ready, { timeout: 20000 }),
      // Custom image loading check
      page.waitForFunction(() => {
        const images = document.getElementsByTagName('img');
        let allLoaded = true;
        console.log("IMAGES LOADING CHECK:", images)
        for (const img of images) {
          // Check if image is properly loaded
          if (!img.complete || img.naturalHeight === 0) {
            allLoaded = false;
            break;
          }
        }
        
        return allLoaded;
      }, { timeout: 20000 }),
    ]);

    // Additional wait for final render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check and log any unloaded images before PDF generation
    await page.evaluate(() => {
      const images = document.getElementsByTagName('img');
      const unloadedImages = Array.from(images).filter(img => !img.complete || img.naturalHeight === 0);
      if (unloadedImages.length > 0) {
        console.warn('Unloaded images found:', unloadedImages.map(img => img.src));
      }
    });

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
      timeout: 20000,
    });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    //console.error("PDF generation error:", error);
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