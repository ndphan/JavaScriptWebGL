# Endless Horde Runner — Developer Guide

This document describes how to build an endless forward-moving horde runner using the JavaScriptWebGL engine.

## Goals
- Avoid manual level design
- Use procedural algorithms for infinite gameplay
- Keep implementation simple and engine-friendly
- Reuse the existing ExampleApp architecture

## 1. Game Concept

Player auto-forwards through a corridor while waves of enemies and powerups approach. Shooting enemies reduces danger; shooting powerups increases speed/progression. Periodic bosses mark milestones.

## 2. Why This Fits the Engine

Design constraints (keeps the game compatible with the engine):
- No navmesh, pathfinding, or skeletal animation
- No physics engine or terrain generation
- Minimal AI

Core relies on:
- Deterministic update loop
- Simple transforms and reuseable meshes
- Chunk-based, time-ordered spawning

## 3. High-Level Architecture

Create a new app based on `ExampleApp`.

Suggested layout:
```
ExampleApp/
 ├─ EndlessRunnerApp/
 │   ├─ EndlessRunnerApp.ts
 │   ├─ systems/
 │   │   ├─ WaveSystem.ts
 │   │   ├─ SpawnSystem.ts
 │   │   ├─ CollisionSystem.ts
 │   │   └─ BotSystem.ts (optional)
 │   ├─ entities/
 │   │   ├─ Player.ts
 │   │   ├─ Enemy.ts
 │   │   ├─ Powerup.ts
 │   │   └─ Boss.ts
 │   └─ data/
 │       └─ waves.ts (optional presets)
```

Keep: camera setup, render loop, asset loading, input polling. Replace scene and update logic with the endless-runner systems.

Example skeleton:
```ts
export class EndlessRunnerApp extends ExampleApp {
  update(dt: number) {
    this.game.update(dt);
    this.renderer.render(this.scene, this.camera);
  }
}
```

## 4. Core Game Rules

Movement
- Player always moves forward on Z
- Player moves left/right on X only
- Y is fixed or cosmetic

Example update formula:
```ts
player.z += baseSpeed * speedMultiplier * dt
```

Camera
- Fixed behind the player; optional subtle sway

World illusion
- Move the world toward the player to avoid large Z values:
```ts
worldOffsetZ -= playerSpeed * dt
```

## 5. Entity Model

Player: `speedMultiplier`, `fireRate`, `damage`, `health`

Enemy: `speed`, `health`, `damage`, `laneIndex`
- Behavior: move toward player on Z; optional X wobble; no complex decision trees

Powerup: `type` ("speed" | "fireRate" | "score"), `riskValue`

Boss: large hitbox, high health, simple time/HP phases

## 6. Lanes (No Free Movement)

Define fixed X lanes, e.g.:
```ts
const LANES = [-1.5, -0.5, 0.5, 1.5];
```
All spawnable entities align to lanes. Benefits: simpler collision checks, readable gameplay, no level design.

## 7. Endless Battle Algorithm

Global difficulty scalar (single source of scaling):
```ts
difficulty = 1 + minutesPlayed * 0.6
```

Wave-based loop:
```ts
while (playerAlive) {
  wave = generateWave(difficulty);
  runWave(wave);
  difficulty += 0.2;
}
```

Wave types: `horde`, `charger`, `sniper`, `reward`, `boss` (periodic).

Weighted selection example:
```js
weights = {
  horde: 4,
  charger: difficulty > 3 ? 2 : 0,
  sniper: difficulty > 5 ? 1 : 0,
  reward: 2,
  boss: waveCount % 10 === 0 ? 3 : 0
}
```

Enemy count:
```js
enemyCount = Math.floor(baseCount * difficulty * waveMultiplier);
// clamp to engine-safe limits
```

Spawn timing (spread spawns over the wave):
```js
spawnInterval = lerp(1.2, 0.2, difficulty / maxDifficulty);
```

Each wave duration: 5–15 seconds (tweak for feel).

## 8. Chunk-Based Spawning

Represent waves as ordered chunks (duration + spawn events):

```
Chunk {
  duration: number,
  spawns: SpawnEvent[]
}

SpawnEvent {
  time: number,
  type: 'enemy' | 'powerup' | 'boss',
  lane: number
}
```

Keep only the current and next chunk in memory; destroy entities that pass behind the player.

## 9. Risk / Reward

Powerups are deliberate hazards. Example:
```js
if (shotPowerup) {
  player.speedMultiplier += 0.2;
  enemySpeed *= 1.1;
}
```

This enables player-driven difficulty scaling.

## 10. Boss Scheduling

Make boss encounters predictable (no random bosses):
```js
if (waveCount % 8 === 0) spawnMiniBoss();
if (waveCount % 25 === 0) spawnBoss();
```
Scale boss stats by `difficulty`.

## 11. Collision

- Ignore Y axis for checks
- Use circle or AABB in XZ plane
- Only test nearby entities

Collision test:
```
distanceXZ < radiusSum
```

## 12. Determinism & Testing

Seeded runs facilitate reproducible tests:
```js
seed = dailySeed || randomSeed;
```

Provide simple bot input for regression:
```
if (enemyAhead) shoot();
else if (powerupSafe) shoot();
else dodge();
```

## 13. MVP Roadmap

Phase 1 — Foundation:
- Player auto-forward movement
- Single enemy type, shooting, lanes

Phase 2 — Endless logic:
- Wave generator, chunk spawner, difficulty scalar

Phase 3 — Depth:
- Powerups, risk/reward, mini-boss

Phase 4 — Polish:
- Boss, UI, sound, replay testing

## 14. Scope Constraint

Avoid features that require heavy systems (pathfinding, complex animation, large content). Favor emergence from numbers, timing, and spawning rules.

## Final Note

This design is intentionally simple, testable, and scalable while fitting the existing engine.
