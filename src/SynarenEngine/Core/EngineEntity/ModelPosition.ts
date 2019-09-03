import { quat, mat4, glMatrix } from "gl-matrix";
import Rect3d from "../Data/Rect3d";
import Position from "./Position";

export default class ModelPosition {
  position: Position = new Position();
  cachedModel: mat4;
  dirtyModel = true;
  quatRotationxyz: mat4;
  dirtyQuat = true;
  dirtyPos = true;
  dirtyScale = true;
  dirtyOrigin = true;
  intermediateModels: mat4[] = [
    mat4.create(),
    mat4.create(),
    mat4.create(),
    mat4.create()
  ];
  // prevent memory reallocation of objects
  initialMat4Temp = mat4.create();
  rotateQuatTemp = quat.create();
  rotateMat4Temp = mat4.create();

  setPosition(position: Position) {
    this.position = position;
  }

  pos() {
    return [this.position.x, this.position.y, this.position.z];
  }

  centerRect(rect: Rect3d) {
    this.center(rect.x, rect.y, rect.z);
  }

  rotateOriginRect(rect: Rect3d) {
    this.rotateOrigin(rect.x, rect.y, rect.z);
  }

  center(x: number, y: number, z: number) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.dirtyPos = true;
    this.dirtyModel = true;
    this.rotateOrigin(this.position.x, this.position.y, this.position.z);
  }

  rotateOrigin(x: number, y: number, z: number) {
    this.position.originX = x;
    this.position.originY = y;
    this.position.originZ = z;
    this.dirtyOrigin = true;
    this.dirtyQuat = true;
    this.dirtyModel = true;
  }

  angleX(x: number) {
    this.position.ax = x;
    this.dirtyQuat = true;
    this.dirtyModel = true;
  }

  angleY(y: number) {
    this.position.ay = y;
    this.dirtyQuat = true;
    this.dirtyModel = true;
  }

  angleZ(z: number) {
    this.position.az = z;
    this.dirtyQuat = true;
    this.dirtyModel = true;
  }

  rotateX(x: number) {
    this.angleX(x);
  }

  rotateY(y: number) {
    this.angleY(y);
  }

  rotateZ(z: number) {
    this.angleZ(z);
  }

  scaleX(x: number) {
    this.position.scaleX = x;
    this.position.width = this.position.scaleX;
    this.dirtyScale = true;
    this.dirtyModel = true;
  }

  scaleY(y: number) {
    this.position.scaleY = y;
    this.position.height = this.position.scaleY;
    this.dirtyScale = true;
    this.dirtyModel = true;
  }

  scaleZ(z: number) {
    this.position.scaleZ = z;
    this.dirtyScale = true;
    this.dirtyModel = true;
  }

  scale(x: number, y: number, z: number) {
    this.position.scaleX = x;
    this.position.scaleY = y;
    this.position.scaleZ = z;
    this.position.width = x;
    this.position.height = y;
    this.dirtyScale = true;
    this.dirtyModel = true;
  }

  scaleRect(rect: Rect3d) {
    this.position.scaleX = rect.width;
    this.position.scaleY = rect.height;
    this.position.scaleZ = rect.length;
    this.position.width = rect.width;
    this.position.height = rect.height;
    this.dirtyScale = true;
    this.dirtyModel = true;
  }

  translate(dx: number, dy: number, dz: number) {
    this.position.x += dx;
    this.position.y += dy;
    this.position.z += dz;
    this.dirtyPos = true;
    this.dirtyModel = true;
    this.rotateOrigin(this.position.x, this.position.y, this.position.z);
  }

  _buildQuat() {
    const quatMat = this.createMat4NoAlloc(this.rotateMat4Temp);
    let quatRotationxyz = this.createQuatNoAlloc(this.rotateQuatTemp);
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
    return mat4.fromQuat(quatMat, quatRotationxyz);
  }

  getIntermediateModel(point: number, dest: mat4) {
    const org = this.intermediateModels[point];
    for (const index in dest) {
      if (dest.hasOwnProperty(index)) {
        dest[index] = org[index];
      }
    }
    return dest;
  }

  _buildModelIntermediate(point: number, dest: mat4) {
    // faster copy - preserve existing reference to prevent GC
    const org = this.intermediateModels[point];
    for (const index in dest) {
      if (dest.hasOwnProperty(index)) {
        org[index] = dest[index];
      }
    }
    return dest;
  }

  createQuatNoAlloc(out: quat) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }

  createMat4NoAlloc(out: mat4) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  _buildModel() {
    let _dirty = false;
    let dest = this.createMat4NoAlloc(this.initialMat4Temp);
    if (this.dirtyOrigin) {
      _dirty = true;
      const origin = [
        this.position.originX,
        this.position.originY,
        this.position.originZ
      ];
      mat4.translate(dest, dest, origin);

      this._buildModelIntermediate(0, dest);
    } else {
      dest = this.getIntermediateModel(0, dest);
    }

    // cache this one as its heavy
    if (this.dirtyQuat || _dirty) {
      _dirty = true;
      this.quatRotationxyz = this._buildQuat();
      mat4.multiply(dest, dest, this.quatRotationxyz);
      this._buildModelIntermediate(1, dest);
    } else {
      dest = this.getIntermediateModel(1, dest);
    }

    if (this.dirtyPos || _dirty) {
      _dirty = true;
      const negOrigin = [
        -1 * this.position.originX,
        -1 * this.position.originY,
        -1 * this.position.originZ
      ];
      mat4.translate(dest, dest, negOrigin);

      const pos = [this.position.x, this.position.y, this.position.z];
      mat4.translate(dest, dest, pos);

      this._buildModelIntermediate(2, dest);
    } else {
      dest = this.getIntermediateModel(2, dest);
    }

    if (this.dirtyScale || _dirty) {
      _dirty = true;
      const scale = [
        this.position.scaleX,
        this.position.scaleY,
        this.position.scaleZ
      ];
      mat4.scale(dest, dest, scale);

      this._buildModelIntermediate(3, dest);
    } else {
      dest = this.getIntermediateModel(3, dest);
    }

    this.dirtyPos = false;
    this.dirtyQuat = false;
    this.dirtyScale = false;
    this.dirtyOrigin = false;
    this.cachedModel = dest;
  }

  getModel = () => {
    if (this.dirtyModel) {
      this.dirtyModel = false;
      this._buildModel();
    }
    return this.cachedModel;
  };

  degreesToRadians(degrees: number) {
    return Math.round(glMatrix.toRadian(degrees) * 100) / 100;
  }

  setRect(rect: Rect3d) {
    this.position.x = rect.x;
    this.position.y = rect.y;
    this.position.z = rect.z;
    this.position.width = rect.width;
    this.position.height = rect.height;
    this.position.length = rect.length;
  }

  getRect(): Rect3d {
    return new Rect3d(
      this.position.x,
      this.position.y,
      this.position.z,
      this.position.width,
      this.position.height,
      this.position.length
    );
  }
}
