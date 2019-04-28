import Rect from "../Data/Rect2d";
import EngineObjectHelper from "../EngineEntity/EngineObjectHelper";
import EntityManager from "../../Manager/EntityManager";
import PlaneType from "../Data/PlaneType";
import Plane2d from "../../Entity/Plane2d";
import Timer from "../Common/Timer";
import VertexModel from "../Data/VertexModel";
import EngineHelper from "../EngineHelper";
import FontMetaData from "../Data/FontMetaData";
import Texture from "../Buffer/Texture";

class FontChar extends Plane2d {
  show: boolean;
  timer: Timer;

  constructor(rect: Rect, vertexModel: VertexModel, src: string) {
    super(rect, vertexModel, src);
    this.show = false;
    this.timer = new Timer();
  }

  render(engineHelper: EngineHelper) {
    if (this.show) {
      engineHelper.render(this.shaderEntity);
    }
  }
}

class Font extends EntityManager {
  metaData: FontMetaData;
  fontBitmap: Texture;
  fonts: { [key: string]: FontChar };

  constructor(metaData: FontMetaData) {
    super();
    this.metaData = metaData;
    this.fonts = {};
  }

  update(engineHelper: EngineHelper) {
    this.entities.forEach(element => element.update(engineHelper));
  }

  render(engineHelper: EngineHelper) {
    this.entities.forEach(element => element.render(engineHelper));
  }

  init(engineHelper: EngineHelper) {
    const context = this.metaData.context;
    const fonts = context.fonts;
    const defaultRect = new Rect(0, 0, -2.0, 1.0, 1.0);
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
        const font = new FontChar(defaultRect, vertexModel, context.filename);
        this.fonts[fontChar.charCode] = font;
        this.entities.push(font);
      }
    }

    this.initEntity(engineHelper);
  }
}

export default Font;
