import RenderOption, { ShaderType, RenderType } from "./Data/RenderOption";
import Entity3DProgram from "./WebGL/EntityProgram/Entity3DProgram";
import EntityColourProgram from "./WebGL/EntityProgram/EntityColorProgram";
import WebGLContext from "./WebGL/Base/WebGLContext";
import Texture from "./Buffer/Texture";
import NotificationQueue, {
  Notification,
  NotificationPayload,
} from "./Common/NotificationQueue";
import WorldDelegate from "./WorldDelegate";
import Camera from "./Camera";
import { ShaderEntity } from "./EngineEntity/ShaderEntity";
import EngineHelper from "./EngineHelper";
import Light from "./Data/Light";
import { WebGLContainer } from "./App";
import SubscriberPool, { Subscription } from "./Common/SubscriberPool";
import ModelData from "./Data/ModelData";

export class RendererSubscription {
  static CREATE_TEXTURE: Subscription = new Subscription(
    "Renderer#CreateTexture"
  );
  static REGISTER_ENTITY: Subscription = new Subscription(
    "Renderer#RegisterEntity"
  );
  static createTexturePayload = (
    object: ShaderEntity,
    resourcesLoading: Promise<any>[]
  ) => [object, resourcesLoading];
  static registerEntityPayload = (entity: ShaderEntity, buffer: ModelData) => [
    entity,
    buffer,
  ];
}

export class RendererNotification {
  static NOTIFICATION_PRE_RENDER_KEY = "Renderer#Prerender";
  static NOTIFICATION_RENDER_KEY = "Renderer#Render";
  static NOTIFICATION_INIT_KEY = "Renderer#Init";
  static UPDATE_PROJECTION_MATRIX: Notification = new Notification(
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY,
    "UPDATE_PROJECTION_MATRIX"
  );
  static RESIZE_SCREEN: Notification = new Notification(
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY,
    "RESIZE_SCREEN"
  );
  static CREATE_TEXTURE: Notification = new Notification(
    RendererNotification.NOTIFICATION_INIT_KEY,
    "CREATE_TEXTURE"
  );
  static REGISTER_ENTITY: Notification = new Notification(
    RendererNotification.NOTIFICATION_INIT_KEY,
    "REGISTER_ENTITY"
  );
  static registerEntity = (entity: ShaderEntity, modelData: ModelData) =>
    NotificationPayload.from(RendererNotification.REGISTER_ENTITY, [
      entity,
      modelData,
    ]);
  static UPDATE_BUFFER: Notification = new Notification(
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY,
    "UPDATE_BUFFER"
  );
  static updateBuffer = (entity: ShaderEntity, buffer: number[]) =>
    NotificationPayload.from(RendererNotification.UPDATE_BUFFER, [
      entity,
      buffer,
    ]);
  static createTexture = (
    object: ShaderEntity,
    resourcesLoading: Promise<any>[]
  ) =>
    NotificationPayload.from(RendererNotification.CREATE_TEXTURE, [
      object,
      resourcesLoading,
    ]);

  static SET_LIGHTING: Notification = new Notification(
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY,
    "SET_LIGHTING"
  );
  static setLighting = (light: Light) =>
    NotificationPayload.from(RendererNotification.SET_LIGHTING, [light]);

  static RENDER_ENTITY: Notification = new Notification(
    RendererNotification.NOTIFICATION_RENDER_KEY,
    "RENDER_ENTITY"
  );
  static renderEntity = (entity: ShaderEntity, model: Float32List) =>
    NotificationPayload.from(RendererNotification.RENDER_ENTITY, [
      entity,
      model,
    ]);
}

class Renderer {
  webGLContainer: WebGLContainer;
  ctx: WebGLRenderingContext;
  shader3DProgram: Entity3DProgram;
  shaderColourProgram: EntityColourProgram;
  textureReg: { [key: string]: any } = {};
  world: WorldDelegate;
  camera: Camera;
  _renderEntities: { [key: number]: [ShaderEntity, Float32List][] } = {};
  notificationQueue: NotificationQueue;
  subscriberPool: SubscriberPool;
  glContext: WebGLContext;
  cachedModelData: { [key: number]: number } = {};
  private enableLighting: boolean;

  constructor(
    args: { [key: string]: any },
    webGLContainer: WebGLContainer,
    camera: Camera,
    notificationQueue: NotificationQueue,
    subscriberPool: SubscriberPool
  ) {
    if (!args.world) {
      throw new Error("world not defined");
    }
    this.notificationQueue = notificationQueue;
    this.subscriberPool = subscriberPool;
    this.camera = camera;
    this.world = args.world;
    this.webGLContainer = webGLContainer;
    this.ctx = this.webGLContainer.getCtx();
    this.glContext = new WebGLContext(this.ctx);
    this.glContext.setupDefault();
    this.enableLighting = args.enableLighting !== undefined ? args.enableLighting : true;

    this.subscriberPool.listen(RendererSubscription.CREATE_TEXTURE, (data) => {
      const [object, resourcesLoading] = data;
      this.createTexture(object, resourcesLoading);
    });
    this.subscriberPool.listen(RendererSubscription.REGISTER_ENTITY, (data) => {
      const [entity, buffer] = data;
      this.registerEntity(entity, buffer);
    });
  }

