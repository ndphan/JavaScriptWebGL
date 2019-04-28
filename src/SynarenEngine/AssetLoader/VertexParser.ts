class VertexParser {
  vertices: number[];

  constructor(raw: string | number[]) {
    if (typeof raw === "string") {
      this.vertices = raw.split(",").map(parseFloat);
    } else if (raw instanceof Array) {
      this.vertices = raw;
    } else {
      console.error("Unexpected obj type");
    }
  }
}

export default VertexParser;
