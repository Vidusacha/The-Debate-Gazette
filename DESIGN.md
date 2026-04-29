# Файл: DESIGN.md
# "The Debate Gazette" - Global Design System & UI Guidelines

This document is the single source of truth for all visual elements, UI components, and 3D scene aesthetics. All generated React components, CSS/Tailwind classes, and Three.js materials MUST strictly adhere to these guidelines.

## 1. Core Theme & Atmosphere
- **Genre/Vibe:** Dark Narrative, Political Noir, Retro-Tech.
- **Lighting (Three.js):** Low-key lighting, high contrast. Use stark directional lights to create dramatic, sharp shadows (Film Noir style). Ambient light should be minimal and cold.

## 2. Color Palette
Strictly use these hex codes for all UI elements. Do not invent new colors.

- **Backgrounds (The Void):**
  - Base Background: `#0A0A0C` (Deepest charcoal/almost black)
  - Panel/Menu Background: `#16161D` (Dark grey, use at 80% opacity for glassmorphism/UI panels)
- **Typography (The Ink):**
  - Primary Text: `#E0E0E0` (Off-white, faded newspaper feel)
  - Muted/Secondary Text: `#6B7280` (Cool gray)
- **Accents (The Truth & The Lie):**
  - Primary Accent (Gazette Red): `#8B0000` (Dark Blood Red - use for critical alerts, enemy highlights, or rejected debate arguments)
  - Secondary Accent (Typewriter Gold): `#D4AF37` (Muted Gold - use for selected items, successful debate points, or active UI elements)

## 3. Typography
- **Headings (Titles, Newspaper Headers, Main Menus):** Use a Serif font to evoke a classic print media feel. 
  - `font-family: 'Playfair Display', 'Merriweather', serif;`
- **Body & UI (Dialogues, Stats, Buttons):** Use a clean Monospace or sans-serif font for a terminal/investigator feel.
  - `font-family: 'Courier New', 'Roboto Mono', monospace;`

## 4. UI Component Geometry & Layout
- **Spacing:** Use a strict 4px/8px grid system for padding and margins (`p-2`, `m-4` in Tailwind).
- **Borders:** UI panels and buttons should have sharp, zero-radius corners (`border-radius: 0px;`). Borders should be thin (1px) and use the Secondary Accent or Muted Text color.
- **Buttons:** - Default: Transparent background, 1px solid border.
  - Hover State: Invert colors (Background becomes Accent color, Text becomes Base Background). Include a fast, snappy transition (`transition: all 0.15s ease-in-out`).

## 5. Animated Comic Book Guidelines (Framer Motion)
- **Layout:** The interface should resemble a dynamic graphic novel. The screen is divided into "Panels" (frames) separated by dark gutters.
- **Animations:** Use `framer-motion` for all transitions. Panels should slide in smoothly (`ease: "easeInOut"`) or fade in from the shadows. Text should appear using a typewriter effect.
- **Imagery:** Use placeholder `<div>` blocks with high-contrast Noir gradients (black to deep red/gold) or subtle CSS noise to represent comic illustrations until actual images are added.
- **Parallax:** Background elements within a panel should have subtle mouse-tracking parallax to give a 2.5D illusion.