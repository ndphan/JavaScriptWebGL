import ModelPosition from "./ModelPosition";
import EngineHelper from "../EngineHelper";
import { EngineEvent } from "../Events";
import { ShaderEntity } from "./ShaderEntity";
import { generateId } from "../Common/IdGenerator";

abstract class EngineObject extends ModelPosition implements EngineEntity {
  private $hidden = false;
  data: object;
  $id: string = generateId();
  copyTexture(obj: EngineObject) {
    this.shaderEntity.rendererTextureRef = obj.shaderEntity.rendererTextureRef;
    this.shaderEntity.vertexModel = obj.shaderEntity.vertexModel;
    this.shaderEntity.rendererBufferId = obj.shaderEntity.rendererBufferId;
  }
  set shaderEntity(shaderEntity: ShaderEntity) {
    this._shaderEntity = shaderEntity;
    this._shaderEntity.isTop = this.isTop;
    this._shaderEntity.clone = this.clone;
  }
  get shaderEntity(): ShaderEntity {
    if (
      this._shaderEntity !== undefined &&
      this._shaderEntity.hidden !== this.$hidden
    ) {
      this._shaderEntity.hidden = this.$hidden;
    }
    return this._shaderEntity;
  }
  private _shaderEntity: ShaderEntity;
  type?: string | number;
  clone = false;
  isTop = false;
  isLastEvent = false;
  get hidden(): boolean {
    return this.$hidden;
  }
  set hidden(value: boolean) {
    this.setHidden(value);
  }
  setHidden(value: boolean) {
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
  setClone(clone: boolean) {
    this.clone = clone;
    if (!this.shaderEntity) return;
    this.shaderEntity.clone = clone;
  }
  update(engineHelper: EngineHelper) {}
  render(engineHelper: EngineHelper) {}
  event(event: EngineEvent, engineHelper: EngineHelper): boolean | undefined { return; }
  init(engineHelper: EngineHelper) {}
}

export interface EngineEntity {
  $id: string;
  update(engineHelper: EngineHelper): void;
  render(engineHelper: EngineHelper): void;
  event(event: EngineEvent, engineHelper: EngineHelper): boolean | undefined;
  init(engineHelper: EngineHelper): void;
}

export default EngineObject;
