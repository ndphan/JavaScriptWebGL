import EngineHelper from "./EngineHelper";
import { EngineEvent } from "../Core/Events";
import Resource from "./Data/Resource";

export default class WorldDelegate {
  engineHelper: EngineHelper;
  private static readonly UNIMPLEMENTED = "unimplemented method";
  setEngineHelper(engineHelper: EngineHelper) {
    this.engineHelper = engineHelper;
  }
  loadResources(resources: Resource[]) {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  update() {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  render() {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  event(event: EngineEvent) {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  pause() {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  resume() {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  init(engineHelper: EngineHelper) {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  destroy() {
    throw new Error(WorldDelegate.UNIMPLEMENTED);
  }
  reset() {}
}
