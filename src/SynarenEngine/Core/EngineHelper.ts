import Font from "./Font/Font";
import { RendererNotification, RendererSubscription } from "./Renderer";
import VertexModel from "./Data/VertexModel";
import EngineObjectHelper from "./EngineEntity/EngineObjectHelper";
import ModelData from "./Data/ModelData";
import FontMetaData from "./Data/FontMetaData";
import Camera from "./Camera";
import NotificationQueue from "./Common/NotificationQueue";
import { ShaderEntity } from "./EngineEntity/ShaderEntity";
import Light from "./Data/Light";
import PlaneType from "./Data/PlaneType";
import SubscriberPool from "./Common/SubscriberPool";
import { AppSubscription } from "./App";

export default class EngineHelper {
  notificationQueue: NotificationQueue;
  subscriberPool: SubscriberPool;

  resourcesLoading: Promise<any>[] = [];
  bufferCache: { [key: number]: ModelData } = {};
  fontCache: { [key: string]: { meta: FontMetaData; font: Font } } = {};
  uvCache: { [key: string]: number[] } = {};
  vertexUVCache: { [key: string]: number[] } = {};
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
    this.notificationQueue.pushPayload(
      RendererNotification.renderEntity(entity)
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

  zoomIn() {
    this.camera.zoomIn();
    this.notificationQueue.push(RendererNotification.UPDATE_PROJECTION_MATRIX);
  }

  zoomOut() {
    this.camera.zoomOut();
    this.notificationQueue.push(RendererNotification.UPDATE_PROJECTION_MATRIX);
  }

  getAspect(): number {
    return this.camera.aspect;
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

  createPlaneVertexModelCacheId(
    cacheId: string,
    plane: PlaneType
  ): VertexModel {
    const uv = this.getUVCache(cacheId);
    const vertexModel = new VertexModel().createRenderUnits(4);
    EngineObjectHelper.vertex.plane(vertexModel.renderUnits, plane);
    EngineObjectHelper.vertex.planeUV(vertexModel.renderUnits, uv);
    return vertexModel;
  }

  createPlaneVertexModel(uv: number[], plane: PlaneType): VertexModel {
    const vertexModel = new VertexModel().createRenderUnits(4);
    EngineObjectHelper.vertex.plane(vertexModel.renderUnits, plane);
    EngineObjectHelper.vertex.planeUV(vertexModel.renderUnits, uv);
    return vertexModel;
  }

  getUVCache(name: string) {
    return this.uvCache[name];
  }

  addUVCache(name: string, uv: number[]) {
    this.uvCache[name] = uv;
  }

  getVertexUvCache(name: string) {
    return this.vertexUVCache[name];
  }

  addVertexUvCache(name: string, vertexUv: number[]) {
    this.vertexUVCache[name] = vertexUv;
  }
}

export declare interface RetrieveResource {
  data: string;
  engineHelper: EngineHelper;
  cacheId: number;
  registerBuffer: (obj: ModelData) => void;
  registerFont: (font: FontMetaData) => void;
}
