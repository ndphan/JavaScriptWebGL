import {
  ModelObject3d,
  Rect3d,
  TextureVertexModel,
  EngineHelper
} from "synaren-engine";

export default class Sphere extends ModelObject3d {
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
