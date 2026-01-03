import {
  Camera,
  EntityManager,
  Rect3d,
  EngineHelper,
  Coordinate,
  Plane3d,
  CollisionDetection,
  PlaneType
} from "synaren-engine";

export default class Ground3d extends EntityManager {
  cacheId: string;
  textureSource: string;
  camera: Camera;

  constructor(rect: Rect3d, cacheId: string) {
    super();
    this.cacheId = cacheId;
    this.setRect(rect);
  }

  render(engineHelper: EngineHelper) {
    this.entities.forEach(element => element.render(engineHelper));
  }

  isPointInGround(coordinate: Coordinate): Plane3d | null {
    let insideElement: Plane3d | null = null;
    for (const key in this.entities) {
      if (this.entities.hasOwnProperty(key)) {
        const element = this.entities[key];
        const isInside = CollisionDetection.isPointInPlane3d(
          this.camera.camera3d,
          element as Plane3d,
          coordinate.x,
          coordinate.y
        );
        if (isInside) {
          insideElement = element as Plane3d;
          break;
        }
      }
    }
    return insideElement;
  }

  init(engineHelper: EngineHelper) {
    this.camera = engineHelper.camera;
    this.createEntities(engineHelper);
    this.rotateOriginRect(this.getRect());
    this.angleX(this.position.ax);
    this.angleY(this.position.ay);
    this.angleZ(this.position.az);
    super.init(engineHelper);
  }

  createEntities(engineHelper: EngineHelper) {
    const width = this.position.width;
    const length = this.position.length;
    const x = this.position.x;
    const y = this.position.y;
    const z = this.position.z;
    const vertexModel = engineHelper.newVertexModel(this.cacheId, PlaneType.XZ);
    for (let index = 0; index < width; index++) {
      for (let index2 = 0; index2 < length; index2++) {
        const rect = new Rect3d(
          x + index - width / 2.0,
          y,
          z + index2 - length / 2.0,
          1,
          1,
          1
        );
        const plane = new Plane3d(rect, vertexModel);
        this.entities.push(plane);
      }
    }
  }

  center(x: number, y: number, z: number) {
    const originX = this.position.x;
    const originZ = this.position.z;
    if (Math.abs(originX - x) > 10e-6 || Math.abs(originZ - z) > 10e-6) {
      for (let index = 0; index < this.entities.length; index++) {
        const element = this.entities[index];
        element.translate(x - originX, 0, z - originZ);
      }
      this.position.x = x;
      this.position.z = z;
    }
  }
}
