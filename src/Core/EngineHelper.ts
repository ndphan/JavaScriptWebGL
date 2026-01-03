import { vec3 } from "gl-matrix";
import { ModelPosition } from "..";
import { AppSubscription } from "./App";
import Camera from "./Camera";
import NotificationQueue from "./Common/NotificationQueue";
import SubscriberPool from "./Common/SubscriberPool";
import FontMetaData from "./Data/FontMetaData";
import Light from "./Data/Light";
import ModelData from "./Data/ModelData";
import PlaneType from "./Data/PlaneType";
import Rect3d from "./Data/Rect3d";
import { ShaderType } from "./Data/RenderOption";
import TextureVertexModel from "./Data/TextureVertexModel";
import EngineObject from "./EngineEntity/EngineObject";
import EngineObjectHelper from "./EngineEntity/EngineObjectHelper";
import Position from "./EngineEntity/Position";
import { ShaderEntity } from "./EngineEntity/ShaderEntity";
import { EngineEvent } from "./Events";
import Font, { FontReference } from "./Font/Font";
import { CollisionDetection } from "./Physics/CollisionDetection";
import { RendererNotification, RendererSubscription } from "./Renderer";

export default class EngineHelper {
  notificationQueue: NotificationQueue;
  subscriberPool: SubscriberPool;
  resourcesLoading: Promise<RetrieveResource>[] = [];
  bufferCache: { [key: number]: ModelData } = {};
  fontCache: { [key: number]: { meta: FontMetaData; font: Font } } = {};
  fontNameKeyReverse: { [key: string]: number } = {};
  uvCache: { [key: string]: { source: string; uv: number[] } } = {};
  vertexUVCache: { [key: string]: { source: string; uv: number[] } } = {};
  camera: Camera;
  time: number;
  cacheId = 0;
  fps: number;

  constructor(
    notificationQueue: NotificationQueue,
    subscriberPool: SubscriberPool,
    camera: Camera
  ) {
    this.camera = camera;
    this.notificationQueue = notificationQueue;
    this.subscriberPool = subscriberPool;
    subscriberPool.listen(AppSubscription.GET_FPS, (fps) => (this.fps = fps));
  }

  startIteration() {
    this.subscriberPool.publish(AppSubscription.START_ITERATION);
  }

  render(entity: ShaderEntity) {
    const shaderProgram = entity.opt.shaderType;
    if (
      this.camera.renderMode === "2d" &&
      (shaderProgram === ShaderType.TWO_DIMENSION ||
        shaderProgram === ShaderType.COLOUR) &&
      this.camera.camera2d.isOutOfBound(entity.modelPosition())
    ) {
      return;
    }

    let model = entity.getModel();
    if (entity.clone) {
      model = model.slice(0);
    }

    if (
      this.camera.renderMode === "3d" &&
      shaderProgram === ShaderType.THREE_DIMENSION
    ) {
      this.renderWithCulling(entity, model);
      return;
    }

    this.notificationQueue.pushPayload(
      RendererNotification.renderEntity(entity, model)
    );
  }

  renderCopy(entity: EngineObject, pos: ModelPosition) {
    this.render(entity.shaderEntity.renderCopy(pos));
  }

  /**
   * Distance-based culling - objects beyond a certain distance are not rendered
   * @param entity The engine object to test
   * @param cameraPosition Camera position
   * @param maxDistance Maximum rendering distance
   * @return true if the object should be rendered
   */
  isEntityWithinDistance(
    entity: EngineObject,
    cameraPosition: vec3,
    maxDistance: number
  ): boolean {
    if (!entity || !entity.position) {
      return true;
    }

    const entityPos = vec3.fromValues(
      entity.position.x || 0,
      entity.position.y || 0,
      entity.position.z || 0
    );

    const distance = vec3.distance(cameraPosition, entityPos);
    return distance <= maxDistance;
  }

