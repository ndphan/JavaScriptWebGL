import Coordinate from "../Data/Coordinate";
import Rect3d from "../Data/Rect3d";
import Timer from "../Common/Timer";
import ModelPosition from "../EngineEntity/ModelPosition";
import { CollisionDetection } from "./CollisionDetection";

export default class Physics {
  static TIME_STEP_MILLIS = 10;
  static simulations: {
    [key: number]:
      | {
          pause: boolean;
          timer: Timer;
          totalRunTime: number;
          runTime: number;
          totalIterations: number;
          simulation: (
            simulationId: number,
            timeStep: number,
            totalRunTime: number,
            totalIterations?: number
          ) => void;
          completeSimulation?: () => void;
          cancelled: boolean;
        }
      | undefined;
  } = {};
  static simulationIdCurrent = 1;
  static simulationLoop: ReturnType<typeof setInterval> | undefined;
  static physicsEntities: {
    [key: number]: { entity: ModelPosition; enabled: boolean; physics: PhysicsData | undefined; };
  } = {};
  static physicsEntityIdCount = 1;

  static registerPhysics(entity: ModelPosition, physics: PhysicsData | undefined = undefined) {
    if (!entity.$physicsId) {
      entity.$physicsId = Physics.physicsEntityIdCount++;

      this.physicsEntities[entity.$physicsId] = {
        entity: entity,
        enabled: true,
        physics: physics
      };
    }
  }
  static deregisterPhysics(entity: ModelPosition) {
    if (
      entity.$physicsId !== undefined &&
      this.physicsEntities[entity.$physicsId]
    ) {
      delete this.physicsEntities[entity.$physicsId];
    }
  }
  static setEnabledPhysics(entity: ModelPosition, enabled: boolean) {
    if (this.physicsEntities[entity.$physicsId]) {
      this.physicsEntities[entity.$physicsId].enabled = enabled;
    }
  }
  static isCollidingOffset2d(
    entity: ModelPosition,
    dx: number,
    dy: number
  ): ModelPosition[] {
    const px = entity.position.x + dx;
    const py = entity.position.y + dy;
    return Physics.isCollidingPos2d(entity, px, py);
  }

  static isCollidingPoint2d(entity: ModelPosition): ModelPosition[] {
    const px = entity.position.x;
    const py = entity.position.y;
    return Physics.isCollidingPos2d(entity, px, py);
  }

  static isCollidingResolve(
    entity: ModelPosition,
    dx: number,
    dy: number
  ): [number, number, ModelPosition[]] {
    const collision: ModelPosition[] = [];
    const _dx: number[] = [];
    const _dy: number[] = [];
    for (const key in this.physicsEntities) {
      if (this.physicsEntities.hasOwnProperty(key)) {
        const physicsEntity = this.physicsEntities[key];
        const node = physicsEntity.entity;
        if (physicsEntity.enabled && node.$physicsId !== entity.$physicsId) {
          const { x, y, width, height } = physicsEntity.physics?.collisionSize || node.position;
          const colliding = CollisionDetection.isCollidingRect(
            x,
            y,
            width,
            height,
            entity.position.x + dx,
            entity.position.y + dy,
            entity.position.width,
            entity.position.height
          );
          if (colliding) {
            collision.push(physicsEntity.entity);
            const collidingX = CollisionDetection.isCollidingRect(
              x,
              y,
              width,
              height,
              entity.position.x + dx,
              entity.position.y,
              entity.position.width,
              entity.position.height
            );
            const collidingY = CollisionDetection.isCollidingRect(
              x,
              y,
              width,
              height,
              entity.position.x,
              entity.position.y + dy,
              entity.position.width,
              entity.position.height
            );
            if (collidingX && collidingY) {
              _dx.push(-Physics.dxBoundary(entity, x, width));
              _dy.push(-Physics.dyBoundary(entity, y, height));
            } else if (collidingX) {
              _dx.push(Physics.dxBoundary(entity, x, width));
            } else if (collidingY) {
              _dy.push(Physics.dyBoundary(entity, y, height));
            }
          }
        }
      }
    }
    if (_dx.length > 0) {
      dx = Math.min.apply(Math, _dx);
    }
    if (_dy.length > 0) {
      dy = Math.min.apply(Math, _dy);
    }
    if (Math.abs(dx) < 10e-6) {
      dx = 0;
    }
    if (Math.abs(dy) < 10e-6) {
      dy = 0;
    }
    return [dx, dy, collision];
  }

  private static dyBoundary(entity: ModelPosition, y: number, height: number) {
    let _dy = Math.abs(
      CollisionDetection.getLength(entity.position.y, 0, y, 0) -
        entity.position.height / 2 -
        height / 2
    );
    _dy *= Math.sign(y - entity.position.y) * 0.9999999;
    return _dy;
  }

  private static dxBoundary(entity: ModelPosition, x: number, width: number) {
    let _dx = Math.abs(
      CollisionDetection.getLength(entity.position.x, 0, x, 0) -
        entity.position.width / 2 -
        width / 2
    );
    _dx *= Math.sign(x - entity.position.x) * 0.9999999;
    return _dx;
  }

