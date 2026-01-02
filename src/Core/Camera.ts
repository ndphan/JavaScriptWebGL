import { mat4, quat, vec3 } from "gl-matrix";
import ModelPosition from "./EngineEntity/ModelPosition";
import { EngineEvent } from "./Events";
import Coordinate from "./Data/Coordinate";
import Timer from "./Common/Timer";
import Rect3d from "./Data/Rect3d";
import Rect2d from "./Data/Rect2d";
import { CollisionDetection } from "./Physics/CollisionDetection";

export interface CameraOptions {
  maxFov: number;
  near: number;
  far: number;
  experimental?: {
    enabled?: boolean;
    inverseAngleY?: boolean;
  };
  isFovMax: boolean;
  fov: number;
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
  projection?: 'frustum' | 'perspective';
  renderMode: '2d' | '3d';
  aspect?: number;
}

export class BaseCamera extends ModelPosition {
  public aspect: number;
  public frustum: mat4;
  public viewMatrix: mat4;

  protected zoomScale: Coordinate = { x: 2, y: 2, z: 2 };
  protected baseTranslate: Coordinate = { x: -1, y: -1, z: 0 };
  public fov: number;
  public near: number;
  public far: number;
  protected cameraOptions: CameraOptions;

  protected _isUpdateView = true;

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
    this.clearPan();
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
          this.clearPan();
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
        this.clearPan();
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

  frustumMatrix = (): mat4 => {
    const left = this.cameraOptions.left ?? -this.aspect;
    const right = this.cameraOptions.right ?? this.aspect;
    const bottom = this.cameraOptions.bottom ?? -1;
    const top = this.cameraOptions.top ?? 1;

    return mat4.frustum(
      mat4.create(),
      left,
      right,
      bottom,
      top,
      this.near,
      this.far
    );
  };

  public perspective(): mat4 {
    return mat4.perspective(
      mat4.create(),
      this.degreesToRadians(this.fov),
      this.aspect,
      this.near,
      this.far
    );
  };

  updateProjectionMatrix = () => {
    if (this.cameraOptions?.projection === 'frustum') {
      this.frustum = this.frustumMatrix();
    } else {
      this.frustum = this.perspective();
    }
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
    this.updateProjectionView();
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
    this.updateProjectionView();
  }

  angleY(dy: number) {
    if (this.cameraOptions?.experimental?.inverseAngleY) {
      if (dy) {
        dy *= -1;
      }
    }
    this.position.ay += dy;
    if (this.position.ay > 360) {
      const diff = this.position.ay - 360;
      this.position.ay = diff;
    } else if (this.position.ay < 0) {
      const diff = this.position.ay + 360;
      this.position.ay = diff;
    }
    this.updateProjectionView();
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

  public setupCamera(
    cameraOptions: CameraOptions,
    aspectRatio: number,
    canvas: HTMLCanvasElement
  ) {
    this.cameraOptions = cameraOptions || {};
    const aspect = cameraOptions.aspect || canvas.width / canvas.height;

    // Always update camera parameters from options
    this.near = cameraOptions.near ?? 0.01;
    this.far = cameraOptions.far ?? 1000.0;
    this.aspect = aspect;

    // Set frustum projection parameters if provided
    if (cameraOptions.projection === 'frustum') {
      // Ensure frustum values are properly set based on aspect ratio if not provided
      if (!this.cameraOptions.left) {
        this.cameraOptions.left = cameraOptions.left ?? -aspect;
      }
      if (!this.cameraOptions.right) {
        this.cameraOptions.right = cameraOptions.right ?? aspect;
      }
      if (!this.cameraOptions.bottom) {
        this.cameraOptions.bottom = cameraOptions.bottom ?? -1;
      }
      if (!this.cameraOptions.top) {
        this.cameraOptions.top = cameraOptions.top ?? 1;
      }
    }

    if (this.cameraOptions.experimental?.enabled) {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const zoom = {
        x: width <= height ? 2 : (2 * aspectRatio) / (width / height),
        y: height <= width ? 2 : (2 * aspectRatio) / (width / height),
        z: 1,
      };
      this.setZoom(zoom);

      this.setBaseTranslate({
        x: -1 + (2 - zoom.x) / 2,
        y: -1 + (2 - zoom.y) / 2,
        z: 0,
      });
    }

    if (cameraOptions.projection !== 'frustum') {
      let fov = cameraOptions.fov ?? 45.0;
      if (cameraOptions.isFovMax) {
        const maxFovAspect = (Math.atan(1.0 / aspect) * 360.0) / Math.PI;
        fov = maxFovAspect;
      }
      this.fov = fov;
    }

    this.updateProjectionMatrix();
    this.updateProjectionView();
  }

  setZoom(zoom: Coordinate) {
    this.zoomScale = zoom;
  }

  setBaseTranslate(baseTranslate: Coordinate) {
    this.baseTranslate = baseTranslate;
  }

  /**
   * Orients the camera to look at a target point in world space.
   * @param targetX X coordinate of the target
   * @param targetY Y coordinate of the target
   * @param targetZ Z coordinate of the target
   */
  lookAt(targetX: number, targetY: number, targetZ: number) {
    const dx = targetX - this.position.x;
    const dy = targetY - this.position.y;
    const dz = targetZ - this.position.z;

    // Calculate yaw (ay) - rotation around Y axis
    this.position.ay = Math.atan2(-dx, -dz) * 180 / Math.PI;

    // Calculate pitch (ax) - rotation around X axis
    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
    this.position.ax = Math.atan2(-dy, horizontalDistance) * 180 / Math.PI;

    // Reset roll (az) to 0
    this.position.az = 0;

    this.updateProjectionView();
  }
}

class Camera2d extends BaseCamera {
  protected INTERVAL_TIME = 10;
  protected bound = new Rect2d(0, 0, 1, 1);

