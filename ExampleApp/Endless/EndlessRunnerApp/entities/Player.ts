import { EntityManager, Rect3d, EngineHelper } from "synaren-engine";
import Cube from "../../../Cube";
import { LANES } from "../data/waves";

export default class Player extends EntityManager {
  speedMultiplier: number = 1.0;
  fireRate: number = 0.3;
  damage: number = 1;
  health: number = 3;
  currentLane: number = 2; // center lane
  lastShotTime: number = 0;
  cube: Cube;

  constructor() {
    super();
    this.setRect(new Rect3d(LANES[this.currentLane], 1, -1, 0.9, 0.9, 0.9)); // Player at z=-1, closer to camera
  }

  init(engineHelper: EngineHelper) {
    this.cube = new Cube(
      this.getRect(),
      "assets/atlas.png",
      ["wood", "wood", "wood", "wood", "wood", "wood"]
    );
    this.entities.push(this.cube);
    this.cube.init(engineHelper);
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    // Player doesn't move forward - enemies come to player
    // Update cube position when changing lanes
    if (this.cube) {
      this.cube.center(LANES[this.currentLane], 1, this.position.z);
    }
  }

  moveLeft() {
    if (this.currentLane > 0) {
      this.currentLane--;
    }
  }

  moveRight() {
    if (this.currentLane < LANES.length - 1) {
      this.currentLane++;
    }
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

  takeDamage(amount: number): boolean {
    this.health -= amount;
    return this.health <= 0;
  }

  render(engineHelper: EngineHelper) {
    if (this.cube) {
      this.cube.render(engineHelper);
    }
  }
}