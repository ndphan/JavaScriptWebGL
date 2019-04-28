import RenderOption, { ShaderType, RenderType } from "./Data/RenderOption";
import Entity3DProgram from "./WebGL/EntityProgram/Entity3DProgram";
import EntityBasicProgram from "./WebGL/EntityProgram/EntityBasicProgram";
import Entity2DProgram from "./WebGL/EntityProgram/Entity2DProgram";
import EntityColourProgram from "./WebGL/EntityProgram/EntityColorProgram";
import WebGLContext from "./WebGL/Base/WebGLContext";
import Texture from "./Buffer/Texture";
import NotificationQueue, {
  Notification,
  NotificationPayload
} from "./Common/NotificationQueue";
import WorldDelegate from "./WorldDelegate";
import Camera from "./Camera";
import { ShaderEntity } from "./EngineEntity/ShaderEntity";
import EngineHelper from "./EngineHelper";
import Light from "./Data/Light";
import { WebGLContainer } from "./App";

function unique(list: any[], key: string) {
  if (!list || list.length === 0) {
    return [];
  }
  const set: { [key: string]: boolean } = {};
  return list.filter(element => {
    return !set[element[key]] && (set[element[key]] = true);
  });
}

function values(object: any) {
  return Object.keys(object)
    .filter(k => object.hasOwnProperty(k))
    .map(k => object[k]);
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
  static registerEntityNotification = (
    entity: ShaderEntity,
    buffer: number[]
  ) =>
    NotificationPayload.from(RendererNotification.REGISTER_ENTITY, [
      entity,
      buffer
    ]);
  static UPDATE_BUFFER: Notification = new Notification(
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY,
    "UPDATE_BUFFER"
  );
  static updateBufferNotification = (entity: ShaderEntity, buffer: number[]) =>
    NotificationPayload.from(RendererNotification.UPDATE_BUFFER, [
      entity,
      buffer
    ]);
  static createTextureNotification = (
    object: ShaderEntity,
    resourcesLoading: Promise<any>[]
  ) =>
    NotificationPayload.from(RendererNotification.CREATE_TEXTURE, [
      object,
      resourcesLoading
    ]);

  static SET_LIGHTING: Notification = new Notification(
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY,
    "SET_LIGHTING"
  );
  static setLightingNotification = (light: Light) =>
    NotificationPayload.from(RendererNotification.SET_LIGHTING, [light]);

  static RENDER_ENTITY: Notification = new Notification(
    RendererNotification.NOTIFICATION_RENDER_KEY,
    "RENDER_ENTITY"
  );
  static renderEntity = (entity: ShaderEntity) =>
    NotificationPayload.from(RendererNotification.RENDER_ENTITY, [entity]);
}

class Renderer {
  webGLContainer: WebGLContainer;
  ctx: WebGLRenderingContext;
  shader2DProgram: Entity2DProgram;
  shader3DProgram: Entity3DProgram;
  shaderColourProgram: EntityColourProgram;
  shaderBasicProgram: EntityBasicProgram;
  textureReg: { [key: string]: any } = {};
  world: WorldDelegate;
  camera: Camera;
  _defRenderEntites: { [key: number]: any } = {};
  notificationQueue: NotificationQueue;
  glContext: WebGLContext;

  constructor(
    args: { [key: string]: any },
    webGLContainer: WebGLContainer,
    camera: Camera,
    notificationQueue: NotificationQueue
  ) {
    if (!args.world) {
      throw new Error("world not defined");
    }
    this.notificationQueue = notificationQueue;
    this.camera = camera;
    this.world = args.world;
    this.webGLContainer = webGLContainer;
    this.ctx = this.webGLContainer.getCtx();
    this.glContext = new WebGLContext(this.ctx);
    this.glContext.setupDefault();
  }

  resizeViewPort = () => {
    this.glContext.resizeViewPort(this.webGLContainer.canvas);
  };

  updatePerspective = () => {
    if (this.shader3DProgram) {
      this.shader3DProgram.updatePerspective(this.camera.frustum);
    }
    if (this.shaderBasicProgram) {
      this.shaderBasicProgram.updatePerspective(this.camera.frustum);
    }
  };

