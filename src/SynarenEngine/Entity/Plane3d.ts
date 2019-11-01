import TextureVertexModel from "../Core/Data/TextureVertexModel";
import ModelObjectRect3d from "../Core/EngineEntity/ModelObjectRect3d";
import EngineHelper from "../Core/EngineHelper";
import Rect3d from "../Core/Data/Rect3d";

export default class Plane3d extends ModelObjectRect3d {
  constructor(
    rect: Rect3d,
    vertexModel: TextureVertexModel,
    textureSource: string
  ) {
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
