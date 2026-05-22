# Usage Guide: Upgraded Debate Engine & Git Auto-Pilot

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
1. **Frank's Publish:** Input a logical argument or real-world news item.
2. **First Judgement:** Judge Solomon Balance analyzes Frank's text. A high logic (`x > 0.1`) or verification (`z > 0.1`) score deals direct damage to Cassandra's stubbornness (conviction).
3. **Felix's Spin:** Dr. Felix Sycophant intercedes, explaining why Frank's statement is the pinnacle of intellectual triumph, utilizing elegant Russian vocabulary, verbose sycophancy, and Tavily intel. If Felix scores highly on logic, it further reduces Cassandra's conviction.
4. **Cassandra's Noir Counter-Blow:** Cassandra Cynic queries local models, seeking to shred the player's claims, detect fallacies, and insult Felix's spineless behavior. High scores by Cassandra inflict heavy conviction damage on Felix!
5. **Reality Warp:** Every 3 rounds, Judge Balance interrupts the debate, reviews the overall tone, and issues a **Reality Edict** (e.g., "Chaos reigns; logic is banned") that participants must adhere to under penalty of heavy instability (low `y` score).

### 2. Ideological Side-Switching (Mental Break)
- **Cassandra Switched:** When Cassandra's stubbornness drops to `0%`, she suffers an ideological breakdown. She switches sides to agree with Frank, turns her noir weapons onto her own past arguments, and praises Frank's intellect with self-deprecating irony.
- **Felix Switched:** When Felix's conviction drops to `0%`, he betrays Frank! He switches sides to agree with Cassandra, labels Frank an intellectual fraud, and praises Cassandra as a goddess of pure logic.

### 3. Settings & Injections Panel
You can customize the debate dynamics on the fly using the **Settings Drawer**:
* **Gemini Deep Research:** Checkboxes enabling Felix and/or Cassandra to automatically spend Tavily search charges to pull live context for every statement.
* **Prompt Injections:** Enable or disable targeted linguistic behaviors:
  - *Ad Hominem Attacks:* Unlocks hostile, direct personal insults.
  - *Sarcasm:* Directs models to coat their arguments in biting, cynical irony.
  - *Profanity & Slang:* Permits gritty noir language and expletives to flow naturally in character monologues.

---

## 📝 Rules for GIT Operators & The Auto-Pilot Script

### The `git auto` Pipeline
To make git operations effortless and ensure that the codebase remains fully documented and clean, we have introduced a **Gemini-Powered Git Auto-Pilot** script.

When you invoke the Git Auto-Pilot (by typing `git auto` in your terminal):
1. **Delta Analysis:** The script automatically runs a `git diff` on all modifications in the directory.
2. **Gemini Review:** The diff is sent to Google Gemini, which:
   - Evaluates the structural and design changes.
   - Summarizes the changes in a clear, professional, semantic commit message detailing *why* the changes were made, not just *what*.
   - Verifies whether support documentation (`README.md`, `usage.md`) matches the code update. If a mismatch is found, it automatically writes updates for those files!
3. **Stage & Commit:** All changes (including updated documentation) are automatically staged and committed.
4. **Push:** The script pushes the commit to the active remote branch.

### How to Invoke
* Just type `git auto` (or run `./git-auto.sh`) from the project root!
* The local Git configuration has been updated with a local alias mapping `git auto` to this automated script, preserving repository-level encapsulation.
