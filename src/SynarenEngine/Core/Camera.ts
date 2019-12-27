import { mat4, quat, vec3 } from "gl-matrix";
import ModelPosition from "./EngineEntity/ModelPosition";
import { EngineEvent } from "./Events";
import Coordinate from "./Data/Coordinate";
import Timer from "./Common/Timer";
import Rect3d from "./Data/Rect3d";
import Rect2d from "./Data/Rect2d";
import { CollisionDetection } from "./Physics/CollisionDetection";

export class BaseCamera extends ModelPosition {
  public aspect: number;
  public frustum: mat4;
  public viewMatrix: mat4;

  protected fov: number;
  protected near: number;
  protected far: number;
  protected cameraOptions: any;

  protected _isUpdateView: boolean = true;

  private interval: NodeJS.Timeout | undefined;
  private steps: number;
  private _moveTime: number;
  private dx: number;
  private dy: number;
  private dz: number;
  private tx: number;
  private ty: number;
  private tz: number;
  private timer: Timer = new Timer();

  public clearPan() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  protected pan(
    time: number,
    speed: number,
    x?: number,
    y?: number,
    z?: number
  ) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.steps = time;
    this._moveTime = time;
    if (x !== undefined) {
      this.dx = x - this.position.x;
      this.tx = x;
    } else {
      this.dx = 0;
      this.tx = this.position.x;
    }

    if (y !== undefined) {
      this.dy = y - this.position.y;
      this.ty = y;
    } else {
      this.dy = 0;
      this.ty = this.position.y;
    }

    if (z !== undefined) {
      this.dz = z - this.position.z;
      this.tz = z;
    } else {
      this.dz = 0;
      this.tz = this.position.z;
    }

    this.timer.start();
    this.interval = setInterval(() => {
      const time = this.timer.peak();
      if (this.steps > 0) {
        this.steps -= time;

        if (this.steps <= 0) {
          this.position.x = this.tx;
          this.position.y = this.ty;
          this.position.z = this.tz;
          if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
          }
        } else {
          this.position.x += (this.dx * time) / this._moveTime;
          this.position.y += (this.dy * time) / this._moveTime;
          this.position.z += (this.dz * time) / this._moveTime;
        }
        this.updateProjectionView();
      } else {
        this.position.x = this.tx;
        this.position.y = this.ty;
        this.position.z = this.tz;
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = undefined;
        }
        this.updateProjectionView();
      }
      this.timer.start();
    }, speed);
  }

  isOutOfBound(bound: Rect3d, pos: Rect3d): boolean {
    return false;
  }

  updateProjectionView = () => {
    this._isUpdateView = true;
  };

  isUpdateView() {
    return this._isUpdateView;
  }

  commitProjectionView = () => {
    this._isUpdateView = false;

    let quatRotationxyz = quat.create();
    quatRotationxyz = quat.rotateX(
      quatRotationxyz,
      quatRotationxyz,
      this.degreesToRadians(this.position.ax)
    );
    quatRotationxyz = quat.rotateY(
      quatRotationxyz,
      quatRotationxyz,
      this.degreesToRadians(this.position.ay)
    );
    quatRotationxyz = quat.rotateZ(
      quatRotationxyz,
      quatRotationxyz,
      this.degreesToRadians(this.position.az)
    );
    quatRotationxyz = quat.normalize(quatRotationxyz, quatRotationxyz);

    const dest = mat4.create();

    const quatMat = mat4.create();
    mat4.fromQuat(quatMat, quatRotationxyz);
    mat4.multiply(dest, dest, quatMat);

    const pos = vec3.fromValues(
      -this.position.x,
      -this.position.y,
      -this.position.z
    );
    mat4.translate(dest, dest, pos);

    this.viewMatrix = dest;
  };

  perspective = (): mat4 => {
    return mat4.perspective(
      mat4.create(),
      this.degreesToRadians(this.fov),
      this.aspect,
      this.near,
      this.far
    );
  };

  updateProjectionMatrix = () => {
    this.frustum = this.perspective();
  };

  angleX(dx: number) {
    this.position.ax -= dx;
    if (this.position.ax > 90) {
      const diff = 90;
      this.position.ax = diff;
    } else if (this.position.ax < -90) {
      const diff = -90;
      this.position.ax = diff;
    }
  }

  angleZ(dz: number) {
    this.position.az += dz;
    if (this.position.az > 360) {
      const diff = this.position.az - 360;
      this.position.az = diff;
    } else if (this.position.az < 0) {
      const diff = this.position.az + 360;
      this.position.az = diff;
    }
  }

  angleY(dy: number) {
    this.position.ay += dy;
    if (this.position.ay > 360) {
      const diff = this.position.ay - 360;
      this.position.ay = diff;
    } else if (this.position.ay < 0) {
      const diff = this.position.ay + 360;
      this.position.ay = diff;
    }
  }

  zoomIn(delta: number) {
    this.fov -= delta;
    this.fov = Math.max(delta, this.fov);
    this.updateProjectionMatrix();
  }

  zoomOut(delta: number) {
    const maxFovAspect = (Math.atan(1.0 / this.aspect) * 360.0) / Math.PI;
    this.fov += delta;
    this.fov = Math.min(
      Math.min(this.cameraOptions.maxFov || maxFovAspect, maxFovAspect),
      this.fov
    );
    this.updateProjectionMatrix();
  }

  public setupCamera(cameraOptions: any, canvas: HTMLCanvasElement) {
    this.cameraOptions = cameraOptions || {};
    const near = this.near || cameraOptions.near || 1.0;
    const far = this.far || cameraOptions.far || 4.0;
    const aspect = cameraOptions.aspect || canvas.width / canvas.height;

    let fov = this.fov || cameraOptions.fov || 45.0;
    if (cameraOptions.isFovMax) {
      const maxFovAspect = (Math.atan(1.0 / aspect) * 360.0) / Math.PI;
      fov = maxFovAspect;
    }
    this.aspect = aspect;
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.updateProjectionMatrix();
    this.updateProjectionView();
  }
}

