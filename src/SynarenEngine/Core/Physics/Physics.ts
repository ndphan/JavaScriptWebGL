import Timer from "../Common/Timer";
import { CollisionDetection } from "./CollisionDetection";
import EngineObject from "../EngineEntity/EngineObject";

export default class Physics {
  static TIME_STEP_MILLIS = 60;
  static simulations: {
    [key: string]:
      | {
          timer: Timer;
          totalRunTime: number;
          runTime: number;
          simulation: (
            simulationId: number,
            timeStep: number,
            totalRunTime: number
          ) => void;
          completeSimulation?: () => void;
        }
      | undefined;
  } = {};
  static simulationIdCurrent = 0;
  static simulationLoop: NodeJS.Timeout | undefined;
  static physicsEntities: {
    [key: number]: { entity: EngineObject; enabled: boolean };
  } = {};
  static physicsEntityIdCount = 0;

  static registerPhysics(entity: EngineObject) {
    if (!entity.$physicsId) {
      entity.$physicsId = Physics.physicsEntityIdCount++;

      this.physicsEntities[entity.$physicsId] = {
        entity: entity,
        enabled: true
      };
    }
  }
  static setEnabledPhysics(entity: EngineObject, enabled: boolean) {
    if (this.physicsEntities[entity.$physicsId]) {
      this.physicsEntities[entity.$physicsId].enabled = enabled;
    }
  }
  static isColliding2d(
    entity: EngineObject,
    dx: number,
    dy: number
  ): EngineObject[] {
    const isColliding = [];
    const px = entity.position.x + dx;
    const py = entity.position.y + dy;
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
            isColliding.push(physicsEntity.entity);
          }
        }
      }
    }
    return isColliding;
  }
  static generateSimulationId() {
    const simulationId = this.simulationIdCurrent;
    this.simulationIdCurrent += 1;
    return simulationId;
  }
  static cancelSimulation(simulationId: number) {
    delete this.simulations[simulationId];
  }
  static physicsLoop() {
    let simulationCount = 0;
    for (const simulationId in this.simulations) {
      if (this.simulations.hasOwnProperty(simulationId)) {
        const data = this.simulations[simulationId];
        if (data) {
          const time = data.timer.peak() / 1000.0;
          data.runTime += time;
          if (data.runTime < data.totalRunTime) {
            data.simulation(+simulationId, time, data.totalRunTime);
          } else {
            if (data.completeSimulation) {
              data.completeSimulation();
            }
            delete this.simulations[simulationId];
          }
          data.timer.start();
          simulationCount++;
        } else {
          delete this.simulations[simulationId];
        }
      }
    }
    if (simulationCount === 0 && this.simulationLoop) {
      clearInterval(this.simulationLoop);
      this.simulationLoop = undefined;
    }
  }

  static runSimulation(
    totalRunTime: number,
    simulation: (
      simulationId: number,
      timeStep: number,
      totalRunTime: number
    ) => void,
    completeSimulation?: () => void,
    existingSimulationId?: number
  ): number {
    const simulationId = existingSimulationId || this.generateSimulationId();

    const data = this.simulations[simulationId];
    if (!data) {
      this.simulations[simulationId] = {
        timer: new Timer().start(),
        simulation: simulation,
        totalRunTime: totalRunTime,
        completeSimulation: completeSimulation,
        runTime: 0.0
      };
    } else {
      data.totalRunTime = totalRunTime;
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
