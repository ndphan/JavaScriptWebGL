import {
  BitmapConfigParser,
  Coordinate,
  EngineEvent,
  EngineHelper,
  EngineObject,
  Events,
  Light,
  ModelObject3d,
  Object3d,
  ObjectManager,
  Plane3d,
  PlaneType,
  Rect3d,
  RenderType,
  ResourceResolver
} from "../../SynarenEngine";

import Ground3d from "./Ground3d";
import Cube from "./Cube";
import Sphere from "./Sphere";

export default class World extends ObjectManager {
  fontCacheId: number;
  bitmapLoader: BitmapConfigParser;
  ground: Ground3d;
  racingCar: ModelObject3d;
  lowPolyGirl: ModelObject3d;
  cube: Cube;
  cube2: Cube;
  sun: Sphere;
  road: Plane3d;
  lowPolyTree: ModelObject3d[];
  sky: Sphere;
  engineHelper: EngineHelper;

  constructor() {
    super();
  }

  render() {
    this.entities.forEach((ent: EngineObject) => ent.render(this.engineHelper));
  }

  update() {
    this.entities.forEach((ent: EngineObject) => ent.update(this.engineHelper));
    const { x, y, z } = this.engineHelper.camera.camera3d.position;
    this.sky.center(x, y, z);
  }

  event(event: EngineEvent) {
    super.event(event);
    if (event.eventType === Events.DRAG) {
      this.engineHelper.camera.camera3d.angleY(-event.dxRaw);
      this.engineHelper.camera.camera3d.angleX(event.dyRaw);
      this.engineHelper.camera.camera3d.updateProjectionView();
    }
  }

  loadResources() {
    this.engineHelper
      .getResource("assets/sphere.txt")
      .then(
        ResourceResolver.objResolverMultiple(this.engineHelper, [
          { textureSource: "assets/background.jpg", name: "background" },
          { textureSource: "assets/sun.png", name: "sun" }
        ])
      );

    this.engineHelper
      .getResource("assets/low_poly_tree.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/low_poly_tree.png",
          "low_poly_tree"
        )
      );

