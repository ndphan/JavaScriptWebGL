import { generateWave } from "../data/waves";
import SpawnSystem from "./SpawnSystem";

export default class WaveSystem {
  spawnSystem: SpawnSystem;
  waveCount: number = 0;
  difficulty: number = 1;
  startTime: number;
  
  constructor(spawnSystem: SpawnSystem) {
    this.spawnSystem = spawnSystem;
    this.startTime = Date.now() / 1000;
  }

  update(engineHelper: any, gameEntities: any[], playerSpeed: number): void {
    const dt = 1/60; // Fixed timestep
    // Update difficulty based on time played
    const minutesPlayed = (Date.now() / 1000 - this.startTime) / 60;
    this.difficulty = 1 + minutesPlayed * 0.6;
    this.spawnSystem.setDifficulty(this.difficulty);

    // Check if current chunk is complete
    const chunkComplete = this.spawnSystem.update(engineHelper, gameEntities, playerSpeed);
    
    if (chunkComplete || !this.spawnSystem.currentChunk) {
      this.generateNextWave();
    }
  }

  private generateNextWave(): void {
    this.waveCount++;
    const wave = generateWave(this.difficulty, this.waveCount);
    this.spawnSystem.setChunk(wave);
    
    // Increase difficulty slightly after each wave
    this.difficulty += 0.2;
  }

  getDifficulty(): number {
    return this.difficulty;
  }

  getWaveCount(): number {
    return this.waveCount;
  }
}