import ModelObjectRect3d from "../Core/EngineEntity/ModelObjectRect3d";
import { Rect3d } from "..";
import VertexModel from "../Core/Data/VertexModel";
import EngineHelper from "../Core/EngineHelper";

export default class Plane3d extends ModelObjectRect3d {
  constructor(rect: Rect3d, vertexModel: VertexModel, textureSource: string) {
    super(rect, vertexModel, textureSource);
    if (!vertexModel.renderUnits || vertexModel.renderUnits.length !== 4) {
      const error = "Plane3d requires 4 vertexes";
      console.error(error, vertexModel);
      throw new Error(error);
    }
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
}
