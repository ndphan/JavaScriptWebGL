import EntityManager from "../../Manager/EntityManager";
import Texture from "../Buffer/Texture";
import Timer from "../Common/Timer";
import Coordinate from "../Data/Coordinate";
import FontMetaData, { FontCharacter } from "../Data/FontMetaData";
import PlaneType from "../Data/PlaneType";
import { default as Rect, default as Rect2d } from "../Data/Rect2d";
import VertexModel from "../Data/VertexModel";
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
    rect: Rect,
    vertexModel: VertexModel,
    src: string
  ) {
    super(rect, vertexModel, src);
    this.fontChar = fontChar;
  }
}

class RenderFont {
  shaderEntity?: ShaderEntity;
  font?: FontChar;
  displayTime?: number;
  timer: Timer;
  id: number;
  static $id: number = 0;

  render(engineHelper: EngineHelper) {
    if (this.shaderEntity) {
      engineHelper.render(this.shaderEntity);
    }
  }

  expire() {
    this.displayTime = -1;
  }

  isExpired() {
    return (
      this.displayTime !== undefined && this.displayTime < this.timer.peak()
    );
  }

  constructor(font: FontChar, fontPos: Rect2d, time?: number) {
    this.newFont(font, fontPos, time);
  }

  newFont(font: FontChar, fontPos: Rect2d, time?: number) {
    this.font = font;
    this.displayTime = time;
    this.timer = new Timer();
    this.timer.start();
    this.id = RenderFont.$id++;

    this.shaderEntity = font.shaderEntity.shallowCopy();
    const pos = new ModelPosition();
    pos.centerRect(fontPos);
    pos.rotateOriginRect(fontPos);
    pos.rotateZ(180);
    pos.scaleRect(fontPos);
    this.shaderEntity.model = pos.getModel;
  }

  reset() {
    this.shaderEntity = undefined;
    this.font = undefined;
    this.displayTime = undefined;
  }
}

class FontManager extends EntityManager {
  metaData: FontMetaData;
  fontBitmap: Texture;
  fonts: { [key: number]: FontChar };
  renderFont: RenderFont[];
  renderFontPool: RenderFont[];

  constructor(metaData: FontMetaData) {
    super();
    this.metaData = metaData;
    this.fonts = {};
    this.renderFont = [];
    this.renderFontPool = [];
  }

  getFont(charCode: number): FontChar {
    return this.fonts[charCode];
  }

  createRender(font: FontChar, fontPos: Rect2d, time?: number): RenderFont {
    let renderFont: RenderFont;
    if (this.renderFontPool.length > 0) {
      renderFont = this.renderFontPool.pop()!;
      renderFont.newFont(font, fontPos, time);
      this.renderFont.push(renderFont);
    } else {
      renderFont = new RenderFont(font, fontPos, time);
      this.renderFont.push(renderFont);
    }
    return renderFont;
  }

  refreshExpired() {
    const activeFont = this.renderFont.filter(r => !r.isExpired());
    const inactiveFont = this.renderFont.filter(r => r.isExpired());
    inactiveFont.forEach(r => r.reset());
    this.renderFontPool.push(...inactiveFont);
    this.renderFont = activeFont;
  }

  render(engineHelper: EngineHelper) {
    const activeFont = this.renderFont.filter(r => !r.isExpired());
    activeFont.forEach(r => r.render(engineHelper));
    const inactiveFont = this.renderFont.filter(r => r.isExpired());
    inactiveFont.forEach(r => r.reset());
    this.renderFontPool.push(...inactiveFont);
    this.renderFont = activeFont;
  }

  init(engineHelper: EngineHelper) {
    const context = this.metaData.context;
    const fonts = context.fonts;
    const defaultRect = new Rect(0.5, 0.5, 1.0, 1.0, 1.0);
    for (const fontIdx in fonts) {
      if (fonts.hasOwnProperty(fontIdx)) {
        const fontChar = fonts[fontIdx];
        const pos = [
          fontChar.x,
          fontChar.y,
          fontChar.x + fontChar.width,
          fontChar.y + fontChar.height
        ];
        const uvs = EngineObjectHelper.vertex.planeCW(
          pos,
          context.width,
          context.height
        );
        const vertexModel = engineHelper.createPlaneVertexModel(
          uvs,
          PlaneType.YX
        );
        const font = new FontChar(
          fontChar,
          defaultRect,
          vertexModel,
          context.filename
        );
        this.fonts[fontChar.charCode] = font;
        this.entities.push(font);
      }
    }

    this.initEntity(engineHelper);
  }
}