    this.engineHelper
      .getResource("assets/low_poly_girl.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/low_poly_girl.png",
          "low_poly_girl"
        )
      );

    this.engineHelper
      .getResource("assets/racing_car.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/racing_car.png",
          "racing_car"
        )
      );

    this.engineHelper
      .getResource("assets/paprika.fnt")
      .then(ResourceResolver.bmFontResolver(this.engineHelper));

    this.engineHelper
      .getResource("assets/atlas.txt")
      .then(
        ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3)
      );
  }

  init() {
    const length = 30;
    const width = 20;

    this.engineHelper.camera.camera3d.center(0, 2, length / 2 - 4);
    this.engineHelper.camera.camera3d.updateProjectionView();

    this.sky = new Sphere(
      new Rect3d(0.0, 2.0, 0.0, 30.0, 32.0, 30.0),
      "background"
    );
    // render without shadows and lighting
    this.sky.setRenderType(RenderType.PLAIN);
    this.addEntity(this.sky);

    this.lowPolyGirl = new Object3d(
      new Rect3d(-4, 0.95, 5, 1.0, 1.0, 1.0),
      "low_poly_girl"
    );
    this.lowPolyGirl.angleY(240);
    this.lowPolyGirl.scale(0.7, 0.7, 0.7);
    this.addEntity(this.lowPolyGirl);

    this.racingCar = new Object3d(
      new Rect3d(0, -0.25, 0, 1.5, 1.5, 1.5),
      "racing_car"
    );
    this.racingCar.angleY(135);
    this.addEntity(this.racingCar);

    this.ground = new Ground3d(
      new Rect3d(0.0, 0.0, 0.0, width, 0, length),
      "grass"
    );
    this.ground.event = (
      event: EngineEvent,
      engineHelper: EngineHelper
    ): void => {
      if (
        event.eventType === Events.UP &&
        event.prevEventType === Events.DOWN
      ) {
        const clickedElement = this.ground.isPointInGround(
          new Coordinate(event.x, event.y, 0)
        );
        if (clickedElement) {
          const cameraX = engineHelper.camera.camera3d.position.x;
          const cameraZ = engineHelper.camera.camera3d.position.z;
          const dx = Math.abs(cameraX - clickedElement.position.x);
          const dz = Math.abs(cameraZ - clickedElement.position.z);
          const totalDist = Math.sqrt(dx * dx + dz * dz);
          const speed = 1 / 200;
          const time = totalDist / speed;
          engineHelper.camera.camera3d.pan(
            time,
            clickedElement.position.x,
            undefined,
            clickedElement.position.z
          );
        }
      }
    };
    this.addEntity(this.ground);

    this.cube = new Cube(new Rect3d(-4, 2, -12, 1, 1, 1), "assets/atlas.png", [
      "wood",
      "cloth",
      "sky",
      "grass",
      "paper",
      "rock"
    ]);
    this.cube.update = function() {
      this.position.ay++;
      this.position.ax++;
      this.position.az++;
      this.planes.forEach(element => {
        element.angleY(this.position.ay);
        element.angleX(this.position.ax);
        element.angleZ(this.position.az);
      });
    };
    this.addEntity(this.cube);

    this.cube2 = new Cube(new Rect3d(4, 2, 2, 1, 1, 1), "assets/atlas.png", [
      "wood",
      "cloth",
      "sky",
      "grass",
      "paper",
      "rock"
    ]);
    this.cube2.update = function() {
      this.position.ay++;
      this.position.ax++;
      this.position.az++;
      this.planes.forEach(element => {
        element.angleY(this.position.ay);
        element.angleX(this.position.ax);
        element.angleZ(this.position.az);
      });
    };
    this.addEntity(this.cube2);

    this.sun = new Sphere(new Rect3d(0.0, 10, -15, 1.0, 1.0, 1.0), "sun");
    this.sun.setRenderType(RenderType.PLAIN);
    this.sun.update = function() {
      this.position.ay++;
      this.position.ay++;
      this.position.ay++;
      this.position.ay++;
      this.position.ay++;
      this.angleY(this.position.ay);
      this.angleX(this.position.ax);
      this.angleZ(this.position.az);
    };
    this.addEntity(this.sun);

    this.lowPolyTree = [];
    const treeCreator = (l: number, w: number) => {
      const tree = new Object3d(
        new Rect3d(l, 0, w, 1.0, 1.0, 1.0),
        "low_poly_tree"
      );
      const heightRand = Math.random() * 0.8 - 0.8;
      const scale = 3.5 + heightRand;
      tree.scale(scale, scale, scale);
      this.lowPolyTree.push(tree);
      this.addEntity(tree);
    };
    for (let l = 0; l < length; l += 4) {
      treeCreator(-width / 2, l - length / 2);
      treeCreator(width / 2 - 1, l - length / 2);
    }
    for (let w = 1; w < width - 1; w += 4) {
      treeCreator(w - width / 2, -length / 2);
      treeCreator(w - width / 2, length / 2 - 1);
    }

    const vertexModel = this.engineHelper.newVertexModel(
      "ground",
      PlaneType.XZ
    );
    this.road = new Plane3d(new Rect3d(0, 0.01, 0, 3, 1, (2 * width) / Math.sqrt(2)), vertexModel);
    this.road.angleY(-45);
    this.road.center(-2, 0.01, -15);

    this.addEntity(this.road);

    // initialise all the engine objects
    super.init();

    this.engineHelper.setLighting(
      new Light({
        pos: [-20, 15, -20],
        // intensity and color in rgb
        in: [1.0, 1.0, 1.0],
        // rate of loss in light intensity from source pos
        attenuation: 0.015,
        // ambient lighting 0 - 1 where 0 is complete darkness
        ambientCoeff: 0.3,
        // the direction of light from pos to at to direct the shadowing
        // note that it is only in one direction.
        at: [0.0, 0.0, 0.0]
      })
    );
  }
}
