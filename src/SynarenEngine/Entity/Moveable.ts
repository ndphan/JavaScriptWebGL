import ModelPosition from "../Core/EngineEntity/ModelPosition";
import Physics from "../Core/Physics/Physics";
import EntityManager from "../Manager/EntityManager";
import Coordinate from "../Core/Data/Coordinate";
import Rect3d from "../Core/Data/Rect3d";
import EngineMath from "../Core/Physics/EngineMath";
import Rect2d from "../Core/Data/Rect2d";

class Moveable extends EntityManager {
  physics: {
    t: Coordinate;
    d: Coordinate;
    v: Coordinate;
    a: Coordinate;
    modelPos: ModelPosition;
    isMoving: boolean;
    collisionSize: Rect3d | undefined;
    bound: Rect3d | undefined;
    simulationId: number | undefined;
    jumpSimulationId: number | undefined;
    gravitySimulationId: number | undefined;
    collisionIteration: number;
    collisionStopItThres: number;
  };
  isMoveable: boolean;
  constructor() {
    super();
    this.physics = {
      t: new Coordinate(0, 0, 0),
      d: new Coordinate(0, 0, 0),
      v: new Coordinate(0, 0, 0),
      a: new Coordinate(0, 0, 0),
      modelPos: new ModelPosition(),
      isMoving: false,
      collisionSize: undefined,
      bound: undefined,
      simulationId: undefined,
      jumpSimulationId: undefined,
      gravitySimulationId: undefined,
      collisionIteration: 0,
      collisionStopItThres: 5
    };
    this.isMoveable = true;
  }
  updatePhysicsPosition() {
    this.physics.t.x = this.position.x;
    this.physics.t.y = this.position.y;
    this.physics.t.z = this.position.z;
  }
  updateDeltaDistance(x?: number, y?: number, z?: number) {
    if (x !== undefined) {
      this.physics.d.x = x - this.position.x;
      this.physics.t.x = x;
    } else {
      this.physics.d.x = this.physics.t.x - this.position.x;
    }
    if (y !== undefined) {
      this.physics.d.y = y - this.position.y;
      this.physics.t.y = y;
    } else {
      this.physics.d.y = this.physics.t.y - this.position.y;
    }
    if (z !== undefined) {
      this.physics.d.z = z - this.position.z;
      this.physics.t.z = z;
    } else {
      this.physics.d.z = this.physics.t.z - this.position.z;
    }
  }

  private defaultUpdateLocBoundToBoundary() {
    const defaultBound = new Rect2d(
      0,
      0,
      Math.min(1.0 - this.position.width, this.position.x),
      Math.min(1.0 - this.position.height, this.position.y)
    );
    const coordinate = EngineMath.boundRect(defaultBound, this.position);
    this.center(coordinate.x, coordinate.y, this.position.z);
  }
  updateLocBoundToBoundary() {
    if (!this.physics.bound) {
      this.defaultUpdateLocBoundToBoundary();
    } else {
      const coordinate = EngineMath.boundRect(
        this.physics.bound,
        this.position
      );
      this.center(coordinate.x, coordinate.y, this.position.z);
    }
  }
  calcTotalDeltaDistance() {
    return Math.sqrt(
      this.physics.d.x * this.physics.d.x +
        this.physics.d.y * this.physics.d.y +
        this.physics.d.z * this.physics.d.z
    );
  }
  translateTo(
    velocity: number,
    dx?: number,
    dy?: number,
    dz?: number,
    complete?: () => void
  ) {
    const directionalModifier = 10e-6 * (this.physics.d.x < 0 ? -1 : 1);
    this.physics.t.x += (dx || 0) + directionalModifier;
    this.physics.t.y += dy || 0;
    this.physics.t.z += dz || 0;
    this.moveTo(
      velocity,
      this.physics.t.x,
      this.physics.t.y,
      this.physics.t.z,
      complete
    );
  }
  shouldTranslate(colliding: ModelPosition[]): boolean {
    return colliding.length === 0;
  }
  moveTo(
    velocity: number,
    x?: number,
    y?: number,
    z?: number,
    complete?: () => void
  ) {
    if (!this.isMoveable) {
      return;
    }
    const physics = this.physics;
    this.updateDeltaDistance(x, y, z);
    const distance = this.calcTotalDeltaDistance();
    const totalTime = distance / velocity;
    if (physics.d.x > 0) {
      this.rotateY(0);
    } else if (physics.d.x < 0) {
      this.rotateY(-180);
    }
    let completeSim = this.completeSimulation;
    if (complete) {
      completeSim = () => {
        complete();
        this.completeSimulation();
      };
    }
    physics.simulationId = Physics.runSimulation(
      totalTime,
      this.moveSimulation.bind(this),
      completeSim,
      physics.simulationId
    );
  }
  completeSimulation = () => {
    this.resetPhysics();
  };
  resetPhysics = () => {
    this.physics.t.x = this.position.x;
    this.physics.t.y = this.position.y;
    this.physics.t.z = this.position.z;
    this.physics.d.x = 0;
    this.physics.d.y = 0;
    this.physics.d.z = 0;
    this.physics.isMoving = false;
    this.physics.collisionIteration = 0;
  };
  addImpulse(acceleration: Coordinate, contactTime: number) {
    this.physics.v.x += acceleration.x * contactTime;
    this.physics.v.y += acceleration.y * contactTime;
  }
  setVelocity(velocity: Coordinate) {
    this.physics.v.x = velocity.x;
    this.physics.v.y = velocity.y;
  }
  physicSimulation = (simulationId: number, time: number, _: number) => {
    const physics = this.physics;
    physics.isMoving = true;
    const dx = physics.v.x * time;
    const dy = physics.v.y * time;
    const dz = physics.v.z * time;
    let model: ModelPosition = this;
    if (physics.collisionSize) {
      physics.modelPos.setRect(physics.collisionSize);
      model = physics.modelPos;
    }
    const colliding = Physics.isCollidingOffset2d(model, dx, dy);
    if (this.shouldTranslate(colliding)) {
      this.translate(dx, dy, dz);
      this.updateLocBoundToBoundary();
      physics.collisionIteration = 0;
    } else {
      physics.collisionIteration++;
      if (physics.collisionIteration > physics.collisionStopItThres) {
        this.completeSimulation();
        Physics.cancelSimulation(simulationId);
      }
    }
  };
  moveSimulation(simulationId: number, time: number, totalRunTime: number) {
    if (Math.abs(totalRunTime) < 10e-6) {
      return;
    }
    const physics = this.physics;
    physics.isMoving = true;
    const propTime = time / totalRunTime;
    const dx = physics.d.x * propTime;
    const dy = physics.d.y * propTime;
    const dz = physics.d.z * propTime;
    this.translateCollision(simulationId, dx, dy, dz);
  }

  translateCollision(simulationId: number, dx: number, dy: number, dz: number) {
    const colliding = Physics.isCollidingOffset2d(this, dx, dy);
    if (this.shouldTranslate(colliding)) {
      this.translate(dx, dy, dz);
      this.updateLocBoundToBoundary();
      this.physics.collisionIteration = 0;
    } else {
      this.physics.collisionIteration++;
      if (this.physics.collisionIteration > this.physics.collisionStopItThres) {
        const simulation = Physics.simulations[simulationId];
        if (simulation?.completeSimulation) {
          simulation.completeSimulation();
        }
        Physics.cancelSimulation(simulationId);
      }
    }
  }

  setMoveable(isMoving: boolean) {
    this.isMoveable = isMoving;
  }
}

export default Moveable;
