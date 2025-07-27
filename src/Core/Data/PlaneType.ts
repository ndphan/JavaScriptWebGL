export default class PlaneType {
  static XY = new PlaneType('XY', 0, 0, 0, 0);
  static YX = new PlaneType('YX', 0, 0, 0, 0);
  static XZ = new PlaneType('XZ', 0, 0, 0, 0);
  static ZX = new PlaneType('ZX' ,0, 0, 0, 0);
  static YZ = new PlaneType('YZ', 0, 0, 0, 0);
  static ZY = new PlaneType('ZY', 0, 0, 0, 0);
  static BACKWARDS = -1;
  static FORWARD = 1;

  name: string;
  width: number;
  height: number;
  length: number;
  normalDirection: number;

  constructor(
    name: string,
    width: number,
    height: number,
    length: number,
    normalDirection: number
  ) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.length = length;
    this.normalDirection = normalDirection;
  }
}
