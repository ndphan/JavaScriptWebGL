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
  modelViewMtrx: ProgramReference;
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
    this.modelViewMtrx = new ProgramReference(
      "u_view_model",
      ctx,
      false,
      this.program
    );
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
    const ctx = this.ctx;
    ctx.disableVertexAttribArray(this.position.ref);
    ctx.disableVertexAttribArray(this.textureCoords.ref);
  }

  bindTexture(texture: Texture) {
    const ctx = this.ctx;
    texture.bindTexture(ctx, this.tex2DSampler.ref);
  }

  glSetModelViewMatrix(matrixArray: Float32List) {
    const ctx = this.ctx;
    ctx.uniformMatrix4fv(this.modelViewMtrx.ref, false, matrixArray);
  }

  glSetProjectMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.projMtrx.ref, false, matrixArray);
  }
}
