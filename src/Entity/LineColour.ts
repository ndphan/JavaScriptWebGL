import ShaderEntityBuilder from "../Core/Builder/ShaderEntityBuilder";
import Colour from "../Core/Data/Colour";
import ColourVertexModel from "../Core/Data/ColourVertexModel";
import Coordinate from "../Core/Data/Coordinate";
import Rect2d from "../Core/Data/Rect2d";
import RenderOption, {
  RenderType,
  ShaderType,
} from "../Core/Data/RenderOption";
import VertexModel from "../Core/Data/VertexModel";
import EngineObject from "../Core/EngineEntity/EngineObject";
import EngineObjectHelper from "../Core/EngineEntity/EngineObjectHelper";
import EngineHelper from "../Core/EngineHelper";

export default class LineColour extends EngineObject {
  vertexModel: VertexModel;
  constructor(private point1: Coordinate, private point2: Coordinate, private thickness: number, private rgba: Colour) {
    super();
  }

  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }

  updatePosition(point1: Coordinate, point2: Coordinate) {
    this.point1 = point1;
    this.point2 = point2;

    const lX = point2.x - point1.x;
    const lY = point2.y - point1.y;
    const length = Math.sqrt(lX * lX + lY * lY);
    const angle = Math.atan2(lY, lX) * (180 / Math.PI);

    const mX = (point1.x + point2.x) / 2;
    const mY = (point1.y + point2.y) / 2;

    this.center(mX, mY, 0);
    this.rotateOrigin(mX, mY, 0);
    this.angleZ(angle);
    this.scale(length, this.thickness, 1.0);
  }

  init(engineHelper: EngineHelper) {
    this.vertexModel = new ColourVertexModel().fillRenderUnits(
      EngineObjectHelper.vertex.planeXYColour(
        this.rgba || new Colour(0, 0, 0, 0)
      )
    );
    this.updatePosition(this.point1, this.point2);
    const renderOpt = new RenderOption();
    renderOpt.renderType = RenderType.TRIANGLE;
    renderOpt.shaderType = ShaderType.COLOUR;
    this.shaderEntity = new ShaderEntityBuilder(engineHelper)
      .addBuffer(this.vertexModel)
      .build(this, renderOpt);
  }
}