  resizeViewPort = () => {
    this.glContext.resizeViewPort(this.webGLContainer.canvas);
  };

  updatePerspective = () => {
    if (this.camera.renderMode === '3d') {
      if (this.shader3DProgram) {
        this.shader3DProgram.updatePerspective(this.camera.camera3d.frustum);
      }
      if (this.shaderColourProgram) {
        this.shaderColourProgram.updatePerspective(this.camera.camera3d.frustum);
      }
    } else {
      if (this.shader3DProgram) {
        this.shader3DProgram.updatePerspective(this.camera.camera2d.frustum);
      }
      if (this.shaderColourProgram) {
        this.shaderColourProgram.updatePerspective(this.camera.camera2d.frustum);
      }
    }
  };

  delete = () => {
    Object.values(this.textureReg).forEach((texReg: any) => {
      const texture = texReg.texture;
      if (texture.texture) {
        this.glContext.deleteTexture(texture.texture);
      }
      texture.texture = undefined;
      texture.texUnit = undefined;
    });
    Texture.textureCount = 0;

    if (this.shader3DProgram) {
      this.shader3DProgram.delete();
    }
    if (this.shaderColourProgram) {
      this.shaderColourProgram.delete();
    }
    this.glContext.destroyWebGL();
  };

  setLighting = (light: Light) => {
    if (this.shader3DProgram) {
      const activeCamera = this.camera.renderMode === '3d' ? this.camera.camera3d : this.camera.camera2d;
      this.shader3DProgram.setLight(light, activeCamera);
    } else {
      throw new Error("Lighting is set without any 3D entities");
    }
  };

  updateBuffer = (entity: ShaderEntity, buffer: number[]) => {
    const opt = entity.getOpt();
    const program = this._getProgramOpt(opt);
    program.updateBuffer(entity, buffer);
  };

  _isPlain(opt: RenderOption) {
    return opt.renderType === RenderType.PLAIN;
  }

  _getProgram3D = (opt: RenderOption) => {
    let program;
    if (this._isPlain(opt)) {
      throw new Error("Plain no longer supported");
    } else {
      program = this.shader3DProgram;
    }
    return program;
  };

  _getProgramOpt = (opt: RenderOption) => {
    let program;
    if (ShaderType.COLOUR === opt.shaderType) {
      program = this.shaderColourProgram;
    } else if (
      ShaderType.THREE_DIMENSION === opt.shaderType ||
      ShaderType.TWO_DIMENSION === opt.shaderType
    ) {
      program = this._getProgram3D(opt);
    } else {
      throw new Error("unsupported opt shader type");
    }
    return program;
  };

  _defRenderTop(isTop: boolean) {
    // render colour
    const colourModel = this._renderEntities[ShaderType.COLOUR].filter(
      (e) => !!e[0].isTop === isTop
    );
    if (colourModel.length > 0) {
      if (this.camera.renderMode === '3d') {
        this.shaderColourProgram.updatePerspective(this.camera.camera2d.frustum);
      }
      this.shaderColourProgram.render(colourModel, this.camera.camera2d);
    }

    const model3d = this._renderEntities[ShaderType.THREE_DIMENSION].filter(
      (e) => !!e[0].isTop === isTop
    );
    if (model3d.length > 0) {
      if (this.camera.renderMode === '3d') {
        this.shader3DProgram.updatePerspective(this.camera.camera3d.frustum);
      }
      this.shader3DProgram.render3DShadowMap(model3d, this.resizeViewPort);
      this.shader3DProgram.render(
        model3d,
        this.camera.camera3d,
        this.textureReg,
        false
      );
    }

    const model2d = this._renderEntities[ShaderType.TWO_DIMENSION].filter(
      (e) => !!e[0].isTop === isTop
    );
    if (model2d.length > 0) {
      if (this.camera.renderMode === '3d') {
        this.shader3DProgram.updatePerspective(this.camera.camera2d.frustum);
      }
      this.shader3DProgram.render(
        model2d,
        this.camera.camera2d,
        this.textureReg,
        true
      );
    }
  }

  _defRender = () => {
    this._defRenderTop(false);
    this._defRenderTop(true);
  };

  init() {
    this.readMessages(RendererNotification.NOTIFICATION_INIT_KEY);
    this.shader3DProgram?.toggleLighting(this.enableLighting);
  }

