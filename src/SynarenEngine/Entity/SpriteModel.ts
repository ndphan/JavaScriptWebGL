import Plane2d from "./Plane2d";
import Timer from "../Core/Common/Timer";
import EntityManager2d from "../Manager/EntityManager2d";
import EngineHelper from "../Core/EngineHelper";
import Rect2d from "../Core/Data/Rect2d";

export default class SpriteModel extends EntityManager2d {
  spriteIdx = 0;
  private timer = new Timer();
  private ticks: number;
  private textures: string[];
  constructor(rect: Rect2d, ticks: number, textures: string[]) {
    super();
    this.setRect(rect);
    this.ticks = ticks;
    this.textures = textures;
  }
  update(_: EngineHelper) {}
  render(engineHelper: EngineHelper) {
    this.entities[this.spriteIdx].render(engineHelper);
    this.calcSpriteIdx();
  }
  calcSpriteIdx() {
    if (this.timer.peak() > this.ticks) {
      const spriteLength = this.entities.length;
      this.spriteIdx += Math.round(this.timer.peak() / this.ticks);
      if (this.spriteIdx >= spriteLength) {
        const idxFactor = this.spriteIdx / spriteLength;
        this.spriteIdx = Math.round(
          (idxFactor - Math.floor(idxFactor)) * spriteLength
        );
        if (this.spriteIdx >= spriteLength) {
          console.error("index out of bound after shaping", this.spriteIdx);
          this.spriteIdx = 0;
        }
      }
      this.timer.start();
    }
  }
  init(engineHelper: EngineHelper) {
    for (let index = 0; index < this.textures.length; index++) {
      this.entities.push(new Plane2d(this.getRect(), this.textures[index]));
    }
    this.center(this.position.x, this.position.y, this.position.z);
    this.rotateOrigin(this.position.x, this.position.y, this.position.z);
    this.rotateZ(180);
    this.initEntity(engineHelper);
    this.timer.start();
  }
}
