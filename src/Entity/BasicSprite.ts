import Rect2d from "../Core/Data/Rect2d";
import EngineHelper from "../Core/EngineHelper";
import Moveable from "./Moveable";
import SpriteModel from "./SpriteModel";

class BasicSprite extends Moveable {
  spriteModel: SpriteModel;

  constructor(rect: Rect2d, spriteModel: SpriteModel) {
    super();
    this.spriteModel = spriteModel;
    this.spriteModel.setRect(rect);
    this.entities.push(this.spriteModel);
  }

  render(engineHelper: EngineHelper) {
    this.spriteModel.render(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    this.spriteModel.update(engineHelper);
  }

  init(engineHelper: EngineHelper) {
    super.init(engineHelper);
    this.setRect(this.spriteModel.getRect());
    this.updatePhysicsPosition();
  }
}

export default BasicSprite;