  /**
   * Render an EngineObject with frustum and distance culling
   * @param entity The EngineObject to render
   * @return true if the entity was rendered, false if culled
   */
  renderWithCulling(entity: ShaderEntity, model: Float32List): boolean {
    if (!entity) {
      return false;
    }

    const entityPosition = entity.modelPosition();

    const entitySize = Math.max(
      entityPosition.width || 1,
      entityPosition.height || 1,
      entityPosition.length || 1
    );

    // If entity is very large (> 100 units), likely a sky/background object - always render
    if (entitySize > 100) {
      this.notificationQueue.pushPayload(
        RendererNotification.renderEntity(entity, model)
      );
      return true;
    }

    const camera3d = this.camera.camera3d;

    const cameraPos = vec3.fromValues(
      camera3d.position.x || 0,
      camera3d.position.y || 0,
      camera3d.position.z || 0
    );

    const entityPos3d = vec3.fromValues(
      entityPosition.x || 0,
      entityPosition.y || 0,
      entityPosition.z || 0
    );

    const yawRad = camera3d.degreesToRadians(camera3d.position.ay);
    const pitchRad = camera3d.degreesToRadians(camera3d.position.ax);

    const cameraForward = vec3.fromValues(
      Math.sin(yawRad) * Math.cos(pitchRad),
      -Math.sin(pitchRad),
      -Math.cos(yawRad) * Math.cos(pitchRad)
    );
    vec3.normalize(cameraForward, cameraForward);

    const toEntity = vec3.create();
    vec3.subtract(toEntity, entityPos3d, cameraPos);
    const distance = vec3.length(toEntity);

    if (distance < camera3d.near) {
      this.notificationQueue.pushPayload(
        RendererNotification.renderEntity(entity, model)
      );
      return true;
    }

    if (distance > camera3d.far) {
      return false;
    }

    vec3.normalize(toEntity, toEntity);

    const dot = vec3.dot(cameraForward, toEntity);

    if (dot <= 0) {
      return false;
    }

    const angle = Math.acos(Math.max(0, Math.min(1, dot)));

    const fov = camera3d.fov;
    const fovRadians = (fov * Math.PI) / 180;
    const halfFov = fovRadians / 2;

    const angularSize = Math.atan(entitySize / Math.max(distance, 1));
    const padding = angularSize + 0.3;

    const effectiveHalfFov = halfFov + padding;

    if (angle > effectiveHalfFov) {
      return false;
    }

    this.notificationQueue.pushPayload(
      RendererNotification.renderEntity(entity, model)
    );
    return true;
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

  getTime() {
    return this.time;
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
      console.log(`Loading resource ${src}`);
      xhr.open("GET", src);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // handle file:// loading with status 0
          if (xhr.status === 200 || xhr.status === 0) {
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
                  font: font,
                };
                this.fontNameKeyReverse[src] = cacheId;
              },
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

  getAllResourcesLoading(): Promise<RetrieveResource[]> {
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
      if (!Object.prototype.hasOwnProperty.call(this.fontCache, fontType)) {
        continue;
      }
      const font = this.fontCache[fontType].font;
      font.init(this);
    }
  }

  renderFont() {
    for (const fontType in this.fontCache) {
      if (!Object.prototype.hasOwnProperty.call(this.fontCache, fontType)) {
        continue;
      }
      const font = this.fontCache[fontType].font;
      font.render(this);
    }
  }

  updateFont() {
    for (const fontType in this.fontCache) {
      if (!Object.prototype.hasOwnProperty.call(this.fontCache, fontType)) {
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
    if (!cache) {
      const cache = this.uvCache["missing"];
      console.warn(
        `texture ${cacheId} has not been loaded - loading default texture`
      );
      return this.createPlaneVertexModel(cache.source, cache.uv, plane);
    }
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

  isClickedObject(event: EngineEvent, object: EngineObject) {
    return this.isClicked(event, object.getRect2());
  }

  isClicked(event: EngineEvent, rect: Rect3d) {
    const distance = this.camera.camera2d.distanceEvent(event);
    return CollisionDetection.isPointInRect(rect, distance);
  }

  rotate(event: EngineEvent, rect: Position) {
    const { x, y } = this.camera.camera2d.position;
    return CollisionDetection.rotate(x + event.x, y + event.y, rect);
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
