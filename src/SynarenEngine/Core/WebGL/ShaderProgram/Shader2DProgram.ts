import BaseProgram from "../Base/BaseProgram";
import vertexShader2d from "../Shaders/TwoDimensionVertexShader.glsl";
import textureFragmentShader2D from "../Shaders/TwoDimensionFragmentShader.glsl";
import ArrayBuffer from "../../Buffer/ArrayBuffer";
import ProgramReference from "../Base/ProgramReference";
import Texture from "../../Buffer/Texture";

export default class Shader2DProgram extends BaseProgram {
  static DRAW_VERTEX_SIZE = 8;
  position: ProgramReference;
  textureCoords: ProgramReference;
  tex2DSampler: ProgramReference;
  modelMtrx: ProgramReference;
  viewMtrx: ProgramReference;
  projMtrx: ProgramReference;
  arrayBuffer: ArrayBuffer;

  constructor(ctx: WebGLRenderingContext) {
    super(ctx);
    this.arrayBuffer = new ArrayBuffer(ctx);
    this.program = this.compileShaders(vertexShader2d, textureFragmentShader2D);
    this.bindProgram();

    this.position = new ProgramReference("a_position", ctx, true, this.program);
    this.textureCoords = new ProgramReference(
      "a_texture_coords",
      ctx,
      true,
      this.program
    );
    this.tex2DSampler = new ProgramReference(
      "texture",
      ctx,
      false,
      this.program
    );
    this.viewMtrx = new ProgramReference("u_view", ctx, false, this.program);
    this.modelMtrx = new ProgramReference("u_model", ctx, false, this.program);
    this.projMtrx = new ProgramReference(
      "u_projection",
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
      false,
      4 * 8,
      6 * 4
    );
  }

  unbindAttributePointers() {
    this.ctx.disableVertexAttribArray(this.position.ref);
    this.ctx.disableVertexAttribArray(this.textureCoords.ref);
  }

  bindTexture(texture: Texture) {
    texture.bindTexture(this.ctx, this.tex2DSampler.ref);
  }

  glSetModelMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.modelMtrx.ref, false, matrixArray);
  }

  glSetProjectMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.projMtrx.ref, false, matrixArray);
  }

  glSetViewMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.viewMtrx.ref, false, matrixArray);
  }
}
