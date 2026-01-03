import FontMetaData, {
  FontCharacter,
  FontMeta,
} from "../Core/Data/FontMetaData";

class FntFontReader extends FontMetaData {
  static FILENAME = /file="([\w\d\W\D]+)"/;
  static WIDTH = /scaleW=([\d]+)/;
  static HEIGHT = /scaleH=([\d]+)/;
  static LINE_HEIGHT = /lineHeight=([\d]+)/;
  static FONT_CHAR = new RegExp(
    "char[\\s]+" +
      ["id", "x", "y", "width", "height", "xoffset", "yoffset"]
        .map((column) => `${column}=([-\\d]+)[\\s]+`)
        .reduce((sum: string, str: string) => sum + str)
  );

  context: FontMeta;

  constructor(raw: string) {
    super();
    const lines = raw.split("\n");
    this.context = new FontMeta();
    for (const lineIdx in lines) {
      if (!Object.prototype.hasOwnProperty.call(lines, lineIdx)) {
        continue;
      }
      const line = lines[lineIdx];
      this.parseWidth(this.context, line);
      this.parseHeight(this.context, line);
      this.parseFilename(this.context, line);
      this.parseLineHeight(this.context, line);
      this.parseChar(this.context, line);
    }
  }

  parseChar(context: FontMeta, line: string) {
    const match = line.match(FntFontReader.FONT_CHAR);
    if (match) {
      const font = new FontCharacter();
      font.charCode = parseFloat(match[1]);
      font.x = parseFloat(match[2]);
      font.y = parseFloat(match[3]);
      font.width = parseFloat(match[4]);
      font.height = parseFloat(match[5]);
      font.xOffset = parseFloat(match[6]) / context.width;
      font.yOffset = parseFloat(match[7]) / context.height;
      font.char = String.fromCharCode(font.charCode);
      context.fonts[font.char] = font;
    }
  }

  parseHeight(context: FontMeta, line: string) {
    if (!context.height) {
      const match = line.match(FntFontReader.HEIGHT);
      if (match) {
        context.height = parseFloat(match[1]);
      }
    }
  }

  parseLineHeight(context: FontMeta, line: string) {
    if (!context.lineHeight) {
      const match = line.match(FntFontReader.LINE_HEIGHT);
      if (match) {
        context.lineHeight = parseFloat(match[1]);
      }
    }
  }

  parseWidth(context: FontMeta, line: string) {
    if (!context.width) {
      const match = line.match(FntFontReader.WIDTH);
      if (match) {
        context.width = parseFloat(match[1]);
      }
    }
  }

  parseFilename(context: FontMeta, line: string) {
    if (!context.filename) {
      const match = line.match(FntFontReader.FILENAME);
      if (match) {
        context.filename = match[1];
      }
    }
  }
}

export default FntFontReader;
