import { quat, mat4, glMatrix, vec3 } from "gl-matrix";
import Timer from "./Common/Timer";

class Camera {
  x: number = 0.0;
  y: number = 0.0;
  z: number = 0.0;
  ax: number = 0.0;
  ay: number = 0.0;
  az: number = 0.0;

  tx: number = 0.0;
  ty: number = 0.0;
  tz: number = 0.0;
  dx: number = 0.0;
  dy: number = 0.0;
  dz: number = 0.0;
  steps: number = 0;

  interval?: NodeJS.Timeout;
  moveTime: number;

  timer: Timer = new Timer();

  aspect: number;
  fov: number;
  near: number;
  far: number;

  frustum: mat4;
  viewMatrix: mat4;

  cameraOptions: any;

  height: number;
  width: number;

  // optimise matrix recompile when required
  requireUpdateViewMtrx: boolean = true;

  init(fov: number, aspect: number, near: number, far: number) {
    this.aspect = aspect;
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.updateProjectionMatrix();
    this.updateProjectionView();
  }

  setupCamera = (cameraOptions: any, canvas: HTMLCanvasElement) => {
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
    this.height = canvas.height;
    this.width = canvas.width;
    this.init(fov, aspect, near, far);
  };

  updateProjectionView = () => {
    this.requireUpdateViewMtrx = true;
  };

  commitProjectionView = () => {
    this._updateProjectionView();
  };

  _updateProjectionView = () => {
    this.requireUpdateViewMtrx = false;

    let quatRotationxyz = quat.create();
    quatRotationxyz = quat.rotateX(
      quatRotationxyz,
      quatRotationxyz,
      this.degreesToRadians(this.ax)
    );
    quatRotationxyz = quat.rotateY(
      quatRotationxyz,
      quatRotationxyz,
      this.degreesToRadians(this.ay)
    );
    quatRotationxyz = quat.rotateZ(
      quatRotationxyz,
      quatRotationxyz,
      this.degreesToRadians(this.az)
    );
    quatRotationxyz = quat.normalize(quatRotationxyz, quatRotationxyz);

    const dest = mat4.create();

    const quatMat = mat4.create();
    mat4.fromQuat(quatMat, quatRotationxyz);
    mat4.multiply(dest, dest, quatMat);

    const pos = vec3.fromValues(-this.x, -this.y, -this.z);
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

  private degreesToRadians(degrees: number): number {
    return Math.round(glMatrix.toRadian(degrees) * 100) / 100;
  }

  setPos = (x: number, y: number, z: number) => {
    this.x = x;
    this.y = y;
    this.z = z;
  };

  getPos = () => {
    return [this.x, this.y, this.z];
  };

  moveTo(time: number, x?: number, y?: number, z?: number) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.steps = time;
    this.moveTime = time;
    const speed = 1000.0 / 20.0;
    if (x !== undefined) {
      this.dx = x - this.x;
      this.tx = x;
    } else {
      this.dx = 0;
      this.tx = this.x;
    }

    if (y !== undefined) {
      this.dy = y - this.y;
      this.ty = y;
    } else {
      this.dy = 0;
      this.ty = this.y;
    }

    if (z !== undefined) {
      this.dz = z - this.z;
      this.tz = z;
    } else {
      this.dz = 0;
      this.tz = this.z;
    }

    this.timer.start();
    this.interval = setInterval(() => {
      const time = this.timer.peak();
      if (this.steps > 0) {
        this.steps -= time;

        if (this.steps <= 0) {
          this.x = this.tx;
          this.y = this.ty;
          this.z = this.tz;
          if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
          }
        } else {
          this.x += (this.dx * time) / this.moveTime;
          this.y += (this.dy * time) / this.moveTime;
          this.z += (this.dz * time) / this.moveTime;
        }
        this.updateProjectionView();
      } else {
        this.x = this.tx;
        this.y = this.ty;
        this.z = this.tz;
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = undefined;
        }
        this.updateProjectionView();
      }
      this.timer.start();
    }, speed);
  }

  rotateAngle(dx: number, dy: number, dz: number) {
    this.rotateAngleX(dx);
    this.rotateAngleY(dy);
    this.rotateAngleZ(dz);
  }

  setAngle(x: number, y: number, z: number) {
    this.ax = x;
    this.ay = y;
    this.az = z;
  }

  setAngleZ(z: number) {
    this.az = z;
  }

  rotateAngleX(dx: number) {
    this.ax -= dx;
    if (this.ax > 90) {
      const diff = 90;
      this.ax = diff;
    } else if (this.ax < -90) {
      const diff = -90;
      this.ax = diff;
    }
  }

  rotateAngleZ(dz: number) {
    this.az += dz;
    if (this.az > 360) {
      const diff = this.az - 360;
      this.az = diff;
    } else if (this.az < 0) {
      const diff = this.az + 360;
      this.az = diff;
    }
  }

  rotateAngleY(dy: number) {
    this.ay += dy;
    if (this.ay > 360) {
      const diff = this.ay - 360;
      this.ay = diff;
    } else if (this.ay < 0) {
      const diff = this.ay + 360;
      this.ay = diff;
    }
  }

  zoomIn = () => {
    this.fov -= 10;
    this.fov = Math.max(10, this.fov);
    this.updateProjectionMatrix();
  };

  zoomOut = () => {
    const maxFovAspect = (Math.atan(1.0 / this.aspect) * 360.0) / Math.PI;
    this.fov += 10;
    this.fov = Math.min(
      Math.min(this.cameraOptions.maxFov || maxFovAspect, maxFovAspect),
      this.fov
    );
    this.updateProjectionMatrix();
  };
}

export default Camera;
