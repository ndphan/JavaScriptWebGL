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

    let successTest = ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS);
    if (!successTest) {
      throw new Error(
        "could not compile vertex shader:" + ctx.getShaderInfoLog(vertexShader)
      );
    }

    successTest = null;
    successTest = ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS);
    if (!successTest) {
      throw new Error(
        "could not compile fragment shader:" +
          ctx.getShaderInfoLog(fragmentShader)
      );
    }

    const program: WebGLProgram = ctx.createProgram()!;
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    successTest = null;
    successTest = ctx.getProgramParameter(program, ctx.LINK_STATUS);
    if (!successTest) {
      throw new Error(
        "program create failed:" + ctx.getProgramInfoLog(program)
      );
    }

    return program;
  }

  delete() {
    this.ctx.deleteProgram(this.program);
  }

  _bindProgram(program: WebGLProgram) {
    this.ctx.useProgram(program);
  }
  _unbindProgram() {
  }
}
