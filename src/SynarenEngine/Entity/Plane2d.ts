import ModelObject2d from "../Core/EngineEntity/ModelObject2d";
import EngineHelper from "../Core/EngineHelper";
import Rect2d from "../Core/Data/Rect2d";
import VertexModel from "../Core/Data/VertexModel";

export default class Plane2d extends ModelObject2d {
  constructor(rect: Rect2d, vertexModel: VertexModel, textureSource: string) {
    super(rect, vertexModel, textureSource);
  }
  setLayer(layer: number) {
    this.position.z = -layer;
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
}
