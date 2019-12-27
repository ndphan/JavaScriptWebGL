import Rect3d from "./Rect3d";

export default class Rect2d extends Rect3d {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    layer?: number
  ) {
    super(x, y, layer || 0, width, height, 1);
  }

  static create() {
    return new Rect2d(0, 0, 0, 0, 0);
  }

  newCenter(): Rect2d {
    return new Rect2d(
      this.x + this.width / 2.0,
      this.y + this.height / 2.0,
      this.width,
      this.height,
      this.z
    );
  }
}
