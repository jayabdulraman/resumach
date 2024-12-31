'use client'

import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set worker path before any PDF operations
if (typeof window !== 'undefined') {
    GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
}

export async function extractTextFromPDF(fileBlob: Blob): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!pdfjsLib) {
                throw new Error('PDF.js library not found');
            }

            const arrayBuffer = await fileBlob.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdfDoc = await loadingTask.promise;

            let fullText = '';
            
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                
                const [textContent, annotations] = await Promise.all([
                    page.getTextContent(),
                    page.getAnnotations()
                ]);

                // Group text items that belong to the same link or line
                const groupedItems: any[] = [];
                let currentGroup: any[] = [];
                let lastItem: any = null;

                textContent.items.forEach((item: any) => {
                    if (!lastItem) {
                        currentGroup.push(item);
                    } else {
                        const isSameLine = Math.abs(item.transform[5] - lastItem.transform[5]) < 2;
                        const expectedXPosition = lastItem.transform[4] + (lastItem.width || 0);
                        const isNearby = Math.abs(item.transform[4] - expectedXPosition) < Math.max(item.width, lastItem.width) * 1.5;
                        
                        if (isSameLine && isNearby) {
                            currentGroup.push(item);
                        } else {
                            if (currentGroup.length > 0) {
                                groupedItems.push([...currentGroup]);
                            }
                            currentGroup = [item];
                        }
                    }
                    lastItem = item;
                });

                if (currentGroup.length > 0) {
                    groupedItems.push(currentGroup);
                }

                // Create a map of link positions with more precise matching
                const linkMap = new Map();
                annotations
                    .filter(annot => annot.subtype === 'Link' && annot.url)
                    .forEach(link => {
                        let linkedGroups: any[] = [];
                        let bestOverlapPercentage = 0;

                        groupedItems.forEach(group => {
                            const groupRect = [
                                Math.min(...group.map((item: any) => item.transform[4])),
                                Math.min(...group.map((item: any) => item.transform[5])),
                                Math.max(...group.map((item: any) => item.transform[4] + (item.width || 0))),
                                Math.max(...group.map((item: any) => item.transform[5] + (item.height || 0)))
                            ];

                            // Calculate overlap percentages both ways
                            const overlap = getOverlapArea(groupRect, link.rect);
                            const groupArea = (groupRect[2] - groupRect[0]) * (groupRect[3] - groupRect[1]);
                            const linkArea = (link.rect[2] - link.rect[0]) * (link.rect[3] - link.rect[1]);
                            
                            // Calculate overlap percentage relative to both areas
                            const overlapPercentageGroup = groupArea > 0 ? overlap / groupArea : 0;
                            const overlapPercentageLink = linkArea > 0 ? overlap / linkArea : 0;

                            // Only consider it a match if there's significant mutual overlap
                            if (overlapPercentageGroup > 0.5 && overlapPercentageLink > 0.5) {
                                // If this group has better overlap than previous matches
                                if (Math.min(overlapPercentageGroup, overlapPercentageLink) > bestOverlapPercentage) {
                                    linkedGroups = [group];
                                    bestOverlapPercentage = Math.min(overlapPercentageGroup, overlapPercentageLink);
                                }
                            }
                        });

                        if (bestOverlapPercentage > 0) {
                            // Combine the text from the best matching group
                            const combinedText = linkedGroups
                                .map(group => group.map((item: any) => item.str).join(''))
                                .join('');

                            if (combinedText.trim()) {
                                // Verify the link type matches the content
                                const isValidMatch = validateLinkMatch(combinedText, link.url);
                                
                                if (isValidMatch) {
                                    linkMap.set(combinedText.trim(), link.url);
                                    linkedGroups.forEach(group => {
                                        group.isLinked = true;
                                        group.linkUrl = link.url;
                                    });
                                }
                            }
                        }
                    });

                // Process text items with their groups
                let lastY: number | null = null;
                groupedItems.forEach(group => {
                    const y = group[0].transform[5];
                    const height = Math.max(...group.map((item: any) => item.height || 0));

                    // Add paragraph breaks based on vertical spacing
                    if (lastY !== null) {
                        const verticalGap = lastY - y;
                        if (verticalGap > height * 2) {
                            fullText += '\n\n';
                        }
                    }

                    const groupText = group.map((item: any) => item.str).join('');
                    if (group.isLinked) {
                        fullText += `${groupText}(${group.linkUrl})`;
                    } else {
                        fullText += groupText;
                    }

                    const lastItem = group[group.length - 1];
                    if (lastItem.hasEOL) {
                        fullText += '\n';
                    } else {
                        fullText += ' ';
                    }

                    lastY = y;
                });

                if (pageNum < pdfDoc.numPages) {
                    fullText += '\n\n';
                }
            }
            
            fullText = fullText.replace(/\n{3,}/g, '\n\n');
            resolve(fullText.trim());
        } catch (error) {
            console.error("Error extracting PDF:", error);
            reject(error);
        }
    });
}

// Helper function to calculate the overlap area between two rectangles
function getOverlapArea(rect1: number[], rect2: number[]): number {
    const xOverlap = Math.max(0, 
        Math.min(rect1[2], rect2[2]) - Math.max(rect1[0], rect2[0])
    );
    const yOverlap = Math.max(0,
        Math.min(rect1[3], rect2[3]) - Math.max(rect1[1], rect2[1])
    );
    return xOverlap * yOverlap;
}

function validateLinkMatch(text: string, url: string): boolean {
    // Convert both text and URL to lowercase for comparison
    const lowerText = text.toLowerCase().trim();
    const lowerUrl = url.toLowerCase();

    // Remove brackets from text if present
    const cleanText = lowerText.replace(/[()[\]]/g, '');

    // Check for common mismatches
    if (url.startsWith('mailto:')) {
        // For email links, only match if the text is explicitly an email
        const email = url.replace('mailto:', '');
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        return emailRegex.test(cleanText);
    }

    // Social media checks
    const socialMatches = {
        'linkedin.com': ['linkedin', 'li'],
        'twitter.com': ['twitter', 'x.com'],
        'x.com': ['twitter', 'x.com'],
        'facebook.com': ['facebook', 'fb'],
        'github.com': ['github', 'gh'],
        'dribbble.com': ['dribbble']
    };

    // Check each social media platform
    for (const [domain, keywords] of Object.entries(socialMatches)) {
        if (lowerUrl.includes(domain)) {
            return keywords.some(keyword => cleanText.includes(keyword));
        }
    }

    // For other URLs, check if the visible text contains the URL or vice versa
    // This helps match cases like "(see tool)" with actual tool URLs
    if (cleanText.includes('see') || cleanText.includes('view') || cleanText.includes('visit')) {
        return true; // Allow links with common viewing verbs
    }

    // Default case: check if text and URL have some overlap
    const urlDomain = lowerUrl.replace(/^https?:\/\//, '').split('/')[0];
    return cleanText.includes(urlDomain) || urlDomain.includes(cleanText);
}
