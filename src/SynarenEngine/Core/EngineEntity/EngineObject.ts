import ModelPosition from "./ModelPosition";
import EngineHelper from "../EngineHelper";
import { EngineEvent } from "../Events";

function generateId() {
  return "xxxxxxxxx".replace(/[x]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

abstract class EngineObject extends ModelPosition implements EngineEntity {
  $physicsId: number;
  $hidden: boolean = false;
  $id: string = generateId();
  update(engineHelper: EngineHelper) {}
  render(engineHelper: EngineHelper) {}
  event(event: EngineEvent, engineHelper: EngineHelper): void {}
  init(engineHelper: EngineHelper) {}
}

export interface EngineEntity {
  $id: string;
  update(engineHelper: EngineHelper): void;
  render(engineHelper: EngineHelper): void;
  event(event: EngineEvent, engineHelper: EngineHelper): void;
  init(engineHelper: EngineHelper): void;
}

export default EngineObject;
