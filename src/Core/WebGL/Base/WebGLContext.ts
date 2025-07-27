import Colour from "../../Data/Colour";

class WebGLContext {
  ctx: WebGLRenderingContext;
  clearColour: Colour = new Colour(1.0, 1.0, 1.0, 1.0);

  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
  }

  setClearColor(colour: Colour) {
    this.clearColour = colour;
    this.ctx.clearColor(colour.r, colour.g, colour.b, colour.a);
  }

  setupDefault() {
    this.setClearColor(this.clearColour);
    this.ctx.enable(this.ctx.BLEND);
    this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
    this.ctx.enable(this.ctx.CULL_FACE);
    this.ctx.frontFace(this.ctx.CCW);
    this.ctx.cullFace(this.ctx.BACK);
    this.ctx.clearDepth(1);
    this.ctx.enable(this.ctx.DEPTH_TEST);
    this.ctx.depthFunc(this.ctx.LEQUAL);
  }

  clear() {
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
  }

  deleteTexture(texture: WebGLTexture) {
    this.ctx.deleteTexture(texture);
  }

  resizeViewPort(canvas: HTMLCanvasElement) {
    this.ctx.viewport(0, 0, canvas.width, canvas.height);
  }

  getWebGL2RenderingContext(): WebGL2RenderingContext {
    return this.ctx as WebGL2RenderingContext;
  }

  destroyWebGL() {
    const ctx = this.ctx;
    const ctx2 = this.getWebGL2RenderingContext();
    const isWebGL2RenderingContext = !!ctx2.createTransformFeedback;

    if (isWebGL2RenderingContext) {
      ctx2.bindVertexArray(null);
    }

    const numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
    const tmp = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
    for (let ii = 0; ii < numAttribs; ++ii) {
      ctx.disableVertexAttribArray(ii);
      ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
      ctx.vertexAttrib1f(ii, 0);
      if (isWebGL2RenderingContext) {
        ctx2.vertexAttribDivisor(ii, 0);
      }
    }
    ctx.deleteBuffer(tmp);

    const numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
    for (let ii = 0; ii < numTextureUnits; ++ii) {
      ctx.activeTexture(ctx.TEXTURE0 + ii);
      ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
      ctx.bindTexture(ctx.TEXTURE_2D, null);
      if (isWebGL2RenderingContext) {
        ctx2.bindTexture(ctx2.TEXTURE_2D_ARRAY, null);
        ctx2.bindTexture(ctx2.TEXTURE_3D, null);
        ctx2.bindSampler(ii, null);
      }
    }

    ctx.activeTexture(ctx.TEXTURE0);
    ctx.useProgram(null);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    ctx.disable(ctx.BLEND);
    ctx.disable(ctx.CULL_FACE);
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.DITHER);
    ctx.disable(ctx.SCISSOR_TEST);
    ctx.blendColor(0, 0, 0, 0);
    ctx.blendEquation(ctx.FUNC_ADD);
    ctx.blendFunc(ctx.ONE, ctx.ZERO);
    ctx.clearColor(0, 0, 0, 0);
    ctx.clearDepth(1);
    ctx.clearStencil(-1);
    ctx.colorMask(true, true, true, true);
    ctx.cullFace(ctx.BACK);
    ctx.depthFunc(ctx.LESS);
    ctx.depthMask(true);
    ctx.depthRange(0, 1);
    ctx.frontFace(ctx.CCW);
    ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
    ctx.lineWidth(1);
    ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
    ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 0);
    ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

    if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
      ctx.pixelStorei(
        ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL,
        ctx.BROWSER_DEFAULT_WEBGL
      );
    }
    ctx.polygonOffset(0, 0);
    ctx.sampleCoverage(1, false);
    ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.stencilFunc(ctx.ALWAYS, 0, 0xffffffff);
    ctx.stencilMask(0xffffffff);
    ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clear(
      ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT
    );

    if (isWebGL2RenderingContext) {
      ctx2.drawBuffers([ctx2.BACK]);

      ctx2.readBuffer(ctx2.BACK);

      ctx2.bindBuffer(ctx2.COPY_READ_BUFFER, null);

      ctx2.bindBuffer(ctx2.COPY_WRITE_BUFFER, null);

      ctx2.bindBuffer(ctx2.PIXEL_PACK_BUFFER, null);

      ctx2.bindBuffer(ctx2.PIXEL_UNPACK_BUFFER, null);
      const numTransformFeedbacks = ctx.getParameter(
        ctx2.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS
      );
      for (let ii = 0; ii < numTransformFeedbacks; ++ii) {
        ctx2.bindBufferBase(ctx2.TRANSFORM_FEEDBACK_BUFFER, ii, null);
      }

      const numUBOs = ctx.getParameter(ctx2.MAX_UNIFORM_BUFFER_BINDINGS);
      for (let ii = 0; ii < numUBOs; ++ii) {
        ctx2.bindBufferBase(ctx2.UNIFORM_BUFFER, ii, null);
      }

      ctx2.disable(ctx2.RASTERIZER_DISCARD);

      ctx2.pixelStorei(ctx2.UNPACK_IMAGE_HEIGHT, 0);

      ctx2.pixelStorei(ctx2.UNPACK_SKIP_IMAGES, 0);

      ctx2.pixelStorei(ctx2.UNPACK_ROW_LENGTH, 0);

      ctx2.pixelStorei(ctx2.UNPACK_SKIP_ROWS, 0);

      ctx2.pixelStorei(ctx2.UNPACK_SKIP_PIXELS, 0);

      ctx2.pixelStorei(ctx2.PACK_ROW_LENGTH, 0);

      ctx2.pixelStorei(ctx2.PACK_SKIP_ROWS, 0);

      ctx2.pixelStorei(ctx2.PACK_SKIP_PIXELS, 0);

      ctx2.hint(ctx2.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx2.DONT_CARE);
    }
  }

  programInfo(program: WebGLProgram) {
    const numAttribs = this.ctx.getProgramParameter(
      program,
      this.ctx.ACTIVE_ATTRIBUTES
    );
    for (let ii = 0; ii < numAttribs; ++ii) {
      const attribInfo = this.ctx.getActiveAttrib(program, ii);
      if (!attribInfo) {
        break;
      }
      console.log(
        this.ctx.getAttribLocation(program, attribInfo.name),
        attribInfo.name
      );
    }
  }
}

export default WebGLContext;
