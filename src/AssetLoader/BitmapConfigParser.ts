interface BitmapData {
  [key: string]: number[];
}

class BitmapConfigParser {
  map: BitmapData;
  raw: BitmapData;
  private source: string;
  private readonly SOURCE_KEY = "$source =";

  constructor(
    raw: string,
    bitmapWidth: number,
    bitmapHeight: number,
    precision: number
  ) {
    this.map = raw
      .split("\n")
      .map((line) =>
        this.processLine(bitmapWidth, bitmapHeight, precision, line)
      )
      .filter((e) => !!e)
      .reduce((sum, next) => ({ ...sum, ...next }));

    this.raw = raw
      .split("\n")
      .map((line) => this.processRawLine(line))
      .filter((e) => !!e)
      .reduce((sum, next) => ({ ...sum, ...next })) as BitmapData;
  }

  processRawLine(line: string) {
    if (line.startsWith(this.SOURCE_KEY)) {
      this.source = line
        .substr(line.indexOf(this.SOURCE_KEY) + this.SOURCE_KEY.length)
        .trim()
        .replace("\r", "")
        .replace("\n", "");

      if (window.location.origin === "file://") {
        console.info(
          "file based loading should not have ./ in front of the source"
        );
      }

      return;
    }
    return this.processTextureLine(line);
  }

  private processTextureLine(line: string) {
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
      [key]: [left, top, width, height],
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
        (top + height) / bitmapHeight - precision,
      ],
    };
  }

  getMap(): BitmapData {
    return this.map;
  }

  getTextureSource(): string {
    return this.source;
  }
}

export default BitmapConfigParser;
