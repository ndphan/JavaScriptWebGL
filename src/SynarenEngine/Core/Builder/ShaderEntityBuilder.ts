import { ShaderEntity } from "../EngineEntity/ShaderEntity";
import EngineHelper from "../EngineHelper";
import VertexModel from "../Data/VertexModel";
import EngineObject from "../EngineEntity/EngineObject";
import RenderOption from "../Data/RenderOption";

class ShaderEntityBuilder {
  engineHelper: EngineHelper;
  textureSource?: string;

  vertexModel: VertexModel;
  isCreateTexture: boolean;

  constructor(engineHelper: EngineHelper) {
    this.engineHelper = engineHelper;
  }

  createTexture(textureSource: string): ShaderEntityBuilder {
    this.textureSource = textureSource;
    this.isCreateTexture = true;
    return this;
  }

  addBuffer(vertexModel: VertexModel): ShaderEntityBuilder {
    this.vertexModel = vertexModel;
    return this;
  }

  build(engineObject: EngineObject, opt: RenderOption): ShaderEntity {
    if (!this.vertexModel) {
      console.error("VertexModel is undefined", this);
    }
    const entity = new ShaderEntity();
    const entityOption = entity.getOpt();
    entityOption.renderType = opt.renderType;
    entityOption.shaderType = opt.shaderType;
    entity.model = () => engineObject.getViewModel();
    entity.vertexModel = this.vertexModel;
    entity.vertexModel.registerModel(this.engineHelper);
    this.engineHelper.registerEntity(entity);
    if (this.isCreateTexture) {
      entity.src = this.textureSource;
      this.engineHelper.createTexture(entity);
    }
    return entity;
  }

  static clone(shaderEntity: ShaderEntity): ShaderEntity {
    return Object.assign(new ShaderEntity(), shaderEntity);
  }
}

export default ShaderEntityBuilder;
