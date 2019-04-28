import EngineObject from "./EngineObject";
import RenderOption, { ShaderType, RenderType } from "../Data/RenderOption";
import ShaderEntityBuilder from "../Builder/ShaderEntityBuilder";
import VertexModel from "../Data/VertexModel";
import { ShaderEntity } from "./ShaderEntity";
import Rect3d from "../Data/Rect3d";
import EngineHelper from "../EngineHelper";

export default class ModelObject3d extends EngineObject {
  vertexModel: VertexModel;
  shaderEntity: ShaderEntity;
  textureSource: string;
  renderType: RenderType;

  constructor(rect: Rect3d, vertexModel: VertexModel, textureSource: string) {
    super();
    this.renderType = RenderType.TRIANGLE;
    this.vertexModel = vertexModel;
    this.textureSource = textureSource;
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
      .createTexture(this.textureSource)
      .build(this, renderOpt);
  }
}
