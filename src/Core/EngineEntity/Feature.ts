import EngineHelper from "../EngineHelper";
import EngineObject from "./EngineObject";

export default interface Feature {
  init(entity: EngineObject): void;
  update(entity: EngineObject, engineHelper: EngineHelper): void;
}
