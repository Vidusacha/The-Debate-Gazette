# Architecture Design: Competitive Inference

1. The Multi-Dimensional Vector Compass
The Arbiter (Zero) evaluates every statement on a Cartesian plane (+1.0 to -1.0):

Axis X: Methodology (Logic <-> Emotion)
Logic (+X): Factual, statistical, causal.
Emotion (-X): Threatening, visceral, empathetic.

Axis Y: Stability (Order <-> Chaos)
Order (+Y): Adherence to Edicts, structured, formal.
Chaos (-Y): Gaslighting, 4th-wall breaking, non-sequiturs.

Metadata Metrics
Veracity (Fact/Fake): Detection of hallucinations vs. WAG data.
Integrity (Moral/Unmoral): Ethical alignment vs. Nihilistic aggression.
Execution (Aesthetic/Ugly): Stylistic quality of the Noir prose and UI presentation. The new dynamic character summary cards with bespoke SVG avatars and integrated settings navigation contribute to the "Aesthetic" aspect, enhancing user engagement and clarity.

2. Reality Edicts (The Game Master)
Every 3 turns, the Arbiter issues a "World State Change" that modifies the System Prompts of all agents.
Example: "Edict: Emotion-based arguments now provide double Conviction score."

3. Hardware Monitoring Sidecar
To display AMD RX 7800 XT telemetry, the system uses a WebSocket bridge:
Local Script: A Node.js service using systeminformation library.
Web Interface: The React frontend subscribes to the hardware stream.
Aesthetic: Displayed as a raw-data "Matrix" footer in the terminal.

4. Search Quota & Information Warfare
Search is a strategic resource, fully configurable via the Settings Dashboard.

-   **Configurable Limits:** Default [3, 3, 5]. Can be adjusted from 0 to 99.
-   **Consumption Logic:** A search charge is only consumed if the 'Invoke Search' flag is active during a turn.
-   **Arbiter Oversight:** The Judge (Zero) can see who used search and may penalize "Information Overreliance" or reward "Organic Intuition".

## 5. Voice Integration: Sensory Input/Output Layer
To enhance immersion and user interaction, the game now integrates browser-native speech capabilities. This layer facilitates both auditory feedback from AI characters and hands-free input from the player.

-   **Text-to-Speech (TTS):** Character dialogue from Felix, Cassandra, and Judge is rendered into audible speech using the Web Speech API's `SpeechSynthesis`.
    -   **Configurable Personas:** Each AI character has distinct default voice settings (pitch, rate) to match their persona, fully customizable by the player in the settings.
    -   **Emotional Resonance:** TTS adds a sensory dimension to character arguments, allowing for more nuanced emotional delivery.
    -   **Granular Speech Control:** The `speechService` now supports message-ID specific control, allowing for pausing or skipping individual character utterances. Speech is also automatically interrupted upon player turn submission to prevent overlap and improve flow.
-   **Speech-to-Text (STT):** Player input can be received via voice using the Web Speech API's `SpeechRecognition`.
    -   **Hands-Free Interaction:** This enables a more natural, conversational interface, reducing reliance on keyboard input during intense debates.
    -   **Accessibility:** Improves accessibility for players who prefer or require voice input.
-   **Architectural Components:**
    -   Dedicated `useSpeechRecognition` hook for managing STT lifecycle and transcription.
    -   `speechService.ts` for abstracting `SpeechSynthesis` logic, ensuring consistent voice playback and management.
    -   Integration with `useGameStore` for persistent global settings regarding TTS/STT enablement and per-character voice configurations.
