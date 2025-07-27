import {
  EntityManager,
  Rect3d,
  EngineHelper,
  EngineEvent,
  CollisionDetection,
  PlaneType,
  Plane3d
} from "../dist/index";

export default class Cube extends EntityManager {
  planes: Plane3d[] = [];
  textureSource: string;
  uvs: string[];

  constructor(rect: Rect3d, textureSource: string, uvs: string[]) {
    super();
    this.setRect(rect);
    this.textureSource = textureSource;
    this.uvs = uvs;
  }

  render(engineHelper: EngineHelper) {
    this.planes.forEach(element => element.render(engineHelper));
  }

  isPointInCube(evnt: EngineEvent, engineHelper: EngineHelper) {
    return this.planes.some(plane =>
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        plane,
        evnt.x,
        evnt.y
      )
    );
  }

  init(engineHelper: EngineHelper) {
    const { width, length, height, x, y, z } = this.position;
    const rect = new Rect3d(x, y, z, width, height, length);
    this.planes = [
      new Plane3d(rect, engineHelper.newVertexModel(this.uvs[0], PlaneType.YX)),
      new Plane3d(rect, engineHelper.newVertexModel(this.uvs[1], PlaneType.XY)),
      new Plane3d(rect, engineHelper.newVertexModel(this.uvs[2], PlaneType.ZX)),
      new Plane3d(rect, engineHelper.newVertexModel(this.uvs[3], PlaneType.XZ)),
      new Plane3d(rect, engineHelper.newVertexModel(this.uvs[4], PlaneType.ZY)),
      new Plane3d(rect, engineHelper.newVertexModel(this.uvs[5], PlaneType.YZ))
    ];
    this.planes.forEach(plane => this.entities.push(plane));
    this.scaleRect(rect);
    this.centerRect(rect);
    this.rotateOriginRect(rect);
    this.planes[0].center(x, y, z + length);
    this.planes[1].center(x, y, z);
    this.planes[2].center(x, y, z);
    this.planes[3].center(x, y + height, z);
    this.planes[4].center(x + width, y, z);
    this.planes[5].center(x, y, z);
    this.rotateOriginRect(this.getRect().center());
    // If you have an initEntity method, call it here, otherwise remove this line.
    // this.initEntity(engineHelper);
  }
}
