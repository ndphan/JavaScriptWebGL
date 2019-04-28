export interface ArrayBufferMetaData {
  offset: number;
  size: number;
  verticesSize: number;
}

class ArrayBuffer {
  bufferid: WebGLBuffer;
  bufferArray: number[] = [];
  verticeSize: number = 0;
  bufferReg: {
    [key: string]: ArrayBufferMetaData;
  } = {};
  bufferRegId: number = 1;
  deleted: boolean = false;

  constructor(ctx: WebGLRenderingContext) {
    this.bufferid = ctx.createBuffer()!;
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.bufferid);
  }

  delete(ctx: WebGLRenderingContext) {
    ctx.deleteBuffer(this.bufferid);
    this.deleted = true;
  }

  bufferBind(ctx: WebGLRenderingContext) {
    if (this.deleted) {
      return;
    }

    this.bind(ctx);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array(this.bufferArray),
      ctx.STATIC_DRAW
    );
  }

  length() {
    return this.verticeSize;
  }

  bufferSub(
    ctx: WebGLRenderingContext,
    offset: number,
    size: number,
    data: number[],
    vertexSize: number
  ) {
    if (this.deleted) {
      return;
    }
    this.bind(ctx);
    ctx.bufferSubData(
      ctx.ARRAY_BUFFER,
      offset * Float32Array.BYTES_PER_ELEMENT * vertexSize,
      new Float32Array(data)
    );
  }

  reset() {
    this.bufferArray = [];
  }

  push(vertices: number[], size: number) {
    this.bufferArray = this.bufferArray.concat(vertices);
    this.verticeSize += size;
  }

  bind(ctx: WebGLRenderingContext) {
    if (this.deleted === true) {
      return;
    }
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.bufferid);
  }

  unbind(ctx: WebGLRenderingContext) {
    // do nothing for now
  }
}

export default ArrayBuffer;
