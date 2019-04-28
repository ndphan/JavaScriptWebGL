import Plane2d from "./Plane2d";
import PlaneType from "../Core/Data/PlaneType";
import Timer from "../Core/Common/Timer";
import EntityManager2d from "../Manager/EntityManager2d";
import { Rect2d } from "..";
import EngineHelper from "../Core/EngineHelper";

export default class SpriteModel extends EntityManager2d {
  spriteIdx = 0;
  timer = new Timer();
  ticks: number;
  textureSource: string;
  uvCacheId: string[];
  constructor(
    rect: Rect2d,
    textureSource: string,
    ticks: number,
    uvCacheId: string[]
  ) {
    super();
    this.setRect(rect);
    this.ticks = ticks;
    this.textureSource = textureSource;
    this.uvCacheId = uvCacheId;
  }
  update(engineHelper: EngineHelper) {}
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
    for (let index = 0; index < this.uvCacheId.length; index++) {
      const uvCacheId = this.uvCacheId[index];
      const uv = engineHelper.getUVCache(uvCacheId);
      const vertexModel = engineHelper.createPlaneVertexModel(uv, PlaneType.YX);
      this.entities.push(
        new Plane2d(this.getRect(), vertexModel, this.textureSource)
      );
    }
    this.center(this.position.x, this.position.y, this.position.z);
    this.rotateOrigin(this.position.x, this.position.y, this.position.z);
    this.initEntity(engineHelper);
    this.timer.start();
  }
}
