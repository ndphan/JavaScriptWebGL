import RenderOption, {
  ShaderType,
  RenderType,
} from "../Core/Data/RenderOption";
import EngineObject from "../Core/EngineEntity/EngineObject";
import ShaderEntityBuilder from "../Core/Builder/ShaderEntityBuilder";
import VertexModel from "../Core/Data/VertexModel";
import EngineHelper from "../Core/EngineHelper";
import Rect2d from "../Core/Data/Rect2d";
import Colour from "../Core/Data/Colour";
import ColourVertexModel from "../Core/Data/ColourVertexModel";
import EngineObjectHelper from "../Core/EngineEntity/EngineObjectHelper";

export default class PlaneColour extends EngineObject {
  vertexModel: VertexModel;
  constructor(rect: Rect2d, private rgba: Colour) {
    super();
    this.centerRect(rect);
    this.rotateOriginRect(rect);
    this.scaleRect(rect);
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
  init(engineHelper: EngineHelper) {
    this.vertexModel = new ColourVertexModel().fillRenderUnits(
      EngineObjectHelper.vertex.planeXYColour(
        this.rgba || new Colour(0, 0, 0, 0)
      )
    );
    const renderOpt = new RenderOption();
    renderOpt.renderType = RenderType.TRIANGLE;
    renderOpt.shaderType = ShaderType.COLOUR;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .build(this, renderOpt);
  }
}
