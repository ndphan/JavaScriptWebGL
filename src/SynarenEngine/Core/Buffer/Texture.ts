class TextureLoader {
  image: HTMLImageElement;

  loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.image = document.createElement("img");
      this.image.crossOrigin = "";
      this.image.onload = () => resolve();
      this.image.onerror = error => reject(error);
      this.image.src = src;
    });
  }
}

class Texture extends TextureLoader {
  texUnit: number;
  width: number;
  height: number;
  texture: WebGLTexture;
  isLoaded: boolean;
  isError: boolean;
  load: Promise<boolean>;

  static textureCount: number = 0;

  constructor(src: string, ctx: WebGLRenderingContext) {
    super();
    this.isLoaded = false;
    this.isError = false;
    this.load = this.loadImage(src)
      .then(() => this.onLoad(ctx))
      .catch(error => this.onError(error));
  }

  onError(error: Error): boolean {
    this.isError = true;
    this.isLoaded = false;
    throw error;
  }

  onLoad(ctx: WebGLRenderingContext): boolean {
    this.handleTextureLoaded(this.image, ctx);
    this.isLoaded = true;
    this.width = this.image.width;
    this.height = this.image.height;
    return true;
  }

  newTextureUnit(): number {
    return Texture.textureCount++;
  }

  bindTexture(ctx: WebGLRenderingContext, sampler: WebGLUniformLocation) {
    if (this.isLoaded) {
      ctx.uniform1i(sampler, this.texUnit);
    }
  }

  handleTextureLoaded(image: HTMLImageElement, ctx: WebGLRenderingContext) {
    this.texUnit = this.newTextureUnit();
    ctx.activeTexture(ctx.TEXTURE0 + this.texUnit);
    this.texture = this.createTextureFromImage(image, ctx);
  }

  createTextureFromImage(
    image: HTMLImageElement,
    ctx: WebGLRenderingContext
  ): WebGLTexture {
    const texture = ctx.createTexture()!;
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texImage2D(
      ctx.TEXTURE_2D,
      0,
      ctx.RGBA,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      image
    );
    return texture;
  }
}

export default Texture;
