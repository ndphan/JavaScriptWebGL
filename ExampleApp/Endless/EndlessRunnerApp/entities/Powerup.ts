import { EntityManager, Rect3d, EngineHelper, PlaneType } from "synaren-engine";
import Plane3d from "../../../../src/Entity/Plane3d";
import { LANES } from "../data/waves";

export type PowerupType = "speed" | "fireRate" | "score";

export default class Powerup extends EntityManager {
  type: PowerupType;
  riskValue: number;
  sprite: Plane3d;
  isDestroyed: boolean = false;
  width = 0.6;
  height = 0.6;
  laneIndex: number;
  startZ: number;

  constructor(laneIndex: number, startZ: number, type: PowerupType) {
    super();
    this.laneIndex = laneIndex;
    this.startZ = startZ;
    this.type = type;
    this.riskValue = 0.2;
  }

  init(engineHelper: EngineHelper) {
    this.sprite = new Plane3d(new Rect3d(LANES[this.laneIndex], 1, this.startZ, this.width, this.height, 0.1), engineHelper.newVertexModel("sky", PlaneType.XY));
    this.sprite.init(engineHelper);
    this.entities.push(this.sprite);
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (!this.isDestroyed) {
      this.sprite.translate(0, 0, -0.06);
    }
  }

  collect(): void {
    this.isDestroyed = true;
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
