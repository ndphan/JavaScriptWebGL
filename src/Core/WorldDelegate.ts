import EngineHelper from "./EngineHelper";
import { EngineEvent } from "../Core/Events";
import Resource from "./Data/Resource";

export default class WorldDelegate {
  engineHelper: EngineHelper;
  setEngineHelper(engineHelper: EngineHelper) {
    this.engineHelper = engineHelper;
  }
  loadResources(resources: Resource[]) {
    throw new Error("unimplemented method");
  }
  update() {
    throw new Error("unimplemented method");
  }
  render() {
    throw new Error("unimplemented method");
  }
  event(event: EngineEvent) {
    throw new Error("unimplemented method");
  }
  pause() {
    throw new Error("unimplemented method");
  }
  resume() {
    throw new Error("unimplemented method");
  }
  init(engineHelper: EngineHelper) {
    throw new Error("unimplemented method");
  }
  destroy() {
    throw new Error("unimplemented method");
  }
  reset() {}
}
