import BaseProgram from "../Base/BaseProgram";
import RGBFragmentShader from "../Shaders/RGBFragmentShader.glsl";
import RGBVertexShader from "../Shaders/RGBVertexShader.glsl";
import ArrayBuffer from "../../Buffer/ArrayBuffer";
import ProgramReference from "../Base/ProgramReference";

export default class ShaderProgramColour extends BaseProgram {
  static DRAW_VERTEX_SIZE = 7;
  positionRef: ProgramReference;
  colorRef: ProgramReference;
  modelViewMatrixRef: ProgramReference;

  arrayBuffer: ArrayBuffer;

  constructor(ctx: WebGLRenderingContext) {
    super(ctx);
    this.arrayBuffer = new ArrayBuffer(ctx);
    this.program = this.compileShaders(RGBVertexShader, RGBFragmentShader);
    this.bindProgram();

    this.positionRef = new ProgramReference(
      "a_position",
      ctx,
      true,
      this.program
    );
    this.colorRef = new ProgramReference("a_color", ctx, true, this.program);
    this.modelViewMatrixRef = new ProgramReference(
      "u_model",
      ctx,
      false,
      this.program
    );
  }

  bindProgram() {
    this._bindProgram(this.program);
  }

  unbindProgram() {
    this._unbindProgram();
  }

  enableAttribPointers() {
    const ctx = this.ctx;
    ctx.enableVertexAttribArray(this.positionRef.ref);
    ctx.enableVertexAttribArray(this.colorRef.ref);
  }

  bindAttributePointers() {
    this.enableAttribPointers();
    const ctx = this.ctx;
    ctx.vertexAttribPointer(
      this.positionRef.ref,
      2,
      ctx.FLOAT,
      false,
      4 * 7,
      0
    );
    ctx.vertexAttribPointer(
      this.colorRef.ref,
      3,
      ctx.FLOAT,
      false,
      4 * 7,
      3 * 4
    );
  }

  unbindAttributePointers() {
    const ctx = this.ctx;
    ctx.disableVertexAttribArray(this.positionRef.ref);
    ctx.disableVertexAttribArray(this.colorRef.ref);
  }

  glSetModelViewMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.modelViewMatrixRef.ref, false, matrixArray);
  }
}
