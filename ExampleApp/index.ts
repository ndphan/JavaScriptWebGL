import {
  App,
  BitmapConfigParser,
  EngineEvent,
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
} from "../dist/index";
import Cube from "./Cube";
import Ground3d from "./Ground3d";
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

  constructor() {
    super();
  }

  render() {
    this.entities.forEach((ent: EngineObject) => {
      if (ent) ent.render(this.engineHelper);
    });
  }

  update() {
    this.entities.forEach((ent: EngineObject) => {
      if (ent) ent.update(this.engineHelper);
    });
    const { x, y, z } = this.engineHelper.camera.camera3d.position;
    if (this.sky) this.sky.center(x, y, z);
  }

  event(event: EngineEvent) {
    super.event(event);
    if (event.eventType === Events.DRAG) {
      this.engineHelper.camera.camera3d.angleY(-event.dxRaw);
      this.engineHelper.camera.camera3d.angleX(event.dyRaw);
      this.engineHelper.camera.camera3d.updateProjectionView();
    }
    return undefined;
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

    this.engineHelper
      .getResource(`/assets/missing-texture.txt`)
      .then(ResourceResolver.bitmapResolver(this.engineHelper, 1184, 1184, 0));
  }

  init() {
    const length = 30;
    const width = 20;

    this.engineHelper.camera.camera3d.center(0, 2, length / 2 - 4);
    this.engineHelper.camera.camera3d.updateProjectionView();

    // Sky (Sphere)
    this.sky = new Sphere(
      new Rect3d(0.0, 2.0, 0.0, 30.0, 32.0, 30.0),
      "background"
    );
    this.sky.setRenderType(RenderType.TRIANGLE);
    this.sky.init(this.engineHelper);
    this.addEntity(this.sky);

    // Low poly girl
    this.lowPolyGirl = new Object3d(
      new Rect3d(-4, 0.95, 5, 1.0, 1.0, 1.0),
      "low_poly_girl"
    );
    this.lowPolyGirl.angleY(240);
    this.lowPolyGirl.scale(0.7, 0.7, 0.7);
    this.lowPolyGirl.setRenderType(RenderType.TRIANGLE);
    this.lowPolyGirl.init(this.engineHelper);
    this.addEntity(this.lowPolyGirl);

    // Racing car
    this.racingCar = new Object3d(
      new Rect3d(0, -0.25, 0, 1.5, 1.5, 1.5),
      "racing_car"
    );
    this.racingCar.angleY(135);
    this.racingCar.setRenderType(RenderType.TRIANGLE);
    this.racingCar.init(this.engineHelper);
    this.addEntity(this.racingCar);

    // Ground (tiled)
    // this.ground = new Ground3d(
    //   new Rect3d(0.0, 0.0, 0.0, width, 0, length),
    //   "ground"
    // );
    // this.ground.init(this.engineHelper);
    // this.addEntity(this.ground);

    // // Cube 1
    // this.cube = new Cube(
    //   new Rect3d(-4, 2, -12, 1, 1, 1),
    //   "assets/atlas.png",
    //   ["wood", "cloth", "sky", "grass", "paper", "rock"]
    // );
    // this.cube.init(this.engineHelper);
    // this.addEntity(this.cube);

    // // Cube 2
    // this.cube2 = new Cube(
    //   new Rect3d(4, 2, 2, 1, 1, 1),
    //   "assets/atlas.png",
    //   ["wood", "cloth", "sky", "grass", "paper", "rock"]
    // );
    // this.cube2.init(this.engineHelper);
    // this.addEntity(this.cube2);

    // Sun (Sphere)
    this.sun = new Sphere(
      new Rect3d(0.0, 10, -15, 1.0, 1.0, 1.0),
      "sun"
    );
    this.sun.setRenderType(RenderType.TRIANGLE);
    this.sun.init(this.engineHelper);
    this.addEntity(this.sun);

    // Low poly trees
    this.lowPolyTree = [];
    const treeCreator = (l: number, w: number) => {
      const tree = new Object3d(
        new Rect3d(l, 0, w, 1.0, 1.0, 1.0),
        "low_poly_tree"
      );
      const heightRand = Math.random() * 0.8 - 0.8;
      const scale = 3.5 + heightRand;
      tree.scale(scale, scale, scale);
      tree.setRenderType(RenderType.TRIANGLE);
      tree.init(this.engineHelper);
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

    // Road (as a plane)
    const vertexModel = this.engineHelper.newVertexModel(
      "road",
      PlaneType.XZ
    );
    this.road = new Plane3d(
      new Rect3d(0, 0.01, 0.0, 1, 1, 1),
      vertexModel
    );
    this.road.scale(3, 1, (2 * width) / Math.sqrt(2));
    this.road.angleY(-45);
    this.road.center(-2, 0.01, -15);
    this.road.init(this.engineHelper);
    this.addEntity(this.road);

    // initialise all the engine objects
    super.init();

    this.engineHelper.setLighting(
      new Light({
        pos: [-20, 15, -20],
        in: [1.0, 1.0, 1.0],
        attenuation: 0.015,
        ambientCoeff: 0.3,
        at: [0.0, 0.0, 0.0]
      })
    );
  }
}

window.onload = function () {
  try {
    const args = {
      world: new World(),
      elementId: "app",
      canvasId: "app-game",
      error: undefined,
      subscribe: undefined,
      camera: {
        near: 0.1,
        far: 1000.0,
        fov: 45.0,
        maxFov: (Math.atan(0.5) * 360.0) / Math.PI,
        isFovMax: true
      },
      eventThrottle: 1000.0 / 60.0,
      fps: 30,
      isStepRender: false
    };
    const app = new App(args);
    app.run().catch(console.error);
    app.unpause();
    window.onresize = app.resizeScreen;
  } catch (error) {
    console.error(error);
  }
};
