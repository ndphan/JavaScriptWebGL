import { AppSubscription } from "./App";
import Camera from "./Camera";
import NotificationQueue from "./Common/NotificationQueue";
import SubscriberPool from "./Common/SubscriberPool";
import FontMetaData from "./Data/FontMetaData";
import Light from "./Data/Light";
import ModelData from "./Data/ModelData";
import PlaneType from "./Data/PlaneType";
import { ShaderType } from "./Data/RenderOption";
import TextureVertexModel from "./Data/TextureVertexModel";
import EngineObjectHelper from "./EngineEntity/EngineObjectHelper";
import { ShaderEntity } from "./EngineEntity/ShaderEntity";
import Font, { FontReference } from "./Font/Font";
import { RendererNotification, RendererSubscription } from "./Renderer";

export default class EngineHelper {
  notificationQueue: NotificationQueue;
  subscriberPool: SubscriberPool;
  resourcesLoading: Promise<any>[] = [];
  bufferCache: { [key: number]: ModelData } = {};
  fontCache: { [key: number]: { meta: FontMetaData; font: Font } } = {};
  fontNameKeyReverse: { [key: string]: number } = {};
  uvCache: { [key: string]: { source: string; uv: number[] } } = {};
  vertexUVCache: { [key: string]: { source: string; uv: number[] } } = {};
  camera: Camera;
  time: number;
  cacheId: number = 0;
  fps: number;

  constructor(
    notificationQueue: NotificationQueue,
    subscriberPool: SubscriberPool,
    camera: Camera
  ) {
    this.camera = camera;
    this.notificationQueue = notificationQueue;
    this.subscriberPool = subscriberPool;
    subscriberPool.listen(AppSubscription.GET_FPS, fps => (this.fps = fps));
  }

  startIteration() {
    this.subscriberPool.publish(AppSubscription.START_ITERATION);
  }

  render(entity: ShaderEntity) {
    const shaderProgram = entity.opt.shaderType;
    if (
      (shaderProgram === ShaderType.TWO_DIMENSION ||
        shaderProgram === ShaderType.COLOUR) &&
      this.camera.camera2d.isOutOfBound(entity.modelPosition())
    ) {
      return;
    }

    this.notificationQueue.pushPayload(
      RendererNotification.renderEntity(entity, entity.getModel())
    );
  }

  setLighting(light: Light) {
    this.notificationQueue.pushPayload(RendererNotification.setLighting(light));
  }

  createTexture(object: ShaderEntity) {
    this.subscriberPool.publish(
      RendererSubscription.CREATE_TEXTURE,
      RendererSubscription.createTexturePayload(object, this.resourcesLoading)
    );
  }

  getFPS(): number {
    return this.fps;
  }

  getTotalPixelHeight(): number {
    return window.screen.height;
  }

  getTotalPixelWidth(): number {
    return window.screen.width;
  }

  getScreenHeight(): number {
    return this.camera.height;
  }

  getScreenWidth(): number {
    return this.camera.width;
  }

  setTime(time: number) {
    if (time) {
      this.time = time;
    }
  }

  getVerticesById(id: number): number[] {
    if (this.bufferCache[id]) {
      return this.bufferCache[id].vertices;
    } else {
      console.error("Unable to find src in cache", id, this);
      throw new Error("unable to find src in cache");
    }
  }

  updateBufferCache(buffer: ModelData, verticesCacheId: number): number {
    buffer.cacheId = verticesCacheId;
    this.bufferCache[verticesCacheId] = buffer;
    return verticesCacheId;
  }

  addBufferCache(buffer: ModelData): number {
    const cacheId = this.cacheId++;
    this.bufferCache[cacheId] = buffer;
    buffer.cacheId = cacheId;
    return cacheId;
  }