export class FontReference {
  $id: number;
  pos: Coordinate;
  text: string;
  fontSize: number;
  time?: number;
  $cacheId?: number | string;
  updateText(text: string): FontReference {
    this.text = text;
    return this;
  }
  static newFont(
    pos: Coordinate,
    text: string,
    fontSize: number,
    time?: number,
    cacheId?: number | string
  ): FontReference {
    const ref = new FontReference();
    ref.pos = pos;
    ref.text = text;
    ref.fontSize = fontSize;
    ref.time = time;
    ref.$cacheId = cacheId;
    return ref;
  }
}

class Font implements EngineEntity {
  $id: string;
  fontManager: FontManager;
  static MAX_FONT: number = 200;
  warningShown: boolean = false;
  fontCache: { [key: string]: RenderFont[] };
  fontCacheId: number = 0;
  engineHelper: EngineHelper;
  fontRefCache: { [key: string]: FontReference };
  static BASE_FONT_SIZE = 24;

  constructor(metaData: FontMetaData) {
    this.fontManager = new FontManager(metaData);
    this.fontCache = {};
    this.fontRefCache = {};
  }

  event(): void {}
  update(engineHelper: EngineHelper) {
    if (
      engineHelper.notificationQueue.peak(
        RendererNotification.RESIZE_SCREEN.key
      )
    ) {
      Object.values(this.fontRefCache).forEach(this.expiryRenderFont);
      this.fontManager.refreshExpired();
      Object.values(this.fontRefCache).forEach(this.writeRef);
    }
  }

  expiryRenderFont = (fontRef: FontReference) => {
    this.fontCache[fontRef.$id].forEach(f => f.expire());
    this.fontCache[fontRef.$id] = [];
  };

  render(engineHelper: EngineHelper) {
    this.fontManager.render(engineHelper);
  }

  init(engineHelper: EngineHelper) {
    this.engineHelper = engineHelper;
    this.fontManager.init(engineHelper);
  }

  writeRef = (fontRef: FontReference): FontReference => {
    if (this.fontManager.renderFont.length > Font.MAX_FONT) {
      if (!this.warningShown) {
        this.warningShown = true;
        console.warn(
          "Maximum font is being rendered",
          this.fontManager.renderFont.length
        );
      }
    }
    const fonts = this.createFonts(fontRef);
    if (!fontRef.$id) {
      fontRef.$id = this.fontCacheId++;
    } else {
      this.expiryRenderFont(fontRef);
    }
    this.fontCache[fontRef.$id] = fonts;
    this.fontRefCache[fontRef.$id] = fontRef;
    return fontRef;
  };

  calcTotalTextWidth(fontRef: FontReference) {
    const text = fontRef.text;
    const screenHeight = this.engineHelper.getTotalPixelHeight();
    const fontSize = fontRef.fontSize / Font.BASE_FONT_SIZE;
    let carryWidth = 0;
    for (let charIdx = 0; charIdx < text.length; charIdx++) {
      const charCode = text.charCodeAt(charIdx);
      const font = this.fontManager.getFont(charCode);
      const height = (font.fontChar.height / screenHeight) * fontSize;
      const fontRatio = font.fontChar.width / font.fontChar.height;
      const width = height * fontRatio;
      carryWidth += width;
    }
    return carryWidth;
  }

  createFonts(fontRef: FontReference): RenderFont[] {
    const pos = fontRef.pos;
    const time = fontRef.time;
    const text = fontRef.text;
    const screenHeight = this.engineHelper.getTotalPixelHeight();
    const fontSize = fontRef.fontSize / Font.BASE_FONT_SIZE / screenHeight;
    const totalWidth = this.calcTotalTextWidth(fontRef);
    let carryWidth = -totalWidth / 2.0;
    const fonts = [];
    for (let charIdx = 0; charIdx < text.length; charIdx++) {
      const charCode = text.charCodeAt(charIdx);
      const font = this.fontManager.getFont(charCode);
      const height = font.fontChar.height * fontSize;
      const fontRatio = font.fontChar.width / font.fontChar.height;
      const width = height * fontRatio;
      carryWidth += width;
      const fontPos = new Rect2d(
        pos.x + carryWidth - width / 2.0,
        pos.y + height / 4.0,
        -1 * pos.z,
        width,
        height
      );
      const renderFont = this.fontManager.createRender(font, fontPos, time);
      fonts.push(renderFont);
    }
    return fonts;
  }
}

export default Font;
