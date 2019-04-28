export class TextureUnit {
  u: number = 0.0;
  v: number = 0.0;
}

export default class RenderUnit {
  vertex = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  };
  normal = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  };
  texture: TextureUnit = new TextureUnit();
}
