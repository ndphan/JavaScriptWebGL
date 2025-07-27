import EntityManager from "../../Manager/EntityManager";
import Texture from "../Buffer/Texture";
import Timer from "../Common/Timer";
import Coordinate from "../Data/Coordinate";
import FontMetaData, { FontCharacter } from "../Data/FontMetaData";
import PlaneType from "../Data/PlaneType";
import Rect2d from "../Data/Rect2d";
import TextureVertexModel from "../Data/TextureVertexModel";
import { EngineEntity } from "../EngineEntity/EngineObject";
import EngineObjectHelper from "../EngineEntity/EngineObjectHelper";
import ModelObject2d from "../EngineEntity/ModelObject2d";
import ModelPosition from "../EngineEntity/ModelPosition";
import { ShaderEntity } from "../EngineEntity/ShaderEntity";
import EngineHelper from "../EngineHelper";
import { RendererNotification } from "../Renderer";

class FontChar extends ModelObject2d {
  fontChar: FontCharacter;
  constructor(
    fontChar: FontCharacter,
    rect: Rect2d,
    vertexModel: TextureVertexModel
  ) {
    super(rect, vertexModel);
    this.fontChar = fontChar;
  }
}

class RenderFont {
  shaderEntity?: ShaderEntity;
  font?: FontChar;
  displayTime?: number;
  timer: Timer;
  id: number;
  modelPos: ModelPosition;
  repeat = false;
  static $id = 0;

  render(engineHelper: EngineHelper) {
    if (this.isRepeat() && !this.repeat) {
      return;
    } else {
      this.repeat = false;
    }
    if (this.shaderEntity) {
      engineHelper.render(this.shaderEntity);
    }
  }

  expire() {
    this.displayTime = -1;
    this.shaderEntity = undefined;
    this.font = undefined;
  }

  isExpired() {
    return (
      this.displayTime !== undefined &&
      !this.isRepeat() &&
      this.displayTime < this.timer.peak()
    );
  }

  refresh() {
    this.repeat = true;
  }

  isRepeat() {
    return this.displayTime === 0;
  }

  constructor(font: FontChar, fontPos: Rect2d, time?: number) {
    this.newFont(font, fontPos, time);
  }

  newFont(font: FontChar, fontPos: Rect2d, time?: number) {
    this.font = font;
    this.displayTime = time;
    this.timer = this.timer ? this.timer : new Timer();
    this.timer.start();
    this.id = this.id ? this.id : RenderFont.$id++;

    this.shaderEntity = font.shaderEntity.shallowCopy();
    const pos = new ModelPosition();
    pos.centerRect(fontPos);
    pos.rotateOriginRect(fontPos);
    pos.rotateZ(180);
    pos.scaleRect(fontPos);
    this.shaderEntity.model = pos.getModel;
    this.shaderEntity.modelPosition = () => pos.position;
    this.modelPos = pos;
  }
}

class FontManager extends EntityManager {
  metaData: FontMetaData;
  fontBitmap: Texture;
  fonts: { [key: number]: FontChar };
  renderFontPool: RenderFont[];
  renderFontState: { [key: number]: RenderFont };
  avgWidth: number;
  avgHeight: number;
  count: number;

  constructor(metaData: FontMetaData) {
    super();
    this.metaData = metaData;
    this.fonts = {};
    this.renderFontState = {};
    this.renderFontPool = [];
    this.avgWidth = 0;
    this.avgHeight = 0;
    this.count = 0;
  }

  getFont(charCode: number): FontChar {
    return this.fonts[charCode];
  }

  createRender(font: FontChar, fontPos: Rect2d, time?: number): RenderFont {
    let renderFont: RenderFont;
    if (this.renderFontPool.length > 0) {
      renderFont = this.renderFontPool.pop()!;
      renderFont.newFont(font, fontPos, time);
    } else {
      renderFont = new RenderFont(font, fontPos, time);
    }
    this.renderFontState[renderFont.id] = renderFont;
    return renderFont;
  }

  refreshExpired() {
    Object.values(this.renderFontState).forEach((font) => {
      if (font.isExpired()) {
        delete this.renderFontState[font.id];
        this.renderFontPool.push(font);
      }
    });
  }

  update(engineHelper: EngineHelper) {
    this.refreshExpired();
    super.update(engineHelper);
  }

  render(engineHelper: EngineHelper) {
    const fonts = Object.values(this.renderFontState);
    fonts.forEach((r) => r.render(engineHelper));
    this.count = fonts.length;
  }

