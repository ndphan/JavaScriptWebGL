import RenderOption from "../Data/RenderOption";
import VertexModel from "../Data/VertexModel";
import { mat4 } from "gl-matrix";
import Position from "./Position";

export class ShaderEntity {
  opt: RenderOption = new RenderOption();
  vertexModel: VertexModel;
  rendererBufferId?: number;
  rendererTextureRef?: string;
  src?: string;
  hidden: boolean;
  isTop: boolean;
  modelPosition: () => Position;
  model: () => mat4;
  clone = false;

  getVertexModel(): VertexModel {
    return this.vertexModel;
  }
  getVertexBufferId(): number {
    return this.vertexModel.vertexBufferId;
  }
  getOpt(): RenderOption {
    return this.opt;
  }
  getModel(): Float32List {
    return this.model();
  }
  getTextureSource(): string | undefined {
    return this.src;
  }
  setTextureSource(src: string) {
    this.src = src;
  }
  renderCopy(model: any): ShaderEntity {
    const newInstance = this.shallowCopy();
    newInstance.model = model.getModel;
    newInstance.modelPosition = model.getPosition;
    return newInstance;
  }

  shallowCopy(): ShaderEntity {
    const newInstance = new ShaderEntity();
    newInstance.opt = this.opt;
    newInstance.vertexModel = this.vertexModel;
    newInstance.rendererBufferId = this.rendererBufferId;
    newInstance.rendererTextureRef = this.rendererTextureRef;
    newInstance.src = this.src;
    newInstance.isTop = this.isTop;
    newInstance.hidden = this.hidden;
    return newInstance;
  }
}
