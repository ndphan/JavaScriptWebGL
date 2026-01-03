import EngineHelper from "../EngineHelper";
import Camera from "../Camera";
import Coordinate from "../Data/Coordinate";
import Feature from "./Feature";
import EngineObject from "./EngineObject";

export default class CameraFollower implements Feature {
  private camera: Camera;
  private offset: Coordinate;
  private rotateOffset: boolean;

  constructor(camera: Camera, offset?: Coordinate, rotateOffset: boolean = false) {
    this.camera = camera;
    this.offset = new Coordinate(
      offset?.x ?? 0,
      offset?.y ?? 0,
      offset?.z ?? 0
    );
    this.rotateOffset = rotateOffset;
  }

  init(entity: EngineObject): void {
    entity.isLowPriority = true;
  }

  update(entity: EngineObject, engineHelper: EngineHelper): void {
    const cam = this.camera.camera3d || this.camera;
    const { x, y, z, ay } = cam.position;
    
    let offsetX = this.offset.x;
    let offsetY = this.offset.y;
    let offsetZ = this.offset.z;

    if (this.rotateOffset) {
      const rotationRad = (ay * Math.PI) / 180;
      const cosR = Math.cos(rotationRad);
      const sinR = Math.sin(rotationRad);
      offsetX = this.offset.x * cosR - this.offset.z * sinR;
      offsetZ = this.offset.x * sinR + this.offset.z * cosR;
    }

    entity.center(x + offsetX, y + offsetY, z + offsetZ);
  }
}
