import pkg from 'enquirer';
const { Select } = pkg;
import chalk from 'chalk';

// Helper to wrap text for the box
function wrapText(text, width) {
    if (!text) return [];
    const paragraphs = text.split('\n');
    let allLines = [];

    paragraphs.forEach(para => {
        const words = para.split(' ');
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + 1 + words[i].length <= width) {
                currentLine += ' ' + words[i];
            } else {
                allLines.push(currentLine);
                currentLine = words[i];
            }
        }
        allLines.push(currentLine);
    });
    return allLines;
}

export default class PreviewSelect extends Select {
    constructor(options) {
        super(options);
        this.templates = options.templates || [];
        this.boxWidth = 100; 
    }

    async footer() {
        const index = this.index;
        const selectedTemplate = this.templates[index];

        if (!selectedTemplate) return '';

        // --- 1. CONFIGURATION ---
        const borderH = "─"; // Horizontal line
        const borderV = "│"; // Vertical line
        const topLeft = "┌";
        const topRight = "┐";
        const botLeft = "└";
        const botRight = "┘";
        
        // Calculate the inner width available for text (Total - LeftBorder - RightBorder)
        const innerWidth = this.boxWidth - 2; 
        const hLine = borderH.repeat(innerWidth);
        
        let output = '\n'; // Spacer
        
        // --- 2. BOX TOP ---
        output += chalk.dim(`  ${topLeft}${hLine}${topRight}\n`);
        
        // --- 3. TITLE BAR ---
        const nameText = ` ${selectedTemplate.name} `;
        const nameLen = nameText.length;
        // Ensure name doesn't break box if too long
        const safeName = nameLen > innerWidth ? nameText.substring(0, innerWidth) : nameText;
        const titlePadding = " ".repeat(Math.max(0, innerWidth - safeName.length));

        output += chalk.dim(`  ${borderV}`) + chalk.bgBlue.white.bold(safeName) + titlePadding + chalk.dim(`${borderV}\n`);
        
        // --- 4. DESCRIPTION ---
        const descLines = wrapText(selectedTemplate.description, innerWidth - 2);
        descLines.forEach(l => {
            const padding = " ".repeat(innerWidth - 1 - l.length);
            output += chalk.dim(`  ${borderV} `) + chalk.gray(l) + padding + chalk.dim(`${borderV}\n`);
        });

        // --- 5. CONTENT GENERATION (NO TRUNCATION) ---
        let contentText = "";

        if (Array.isArray(selectedTemplate.prompt)) {
            // HANDLE CHAINING (Show Full Steps)
            contentText = `CHAIN (${selectedTemplate.prompt.length} Steps):\n`;
            selectedTemplate.prompt.forEach((step, i) => {
                // Add separation between steps for readability
                contentText += `\n[Step ${i+1}]:\n${step}\n`; 
            });
        } 
        else if (nameText !== 'Go back'){
            // HANDLE STANDARD (Show Full Strings)
            const sys = selectedTemplate.system;
            const prmpt = selectedTemplate.prompt;
            if(!sys && !prmpt) return;
            contentText = `SYSTEM:\n${sys}\n\nPROMPT:\n${prmpt}`;
        }

        const contentLines = wrapText(contentText, innerWidth - 2);

        // --- 6. RENDER CONTENT ---
        if (contentText) {
             // Add Divider
             output += chalk.dim(`  ${borderV}${hLine}${borderV}\n`);
        }

        // Render ALL lines. No slice, no maxLines.
        contentLines.forEach(l => {
            const padding = " ".repeat(innerWidth - 1 - l.length);
            output += chalk.dim(`  ${borderV} `) + chalk.yellow(l) + padding + chalk.dim(`${borderV}\n`);
        });

        // --- 7. BOX BOTTOM ---
        output += chalk.dim(`  ${botLeft}${hLine}${botRight}\n`);

        return output;
    }
}