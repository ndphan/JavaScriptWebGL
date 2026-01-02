export interface ArrayBufferMetaData {
  offset: number;
  size: number;
  verticesSize: number;
}

class ArrayBuffer {
  bufferid: WebGLBuffer;
  bufferArray: number[] = [];
  verticeSize = 0;
  bufferReg: {
    [key: string]: ArrayBufferMetaData;
  } = {};
  bufferRegId = 1;
  deleted = false;
  maxSize: number;
  private isBuffered = false;
  private ctx: WebGLRenderingContext;
  private static readonly MAX_BUFFER_SIZE = 10000000; // 10M floats (~40MB)

  constructor(ctx: WebGLRenderingContext) {
    this.bufferid = ctx.createBuffer()!;
    this.ctx = ctx;
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.bufferid);
  }

  delete() {
    this.ctx.deleteBuffer(this.bufferid);
    this.deleted = true;
  }

  bufferBind() {
    if (this.deleted) {
      return;
    }
    const wasBuffered = this.isBuffered;
    this.isBuffered = true;
    this.bind();

    if (!wasBuffered) {
      this.maxSize = 200000;
    } else {
      const doubled = this.bufferArray.length * 2;
      const capped = Math.min(doubled, ArrayBuffer.MAX_BUFFER_SIZE);
      this.maxSize = Math.max(capped, this.bufferArray.length);
    }

    const buffer = new Float32Array(this.maxSize);
    buffer.fill(0, this.bufferArray.length);
    buffer.set(this.bufferArray);

    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, buffer, this.ctx.STATIC_DRAW);
  }

  length() {
    return this.verticeSize;
  }

  bufferSub(offset: number, data: number[], vertexSize: number) {
    if (this.deleted) {
      return;
    }
    this.bind();
    this.ctx.bufferSubData(
      this.ctx.ARRAY_BUFFER,
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

    if (this.isBuffered) {
      if (this.bufferArray.length < this.maxSize) {
        this.bufferSub(
          this.verticeSize - size,
          vertices,
          vertices.length / size
        );
      } else {
        this.bufferBind();
        console.log("buffer resizing as limit has been reached");
      }
    }
  }

  bind() {
    if (this.deleted === true) {
      return;
    }
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.bufferid);
  }

  unbind() {
    // do nothing for now
  }
}

export default ArrayBuffer;
