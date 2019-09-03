import Coordinate from "../Core/Data/Coordinate";
import Rect2d from "../Core/Data/Rect2d";
import VertexModel from "../Core/Data/VertexModel";
import Events, { EngineEvent } from "../Core/Events";
import { CollisionDetection } from "../Core/Physics/CollisionDetection";
import Plane2d from "./Plane2d";

class Button extends Plane2d {
  constructor(rect: Rect2d, vertexModel: VertexModel, textureSource: string) {
    super(rect, vertexModel, textureSource);
  }

  onClick = () => {};

  event(event: EngineEvent): void {
    if (event.eventType === Events.DOWN) {
      const isClicked = CollisionDetection.isPointInRect(
        this.getRect(),
        new Coordinate(event.x, event.y, 0)
      );
      if (isClicked) {
        this.onClick();
      }
    }
  }
}

export default Button;
