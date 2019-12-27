import Vector2d from "../Data/Vector2d";
import Coordinate from "../Data/Coordinate";
import Rect2d from "../Data/Rect2d";
import { vec4, mat4 } from "gl-matrix";
import Plane3d from "../../Entity/Plane3d";
import { BaseCamera } from "../Camera";

export class Collision {
  willIntersect: boolean;
  isIntersect: boolean;
  minDeintersectDistance: Vector2d;
}

export class CollisionDetection {
  static getLength(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(
      Math.abs((x1 - x2) * (x1 - x2)) + Math.abs((y1 - y2) * (y1 - y2))
    );
  }
  static isCollidingRect(
    x1: number,
    y1: number,
    width1: number,
    height1: number,
    x2: number,
    y2: number,
    width2: number,
    height2: number
  ) {
    return (
      CollisionDetection.getLength(x1 + width1 / 2, 0, x2 + width2 / 2, 0) <=
        width1 / 2 + width2 / 2 &&
      CollisionDetection.getLength(y1 + height1 / 2, 0, y2 + height2 / 2, 0) <=
        height1 / 2 + height2 / 2
    );
  }

  static isRectInRect(rect1: Rect2d, rect2: Rect2d): boolean {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect1.y + rect1.height < rect2.y ||
      rect1.x > rect2.x + rect2.width ||
      rect1.y > rect2.y + rect2.height
    );
  }

  static isPointInRect(rect: Rect2d, coord: Coordinate): boolean {
    return this.isCollidingRect(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      coord.x,
      coord.y,
      0.01,
      0.01
    );
  }
  static isPointInPlane3d(
    camera: BaseCamera,
    obj: Plane3d,
    x: number,
    y: number
  ): boolean {
    const mvp = mat4.multiply(
      mat4.create(),
      camera.frustum,
      mat4.multiply(mat4.create(), camera.viewMatrix, obj.getModel())
    );

    const r1: vec4 = this.toClipSpace(
      obj.vertexModel.renderUnits[0].vertex,
      mvp
    );
    if (r1[2] > 1.0) return false;

    const r2: vec4 = this.toClipSpace(
      obj.vertexModel.renderUnits[1].vertex,
      mvp
    );
    if (r2[2] > 1.0) return false;

    const r3: vec4 = this.toClipSpace(
      obj.vertexModel.renderUnits[2].vertex,
      mvp
    );
    if (r3[2] > 1.0) return false;

    const r4: vec4 = this.toClipSpace(
      obj.vertexModel.renderUnits[3].vertex,
      mvp
    );
    if (r4[2] > 1.0) return false;

    const rectPolygon = [
      [r1[0], r1[1]],
      [r2[0], r2[1]],
      [r4[0], r4[1]],
      [r3[0], r3[1]]
    ];
    return this.pointInPolygon([x, y], rectPolygon);
  }
  static pointInPolygon = (point: number[], polygon: number[][]) => {
    const x = point[0];
    const y = point[1];

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  };
  static toClipSpace(pos: Coordinate, mvp: mat4) {
    const vec4Trans = vec4.transformMat4(
      vec4.create(),
      vec4.set(vec4.create(), pos.x, pos.y, pos.z, 1.0),
      mvp
    );

    const vec4Norm = vec4.scale(vec4.create(), vec4Trans, 1.0 / vec4Trans[3]);
    return vec4.set(
      vec4.create(),
      (vec4Norm[0] + 1.0) / 2.0,
      (vec4Norm[1] + 1.0) / 2.0,
      vec4Norm[2],
      1.0
    );
  }
}

export class Polygon {
  points: Vector2d[];
  edges: Vector2d[];
  center: Vector2d;
  max: number = 0;
  min: number = 0;
  subtractCenter(p: Polygon): Vector2d {
    return this.center.subtract(p.center);
  }
  offset(v: Vector2d) {
    this.points.forEach(point => point.add(v));
  }
  area(v1: Vector2d, v2: Vector2d): number {
    return v1.x * v2.y - v2.x * v1.y;
  }
  calculateCentre(): Vector2d {
    const centroid = Vector2d.newVector(0, 0);
    let totalSignedArea = 0.0;
    const vertexCount = this.points.length;
    for (let i = 0; i < vertexCount; ++i) {
      const vertex = this.points[i];
      let nextVertex;
      if (i == vertexCount - 1) {
        nextVertex = this.points[0];
      } else {
        nextVertex = this.points[i + 1];
      }
      const area = this.area(vertex, nextVertex);
      totalSignedArea += area;
      centroid.x += (vertex.x + nextVertex.x) * area;
      centroid.y += (vertex.y + nextVertex.y) * area;
    }
    centroid.x /= 3.0 * totalSignedArea;
    centroid.y /= 3.0 * totalSignedArea;
    return centroid;
  }
  polygonProjection(axis: Vector2d, polygon: Polygon) {
    let dotProduct: number = axis.dot(polygon.points[0]);
    polygon.min = dotProduct;
    polygon.max = dotProduct;
    for (let i = 0; i < polygon.points.length; i++) {
      const point = polygon.points[i];
      dotProduct = point.dot(axis);
      if (dotProduct < polygon.min) {
        polygon.min = dotProduct;
      } else if (dotProduct > polygon.max) {
        polygon.max = dotProduct;
      }
    }
  }
  boundaryDistance(
    minA: number,
    maxA: number,
    minB: number,
    maxB: number
  ): number {
    if (minA < minB) {
      return minB - maxA;
    } else {
      return minA - maxB;
    }
  }
  isCollision(polygonB: Polygon, velocity?: Vector2d): Collision {
    const result = new Collision();
    result.isIntersect = true;
    result.willIntersect = true;
    const edgeCountA: number = this.edges.length;
    const edgeCountB: number = polygonB.edges.length;
    let minIntervalDistance = Infinity;
    let translationAxis = new Vector2d();
    let edge: Vector2d;
    for (let edgeIndex = 0; edgeIndex < edgeCountA + edgeCountB; edgeIndex++) {
      if (edgeIndex < edgeCountA) {
        edge = this.edges[edgeIndex];
      } else {
        edge = polygonB.edges[edgeIndex - edgeCountA];
      }
      const axis = Vector2d.newVector(-edge.y, edge.x).normalise();
      this.polygonProjection(axis, this);
      this.polygonProjection(axis, polygonB);

      if (
        this.boundaryDistance(this.min, this.max, polygonB.min, polygonB.max) >
        0
      ) {
        result.isIntersect = false;
      }

      if (velocity) {
        const velocityProjection: number = axis.dot(velocity);
        if (velocityProjection < 0) {
          this.min += velocityProjection;
        } else {
          this.max += velocityProjection;
        }
      }

      let intervalDistance: number = this.boundaryDistance(
        this.min,
        this.max,
        polygonB.min,
        polygonB.max
      );
      if (intervalDistance > 0) {
        result.willIntersect = false;
      }

      if (!result.isIntersect && !result.willIntersect) {
        break;
      }

      intervalDistance = Math.abs(intervalDistance);
      if (intervalDistance < minIntervalDistance) {
        minIntervalDistance = intervalDistance;
        translationAxis = axis;
        const distance: Vector2d = this.subtractCenter(polygonB);
        if (distance.dot(translationAxis) < 0) {
          translationAxis = translationAxis.negate();
        }
      }
    }
    if (result.willIntersect) {
      result.minDeintersectDistance = translationAxis.scale(
        minIntervalDistance
      ) as Vector2d;
    }
    return result;
  }
}
