import Rect2d from "../Data/Rect2d";
import Coordinate from "../Data/Coordinate";

export default class EngineMath {
  public static boundRect(bound: Rect2d, pos: Rect2d): Coordinate {
    const boundedX = Math.max(
      bound.x + pos.width / 2.0,
      Math.min(bound.x + bound.width - pos.width / 2.0, pos.x)
    );
    const boundedY = Math.max(
      bound.y + pos.height / 2.0,
      Math.min(bound.y + bound.height - pos.height / 2.0, pos.y)
    );
    return new Coordinate(boundedX, boundedY, pos.z);
  }
  public static getLength(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(
      Math.abs((x1 - x2) * (x1 - x2)) + Math.abs((y1 - y2) * (y1 - y2))
    );
  }
}
