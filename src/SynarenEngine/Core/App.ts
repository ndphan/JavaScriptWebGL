import Camera from "./Camera";
import Updater from "./Updater";
import Renderer, { RendererNotification } from "./Renderer";
import EngineHelper from "./EngineHelper";
import Events, { event } from "./Events";
import Timer from "./Common/Timer";
import NotificationQueue from "./Common/NotificationQueue";
import WorldDelegate from "./WorldDelegate";
import { EngineEvent } from "../Core/Events";
import SubscriberPool, { Subscription } from "./Common/SubscriberPool";

export class WebGLContainer {
  canvas: HTMLCanvasElement;
  aspectRatio: number;
  constructor(
    elementId: string,
    parentElement: HTMLElement,
    aspectRatio: number,
    restoreContentFn: () => any
  ) {
    this.aspectRatio = aspectRatio;
    this.canvas = document.createElement("canvas");
    if (elementId) {
      this.canvas.id = elementId;
    } else {
      this.canvas.id = "app";
    }
    this.canvas.addEventListener(
      "webglcontextlost",
      event => event.preventDefault(),
      false
    );
    this.canvas.addEventListener(
      "webglcontextrestored",
      restoreContentFn,
      false
    );
    parentElement.appendChild(this.canvas);
  }

  delete() {
    this.canvas.style.display = "none";
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }

  resize(measureElement: HTMLElement) {
    const width = measureElement.offsetWidth;
    const height = width / this.getAspectRatio();
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.height = `${height}px`;
    this.canvas.style.width = `${width}px`;
  }

  getAspectRatio() {
    let aspectRatio = this.aspectRatio;
    if (!aspectRatio) {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      aspectRatio = width / height;
    }
    return aspectRatio;
  }

  getCtx(): WebGLRenderingContext {
    const ctx =
      this.canvas.getContext("webgl") ||
      this.canvas.getContext("experimental-webgl");
    if (!ctx) {
      throw new Error("WebGL not avaliable");
    }
    return ctx as WebGLRenderingContext;
  }
}

export class AppSubscription {
  static START_ITERATION = new Subscription("App#StartIteration");
  static GET_FPS = new Subscription("App#GetFPS");
}

export default class App {
  renderer: Renderer;
  updater: Updater;
  timer: Timer;
  interval: any;
  camera: Camera;
  errorCallback: Function;
  args: { [key: string]: any };
  fps: number;
  isStepRender: boolean;
  ready: boolean = false;
  engineHelper: EngineHelper;
  isPaused: boolean = true;
  frameTime: number = 0.0;
  framesElapsed: number = 0;
  webGLContainer: WebGLContainer;
  world: WorldDelegate;
  isVisible: boolean;
  notificationQueue: NotificationQueue;
  subscriberPool: SubscriberPool;

  constructor(args: { [key: string]: any }) {
    if (!args) {
      throw new Error("no args passed into App");
    }
    this.notificationQueue = new NotificationQueue();
    this.subscriberPool = new SubscriberPool();
    this.subscriberPool.listen(
      AppSubscription.START_ITERATION,
      this.startIteration
    );

    this.args = args;
    this.buildCanvas(args);

    this.isStepRender = args.isStepRender || false;
    event.bind(this.onEvent, this.webGLContainer);
    event.setThrottle(args.eventThrottle || 1000.0 / 25.0);

    this.errorCallback = args.error;
    this.setup();

    this.setFPS(args.fps);
  }

  setFPS(fps: number) {
    this.fps = 1000.0 / fps || 1000.0 / 30.0;
    this.subscriberPool.publish(AppSubscription.GET_FPS, this.fps);
  }

  setup = () => {
    const args = this.args;
    this.timer = new Timer();
    this.camera = new Camera();
    this.updater = new Updater(args);
    this.renderer = new Renderer(
      args,
      this.webGLContainer,
      this.camera,
      this.notificationQueue,
      this.subscriberPool
    );

    this.camera.setupCamera(args.camera, this.webGLContainer.canvas);
    this.engineHelper = new EngineHelper(
      this.notificationQueue,
      this.subscriberPool,
      this.camera
    );

    this.world = this.args.world;
    this.world.setEngineHelper(this.engineHelper);
  };

