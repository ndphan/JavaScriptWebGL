import BasicSprite from "../../Entity/BasicSprite";
import LineColour from "../../Entity/LineColour";
import Moveable from "../../Entity/Moveable";
import Plane2d from "../../Entity/Plane2d";
import Plane3d from "../../Entity/Plane3d";
import PlaneColour from "../../Entity/PlaneColour";
import SpriteModel from "../../Entity/SpriteModel";
import SpriteMoveable from "../../Entity/SpriteMoveable";
import TriangleColour2d from "../../Entity/TriangleColour2d";
import Colour from "../Data/Colour";
import Coordinate from "../Data/Coordinate";
import PlaneType from "../Data/PlaneType";
import Rect2d from "../Data/Rect2d";
import Rect3d from "../Data/Rect3d";
import EngineObject, { EngineEntity } from "../EngineEntity/EngineObject";
import Position from "../EngineEntity/Position";
import EngineHelper from "../EngineHelper";
import Events, { EngineEvent } from "../Events";
import { FontReference } from "../Font/Font";
import Physics from "../Physics/Physics";

export type OnClickType = (
  event: EngineEvent,
  engineHelper: EngineHelper,
  object: EngineObject
) => boolean | undefined;

class ConfigMapBuilder {
  engineHelper: EngineHelper;
  objects: EngineObject[];
  texts: FontReference[];
  ref: { [key: string]: any };
  anchor: { [key: string]: any };

  constructor(engineHelper: EngineHelper) {
    this.engineHelper = engineHelper;
    this.objects = [];
    this.ref = {};
    this.anchor = {};
    this.texts = [];
  }

  build(map: any) {
    for (const prop in map) {
      if (map.hasOwnProperty(prop)) {
        if (prop.startsWith("$")) {
          this.ref[prop] = map[prop];
        } else if (prop.startsWith("+")) {
          this.anchor[prop] = map[prop];
        } else {
          let object = map[prop];
          this.initObjectPosition(object);
          if (object.$ref && this.ref[object.$ref]) {
            // merge ref with object
            object = {
              ...this.ref[object.$ref],
              ...object,
            };
          }
          if (object.$anchor && this.anchor[object.$anchor]) {
            const anchor = this.anchor[object.$anchor];
            // translate anchor
            if (object.type === "Font") {
              object.position.x += anchor.position.x;
              object.position.y += anchor.position.y;
            } else {
              object.position.x += anchor.position.x;
              object.position.y += anchor.position.y;
              object.position.width += anchor.position.width;
              object.position.height += anchor.position.height;
            }
          }
          this.buildModel(object);
        }
      }
    }
  }

  initObjectPosition(object: any) {
    if (!object.position) {
      object.position = { x: 0, y: 0, height: 0, width: 0 };
    } else {
      if (!object.position.x) {
        object.position.x = 0;
      }
      if (!object.position.y) {
        object.position.y = 0;
      }
      if (!object.position.width) {
        object.position.width = 0;
      }
      if (!object.position.height) {
        object.position.height = 0;
      }
    }
  }

