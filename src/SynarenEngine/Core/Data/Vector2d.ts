import { vec2 } from "gl-matrix";

class Vector2d extends vec2 {
  set x(x: number) {
    this[0] = x;
  }
  get x(): number {
    return this[0];
  }
  set y(y: number) {
    this[1] = y;
  }
  get y(): number {
    return this[1];
  }
  normalise(): Vector2d {
    return vec2.normalize(Vector2d.newVector(0.0, 0.0), this) as Vector2d;
  }
  dot(v: Vector2d): number {
    return vec2.dot(this, v);
  }
  negate(): Vector2d {
    return vec2.negate(Vector2d.newVector(0.0, 0.0), this) as Vector2d;
  }
  scale(s: number): vec2 {
    return vec2.scale(Vector2d.newVector(0.0, 0.0), this, s);
  }
  subtract(v: Vector2d): Vector2d {
    return vec2.subtract(Vector2d.newVector(0, 0), this, v) as Vector2d;
  }
  add(v: Vector2d): Vector2d {
    return vec2.add(Vector2d.newVector(0, 0), this, v) as Vector2d;
  }
  static newVector(x: number, y: number): Vector2d {
    const vector = new Vector2d();
    vector.x = x;
    vector.y = y;
    return vector;
  }
  constructor() {
    super();
  }
}

export default Vector2d;
