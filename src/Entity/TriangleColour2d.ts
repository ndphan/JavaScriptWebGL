import ShaderEntityBuilder from "../Core/Builder/ShaderEntityBuilder";
import ColourVertexModel from "../Core/Data/ColourVertexModel";
import Rect2d from "../Core/Data/Rect2d";
import RenderOption, {
  RenderType,
  ShaderType,
} from "../Core/Data/RenderOption";
import { Colour } from "../Core/Data/RenderUnit";
import VertexModel from "../Core/Data/VertexModel";
import EngineObject from "../Core/EngineEntity/EngineObject";
import EngineObjectHelper from "../Core/EngineEntity/EngineObjectHelper";
import { ShaderEntity } from "../Core/EngineEntity/ShaderEntity";
import EngineHelper from "../Core/EngineHelper";

export default class TriangleColour2d extends EngineObject {
  vertexModel: VertexModel;
  constructor(rect: Rect2d, rgba: Colour) {
    super();
    this.vertexModel = new ColourVertexModel().fillRenderUnits(
      EngineObjectHelper.vertex.triangleXYColour(rgba)
    );
    this.centerRect(rect);
    this.rotateOriginRect(rect);
    this.scaleRect(rect);
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
  init(engineHelper: EngineHelper) {
    const renderOpt = new RenderOption();
    renderOpt.renderType = RenderType.TRIANGLE;
    renderOpt.shaderType = ShaderType.COLOUR;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .build(this, renderOpt);
  }
}
