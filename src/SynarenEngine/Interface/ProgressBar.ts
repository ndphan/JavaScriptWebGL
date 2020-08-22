import EntityManager2d from "../Manager/EntityManager2d";
import PlaneColour from "../Entity/PlaneColour";
import Rect2d from "../Core/Data/Rect2d";
import EngineHelper from "../Core/EngineHelper";
import { Colour } from "../Core/Data/RenderUnit";

export default class ProgressBar extends EntityManager2d {
  private powerBar: PlaneColour;
  private powerMaxBar: PlaneColour;
  private background: Colour;
  private bar: Colour;
  private percent: number;

  constructor(rect: Rect2d, background: Colour, bar: Colour) {
    super();
    this.setRect(rect);
    this.background = background;
    this.bar = bar;
  }

  setProgress(percent: number) {
    this.percent = percent;
  }

  init(engineHelper: EngineHelper) {
    this.powerMaxBar = new PlaneColour(this.position, this.background);
    this.entities.push(this.powerMaxBar);
    this.powerBar = new PlaneColour(this.position, this.bar);
    this.entities.push(this.powerBar);
    super.initEntity(engineHelper);
  }

  render(engineHelper: EngineHelper) {
    this.powerBar.scaleX(
      Math.max(0, (this.percent * this.powerMaxBar.position.width) / 100.0)
    );
    super.render(engineHelper);
  }

  update(engineHelper: EngineHelper) {
    this.powerBar.setTop(this.isTop);
    this.powerMaxBar.setTop(this.isTop);
    super.update(engineHelper);
  }
}
