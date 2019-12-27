import ModelPosition from "./ModelPosition";
import EngineHelper from "../EngineHelper";
import { EngineEvent } from "../Events";
import { ShaderEntity } from "./ShaderEntity";

function generateId() {
  return "xxxxxxxxx".replace(/[x]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

abstract class EngineObject extends ModelPosition implements EngineEntity {
  private $hidden: boolean = false;
  $id: string = generateId();
  set shaderEntity(shaderEntity: ShaderEntity) {
    this._shaderEntity = shaderEntity;
    this.isTop = this.isTop;
  }
  get shaderEntity(): ShaderEntity {
    return this._shaderEntity;
  }
  private _shaderEntity: ShaderEntity;
  type?: string | number;
  isTop = false;
  get hidden(): boolean {
    return this.$hidden;
  }
  set hidden(value: boolean) {
    this.$hidden = value;
    if (this.shaderEntity) {
      this.shaderEntity.hidden = value;
    }
  }
  setTop(isTop: boolean) {
    this.isTop = isTop;
    if (!this.shaderEntity) return;
    this.shaderEntity.isTop = isTop;
  }
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
