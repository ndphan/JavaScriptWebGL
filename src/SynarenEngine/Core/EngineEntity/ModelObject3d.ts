import ShaderEntityBuilder from "../Builder/ShaderEntityBuilder";
import Rect3d from "../Data/Rect3d";
import RenderOption, { RenderType, ShaderType } from "../Data/RenderOption";
import TextureVertexModel from "../Data/TextureVertexModel";
import EngineHelper from "../EngineHelper";
import EngineObject from "./EngineObject";
import { ShaderEntity } from "./ShaderEntity";

export default class ModelObject3d extends EngineObject {
  public vertexModel: TextureVertexModel;
  public shaderEntity: ShaderEntity;
  protected renderType: RenderType;

  constructor(rect: Rect3d, vertexModel: TextureVertexModel) {
    super();
    this.renderType = RenderType.TRIANGLE;
    this.vertexModel = vertexModel;
    this.centerRect(rect);
    this.rotateOriginRect(rect);
    this.scaleRect(rect);
  }
  setRenderType(renderType: RenderType) {
    this.renderType = renderType;
  }

  init(engineHelper: EngineHelper) {
    const renderOpt = new RenderOption();
    renderOpt.renderType = this.renderType;
    renderOpt.shaderType = ShaderType.THREE_DIMENSION;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .createTexture(this.vertexModel.textureSource)
      .build(this, renderOpt);
  }
}
