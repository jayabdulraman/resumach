//import * as mammoth from 'mammoth';
var mammoth = require("mammoth");

export async function extractTextFromDOCX(formData: Blob): Promise<string> {
    const reader = new FileReader();
    //const file = formData.get("document") as Blob;
    reader.readAsArrayBuffer(formData);

    // Return a promise that resolves when the file is read
    const content = await new Promise<string>((resolve) => {
        reader.onload = async () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            
            // Extract content using mammoth's convert to HTML which preserves structure better
            //@ts-ignore
            function transformParagraph(element) {
                if (element.alignment === "center" && !element.styleId) {
                    return {...element, styleId: "Heading2"};
                } else {
                    return element;
                }
            }
            
            var options = {
                transformDocument: mammoth.transforms.paragraph(transformParagraph)
            };

            const result = await mammoth.convertToHtml({ arrayBuffer }, options);

            // Create a temporary container to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result.value;

            // Function to process node and its children recursively
            function processNode(node: Node): string {
                let text = '';

                // Process all child nodes to maintain structure
                node.childNodes.forEach((child) => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        // Handle text nodes
                        text += child.textContent;
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const element = child as HTMLElement;
                        
                        if (element.tagName === 'A') {
                            // Handle hyperlinks
                            const href = element.getAttribute('href');
                            const linkText = element.textContent;
                            text += `${linkText} [${href}] `;
                        } else if (element.tagName === 'P') {
                            // Handle paragraphs
                            text += processNode(element) + '\n';
                        } else if (element.tagName === 'BR') {
                            // Handle line breaks
                            text += '\n';
                        } else if (element.tagName === 'LI') {
                            // Handle Unordered List
                            text += processNode(element) + '\n';
                        } else {
                            // Process other elements recursively
                            text += processNode(element);
                        }
                    }
                });

                return text;
            }

            // Process the entire document
            const finalContent = processNode(tempDiv)

            console.log("CONTENT:", finalContent);
            resolve(finalContent);
        };
    });
    console.log("CONTENT:", content);

    return content;
}
