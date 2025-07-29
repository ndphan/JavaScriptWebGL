import { ShaderType } from "../../Data/RenderOption";
import ShaderProgramColour from "../ShaderProgram/ShaderColourProgram";
import { ShaderEntity } from "../../EngineEntity/ShaderEntity";
import { mat4 } from "gl-matrix";
import { BaseCamera } from "../../Camera";

class EntityColourProgram {
  program: ShaderProgramColour;
  ctx: WebGLRenderingContext;
  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
    this.program = new ShaderProgramColour(ctx);
  }

  delete() {
    this.program.arrayBuffer.delete();
    this.program.delete();
  }

  updateBuffer(entity: ShaderEntity, buffer: number[]) {
    const opt = entity.getOpt();
    if (ShaderType.COLOUR !== opt.shaderType) {
      console.error(
        "Updating buffer for registered Colour Entity but with different shader type as RenderOptions",
        opt
      );
      return;
    }

    const buffReg =
      this.program.arrayBuffer.bufferReg[entity.rendererBufferId!];
    if (!buffer || buffer.length !== buffReg.verticesSize) {
      console.error(
        "New Buffer data does not match initial buffer data!",
        entity,
        buffer,
        buffReg.verticesSize
      );
    }

    this.program.arrayBuffer.bufferSub(
      buffReg.offset,
      buffer,
      ShaderProgramColour.DRAW_VERTEX_SIZE
    );
  }

  bindBuffer() {
    this.program.arrayBuffer.bufferBind();
  }

  render(entities: [ShaderEntity, Float32List][], camera: BaseCamera) {
    this.program.arrayBuffer.bind();
    this.program.bindAttributePointers();
    this.program.bindProgram();
    this.program.glSetViewMatrix(camera.viewMatrix);
    if (this.ctx.isEnabled(this.ctx.CULL_FACE)) {
      this.ctx.disable(this.ctx.CULL_FACE);
    }
    if (this.ctx.isEnabled(this.ctx.DEPTH_TEST)) {
      this.ctx.disable(this.ctx.DEPTH_TEST);
    }

    for (let index = 0; index < entities.length; index++) {
      const data = entities[index];
      const entity = data[0];
      const model = data[1];
      if (!entity.rendererBufferId) {
        throw new Error("Unregistered entity buffer" + entity);
      }
      const buffReg =
        this.program.arrayBuffer.bufferReg[entity.rendererBufferId];
      this.program.glSetModelViewMatrix(model);
      this.ctx.drawArrays(
        this.ctx.TRIANGLE_STRIP,
        buffReg.offset,
        buffReg.size
      );
    }

    this.program.arrayBuffer.unbind();
    this.program.unbindAttributePointers();
    this.program.unbindProgram();
  }

  registerEntity(object: ShaderEntity, objBuffer: number[]) {
    const size = objBuffer.length / ShaderProgramColour.DRAW_VERTEX_SIZE;
    this.program.arrayBuffer.bufferReg[this.program.arrayBuffer.bufferRegId] = {
      offset: this.program.arrayBuffer.length(),
      size: size,
      verticesSize: objBuffer.length,
    };
    this.program.arrayBuffer.push(objBuffer, size);
    object.rendererBufferId = this.program.arrayBuffer.bufferRegId;
    this.program.arrayBuffer.bufferRegId++;
  }

  updatePerspective(projectionMatrix: mat4) {
    this.program.bindProgram();
    this.program.glSetProjectMatrix(projectionMatrix);
  }
}

export default EntityColourProgram;
