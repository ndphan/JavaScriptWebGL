import ModelData from "./ModelData";
import EngineHelper from "../EngineHelper";

abstract class VertexModel {
  vertexBufferId: number;

  abstract createRenderUnits(count: number): VertexModel;
  abstract fillRenderUnits(vertexUV: number[]): void;
  abstract createModel(): ModelData;

  registerModel(engineHelper: EngineHelper) {
    if (!this.vertexBufferId) {
      this.vertexBufferId = engineHelper.addBufferCache(this.createModel());
    }
  }
}

export default VertexModel;
