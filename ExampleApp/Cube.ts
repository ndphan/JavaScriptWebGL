import { EntityManager, Plane3d, Rect3d, EngineHelper, EngineEvent, CollisionDetection, PlaneType } from "synaren-engine";

export default class Cube extends EntityManager {
  planes: Plane3d[];
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
    return (
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        this.planes[0],
        evnt.x,
        evnt.y
      ) ||
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        this.planes[1],
        evnt.x,
        evnt.y
      ) ||
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        this.planes[2],
        evnt.x,
        evnt.y
      ) ||
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        this.planes[3],
        evnt.x,
        evnt.y
      ) ||
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        this.planes[4],
        evnt.x,
        evnt.y
      ) ||
      CollisionDetection.isPointInPlane3d(
        engineHelper.camera.camera3d,
        this.planes[5],
        evnt.x,
        evnt.y
      )
    );
  }

  init(engineHelper: EngineHelper) {
    const width = this.position.width;
    const length = this.position.length;
    const height = this.position.height;
    const x = this.position.x;
    const y = this.position.y;
    const z = this.position.z;
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

    this.planes[0].center(x, y, z + length / 2);
    this.planes[1].center(x, y, z - length / 2);
    this.planes[2].center(x, y - height / 2, z);
    this.planes[3].center(x, y + height / 2, z);
    this.planes[4].center(x + width / 2, y, z);
    this.planes[5].center(x - width / 2, y, z);

    this.rotateOriginRect(this.getRect());

    super.init(engineHelper);

    this.angleX(this.position.ax);
    this.angleY(this.position.ay);
    this.angleZ(this.position.az);
  }
}