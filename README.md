# The Debate Gazette: Trialogue Noir

**A Sovereign AI Psychological Thriller & Competitive Inference Engine.**

Welcome to the forefront of AI-driven interactive narrative. In *The Debate Gazette*, you are Frank Schreiber, the Editor-in-Chief engaging in a high-stakes, real-time "Trialogue" against two clashing artificial intelligences, overseen by a ruthless, multi-dimensional digital Arbiter.

---

## 🎭 The Cast

### ✍️ Frank Schreiber (The Editor / Player)
The chief editor of the Gazette, attempting to write a groundbreaking story. Your inputs serve as the thematic catalyst. Your logic and citations determine the intellectual gravity of the debate.

### 🩺 Dr. Felix Sycophant (The Cloud AI Advocate)
* **Identity:** A highly polite, verbose, cloud-powered AI advocate.
* **Role:** Defends Frank’s arguments at all costs, using sophisticated spin, pseudo-scientific authority, and elaborate praise.
* **Dynamic:** If Felix's conviction is shattered by Cassandra's relentless counter-arguments, he will experience a sensational ideological pivot and switch sides, turning his verbal poison onto Frank!
* **Engine:** Powered by Google Gemini (Cloud Inference).

### 🔍 Cassandra Cynic (The Opponent)
* **Identity:** A battle-worn, noir-style detective with a Max Payne comic vibe.
* **Role:** Challenges the player's arguments with biting skepticism and dark, gritty realism.
* **Dynamic:** If Cassandra's conviction is crushed by Frank or Felix's sound logical arguments, she will grudgingly switch sides, mock her own previous stubbornness, and defend Frank's position.
* **Engine:** Powered by Local Inference (e.g., LM Studio/Ollama running local models).

### ⚖️ Judge Solomon Balance (The Arbiter & Editor-in-Chief)
* **Identity:** A cold, algorithmic auditor of speech and logic.
* **Role:** Evaluates every statement on a 5-axis JSON-based Compass and writes biting editorial verdicts.
* **Reality Edicts:** Every 3 rounds, Solomon issues a "Reality Edict" changing the rules of logic or scoring (e.g., "Sarcastic remarks represent the only absolute truth").
* **Engine:** Powered by Google Gemini (Cloud Inference).

---

## 🛠️ Technical Stack & Interfaces

* **Frontend:** React 19 + TypeScript + Zustand (State orchestration) + Framer Motion (Noir/Comic pane aesthetics) + TailwindCSS v4.
* **Local Inference:** LM Studio / Ollama (OpenAI-compatible HTTP Endpoint) on port `1234`.
* **Cloud Inference:** Google Gemini 2.5 Flash SDK (`@google/generative-ai`).
* **Web Search Integration:** Tavily AI (Real-World context scanning for live debate relevance).
* **Analytical UI Drawers:**
  1. **Scoreboard Feed:** Tracks 5-axis metrics (Logic vs Emotion, Order vs Chaos, Truth vs Spin, Respect vs Hostility, Academic vs Cynicism), round tracking, and conviction levels.
  2. **Fallacies Bureau (16-Point Audit):** A comprehensive directory mapping 16 formal and informal logical fallacies (e.g., *Ad Hominem*, *Straw Man*, *Moving Goalposts*) detected in speakers' claims.

---

## 🚀 Setup

1. **Local LLM:** Launch LM Studio/Ollama, load a suitable reasoning/chat model (e.g., `Ministral 14B Reasoning`), and start the local server on port `1234` with CORS enabled.
2. **Environment:** Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GEMINI_MODEL_NAME=gemini-2.5-flash
   VITE_TAVILY_API_KEY=your_tavily_api_key
   LOCAL_LLM_API_BASE=http://localhost:1234/v1
   LOCAL_LLM_API_KEY=lm-studio-local
   ```
3. **Install:** `npm install`
4. **Dev:** `npm run dev`
