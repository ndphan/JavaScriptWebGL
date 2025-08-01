import Colour from "../Data/Colour";
import PlaneType from "../Data/PlaneType";
import { ColourRenderUnit, TextureRenderUnit } from "../Data/RenderUnit";

export class VertexBuilder {
  toArray2D(vertexes: TextureRenderUnit[]): number[] {
    const vertexConstruct: number[] = [];
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
  toTextureArray(vertexes: TextureRenderUnit[]): number[] {
    const vertexConstruct: number[] = [];
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
  toColourArray(vertexes: ColourRenderUnit[]): number[] {
    const vertexConstruct: number[] = [];
    for (const key in vertexes) {
      if (vertexes.hasOwnProperty(key)) {
        const _vertex = vertexes[key];
        vertexConstruct.push(_vertex.vertex.x);
        vertexConstruct.push(_vertex.vertex.y);
        vertexConstruct.push(_vertex.vertex.z);
        vertexConstruct.push(_vertex.colour.r);
        vertexConstruct.push(_vertex.colour.g);
        vertexConstruct.push(_vertex.colour.b);
        vertexConstruct.push(_vertex.colour.a);
      }
    }
    return vertexConstruct;
  }
  triangleXYColour(colour: Colour): number[] {
    const r = colour.r / 255.0;
    const g = colour.g / 255.0;
    const b = colour.b / 255.0;
    const a = colour.a / 255.0;
    const _colour = [
      1,
      1,
      0,
      r,
      g,
      b,
      a,
      0,
      1,
      0,
      r,
      g,
      b,
      a,
      0,
      0,
      0,
      r,
      g,
      b,
      a,
    ];
    return _colour;
  }
  planeXYColour(colour: Colour): number[] {
    const r = colour.r / 255.0;
    const g = colour.g / 255.0;
    const b = colour.b / 255.0;
    const a = colour.a / 255.0;
    const _colour = [
      -0.5,
      -0.5,
      0,
      r,
      g,
      b,
      a,
      0.5,
      -0.5,
      0,
      r,
      g,
      b,
      a,
      -0.5,
      0.5,
      0,
      r,
      g,
      b,
      a,
      0.5,
      0.5,
      0,
      r,
      g,
      b,
      a,
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
      bottom / height,
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
      bottom / height,
    ];
    return uv;
  }
  planeUV(vertices: TextureRenderUnit[], uv: number[]) {
    vertices[0].texture.u = uv[4];
    vertices[0].texture.v = uv[1];
    vertices[2].texture.u = uv[4];
    vertices[2].texture.v = uv[3];
    vertices[1].texture.u = uv[0];
    vertices[1].texture.v = uv[1];
    vertices[3].texture.u = uv[0];
    vertices[3].texture.v = uv[3];
  }
  planeXY(vertices: TextureRenderUnit[]) {
    this.plane(vertices, PlaneType.XY);
  }
  plane(vertices: TextureRenderUnit[], PLANE: PlaneType) {
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
  circleXYColour(segments: number, colour: Colour): number[] {
    const r = colour.r / 255.0;
    const g = colour.g / 255.0;
    const b = colour.b / 255.0;
    const a = colour.a / 255.0;
    const increment = (2 * Math.PI) / segments;
    const vertices: number[] = [];
    for (let angle = -Math.PI / 2; angle < Math.PI / 2; angle += increment) {
      const x = Math.sin(angle);
      const y = Math.cos(angle);
      vertices.push(x, y, 0);
      vertices.push(r, g, b, a);
      vertices.push(x, -y, 0);
      vertices.push(r, g, b, a);
    }
    return vertices;
  }
}
