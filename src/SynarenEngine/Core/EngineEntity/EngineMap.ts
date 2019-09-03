import EngineObject, { EngineEntity } from "./EngineObject";
import EngineHelper from "../EngineHelper";
import { EngineEvent } from "../Events";
import Physics from "../Physics/Physics";
import Position from "./Position";
import ConfigMapBuilder from "../Builder/ConfigMapBuilder";
import { FontReference } from "../Font/Font";

class EngineMap extends EngineObject {
  objects: EngineObject[] = [];
  $ref: { [key: string]: { entity: EngineObject; position: Position } } = {};
  get $hidden(): boolean {
    return false;
  }
  set $hidden(_: boolean) { }
  show: boolean = false;
  configBuilder?: ConfigMapBuilder;

  reset() {
    this.objects = [];
    this.$ref = {};
  }

  beforeShow() { }

  updatePosition(entity: EngineObject, position: Position) {
    if (this.$ref[entity.$id]) {
      this.$ref[entity.$id].position = position;
    } else {
      console.error("Trying to update position when entity not set", this);
    }
  }

  setShow(show: boolean) {
    this.beforeShow();
    this.show = show;
    this.objects.forEach((ent: EngineObject) => {
      Physics.setEnabledPhysics(ent, show);
      ent.$hidden = false;
    });
    if (this.show) {
      this.restore();
    }
  }

  restore() {
    for (const prop in this.$ref) {
      if (this.$ref.hasOwnProperty(prop)) {
        const entityData = this.$ref[prop];
        entityData.entity.setPosition(entityData.position);
      }
    }
  }

  addObject(object: EngineObject): EngineMap {
    if (!this.$ref[object.$id]) {
      this.objects.push(object);
      this.$ref[object.$id] = {
        entity: object,
        position: object.position
      };
    }
    return this;
  }

  update(engineHelper: EngineHelper) {
    if (!this.show) {
      return;
    }
    this.objects.forEach((ent: EngineObject) => ent.update(engineHelper));
    if (this.configBuilder) {
      this.configBuilder.texts.forEach((fontRef: FontReference) =>
        engineHelper.writeFont(fontRef.$cacheId!, fontRef)
      );
    }

  }
  render(engineHelper: EngineHelper) {
    if (!this.show) {
      return;
    }
    this.objects
      .filter((ent: EngineObject) => !ent.$hidden)
      .forEach((ent: EngineObject) => ent.render(engineHelper));
  }
  event(event: EngineEvent, engineHelper: EngineHelper): void {
    if (!this.show) {
      return;
    }
    this.objects.forEach((ent: EngineEntity) => ent.event(event, engineHelper));
  }
  init(engineHelper: EngineHelper) {
    this.objects.forEach((ent: EngineEntity) => ent.init(engineHelper));
  }
  parseMap(engineHelper: EngineHelper, map: any) {
    this.configBuilder = new ConfigMapBuilder(engineHelper);
    this.configBuilder.build(map);
    this.configBuilder.objects.forEach((ent: EngineObject) =>
      this.addObject(ent)
    );
  }
}

export default EngineMap;
