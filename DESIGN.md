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
Execution (Aesthetic/Ugly): Stylistic quality of the Noir prose.

2. Reality Edicts (The Game Master)
Every 3 turns, the Arbiter issues a "World State Change" that modifies the System Prompts of all agents.
Example: "Edict: Emotion-based arguments now provide double Conviction score."

3. Hardware Monitoring Sidecar
To display AMD RX 7800 XT telemetry, the system uses a WebSocket bridge:
Local Script: A Node.js service using systeminformation library.
Web Interface: The React frontend subscribes to the hardware stream.
Aesthetic: Displayed as a raw-data "Matrix" footer in the terminal.

## 4. Search Quota & Information Warfare
Search is a strategic resource, fully configurable via the Settings Dashboard.

- **Configurable Limits:** Default [3, 3, 5]. Can be adjusted from 0 to 99.
- **Consumption Logic:** A search charge is only consumed if the 'Invoke Search' flag is active during a turn.
- **Arbiter Oversight:** The Judge (Zero) can see who used search and may penalize "Information Overreliance" or reward "Organic Intuition".