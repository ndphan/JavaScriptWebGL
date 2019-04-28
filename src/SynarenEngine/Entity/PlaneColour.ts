import RenderOption, {
  ShaderType,
  RenderType
} from "../Core/Data/RenderOption";
import EngineObject from "../Core/EngineEntity/EngineObject";
import ShaderEntityBuilder from "../Core/Builder/ShaderEntityBuilder";
import { ShaderEntity } from "../Core/EngineEntity/ShaderEntity";
import VertexModel from "../Core/Data/VertexModel";
import { Rect2d } from "..";
import EngineHelper from "../Core/EngineHelper";

export default class PlaneColour extends EngineObject {
  vertexModel: VertexModel;
  shaderEntity: ShaderEntity;
  constructor(rect: Rect2d, vertexModel: VertexModel) {
    super();
    this.vertexModel = vertexModel;
    this.centerRect(rect);
    this.rotateOriginRect(rect);
    this.scaleRect(rect);
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
  init(engineHelper: EngineHelper) {
    const renderOpt = new RenderOption();
    renderOpt.renderType = RenderType.PLAIN;
    renderOpt.shaderType = ShaderType.COLOUR;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .build(this, renderOpt);
  }
}