  buildModel(
    config: ConfigEntity
  ): ConfigEntityConcreteType[ConfigEntity["type"]] {
    if (!config.type) {
      console.error("unable to parse empty type for object", config);
      return null as any;
    }
    let obj: EngineObject | FontReference = null as any;
    if (config.type === "Plane2D") {
      obj = this.createPlane2D(
        config.model,
        this.createRect2d(config.position, config.isCentre),
        config.hasPhysics
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "Plane3D") {
      obj = this.createPlane3D(
        config.model,
        this.createRect3d(config.position, config.isCentre),
        config.hasPhysics,
        config.planeType
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "Triangle") {
      obj = this.createTriangle(
        config.rgba,
        this.createRect2d(config.position, config.isCentre)
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "SpriteMoveable") {
      obj = this.createSpriteMoveable(
        config.spriteModel,
        this.createRect2d(config.position, config.isCentre),
        config.hasPhysics,
        config.ticks
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "Moveable") {
      obj = this.createMoveable(
        config.model,
        this.createRect2d(config.position, config.isCentre),
        config.hasPhysics
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "Sprite") {
      obj = this.createSprite(
        config.spriteModel,
        this.createRect2d(config.position, config.isCentre),
        config.hasPhysics,
        config.ticks
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "Font") {
      obj = this.createText(
        config.texture,
        this.createCoordinate(config.position),
        config.fontSize,
        config.text
      );
      obj.id = config.id;
    } else if (config.type === "Colour") {
      obj = this.createColour(
        config.rgba,
        this.createRect2d(config.position, config.isCentre)
      );
      this.hookCustomHandler(config, obj);
    } else if (config.type === "Line") {
      obj = this.createLineColour(
        config.rgba,
        config.point1,
        config.point2,
        config.thickness
      );
      this.hookCustomHandler(config, obj);
    } else {
      console.warn(`Unable to find entity of type ${config.type}`);
    }
    if (obj instanceof EngineObject) {
      obj.$id = config.id || obj.$id;
      obj.data = config.data;
      obj.isLastEvent = config.isLastEvent || false;
    }

    if (obj instanceof EngineObject || obj instanceof FontReference) {
      if (config.isTop) {
        obj.setTop(true);
      }
    }

    if (obj instanceof EngineObject && config.clone) {
      obj.setClone(true);
    }

    // @ts-expect-error ignore
    return obj;
  }

  hookCustomHandler(config: ConfigEntity, object: EngineObject) {
    if (config.render) {
      let _renderCustom;
      if (typeof window[config.render] === "function") {
        _renderCustom = window[config.render].bind(object);
      } else if (typeof config.render === "function") {
        _renderCustom = config.render;
      } else {
        _renderCustom = () => {};
      }
      const _render = object.render.bind(object);
      object.render = (engineHelper: EngineHelper) => {
        _render(engineHelper);
        _renderCustom(engineHelper);
      };
    }
    if (config.update) {
      let _updateCustom;
      if (typeof window[config.update] === "function") {
        _updateCustom = window[config.update].bind(object);
      } else if (typeof config.update === "function") {
        _updateCustom = config.update;
      } else {
        _updateCustom = () => {};
      }
      const _update = object.update.bind(object);
      object.update = (engineHelper: EngineHelper) => {
        _update(engineHelper);
        _updateCustom(engineHelper);
      };
    }

    const onClickedDefined =
      config.onClick && typeof config.onClick === "function";
    if (config.event) {
      let _eventCustom;
      if (typeof window[config.event] === "function") {
        _eventCustom = window[config.event].bind(object);
      } else if (typeof config.event === "function") {
        _eventCustom = config.event;
      } else {
        _eventCustom = () => {};
      }
      const _event = object.event.bind(object) as EngineEntity["event"];
      object.event = (event: EngineEvent, engineHelper: EngineHelper) => {
        let shouldPropagate = true;
        // only stop propagation if the event returns false
        shouldPropagate =
          shouldPropagate && _event(event, engineHelper) !== false;
        shouldPropagate =
          shouldPropagate &&
          _eventCustom(event, engineHelper, object) !== false;
        if (onClickedDefined) {
          shouldPropagate =
            shouldPropagate &&
            this.isClicked(event, engineHelper, object, config.onClick) !==
              false;
        }
        return shouldPropagate;
      };
    } else if (onClickedDefined) {
      const _event = object.event.bind(object);
      object.event = (event: EngineEvent, engineHelper: EngineHelper) => {
        let shouldPropagate = _event(event, engineHelper) !== false;
        shouldPropagate =
          shouldPropagate &&
          this.isClicked(event, engineHelper, object, config.onClick) !== false;
        return shouldPropagate;
      };
    }
  }

  isClicked(
    event: EngineEvent,
    engineHelper: EngineHelper,
    object: EngineObject,
    onClick: OnClickType
  ) {
    if (
      event.eventType === Events.UP &&
      engineHelper.isClicked(event, object.getRect2()) &&
      object.hidden === false
    ) {
      return onClick.bind(object)(event, engineHelper, object);
    }
  }

  createRect2d(position: Position, isCentre: boolean): Rect2d {
    const rect = new Rect2d(
      Number(position.x),
      Number(position.y),
      Number(position.width),
      Number(position.height),
      0
    );
    return isCentre ? rect.center() : rect;
  }

  createRect3d(position: Position, isCentre: boolean): Rect3d {
    const rect = new Rect3d(
      Number(position.x),
      Number(position.y),
      Number(position.z),
      Number(position.width),
      Number(position.height),
      Number(position.length)
    );
    return isCentre ? rect.center() : rect;
  }

  createCoordinate(position: any): Coordinate {
    return new Coordinate(Number(position.x), Number(position.y), 0);
  }

  createText(
    texture: string,
    pos: Coordinate,
    fontSize: number,
    text: string
  ): FontReference {
    const textRef = FontReference.newFont(pos, texture, 0)
      .setText(text)
      .setFontSize(fontSize);
    this.texts.push(textRef);
    return textRef;
  }

  createLineColour(
    rgba: Colour,
    point1: Coordinate,
    point2: Coordinate,
    thickness: number
  ): EngineObject {
    const colour = new LineColour(point1, point2, thickness, rgba);
    this.objects.push(colour);
    return colour;
  }

  createColour(rgba: Colour, location: Rect2d): EngineObject {
    const colour = new PlaneColour(location, rgba);
    this.objects.push(colour);
    return colour;
  }

  createSpriteMoveable(
    model: string[],
    location: Rect2d,
    hasPhysics: boolean,
    ticks: number
  ): EngineObject {
    const spriteModel = new SpriteModel(location, ticks || 120.0, model);
    const obj = new SpriteMoveable(location, spriteModel);
    spriteModel.position.z = -1;
    spriteModel.scaleZ(0);
    if (hasPhysics) {
      Physics.registerPhysics(obj, obj.physics);
    }
    this.objects.push(obj);
    return obj;
  }

  createMoveable(
    model: string,
    location: Rect2d,
    hasPhysics: boolean
  ): EngineObject {
    const obj = new Plane2d(location, model);
    obj.setLayer(-1);

    const moveable = new Moveable();
    moveable.entities.push(obj);
    moveable.rotateZ(180.0);
    moveable.setRect(location);
    if (hasPhysics) {
      Physics.registerPhysics(moveable, moveable.physics);
    }
    moveable.updatePhysicsPosition();
    this.objects.push(moveable);
    return moveable;
  }

  createSprite(
    model: string[],
    location: Rect2d,
    hasPhysics: boolean,
    ticks: number
  ): EngineObject {
    const spriteModel = new SpriteModel(location, ticks || 120.0, model);
    const obj = new BasicSprite(location, spriteModel);
    spriteModel.position.z = -1;
    spriteModel.rotateZ(180.0);
    spriteModel.scaleZ(0);
    if (hasPhysics) {
      Physics.registerPhysics(obj, obj.physics);
    }
    this.objects.push(obj);
    return obj;
  }

  createPlane2D(
    model: string,
    location: Rect2d,
    hasPhysics: boolean
  ): EngineObject {
    const obj = new Plane2d(location, model);
    obj.rotateZ(180.0);
    if (hasPhysics) {
      Physics.registerPhysics(obj);
    }
    this.objects.push(obj);
    return obj;
  }

  createPlane3D(
    model: string,
    location: Rect3d,
    hasPhysics: boolean,
    plane: PlaneType
  ): EngineObject {
    const vertexModel = this.engineHelper.newVertexModel(model, plane);
    const obj = new Plane3d(location, vertexModel);
    if (hasPhysics) {
      Physics.registerPhysics(obj);
    }
    this.objects.push(obj);
    return obj;
  }

  createTriangle(rgba: Colour, location: Rect2d): EngineObject {
    const obj = new TriangleColour2d(location, rgba);
    this.objects.push(obj);
    return obj;
  }
}

export type ConfigEntityTypes = keyof ConfigEntityConcreteType;

export type ConfigEntityConcreteType = {
  Line: LineColour;
  Plane2D: Plane2d;
  Colour: PlaneColour;
  Font: FontReference;
  Plane3D: Plane3d;
  Triangle: TriangleColour2d;
  SpriteMoveable: SpriteMoveable;
  Moveable: Moveable;
  Sprite: BasicSprite;
};

export class ConfigEntity {
  id: string;
  type: ConfigEntityTypes;
  position: Position;
  point1: Coordinate;
  point2: Coordinate;
  thickness: number;
  rgba: Colour;
  model: string;
  hasPhysics: boolean;
  clone: boolean;
  fontSize: number;
  text: string;
  ticks: number;
  spriteModel: string[];
  texture: string;
  render: string;
  update: string;
  event: string;
  script: string;
  isTop: boolean;
  onClick: OnClickType;
  data: object;
  isCentre: boolean;
  planeType: PlaneType;
  isLastEvent: boolean;
}

export type ConfigBuilder = {
  entity: { [key: string]: ConfigEntity };
  script: string;
};

export default ConfigMapBuilder;
