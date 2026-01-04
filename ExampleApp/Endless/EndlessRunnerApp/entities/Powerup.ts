import { EntityManager, Rect3d, EngineHelper } from "synaren-engine";
import Cube from "../../../Cube";
import { LANES } from "../data/waves";

export type PowerupType = "speed" | "fireRate" | "score";

export default class Powerup extends EntityManager {
  type: PowerupType;
  riskValue: number;
  laneIndex: number;
  cube: Cube;
  isDestroyed: boolean = false;

  constructor(laneIndex: number, startZ: number, type: PowerupType) {
    super();
    this.laneIndex = laneIndex;
    this.type = type;
    this.riskValue = 0.2;
    
    this.setRect(new Rect3d(LANES[laneIndex], 0.5, startZ, 0.5, 0.5, 0.5));
  }

  init(engineHelper: EngineHelper) {
    const texture = this.type === "speed" ? "sky" : 
                   this.type === "fireRate" ? "cloth" : "paper";
    
    this.cube = new Cube(
      this.getRect(),
      "assets/atlas.png",
      [texture, texture, texture, texture, texture, texture]
    );
    this.entities.push(this.cube);
    this.cube.init(engineHelper);
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (this.isDestroyed) return;
    
    this.position.z -= 2 * (1/60);
    this.position.ay += 2;
    
    if (this.cube) {
      this.cube.center(LANES[this.laneIndex], 0.5, this.position.z);
      this.cube.angleY(this.position.ay);
    }
  }

  collect(): void {
    this.isDestroyed = true;
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
