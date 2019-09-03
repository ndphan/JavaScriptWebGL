import EngineObject from "./EngineObject";
import RenderOption, { ShaderType, RenderType } from "../Data/RenderOption";
import ShaderEntityBuilder from "../Builder/ShaderEntityBuilder";
import { ShaderEntity } from "./ShaderEntity";
import EngineHelper from "../EngineHelper";
import VertexModel from "../Data/VertexModel";
import Rect2d from "../Data/Rect2d";

export default class ModelObject2d extends EngineObject {
  vertexModel: VertexModel;
  shaderEntity: ShaderEntity;
  textureSource: string;

  constructor(rect: Rect2d, vertexModel: VertexModel, textureSource: string) {
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
    renderOpt.shaderType = ShaderType.TWO_DIMENSION;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .createTexture(this.textureSource)
      .build(this, renderOpt);
  }
}
