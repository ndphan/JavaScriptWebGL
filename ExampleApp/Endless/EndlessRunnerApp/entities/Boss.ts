import { EntityManager, Rect3d, EngineHelper, PlaneType } from "synaren-engine";
import Plane3d from "../../../../src/Entity/Plane3d";
import { LANES } from "../data/waves";

export default class Boss extends EntityManager {
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  sprite: Plane3d;
  isDestroyed: boolean = false;
  phase: number = 1;
  width = 1.2;
  height = 1.2;
  laneIndex: number;
  cube: Plane3d | null = null;
  startZ: number;

  constructor(laneIndex: number, startZ: number, difficulty: number) {
    super();
    this.laneIndex = laneIndex;
    this.startZ = startZ;
    this.maxHealth = Math.floor(8 + difficulty * 3);
    this.health = this.maxHealth;
    this.damage = 2;
    this.speed = 0.08 + difficulty * 0.01;
  }

  init(engineHelper: EngineHelper) {
    this.sprite = new Plane3d(new Rect3d(LANES[this.laneIndex], 1, this.startZ, this.width, this.height, 0.1), engineHelper.newVertexModel("grass", PlaneType.XY));
    this.sprite.init(engineHelper);
    this.entities.push(this.sprite);
    this.cube = this.sprite;
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (!this.isDestroyed) {
      const healthPercent = this.health / this.maxHealth;
      this.phase = healthPercent > 0.66 ? 1 : healthPercent > 0.33 ? 2 : 3;
      const phaseSpeedMultiplier = this.phase === 3 ? 1.5 : this.phase === 2 ? 1.2 : 1.0;
      this.sprite.translate(0, 0, -this.speed * phaseSpeedMultiplier);
    }
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
    return this.sprite.position.z < -10;
  }

  render(engineHelper: EngineHelper) {
    if (!this.isDestroyed) {
      this.sprite.render(engineHelper);
    }
  }
}
