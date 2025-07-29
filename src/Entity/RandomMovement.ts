import ModelPosition from "../Core/EngineEntity/ModelPosition";
import Timer from "../Core/Common/Timer";
import Rect2d from "../Core/Data/Rect2d";
import EngineMath from "../Core/Physics/EngineMath";

export default class RandomMovement extends ModelPosition {
  private timer = new Timer();
  private directionChangeTimer = new Timer();
  private moveTimer = new Timer();
  private bound: Rect2d;
  private directionY = 1.0;
  private directionX = 1.0;
  private speedFactorX = 1.0;
  private speedFactorY = 1.0;
  private config: RandomMovementConfig;

  constructor(modelSize: Rect2d, config: RandomMovementConfig, bound: Rect2d) {
    super();
    this.setRect(modelSize);
    this.bound = bound;
    this.config = config;
    this.initTimers();
    this.calcRandomDirection();
  }

  private initTimers() {
    this.timer.start();
    this.directionChangeTimer.start();
    this.moveTimer.start();
  }

  private calcRandomDirection() {
    this.directionY = Math.random() > 0.5 ? 1.0 : -1.0;
    this.directionX = Math.random() > 0.5 ? 1.0 : -1.0;
    this.speedFactorY =
      Math.random() * this.config.varianceSpeed + this.config.minimumSpeed;
    this.speedFactorX =
      Math.random() * this.config.varianceSpeed + this.config.minimumSpeed;
  }

  private updateLocBoundToBoundary() {
    const coordinate = EngineMath.boundRect(this.bound, this.position);
    if (this.position.x > coordinate.x) {
      this.directionX = -1.0;
    } else if (this.position.x < coordinate.x) {
      this.directionX = 1.0;
    }
    if (this.position.y > coordinate.y) {
      this.directionY = -1.0;
    } else if (this.position.y < coordinate.y) {
      this.directionY = 1.0;
    }
    this.center(coordinate.x, coordinate.y, this.position.z);
  }

  public calculateNewPosition() {
    if (this.directionChangeTimer.peak() > this.config.directionInterval) {
      this.calcRandomDirection();
      this.directionChangeTimer.start();
    }

    let dx = 0;
    let dy = 0;

    if (this.moveTimer.peak() > this.config.moveInterval) {
      this.moveTimer.start();
      const time = Math.min(this.timer.peak(), 1.0);
      dy = time * this.speedFactorY * this.directionY;
      dx = time * this.speedFactorX * this.directionX;
    }

    this.translate(dx, dy, 0.0);
    this.updateLocBoundToBoundary();
  }
}

export class RandomMovementConfig {
  directionInterval: number;
  moveInterval: number;
  varianceSpeed: number;
  minimumSpeed: number;
}
