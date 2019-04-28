import VertexModel from "../Core/Data/VertexModel";
import ModelObject3d from "../Core/EngineEntity/ModelObject3d";
import EngineHelper from "../Core/EngineHelper";
import { Rect3d } from "..";

export default class Object3d extends ModelObject3d {
  vertexUvCacheId: string;
  constructor(rect: Rect3d, vertexUvCacheId: string, textureSource: string) {
    super(rect, new VertexModel(), textureSource);
    this.vertexUvCacheId = vertexUvCacheId;
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
  init(engineHelper: EngineHelper) {
    const vertexUV = engineHelper.getVertexUvCache(this.vertexUvCacheId);
    this.vertexModel.fillRenderUnits(vertexUV);
    super.init(engineHelper);
  }
}