  readMessages(key: string, isUniqueAction = false) {
    let message: NotificationPayload | undefined;
    const unique: { [key: string]: boolean | undefined } = {};
    while ((message = this.notificationQueue.take(key))) {
      if (!isUniqueAction || unique[message.action] === undefined) {
        this.handleNotification(message);
        if (isUniqueAction) {
          unique[message.action] = true;
        }
      }
    }
  }

  _render = (entity: ShaderEntity, model: Float32List) => {
    if (entity.hidden) {
      return;
    }

    const opt = entity.getOpt();
    const payload: [ShaderEntity, Float32List] = [entity, model];
    if (ShaderType.COLOUR === opt.shaderType) {
      this._renderEntities[ShaderType.COLOUR].push(payload);
    } else if (ShaderType.THREE_DIMENSION === opt.shaderType) {
      this._renderEntities[ShaderType.THREE_DIMENSION].push(payload);
    } else if (ShaderType.TWO_DIMENSION === opt.shaderType) {
      this._renderEntities[ShaderType.TWO_DIMENSION].push(payload);
    }
  };

  bindBuffer = () => {
    if (this.shader3DProgram) {
      this.shader3DProgram.bindBuffer();
    }
    if (this.shaderColourProgram) {
      this.shaderColourProgram.bindBuffer();
    }
  };

  _lazyLoadProgram(opt: RenderOption) {
    if (ShaderType.COLOUR === opt.shaderType) {
      if (!this.shaderColourProgram) {
        this.shaderColourProgram = new EntityColourProgram(this.ctx);
      }
    } else if (
      ShaderType.THREE_DIMENSION === opt.shaderType ||
      ShaderType.TWO_DIMENSION === opt.shaderType
    ) {
      if (!this.shader3DProgram) {
        this.shader3DProgram = new Entity3DProgram(this.ctx);
      }
    } else {
      console.error(this, opt);
      throw new Error("unsupported opt shader type");
    }

    this.updatePerspective();
  }

  registerEntity(object: ShaderEntity, modelData: ModelData) {
    const opt = object.getOpt();
    this._lazyLoadProgram(opt);
    const program = this._getProgramOpt(opt);
    if (!this.cachedModelData[modelData.$id]) {
      program.registerEntity(object, modelData.vertices);
      this.cachedModelData[modelData.$id] = object.rendererBufferId!;
    } else {
      object.rendererBufferId = this.cachedModelData[modelData.$id];
    }
  }

  _resetDefferred = () => {
    this._renderEntities = {
      [ShaderType.COLOUR]: [],
      [ShaderType.THREE_DIMENSION]: [],
      [ShaderType.TWO_DIMENSION]: [],
    };
  };

  handleNotification = (notification: NotificationPayload) => {
    let updatePerspective = false;
    switch (notification.action) {
      case RendererNotification.RENDER_ENTITY.action:
        this._render(notification.data[0], notification.data[1]);
        break;
      case RendererNotification.UPDATE_PROJECTION_MATRIX.action:
        updatePerspective = true;
        break;
      case RendererNotification.RESIZE_SCREEN.action:
        this.resizeViewPort();
        updatePerspective = true;
        break;
      case RendererNotification.CREATE_TEXTURE.action:
        this.createTexture(notification.data[0], notification.data[1]);
        break;
      case RendererNotification.UPDATE_BUFFER.action:
        this.updateBuffer(notification.data[0], notification.data[1]);
        break;
      case RendererNotification.REGISTER_ENTITY.action:
        this.registerEntity(notification.data[0], notification.data[1]);
        break;
      case RendererNotification.SET_LIGHTING.action:
        this.setLighting(notification.data[0]);
        break;
      default:
        console.error("unhandled notification: ", notification);
        break;
    }
    if (updatePerspective) {
      this.updatePerspective();
    }
  };

  render(time: number, engineHelper: EngineHelper) {
    this.glContext.clear();

    this.readMessages(RendererNotification.NOTIFICATION_PRE_RENDER_KEY, true);

    this.camera.commitProjectionView();

    engineHelper.setTime(time);

    // reinitialse next cycle
    this._resetDefferred();

    this.world.render();
    engineHelper.renderFont();

    this.readMessages(RendererNotification.NOTIFICATION_RENDER_KEY);

    this._defRender();
  }

  createTexture(object: ShaderEntity, resourcesLoading: Promise<any>[]) {
    const src = object.getTextureSource();
    if (src === undefined) {
      console.error("src is undefined when trying to create texture", object);
      throw new Error("src is undefined when trying to create texture");
    }
    object.rendererTextureRef = src;
    const textureReg = this.textureReg[src];
    if (!textureReg) {
      const texture = new Texture(src, this.ctx);
      this.textureReg[src] = {
        texture: texture,
      };
      resourcesLoading.push(texture.load);
    } else if (textureReg.texture && textureReg.texture.error) {
      console.error(
        "there was an error while trying to load texture",
        textureReg
      );
      throw new Error("there was an error while trying to load texture");
    }
  }
}
export default Renderer;
