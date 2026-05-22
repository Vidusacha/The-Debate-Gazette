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

*   **Frontend:** React 19 + TypeScript + Zustand (State orchestration) + Framer Motion (Noir/Comic pane aesthetics) + TailwindCSS v4.
*   **Speech Integration:** Web Speech API (Browser-native Text-to-Speech for character dialogue & Speech-to-Text for player input).
*   **Local Inference:** LM Studio / Ollama (OpenAI-compatible HTTP Endpoint) on port `1234`.
*   **Cloud Inference:** Google Gemini 2.5 Flash SDK (`@google/generative-ai`).
*   **Web Search Integration:** Tavily AI (Real-World context scanning for live debate relevance).
*   **Analytical UI Drawers:**
    1.  **Scoreboard Feed:** Tracks 5-axis metrics (Logic vs Emotion, Order vs Chaos, Truth vs Spin, Respect vs Hostility, Academic vs Cynicism), round tracking, and conviction levels.
    2.  **Fallacies Bureau (16-Point Audit):** A comprehensive directory mapping 16 formal and informal logical fallacies (e.g., *Ad Hominem*, *Straw Man*, *Moving Goalposts*) detected in speakers' claims.
    3.  **Settings Dashboard:** A comprehensive, dynamically navigable panel for fine-tuning game mechanics. Now features direct access to character-specific settings via dedicated buttons on the main canvas, along with visual feedback (glow-flash) for active sections.

---

## 🚀 Setup

1.  **Local LLM:** Launch LM Studio/Ollama, load a suitable reasoning/chat model (e.g., `Ministral 14B Reasoning`), and start the local server on port `1234` with CORS enabled.
2.  **Environment:** Create a `.env` file in the root directory:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_GEMINI_MODEL_NAME=gemini-2.5-flash
    VITE_TAVILY_API_KEY=your_tavily_api_key
    LOCAL_LLM_API_BASE=http://localhost:1234/v1
    LOCAL_LLM_API_KEY=lm-studio-local
    ```
3.  **Install:** `npm install`
4.  **Dev:** `npm run dev`


---

## 📝 Rules for GIT Operators & The Git Auto-Pilot (v1.3.0)

### The `git auto` Pipeline
To make git operations effortless and ensure that the codebase remains fully documented and clean, we have introduced a **Gemini-Powered Git Auto-Pilot** script.

When you invoke the Git Auto-Pilot (by typing `git auto` in your terminal):
1.  **Delta Analysis:** The script automatically runs a `git diff` on all modifications in the directory.
2.  **Gemini Review & Documentation:** The diff, along with existing markdown support files, is sent to Google Gemini, which performs a comprehensive analysis:
    -   It evaluates structural and design changes, then synthesizes a professional, semantic commit message detailing *why* the changes were made, not just *what*.
    -   It dynamically checks whether any existing support documentation (e.g., `README.md`, `usage.md`, `DESIGN.md`) is outdated, incomplete, or lacks information regarding the introduced code changes. If a mismatch is found, it automatically writes the FULL, updated content for those files directly to disk.
    -   The response from Gemini is a structured JSON object, encapsulating both the commit message and any necessary file updates.
3.  **Stage & Commit:** All changes, including any dynamically updated documentation files, are automatically staged and committed.
4.  **Push Changes & Set Upstream:** The script now dynamically determines the current branch and uses `git push --set-upstream origin "$CURRENT_BRANCH"` to push the commit. This automatically sets the upstream tracking for new branches, streamlining the first push and ensuring all branches are properly linked to their remote counterparts.

### How to Invoke
*   Just type `git auto` (or run `./git-auto.sh`) from the project root!
*   The local Git configuration has been updated with a local alias mapping `git auto` to this automated script, preserving repository-level encapsulation.
