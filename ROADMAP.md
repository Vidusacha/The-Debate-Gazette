# Development Roadmap: The Debate Gazette

**Vision:** A noir political thriller in an animated comic book style (Max Payne aesthetic), where a cynical AI opponent uses real-world data to dismantle the player's arguments, breaking the fourth wall.

---

## 🟢 Phase 1: Core Systems & Visual Foundation [COMPLETED]
- [x] Initial Workspace Setup (Vite + React + TypeScript + Antigravity Rules).
- [x] Global Design System (`DESIGN.md`) - Noir / Retro-Tech Comic aesthetic.
- [x] Framer Motion Comic Shell (`ComicCanvas.tsx`) replacing the 3D engine.
- [x] Global State Management (`Zustand`) for game phases and interaction.
- [x] UI Interaction Bridge (Click-to-interact logic for comic panels).

## 🟡 Phase 2: Hybrid Narrative Mechanics [IN PROGRESS]
- [x] Implementation of `llmService.ts` for AI communication.
- [x] Initial Debate UI (Terminal panel, response layout, loading states).
- [x] Integration with OpenAI API (GPT-4o) for baseline testing and error handling.
- [ ] **Refinement:** Polish `framer-motion` transitions, add typewriter text effects, and fine-tune parallax mouse tracking.

## 🔵 Phase 3: Sovereign Infrastructure (Local AI Bridge)
- [ ] **Cloudflare Tunnel Integration (Path 1):**
    - [ ] Set up `cloudflared` to expose Local Inference Server (Port 1234).
    - [ ] Update `.env` with public tunnel URL for remote API testing.
- [ ] **Local Model Optimization (Qwen2.5-14B-Instruct):**
    - [ ] Configure LM Studio/Ollama for AMD ROCm (RX 7800 XT - 16GB VRAM).
    - [ ] Test Q6_K/Q8_0 quantization performance (100% VRAM allocated to AI now that 3D is removed).
- [ ] **Service Transition:**
    - [ ] Switch `llmService.ts` from OpenAI to the Local Tunnel endpoint.

## 🔵 Phase 4: The Fourth Wall (Web-Augmented Generation)
- [ ] **Web Search Integration:**
    - [ ] Implement a backend/service scraper using a free parser (DuckDuckGo).
    - [ ] Create a query-generator logic to extract search terms from player arguments.
- [ ] **RAG Pipeline (Context Injection):**
    - [ ] Build a context-aggregator that scrapes the top 3-5 results.
    - [ ] Update NPC system prompts to dynamically inject `[REAL-WORLD DATA]` blocks.
- [ ] **Narrative Triggering:**
    - [ ] Implement logic for the AI to "suddenly" mention current events, weather, or real-world facts to intimidate the player.

## ⚪ Phase 5: Production & Final Polish
- [ ] **Atmospheric VFX:** Add deeper Film Grain, Vignette, and CRT scan-line post-processing over the comic panels.
- [ ] **Audio Engine:** Implement dark ambient background music and "typewriter/terminal" sound effects for text generation.
- [ ] **Game Loop Completion:** Add "Win/Loss" conditions for debates based on AI sentiment analysis (e.g., did the player convince the AI or fail?).
- [ ] **Deployment:** Final deployment of the React frontend to Firebase/Vercel.

---

## Tech Stack Summary
- **Frontend:** React, Framer Motion, Tailwind CSS, Zustand, Lucide React.
- **AI Backend:** Local LM Studio (AMD ROCm) + Qwen2.5-14B-Instruct.
- **Connectivity:** Cloudflare Tunnel.
- **External Data:** DuckDuckGo Web Scraper (Free Tier).