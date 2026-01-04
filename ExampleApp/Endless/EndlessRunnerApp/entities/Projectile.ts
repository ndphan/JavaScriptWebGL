import { EntityManager, Rect3d, EngineHelper, PlaneType } from "synaren-engine";
import Plane3d from "../../../../src/Entity/Plane3d";
import { LANES } from "../data/waves";

export default class Projectile extends EntityManager {
  speed: number = 0.3;
  sprite: Plane3d;
  isDestroyed: boolean = false;
  width = 0.25;
  height = 0.25;
  laneIndex: number;
  cube: Plane3d | null = null;

  constructor(laneIndex: number, startZ: number) {
    super();
    this.laneIndex = laneIndex;
  }

  init(engineHelper: EngineHelper) {
    this.sprite = new Plane3d(new Rect3d(LANES[this.laneIndex], 1, 0, this.width, this.height, 0.1), engineHelper.newVertexModel("paper", PlaneType.XY));
    this.sprite.init(engineHelper);
    this.entities.push(this.sprite);
    this.cube = this.sprite;
    super.init(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (!this.isDestroyed) {
      this.sprite.translate(0, 0, this.speed);
    }
  }

  isOffScreen(): boolean {
    return this.sprite.position.z > 25;
  }

  render(engineHelper: EngineHelper) {
    if (!this.isDestroyed) {
      this.sprite.render(engineHelper);
    }
  }
}
