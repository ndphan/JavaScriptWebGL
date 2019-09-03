import RenderUnit from "./RenderUnit";
import ModelData from "./ModelData";
import EngineObjectHelper from "../EngineEntity/EngineObjectHelper";
import EngineHelper from "../EngineHelper";

class VertexModel {
  vertexBufferId: number;
  renderUnits: RenderUnit[];
  createRenderUnits(count: number) {
    this.renderUnits = [];
    for (let index = 0; index < count; index++) {
      this.renderUnits.push(new RenderUnit());
    }
    return this;
  }
  fillRenderUnits(vertexUV: number[]) {
    this.renderUnits = [];
    for (let index = 0; index < vertexUV.length; index += 8) {
      const renderUnit = new RenderUnit();
      renderUnit.vertex.x = vertexUV[index];
      renderUnit.vertex.y = vertexUV[index + 1];
      renderUnit.vertex.z = vertexUV[index + 2];
      renderUnit.normal.x = vertexUV[index + 3];
      renderUnit.normal.y = vertexUV[index + 4];
      renderUnit.normal.z = vertexUV[index + 5];
      renderUnit.texture.u = vertexUV[index + 6];
      renderUnit.texture.v = vertexUV[index + 7];
      this.renderUnits.push(renderUnit);
    }
    return this;
  }
  createModel(): ModelData {
    const model = new ModelData();
    model.vertices = EngineObjectHelper.vertex.toArray(this.renderUnits);
    return model;
  }
  registerModel(engineHelper: EngineHelper) {
    if (!this.vertexBufferId) {
      this.vertexBufferId = engineHelper.addBufferCache(this.createModel());
    }
  }
}

export default VertexModel;
