import { TextureRenderUnit } from "./RenderUnit";
import VertexModel from "./VertexModel";
import ModelData from "./ModelData";
import EngineObjectHelper from "../EngineEntity/EngineObjectHelper";

class TextureVertexModel extends VertexModel {
  vertexBufferId: number;
  renderUnits: TextureRenderUnit[];
  textureSource: string;
  createRenderUnits(count: number): TextureVertexModel {
    this.renderUnits = [];
    for (let index = 0; index < count; index++) {
      this.renderUnits.push(new TextureRenderUnit());
    }
    return this;
  }
  fillRenderUnits(values: number[]) {
    this.renderUnits = [];
    for (let index = 0; index < values.length; index += 8) {
      const renderUnit = new TextureRenderUnit();
      renderUnit.vertex.x = values[index];
      renderUnit.vertex.y = values[index + 1];
      renderUnit.vertex.z = values[index + 2];
      renderUnit.normal.x = values[index + 3];
      renderUnit.normal.y = values[index + 4];
      renderUnit.normal.z = values[index + 5];
      renderUnit.texture.u = values[index + 6];
      renderUnit.texture.v = values[index + 7];
      this.renderUnits.push(renderUnit);
    }
    return this;
  }
  createModel(): ModelData {
    const model = new ModelData();
    model.vertices = EngineObjectHelper.vertex.toTextureArray(this.renderUnits);
    return model;
  }
}
export default TextureVertexModel;
