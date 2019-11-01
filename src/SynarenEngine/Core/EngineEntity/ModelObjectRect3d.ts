import ShaderEntityBuilder from "../Builder/ShaderEntityBuilder";
import Rect3d from "../Data/Rect3d";
import RenderOption, { RenderType, ShaderType } from "../Data/RenderOption";
import TextureVertexModel from "../Data/TextureVertexModel";
import EngineHelper from "../EngineHelper";
import EngineObject from "./EngineObject";
import { ShaderEntity } from "./ShaderEntity";

export default class ModelObjectRect3d extends EngineObject {
  vertexModel: TextureVertexModel;

  shaderEntity: ShaderEntity;
  textureSource: string;

  constructor(
    rect: Rect3d,
    vertexModel: TextureVertexModel,
    textureSource: string
  ) {
    super();
    this.vertexModel = vertexModel;
    this.textureSource = textureSource;
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
      .createTexture(this.textureSource)
      .build(this, renderOpt);
  }
}
