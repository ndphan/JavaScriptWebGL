import Rect2d from "../Data/Rect2d";

class Position extends Rect2d {
  x = 0;
  y = 0;
  z = 0;
  ax = 0;
  ay = 0;
  az = 0;
  nx = 0;
  ny = 0;
  nz = 0;
  width = 0;
  height = 0;
  length = 0;
  scaleX = 1;
  scaleY = 1;
  scaleZ = 1;
  originX = 0;
  originY = 0;
  originZ = 0;
  maxHeight = 0;
  maxWidth = 0;
  constructor() {
    super(0, 0, 0, 0, 0);
  }
}

export default Position;
