import { EntityManager, Rect3d, EngineHelper } from "synaren-engine";
import Cube from "../../../Cube";
import { LANES } from "../data/waves";

export default class Boss extends EntityManager {
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  laneIndex: number;
  cube: Cube;
  isDestroyed: boolean = false;
  phase: number = 1;

  constructor(laneIndex: number, startZ: number, difficulty: number) {
    super();
    this.laneIndex = laneIndex;
    this.maxHealth = Math.floor(5 + difficulty * 2);
    this.health = this.maxHealth;
    this.damage = 2;
    this.speed = 1.5 + difficulty * 0.2;
    
    // Larger hitbox for boss
    this.setRect(new Rect3d(LANES[laneIndex], 0.5, startZ, 1.2, 1.2, 1.2));
  }

  init(engineHelper: EngineHelper) {
    this.cube = new Cube(
      this.getRect(),
      "assets/atlas.png",
      ["grass", "grass", "grass", "grass", "grass", "grass"]
    );
    this.entities.push(this.cube);
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    const dt = 1/60; // Fixed timestep
    if (this.isDestroyed) return;
    
    // Update phase based on health
    const healthPercent = this.health / this.maxHealth;
    this.phase = healthPercent > 0.66 ? 1 : healthPercent > 0.33 ? 2 : 3;
    
    // Move toward player with phase-based speed
    const phaseSpeedMultiplier = this.phase === 3 ? 1.5 : this.phase === 2 ? 1.2 : 1.0;
    this.position.z -= this.speed * phaseSpeedMultiplier * dt;
    
    // Boss movement pattern - side to side in later phases
    if (this.phase >= 2) {
      const sideMovement = Math.sin(Date.now() * 0.002) * 0.3;
      if (this.cube) {
        this.cube.center(LANES[this.laneIndex] + sideMovement, 0.5, this.position.z);
      }
    } else {
      if (this.cube) {
        this.cube.center(LANES[this.laneIndex], 0.5, this.position.z);
      }
    }
    
    super.update(engineHelper);
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    if (this.health <= 0) {
      this.isDestroyed = true;
      return true;
    }
    return false;
  }

  isOffScreen(): boolean {
    return this.position.z < -10;
  }

  render(engineHelper: EngineHelper) {
    if (!this.isDestroyed && this.cube) {
      this.cube.render(engineHelper);
    }
  }
}