  init(engineHelper: EngineHelper) {
    const context = this.metaData.context;
    const fonts = context.fonts;
    const defaultRect = new Rect2d(0.5, 0.5, 1.0, 1.0, 1.0);
    let totalWidth = 0.0;
    let totalHeight = 0.0;
    let totalNo = 0;
    for (const fontIdx in fonts) {
      const fontChar = fonts[fontIdx];
      const pos = [
        fontChar.x,
        fontChar.y,
        fontChar.x + fontChar.width,
        fontChar.y + fontChar.height,
      ];
      const uvs = EngineObjectHelper.vertex.planeCW(
        pos,
        context.width,
        context.height
      );
      const vertexModel = engineHelper.createPlaneVertexModel(
        context.filename,
        uvs,
        PlaneType.YX
      );
      const font = new FontChar(fontChar, defaultRect, vertexModel);
      this.fonts[fontChar.charCode] = font;
      this.entities.push(font);

      totalWidth += fontChar.width;
      totalHeight += fontChar.height;
      totalNo += 1;
    }

    this.avgHeight = totalHeight / totalNo;
    this.avgWidth = totalWidth / totalNo;

    super.init(engineHelper);
  }
}

export class FontReference {
  $id: number;
  id?: string;
  _hidden: boolean;
  prevText?: string;
  prevPos: Coordinate;
  pos: Coordinate;
  text: string;
  fontSize: number;
  width: number;
  time?: number;
  $cacheId?: number | string;
  isDirtyPos: boolean;
  isDirtyText: boolean;
  isTop: boolean;
  displayRect: Rect2d;
  render(engineHelper: EngineHelper) {
    engineHelper.writeFont(this);
  }
  static newFont(
    pos: Coordinate,
    cacheId?: number | string,
    time?: number
  ): FontReference {
    const ref = new FontReference();
    ref.displayRect = new Rect2d(0, 0, 0, 0);
    ref.pos = pos;
    ref.time = time;
    ref.$cacheId = cacheId;
    ref.isDirtyPos = false;
    ref.isDirtyText = false;
    return ref;
  }
  setTop(isTop: boolean): FontReference {
    this.isTop = isTop;
    return this;
  }
  translate(dx: number, dy: number): FontReference {
    this.pos.x += dx;
    this.pos.y += dy;
    this.isDirtyPos = true;
    return this;
  }
  center(x: number, y: number): FontReference {
    this.pos.x = x;
    this.pos.y = y;
    this.isDirtyPos = true;
    return this;
  }
  setPosition(position: Coordinate): FontReference {
    this.pos = new Coordinate(position.x, position.y);
    this.isDirtyPos = true;
    return this;
  }
  setWidth(width: number): FontReference {
    this.width = width;
    this.isDirtyPos = true;
    return this;
  }
  setText(text: string): FontReference {
    if (this._hidden) {
      this.prevText = text;
      this.text = "";
    } else {
      this.text = text;
      this.prevText = "";
    }
    this.isDirtyText = true;
    return this;
  }
  setFontSize(fontSize: number): FontReference {
    this.fontSize = fontSize;
    this.isDirtyPos = true;
    return this;
  }
  set hidden(hidden: boolean) {
    if (!this._hidden && hidden) {
      this.prevText = this.text;
      this.text = "";
      this.isDirtyText = true;
    } else if (this._hidden && !hidden) {
      this.text = this.prevText ?? "";
      this.prevText = "";
      this.isDirtyText = true;
    }
    this._hidden = hidden;
  }
}

class Font implements EngineEntity {
  $id: string;
  fontManager: FontManager;
  static MAX_FONT = 1000;
  static DefaultFont: Font;
  warningShown = false;
  fontCache: { [key: string]: RenderFont[] };
  fontCacheId = 1;
  engineHelper: EngineHelper;
  fontRefCache: { [key: string]: FontReference };

  private static readonly pixelDensity = 400.0;

  constructor(metaData: FontMetaData) {
    this.fontManager = new FontManager(metaData);
    this.fontCache = {};
    this.fontRefCache = {};
    if (!Font.DefaultFont) {
      Font.DefaultFont = this;
    }
  }

  event(): boolean | undefined {
    return;
  }
  update(engineHelper: EngineHelper) {
    if (
      engineHelper.notificationQueue.peak(
        RendererNotification.RESIZE_SCREEN.key
      )
    ) {
      Object.values(this.fontRefCache).forEach(this.expireRenderFont);
      Object.values(this.fontRefCache).forEach(
        (font) => (font.isDirtyText = true)
      );
      this.fontManager.refreshExpired();
      Object.values(this.fontRefCache).forEach(this.writeRef);
    }
    this.fontManager.update(engineHelper);
  }

  expireRenderFont = (fontRef: FontReference) => {
    this.fontCache[fontRef.$id].forEach((f) => f.expire());
    this.fontCache[fontRef.$id] = [];
  };

  render(engineHelper: EngineHelper) {
    this.fontManager.render(engineHelper);
  }

  init(engineHelper: EngineHelper) {
    this.fontManager.init(engineHelper);
  }

