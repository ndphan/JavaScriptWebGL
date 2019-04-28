export class FontMeta {
  filename: string;
  height: number;
  width: number;
  fonts: { [key: string]: FontCharacter } = {};
}

export class FontCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  charCode: number;
  char: string;
}

class FontMetaData {
  context: FontMeta;
}

export default FontMetaData;
