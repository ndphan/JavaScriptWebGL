import BaseProgram from "../Base/BaseProgram";
import ShadowDepthFragmentShader from "../Shaders/ShadowDepthFragmentShader.glsl";
import PassthroughVertexShader from "../Shaders/PassthroughVertexShader.glsl";
import ShadowLightVertexShader from "../Shaders/ShadowLightVertexShader.glsl";
import ShadowLightFragmentShader from "../Shaders/ShadowLightFragmentShader.glsl";
import LightFragmentShader from "../Shaders/LightFragmentShader.glsl";
import LightVertexShader from "../Shaders/LightVertexShader.glsl";
import ArrayBuffer from "../../Buffer/ArrayBuffer";
import { mat4, vec3 } from "gl-matrix";
import Texture from "../../Buffer/Texture";
import ProgramReference from "../Base/ProgramReference";
import Light from "../../Data/Light";
import { BaseCamera } from "../../Camera";

export default class Shader3DProgram extends BaseProgram {
  static DRAW_VERTEX_SIZE = 8;
  position: ProgramReference;
  textureCoords: ProgramReference;
  normal: ProgramReference;

  projMtrx: ProgramReference;
  modelMtrx: ProgramReference;
  viewMtrx: ProgramReference;

  light1Pos: ProgramReference;
  light1Intensities: ProgramReference;
  light1Attenu: ProgramReference;
  light1AmbCoeff: ProgramReference;
  light1View: ProgramReference;
  light1Projection: ProgramReference;

  shadowMap: ProgramReference;
  tex2DSampler: ProgramReference;

  arrayBuffer: ArrayBuffer;

  // shadow program
  shadowProgram: WebGLProgram;
  shadowFramebuffer: WebGLFramebuffer;
  shadowDepthTexture: WebGLTexture;
  shadowRenderBuffer: WebGLRenderbuffer;

  shadowPos: ProgramReference;
  shadowProjection: ProgramReference;
  shadowView: ProgramReference;
  shadowModel: ProgramReference;

  shadowTextureUnit: number;

  isShadowEnabled: boolean;

  light: Light;

  // this must be changed in shader as well.
  shadowDepthTextureSize = 1024.0;

  constructor(ctx: WebGLRenderingContext) {
    super(ctx);
    this.arrayBuffer = new ArrayBuffer(ctx);

    if (this.isShadowEnabled) {
      this.program = this.compileShaders(
        ShadowLightVertexShader,
        ShadowLightFragmentShader
      );
      this.bindProgram();
      this.shadowMap = new ProgramReference(
        "shadowMap",
        ctx,
        false,
        this.program
      );
      this.light1View = new ProgramReference(
        "u_light1_view",
        ctx,
        false,
        this.program
      );
      this.light1Projection = new ProgramReference(
        "u_light1_projection",
        ctx,
        false,
        this.program
      );
    } else {
      this.program = this.compileShaders(
        LightVertexShader,
        LightFragmentShader
      );
      this.bindProgram();
    }
    this.normal = new ProgramReference("a_normal", ctx, true, this.program);
    this.position = new ProgramReference("a_position", ctx, true, this.program);
    this.textureCoords = new ProgramReference(
      "a_texture_coords",
      ctx,
      true,
      this.program
    );

    this.projMtrx = new ProgramReference(
      "u_projection",
      ctx,
      false,
      this.program
    );
    this.viewMtrx = new ProgramReference("u_view", ctx, false, this.program);
    this.modelMtrx = new ProgramReference("u_model", ctx, false, this.program);

    this.tex2DSampler = new ProgramReference(
      "texture",
      ctx,
      false,
      this.program
    );

    this.light1Pos = new ProgramReference(
      "u_light1_pos",
      ctx,
      false,
      this.program
    );
    this.light1Intensities = new ProgramReference(
      "u_light1_intensities",
      ctx,
      false,
      this.program
    );
    this.light1Attenu = new ProgramReference(
      "u_light1_attenuation",
      ctx,
      false,
      this.program
    );
    this.light1AmbCoeff = new ProgramReference(
      "u_light1_ambient_coefficient",
      ctx,
      false,
      this.program
    );

    if (this.isShadowEnabled) {
      this.initShadowProgram();
    }
  }

  initShadowProgram() {
    const ctx = this.ctx;
    this.shadowProgram = this.compileShaders(
      PassthroughVertexShader,
      ShadowDepthFragmentShader
    );
    this.bindShadowProgram();

    this.shadowPos = new ProgramReference(
      "a_position",
      ctx,
      true,
      this.shadowProgram
    );
    this.shadowProjection = new ProgramReference(
      "u_projection",
      ctx,
      false,
      this.shadowProgram
    );
    this.shadowView = new ProgramReference(
      "u_view",
      ctx,
      false,
      this.shadowProgram
    );
    this.shadowModel = new ProgramReference(
      "u_model",
      ctx,
      false,
      this.shadowProgram
    );

    this.shadowFramebuffer = ctx.createFramebuffer()!;
    this.createDepthTexture();

    this.shadowRenderBuffer = ctx.createRenderbuffer()!;
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, this.shadowRenderBuffer);
    ctx.renderbufferStorage(
      ctx.RENDERBUFFER,
      ctx.DEPTH_COMPONENT16,
      this.shadowDepthTextureSize,
      this.shadowDepthTextureSize
    );