  getResource(src: string): Promise<RetrieveResource> {
    const promise = new Promise<RetrieveResource>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", src);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const cacheId = this.cacheId++;
            resolve({
              data: xhr.responseText,
              engineHelper: this,
              cacheId: cacheId,

              registerBuffer: (obj: ModelData) => {
                this.bufferCache[cacheId] = obj;
              },

              registerFont: (meta: FontMetaData) => {
                const font = new Font(meta);
                this.fontCache[cacheId] = {
                  meta: meta,
                  font: font
                };
                this.fontNameKeyReverse[src] = cacheId;
              }
            });
          } else {
            reject(xhr.responseText);
          }
        }
      };
      xhr.send();
    });
    this.resourcesLoading.push(promise);
    return promise;
  }

  getAllResourcesLoading(): Promise<any> {
    return Promise.all(this.resourcesLoading);
  }

  updateBuffer(object: ShaderEntity) {
    this.updateBufferCache(
      object.vertexModel.createModel(),
      object.vertexModel.vertexBufferId
    );
    const notification = RendererNotification.updateBuffer(
      object,
      this.getBuffer(object)
    );
    this.notificationQueue.pushPayload(notification);
  }

  getBufferModelData(object: ShaderEntity): ModelData {
    return this.bufferCache[object.getVertexBufferId()];
  }

  getBuffer(object: ShaderEntity): number[] {
    const buffer: number[] = this.getBufferModelData(object).vertices;
    if (!buffer) {
      throw new Error("No buffer was found for this entity");
    }
    return buffer;
  }

  registerEntity(object: ShaderEntity) {
    this.subscriberPool.publish(
      RendererSubscription.REGISTER_ENTITY,
      RendererSubscription.registerEntityPayload(
        object,
        this.getBufferModelData(object)
      )
    );
  }

  initFont() {
    for (const fontType in this.fontCache) {
      if (!this.fontCache.hasOwnProperty(fontType)) {
        continue;
      }
      const font = this.fontCache[fontType].font;
      font.init(this);
    }
  }

  renderFont() {
    for (const fontType in this.fontCache) {
      if (!this.fontCache.hasOwnProperty(fontType)) {
        continue;
      }
      const font = this.fontCache[fontType].font;
      font.render(this);
    }
  }

  updateFont() {
    for (const fontType in this.fontCache) {
      if (!this.fontCache.hasOwnProperty(fontType)) {
        continue;
      }
      const font = this.fontCache[fontType].font;
      font.update(this);
    }
  }

  newVertexModel2d(cacheId: string): TextureVertexModel {
    return this.newVertexModel(cacheId, PlaneType.YX);
  }

  newVertexModelUv3d(cacheId: string): TextureVertexModel {
    const cache = this.vertexUVCache[cacheId];
    const vertexModel = new TextureVertexModel().fillRenderUnits(cache.uv);
    vertexModel.textureSource = cache.source;
    return vertexModel;
  }

  createPlaneVertexModel(
    src: string,
    uv: number[],
    plane: PlaneType
  ): TextureVertexModel {
    const vertexModel = new TextureVertexModel().createRenderUnits(4);
    vertexModel.textureSource = src;
    EngineObjectHelper.vertex.plane(vertexModel.renderUnits, plane);
    EngineObjectHelper.vertex.planeUV(vertexModel.renderUnits, uv);
    return vertexModel;
  }

  getUVCache(name: string): number[] {
    return this.uvCache[name].uv;
  }

  addUVCache(source: string, name: string, uv: number[]) {
    this.uvCache[name] = { source: source, uv: uv };
  }

  getVertexUvCache(name: string): number[] {
    return this.vertexUVCache[name].uv;
  }

  newVertexModel(cacheId: string, plane: PlaneType): TextureVertexModel {
    const cache = this.uvCache[cacheId];
    return this.createPlaneVertexModel(cache.source, cache.uv, plane);
  }

  addVertexUvCache(textureSource: string, name: string, vertexUv: number[]) {
    this.vertexUVCache[name] = { source: textureSource, uv: vertexUv };
  }

  writeFont(fontRef: FontReference): FontReference {
    let fontCacheId: number | undefined = undefined;
    if (typeof fontRef.$cacheId === "string") {
      fontCacheId = this.fontNameKeyReverse[fontRef.$cacheId];
    } else if (typeof fontRef.$cacheId === "number") {
      fontCacheId = fontRef.$cacheId;
    } else if (fontRef.$cacheId !== undefined) {
      throw new Error("fontId is not a number or string");
    }
    let font: Font;
    if (fontCacheId === undefined) {
      font = Font.DefaultFont;
    } else {
      font = this.fontCache[fontCacheId].font;
    }
    return font.writeRef(fontRef);
  }

  updateProjectionMatrix() {
    this.notificationQueue.pushPayload(
      RendererNotification.UPDATE_PROJECTION_MATRIX
    );
  }
}

export declare interface RetrieveResource {
  data: string;
  engineHelper: EngineHelper;
  cacheId: number;
  registerBuffer: (obj: ModelData) => void;
  registerFont: (font: FontMetaData) => void;
}
