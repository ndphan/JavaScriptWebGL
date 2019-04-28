import EntityManager from "../Manager/EntityManager";
import Physics from "../Core/Physics/Physics";
import EngineObject from "../Core/EngineEntity/EngineObject";

class Moveable extends EntityManager {
  physics: {
    tx: number;
    ty: number;
    tz: number;
    dx: number;
    dy: number;
    dz: number;
    isMoving: boolean;
    simulationId: number | undefined;
    jumpSimulationId: number | undefined;
  };
  constructor() {
    super();
    this.physics = {
      tx: 0.0,
      ty: 0.0,
      tz: 0.0,
      dx: 0.0,
      dy: 0.0,
      dz: 0.0,
      isMoving: false,
      simulationId: undefined,
      jumpSimulationId: undefined
    };
  }
  updatePhysicsPosition() {
    this.physics.tx = this.position.x;
    this.physics.ty = this.position.y;
    this.physics.tz = this.position.z;
  }
  updateDeltaDistance(x?: number, y?: number, z?: number) {
    if (x !== undefined) {
      this.physics.dx = x - this.position.x;
      this.physics.tx = x;
    } else {
      this.physics.dx = this.physics.tx - this.position.x;
    }
    if (y !== undefined) {
      this.physics.dy = y - this.position.y;
      this.physics.ty = y;
    } else {
      this.physics.dy = this.physics.ty - this.position.y;
    }
    if (z !== undefined) {
      this.physics.dz = z - this.position.z;
      this.physics.tz = z;
    } else {
      this.physics.dz = this.physics.tz - this.position.z;
    }
  }
  updateLocBoundToBoundary() {
    const boundedX = Math.max(
      this.position.width / 2.0,
      Math.min(1.0 - this.position.width / 2.0, this.position.x)
    );
    const boundedY = Math.max(
      this.position.height / 2.0,
      Math.min(1.0 - this.position.height / 2.0, this.position.y)
    );
    this.center(boundedX, boundedY, this.position.z);
  }
  calcTotalDeltaDistance() {
    return Math.sqrt(
      this.physics.dx * this.physics.dx +
        this.physics.dy * this.physics.dy +
        this.physics.dz * this.physics.dz
    );
  }
  translateTo(velocity: number, dx?: number, dy?: number, dz?: number) {
    const directionalModifier = 10e-6 * (this.physics.dx < 0 ? -1 : 1);
    this.physics.tx += (dx || 0) + directionalModifier;
    this.physics.ty += dy || 0;
    this.physics.tz += dz || 0;
    this.moveTo(velocity, this.physics.tx, this.physics.ty, this.physics.tz);
  }

  shouldTranslate = (colliding: EngineObject[]): boolean => {
    return colliding.length === 0;
  };
  moveTo(velocity: number, x?: number, y?: number, z?: number) {
    const physics = this.physics;
    this.updateDeltaDistance(x, y, z);
    const distance = this.calcTotalDeltaDistance();
    const totalTime = distance / velocity;
    if (physics.dx > 0) {
      this.rotateY(0);
    } else {
      this.rotateY(-180);
    }
    physics.simulationId = Physics.runSimulation(
      totalTime,
      this.moveSimulation,
      this.completeSimulation,
      physics.simulationId
    );
  }
  completeSimulation() {
    const physics = this.physics;
    physics.isMoving = false;
  }
  moveSimulation(simulationId: number, time: number, totalRunTime: number) {
    const physics = this.physics;
    physics.isMoving = true;
    const propTime = time / totalRunTime;
    const dx = physics.dx * propTime;
    const dy = physics.dy * propTime;
    const dz = physics.dz * propTime;
    const colliding = Physics.isColliding2d(this, dx, dy);
    if (this.shouldTranslate(colliding)) {
      this.translate(dx, dy, dz);
      this.updateLocBoundToBoundary();
    }
  }
}

export default Moveable;