class Camera3d extends BaseCamera {
  private static INTERVAL_TIME = 10;

  public pan(time: number, x?: number, y?: number, z?: number) {
    super.pan(time, Camera3d.INTERVAL_TIME, x, y, z);
  }
}

class Camera2d extends BaseCamera {
  private zoomScale = 2;
  private static INTERVAL_TIME = 10;
  private bound = new Rect2d(0, 0, 1, 1);

  public distanceEvent(event: EngineEvent): Coordinate {
    return new Coordinate(event.x + this.position.x, this.position.y + event.y);
  }

  perspective = (): mat4 => {
    const translateSpace = mat4.create();
    mat4.translate(translateSpace, translateSpace, vec3.fromValues(-1, -1, 0));
    mat4.scale(
      translateSpace,
      translateSpace,
      vec3.fromValues(this.zoomScale, this.zoomScale, 1.0)
    );
    return translateSpace;
  };

  zoomIn(delta: number) {
    this.zoomScale += delta;
    this.updateProjectionMatrix();
  }

  zoomOut(delta: number) {
    this.zoomScale = Math.max(0.1, this.zoomScale - delta);
    this.updateProjectionMatrix();
  }

  public isOutOfBound(pos: Rect2d): boolean {
    this.bound.x = this.position.x;
    this.bound.y = this.position.y;
    return !CollisionDetection.isRectInRect(this.bound, pos);
  }

  public pan(time: number, x?: number, y?: number) {
    super.pan(time, Camera2d.INTERVAL_TIME, x, y);
  }
}

class Camera {
  public camera3d = new Camera3d();
  public camera2d = new Camera2d();
  public height: number;
  public width: number;

  public setupCamera(cameraOptions: any, canvas: HTMLCanvasElement) {
    this.camera3d.setupCamera(cameraOptions, canvas);
    this.camera2d.setupCamera(cameraOptions, canvas);
    this.height = canvas.height;
    this.width = canvas.width;
  }

  public commitProjectionView() {
    if (this.camera3d.isUpdateView()) {
      this.camera3d.commitProjectionView();
    }
    if (this.camera2d.isUpdateView()) {
      this.camera2d.commitProjectionView();
    }
  }
}

export default Camera;
