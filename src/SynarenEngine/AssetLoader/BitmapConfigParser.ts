class BitmapConfigParser {
  map: { [key: string]: number[] };
  raw: { [key: string]: number[] };
  constructor(
    raw: string,
    bitmapWidth: number,
    bitmapHeight: number,
    precision: number
  ) {
    this.map = raw
      .split("\n")
      .map(line => this.processLine(bitmapWidth, bitmapHeight, precision, line))
      .reduce((sum, next) => ({ ...sum, ...next }));

    this.raw = raw
      .split("\n")
      .map(line => this.processRawLine(line))
      .reduce((sum, next) => ({ ...sum, ...next }));
  }

  processRawLine(line: string) {
    const seperator = "\u0020";

    const nameindex = line.indexOf(seperator);
    const key = line.substr(0, nameindex);

    let temp = line.substr(nameindex + 1);
    temp = temp.substr(temp.indexOf(seperator) + 1);

    const leftindex = temp.indexOf(seperator);
    const left = parseFloat(temp.substr(0, leftindex + 1));

    temp = temp.substr(leftindex + 1);
    const topindex = temp.indexOf(seperator);
    const top = parseFloat(temp.substr(0, topindex));

    temp = temp.substr(topindex + 1);
    const widthIndex = temp.indexOf(seperator);
    const width = parseFloat(temp.substr(0, widthIndex));

    temp = temp.substr(widthIndex);
    const height = parseFloat(temp);

    return {
      [key]: [left, top, width, height]
    };
  }

  processLine(
    bitmapWidth: number,
    bitmapHeight: number,
    precision: number,
    line: string
  ) {
    const seperator = "\u0020";

    const nameindex = line.indexOf(seperator);
    const key = line.substr(0, nameindex);

    let temp = line.substr(nameindex + 1);
    temp = temp.substr(temp.indexOf(seperator) + 1);

    const leftindex = temp.indexOf(seperator);
    const left = parseFloat(temp.substr(0, leftindex + 1));

    temp = temp.substr(leftindex + 1);
    const topindex = temp.indexOf(seperator);
    const top = parseFloat(temp.substr(0, topindex));

    temp = temp.substr(topindex + 1);
    const widthIndex = temp.indexOf(seperator);
    const width = parseFloat(temp.substr(0, widthIndex));

    temp = temp.substr(widthIndex);
    const height = parseFloat(temp);

    return {
      [key]: [
        (left + width) / bitmapWidth - precision,
        (height + top) / bitmapHeight - precision,
        (left + width) / bitmapWidth - precision,
        top / bitmapHeight + precision,
        left / bitmapWidth + precision,
        top / bitmapHeight + precision,
        left / bitmapWidth + precision,
        (top + height) / bitmapHeight - precision
      ]
    };
  }

  getMap(): { [key: string]: number[] } {
    return this.map;
  }
}

export default BitmapConfigParser;
