import { EntityManager, Rect3d, EngineHelper, PlaneType } from "synaren-engine";
import Plane3d from "../../../../src/Entity/Plane3d";
import { LANES } from "../data/waves";

export default class Player extends EntityManager {
  speedMultiplier: number = 1.0;
  fireRate: number = 0.5;
  damage: number = 1;
  health: number = 3;
  lastShotTime: number = 0;
  sprite: Plane3d;
  width = 0.8;
  height = 0.8;
  currentLane: number = 2;
  cube: Plane3d | null = null;

  constructor() {
    super();
  }

  init(engineHelper: EngineHelper) {
    this.sprite = new Plane3d(new Rect3d(LANES[this.currentLane], 1, 0, this.width, this.height, 0.1), engineHelper.newVertexModel("wood", PlaneType.XY));
    this.sprite.init(engineHelper);
    this.entities.push(this.sprite);
    this.cube = this.sprite;
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {}

  clampToBoundary() {
    const boundX = 1.0 - this.width / 2;
    const boundY = 1.0 - this.height / 2;
    const x = Math.max(-boundX, Math.min(boundX, this.sprite.position.x));
    const y = Math.max(-boundY, Math.min(boundY, this.sprite.position.y));
    this.sprite.center(x, y, 0);
  }

  canShoot(currentTime: number): boolean {
    return currentTime - this.lastShotTime >= this.fireRate;
  }

  shoot(currentTime: number) {
    if (this.canShoot(currentTime)) {
      this.lastShotTime = currentTime;
      return true;
    }
    return false;
  }

  moveLeft() {
    if (this.currentLane > 0) {
      this.currentLane--;
      this.sprite.center(LANES[this.currentLane], 1, this.sprite.position.z);
    }
  }

  moveRight() {
    if (this.currentLane < LANES.length - 1) {
      this.currentLane++;
      this.sprite.center(LANES[this.currentLane], 1, this.sprite.position.z);
    }
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    return this.health <= 0;
  }

  render(engineHelper: EngineHelper) {
    if (this.sprite) {
      this.sprite.render(engineHelper);
    }
  }
}