  public distanceEvent(event: EngineEvent): Coordinate {
    return new Coordinate(event.x + this.position.x, this.position.y + event.y);
  }

  updateProjectionMatrix = () => {
    const translateSpace = mat4.create();
    mat4.translate(
      translateSpace,
      translateSpace,
      vec3.fromValues(
        this.baseTranslate.x,
        this.baseTranslate.y,
        this.baseTranslate.z
      )
    );
    mat4.scale(
      translateSpace,
      translateSpace,
      vec3.fromValues(this.zoomScale.x, this.zoomScale.y, 1.0)
    );
    this.frustum = translateSpace;
  };

  zoomIn(delta: number) {
    this.zoomScale.x += delta;
    this.zoomScale.y += delta;
    this.updateProjectionMatrix();
  }

  zoomOut(delta: number) {
    this.zoomScale.x = Math.max(0.1, this.zoomScale.x - delta);
    this.zoomScale.y = Math.max(0.1, this.zoomScale.y - delta);
    this.updateProjectionMatrix();
  }

  public isOutOfBound(pos: Rect2d): boolean {
    this.bound.x = this.position.x + this.bound.width / 2.0;
    this.bound.y = this.position.y + this.bound.height / 2.0;
    return !CollisionDetection.isRectInRect(this.bound, pos);
  }

  public pan2d(time: number, x?: number, y?: number) {
    super.pan(time, this.INTERVAL_TIME, x, y);
  }

  public pan2dDif(time: number, dx?: number, dy?: number) {
    const { x, y } = this.position;
    super.pan(time, this.INTERVAL_TIME, x + (dx ?? 0), y + (dy ?? 0));
  }
}

class Camera3d extends BaseCamera {
  protected INTERVAL_TIME = 10;

  public pan3d(time: number, x?: number, y?: number, z?: number) {
    super.pan(time, this.INTERVAL_TIME, x, y, z);
  }
}

class Camera {
  public camera3d = new Camera3d();
  public camera2d = new Camera2d();
  public height: number;
  public width: number;
  public renderMode: '2d' | '3d' = '2d'; // Default to 2D mode

  public setupCamera(
    cameraOptions: CameraOptions,
    aspectRatio: number,
    canvas: HTMLCanvasElement,
    renderMode?: '2d' | '3d'
  ) {
    // Set render mode, default to 2D unless 3D is explicitly requested
    this.renderMode = renderMode || cameraOptions.renderMode || '2d';

    if (this.renderMode === '3d') {
      this.camera3d.setupCamera(cameraOptions, aspectRatio || 1, canvas);
    } else {
      this.camera2d.setupCamera(cameraOptions, aspectRatio || 1, canvas);
    }

    this.height = canvas.height;
    this.width = canvas.width;
  }

  public commitProjectionView() {
    if (this.renderMode === '3d') {
      if (this.camera3d.isUpdateView()) {
        this.camera3d.commitProjectionView();
      }
    } else {
      if (this.camera2d.isUpdateView()) {
        this.camera2d.commitProjectionView();
      }
    }
  }

  public getActiveCamera(): BaseCamera {
    return this.renderMode === '3d' ? this.camera3d : this.camera2d;
  }

  public getActiveFrustum(): any {
    return this.renderMode === '3d' ? this.camera3d.frustum : this.camera2d.frustum;
  }
}

export default Camera;