  delete = () => {
    values(this.textureReg).forEach((texReg: any) => {
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
    if (this.shaderBasicProgram) {
      this.shaderBasicProgram.delete();
    }
    if (this.shader2DProgram) {
      this.shader2DProgram.delete();
    }
    if (this.shaderColourProgram) {
      this.shaderColourProgram.delete();
    }
    this.glContext.destroyWebGL();
  };

  setLighting = (light: Light) => {
    if (this.shader3DProgram) {
      this.shader3DProgram.setLight(light, this.camera);
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
      program = this.shaderBasicProgram;
    } else {
      program = this.shader3DProgram;
    }
    return program;
  };

  _getProgramOpt = (opt: RenderOption) => {
    let program;
    if (ShaderType.COLOUR === opt.shaderType) {
      program = this.shaderColourProgram;
    } else if (ShaderType.THREE_DIMENSION === opt.shaderType) {
      program = this._getProgram3D(opt);
    } else if (ShaderType.TWO_DIMENSION === opt.shaderType) {
      program = this.shader2DProgram;
    } else {
      throw new Error("unsupported opt shader type");
    }
    return program;
  };

  _defRender = () => {
    const entites3DFull = this._defRenderEntites[ShaderType.THREE_DIMENSION]
      .full;
    if (entites3DFull.length > 0) {
      this.shader3DProgram.render3DShadowMap(
        entites3DFull,
        this.resizeViewPort
      );
      this.shader3DProgram.render(entites3DFull, this.camera, this.textureReg);
    }
    // render 3D basic
    const entites3DPlain = this._defRenderEntites[ShaderType.THREE_DIMENSION]
      .plain;
    if (entites3DPlain.length > 0) {
      this.shaderBasicProgram.render(
        entites3DPlain,
        this.camera,
        this.textureReg
      );
    }
    // render colour
    const colourEntites = this._defRenderEntites[ShaderType.COLOUR];
    if (colourEntites.length > 0) {
      this.shaderColourProgram.render(colourEntites);
    }
    // render 2D
    const entities2D = this._defRenderEntites[ShaderType.TWO_DIMENSION];
    if (entities2D.length > 0) {
      this.shader2DProgram.render(entities2D, this.textureReg);
    }
  };

  init() {
    this.notificationQueue
      .take(RendererNotification.NOTIFICATION_INIT_KEY)
      .forEach(this.handleNotification);
  }

  _render = (entity: ShaderEntity) => {
    const opt = entity.getOpt();
    if (ShaderType.COLOUR === opt.shaderType) {
      this._defRenderEntites[ShaderType.COLOUR].push(entity);
    } else if (ShaderType.THREE_DIMENSION === opt.shaderType) {
      if (this._isPlain(opt)) {
        this._defRenderEntites[ShaderType.THREE_DIMENSION].plain.push(entity);
      } else {
        this._defRenderEntites[ShaderType.THREE_DIMENSION].full.push(entity);
      }
    } else if (ShaderType.TWO_DIMENSION === opt.shaderType) {
      this._defRenderEntites[ShaderType.TWO_DIMENSION].push(entity);
    }
  };

  bindBuffer = () => {
    if (this.shader2DProgram) {
      this.shader2DProgram.bindBuffer();
    }
    if (this.shaderColourProgram) {
      this.shaderColourProgram.bindBuffer();
    }
    if (this.shader3DProgram) {
      this.shader3DProgram.bindBuffer();
    }
    if (this.shaderBasicProgram) {
      this.shaderBasicProgram.bindBuffer();
    }
  };

  _lazyLoadProgram(opt: RenderOption) {
    if (ShaderType.COLOUR === opt.shaderType) {
      if (!this.shaderColourProgram) {
        this.shaderColourProgram = new EntityColourProgram(this.ctx);
      }
    } else if (ShaderType.THREE_DIMENSION === opt.shaderType) {
      if (this._isPlain(opt) && !this.shaderBasicProgram) {
        this.shaderBasicProgram = new EntityBasicProgram(this.ctx);
      } else if (!this.shader3DProgram) {
        this.shader3DProgram = new Entity3DProgram(this.ctx);
      }
      this.updatePerspective();
    } else if (ShaderType.TWO_DIMENSION === opt.shaderType) {
      if (!this.shader2DProgram) {
        this.shader2DProgram = new Entity2DProgram(this.ctx);
      }
    } else {
      console.error(this, opt);
      throw new Error("unsupported opt shader type");
    }
  }

  registerEntity(object: ShaderEntity, buffer: number[]) {
    const opt = object.getOpt();
    this._lazyLoadProgram(opt);
    const program = this._getProgramOpt(opt);
    program.registerEntity(object, buffer);
  }

  _resetDefferred = () => {
    this._defRenderEntites = {};
    this._defRenderEntites[ShaderType.COLOUR] = [];
    this._defRenderEntites[ShaderType.TWO_DIMENSION] = [];
    this._defRenderEntites[ShaderType.THREE_DIMENSION] = {
      full: [],
      plain: []
    };
  };

  handleNotification = (notification: NotificationPayload) => {
    let updatePerspective = false;
    switch (notification.action) {
      case RendererNotification.RENDER_ENTITY.action:
        this._render(notification.data[0]);
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

    const preRenderNotifications = this.notificationQueue.take(
      RendererNotification.NOTIFICATION_PRE_RENDER_KEY
    );
    unique(preRenderNotifications, "action").forEach(this.handleNotification);

    if (this.camera.requireUpdateViewMtrx) {
      this.camera.commitProjectionView();
    }
    engineHelper.setTime(time);

    // reinitialse next cycle
    this._resetDefferred();

    this.world.render();
    engineHelper.renderFont();

    this.notificationQueue
      .take(RendererNotification.NOTIFICATION_RENDER_KEY)
      .forEach(this.handleNotification);

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
        texture: texture
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
