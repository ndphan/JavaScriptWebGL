import WorldDelegate from "./WorldDelegate";
import EngineHelper from "./EngineHelper";

export default class Updater {
  world: WorldDelegate;

  constructor(args: { [key: string]: any }) {
    if (!args.world) {
      throw new Error("world not defined");
    }
    this.world = args.world;
  }

  update(time: number, engineHelper: EngineHelper) {
    engineHelper.setTime(time);
    this.world.update();
    engineHelper.updateFont();
  }
}
