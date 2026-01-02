/**
 * Engine Test Helper
 * Common setup code for initializing the engine in test environments
 * Follows the pattern from ExampleApp games
 */

import App from '../../src/Core/App';
import EngineHelper from '../../src/Core/EngineHelper';
import ObjectManager from '../../src/Manager/ObjectManager';
import ResourceResolver from '../../src/AssetLoader/ResourceResolver';
import Rect3d from '../../src/Core/Data/Rect3d';
import Rect2d from '../../src/Core/Data/Rect2d';
import Plane3d from '../../src/Entity/Plane3d';
import PlaneColour from '../../src/Entity/PlaneColour';
import TriangleColour2d from '../../src/Entity/TriangleColour2d';
import PlaneType from '../../src/Core/Data/PlaneType';
import Light from '../../src/Core/Data/Light';
import Colour from '../../src/Core/Data/Colour';

/**
 * Test world that mimics real game setup pattern
 */
export class TestWorld extends ObjectManager {
  ground!: Plane3d;
  colourPlane!: PlaneColour;
  triangle!: TriangleColour2d;
  resourcesLoaded: boolean = false;

  init(): void {
    // Initialize camera like in CrystalCollectorGame
    this.engineHelper.camera.camera3d.center(0, 5, 10);
    this.engineHelper.camera.camera3d.lookAt(0, 0, 0);
    this.engineHelper.camera.camera3d.updateProjectionView();

    // Create basic ground plane
    this.createGameObjects();

    // Call parent init to initialize all entities
    super.init();

    // Set up basic lighting
    this.engineHelper.setLighting(
      new Light({
        pos: [0.0, 10, 0],
        in: [1.0, 1.0, 1.0],
        attenuation: 0.01,
        ambientCoeff: 0.4,
        at: [0.0, 0.0, 0.0]
      })
    );
  }

  createGameObjects(): void {
    console.log('Creating test entities...');

    // Non-textured 2D entities - work perfectly in jsdom
    this.colourPlane = new PlaneColour(
      new Rect2d(100, 100, 200, 200),
      new Colour(0.2, 0.8, 0.2, 1.0) // Green colour
    );
    this.addEntity(this.colourPlane);

    this.triangle = new TriangleColour2d(
      new Rect2d(300, 100, 50, 50),
      new Colour(1.0, 0.0, 0.0, 1.0) // Red colour
    );
    this.addEntity(this.triangle);

    // Textured 3D entity - now works with Image mock in jest.setup.ts
    this.ground = new Plane3d(
      new Rect3d(0, 0, 0, 100, 0, 100),
      this.engineHelper.newVertexModel("grass", PlaneType.XZ)
    );
    this.addEntity(this.ground);

    console.log(`Created ${this.entities.length} test entities`);
  }

  loadResources(): void {
    console.log('Loading test resources...');

    // Set up synchronous fallbacks first for jsdom environment
    const fallbackPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    this.engineHelper.uvCache['grass'] = {
      uv: [0, 0, 1, 0, 1, 1, 0, 1],
      source: fallbackPng
    };
    this.engineHelper.uvCache['road'] = {
      uv: [0, 0, 1, 0, 1, 1, 0, 1],
      source: fallbackPng
    };
    this.engineHelper.uvCache['missing'] = {
      uv: [0, 0, 1, 0, 1, 1, 0, 1],
      source: fallbackPng
    };
    this.engineHelper.vertexUVCache['racing_car'] = {
      uv: [0, 0, 1, 0, 1, 1, 0, 1],
      source: fallbackPng
    };
    this.engineHelper.vertexUVCache['test-sphere'] = {
      uv: [0, 0, 1, 0, 1, 1, 0, 1],
      source: fallbackPng
    };

    // Attempt to load real assets (will fail in jsdom but that's okay)
    this.engineHelper
      .getResource("assets/atlas.txt")
      .then(
        ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3)
      )
      .then(() => console.log('Real atlas resources loaded'))
      .catch(err => console.log('Using fallback atlas resources'));

    this.engineHelper
      .getResource("assets/racing_car.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/racing_car.png",
          "racing_car"
        )
      )
      .then(() => console.log('Real racing car resources loaded'))
      .catch(err => console.log('Using fallback racing car resources'));

    this.engineHelper
      .getResource("assets/sphere.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/sphere.png",
          "test-sphere"
        )
      )
      .then(() => console.log('Real sphere resources loaded'))
      .catch(err => console.log('Using fallback sphere resources'));

    this.resourcesLoaded = true;
    console.log('Resources initialized with fallbacks');
  }

  render(): void {
    this.entities.forEach(entity => entity.render(this.engineHelper));
  }

  update(): void {
    this.entities.forEach(entity => entity.update(this.engineHelper));
  }

  event(event: any) {
    return undefined;
  }
}

/**
 * Initializes the engine with test configuration
 * Follows App initialization pattern from createCrystalCollectorApp
 */
export async function initializeTestEngine(): Promise<{
  app: App;
  world: TestWorld;
  engineHelper: EngineHelper;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
}> {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);

  const canvas = document.createElement('canvas');
  canvas.id = 'test-canvas';
  canvas.width = 800;
  canvas.height = 600;
  container.appendChild(canvas);

  const world = new TestWorld();

  const args = {
    world: world,
    elementId: 'test-container',
    canvasId: 'test-canvas',
    renderMode: '3d',
    camera: {
      near: 0.01,
      far: 1000.0,
      fov: 75.0,
      projection: 'perspective',
      aspect: canvas.width / canvas.height
    },
    fps: 60,
    isStepRender: true,
    resources: [] // Empty array so run() doesn't wait for external resources
  };

  const app = new App(args);

  return {
    app,
    world,
    engineHelper: world.engineHelper,
    canvas,
    container
  };
}

/**
 * Cleans up test environment
 */
export function cleanupTestEngine(): void {
  document.querySelectorAll('#test-canvas').forEach(el => el.remove());
  document.querySelectorAll('#test-container').forEach(el => el.remove());
  jest.clearAllTimers();
}
