import EngineObject, { EngineEntity } from "./EngineObject";
import EngineHelper from "../EngineHelper";
import { EngineEvent } from "../Events";
import Physics from "../Physics/Physics";
import Position from "./Position";
import ConfigMapBuilder from "../Builder/ConfigMapBuilder";
import { FontReference } from "../Font/Font";
import EntityManager2d from "../../Manager/EntityManager2d";

class EngineMap extends EntityManager2d {
  $ref: { [key: string]: { entity: EngineObject; position: Position } } = {};
  show: boolean = false;
  configBuilder?: ConfigMapBuilder;

  reset() {
    this.entities = [];
    this.$ref = {};
  }

  beforeShow() {}

  updatePosition(entity: EngineObject, position: Position) {
    if (this.$ref[entity.$id]) {
      this.$ref[entity.$id].position = position;
    } else {
      console.error("Trying to update position when entity not set", this);
    }
  }

  setShow(show: boolean) {
    this.show = show;
    if (this.show) {
      this.beforeShow();
    }
    this.entities.forEach((ent: EngineObject) => {
      Physics.setEnabledPhysics(ent, show);
      ent.hidden = !show;
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

  addEntity(entity: EngineObject): EngineMap {
    if (!this.$ref[entity.$id]) {
      this.entities.push(entity);
      this.$ref[entity.$id] = {
        entity: entity,
        position: entity.position
      };
    }
    return this;
  }

  update(engineHelper: EngineHelper) {
    if (!this.show) {
      return;
    }
    this.entities.forEach((ent: EngineObject) => ent.update(engineHelper));
    if (this.configBuilder) {
      this.configBuilder.texts.forEach((fontRef: FontReference) =>
        engineHelper.writeFont(fontRef)
      );
    }
  }
  render(engineHelper: EngineHelper) {
    if (!this.show) {
      return;
    }
    this.entities.forEach((ent: EngineObject) => ent.render(engineHelper));
  }
  event(event: EngineEvent, engineHelper: EngineHelper): void {
    if (!this.show) {
      return;
    }
    this.entities.forEach((ent: EngineEntity) =>
      ent.event(event, engineHelper)
    );
  }
  init(engineHelper: EngineHelper) {
    this.entities.forEach((ent: EngineEntity) => ent.init(engineHelper));
  }
  parseMap(engineHelper: EngineHelper, map: any) {
    this.configBuilder = new ConfigMapBuilder(engineHelper);
    this.configBuilder.build(map);
    this.configBuilder.objects.forEach((ent: EngineObject) =>
      this.addEntity(ent)
    );
  }
}

export default EngineMap;
