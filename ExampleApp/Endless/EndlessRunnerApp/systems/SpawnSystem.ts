import { EngineHelper } from "synaren-engine";
import { Chunk, SpawnEvent, LANES } from "../data/waves";
import Enemy from "../entities/Enemy";
import Powerup, { PowerupType } from "../entities/Powerup";
import Boss from "../entities/Boss";

export default class SpawnSystem {
  currentChunk: Chunk | null = null;
  chunkStartTime: number = 0;
  spawnedEvents: Set<number> = new Set();
  worldOffsetZ: number = 0;
  difficulty: number = 1;

  setChunk(chunk: Chunk) {
    this.currentChunk = chunk;
    this.chunkStartTime = Date.now() / 1000;
    this.spawnedEvents.clear();
  }

  update(engineHelper: EngineHelper, gameEntities: any[], playerSpeed: number) {
    if (!this.currentChunk) return false;

    const dt = 1/60; // Fixed timestep
    // Update world offset to avoid large Z values
    this.worldOffsetZ -= playerSpeed * dt;

    const currentTime = Date.now() / 1000;
    const chunkTime = currentTime - this.chunkStartTime;

    // Process spawn events
    this.currentChunk.spawns.forEach((spawn, index) => {
      if (!this.spawnedEvents.has(index) && chunkTime >= spawn.time) {
        this.spawnEntity(spawn, gameEntities, engineHelper);
        this.spawnedEvents.add(index);
      }
    });

    // Check if chunk is complete
    return chunkTime >= this.currentChunk.duration;
  }

  private spawnEntity(spawn: SpawnEvent, gameEntities: any[], engineHelper: EngineHelper) {
    const baseSpawnZ = 25;
    const spawnZ = baseSpawnZ + (spawn.zOffset || 0);

    switch (spawn.type) {
      case 'enemy':
        const enemy = new Enemy(spawn.lane, spawnZ, this.difficulty);
        enemy.init(engineHelper);
        gameEntities.push(enemy);
        console.log('Spawned enemy at lane', spawn.lane, 'z:', spawnZ);
        break;
      case 'powerup':
        const powerupTypes: PowerupType[] = ["speed", "fireRate", "score"];
        const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        const powerup = new Powerup(spawn.lane, spawnZ, randomType);
        powerup.init(engineHelper);
        gameEntities.push(powerup);
        console.log('Spawned powerup at lane', spawn.lane, 'z:', spawnZ);
        break;
      case 'boss':
        const boss = new Boss(spawn.lane, spawnZ, this.difficulty);
        boss.init(engineHelper);
        gameEntities.push(boss);
        console.log('Spawned boss at lane', spawn.lane, 'z:', spawnZ);
        break;
    }
  }

  setDifficulty(difficulty: number) {
    this.difficulty = difficulty;
  }
}