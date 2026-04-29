# Usage Guide: The Vibe-Coding Pipeline

This document defines how to interact with the **The Debate Gazette** codebase using AI agents and the established architectural rules.

## 🚀 Working with the Pipeline

### Stage 1: Initialization (Current)
- **Comic Canvas:** Use `src/engine/ComicCanvas.tsx` for layout-based storytelling.
- **Animations:** Use `framer-motion` for panel transitions to maintain the cinematic feel.
- **Phase Control:** Use `setGamePhase` from the store to switch between investigation and active debate.
- **Neural Link (Local):** Ensure an OpenAI-compatible inference server (LM Studio, Ollama, vLLM) is running on `http://localhost:1234`.

## 🚀 Game Mechanics

### Interactive Comic Panels
1. **Exploration Phase:** Click on the Left Panel (NPC Visuals) to initiate engagement.
2. **Debate Phase:** The Right Panel (Terminal) activates, establishing a Neural Link.
3. **Response:** NPC responses are rendered in the terminal using the `TypewriterText` component for maximum immersion.

### Stage 2: Fine-Tuning
When modifying existing components:
- Use **Annotation Mode** or targeted prompts to isolate changes.
- Refer to `.agents/rules/gameplay-physics.md` to ensure memory management standards are met.

### Stage 3: Debugging
If the engine crashes or behaviors are anomalous:
- Execute the **Automated Engine Debugging Workflow** in `.agents/workflows/debug.md`.
- Provide full stack traces from the browser console.

### Stage 4: Narrative & Uncensored Content
For "noir" dialogues or dark narrative elements that trigger corporate filters:
- Route requests to the local LLM endpoint defined in `.env`.
- Use the **Uncensored System Prompt** from the main documentation.

## 📝 Rules for GIT Operators
1. **Atomic Commits:** Every feature or architectural change must be committed separately.
2. **Context-Rich Messages:** Commit messages must explain the *why*, not just the *what*.
3. **Environment Protection:** Never commit the `.env` file (ensure it's in `.gitignore`).

## ⚙️ Configuration
Game balance is controlled via `config/gameBalance.json`. AI agents are instructed to modify this file rather than hardcoding values.
