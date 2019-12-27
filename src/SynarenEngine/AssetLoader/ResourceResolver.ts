import BMFontReader from "./FntFontReader";
import BitmapConfigParser from "./BitmapConfigParser";
import EngineHelper, { RetrieveResource } from "../Core/EngineHelper";
import VertexParser from "./VertexParser";

class ResourceResolver {
  static bmFontResolver(_: EngineHelper) {
    return (result: RetrieveResource) => {
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
    return (result: RetrieveResource) => {
      const bitmapLoader = new BitmapConfigParser(
        result.data,
        bitmapWidth,
        bitmapHeight,
        precision
      );
      const textureSource = bitmapLoader.getTextureSource();
      for (const key in bitmapLoader.getMap()) {
        if (bitmapLoader.map.hasOwnProperty(key)) {
          const uv = bitmapLoader.map[key];
          engineHelper.addUVCache(textureSource, key, uv);
        }
      }
      return result;
    };
  }

  static objResolverMultiple(
    engineHelper: EngineHelper,
    sources: { textureSource: string; name: string }[]
  ) {
    return (result: RetrieveResource) => {
      sources.map(({ textureSource, name }) =>
        engineHelper.addVertexUvCache(
          textureSource,
          name,
          new VertexParser(result.data).vertices
        )
      );
    };
  }

  static objResolver(
    engineHelper: EngineHelper,
    textureSource: string,
    name: string
  ) {
    return (result: RetrieveResource) => {
      engineHelper.addVertexUvCache(
        textureSource,
        name,
        new VertexParser(result.data).vertices
      );
    };
  }
}
export default ResourceResolver;
