import Rect2d from "../Core/Data/Rect2d";
import ModelObject2d from "../Core/EngineEntity/ModelObject2d";
import EngineHelper from "../Core/EngineHelper";
import TextureVertexModel from "../Core/Data/TextureVertexModel";

export default class Plane2d extends ModelObject2d {
  private textureReference: string;
  constructor(rect: Rect2d, textureReference: string) {
    super(rect, new TextureVertexModel());
    this.textureReference = textureReference;
  }
  setLayer(layer: number) {
    this.position.z = -layer;
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
  init(engineHelper: EngineHelper) {
    this.vertexModel = engineHelper.newVertexModel2d(this.textureReference);
    super.init(engineHelper);
  }
}
