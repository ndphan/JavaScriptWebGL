export default class Rect3d {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  length: number;
  constructor(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    length: number
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.length = length;
  }
}
