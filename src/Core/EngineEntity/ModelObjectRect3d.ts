import ShaderEntityBuilder from "../Builder/ShaderEntityBuilder";
import Rect3d from "../Data/Rect3d";
import RenderOption, { RenderType, ShaderType } from "../Data/RenderOption";
import EngineHelper from "../EngineHelper";
import EngineObject from "./EngineObject";
import { ShaderEntity } from "./ShaderEntity";
import TextureVertexModel from "../Data/TextureVertexModel";

export default class ModelObjectRect3d extends EngineObject {
  public vertexModel: TextureVertexModel;

  constructor(rect: Rect3d, vertexModel: TextureVertexModel) {
    super();
    this.vertexModel = vertexModel;
    this.centerRect(rect);
    this.rotateOriginRect(rect);
    this.scaleRect(rect);
}

  init(engineHelper: EngineHelper) {
    const renderOpt = new RenderOption();
    renderOpt.renderType = RenderType.RECTANGLE;
    renderOpt.shaderType = ShaderType.THREE_DIMENSION;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .createTexture(this.vertexModel.textureSource)
      .build(this, renderOpt);
  }
}
