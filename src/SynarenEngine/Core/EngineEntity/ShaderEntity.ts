import RenderOption from "../Data/RenderOption";
import VertexModel from "../Data/VertexModel";
import { mat4 } from "gl-matrix";

export class ShaderEntity {
  opt: RenderOption = new RenderOption();
  vertexModel: VertexModel = new VertexModel();
  rendererBufferId?: number;
  rendererTextureRef?: string;

  model: () => mat4;
  src?: string;
  getVertexModel(): VertexModel {
    return this.vertexModel;
  }
  getVertexBufferId(): number {
    return this.vertexModel.vertexBufferId;
  }
  getOpt(): RenderOption {
    return this.opt;
  }
  getViewModel(): Float32List {
    return this.model();
  }
  getTextureSource(): string | undefined {
    return this.src;
  }
  setTextureSource(src: string) {
    this.src = src;
  }
}
