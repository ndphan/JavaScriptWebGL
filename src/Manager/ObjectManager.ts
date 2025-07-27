import WorldDelegate from "../Core/WorldDelegate";
import EngineObject from "../Core/EngineEntity/EngineObject";
import { EngineEvent } from "../Core/Events";

export default class ObjectManager extends WorldDelegate {
  entities: EngineObject[] = [];
  deferred: Function[] = [];
  isLoaded = false;
  constructor() {
    super();
  }

  render() {
    this.entities.forEach((ent: EngineObject) => ent.render(this.engineHelper));
  }

  update() {
    this.entities.forEach((ent: EngineObject) => ent.update(this.engineHelper));
  }

  addEntity(entity: EngineObject) {
    this.entities.push(entity);
  }

  event(event: EngineEvent) {
    for (let entityIdx = 0; entityIdx < this.entities.length; entityIdx++) {
      const shouldPropagate = this.entities[entityIdx].event(
        event,
        this.engineHelper
      );
      if (shouldPropagate === false) {
        return false;
      }
    }
  }
  loadTexture(onLoad: Function) {
    if (!this.isLoaded) {
      this.deferred.push(onLoad);
    } else {
      onLoad();
    }
  }
  init() {
    for (let entityIdx = 0; entityIdx < this.entities.length; entityIdx++) {
      this.entities[entityIdx].init(this.engineHelper);
    }
    this.deferred.forEach((def) => def());
    this.isLoaded = true;
  }
}
