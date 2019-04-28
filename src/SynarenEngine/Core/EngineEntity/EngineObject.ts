import ModelPosition from "./ModelPosition";
import EngineHelper from "../EngineHelper";
import { EngineEvent } from "../Events";

abstract class EngineObject extends ModelPosition {
  $physicsId: number;
  update(engineHelper: EngineHelper) {}
  render(engineHelper: EngineHelper) {}
  event(event: EngineEvent, engineHelper: EngineHelper): void {}
  init(engineHelper: EngineHelper) {}
}

export default EngineObject;
