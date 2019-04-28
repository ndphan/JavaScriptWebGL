export default class ProgramReference {
  ref: any | number | WebGLUniformLocation;

  constructor(
    key: string,
    ctx: WebGLRenderingContext,
    isAttribute: boolean,
    program: WebGLProgram
  ) {
    if (isAttribute) {
      this.ref = ctx.getAttribLocation(program, key);
      if (this.ref === -1) {
        throw new Error("Unable to find attribute shader key = " + key);
      }
    } else {
      this.ref = ctx.getUniformLocation(program, key);
      if (this.ref === null) {
        throw new Error("Unable to find uniform shader key = " + key);
      }
    }
  }
}
