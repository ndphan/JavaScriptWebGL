import Rect3d from "../Core/Data/Rect3d";
import TextureVertexModel from "../Core/Data/TextureVertexModel";
import ModelObject3d from "../Core/EngineEntity/ModelObject3d";
import EngineHelper from "../Core/EngineHelper";

export default class Object3d extends ModelObject3d {
  vertexUvCacheId: string;
  constructor(rect: Rect3d, vertexUvCacheId: string) {
    super(rect, new TextureVertexModel());
    this.vertexUvCacheId = vertexUvCacheId;
  }
  render(engineHelper: EngineHelper) {
    engineHelper.render(this.shaderEntity);
  }
  init(engineHelper: EngineHelper) {
    this.vertexModel = engineHelper.newVertexModelUv3d(this.vertexUvCacheId);
    super.init(engineHelper);
  }
}
