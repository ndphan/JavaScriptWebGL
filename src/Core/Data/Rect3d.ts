import Coordinate from "./Coordinate";

export default class Rect3d extends Coordinate {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  length: number;
  centre: Rect3d;
  constructor(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    length: number
  ) {
    super(x, y, z);
    this.width = width || 0;
    this.height = height || 0;
    this.length = length || 0;
  }

  center(): Rect3d {
    if (!this.centre || !this.equalCenter(this.centre)) {
      this.centre = this.newCenter();
    }
    return this.centre;
  }

  equal(r: Rect3d) {
    return (
      r.x === this.x &&
      r.y === this.y &&
      r.z === this.z &&
      r.width === this.width &&
      r.height === this.height &&
      r.length === this.length
    );
  }

  private equalCenter(c: Rect3d) {
    return (
      c.x === this.x + this.width / 2.0 &&
      c.y === this.y + this.height / 2.0 &&
      c.z === this.z + this.length / 2.0 &&
      c.width === this.width &&
      c.height === this.height &&
      c.length === this.length
    );
  }

  newCenter(): Rect3d {
    return new Rect3d(
      this.x + this.width / 2.0,
      this.y + this.height / 2.0,
      this.z + this.length / 2.0,
      this.width,
      this.height,
      this.length
    );
  }
}
