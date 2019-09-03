import BMFontReader from "./BMFontReader";
import BitmapConfigParser from "./BitmapConfigParser";
import EngineHelper from "../Core/EngineHelper";
import VertexParser from "./VertexParser";

class ResourceResolver {
  static bmFontResolver(_: EngineHelper) {
    return (result: any) => {
      result.registerFont(new BMFontReader(result.data));
      return result;
    };
  }

  static bitmapResolver(
    engineHelper: EngineHelper,
    bitmapWidth: number,
    bitmapHeight: number,
    precision: number
  ) {
    return (result: any) => {
      const bitmapLoader = new BitmapConfigParser(
        result.data,
        bitmapWidth,
        bitmapHeight,
        precision
      );
      for (const key in bitmapLoader.getMap()) {
        if (bitmapLoader.map.hasOwnProperty(key)) {
          const uv = bitmapLoader.map[key];
          engineHelper.addUVCache(key, uv);
        }
      }
      return result;
    };
  }

  static objResolver(engineHelper: EngineHelper, name: string) {
    return (result: any) => {
      engineHelper.addVertexUvCache(
        name,
        new VertexParser(result.data).vertices
      );
    };
  }
}
export default ResourceResolver;
