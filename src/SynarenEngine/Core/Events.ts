import Coordinate from "./Data/Coordinate";
import { WebGLContainer } from "./App";

export interface EngineEvent {
  x: number;
  y: number;
  dx: number;
  dy: number;
  dxRaw: number;
  dyRaw: number;
  eventType: number;
  prevEventType: number;
  timeStamp: number;
  prevTimeStamp: number;
  orientationQuaternion: number[];
  code?: string;
  keyDown?: { [key: string]: boolean };
}

export default class Events {
  eventDown: boolean = false;
  touchDown: boolean = false;
  eventDownX: number = 0.0;
  eventDownY: number = 0.0;
  eventDownDx: number = 0.0;
  eventDownDy: number = 0.0;
  keyDownMap: { [key: string]: boolean } = {};
  prevEvent: number = 0.0;
  timeStamp: number = 0.0;
  prevTimeStamp: number = 0.0;
  motionTimeStamp: number = 0.0;
  orientationQuaternion = [0.0, 0.0, 0.0, 0.0];
  orientation: string | number;
  NULL_EVENT = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    dxRaw: 0,
    dyRaw: 0,
    eventType: -1,
    prevEventType: -1,
    timeStamp: 0,
    prevTimeStamp: 0,
    orientationQuaternion: [0, 0, 0, 0]
  };

  static DOWN = 1;
  static DRAG = 2;
  static UP = 3;
  static RESIZE = 4;
  static ORIENTATION = 5;
  static KEY_DOWN = 6;
  static KEY_UP = 7;
  static SYSTEM_EVENTS = 8;
  static boundedWindow = false;

  callback: Function;
  webGLContainer: WebGLContainer;

  ax = 0;
  ay = 0;
  az = 0;

  initialAngle = false;

  throttle = 1000.0 / 25.0;

  setThrottle = (throttle: number) => {
    if (throttle) {
      this.throttle = throttle;
    }
  };

  bindWindow() {
    if (!Events.boundedWindow) {
      window.addEventListener("mouseup", this.handleMouseUp, true);
      window.addEventListener("touchend", this.handleTouchEnd, true);
      window.addEventListener("resize", this.resize, true);
      window.addEventListener("keydown", this.keyDown, true);
      window.addEventListener("keyup", this.keyUp, true);

      if (window.hasOwnProperty("DeviceMotionEvent")) {
        window.addEventListener("devicemotion", this.handleMotion, true);
      }

      if (window.hasOwnProperty("DeviceOrientationEvent")) {
        window.addEventListener(
          "orientationchange",
          this.handleOrientationChange,
          true
        );
      }
      Events.boundedWindow = true;
    }
  }

  bindCanvas() {
    this.webGLContainer.canvas.addEventListener(
      "mousedown",
      this.handleEventDown,
      true
    );
    this.webGLContainer.canvas.addEventListener(
      "mousemove",
      this.handleEventMove,
      true
    );
    this.webGLContainer.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart,
      true
    );
    this.webGLContainer.canvas.addEventListener(
      "touchmove",
      this.handleTouchMove,
      true
    );
  }

  bind = (callback: Function, webGLContainer: WebGLContainer) => {
    this.callback = callback;
    this.webGLContainer = webGLContainer;
    this.bindCanvas();
    this.bindWindow();
  };

  handleOrientationChange = () => {
    this.orientation = window.orientation || 0;
  };

  getQuaternion(alpha: number, beta: number, gamma: number) {
    const degtorad = Math.PI / 180.0;
    const radtodeg = 180.0 / Math.PI;

    const _x = beta ? beta * degtorad : 0;
    const _y = gamma ? gamma * degtorad : 0;
    const _z = alpha ? alpha * degtorad : 0;

    const cX = Math.cos(_x / 2);
    const cY = Math.cos(_y / 2);
    const cZ = Math.cos(_z / 2);
    const sX = Math.sin(_x / 2);
    const sY = Math.sin(_y / 2);
    const sZ = Math.sin(_z / 2);

    const w = cX * cY * cZ - sX * sY * sZ;
    const x = sX * cY * cZ - cX * sY * sZ;
    const y = cX * sY * cZ + sX * cY * sZ;
    const z = cX * cY * sZ + sX * sY * cZ;

    const screenAccData = new Coordinate(0, 0, 0);

    switch (this.orientation) {
      case 90:
        screenAccData.x = -x;
        screenAccData.y = z;
        break;
      case 180:
        screenAccData.x = -z;
        screenAccData.y = -x;
        break;
      case 270:
      case -90:
        screenAccData.x = x;
        screenAccData.y = -z;
        break;
      default:
        screenAccData.x = z;
        screenAccData.y = x;
        break;
    }
    // convert to engine coords
    return [
      (screenAccData.x * radtodeg) / w,
      (-1 * screenAccData.y * radtodeg) / w,
      (y * radtodeg) / w,
      1.0
    ];
  }

  handleMotion = (event: DeviceMotionEvent) => {
    if (!this.motionTimeStamp) {
      this.motionTimeStamp = event.timeStamp;
    }
    this.incrementQuaternion(event);
    if (event && event.timeStamp - this.motionTimeStamp > this.throttle) {
      const tempEventDownX = this.eventDownX;
      const tempEventDownY = this.eventDownY;
      this.eventDownX = this.orientationQuaternion[0];
      this.eventDownY = this.orientationQuaternion[1];
      this.callback(this.buildEvent(Events.ORIENTATION));
      this.eventDownX = tempEventDownX;
      this.eventDownY = tempEventDownY;

      this.prevEvent = Events.ORIENTATION;
      this.motionTimeStamp = event.timeStamp;
      this.orientationQuaternion = [0.0, 0.0, 0.0, 1.0];
    }
  };

  incrementQuaternion = (event: DeviceMotionEvent) => {
    const accData: any = event.rotationRate
      ? event.rotationRate
      : { beta: 0, gamma: 0, alpha: 0 };
    const eventQuaternion = this.getQuaternion(
      accData.alpha,
      accData.beta,
      accData.gamma
    );
    this.orientationQuaternion[0] += eventQuaternion[0];
    this.orientationQuaternion[1] += eventQuaternion[1];
    this.orientationQuaternion[2] += eventQuaternion[2];
  };

  buildEvent = (type: number): EngineEvent => {
    if (!this.webGLContainer.canvas) return this.NULL_EVENT;
    return {
      x: this.eventDownX / this.webGLContainer.canvas.offsetWidth,
      y: 1 - this.eventDownY / this.webGLContainer.canvas.offsetHeight,
      dx: (2.0 * this.eventDownDx) / this.webGLContainer.canvas.offsetWidth,
      dy: (2.0 * this.eventDownDy) / this.webGLContainer.canvas.offsetHeight,
      dxRaw: this.eventDownDx,
      dyRaw: this.eventDownDy,
      eventType: type,
      prevEventType: this.prevEvent,
      timeStamp: this.timeStamp,
      prevTimeStamp: this.prevTimeStamp,
      orientationQuaternion: this.orientationQuaternion
    };
  };

  resize = () => {
    this.callback(this.buildEvent(Events.RESIZE));
  };

  buildEventKey = (evt: KeyboardEvent, type: number) => {
    return {
      eventType: type,
      keyCode: evt.key,
      code: evt.code,
      event: evt,
      keyDown: this.keyDownMap
    };
  };

  keyDown = (evt: KeyboardEvent) => {
    this.keyDownMap[evt.code] = true;
    this.callback(this.buildEventKey(evt, Events.KEY_DOWN));
  };

  keyUp = (evt: KeyboardEvent) => {
    this.keyDownMap[evt.code] = false;
    this.callback(this.buildEventKey(evt, Events.KEY_UP));
  };

  handleMouseUp = (evt: MouseEvent) => {
    this.eventDown = false;
    this.timeStamp = evt.timeStamp;
    this.eventDownX = evt.offsetX;
    this.eventDownY = evt.offsetY;
    this.callback(this.buildEvent(Events.UP));
    this.prevEvent = Events.UP;
    this.prevTimeStamp = evt.timeStamp;
  };

  handleEventDown = (evt: MouseEvent) => {
    if (evt.which !== 1) {
      return;
    }
    this.eventDown = true;
    this.eventDownX = evt.offsetX;
    this.eventDownY = evt.offsetY;
    this.timeStamp = evt.timeStamp;
    this.callback(this.buildEvent(Events.DOWN));
    this.prevEvent = Events.DOWN;
    this.prevTimeStamp = evt.timeStamp;
  };

  handleEventMove = (evt: MouseEvent) => {
    if (this.eventDown && evt.timeStamp - this.timeStamp > this.throttle) {
      const xUp = evt.offsetX;
      const yUp = evt.offsetY;

      this.eventDownDx = this.eventDownX - xUp;
      this.eventDownDy = this.eventDownY - yUp;
      this.eventDownX = xUp;
      this.eventDownY = yUp;
      this.timeStamp = evt.timeStamp;
      this.callback(this.buildEvent(Events.DRAG));
      this.prevEvent = Events.DRAG;
      this.prevTimeStamp = evt.timeStamp;
    }
  };

  handleTouchEnd = (evt: TouchEvent) => {
    if (evt.touches.length > 0 && evt.target instanceof HTMLElement) {
      this.touchDown = false;
      this.timeStamp = evt.timeStamp;
      this.eventDownX = evt.touches[0].clientX - evt.target.offsetLeft;
      this.eventDownY = evt.touches[0].clientY - evt.target.offsetTop;
      this.callback(this.buildEvent(Events.UP));
      this.prevEvent = Events.UP;
      this.prevTimeStamp = evt.timeStamp;
    }
  };

  handleTouchStart = (evt: TouchEvent) => {
    if (evt.target instanceof HTMLElement) {
      this.touchDown = true;
      this.eventDownX = evt.touches[0].clientX - evt.target.offsetLeft;
      this.eventDownY = evt.touches[0].clientY - evt.target.offsetTop;
      this.timeStamp = evt.timeStamp;
      this.callback(this.buildEvent(Events.DOWN));
      this.prevEvent = Events.DOWN;
      this.prevTimeStamp = evt.timeStamp;
    }
  };

  handleTouchMove = (evt: TouchEvent) => {
    if (
      this.touchDown &&
      evt.timeStamp - this.timeStamp > this.throttle &&
      evt.target instanceof HTMLElement
    ) {
      const xUp = evt.touches[0].clientX - evt.target.offsetLeft;
      const yUp = evt.touches[0].clientY - evt.target.offsetTop;

      this.eventDownDx = (this.eventDownX - xUp) / 2.0;
      this.eventDownDy = (this.eventDownY - yUp) / 2.0;
      this.eventDownX = xUp;
      this.eventDownY = yUp;
      this.timeStamp = evt.timeStamp;
      this.callback(this.buildEvent(Events.DRAG));
      this.prevEvent = Events.DRAG;
      this.prevTimeStamp = evt.timeStamp;
    }
    // prevent device scrolling
    evt.preventDefault();
  };
}

export const event = new Events();
