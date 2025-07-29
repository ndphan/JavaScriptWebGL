import { ColourRenderUnit } from "./RenderUnit";
import VertexModel from "./VertexModel";
import ModelData from "./ModelData";
import EngineObjectHelper from "../EngineEntity/EngineObjectHelper";

class ColourVertexModel extends VertexModel {
  vertexBufferId: number;
  renderUnits: ColourRenderUnit[];
  createRenderUnits(count: number) {
    this.renderUnits = [];
    for (let index = 0; index < count; index++) {
      this.renderUnits.push(new ColourRenderUnit());
    }
    return this;
  }
  fillRenderUnits(values: number[]) {
    this.renderUnits = [];
    for (let index = 0; index < values.length; index += 7) {
      const renderUnit = new ColourRenderUnit();
      renderUnit.vertex.x = values[index];
      renderUnit.vertex.y = values[index + 1];
      renderUnit.vertex.z = values[index + 2];
      renderUnit.colour.r = values[index + 3];
      renderUnit.colour.g = values[index + 4];
      renderUnit.colour.b = values[index + 5];
      renderUnit.colour.a = values[index + 6];
      this.renderUnits.push(renderUnit);
    }
    return this;
  }
  createModel(): ModelData {
    const model = new ModelData();
    model.vertices = EngineObjectHelper.vertex.toColourArray(this.renderUnits);
    return model;
  }
}
export default ColourVertexModel;
