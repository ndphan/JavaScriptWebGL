import { mat4, vec3 } from "gl-matrix";
import { ShaderType, RenderType } from "../../Data/RenderOption";
import Shader2DProgram from "../ShaderProgram/Shader2DProgram";
import { ShaderEntity } from "../../EngineEntity/ShaderEntity";

class Entity2DProgram {
  program: Shader2DProgram;
  ctx: WebGLRenderingContext;
  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
    this.program = new Shader2DProgram(ctx);
    this.updatePerspective();
  }

  delete() {
    this.program.arrayBuffer.delete(this.ctx);
    this.program.delete();
  }

  updateBuffer(entity: ShaderEntity, buffer: number[]) {
    const opt = entity.getOpt();
    if (ShaderType.TWO_DIMENSION !== opt.shaderType) {
      console.error(
        "Updating buffer for registered 2D Entity but with different shader type as RenderOptions",
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
      Shader2DProgram.DRAW_VERTEX_SIZE
    );
  }

  bindBuffer() {
    this.program.arrayBuffer.bufferBind(this.ctx);
  }

  render(entities: ShaderEntity[], textureReg: { [key: string]: any }) {
    this.program.arrayBuffer.bind(this.ctx);
    this.program.bindAttributePointers();
    this.program.bindProgram();
    if (this.ctx.isEnabled(this.ctx.CULL_FACE)) {
      this.ctx.disable(this.ctx.CULL_FACE);
    }
    if (this.ctx.isEnabled(this.ctx.DEPTH_TEST)) {
      this.ctx.disable(this.ctx.DEPTH_TEST);
    }

    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index];
      const opt = entity.getOpt();

      if (!entity.rendererTextureRef) {
        throw new Error("Unregistered entity texture" + entity);
      }

      const texReg = textureReg[entity.rendererTextureRef];
      this.program.bindTexture(texReg.texture);
      this.program.glSetModelViewMatrix(entity.getViewModel());

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

  registerEntity(object: ShaderEntity, objBuffer: number[]) {
    const size = objBuffer.length / Shader2DProgram.DRAW_VERTEX_SIZE;
    this.program.arrayBuffer.bufferReg[this.program.arrayBuffer.bufferRegId] = {
      offset: this.program.arrayBuffer.length(),
      size: size,
      verticesSize: objBuffer.length
    };
    this.program.arrayBuffer.push(objBuffer, size);
    object.rendererBufferId = this.program.arrayBuffer.bufferRegId;
    this.program.arrayBuffer.bufferRegId++;
  }

  updatePerspective() {
    this.program.bindProgram();
    const translateSpace = mat4.create();
    mat4.translate(translateSpace, translateSpace, vec3.fromValues(-1, -1, 0));
    mat4.scale(translateSpace, translateSpace, vec3.fromValues(2.0, 2.0, 1.0));
    this.program.glSetProjectMatrix(translateSpace);
  }
}

export default Entity2DProgram;
