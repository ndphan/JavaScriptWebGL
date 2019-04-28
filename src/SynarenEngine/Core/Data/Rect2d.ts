import Rect3d from "./Rect3d";

export default class Rect2d extends Rect3d {
  constructor(
    x: number,
    y: number,
    layer: number,
    width: number,
    height: number
  ) {
    super(x, y, layer, width, height, 1);
  }
}
