import EngineObject from "../Core/EngineEntity/EngineObject";
import EngineHelper from "../Core/EngineHelper";
import Rect3d from "../Core/Data/Rect3d";
import Position from "../Core/EngineEntity/Position";

class EntityManager extends EngineObject {
  entities: EngineObject[] = [];

  setPosition(position: Position) {
    this.entities.forEach((e) => e.setPosition(position));
  }

  center(x: number, y: number, z: number) {
    super.center(x, y, z);
    this.entities.forEach((e) => e.center(x, y, z));
  }

  rotateOrigin(x: number, y: number, z: number) {
    super.rotateOrigin(x, y, z);
    this.entities.forEach((e) => e.rotateOrigin(x, y, z));
  }

  rotateOriginRect(rect: Rect3d) {
    this.rotateOrigin(rect.x, rect.y, rect.z);
  }

  rotateX(x: number) {
    this.angleX(x);
  }

  rotateY(y: number) {
    this.angleY(y);
  }

  rotateZ(z: number) {
    this.angleZ(z);
  }

  angleX(x: number) {
    super.angleX(x);
    this.entities.forEach((e) => e.angleX(x));
  }

  angleY(y: number) {
    super.angleY(y);
    this.entities.forEach((e) => e.angleY(y));
  }

  angleZ(z: number) {
    super.angleZ(z);
    this.entities.forEach((e) => e.angleZ(z));
  }

  scaleX(x: number) {
    super.scaleX(x);
    this.entities.forEach((e) => e.scaleX(x));
  }

  scaleY(y: number) {
    super.scaleY(y);
    this.entities.forEach((e) => e.scaleY(y));
  }

  scaleZ(z: number) {
    super.scaleZ(z);
    this.entities.forEach((e) => e.scaleZ(z));
  }

  scale(x: number, y: number, z: number) {
    super.scale(x, y, z);
    this.entities.forEach((e) => e.scale(x, y, z));
  }

  translate(dx: number, dy: number, dz: number) {
    super.translate(dx, dy, dz);
    this.entities.forEach((e) => e.translate(dx, dy, dz));
  }

  init(engineHelper: EngineHelper) {
    super.init(engineHelper);
    this.entities.forEach((a) => a.init(engineHelper));
  }

  render(engineHelper: EngineHelper) {
    if (this.hidden) {
      return;
    }
    this.entities.forEach((entity) => entity.render(engineHelper));
    super.render(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    if (this.hidden) {
      return;
    }
    this.entities.forEach((entity) => entity.update(engineHelper));
    super.update(engineHelper);
  }

  setTop(isTop: boolean) {
    super.setTop(isTop);
    this.entities.forEach((entity) => entity.setTop(isTop));
  }

  set hidden(value: boolean) {
    super.setHidden(value);
    this.entities.forEach((entity) => (entity.hidden = value));
  }
}

export default EntityManager;
