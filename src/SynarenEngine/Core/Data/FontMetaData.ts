export class FontMeta {
  filename: string;
  height: number;
  width: number;
  fonts: { [key: string]: FontCharacter } = {};
  lineHeight: number;
}

export class FontCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  charCode: number;
  char: string;
  xOffset: number;
  yOffset: number;
}

class FontMetaData {
  context: FontMeta;
}

export default FontMetaData;
