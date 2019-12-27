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

  shallowCopy(): ShaderEntity {
    const newInstance = new ShaderEntity();
    newInstance.opt = this.opt;
    newInstance.vertexModel = this.vertexModel;
    newInstance.rendererBufferId = this.rendererBufferId;
    newInstance.rendererTextureRef = this.rendererTextureRef;
    newInstance.src = this.src;
    return newInstance;
  }
}
