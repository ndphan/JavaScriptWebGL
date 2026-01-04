import { EntityManager, Rect3d, EngineHelper } from "synaren-engine";
import Cube from "../../../Cube";
import { LANES } from "../data/waves";

export default class Projectile extends EntityManager {
  speed: number = 10;
  laneIndex: number;
  cube: Cube;
  isDestroyed: boolean = false;

  constructor(laneIndex: number, startZ: number) {
    super();
    this.laneIndex = laneIndex;
    this.setRect(new Rect3d(LANES[laneIndex], 1, startZ, 0.2, 0.2, 0.2));
  }

  init(engineHelper: EngineHelper) {
    this.cube = new Cube(
      this.getRect(),
      "assets/atlas.png",
      ["paper", "paper", "paper", "paper", "paper", "paper"]
    );
    this.entities.push(this.cube);
    this.cube.init(engineHelper);
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    const dt = 1/60;
    if (this.isDestroyed) return;
    
    // Move forward (positive Z direction)
    this.position.z += this.speed * dt;
    
    if (this.cube) {
      this.cube.center(LANES[this.laneIndex], 1, this.position.z);
    }
  }

  isOffScreen(): boolean {
    return this.position.z > 20;
  }

  render(engineHelper: EngineHelper) {
    if (!this.isDestroyed && !this.isOffScreen() && this.cube) {
      this.cube.render(engineHelper);
    }
  }
}
