import Coordinate from "./Coordinate";

export class TextureUnit {
  u: number = 0.0;
  v: number = 0.0;
}

export class Colour {
  r: number = 0.0;
  g: number = 0.0;
  b: number = 0.0;
  a: number = 0.0;
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
