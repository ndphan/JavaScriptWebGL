export default class PlaneType {
  static XY = new PlaneType(0, 0, 0, 0);
  static YX = new PlaneType(0, 0, 0, 0);
  static XZ = new PlaneType(0, 0, 0, 0);
  static ZX = new PlaneType(0, 0, 0, 0);
  static YZ = new PlaneType(0, 0, 0, 0);
  static ZY = new PlaneType(0, 0, 0, 0);
  static BACKWARDS = -1;
  static FORWARD = 1;

  width: number;
  height: number;
  length: number;
  normalDirection: number;

  constructor(
    width: number,
    height: number,
    length: number,
    normalDirection: number
  ) {
    this.width = width;
    this.height = height;
    this.length = length;
    this.normalDirection = normalDirection;
  }
}
