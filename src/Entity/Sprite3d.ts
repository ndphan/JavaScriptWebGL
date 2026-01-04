import Rect2d from "../Core/Data/Rect2d";
import Rect3d from "../Core/Data/Rect3d";
import Coordinate from "../Core/Data/Coordinate";
import ModelObject2d from "../Core/EngineEntity/ModelObject2d";
import EngineHelper from "../Core/EngineHelper";
import TextureVertexModel from "../Core/Data/TextureVertexModel";

export default class Sprite3d extends ModelObject2d {
  private textureReference: string;

  constructor(worldPos: Rect3d, textureReference: string) {
    super(new Rect2d(worldPos.x, worldPos.y, 2.0, 2.0), new TextureVertexModel());
    this.textureReference = textureReference;
  }

  setTop(isTop: boolean) {
    this.shaderEntity.isTop = isTop;
  }

  render(engineHelper: EngineHelper) {
    const screenPos = engineHelper.camera.camera3d.worldToScreen(
      this.position.x,
      this.position.y,
      this.position.z
    );
    if (screenPos.visible) {
      this.shaderEntity.hidden = false;
      super.center(screenPos.x, screenPos.y, 0);
      engineHelper.render(this.shaderEntity);
    } else {
      this.shaderEntity.hidden = true;
    }
  }

  init(engineHelper: EngineHelper) {
    this.vertexModel = engineHelper.newVertexModel2d(this.textureReference);
    super.init(engineHelper);
  }
}
