import PlaneType from "../Data/PlaneType";
import { RenderUnit } from "../..";

export class VertexBuilder {
  toArray2D(vertexes: RenderUnit[]) {
    const vertexConstruct = [];
    for (const key in vertexes) {
      if (vertexes.hasOwnProperty(key)) {
        const _vertex = vertexes[key];
        vertexConstruct.push(_vertex.vertex.x);
        vertexConstruct.push(_vertex.vertex.y);
        vertexConstruct.push(_vertex.vertex.z);
        vertexConstruct.push(_vertex.texture.u);
        vertexConstruct.push(_vertex.texture.v);
      }
    }
    return vertexConstruct;
  }
  toArray(vertexes: RenderUnit[]) {
    const vertexConstruct = [];
    for (const key in vertexes) {
      if (vertexes.hasOwnProperty(key)) {
        const _vertex = vertexes[key];
        vertexConstruct.push(_vertex.vertex.x);
        vertexConstruct.push(_vertex.vertex.y);
        vertexConstruct.push(_vertex.vertex.z);
        vertexConstruct.push(_vertex.normal.x);
        vertexConstruct.push(_vertex.normal.y);
        vertexConstruct.push(_vertex.normal.z);
        vertexConstruct.push(_vertex.texture.u);
        vertexConstruct.push(_vertex.texture.v);
      }
    }
    return vertexConstruct;
  }
  planeXYColor(width: number, height: number, colour: any): number[] {
    const _colour = [
      -width / 2,
      -height / 2,
      colour.r,
      colour.g,
      colour.b,
      width / 2,
      -height / 2,
      colour.r,
      colour.g,
      colour.b,
      -width / 2,
      height / 2,
      colour.r,
      colour.g,
      colour.b,
      width / 2,
      height / 2,
      colour.r,
      colour.g,
      colour.b
    ];
    return _colour;
  }
  planeCCW(loc: number[], width: number, height: number) {
    const left = loc[0];
    const top = loc[1];
    const right = loc[2];
    const bottom = loc[3];
    const uv = [
      left / width,
      bottom / height,
      left / width,
      top / height,
      right / width,
      top / height,
      right / width,
      bottom / height
    ];
    return uv;
  }
  planeCW(loc: number[], width: number, height: number): number[] {
    const left = loc[0];
    const top = loc[1];
    const right = loc[2];
    const bottom = loc[3];
    const uv = [
      right / width,
      bottom / height,
      right / width,
      top / height,
      left / width,
      top / height,
      left / width,
      bottom / height
    ];
    return uv;
  }
  planeUV(vertices: RenderUnit[], uv: number[]) {
    vertices[0].texture.u = uv[4];
    vertices[0].texture.v = uv[1];
    vertices[2].texture.u = uv[4];
    vertices[2].texture.v = uv[3];
    vertices[1].texture.u = uv[0];
    vertices[1].texture.v = uv[1];
    vertices[3].texture.u = uv[0];
    vertices[3].texture.v = uv[3];
  }

  planeXY(plane: PlaneType, vertices: RenderUnit[]) {
    vertices[0].vertex.x = -plane.width / 2;
    vertices[0].vertex.y = -plane.height / 2;
    vertices[0].normal.z = plane.normalDirection;
    vertices[1].vertex.x = -plane.width / 2;
    vertices[1].vertex.y = plane.height / 2;
    vertices[1].normal.z = plane.normalDirection;
    vertices[2].vertex.x = plane.width / 2;
    vertices[2].vertex.y = -plane.height / 2;
    vertices[2].normal.z = plane.normalDirection;
    vertices[3].vertex.x = plane.width / 2;
    vertices[3].vertex.y = plane.height / 2;
    vertices[3].normal.z = plane.normalDirection;
  }

  plane(vertices: RenderUnit[], PLANE: PlaneType) {
    switch (PLANE) {
      case PlaneType.XY: {
        vertices[0].vertex.x = -1 / 2;
        vertices[0].vertex.y = -1 / 2;
        vertices[0].normal.z = -1;
        vertices[1].vertex.x = -1 / 2;
        vertices[1].vertex.y = 1 / 2;
        vertices[1].normal.z = -1;
        vertices[2].vertex.x = 1 / 2;
        vertices[2].vertex.y = -1 / 2;
        vertices[2].normal.z = -1;
        vertices[3].vertex.x = 1 / 2;
        vertices[3].vertex.y = 1 / 2;
        vertices[3].normal.z = -1;
        break;
      }
      case PlaneType.YX: {
        vertices[0].vertex.x = 1 / 2;
        vertices[0].vertex.y = 1 / 2;
        vertices[0].normal.z = 1;
        vertices[2].vertex.x = 1 / 2;
        vertices[2].vertex.y = -1 / 2;
        vertices[2].normal.z = 1;
        vertices[1].vertex.x = -1 / 2;
        vertices[1].vertex.y = 1 / 2;
        vertices[1].normal.z = 1;
        vertices[3].vertex.x = -1 / 2;
        vertices[3].vertex.y = -1 / 2;
        vertices[3].normal.z = 1;
        break;
      }
      case PlaneType.XZ: {
        vertices[0].vertex.x = -1 / 2;
        vertices[0].vertex.z = -1 / 2;
        vertices[0].normal.y = 1;
        vertices[1].vertex.x = -1 / 2;
        vertices[1].vertex.z = 1 / 2;
        vertices[1].normal.y = 1;
        vertices[2].vertex.x = 1 / 2;
        vertices[2].vertex.z = -1 / 2;
        vertices[2].normal.y = 1;
        vertices[3].vertex.x = 1 / 2;
        vertices[3].vertex.z = 1 / 2;
        vertices[3].normal.y = 1;
        break;
      }
      case PlaneType.ZX: {
        vertices[0].vertex.x = 1 / 2;
        vertices[0].vertex.z = 1 / 2;
        vertices[0].normal.y = -1;
        vertices[2].vertex.x = 1 / 2;
        vertices[2].vertex.z = -1 / 2;
        vertices[2].normal.y = -1;
        vertices[1].vertex.x = -1 / 2;
        vertices[1].vertex.z = 1 / 2;
        vertices[1].normal.y = -1;
        vertices[3].vertex.x = -1 / 2;
        vertices[3].vertex.z = -1 / 2;
        vertices[3].normal.y = -1;
        break;
      }
      case PlaneType.YZ: {
        vertices[0].vertex.y = -1 / 2;
        vertices[0].vertex.z = -1 / 2;
        vertices[0].normal.x = -1;
        vertices[1].vertex.y = -1 / 2;
        vertices[1].vertex.z = 1 / 2;
        vertices[1].normal.x = -1;
        vertices[2].vertex.y = 1 / 2;
        vertices[2].vertex.z = -1 / 2;
        vertices[2].normal.x = -1;
        vertices[3].vertex.y = 1 / 2;
        vertices[3].vertex.z = 1 / 2;
        vertices[3].normal.x = -1;
        break;
      }
      case PlaneType.ZY: {
        vertices[0].vertex.y = 1 / 2;
        vertices[0].vertex.z = 1 / 2;
        vertices[0].normal.x = 1;
        vertices[2].vertex.y = 1 / 2;
        vertices[2].vertex.z = -1 / 2;
        vertices[2].normal.x = 1;
        vertices[1].vertex.y = -1 / 2;
        vertices[1].vertex.z = 1 / 2;
        vertices[1].normal.x = 1;
        vertices[3].vertex.y = -1 / 2;
        vertices[3].vertex.z = -1 / 2;
        vertices[3].normal.x = 1;
        break;
      }
      default:
        break;
    }
  }
}
