import { EntityManager, Rect3d, EngineHelper, PlaneType } from "synaren-engine";
import Plane3d from "../../../../src/Entity/Plane3d";
import { LANES } from "../data/waves";

export default class Enemy extends EntityManager {
  speed: number;
  health: number;
  damage: number;
  sprite: Plane3d;
  isDestroyed: boolean = false;
  width = 0.8;
  height = 0.8;
  laneIndex: number;
  cube: Plane3d | null = null;
  startZ: number;

  constructor(laneIndex: number, startZ: number, difficulty: number) {
    super();
    this.laneIndex = laneIndex;
    this.startZ = startZ;
    this.speed = 0.12 + difficulty * 0.008;
    this.health = Math.floor(1 + difficulty * 0.5);
    this.damage = 1;
  }

  init(engineHelper: EngineHelper) {
    this.sprite = new Plane3d(new Rect3d(LANES[this.laneIndex], 1, this.startZ, this.width, this.height, 0.1), engineHelper.newVertexModel("rock", PlaneType.XY));
    this.sprite.init(engineHelper);
    this.entities.push(this.sprite);
    this.cube = this.sprite;
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (!this.isDestroyed) {
      this.sprite.translate(0, 0, -this.speed);
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