  private static isCollidingPos2d(
    entity: ModelPosition,
    px: number,
    py: number
  ): ModelPosition[] {
    const collision: ModelPosition[] = [];
    for (const key in this.physicsEntities) {
      if (this.physicsEntities.hasOwnProperty(key)) {
        const physicsEntity = this.physicsEntities[key];
        const pEntityRoot = physicsEntity.entity;
        if (
          physicsEntity.enabled &&
          pEntityRoot.$physicsId !== entity.$physicsId
        ) {
          const colliding = CollisionDetection.isCollidingRect(
            pEntityRoot.position.x,
            pEntityRoot.position.y,
            pEntityRoot.position.width,
            pEntityRoot.position.height,
            px,
            py,
            entity.position.width,
            entity.position.height
          );
          if (colliding) {
            collision.push(physicsEntity.entity);
          }
        }
      }
    }
    return collision;
  }

  static generateSimulationId() {
    const simulationId = this.simulationIdCurrent;
    this.simulationIdCurrent += 1;
    return simulationId;
  }
  static pauseSimulation(simulationId: number) {
    const data = this.simulations[simulationId];
    if (!data) {
      return;
    }
    data.pause = true;
  }
  static resumeSimulation(simulationId: number) {
    const data = this.simulations[simulationId];
    if (!data) {
      return;
    }
    data.pause = false;
  }
  static cancelSimulation(simulationId: number, force: boolean = false) {
    const data = this.simulations[simulationId];
    if (!data) {
      return;
    }
    data.cancelled = true;
    data.totalIterations = 0;
    if (!force && data.completeSimulation) {
      data.completeSimulation();
    }
  }
  static physicsLoop() {
    let simulationCount = 0;
    for (const simulationId in this.simulations) {
      if (this.simulations.hasOwnProperty(simulationId)) {
        const data = this.simulations[simulationId];
        if (!data) continue;
        if(data.cancelled) {
          continue;
        }
        if (data) {
          if (data.pause) {
            data.timer.start();
            continue;
          }
          const time = data.timer.peak();
          if (data.totalIterations === 0 || data.runTime < data.totalRunTime) {
            data.simulation(
              +simulationId,
              time,
              data.totalRunTime,
              data.totalIterations
            );
            data.runTime += time;
            data.timer.start();
            data.totalIterations += 1;
            simulationCount++;
          } else {
            this.cancelSimulation((simulationId as unknown) as number);
          }
        }
      }
    }
  }

  static runSimulation(
    totalRunTime: number,
    simulation: (
      simulationId: number,
      timeStep: number,
      totalRunTime: number,
      totalIterations?: number
    ) => void,
    completeSimulation?: () => void,
    existingSimulationId?: number
  ): number {
    const simulationId = existingSimulationId || this.generateSimulationId();

    const data = this.simulations[simulationId];
    if (!data) {
      this.simulations[simulationId] = {
        pause: false,
        timer: new Timer().start(),
        simulation: simulation,
        totalRunTime: totalRunTime,
        completeSimulation: completeSimulation,
        totalIterations: 0,
        runTime: 0.0,
        cancelled: false
      };
    } else {
      if (data.cancelled) {
        data.pause = false;
        data.timer.start();
        data.simulation = simulation;
        data.totalRunTime = totalRunTime;
        data.completeSimulation = completeSimulation;
        data.cancelled = false;
      }
      data.totalIterations = 0;
      data.runTime = 0;
    }

    if (this.simulationLoop === undefined) {
      this.simulationLoop = setInterval(
        this.physicsLoop.bind(this),
        this.TIME_STEP_MILLIS
      );
    }

    return simulationId;
  }
  static parabolicSimulation(
    parabolic: ParabolicSimulation,
    simulation: (
      simulationId: number,
      timeStep: number,
      dx: number,
      dy: number
    ) => void,
    completeSimulation?: () => void
  ): number {
    return this.runSimulation(
      parabolic.totalRunTime,
      (simulationId: number, timeStep: number) => {
        const data = this.simulations[simulationId];
        if (data) {
          const runTime = data.runTime;
          const height = parabolic.height;
          const width = parabolic.width;
          const totalRunTime = parabolic.totalRunTime;
          const a = ((1.0 / 3.0 + 1.0) * height) / width / width;
          const b = a * width;
          const vy = height / 2.0 / (totalRunTime / 2.0);
          const x = (Math.sqrt(4 * a * vy * runTime + b * b) - b) / (2 * a);
          const vx = -width / totalRunTime;
          const y = -(a * vx * runTime * vx * runTime + b * vx * runTime);
          const dx = x - parabolic.px;
          const dy = y - parabolic.py;
          parabolic.px = x;
          parabolic.py = y;
          simulation(simulationId, timeStep, dx, dy);
        }
      },
      completeSimulation
    );
  }
}

export class ParabolicSimulation {
  totalRunTime: number;
  height: number;
  width: number;
  px: number;
  py: number;
}

export class PhysicsData {
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
}