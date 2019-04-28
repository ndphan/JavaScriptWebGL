export class ShaderType {
  static TWO_DIMENSION = 1;
  static THREE_DIMENSION = 2;
  static COLOUR = 3;
}

export class RenderType {
  static PLAIN = 1;
  static TRIANGLE = 2;
  static RECTANGLE = 3;
}

export default class RenderOption {
  shaderType: ShaderType;
  renderType: RenderType;
}
