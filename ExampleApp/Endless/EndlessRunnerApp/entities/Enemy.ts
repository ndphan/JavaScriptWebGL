import { EntityManager, Rect3d, EngineHelper } from "synaren-engine";
import Cube from "../../../Cube";
import { LANES } from "../data/waves";

export default class Enemy extends EntityManager {
  speed: number;
  health: number;
  damage: number;
  laneIndex: number;
  cube: Cube;
  isDestroyed: boolean = false;

  constructor(laneIndex: number, startZ: number, difficulty: number) {
    super();
    this.laneIndex = laneIndex;
    this.speed = 1 + difficulty * 0.2;
    this.health = Math.floor(1 + difficulty * 0.3);
    this.damage = 1;
    
    this.setRect(new Rect3d(LANES[laneIndex], 1, startZ, 0.9, 0.9, 0.9));
  }

  init(engineHelper: EngineHelper) {
    this.cube = new Cube(
      this.getRect(),
      "assets/atlas.png",
      ["rock", "rock", "rock", "rock", "rock", "rock"]
    );
    this.entities.push(this.cube);
    this.cube.init(engineHelper);
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (this.isDestroyed) return;
    
    this.position.z -= this.speed * (1/60);
    
    if (this.cube) {
      this.cube.center(LANES[this.laneIndex], 1, this.position.z);
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
    return this.position.z < -10;
  }

  render(engineHelper: EngineHelper) {
    if (!this.isDestroyed && this.cube) {
      this.cube.render(engineHelper);
    }
  }
}
