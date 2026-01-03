import ModelPosition from "../Core/EngineEntity/ModelPosition";
import Physics from "../Core/Physics/Physics";
import EntityManager from "../Manager/EntityManager";
import Coordinate from "../Core/Data/Coordinate";
import Rect3d from "../Core/Data/Rect3d";
import EngineMath from "../Core/Physics/EngineMath";
import Rect2d from "../Core/Data/Rect2d";
import EngineObject from "../Core/EngineEntity/EngineObject";

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
  isBounded: boolean;
  isMoveable: boolean;
  isRotateMove: boolean;
  hasCollision: boolean;
  dampenReduction = 0.0;
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
      bound: new Rect2d(0, 0, 1.0, 1.0),
      simulationId: undefined,
      jumpSimulationId: undefined,
      gravitySimulationId: undefined,
      collisionIteration: 0,
      collisionStopItThres: 5,
    };
    this.isMoveable = true;
    this.isBounded = true;
    this.hasCollision = true;
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

  updateLocBoundToBoundary() {
    const pos = this.physics.collisionSize
      ? this.physics.modelPos.position
      : this.position;
    const boundRect = this.physics.bound ?? new Rect2d(0, 0, 1, 1, 0);
    const coordinate = EngineMath.boundRect(
      boundRect,
      this.physics.collisionSize
        ? this.physics.modelPos.position
        : this.position
    );
    let dx = 0;
    let dy = 0;
    if (pos.x !== coordinate.x) {
      this.physics.v.x = 0;
      dx = coordinate.x - pos.x;
    }
    if (pos.y !== coordinate.y) {
      this.physics.v.y = 0;
      dy = coordinate.y - pos.y;
    }
    this.center(this.position.x + dx, this.position.y + dy, this.position.z);
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
    const directionalModifier =
      dx !== 0 ? 10e-6 * (this.physics.d.x < 0 ? -1 : 1) : 0;
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
  moveToTime(
    time: number,
    x?: number,
    y?: number,
    z?: number,
    complete?: () => void
  ) {
    Physics.cancelSimulation(this.physics.simulationId ?? 0, true);

    if (!this.isMoveable) {
      return;
    }
    const physics = this.physics;
    this.updateDeltaDistance(x, y, z);

    const totalTime = Math.max(time, 10e-6);
    this.movementRotation(physics.d.x);

    let completeSim = this.completeSimulation;
    if (complete) {
      completeSim = () => {
        this.completeSimulation();
        complete();
      };
    }

    physics.simulationId = Physics.runSimulation(
      totalTime,
      this.moveSimulation.bind(this),
      completeSim,
      physics.simulationId
    );
  }
  private movementRotation(dx: number) {
    if (this.isRotateMove) {
      if (dx > 0) {
        this.rotateY(0);
      } else if (dx < 0) {
        this.rotateY(180);
      }
    }
  }

  moveTo(
    velocity: number,
    x?: number,
    y?: number,
    z?: number,
    complete?: () => void
  ) {
    Physics.cancelSimulation(this.physics.simulationId ?? 0, true);

    if (!this.isMoveable) {
      return;
    }
    const physics = this.physics;
    this.updateDeltaDistance(x, y, z);

    const distance = this.calcTotalDeltaDistance();
    const totalTime = distance / velocity;
    this.movementRotation(physics.d.x);

    let completeSim = this.completeSimulation;
    if (complete) {
      completeSim = () => {
        this.completeSimulation();
        complete();
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
  addDampener(time) {
    const dampeningProp = time / 1000.0;
    const xSign = Math.sign(this.physics.v.x);
    this.physics.v.x -= xSign * this.dampenReduction * dampeningProp;
    if (xSign !== Math.sign(this.physics.v.x)) {
      this.physics.v.x = 0;
    }
    const ySign = Math.sign(this.physics.v.y);
    this.physics.v.y -= ySign * this.dampenReduction * dampeningProp;
    if (ySign !== Math.sign(this.physics.v.y)) {
      this.physics.v.y = 0;
    }

    if (Math.abs(this.physics.v.x) < 10e-6) {
      this.physics.v.x = 0;
    }
    if (Math.abs(this.physics.v.y) < 10e-6) {
      this.physics.v.y = 0;
    }
  }
  addImpulse(acceleration: Coordinate, contactTime: number) {
    this.physics.v.x += acceleration.x * contactTime;
    this.physics.v.y += acceleration.y * contactTime;
  }
  setVelocity(velocity: Coordinate) {
    this.physics.v.x = velocity.x;
    this.physics.v.y = velocity.y;
  }
  runPhysicsSimulation(
    simulationId: number,
    totalTime: number = Physics.TIME_STEP_MILLIS * 2.0
  ) {
    Physics.runSimulation(
      totalTime,
      this.physicSimulation,
      this.completeSimulation,
      simulationId
    );
  }
  physicSimulation = (simulationId: number, time: number, _: number) => {
    const physics = this.physics;
    physics.isMoving = true;

    let dx = physics.v.x * time;
    let dy = physics.v.y * time;

    let model: ModelPosition;
    if (physics.collisionSize) {
      physics.modelPos.setRect(physics.collisionSize);
      physics.modelPos.$physicsId = this.$physicsId;
      model = physics.modelPos;
    } else {
      model = this as unknown as ModelPosition;
    }
    const [_dx, _dy, collision] = this.resolveCollision(model, dx, dy);
    if (this.shouldTranslate(collision)) {
      physics.collisionIteration = 0;
    } else {
      this.addDampener(time);
      dx = _dx;
      dy = _dy;
      physics.collisionIteration++;
      if (physics.collisionIteration > physics.collisionStopItThres) {
        this.cancelSimulation(simulationId);
      }
    }

    this.movementRotation(physics.v.x);

    this.translate(dx, dy, 0);
    if (physics.collisionSize) {
      physics.modelPos.translate(dx, dy, 0);
      physics.collisionSize.x += dx;
      physics.collisionSize.y += dy;
    }
    if (this.isBounded) {
      this.updateLocBoundToBoundary();
    }

    this.completePhysicsIteration(time);
  };

  completePhysicsIteration(_: number) {}

  private resolveCollision(
    model: ModelPosition,
    dx: number,
    dy: number
  ): [number, number, ModelPosition[]] {
    if (this.hasCollision) {
      return Physics.isCollidingResolve(model, dx, dy);
    } else {
      return [dx, dy, []];
    }
  }

  private cancelSimulation(simulationId: number) {
    const simulation = Physics.simulations[simulationId];
    if (simulation?.completeSimulation) {
      simulation.completeSimulation();
    }
    Physics.cancelSimulation(simulationId);
  }

  moveSimulation(simulationId: number, time: number, totalRunTime: number) {
    if (Math.abs(totalRunTime) < 10e-6) {
      return;
    }
    const physics = this.physics;
    physics.isMoving = true;
    const propTime = Math.min(1.0, time / totalRunTime);

    const dx = physics.d.x * propTime;
    const dy = physics.d.y * propTime;
    const dz = physics.d.z * propTime;

    this.translateCollision(simulationId, dx, dy, dz);
    this.completePhysicsIteration(time);
  }

  translateCollision(simulationId: number, dx: number, dy: number, dz: number) {
    const physics = this.physics;
    let model: ModelPosition;
    if (physics.collisionSize) {
      physics.modelPos.setRect(physics.collisionSize);
      physics.modelPos.$physicsId = this.$physicsId;
      model = physics.modelPos;
    } else {
      model = this as unknown as ModelPosition;
    }
    const colliding = Physics.isCollidingOffset2d(model, dx, dy);
    if (this.shouldTranslate(colliding)) {
      this.translate(dx, dy, dz);
      if (physics.collisionSize) {
        physics.modelPos.translate(dx, dy, 0);
        physics.collisionSize.x += dx;
        physics.collisionSize.y += dy;
      }
      if (this.isBounded) {
        this.updateLocBoundToBoundary();
      }
      this.physics.collisionIteration = 0;
    } else {
      this.physics.collisionIteration++;
      if (this.physics.collisionIteration > this.physics.collisionStopItThres) {
        this.cancelSimulation(simulationId);
      }
    }
  }

  setMoveable(isMoving: boolean) {
    this.isMoveable = isMoving;
  }

  copyTexture(obj: EngineObject) {
    if (this.shaderEntity) {
      super.copyTexture(obj);
    }
    this.entities.forEach((entity) => entity.copyTexture(obj));
  }
}

export default Moveable;
