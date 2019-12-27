import BasicSprite from "../../Entity/BasicSprite";
import Plane2d from "../../Entity/Plane2d";
import PlaneColour from "../../Entity/PlaneColour";
import SpriteModel from "../../Entity/SpriteModel";
import Colour from "../Data/Colour";
import Coordinate from "../Data/Coordinate";
import Rect2d from "../Data/Rect2d";
import EngineObject from "../EngineEntity/EngineObject";
import EngineHelper from "../EngineHelper";
import { FontReference } from "../Font/Font";
import Physics from "../Physics/Physics";

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
              ...object
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
          this.buildObject(object);
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

  buildObject(object: any) {
    if (!object.type) {
      console.error("unable to parse empty type for object", object);
      return;
    }
    if (object.type === "Plane2D") {
      this.createPlane2D(
        object.model,
        this.createRect2d(object.position),
        object.hasPhysics
      );
    } else if (object.type === "Sprite") {
      this.createSprite(
        object.model,
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
    } else if (object.type === "Colour") {
      this.createColour(object.rgba, this.createRect2d(object.position));
    }
  }

  createRect2d(position: any): Rect2d {
    return new Rect2d(
      position.x,
      position.y,
      position.width,
      position.height,
      0
    );
  }

  createCoordinate(position: any): Coordinate {
    return new Coordinate(position.x, position.y, 0);
  }

  createText(texture: string, pos: Coordinate, fontSize: number, text: string) {
    const textRef = FontReference.newFont(pos, texture, 0)
      .setText(text)
      .setFontSize(fontSize);
    this.texts.push(textRef);
  }

  createColour(rgba: Colour, location: Rect2d) {
    const colour = new PlaneColour(location, rgba);
    this.objects.push(colour);
  }

  createSprite(model: string[], location: Rect2d, hasPhysics: boolean) {
    const spriteModel = new SpriteModel(location, 120.0, model);
    const obj = new BasicSprite(location, spriteModel);
    if (hasPhysics) {
      Physics.registerPhysics(obj);
    }
    this.objects.push(obj);
  }

  createPlane2D(model: string, location: Rect2d, hasPhysics: boolean) {
    const obj = new Plane2d(location, model);
    obj.rotateZ(180.0);
    obj.setLayer(-1);
    if (hasPhysics) {
      Physics.registerPhysics(obj);
    }
    this.objects.push(obj);
  }
}

export default ConfigMapBuilder;
