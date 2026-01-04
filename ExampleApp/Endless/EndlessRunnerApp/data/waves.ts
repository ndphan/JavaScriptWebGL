export interface SpawnEvent {
  time: number;
  type: 'enemy' | 'powerup' | 'boss';
  lane: number;
  zOffset?: number;
}

export interface Chunk {
  duration: number;
  spawns: SpawnEvent[];
}

export const LANES = [-1.5, -0.9, -0.3, 0.3, 0.9, 1.5];

export const WAVE_WEIGHTS = {
  horde: 4,
  charger: 2,
  sniper: 1,
  reward: 2,
  boss: 3
};

export function generateWave(difficulty: number, waveCount: number): Chunk {
  const isBossWave = waveCount % 8 === 0;
  
  if (isBossWave) {
    return {
      duration: 15,
      spawns: [{
        time: 2,
        type: 'boss' as const,
        lane: 1,
        zOffset: 0
      }]
    };
  }

  const waveType = selectWaveType(difficulty, waveCount);
  const enemyCount = Math.floor(Math.min(10 + difficulty * 3, 40));
  const duration = Math.max(5, 10 - difficulty * 0.5);
  const spawnInterval = Math.max(0.1, 0.5 - difficulty * 0.03);
  
  const spawns: SpawnEvent[] = [];
  
  // Spawn enemies in formations across multiple lanes
  for (let i = 0; i < enemyCount; i++) {
    const time = i * spawnInterval;
    
    // Every 2nd enemy, spawn across 4-5 lanes simultaneously
    if (i % 2 === 0 && i < enemyCount - 4) {
      const baseLane = Math.floor(Math.random() * 2);
      const lanesInFormation = Math.min(4 + Math.floor(difficulty / 2), 5);
      
      for (let j = 0; j < lanesInFormation; j++) {
        spawns.push({
          time,
          type: waveType === 'reward' ? 'powerup' : 'enemy',
          lane: baseLane + j,
          zOffset: Math.random() * 6 - 3 // Each enemy gets unique offset between -3 and +3
        });
      }
      i += lanesInFormation - 1;
    } else {
      const lane = Math.floor(Math.random() * LANES.length);
      spawns.push({
        time,
        type: waveType === 'reward' ? 'powerup' : 'enemy',
        lane,
        zOffset: Math.random() * 6 - 3
      });
    }
  }
  
  return { duration, spawns };
}

function selectWaveType(difficulty: number, waveCount: number): string {
  const weights = {
    horde: WAVE_WEIGHTS.horde,
    charger: difficulty > 3 ? WAVE_WEIGHTS.charger : 0,
    sniper: difficulty > 5 ? WAVE_WEIGHTS.sniper : 0,
    reward: WAVE_WEIGHTS.reward,
    boss: waveCount % 10 === 0 ? WAVE_WEIGHTS.boss : 0
  };
  
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (const [type, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return type;
  }
  
  return 'horde';
}