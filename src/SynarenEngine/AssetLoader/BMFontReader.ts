import FontMetaData, {
  FontCharacter,
  FontMeta
} from "../Core/Data/FontMetaData";

class BMFontReader extends FontMetaData {
  static FILENAME = /file="([\w\d_.\\/]+)"/;
  static WIDTH = /scaleW=([\d]+)/;
  static HEIGHT = /scaleH=([\d]+)/;
  static FONT_CHAR = new RegExp(
    "char[\\s]+" +
      ["id", "x", "y", "width", "height"]
        .map(column => `${column}=([\\d]+)[\\s]+`)
        .reduce((sum: string, str: string) => sum + str)
  );

  context: FontMeta;

  constructor(raw: string) {
    super();
    const lines = raw.split("\n");
    this.context = new FontMeta();
    for (const lineIdx in lines) {
      if (!lines.hasOwnProperty(lineIdx)) {
        continue;
      }
      const line = lines[lineIdx];
      if (!this.parseWidth(this.context, line)) continue;
      if (!this.parseHeight(this.context, line)) continue;
      if (!this.parseFilename(this.context, line)) continue;
      this.parseChar(this.context, line);
    }
  }

  parseChar(context: FontMeta, line: string) {
    const match = line.match(BMFontReader.FONT_CHAR);
    if (match) {
      const font = new FontCharacter();
      font.charCode = parseFloat(match[1]);
      font.x = parseFloat(match[2]);
      font.y = parseFloat(match[3]);
      font.width = parseFloat(match[4]);
      font.height = parseFloat(match[5]);
      font.char = String.fromCharCode(font.charCode);
      context.fonts[font.char] = font;
    }
  }

  parseHeight(context: FontMeta, line: string): boolean {
    let pass = true;
    if (!context.height) {
      const match = line.match(BMFontReader.HEIGHT);
      if (match) {
        context.height = parseFloat(match[1]);
      } else {
        pass = false;
      }
    }
    return pass;
  }

  parseWidth(context: FontMeta, line: string): boolean {
    let pass = true;
    if (!context.width) {
      const match = line.match(BMFontReader.WIDTH);
      if (match) {
        context.width = parseFloat(match[1]);
      } else {
        pass = false;
      }
    }
    return pass;
  }

  parseFilename(context: FontMeta, line: string): boolean {
    let pass = true;
    if (!context.filename) {
      const match = line.match(BMFontReader.FILENAME);
      if (match) {
        context.filename = match[1];
      } else {
        pass = false;
      }
    }
    return pass;
  }
}

export default BMFontReader;
