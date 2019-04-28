import EngineObject from "../Core/EngineEntity/EngineObject";
import { Rect3d } from "..";
import EngineHelper from "../Core/EngineHelper";

class EntityManager extends EngineObject {
  entities: EngineObject[] = [];

  center(x: number, y: number, z: number) {
    super.center(x, y, z);
    this.entities.forEach(e => e.center(x, y, z));
  }

  rotateOrigin(x: number, y: number, z: number) {
    super.rotateOrigin(x, y, z);
    this.entities.forEach(e => e.rotateOrigin(x, y, z));
  }

  rotateOriginRect(rect: Rect3d) {
    this.rotateOrigin(rect.x, rect.y, rect.z);
  }

  angleX(x: number) {
    super.angleX(x);
    this.entities.forEach(e => e.angleX(x));
  }

  angleY(y: number) {
    super.angleY(y);
    this.entities.forEach(e => e.angleY(y));
  }

  angleZ(z: number) {
    super.angleZ(z);
    this.entities.forEach(e => e.angleZ(z));
  }

  scaleX(x: number) {
    super.scaleX(x);
    this.entities.forEach(e => e.scaleX(x));
  }

  scaleY(y: number) {
    super.scaleY(y);
    this.entities.forEach(e => e.scaleY(y));
  }

  scaleZ(z: number) {
    super.scaleZ(z);
    this.entities.forEach(e => e.scaleZ(z));
  }

  scale(x: number, y: number, z: number) {
    super.scale(x, y, z);
    this.entities.forEach(e => e.scale(x, y, z));
  }

  translate(dx: number, dy: number, dz: number) {
    super.translate(dx, dy, dz);
    this.entities.forEach(e => e.translate(dx, dy, dz));
  }

  initEntity(engineHelper: EngineHelper) {
    this.entities.forEach(a => a.init(engineHelper));
  }
}

export default EntityManager;
