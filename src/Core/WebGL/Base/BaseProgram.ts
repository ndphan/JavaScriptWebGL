export default class BaseProgram {
  program: WebGLProgram;
  ctx: WebGLRenderingContext;

  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
  }

  compileShaders(
    vertexShaderContent: string,
    fragmentShaderContent: string
  ): WebGLProgram {
    const ctx = this.ctx;
    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      throw new Error("Unable to create vertex or fragment shader");
    }

    const fragmentChar = fragmentShaderContent;
    const vertexChar = vertexShaderContent;

    ctx.shaderSource(vertexShader, vertexChar);
    ctx.compileShader(vertexShader);

    ctx.shaderSource(fragmentShader, fragmentChar);
    ctx.compileShader(fragmentShader);

    if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
      const error =
        "could not compile vertex shader:" + ctx.getShaderInfoLog(vertexShader);
      console.error(error);
      throw new Error(error);
    }

    if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {
      const error =
        "could not compile fragment shader:" +
        ctx.getShaderInfoLog(fragmentShader);
      console.error(error);
      throw new Error(error);
    }

    const program: WebGLProgram = ctx.createProgram()!;
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    ctx.validateProgram(program);

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      const error = "Link failed: " + ctx.getProgramInfoLog(program);
      console.error(error);
      throw new Error(error);
    }

    console.log("Shader program compiled successfully");
    return program;
  }

  delete() {
    this.ctx.deleteProgram(this.program);
  }

  _bindProgram(program: WebGLProgram) {
    this.ctx.useProgram(program);
  }
  _unbindProgram() {}
}
