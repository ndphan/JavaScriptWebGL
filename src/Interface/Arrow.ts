import EngineHelper from "../Core/EngineHelper";
import EntityManager2d from "../Manager/EntityManager2d";
import Rect2d from "../Core/Data/Rect2d";
import Colour from "../Core/Data/Colour";
import PlaneColour from "../Entity/PlaneColour";
import TriangleColour2d from "../Entity/TriangleColour2d";
import Coordinate from "../Core/Data/Coordinate";

export default class Arrow extends EntityManager2d {
  private arrowBar: PlaneColour;
  private head: TriangleColour2d;
  private headScale: number;

  private readonly initialHeadRotation = 135;

  constructor(rect: Rect2d, background: Colour, arrowHeadScale = 1.2) {
    super();
    this.setRect(rect);
    this.headScale = arrowHeadScale;

    this.arrowBar = new PlaneColour(rect, background);
    this.head = new TriangleColour2d(rect, background);
    this.head.rotateZ(this.initialHeadRotation);
    this.calculatePos();

    this.entities.push(this.arrowBar);
    this.entities.push(this.head);
  }

  private calculatePos() {
    const { x, y, width, height } = this.position;
    const barPos = new Rect2d(x - width, y - height / 2.0, width, height);
    this.arrowBar.setRect(barPos);

    const arrowHeadSize = barPos.width * this.headScale;
    const headPos = new Rect2d(
      x - arrowHeadSize / 2.0,
      y - arrowHeadSize / 2.0,
      arrowHeadSize,
      arrowHeadSize
    );
    this.head.setRect(headPos);

    this.head.rotateOriginRect(this.position);
    this.arrowBar.rotateOriginRect(this.position);
  }

  rotate(angle: number) {
    if (angle === this.position.az) {
      return;
    }
    super.angleZ(angle);
    this.head.angleZ(this.position.az - this.initialHeadRotation);
    this.calculatePos();
  }

  setLocation(pos: Coordinate) {
    this.center(pos.x, pos.y, pos.z);
    this.calculatePos();
  }

  init(engineHelper: EngineHelper) {
    super.init(engineHelper);
  }

  render(engineHelper: EngineHelper) {
    super.render(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    super.update(engineHelper);
  }
}
