import EngineHelper from "../EngineHelper";
import Rect2d from "../Data/Rect2d";
import PlaneType from "../Data/PlaneType";
import Plane2d from "../../Entity/Plane2d";
import Physics from "../Physics/Physics";
import EngineObject from "../EngineEntity/EngineObject";
import BasicSprite from "../../Entity/BasicSprite";
import SpriteModel from "../../Entity/SpriteModel";
import { FontReference } from "../Font/Font";
import Coordinate from "../Data/Coordinate";

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
          if (object.$ref && this.ref[object.$ref]) {
            // merge ref with object
            object = { ...this.ref[object.$ref], ...object };
          }
          if (object.$anchor && this.anchor[object.$anchor]) {
            const anchor = this.anchor[object.$anchor];
            // translate anchor
            if (object.type !== "Font") {
              object.position.x += anchor.position.x;
              object.position.y += anchor.position.y;
              object.position.width += anchor.position.width;
              object.position.height += anchor.position.height;
            }
          }
          this.buildObject(object);
        }
      }
    }
  }

  buildObject(object: any) {
    if (!object.type) {
      console.error("unable to parse empty type for object", object);
      return;
    }
    if (object.type === "Plane2D") {
      this.createPlane2D(
        object.model,
        object.texture,
        this.createRect2d(object.position),
        object.hasPhysics
      );
    } else if (object.type === "Sprite") {
      this.createSprite(
        object.model,
        object.texture,
        this.createRect2d(object.position),
        object.hasPhysics
      );
    } else if (object.type === "Font") {
      this.createText(
        object.texture,
        this.createCoordinate(object.position),
        object.fontSize,
        object.text
      );
    }
  }

  createRect2d(position: any): Rect2d {
    return new Rect2d(
      position.x,
      position.y,
      0,
      position.width,
      position.height
    );
  }

  createCoordinate(position: any): Coordinate {
    return new Coordinate(position.x, position.y, 0);
  }

  createText(texture: string, pos: Coordinate, fontSize: number, text: string) {
    const textRef = this.engineHelper.writeFont(
      texture,
      FontReference.newFont(pos, text, fontSize, 1000.0 / 60, texture)
    );
    this.texts.push(textRef);
  }

  createSprite(
    model: string[],
    texture: string,
    location: Rect2d,
    hasPhysics: boolean
  ) {
    const spriteModel = new SpriteModel(location, texture, 120.0, model);
    const obj = new BasicSprite(location, spriteModel);
    if (hasPhysics) {
      Physics.registerPhysics(obj);
    }
    this.objects.push(obj);
  }

  createPlane2D(
    model: string,
    texture: string,
    location: Rect2d,
    hasPhysics: boolean
  ) {
    const objModel = this.engineHelper.createPlaneVertexModelCacheId(
      model,
      PlaneType.YX
    );
    const obj = new Plane2d(location, objModel, texture);
    obj.rotateZ(180.0);
    obj.setLayer(-1);
    if (hasPhysics) {
      Physics.registerPhysics(obj);
    }
    this.objects.push(obj);
  }
}

export default ConfigMapBuilder;