    ctx.bindFramebuffer(ctx.FRAMEBUFFER, this.shadowFramebuffer);
    ctx.framebufferTexture2D(
      ctx.FRAMEBUFFER,
      ctx.COLOR_ATTACHMENT0,
      ctx.TEXTURE_2D,
      this.shadowDepthTexture,
      0
    );
    ctx.framebufferRenderbuffer(
      ctx.FRAMEBUFFER,
      ctx.DEPTH_ATTACHMENT,
      ctx.RENDERBUFFER,
      this.shadowRenderBuffer
    );

    ctx.bindTexture(ctx.TEXTURE_2D, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
  }

  createDepthTexture() {
    const ctx = this.ctx;
    this.shadowTextureUnit = Texture.textureCount;
    ctx.activeTexture(ctx.TEXTURE0 + this.shadowTextureUnit);
    Texture.textureCount += 1;

    this.shadowDepthTexture = ctx.createTexture()!;
    ctx.bindTexture(ctx.TEXTURE_2D, this.shadowDepthTexture);

    ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texImage2D(
      ctx.TEXTURE_2D,
      0,
      ctx.RGBA,
      this.shadowDepthTextureSize,
      this.shadowDepthTextureSize,
      0,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      null
    );
  }

  bindShadowProgram() {
    this._bindProgram(this.shadowProgram);
  }

  bindProgram() {
    this._bindProgram(this.program);
  }

  unbindProgram() {
    this._unbindProgram();
  }

  unbindShadowProgram() {}

  enableAttribPointers() {
    const ctx = this.ctx;
    ctx.enableVertexAttribArray(this.position.ref);
    ctx.enableVertexAttribArray(this.textureCoords.ref);
    ctx.enableVertexAttribArray(this.normal.ref);
  }

  bindAttributePointers() {
    this.enableAttribPointers();
    const ctx = this.ctx;
    ctx.vertexAttribPointer(this.position.ref, 3, ctx.FLOAT, false, 4 * 8, 0);
    ctx.vertexAttribPointer(this.normal.ref, 3, ctx.FLOAT, true, 4 * 8, 3 * 4);
    ctx.vertexAttribPointer(
      this.textureCoords.ref,
      2,
      ctx.FLOAT,
      true,
      4 * 8,
      6 * 4
    );
  }

  enableShadowAttribPointers() {
    this.ctx.enableVertexAttribArray(this.shadowPos.ref);
  }

  bindShadowAttributePointers() {
    this.enableShadowAttribPointers();
    const ctx = this.ctx;
    ctx.vertexAttribPointer(this.shadowPos.ref, 3, ctx.FLOAT, false, 4 * 8, 0);
  }

  glSetShadowModelMatrix(matrixArray: Float32List) {
    this.ctx.uniformMatrix4fv(this.shadowModel.ref, false, matrixArray);
  }

  unbindShadowAttributePointers() {
    this.ctx.disableVertexAttribArray(this.shadowPos.ref);
  }

  setLight(light: Light, camera: BaseCamera) {
    this.light = light;
    const lookAt = light.lookAt();

    this.bindProgram();
    const ctx = this.ctx;
    ctx.uniform3fv(this.light1Pos.ref, light.pos);
    ctx.uniform3fv(this.light1Intensities.ref, light.in);
    ctx.uniform1f(this.light1AmbCoeff.ref, light.ambientCoeff);
    ctx.uniform1f(this.light1Attenu.ref, light.attenuation);

    if (this.isShadowEnabled) {
      const cameraFrustum = mat4.frustum(
        mat4.create(),
        -1 * camera.aspect,
        1 * camera.aspect,
        -1 * camera.aspect,
        1 * camera.aspect,
        1,
        vec3.squaredDistance(light.posVec(), light.atVec())
      );

      ctx.uniformMatrix4fv(this.light1View.ref, false, lookAt);
      ctx.uniformMatrix4fv(this.light1Projection.ref, false, cameraFrustum);

      this.bindShadowProgram();
      ctx.uniformMatrix4fv(this.shadowView.ref, false, lookAt);
      ctx.uniformMatrix4fv(this.shadowProjection.ref, false, cameraFrustum);
    }
  }

  prepareShadowTexture() {
    const ctx = this.ctx;
    ctx.activeTexture(ctx.TEXTURE0 + this.shadowTextureUnit);
    ctx.bindTexture(ctx.TEXTURE_2D, this.shadowDepthTexture);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, this.shadowRenderBuffer);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, this.shadowFramebuffer);
    ctx.viewport(
      0,
      0,
      this.shadowDepthTextureSize,
      this.shadowDepthTextureSize
    );
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

    this.arrayBuffer.bind(ctx);
    this.bindShadowAttributePointers();
    this.bindShadowProgram();
  }

  revertShadowTexture() {
    const ctx = this.ctx;
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    this.arrayBuffer.unbind(ctx);
    this.unbindShadowAttributePointers();
    this.unbindShadowProgram();
  }

  bindShadowTexture() {
    this.bindProgram();
    this.ctx.uniform1i(this.shadowMap.ref, this.shadowTextureUnit);
  }

  unbindAttributePointers() {
    const ctx = this.ctx;
    ctx.disableVertexAttribArray(this.position.ref);
    ctx.disableVertexAttribArray(this.textureCoords.ref);
    ctx.disableVertexAttribArray(this.normal.ref);
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
    texture.bindTexture(this.ctx, this.tex2DSampler.ref);
  }
}