  writeRef = (fontRef: FontReference): FontReference => {
    if (this.fontManager.count > Font.MAX_FONT) {
      if (!this.warningShown) {
        this.warningShown = true;
        console.warn("Maximum font is being rendered", this.fontManager.count);
      }
    }
    if (!fontRef.fontSize) {
      if (!fontRef.width) {
        if (!this.warningShown) {
          this.warningShown = true;
          console.warn(
            "Either font size or width needs to be set in FontReference"
          );
        }
        return fontRef;
      }
      if (!fontRef.text) {
        if (!this.warningShown) {
          this.warningShown = true;
          console.warn(
            "Font text must be set to calculate font size to fit width"
          );
        }
        return fontRef;
      }
      fontRef.fontSize = this.calculateFontSize(
        fontRef.width,
        fontRef.text.length
      );
    } else if (!fontRef.width) {
      fontRef.width = this.calcTotalTextWidth(fontRef);
    }

    if (fontRef.isDirtyText && fontRef.$id) {
      this.expireRenderFont(fontRef);
    }

    if (!fontRef.$id || fontRef.isDirtyText) {
      if (!fontRef.$id) {
        fontRef.$id = this.fontCacheId++;
      }
      fontRef.isDirtyText = false;
      fontRef.isDirtyPos = false;
      fontRef.prevPos = new Coordinate(fontRef.pos.x, fontRef.pos.y);

      const fonts = this.createFonts(fontRef);
      this.fontCache[fontRef.$id] = fonts;
      this.fontRefCache[fontRef.$id] = fontRef;
    } else if (fontRef.isDirtyPos) {
      const fonts = this.fontCache[fontRef.$id];
      const fontPos = fontRef.pos;
      if (!fontRef.prevPos) {
        fontRef.prevPos = new Coordinate(fontRef.pos.x, fontRef.pos.y);
      }
      const dx = fontRef.prevPos.x - fontPos.x;
      const dy = fontRef.prevPos.y - fontPos.y;
      fonts.forEach((font) => {
        const modelPos = font.modelPos;
        modelPos.translate(-dx, -dy, 0);
        modelPos.rotateOrigin(
          modelPos.position.x,
          modelPos.position.y,
          modelPos.position.z
        );
      });

      fontRef.isDirtyPos = false;
      fontRef.prevPos.x = fontRef.pos.x;
      fontRef.prevPos.y = fontRef.pos.y;
    }
    this.fontCache[fontRef.$id].forEach((font) => {
      font.refresh();
      font.shaderEntity!.isTop = fontRef.isTop;
    });
    return fontRef;
  };

  calcTotalTextWidth(fontRef: FontReference) {
    const text = fontRef.text;
    const fontSize = fontRef.fontSize / Font.pixelDensity;
    let carryWidth = 0;
    for (let charIdx = 0; charIdx < text.length; charIdx++) {
      const charCode = text.charCodeAt(charIdx);
      const font = this.fontManager.getFont(charCode);
      const height = fontSize;
      const fontRatio =
        Math.abs(font.fontChar.height) < 10e-6
          ? 0.0
          : font.fontChar.width / font.fontChar.height;
      const width = height * fontRatio;
      carryWidth += width;
    }
    return carryWidth;
  }

  calculateFontSize(width: number, length: number): number {
    const fontRatio =
      Math.abs(this.fontManager.avgHeight) < 10e-6
        ? 0.0
        : this.fontManager.avgWidth / this.fontManager.avgHeight;
    const widthFactor = 3;
    return ((width / fontRatio) * Font.pixelDensity) / length / widthFactor;
  }

  createFonts(fontRef: FontReference): RenderFont[] {
    const pos = fontRef.pos;
    const time = fontRef.time;
    const text = fontRef.text;
    const fontSize = Font.fontHeight(fontRef.fontSize);
    const totalWidth = this.calcTotalTextWidth(fontRef);
    let maxHeight = 0;
    let carryWidth = -totalWidth / 2.0;
    const fonts: RenderFont[] = [];
    for (let charIdx = 0; charIdx < text.length; charIdx++) {
      const charCode = text.charCodeAt(charIdx);
      const font = this.fontManager.getFont(charCode);
      const fontChar = font.fontChar;
      const height = fontSize;
      maxHeight = Math.max(maxHeight, height);
      const fontRatio =
        Math.abs(fontChar.height) < 10e-6
          ? 0.0
          : fontChar.width / fontChar.height;
      const width = height * fontRatio;
      carryWidth += width;
      const fontPos = new Rect2d(
        pos.x + carryWidth - width / 2.0 - fontChar.xOffset / 2.0,
        pos.y + height / 2.0 - fontChar.yOffset / 2.0,
        width,
        height,
        -1 * pos.z
      );
      const renderFont = this.fontManager.createRender(font, fontPos, time);
      fonts.push(renderFont);
    }

    fontRef.displayRect.x = pos.x;
    fontRef.displayRect.y = pos.y;
    fontRef.displayRect.width = carryWidth;
    fontRef.displayRect.height = maxHeight;

    return fonts;
  }

  static fontHeight(fontSize: number) {
    return fontSize / Font.pixelDensity;
  }
}

export default Font;