  onEvent = (event: EngineEvent) => {
    if (event.eventType === Events.RESIZE) {
      this.resizeScreen();
    }
    this.world.event(event);
  };

  destroy = () => {
    clearInterval(this.interval);
    this.renderer.delete();
    this.webGLContainer.delete();
  };

  animationFrame = () => {
    if (!this.ready) {
      return;
    }
    try {
      this.updater.update(this.timer.peak(), this.engineHelper);
      this.renderer.render(this.timer.peak(), this.engineHelper);
      this.notifyFrames();
      this.timer.start();
    } catch (error) {
      console.error(error);
      clearInterval(this.interval);
      if (this.errorCallback) {
        this.errorCallback(error);
      }
    }
  };

  startIteration = () => requestAnimationFrame(this.animationFrame);

  notifyFrames = () => {
    this.frameTime += this.timer.peak();
    this.framesElapsed++;
    if (this.framesElapsed === 60) {
      if (this.args.subscribe) {
        this.args.subscribe({
          fps: (1000.0 / this.frameTime) * this.framesElapsed
        });
      }
      this.framesElapsed = 0;
      this.frameTime = 0;
    }
  };

  toggleStepRender(run = !this.isStepRender) {
    this.isStepRender = run;
    if (!this.isStepRender && !this.interval) {
      this.startRunLoop();
    }
  }

  startRunLoop = () => {
    this.timer.start();
    const fps = this.fps;
    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.animationFrame();
      }
      if (this.isStepRender) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
      if (this.fps !== fps) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.startRunLoop();
      }
    }, fps);
  };

  initSystem = (): Promise<any> => {
    this.initFont();
    this.world.init(this.engineHelper);
    this.renderer.init();
    return this.engineHelper.getAllResourcesLoading();
  };

  initFont() {
    this.engineHelper.initFont();
  }

  loadResources = (): Promise<any> => {
    this.world.loadResources();
    return this.engineHelper.getAllResourcesLoading();
  };

  runApp = () => {
    this.ready = true;
    if (!this.isStepRender) {
      this.startRunLoop();
    } else {
      this.animationFrame();
    }
  };

  onRunError = (error: Error) => {
    clearInterval(this.interval);
    console.error(error);
    throw error;
  };

  run = () => {
    console.log("Running", this);
    const startTime = new Date();
    return (
      this.loadResources()
        .then(this.initSystem)
        .then(() => this.renderer.bindBuffer())
        .then(this.runApp)
        // @ts-ignore
        .then(() => console.log(`startup time: ${new Date() - startTime}`))
        .catch(this.onRunError)
    );
  };

  resizeCanvas = (measureElement: HTMLElement) => {
    this.webGLContainer.resize(measureElement);
  };

  resizeScreen = () => {
    const measureElement = document.getElementById(this.args.elementId)!;
    this.resizeCanvas(measureElement);
    this.camera.setupCamera(this.args.camera, this.webGLContainer.canvas);
    this.notificationQueue.push(RendererNotification.RESIZE_SCREEN);
    if (this.isStepRender && this.ready) {
      this.animationFrame();
    }
  };

  buildCanvas = (args: { [key: string]: any }) => {
    if (this.webGLContainer) {
      return;
    }
    let appElement: HTMLElement = document.body;
    if (args.elementId) {
      appElement = document.getElementById(args.elementId)!;
    }
    this.webGLContainer = new WebGLContainer(
      args.canvasId,
      appElement,
      args.aspectRatio,
      this.setup
    );
    this.resizeCanvas(appElement);
  };

  reset = () => {
    if (this.world) {
      this.world.reset();
    } else {
      console.error("Game Delegate not ready to call reset");
    }
  };

  toggleShow = () => {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  };

  show = () => {
    this.webGLContainer.canvas.style.display = "initial";
    this.resizeScreen();
    this.isVisible = true;
  };

  hide = () => {
    this.webGLContainer.canvas.style.display = "none";
    this.isVisible = false;
  };

  togglePause = () => {
    this.isPaused = !this.isPaused;
  };

  pause = () => {
    this.isPaused = true;
  };

  unpause = () => {
    this.isPaused = false;
  };
}
