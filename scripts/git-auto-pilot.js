import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Determine the script's installation directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptRepoDir = path.resolve(__dirname, '..');

// Load environment variables manually to avoid extra dependencies
function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    
    // Strip trailing comment if any
    const hashIdx = val.indexOf('#');
    if (hashIdx !== -1) {
      val = val.slice(0, hashIdx).trim();
    }
    // Strip quotes if any
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

// 1. Try loading .env from current directory first, then fall back to script directory
loadEnv(path.resolve(process.cwd(), '.env'));
let apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  loadEnv(path.resolve(scriptRepoDir, '.env'));
  apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
}

if (!apiKey) {
  console.error("Error: Missing VITE_GEMINI_API_KEY or GOOGLE_API_KEY in .env file. Unable to authenticate with Google Gemini.");
  process.exit(1);
}

const modelName = process.env.VITE_GEMINI_MODEL_NAME || 'gemini-2.5-flash';

// Helper to recursively find markdown files in a directory
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const base = path.basename(file);
        // Skip common large directories, build artifacts, and hidden folders
        if (
          base === 'node_modules' || 
          base === '.git' || 
          base === 'dist' || 
          base === 'build' || 
          base === 'coverage' ||
          base.startsWith('.')
        ) {
          continue;
        }
        findMarkdownFiles(filePath, fileList);
      } else if (stat.isFile() && file.endsWith('.md')) {
        fileList.push(filePath);
      }
    } catch (e) {
      // Ignore permission or read errors for specific files
    }
  }
  return fileList;
}

// 2. Fetch Git status and differences
let gitDiff = '';
let gitStatus = '';

try {
  gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  const unstagedDiff = execSync('git diff', { encoding: 'utf8' }).trim();
  const stagedDiff = execSync('git diff --cached', { encoding: 'utf8' }).trim();
  gitDiff = `--- UNSTAGED DIFF ---\n${unstagedDiff}\n\n--- STAGED DIFF ---\n${stagedDiff}`;
} catch (error) {
  console.error(`Error: Failed to execute Git commands: ${error.message}`);
  process.exit(1);
}

if (!gitStatus) {
  console.log("clean");
  process.exit(0);
}

// Locate all markdown files in current working directory recursively
const mdFiles = findMarkdownFiles(process.cwd());
let markdownDocs = '';
const filePathsList = [];

for (const file of mdFiles) {
  const relativePath = path.relative(process.cwd(), file);
  filePathsList.push(relativePath);
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Limit reading size per file to 50KB to keep context reasonable
    const readLimit = 50000;
    const truncatedContent = content.length > readLimit ? content.slice(0, readLimit) + '\n... [Truncated]' : content;
    markdownDocs += `\n\n--- FILE: ${relativePath} ---\n${truncatedContent}`;
  } catch (e) {
    process.stderr.write(`Warning: Failed to read support file ${relativePath}: ${e.message}\n`);
  }
}

// 3. Request Gemini to analyze diff and generate commit details & support file updates
const genAI = new GoogleGenerativeAI(apiKey);

const systemPrompt = `You are a Senior Principal Software Engineer, Technical Writer, and Release Architect.
Your task is to analyze the git status and diff output of the workspace and perform two actions:

1. Dynamic Documentation / Support File Updates:
   - Examine the provided list of markdown support/documentation files currently in the repository, along with their existing contents.
   - Based on the git diff, determine if any of these markdown files (like README.md, usage.md, or other .md files) are outdated, incomplete, or lack documentation regarding the new features, architecture changes, setup parameters, or instructions introduced in the git diff.
   - If updates are required, write the FULL, complete, updated content of each file. The documentation must be elegant, professional, accurate, and completely aligned with the new code changes. Avoid deleting existing useful content; instead, expand, refine, and harmonize it with the git diff.
   - If no updates are needed for a file, do not include it in your output.

2. Professional Commit Message:
   - Generate a professional, semantic (e.g. feat:, fix:, docs:, refactor:), and highly informative Git commit message that explains the "why" and design choices behind the code changes.
   - Keep the summary line under 72 characters, followed by a blank line, and then a thorough, detailed bulleted list of the modifications and their architectural impact.

Your response MUST be a single, valid JSON object containing exactly the following keys:
- "commitMessage": (string) The full, formatted git commit message.
- "updatedFiles": (array) A list of objects for files that require updating. Each object must contain:
  - "filePath": (string) The relative path of the file (e.g., "README.md").
  - "content": (string) The complete, fully updated text content for that file.
  - "explanation": (string) A brief sentence explaining why this file was updated.

Return ONLY the raw JSON object. Do not wrap it in markdown codeblocks (no \`\`\` or \`\`\`json), and do not add any introductory or trailing text.`;

const userContent = `Here is the current repository status, diff, and all available markdown support files.

[GIT STATUS]
${gitStatus}

[GIT DIFF]
${gitDiff.slice(0, 30000)} ${gitDiff.length > 30000 ? '... [Diff truncated due to size]' : ''}

[AVAILABLE MARKDOWN SUPPORT FILES IN REPO]
${filePathsList.join(', ')}

[CURRENT SUPPORT FILES CONTENTS]
${markdownDocs}`;

async function run() {
  try {
    process.stderr.write("🤖 Invoking Gemini to analyze delta and support files...\n");
    
    // We configure JSON response mode
    const model = genAI.getGenerativeModel({ 
      model: modelName, 
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(userContent);
    const rawResponseText = result.response.text().trim();
    
    // Robustly parse JSON from Gemini's response (handles markdown blocks if any)
    let data;
    try {
      data = parseGeminiResponse(rawResponseText);
    } catch (parseError) {
      console.error(`Error: Failed to parse Gemini's response as JSON. Raw response was:\n${rawResponseText}`);
      process.exit(1);
    }

    const { commitMessage, updatedFiles } = data;

    // 4. If there are updated files, write them back to disk
    if (updatedFiles && updatedFiles.length > 0) {
      process.stderr.write(`📝 Gemini requested updates for ${updatedFiles.length} support file(s):\n`);
      for (const fileObj of updatedFiles) {
        const { filePath, content, explanation } = fileObj;
        const absolutePath = path.resolve(process.cwd(), filePath);
        process.stderr.write(`   ↳ [UPDATE] ${filePath}: ${explanation}\n`);
        
        // Write the full updated content back to the file
        fs.writeFileSync(absolutePath, content, 'utf8');
      }
    } else {
      process.stderr.write("✨ Gemini analyzed the changes and determined all existing support files are up to date.\n");
    }

    // 5. Print the raw commit message to stdout so that the bash wrapper can capture it
    console.log(commitMessage);

  } catch (error) {
    console.error(`Error: Git Auto-Pilot failed: ${error.message}`);
    process.exit(1);
  }
}

function parseGeminiResponse(rawText) {
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    // Strip opening codeblock line (e.g. ```json or ```)
    const firstLineEnd = cleanText.indexOf('\n');
    if (firstLineEnd !== -1) {
      cleanText = cleanText.substring(firstLineEnd).trim();
    }
    // Strip closing codeblock
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3).trim();
    }
  }
  return JSON.parse(cleanText);
}

run();
