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
  Rect2d,
  RenderType,
  ResourceResolver,
  Colour,
  Coordinate,
  EngineHelper
} from "synaren-engine";
import Cube from "./Cube";
import Ground3d from "./Ground3d";
import Sphere from "./Sphere";
import { CrystalCollectorGame, createCrystalCollectorApp } from "./CrystalCollectorGame";


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
    this.entities.forEach((ent: EngineObject, index: number) => ent.render(this.engineHelper));
  }

  update() {
    this.entities.forEach((ent: EngineObject) => ent.update(this.engineHelper));
    const { x, y, z } = this.engineHelper.camera.camera3d.position;
    if (this.sky) {
      this.sky.center(x, y, z);
    }
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
    console.log('Loading resources...');
    
    this.engineHelper
      .getResource("assets/sphere.txt")
      .then(
        ResourceResolver.objResolverMultiple(this.engineHelper, [
          { textureSource: "assets/background.jpg", name: "background" },
          { textureSource: "assets/sun.png", name: "sun" }
        ])
      ).then(() => console.log('Sphere resources loaded'))
      .catch(err => console.error('Sphere resource error:', err));

    this.engineHelper
      .getResource("assets/low_poly_tree.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/low_poly_tree.png",
          "low_poly_tree"
        )
      ).then(() => console.log('Tree resources loaded'))
      .catch(err => console.error('Tree resource error:', err));

    this.engineHelper
      .getResource("assets/low_poly_girl.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/low_poly_girl.png",
          "low_poly_girl"
        )
      ).then(() => console.log('Girl resources loaded'))
      .catch(err => console.error('Girl resource error:', err));

    this.engineHelper
      .getResource("assets/racing_car.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/racing_car.png",
          "racing_car"
        )
      ).then(() => console.log('Car resources loaded'))
      .catch(err => console.error('Car resource error:', err));

    this.engineHelper
      .getResource("assets/paprika.fnt")
      .then(ResourceResolver.bmFontResolver(this.engineHelper))
      .then(() => console.log('Font resources loaded'))
      .catch(err => console.error('Font resource error:', err));

    this.engineHelper
      .getResource("assets/atlas.txt")
      .then(
        ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3)
      ).then(() => console.log('Atlas resources loaded'))
      .catch(err => console.error('Atlas resource error:', err));

    this.engineHelper
      .getResource(`/assets/missing-texture.txt`)
      .then(ResourceResolver.bitmapResolver(this.engineHelper, 1184, 1184, 0))
      .then(() => console.log('Missing texture resources loaded'))
      .catch(err => console.error('Missing texture resource error:', err));
  }

  init() {
   const length = 30;
    const width = 20;

    this.engineHelper.camera.camera3d.center(0, 2, length / 2 - 4);
    this.engineHelper.camera.camera3d.updateProjectionView();

    this.sky = new Sphere(
      new Rect3d(0.0, 2.0, 0.0, 100.0, 100.0, 100.0),
      "background"
    );
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
    ) => {
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
          engineHelper.camera.camera3d.pan3d(
            time,
            clickedElement.position.x,
            undefined,
            clickedElement.position.z
          );
        }
      }
      return true;
    };
    this.addEntity(this.ground);

    this.cube = new Cube(new Rect3d(-4, 2, -12, 0.9, 0.9, 0.9), "assets/atlas.png", [
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

    this.cube2 = new Cube(new Rect3d(-2.2, 2, 9, .9, .9, .9), "assets/atlas.png", [
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
    this.road = new Plane3d(new Rect3d(0, 0.01, 0.0, 1, 1, 1), vertexModel);
    this.road.scale(3, 1, (2 * width) / Math.sqrt(2));
    this.road.angleY(-45);
    this.road.center(-2, 0.01, -15);

    this.addEntity(this.road);

    // initialise all the engine objects
    super.init();

    this.engineHelper.setLighting(
      new Light({
        pos: [0.0, 10, -15],
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

const createApp = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const args = {
    world: new World(),
    elementId: "app",
    canvasId: "app-game",
    error: undefined,
    subscribe: undefined,
    renderMode: '3d', // Default to 3D mode
    camera: {
      near: 0.01, // Much smaller near plane to avoid clipping close objects
      far: 1000.0, // Reasonable far plane
      fov: 120.0, // Use a wider FOV for better view
      maxFov: 120.0, // Set reasonable max FOV
      isFovMax: false, // Don't use max FOV calculation
      projection: 'perspective', // Use perspective projection
      aspect
    },
    aspectRatio: aspect,
    eventThrottle: 1000.0 / 60.0,
    fps: 30,
    isStepRender: false,
  };
  const app = new App(args);
  app.run().catch(console.error);
  app.unpause();
  window.onresize = () => {
    location.reload();
  };
};

window.onload = function () {
  try {
    // Check URL parameter to decide which app to load
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('game');
    
    if (gameMode === 'crystal-collector') {
      // Load Crystal Collector Game
      createCrystalCollectorApp();
      
      // Expose game instance for UI updates
      setTimeout(() => {
        const canvas = document.getElementById('app-game');
        if (canvas && (canvas as any).app && (canvas as any).app.world) {
          (window as any).gameInstance = (canvas as any).app.world;
        }
      }, 1000);
    } else {
      // Load default example app
      createApp();
    }
  } catch (error) {
    console.error(error);
  }
};
