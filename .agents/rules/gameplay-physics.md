# Файл: .agents/rules/gameplay-physics.md

---
activation: Always On
glob: "src/engine/**/*.ts, src/gameplay/**/*.ts, src/components/**/*.tsx"
---

# Gameplay, Physics, and 3D Rendering Standards

- **Time Management:** Always use `deltaTime` (time elapsed since the last frame) for movement, physics, velocity vectors, and particle systems.
- **Physics Formula Pattern:** Strictly use `position.add(velocity.clone().multiplyScalar(deltaTime))`.
- **Game Balance:** Never use magic numbers or hardcode values for gameplay parameters (health, damage, gravity, friction). Fetch all balance parameters from `config/gameBalance.json`. If a parameter is missing, add it to the JSON first.
- **Three.js Memory Management:** Minimize the instantiation of new `Vector3`, `Matrix4`, or `Quaternion` objects inside the `render()` loop or `requestAnimationFrame`. Reuse pre-allocated memory objects to prevent Garbage Collector spikes and stutters.
- **Cleanup:** Always implement `.dispose()` for geometries and materials when unmounting React components containing Three.js objects to prevent memory leaks.
- **Design System:** Strictly follow the visual guidelines defined in @DESIGN.md.
