export class ShaderType {
  static TWO_DIMENSION = 1;
  static THREE_DIMENSION = 2;
  static COLOUR = 3;
}

export class RenderType {
  static PLAIN = 4;
  static TRIANGLE = 5;
  static RECTANGLE = 6;
}

export default class RenderOption {
  shaderType: ShaderType;
  renderType: RenderType;
}
