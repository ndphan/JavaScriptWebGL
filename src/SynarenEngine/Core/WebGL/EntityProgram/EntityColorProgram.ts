import { ShaderType } from "../../Data/RenderOption";
import ShaderProgramColour from "../ShaderProgram/ShaderColourProgram";
import { ShaderEntity } from "../../EngineEntity/ShaderEntity";

class EntityColourProgram {
  program: ShaderProgramColour;
  ctx: WebGLRenderingContext;
  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
    this.program = new ShaderProgramColour(ctx);
  }

  delete() {
    this.program.arrayBuffer.delete(this.ctx);
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
      ShaderProgramColour.DRAW_VERTEX_SIZE
    );
  }

  bindBuffer() {
    this.program.arrayBuffer.bufferBind(this.ctx);
  }

  render(entities: ShaderEntity[]) {
    this.program.arrayBuffer.bind(this.ctx);
    this.program.bindAttributePointers();
    this.program.bindProgram();

    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index];
      const model = entity.getModel();
      if (!entity.rendererBufferId) {
        throw new Error("Unregistered entity buffer" + entity);
      }
      const buffReg = this.program.arrayBuffer.bufferReg[
        entity.rendererBufferId
      ];
      this.program.glSetModelViewMatrix(model);
      this.ctx.drawArrays(
        this.ctx.TRIANGLE_STRIP,
        buffReg.offset,
        buffReg.size
      );
    }

    this.program.arrayBuffer.unbind(this.ctx);
    this.program.unbindAttributePointers();
    this.program.unbindProgram();
  }

  registerEntity(object: ShaderEntity, objBuffer: number[]) {
    const size = objBuffer.length / ShaderProgramColour.DRAW_VERTEX_SIZE;
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

export default EntityColourProgram;
