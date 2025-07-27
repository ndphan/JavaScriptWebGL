import Coordinate from "./Coordinate";

export class TextureUnit {
  u = 0.0;
  v = 0.0;
}

export class Colour {
  r = 0.0;
  g = 0.0;
  b = 0.0;
  a = 0.0;
}

export class RenderUnit {
  vertex: Coordinate = new Coordinate(0, 0, 0);
}

export class TextureRenderUnit extends RenderUnit {
  texture: TextureUnit = new TextureUnit();
  normal: Coordinate = new Coordinate(0, 0, 0);
}

export class ColourRenderUnit extends RenderUnit {
  colour: Colour = new Colour();
}
