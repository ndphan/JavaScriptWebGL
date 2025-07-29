import { mat4, vec3 } from "gl-matrix";

export interface LightOptions {
  pos: number[];
  in: number[];
  ambientCoeff: number;
  attenuation: number;
  at: number[];
  up?: vec3;
}

export default class Light {
  pos: number[];
  in: number[];
  ambientCoeff: number;
  attenuation: number;
  at: number[];
  up: vec3;

  constructor(options: LightOptions) {
    this.pos = options.pos;
    this.in = options.in;
    this.attenuation = options.attenuation;
    this.ambientCoeff = options.ambientCoeff;
    this.at = options.at;
  }

  vecZero(vec: vec3) {
    return vec3.equals(vec, vec3.fromValues(0, 0, 0));
  }

  parellelVec(vec1: vec3, vec2: vec3) {
    return (
      this.vecZero(vec1) !== true &&
      this.vecZero(vec2) !== true &&
      vec3.equals(
        vec3.normalize(vec3.create(), vec1),
        vec3.normalize(vec3.create(), vec2)
      ) === true
    );
  }

  perpVec(vec: vec3) {
    let perp = vec3.fromValues(1.0, 0.0, 0.0);
    if (this.parellelVec(vec, perp) === true) {
      perp = vec3.fromValues(0.0, 0.0, 1.0);
    }
    return perp;
  }

  posVec() {
    return vec3.fromValues(this.pos[0], this.pos[1], this.pos[2]);
  }

  atVec() {
    return vec3.fromValues(this.at[0], this.at[1], this.at[2]);
  }

  lookAt() {
    const pos = this.posVec();
    const at = this.atVec();
    let atCross = at;
    let posCross = pos;

    if (this.parellelVec(pos, at) === true) {
      atCross = this.perpVec(pos);
    } else {
      if (this.vecZero(pos) === true) {
        posCross = this.perpVec(at);
      }
      if (this.vecZero(at) === true) {
        atCross = this.perpVec(pos);
      }
    }
    this.up = vec3.cross(vec3.create(), posCross, atCross);
    return mat4.lookAt(mat4.create(), pos, at, this.up);
  }
}
