import ShaderEntityBuilder from "../Builder/ShaderEntityBuilder";
import Rect2d from "../Data/Rect2d";
import RenderOption, { RenderType, ShaderType } from "../Data/RenderOption";
import TextureVertexModel from "../Data/TextureVertexModel";
import EngineHelper from "../EngineHelper";
import EngineObject from "./EngineObject";

export default class ModelObject2d extends EngineObject {
  public vertexModel: TextureVertexModel;

  constructor(rect: Rect2d, vertexModel: TextureVertexModel) {
    super();
    this.vertexModel = vertexModel;
    this.centerRect(rect);
    this.rotateOriginRect(rect.center());
    this.scaleRect(rect);
  }

  init(engineHelper: EngineHelper) {
    const renderOpt = new RenderOption();
    renderOpt.renderType = RenderType.RECTANGLE;
    renderOpt.shaderType = ShaderType.TWO_DIMENSION;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .createTexture(this.vertexModel.textureSource)
      .build(this, renderOpt);
  }
}
