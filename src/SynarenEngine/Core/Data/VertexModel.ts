import ModelData from "./ModelData";
import EngineHelper from "../EngineHelper";
import { RenderUnit } from "./RenderUnit";

abstract class VertexModel {
  public vertexBufferId: number;
  public renderUnits: RenderUnit[];

  public abstract createRenderUnits(count: number): VertexModel;
  public abstract fillRenderUnits(vertexUV: number[]): void;
  public abstract createModel(): ModelData;

  public registerModel(engineHelper: EngineHelper) {
    if (!this.vertexBufferId) {
      this.vertexBufferId = engineHelper.addBufferCache(this.createModel());
    }
  }
}

export default VertexModel;
