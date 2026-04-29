# The Debate Gazette

**"The Truth is written in ink, but the Lies are rendered in real-time."**

The Debate Gazette is a high-fidelity, narrative-driven experience built using a hybrid Vibe-Coding pipeline. It combines the atmospheric depth of Political Noir with cutting-edge 3D web technologies.

## 👁️ The Vision
A browser-based investigation and social deduction game where the player navigates a desaturated world of political intrigue. The core experience centers around "The Gazette" – a medium through which the player manipulates public opinion and uncovers redacted truths.

## 🛠️ Tech Stack
- **Framework:** React + TypeScript + Vite
- **Animation:** Framer Motion (Cinematic Comic Panels)
- **Engine:** Three.js via R3F (Atmospherics)
- **Styling:** Tailwind CSS (Noir Design System)
- **AI Infrastructure:** Local LLM (Primary - LM Studio/Ollama) + Google AI Studio (Secondary)
- **State Management:** Zustand

## 🏗️ Architecture
- `src/engine/ComicCanvas.tsx`: Cinematic layout engine using dynamic panels.
- `src/components/GameLayout.tsx`: Main frame with header/footer CRT-style telemetry.
- `src/store/useGameStore.ts`: Phase-based state machine (Exploration ↔ Debate).
- `src/services/llmService.ts`: Real-time adversarial AI logic.

---
*Created and maintained by the Antigravity IDE Architect pipeline.*
