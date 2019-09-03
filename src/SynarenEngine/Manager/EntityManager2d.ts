import EntityManager from "./EntityManager";
import Plane2d from "../Entity/Plane2d";
import EngineHelper from "../Core/EngineHelper";

export default class EntityManager2d extends EntityManager {
  setLayer(priority: number): any {
    this.entities.forEach(entity => {
      if (entity instanceof Plane2d) {
        entity.setLayer(priority);
      }
    });
    this.position.z = -1 * priority;
    return this;
  }

  initEntity(engineHelper: EngineHelper) {
    super.initEntity(engineHelper);
    this.setLayer(-this.position.z);
  }
}
