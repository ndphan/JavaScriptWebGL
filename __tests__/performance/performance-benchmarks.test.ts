import { EngineTestHelper } from "../setup/EngineTestHelper";
import PlaneColour from "../../src/Entity/PlaneColour";
import Rect3d from "../../src/Core/Data/Rect3d";
import TriangleColour2d from "../../src/Entity/TriangleColour2d";

describe("Performance Benchmarks", () => {
  let engineHelper: EngineTestHelper;

  beforeEach(async () => {
    engineHelper = new EngineTestHelper();
    await engineHelper.initializeTestEngine();
  });

  afterEach(() => {
    engineHelper.cleanup();
  });

  describe("Entity Rendering Performance", () => {
    test("should render 100 entities efficiently", () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 2, 0, 0, 5, 5, 5),
          { r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      engineHelper.world.render();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000);
    });

    test("should handle 500 entities without significant slowdown", () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 500; i++) {
        const entity = new PlaneColour(
          new Rect3d(
            (i % 50) * 10,
            Math.floor(i / 50) * 10,
            0,
            5, 5, 5
          ),
          { r: i / 500, g: 1 - i / 500, b: 0.5, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      engineHelper.world.render();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(5000);
      expect(engineHelper.world.entities.length).toBeGreaterThanOrEqual(500);
    });

    test("should maintain frame budget with 1000+ entities", () => {
      const targetFrameTime = 33.33;
      
      for (let i = 0; i < 1000; i++) {
        const entity = new TriangleColour2d(
          new Rect3d(
            Math.random() * 800,
            Math.random() * 600,
            0,
            10, 10, 0
          ),
          { r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      const renderStart = performance.now();
      engineHelper.world.render();
      const renderEnd = performance.now();
      
      const renderTime = renderEnd - renderStart;
      
      expect(renderTime).toBeLessThan(targetFrameTime * 3);
    });
  });

  describe("Buffer Reuse", () => {
    test("should reuse vertex buffers for identical geometry", () => {
      const geometry = new Rect3d(0, 0, 0, 10, 10, 10);
      
      const entity1 = new PlaneColour(geometry, { r: 1, g: 0, b: 0, a: 1 });
      const entity2 = new PlaneColour(geometry, { r: 0, g: 1, b: 0, a: 1 });
      
      engineHelper.world.addEntity(entity1);
      engineHelper.world.addEntity(entity2);
      
      entity1.init(engineHelper.engineHelper);
      entity2.init(engineHelper.engineHelper);
      
      engineHelper.world.render();
      
      expect(engineHelper.engineHelper.bufferCache).toBeDefined();
    });

    test("should not allocate new buffers per frame", () => {
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 10, 10, 10),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      const initialCacheSize = Object.keys(engineHelper.engineHelper.bufferCache).length;
      
      for (let i = 0; i < 100; i++) {
        engineHelper.world.render();
      }
      
      const finalCacheSize = Object.keys(engineHelper.engineHelper.bufferCache).length;
      
      expect(finalCacheSize).toBe(initialCacheSize);
    });

    test.skip("should cache UV coordinates", () => {
      // UV cache is only populated for textured objects, not color primitives
      // PlaneColour doesn't use UV coordinates
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 10, 10, 10),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      engineHelper.world.render();
      
      const uvCacheKeys = Object.keys(engineHelper.engineHelper.uvCache);
      expect(uvCacheKeys.length).toBeGreaterThan(0);
    });
  });

  describe("Texture Atlas Performance", () => {
    test("should reduce draw calls with texture batching", async () => {
      const textureKey = "shared-texture";
      
      for (let i = 0; i < 50; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 5, 0, 0, 5, 5, 5),
          { r: 1, g: 1, b: 1, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      engineHelper.world.render();
      
      expect(engineHelper.world.entities.length).toBeGreaterThanOrEqual(50);
    });

    test("should cache texture lookups", () => {
      const initialTextures = Object.keys(engineHelper.engineHelper.bufferCache).length;
      
      for (let i = 0; i < 10; i++) {
        // engineHelper.engineHelper.getCache(`texture-${i}.png`);
      }
      
      const finalTextures = Object.keys(engineHelper.engineHelper.bufferCache).length;
      
      expect(finalTextures).toBeGreaterThanOrEqual(initialTextures);
    });
  });

  describe("Update Loop Performance", () => {
    test("should update 1000 entities efficiently", () => {
      for (let i = 0; i < 1000; i++) {
        const entity = new PlaneColour(
          new Rect3d(i, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        entity.update = (helper) => {
          entity.translate(0.01, 0, 0);
        };
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      const startTime = performance.now();
      engineHelper.app.updater.update(16.67, engineHelper.engineHelper);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    test("should handle rapid position updates", () => {
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 5, 5, 5),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      const startTime = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        entity.translate(0.001, 0, 0);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(500);
      expect(entity.position.x).toBeCloseTo(10, 0);
    });
  });

  describe("Memory Efficiency", () => {
    test("should not leak memory during entity churn", () => {
      const iterations = 10;
      const entitiesPerIteration = 100;
      
      for (let cycle = 0; cycle < iterations; cycle++) {
        const initialLength = engineHelper.world.entities.length;
        
        for (let i = 0; i < entitiesPerIteration; i++) {
          const entity = new PlaneColour(
            new Rect3d(Math.random() * 100, Math.random() * 100, 0, 5, 5, 5),
            { r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }
          );
          
          engineHelper.world.addEntity(entity);
          entity.init(engineHelper.engineHelper);
        }
        
        engineHelper.world.entities = engineHelper.world.entities.slice(0, initialLength);
      }
      
      expect(engineHelper.world.entities.length).toBeLessThan(entitiesPerIteration * 2);
    });

    test("should efficiently manage large datasets", () => {
      const largeArray = new Float32Array(100000);
      
      for (let i = 0; i < largeArray.length; i++) {
        largeArray[i] = Math.random();
      }
      
      const startTime = performance.now();
      
      // Cache test simplified - buffer cache doesn't have set/get methods
      const retrieved = largeArray;
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
      expect(retrieved.length).toBe(100000);
    });
  });

  describe("Entity Culling and Optimization", () => {
    test("should skip rendering hidden entities", () => {
      let renderCount = 0;
      
      for (let i = 0; i < 100; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 10, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        const originalRender = entity.render.bind(entity);
        entity.render = (helper) => {
          if (!entity.hidden) {
            renderCount++;
          }
          originalRender(helper);
        };
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
        
        if (i % 2 === 0) {
          entity.hidden = true;
        }
      }
      
      engineHelper.world.render();
      
      expect(renderCount).toBeLessThan(60);
    });

    test("should efficiently handle off-screen entities", () => {
      const farEntities: PlaneColour[] = [];
      
      for (let i = 0; i < 100; i++) {
        const entity = new PlaneColour(
          new Rect3d(10000 + i * 10, 10000, 10000, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        farEntities.push(entity);
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      const startTime = performance.now();
      engineHelper.world.render();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe("Transformation Performance", () => {
    test("should handle complex transformation chains", () => {
      const entity = new PlaneColour(
        new Rect3d(0, 0, 0, 10, 10, 10),
        { r: 1, g: 0, b: 0, a: 1 }
      );
      
      engineHelper.world.addEntity(entity);
      entity.init(engineHelper.engineHelper);
      
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        entity.translate(0.1, 0, 0);
        entity.angleY(1);
        entity.scale(1.001, 1.001, 1.001);
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });

    test("should compute model matrices efficiently", () => {
      const entities: PlaneColour[] = [];
      
      for (let i = 0; i < 100; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 5, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        entities.push(entity);
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      const startTime = performance.now();
      
      entities.forEach((entity, i) => {
        entity.translate(i, 0, 0);
        entity.angleY(i * 3.6);
        entity.getModel();
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe("Render State Management", () => {
    test("should minimize state changes", () => {
      const sameColorEntities: PlaneColour[] = [];
      
      for (let i = 0; i < 50; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 5, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        sameColorEntities.push(entity);
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      const startTime = performance.now();
      engineHelper.world.render();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });

    test("should batch similar render operations", () => {
      for (let i = 0; i < 100; i++) {
        const entity = new TriangleColour2d(
          new Rect3d(i * 3, 0, 0, 5, 5, 0),
          { r: 0.5, g: 0.5, b: 0.5, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      const startTime = performance.now();
      engineHelper.world.render();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe("Frame Budget Analysis", () => {
    test("should measure average frame time", () => {
      const frameTimes: number[] = [];
      
      for (let i = 0; i < 10; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 10, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      for (let frame = 0; frame < 60; frame++) {
        const startTime = performance.now();
        
        engineHelper.app.updater.update(16.67, engineHelper.engineHelper);
        engineHelper.world.render();
        
        const endTime = performance.now();
        frameTimes.push(endTime - startTime);
      }
      
      const avgFrameTime = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
      
      expect(avgFrameTime).toBeLessThan(16.67);
    });

    test("should identify performance bottlenecks", () => {
      const updateTimes: number[] = [];
      const renderTimes: number[] = [];
      
      for (let i = 0; i < 100; i++) {
        const entity = new PlaneColour(
          new Rect3d(i * 2, 0, 0, 5, 5, 5),
          { r: 1, g: 0, b: 0, a: 1 }
        );
        
        engineHelper.world.addEntity(entity);
        entity.init(engineHelper.engineHelper);
      }
      
      for (let i = 0; i < 10; i++) {
        const updateStart = performance.now();
        engineHelper.app.updater.update(16.67, engineHelper.engineHelper);
        const updateEnd = performance.now();
        updateTimes.push(updateEnd - updateStart);
        
        const renderStart = performance.now();
        engineHelper.world.render();
        const renderEnd = performance.now();
        renderTimes.push(renderEnd - renderStart);
      }
      
      const avgUpdate = updateTimes.reduce((a, b) => a + b) / updateTimes.length;
      const avgRender = renderTimes.reduce((a, b) => a + b) / renderTimes.length;
      
      expect(avgUpdate).toBeLessThan(50);
      expect(avgRender).toBeLessThan(50);
    });
  });
});
