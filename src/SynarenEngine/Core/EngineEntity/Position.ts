import Rect2d from "../Data/Rect2d";

class Position extends Rect2d {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  ax: number = 0;
  ay: number = 0;
  az: number = 0;
  nx: number = 0;
  ny: number = 0;
  nz: number = 0;
  width: number = 0;
  height: number = 0;
  length: number = 0;
  scaleX: number = 1;
  scaleY: number = 1;
  scaleZ: number = 1;
  originX: number = 0;
  originY: number = 0;
  originZ: number = 0;
  maxHeight: number = 0;
  maxWidth: number = 0;
  constructor() {
    super(0, 0, 0, 0, 0);
  }
}

export default Position;
