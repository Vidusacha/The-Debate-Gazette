# Usage Guide: Upgraded Debate Engine & Git Auto-Pilot (v1.3.0)

This document defines how to interact with the upgraded **The Debate Gazette** codebase using AI agents, and outlines the advanced trialogue mechanics and automated git tools.

---

## 🚀 Working with the Pipeline

### Upgraded Trialogue Architecture (v1.1.0)
- **Comic Canvas:** Cinematic interaction model with multi-panel animations, active target selection, and custom SVG visual frameworks (like the Judge's central Balance scale).
- **5-Axis Vector Compass:** Every speech act is parsed into:
  - `x` (Methodology): Logic (+1.0) vs Emotion (-1.0)
  - `y` (Stability): Order (+1.0) vs Chaos (-1.0) — heavily impacted by active Reality Edicts!
  - `z` (Rhetorical Honesty): Verification (+1.0) vs Spin (-1.0)
  - `w` (Social Tone): Respect (+1.0) vs Hostility (-1.0)
  - `v` (Style): Academic (+1.0) vs Cynicism (-1.0)
- **Tavily Real-World Uplink:** Configure `VITE_TAVILY_API_KEY` to enable deep context-aware NPC responses fetching news, social signals, or local weather for the target.
- **Sovereign Local Inference:** Route Cassandra's thoughts to local inference servers (e.g. LM Studio/Ollama on `1234`) for raw, uncensored, zero-filter noir monologue generation.

---

## 🚀 Upgraded Game Mechanics

### 1. The Core Trialogue Loop
1.  **Frank's Publish:** Input a logical argument or real-world news item.
2.  **First Judgement:** Judge Solomon Balance analyzes Frank's text. A high logic (`x > 0.1`) or verification (`z > 0.1`) score deals direct damage to Cassandra's stubbornness (conviction).
3.  **Felix's Spin:** Dr. Felix Sycophant intercedes, explaining why Frank's statement is the pinnacle of intellectual triumph, utilizing elegant Russian vocabulary, verbose sycophancy, and Tavily intel. If Felix scores highly on logic, it further reduces Cassandra's conviction.
4.  **Cassandra's Noir Counter-Blow:** Cassandra Cynic queries local models, seeking to shred the player's claims, detect fallacies, and insult Felix's spineless behavior. High scores by Cassandra inflict heavy conviction damage on Felix!
5.  **Reality Warp:** Every 3 rounds, Judge Balance interrupts the debate, reviews the overall tone, and issues a **Reality Edict** (e.g., "Chaos reigns; logic is banned") that participants must adhere to under penalty of heavy instability (low `y` score).

### 2. Ideological Side-Switching (Mental Break)
- **Cassandra Switched:** When Cassandra's stubbornness drops to `0%`, she suffers an ideological breakdown. She switches sides to agree with Frank, turns her noir weapons onto her own past arguments, and praises Frank's intellect with self-deprecating irony.
- **Felix Switched:** When Felix's conviction drops to `0%`, he betrays Frank! He switches sides to agree with Cassandra, labels Frank an intellectual fraud, and praises Cassandra as a goddess of pure logic.

### 3. Voice Integration: Immersive Dialogue & Hands-Free Input
- **Character Voicing (TTS):** All AI characters (Felix, Cassandra, Judge) now deliver their lines using Text-to-Speech (TTS) via the browser's native Web Speech API. This adds a crucial layer of immersion and distinct personality to each agent.
- **Player Voice Input (STT):** Players can now use Speech-to-Text (STT) to dictate their arguments and news items, enabling a hands-free, more natural interaction experience. The transcribed text appears directly in the input field.

### 4. Settings & Injections Panel
You can customize the debate dynamics on the fly using the **Settings Drawer**:
*   **Voice & Voicing (`Голос и Озвучка`):**
    -   **Character Voicing (TTS):** Toggle Text-to-Speech for AI characters. When enabled, you can customize individual voices.
    -   **Player Voice Input (STT):** Toggle Speech-to-Text for player input.
    -   **Character Voice Customization:** For each character (Felix, Cassandra, Judge), select from available system voices, and adjust their unique pitch and speech rate to fine-tune their persona.
*   **Gemini Deep Research:** Checkboxes enabling Felix and/or Cassandra to automatically spend Tavily search charges to pull live context for every statement.
*   **Prompt Injections:** Enable or disable targeted linguistic behaviors:
    -   *Ad Hominem Attacks:* Unlocks hostile, direct personal insults.
    -   *Sarcasm:* Directs models to coat their arguments in biting, cynical irony.
    -   *Profanity & Slang:* Permits gritty noir language and expletives to flow naturally in character monologues.

---

## 📝 Rules for GIT Operators & The Auto-Pilot Script

### The `git auto` Pipeline (v1.3.0)
To make git operations effortless and ensure that the codebase remains fully documented and clean, we have introduced a **Gemini-Powered Git Auto-Pilot** script. This enhanced version (`v1.3.0`) brings significant improvements in documentation automation and script robustness.

When you invoke the Git Auto-Pilot (by typing `git auto` in your terminal):
1.  **Delta Analysis:** The script automatically runs a `git diff` on all modifications in the directory.
2.  **Gemini Review & Dynamic Documentation:** The comprehensive `git diff`, along with the full contents of all discoverable markdown support files in the repository, is sent to Google Gemini. Gemini, now acting as a Senior Principal Software Engineer and Technical Writer, performs a multi-faceted analysis:
    -   It evaluates the structural, design, and functional changes introduced by the code delta.
    -   It generates a highly professional, semantic, and context-rich commit message that explains the "why" and design choices behind the modifications.
    -   Crucially, it dynamically assesses whether any existing markdown support files (e.g., `README.md`, `usage.md`, `DESIGN.md`, or other `.md` files) are outdated, incomplete, or lack documentation regarding new features, architectural changes, setup parameters, or usage instructions based on the provided diff.
    -   If updates are required for a file, Gemini generates its FULL, complete, and harmonized content. These updated files are then automatically written back to their original paths on disk.
    -   The entire response from Gemini is a structured JSON object, ensuring a standardized and parseable output that encapsulates both the proposed commit message and any necessary documentation updates.
    -   **Improved Environment Loading:** The script now robustly loads `.env` variables by first checking the current working directory, and then falling back to the script's installation directory, enhancing flexibility and portability.
    -   **Cross-Platform Path Resolution:** The script intelligently resolves absolute paths for its internal Node.js component, specifically handling Windows Subsystem for Linux (WSL) environments to ensure seamless operation across different OS configurations.
3.  **Stage & Commit:** All detected changes, including any dynamically updated documentation files, are automatically staged and committed.
4.  **Push Changes & Set Upstream:** The script now dynamically determines the current branch and uses `git push --set-upstream origin "$CURRENT_BRANCH"` to push the commit. This automatically sets the upstream tracking for new branches, streamlining the first push and ensuring all branches are properly linked to their remote counterparts.

### How to Invoke
*   Just type `git auto` (or run `./git-auto.sh`) from the project root!
*   The local Git configuration has been updated with a local alias mapping `git auto` to this automated script, preserving repository-level encapsulation.
