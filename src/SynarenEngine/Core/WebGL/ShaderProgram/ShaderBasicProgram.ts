import BaseProgram from "../Base/BaseProgram";
import BasicVertexShader from "../Shaders/BasicVertexShader.glsl";
import BasicFragmentShader from "../Shaders/BasicFragmentShader.glsl";
import ArrayBuffer from "../../Buffer/ArrayBuffer";
import ProgramReference from "../Base/ProgramReference";
import Texture from "../../Buffer/Texture";

export default class PlainShaderProgram extends BaseProgram {
  static DRAW_VERTEX_SIZE = 5;
  position: ProgramReference;
  textureCoords: ProgramReference;
  texture: ProgramReference;
  projMtrx: ProgramReference;
  modelMtrx: ProgramReference;
  viewMtrx: ProgramReference;
  arrayBuffer: ArrayBuffer;

  constructor(ctx: WebGLRenderingContext) {
    super(ctx);

    this.arrayBuffer = new ArrayBuffer(ctx);
    this.program = this.compileShaders(BasicVertexShader, BasicFragmentShader);
    this.bindProgram();

    this.position = new ProgramReference("a_position", ctx, true, this.program);
    this.textureCoords = new ProgramReference(
      "a_texture_coords",
      ctx,
      true,
      this.program
    );
    this.texture = new ProgramReference("texture", ctx, false, this.program);
    this.projMtrx = new ProgramReference(
      "u_projection",
      ctx,
      false,
      this.program
    );
    this.viewMtrx = new ProgramReference("u_view", ctx, false, this.program);
    this.modelMtrx = new ProgramReference("u_model", ctx, false, this.program);
  }

  bindProgram() {
    this._bindProgram(this.program);
  }

  unbindProgram() {
    this._unbindProgram();
  }

  enableAttribPointers() {
    const ctx = this.ctx;
    ctx.enableVertexAttribArray(this.position.ref);
    ctx.enableVertexAttribArray(this.textureCoords.ref);
  }

  bindAttributePointers() {
    this.enableAttribPointers();
    const ctx = this.ctx;
    ctx.vertexAttribPointer(this.position.ref, 3, ctx.FLOAT, false, 4 * 8, 0);
    ctx.vertexAttribPointer(
      this.textureCoords.ref,
      2,
      ctx.FLOAT,
      true,
      4 * 8,
      6 * 4
    );
  }

  unbindAttributePointers() {
    const ctx = this.ctx;
    ctx.disableVertexAttribArray(this.position.ref);
    ctx.disableVertexAttribArray(this.textureCoords.ref);
  }

  glSetViewMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.viewMtrx.ref, false, matrixArray);
  }

  glSetProjectMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.projMtrx.ref, false, matrixArray);
  }

  glSetModelViewMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.modelMtrx.ref, false, matrixArray);
  }

  bindTexture(texture: Texture) {
    texture.bindTexture(this.ctx, this.texture.ref);
  }
}
