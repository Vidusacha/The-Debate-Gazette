import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Load .env manually to avoid extra dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
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

loadEnv();

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: Missing VITE_GEMINI_API_KEY or GOOGLE_API_KEY in .env file. Unable to authenticate with Google Gemini.");
  process.exit(1);
}

const modelName = process.env.VITE_GEMINI_MODEL_NAME || 'gemini-2.5-flash';

// 2. Fetch Git status and differences
let gitDiff = '';
let gitStatus = '';

try {
  gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  // Get all unstaged and staged changes
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

// 3. Request Gemini to analyze diff and generate commit details
const genAI = new GoogleGenerativeAI(apiKey);

const systemPrompt = `You are a Senior Principal Software Engineer and Release Architect.
Your task is to analyze the git status and diff output of the workspace and generate a highly professional, context-rich Git commit message.

Guidelines for the commit message:
1. Semantic Git: Use standard prefixes like feat:, fix:, refactor:, docs:, style:, chore:
2. Explain the WHY, not just the WHAT. Explain the design reasons and gameplay impact behind the changes.
3. Be comprehensive, professional, and clear. Break it down into bullet points.
4. Keep the summary line concise (under 72 chars), followed by a blank line and then detailed bullet points.

Your response MUST be the raw commit message itself, as plain text. Do not wrap it in markdown codeblocks (no \`\`\`), and do not add any introductory or trailing text. Start directly with the summary line.`;

const userContent = `Here is the current repository status and diff:

[GIT STATUS]
${gitStatus}

[GIT DIFF]
${gitDiff.slice(0, 18000)} ${gitDiff.length > 18000 ? '... [Diff truncated due to size]' : ''}`;

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemPrompt });
    const result = await model.generateContent(userContent);
    const text = result.response.text().trim();
    
    // Output the raw commit message directly to stdout
    console.log(text);
  } catch (error) {
    console.error(`Error: Gemini generation failed: ${error.message}`);
    process.exit(1);
  }
}

run();
