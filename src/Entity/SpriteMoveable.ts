import SpriteModel from "./SpriteModel";
import Moveable from "./Moveable";
import EngineHelper from "../Core/EngineHelper";
import Rect2d from "../Core/Data/Rect2d";

export class SpriteMoveableModel extends SpriteModel {}

class SpriteMoveable extends Moveable {
  spriteModel: SpriteModel;
  constructor(rect: Rect2d, spriteModel: SpriteMoveableModel) {
    super();
    this.spriteModel = spriteModel;
    this.spriteModel.setRect(rect);
  }
  render(engineHelper: EngineHelper) {
    this.spriteModel.render(engineHelper);
  }
  update(engineHelper: EngineHelper) {
    this.spriteModel.update(engineHelper);
  }
  init(engineHelper: EngineHelper) {
    this.entities.push(this.spriteModel);
    super.init(engineHelper);
    this.setRect(this.spriteModel.getRect());
    this.updatePhysicsPosition();
  }
}

export default SpriteMoveable;
