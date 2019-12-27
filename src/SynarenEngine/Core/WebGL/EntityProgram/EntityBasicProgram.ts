import ShaderBasicProgram from "../ShaderProgram/ShaderBasicProgram";
import { ShaderType, RenderType } from "../../Data/RenderOption";
import { ShaderEntity } from "../../EngineEntity/ShaderEntity";
import { mat4 } from "gl-matrix";
import { BaseCamera } from "../../Camera";

class EntityBasicProgram {
  static DRAW_VERTEX_SIZE = 8;
  program: ShaderBasicProgram;
  ctx: WebGLRenderingContext;
  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
    this.program = new ShaderBasicProgram(ctx);
  }

  updatePerspective(projectionMatrix: mat4) {
    this.program.bindProgram();
    this.program.glSetProjectMatrix(projectionMatrix);
  }

  delete() {
    this.program.arrayBuffer.delete(this.ctx);
    this.program.delete();
  }

  updateBuffer(entity: ShaderEntity, buffer: number[]) {
    const opt = entity.getOpt();
    if (ShaderType.THREE_DIMENSION !== opt.shaderType) {
      console.error(
        "Updating buffer for registered 3D Entity but with different shader type as RenderOptions",
        opt
      );
      return;
    }

    const buffReg = this.program.arrayBuffer.bufferReg[
      entity.rendererBufferId!
    ];
    if (!buffer || buffer.length !== buffReg.verticesSize) {
      console.error(
        "New Buffer data does not match initial buffer data!",
        entity,
        buffer,
        buffReg.verticesSize
      );
    }

    this.program.arrayBuffer.bufferSub(
      this.ctx,
      buffReg.offset,
      buffReg.size,
      buffer,
      ShaderBasicProgram.DRAW_VERTEX_SIZE
    );
  }
  render(
    entities: [ShaderEntity, Float32List][],
    camera: BaseCamera,
    textureReg: { [key: string]: any }
  ) {
    this.program.arrayBuffer.bind(this.ctx);
    this.program.bindAttributePointers();
    this.program.bindProgram();
    this.program.glSetViewMatrix(camera.viewMatrix);
    if (!this.ctx.isEnabled(this.ctx.CULL_FACE)) {
      this.ctx.enable(this.ctx.CULL_FACE);
    }
    if (!this.ctx.isEnabled(this.ctx.DEPTH_TEST)) {
      this.ctx.enable(this.ctx.DEPTH_TEST);
    }

    for (let index = 0; index < entities.length; index++) {
      const data = entities[index];
      const entity = data[0];
      const model = data[1];
      const opt = entity.getOpt();
      if (!entity.rendererTextureRef) {
        throw new Error("Unregistered entity texture" + entity);
      }

      const texReg = textureReg[entity.rendererTextureRef];
      this.program.bindTexture(texReg.texture);
      this.program.glSetModelViewMatrix(model);

      if (!entity.rendererBufferId) {
        throw new Error("Unregistered entity buffer" + entity);
      }

      const buffReg = this.program.arrayBuffer.bufferReg[
        entity.rendererBufferId
      ];
      if (opt.renderType === RenderType.TRIANGLE) {
        this.ctx.drawArrays(this.ctx.TRIANGLES, buffReg.offset, buffReg.size);
      } else {
        this.ctx.drawArrays(
          this.ctx.TRIANGLE_STRIP,
          buffReg.offset,
          buffReg.size
        );
      }
    }
    this.program.arrayBuffer.unbind(this.ctx);
    this.program.unbindAttributePointers();
    this.program.unbindProgram();
  }

  bindBuffer() {
    this.program.arrayBuffer.bufferBind(this.ctx);
  }

  registerEntity(object: ShaderEntity, objBuffer: number[]) {
    const size = objBuffer.length / EntityBasicProgram.DRAW_VERTEX_SIZE;
    this.program.arrayBuffer.bufferReg[this.program.arrayBuffer.bufferRegId] = {
      offset: this.program.arrayBuffer.length(),
      size: size,
      verticesSize: objBuffer.length
    };
    this.program.arrayBuffer.push(objBuffer, size);
    object.rendererBufferId = this.program.arrayBuffer.bufferRegId;
    this.program.arrayBuffer.bufferRegId++;
  }
}

export default EntityBasicProgram;
