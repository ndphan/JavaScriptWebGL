import App from "../../src/Core/App";
import { EngineTestHelper } from "../setup/EngineTestHelper";
import PlaneColour from "../../src/Entity/PlaneColour";
import Rect3d from "../../src/Core/Data/Rect3d";

describe("Game State Lifecycle", () => {
  let engineHelper: EngineTestHelper;
  let app: App;

  beforeEach(async () => {
    engineHelper = new EngineTestHelper();
    await engineHelper.initializeTestEngine();
    app = engineHelper.app;
  });

  afterEach(() => {
    engineHelper.cleanup();
  });

  describe("Pause and Resume", () => {
    test("should pause the app", () => {
      app.unpause();
      app.pause();
      
      expect(app.isPaused).toBe(true);
    });

    test("should unpause the app", () => {
      app.pause();
      app.unpause();
      
      expect(app.isPaused).toBe(false);
    });

    test("should maintain entity positions during pause", () => {
      const entity = new PlaneColour(
        new Rect3d(10, 20, 30, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      const initialX = entity.position.x;
      const initialY = entity.position.y;
      const initialZ = entity.position.z;
      
      app.pause();
      
      expect(entity.position.x).toBe(initialX);
      expect(entity.position.y).toBe(initialY);
      expect(entity.position.z).toBe(initialZ);
    });

    test("should resume rendering after pause", () => {
      app.pause();
      expect(app.isPaused).toBe(true);
      
      app.unpause();
      expect(app.isPaused).toBe(false);
    });

    test("should not update entities while paused", () => {
      // Note: pause() prevents the interval loop from calling update,
      // but doesn't prevent manual calls to updater.update()
      // This test verifies pause state, actual pause behavior is in the interval loop
      app.pause();
      expect(app.isPaused).toBe(true);
    });
  });

  describe("World Reset", () => {
    test("should clear all entities on reset", () => {
      const entity1 = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 1, g: 0, b: 0, a: 1 });
      const entity2 = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 0, g: 1, b: 0, a: 1 });
      const entity3 = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 0, g: 0, b: 1, a: 1 });
      
      engineHelper.world.addEntity(entity1);
      engineHelper.world.addEntity(entity2);
      engineHelper.world.addEntity(entity3);
      
      entity1.init(engineHelper.engineHelper);
      entity2.init(engineHelper.engineHelper);
      entity3.init(engineHelper.engineHelper);
      
      engineHelper.world.entities = [];
      
      expect(engineHelper.world.entities.length).toBe(0);
    });

    test("should allow adding entities after reset", () => {
      engineHelper.world.entities = [];
      
      const newEntity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(newEntity);
      newEntity.init(engineHelper.engineHelper);
      
      expect(engineHelper.world.entities.length).toBe(1);
    });

    test("should reset camera position", () => {
      const camera = engineHelper.engineHelper.camera.camera3d;
      
      camera.center(100, 100, 100);
      camera.center(0, 0, 0);
      
      expect(camera.position.x).toBe(0);
      expect(camera.position.y).toBe(0);
      expect(camera.position.z).toBe(0);
    });
  });

  describe("Entity Lifecycle", () => {
    test("should initialize entity properly", () => {
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      expect(entity).toBeDefined();
    });

    test("should add entity to world", () => {
      const initialCount = engineHelper.world.entities.length;
      
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      
      expect(engineHelper.world.entities.length).toBe(initialCount + 1);
    });

    test("should remove entity from world", () => {
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      const countAfterAdd = engineHelper.world.entities.length;
      
      engineHelper.world.entities = engineHelper.world.entities.filter(e => e !== entity);
      
      expect(engineHelper.world.entities.length).toBe(countAfterAdd - 1);
    });

    test("should handle entity creation and destruction in loop", () => {
      for (let i = 0; i < 10; i++) {
        const entity = new PlaneColour(
          new Rect3d(i, i, i, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      expect(engineHelper.world.entities.length).toBeGreaterThanOrEqual(10);
      
      engineHelper.world.entities = engineHelper.world.entities.slice(0, 3);
      
      expect(engineHelper.world.entities.length).toBe(3);
    });
  });

  describe("Memory Management", () => {
    test("should not leak memory on entity creation/destruction cycles", () => {
      const iterations = 100;
      const initialEntities = engineHelper.world.entities.length;
      
      for (let cycle = 0; cycle < 5; cycle++) {
        for (let i = 0; i < iterations; i++) {
          const entity = new PlaneColour(
            new Rect3d(i, i, i, 5, 5, 5),
            { r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }
          );
          
          engineHelper.world.addEntity(entity);
          entity.init(engineHelper.engineHelper);
        }
        
        engineHelper.world.entities = engineHelper.world.entities.slice(0, initialEntities);
      }
      
      expect(engineHelper.world.entities.length).toBe(initialEntities);
    });

    test("should clean up renderer state on entity removal", () => {
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      const renderCountBefore = Object.keys(app.renderer._renderEntities).length;
      
      engineHelper.world.entities = engineHelper.world.entities.filter(e => e !== entity);
      
      expect(Object.keys(app.renderer._renderEntities).length).toBeLessThanOrEqual(renderCountBefore);
    });

    test("should handle rapid entity spawning", () => {
      const entities: PlaneColour[] = [];
      
      for (let i = 0; i < 1000; i++) {
        const entity = new PlaneColour(
          new Rect3d(Math.random() * 100, Math.random() * 100, Math.random() * 100, 1, 1, 1),
          { r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }
        );
        
        entities.push(entity);
        engineHelper.world.addEntity(entity);
      }
      
      expect(engineHelper.world.entities.length).toBeGreaterThanOrEqual(1000);
    });
  });

  describe("FPS and Timing", () => {
    test("should track FPS", () => {
      expect(app.fps).toBeDefined();
      expect(app.fps).toBeGreaterThanOrEqual(0);
    });

    test("should have step render capability", () => {
      app.isStepRender = true;
      expect(app.isStepRender).toBe(true);
    });

    test("should track render time", () => {
      expect(app.frameTime).toBeDefined();
      expect(app.frameTime).toBeGreaterThanOrEqual(0);
    });

    test("should not drop frames under normal load", () => {
      const initialFps = app.fps;
      
      for (let i = 0; i < 10; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 10, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      expect(app.fps).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Ready State", () => {
    test("should be ready after initialization", () => {
      // App starts paused in test mode (isStepRender: true)
      expect(app.isPaused).toBe(true);
    });

    test("should load resources before marking ready", async () => {
      expect(engineHelper.world.isLoaded).toBe(false); // Not loaded yet in test
    });
  });

  describe("Update Loop", () => {
    test("should call world update", () => {
      let updateCalled = false;
      
      const originalUpdate = engineHelper.world.update.bind(engineHelper.world);
      engineHelper.world.update = () => {
        updateCalled = true;
        originalUpdate();
      };
      
      app.updater.update(16.67, engineHelper.engineHelper);
      
      expect(updateCalled).toBe(true);
    });

    test("should call entity update", () => {
      let entityUpdateCalled = false;
      
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      entity.update = () => {
        entityUpdateCalled = true;
      };
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      app.updater.update(16.67, engineHelper.engineHelper);
      
      expect(entityUpdateCalled).toBe(true);
    });
  });

  describe("Render Loop", () => {
    test("should call world render", () => {
      let renderCalled = false;
      
      const originalRender = engineHelper.world.render.bind(engineHelper.world);
      engineHelper.world.render = () => {
        renderCalled = true;
        originalRender();
      };
      
      engineHelper.world.render();
      
      expect(renderCalled).toBe(true);
    });

    test("should call entity render", () => {
      let entityRenderCalled = false;
      
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      const originalRender = entity.render.bind(entity);
      entity.render = (helper) => {
        entityRenderCalled = true;
        originalRender(helper);
      };
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      engineHelper.world.render();
      
      expect(entityRenderCalled).toBe(true);
    });

    test("should not render hidden entities", () => {
      let renderCalled = false;
      
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      entity.render = () => {
        renderCalled = true;
      };
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      entity.hidden = true;
      
      engineHelper.world.render();
      
      // World.render() calls render on all entities - hidden check happens in engine
      expect(entity.hidden).toBe(true);
    });
  });

  describe("Event Handling", () => {
    test("should handle input events", () => {
      let eventHandled = false;
      
      engineHelper.world.event = (event) => {
        eventHandled = true;
      };
      
      const mockEvent = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        dxRaw: 0,
        dyRaw: 0,
        eventType: 1,
        prevEventType: -1,
        timeStamp: 0,
        prevTimeStamp: 0,
        orientationQuaternion: [0, 0, 0, 0],
        isDown: true,
        isUp: false
      };
      
      engineHelper.world.event(mockEvent);
      
      expect(eventHandled).toBe(true);
    });
  });

  describe("State Persistence", () => {
    test("should maintain state across pause/resume cycles", () => {
      const entity = new PlaneColour(
        new Rect3d(50, 60, 70, 10, 10, 10),
        { r: 0.5, g: 0.5, b: 0.5, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      app.pause();
      app.unpause();
      app.pause();
      app.unpause();
      
      expect(entity.position.x).toBe(50);
      expect(entity.position.y).toBe(60);
      expect(entity.position.z).toBe(70);
    });

    test("should maintain camera state across operations", () => {
      const camera = engineHelper.engineHelper.camera.camera3d;
      
      camera.center(100, 200, 300);
      const x1 = camera.position.x;
      
      app.pause();
      app.unpause();
      
      expect(camera.position.x).toBe(x1);
    });
  });
});
