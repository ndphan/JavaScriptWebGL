import Coordinate from "../Core/Data/Coordinate";
import Rect2d from "../Core/Data/Rect2d";
import Plane2d from "./Plane2d";
import PlaneType from "../Core/Data/PlaneType";
import EntityManager2d from "../Manager/EntityManager2d";
import EngineHelper from "../Core/EngineHelper";
import { CollisionDetection } from "../Core/Physics/CollisionDetection";

export default class Ground2d extends EntityManager2d {
  uvCacheId: string;
  entities: Plane2d[];
  tileCount: number;
  textureSource: string;

  constructor(
    rect: Rect2d,
    uvCacheId: string,
    textureSource: string,
    tileCount: number
  ) {
    super();
    this.setRect(rect);
    this.uvCacheId = uvCacheId;
    this.tileCount = tileCount;
    this.textureSource = textureSource;
  }

  render(engineHelper: EngineHelper) {
    this.entities.forEach(element => element.render(engineHelper));
  }

  isPointInGround(coordinate: Coordinate): Plane2d | null {
    let insideElement: Plane2d | null = null;
    for (const key in this.entities) {
      if (this.entities.hasOwnProperty(key)) {
        const element = this.entities[key];
        const isInside = CollisionDetection.isPointInRect(
          element.getRect(),
          coordinate
        );
        if (isInside) {
          insideElement = element;
          break;
        }
      }
    }
    return insideElement;
  }

  init(engineHelper: EngineHelper) {
    const width = this.position.width;
    const height = this.position.height;
    const x = this.position.x;
    const y = this.position.y;
    const z = this.position.z;
    const tileCount = this.tileCount / 2.0;
    const tileWidth = width / tileCount;
    const tileHeight = height / tileCount;

    const uv = engineHelper.getUVCache(this.uvCacheId);
    const vertexModel = engineHelper.createPlaneVertexModel(uv, PlaneType.YX);

    for (let index = 0; index < tileCount; index++) {
      for (let index2 = 0; index2 < tileCount; index2++) {
        const rect = new Rect2d(
          index * tileWidth + tileWidth / 2.0,
          index2 * tileHeight + tileHeight / 2.0,
          this.position.z,
          tileWidth,
          tileHeight
        );
        const plane = new Plane2d(rect, vertexModel, this.textureSource);
        plane.rotateOrigin(x, y, z);
        plane.angleY(this.position.ay);
        plane.angleX(this.position.ax);
        plane.angleZ(this.position.az);
        this.entities.push(plane);
      }
    }
    super.initEntity(engineHelper);
  }
}
