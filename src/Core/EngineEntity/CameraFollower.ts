import EngineHelper from "../EngineHelper";
import Camera from "../Camera";
import Coordinate from "../Data/Coordinate";
import Feature from "./Feature";
import EngineObject from "./EngineObject";

export default class CameraFollower implements Feature {
  private camera: Camera;
  private offset: Coordinate;

  constructor(camera: Camera, offset?: Coordinate) {
    this.camera = camera;
    this.offset = new Coordinate(
      offset?.x ?? 0,
      offset?.y ?? 0,
      offset?.z ?? 0
    );
  }

  init(entity: EngineObject): void {
    entity.isLowPriority = true;
  }

  update(entity: EngineObject, engineHelper: EngineHelper): void {
    const cam = this.camera.camera3d || this.camera;
    const { x, y, z } = cam.position;
    
    entity.center(
      x + this.offset.x,
      y + this.offset.y,
      z + this.offset.z
    );
  }
}
