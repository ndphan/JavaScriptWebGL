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
import Coordinate from "../Core/Data/Coordinate";

export default class CircleColour2d extends EngineObject {
  vertexModel: VertexModel;
  constructor(coord: Coordinate, radius: number, rgba: Colour) {
    super();
    const pos = new Rect2d(coord.x, coord.y, radius, radius);
    this.vertexModel = new ColourVertexModel().fillRenderUnits(
      EngineObjectHelper.vertex.circleXYColour(2 * Math.PI * 6, rgba)
    );
    this.centerRect(pos);
    this.rotateOriginRect(pos);
    this.scaleRect(pos);
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
