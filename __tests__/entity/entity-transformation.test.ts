import EntityManager from "../../src/Manager/EntityManager";
import { EngineTestHelper } from "../setup/EngineTestHelper";
import Rect3d from "../../src/Core/Data/Rect3d";
import PlaneColour from "../../src/Entity/PlaneColour";

describe("Entity Transformation Pipeline", () => {
  let engineHelper: EngineTestHelper;
  let entity: PlaneColour;

  beforeEach(async () => {
    engineHelper = new EngineTestHelper();
    await engineHelper.initializeTestEngine();
    
    entity = new PlaneColour(
      new Rect3d(0, 0, 0, 10, 10, 10),
      { r: 1.0, g: 0, b: 0, a: 1.0 }
    );
    entity.init(engineHelper.engineHelper);
  });

  afterEach(() => {
    engineHelper.cleanup();
  });

  describe("Translation", () => {
    test("should translate entity position", () => {
      entity.translate(5, 10, 15);
      
      expect(entity.position.x).toBe(5);
      expect(entity.position.y).toBe(10);
      expect(entity.position.z).toBe(15);
    });

    test("should accumulate multiple translations", () => {
      entity.translate(5, 5, 5);
      entity.translate(3, 3, 3);
      
      expect(entity.position.x).toBe(8);
      expect(entity.position.y).toBe(8);
      expect(entity.position.z).toBe(8);
    });

    test("should handle negative translation", () => {
      entity.center(10, 10, 10);
      entity.translate(-5, -5, -5);
      
      expect(entity.position.x).toBe(5);
      expect(entity.position.y).toBe(5);
      expect(entity.position.z).toBe(5);
    });

    test("should update model matrix after translation", () => {
      const initialModel = Array.from(entity.getModel());
      
      entity.translate(10, 0, 0);
      
      expect(Array.from(entity.getModel())).not.toEqual(initialModel);
    });
  });

  describe("Rotation", () => {
    test("should rotate around X axis", () => {
      entity.angleX(45);
      expect(entity.position.ax).toBe(45);
    });

    test("should rotate around Y axis", () => {
      entity.angleY(90);
      expect(entity.position.ay).toBe(90);
    });

    test("should rotate around Z axis", () => {
      entity.angleZ(180);
      expect(entity.position.az).toBe(180);
    });

    test("should handle combined rotations", () => {
      entity.angleX(30);
      entity.angleY(45);
      entity.angleZ(60);
      
      expect(entity.position.ax).toBe(30);
      expect(entity.position.ay).toBe(45);
      expect(entity.position.az).toBe(60);
    });

    test("should update model matrix after rotation", () => {
      const initialModel = Array.from(entity.getModel());
      
      entity.angleY(90);
      
      expect(Array.from(entity.getModel())).not.toEqual(initialModel);
    });

    test("should handle rotation beyond 360 degrees", () => {
      entity.angleY(450);
      expect(entity.position.ay).toBe(450);
    });

    test("should handle negative rotation", () => {
      entity.angleZ(-90);
      expect(entity.position.az).toBe(-90);
    });
  });

  describe("Scaling", () => {
    test("should scale on X axis", () => {
      entity.scaleX(2);
      expect(entity.position.width).toBe(2);
      expect(entity.position.scaleX).toBe(2);
    });

    test("should scale on Y axis", () => {
      entity.scaleY(3);
      expect(entity.position.height).toBe(3);
      expect(entity.position.scaleY).toBe(3);
    });

    test("should scale on Z axis", () => {
      entity.scaleZ(0.5);
      expect(entity.position.scaleZ).toBe(0.5);
      // Note: scaleZ doesn't set position.length, only position.scaleZ
    });

    test("should scale uniformly", () => {
      entity.scale(2, 2, 2);
      
      expect(entity.position.width).toBe(2);
      expect(entity.position.height).toBe(2);
      expect(entity.position.length).toBe(2);
    });

    test("should handle non-uniform scaling", () => {
      entity.scale(2, 3, 0.5);
      
      expect(entity.position.width).toBe(2);
      expect(entity.position.height).toBe(3);
      expect(entity.position.length).toBe(0.5);
    });

    test("should update model matrix after scaling", () => {
      const initialModel = Array.from(entity.getModel());
      
      entity.scale(2, 2, 2);
      
      expect(Array.from(entity.getModel())).not.toEqual(initialModel);
    });

    test("should handle zero scale", () => {
      entity.scaleX(0);
      expect(entity.position.width).toBe(0);
    });

    test("should handle negative scale", () => {
      entity.scaleX(-1);
      expect(entity.position.width).toBe(-1);
    });
  });

  describe("Combined Transformations", () => {
    test("should apply translate then rotate", () => {
      entity.translate(10, 0, 0);
      entity.angleY(90);
      
      expect(entity.position.x).toBe(10);
      expect(entity.position.ay).toBe(90);
    });

    test("should apply rotate then scale", () => {
      entity.angleZ(45);
      entity.scale(2, 2, 2);
      
      expect(entity.position.az).toBe(45);
      expect(entity.position.width).toBe(2);
    });

    test("should apply all transformations in sequence", () => {
      entity.translate(5, 5, 5);
      entity.angleY(90);
      entity.scale(2, 2, 2);
      
      expect(entity.position.x).toBe(5);
      expect(entity.position.y).toBe(5);
      expect(entity.position.z).toBe(5);
      expect(entity.position.ay).toBe(90);
      expect(entity.position.width).toBe(2);
    });

    test("should produce valid model matrix for complex transformations", () => {
      entity.translate(10, 20, 30);
      entity.angleX(45);
      entity.angleY(90);
      entity.angleZ(30);
      entity.scale(2, 3, 0.5);
      
      const model = Array.from(entity.getModel());
      
      expect(model).toBeDefined();
      expect(model.length).toBe(16);
      
      const hasNaN = model.some(v => isNaN(v));
      const hasInfinity = model.some(v => !isFinite(v));
      
      expect(hasNaN).toBe(false);
      expect(hasInfinity).toBe(false);
    });
  });

  describe("Center Point", () => {
    test("should set center position", () => {
      entity.center(50, 60, 70);
      
      expect(entity.position.x).toBe(50);
      expect(entity.position.y).toBe(60);
      expect(entity.position.z).toBe(70);
    });

    test("should override previous position", () => {
      entity.translate(10, 10, 10);
      entity.center(0, 0, 0);
      
      expect(entity.position.x).toBe(0);
      expect(entity.position.y).toBe(0);
      expect(entity.position.z).toBe(0);
    });
  });

  describe("Rotation Origin", () => {
    test("should set rotation origin", () => {
      entity.rotateOrigin(5, 5, 5);
      
      expect(entity.position.originX).toBe(5);
      expect(entity.position.originY).toBe(5);
      expect(entity.position.originZ).toBe(5);
    });

    test("should rotate around custom origin", () => {
      entity.center(0, 0, 0);
      entity.rotateOrigin(10, 0, 0);
      entity.angleY(90);
      
      expect(entity.position.originX).toBe(10);
    });

    test("should set origin from Rect3d", () => {
      const rect = new Rect3d(15, 20, 25, 10, 10, 10);
      entity.rotateOriginRect(rect);
      
      expect(entity.position.originX).toBe(15);
      expect(entity.position.originY).toBe(20);
      expect(entity.position.originZ).toBe(25);
    });
  });

  describe("EntityManager Propagation", () => {
    test("should propagate transformations to child entities", () => {
      const manager = new EntityManager();
      const child1 = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 1, g: 0, b: 0, a: 1 });
      const child2 = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 0, g: 1, b: 0, a: 1 });
      
      manager.entities.push(child1);
      manager.entities.push(child2);
      
      child1.init(engineHelper.engineHelper);
      child2.init(engineHelper.engineHelper);
      
      manager.translate(10, 10, 10);
      
      expect(child1.position.x).toBe(10);
      expect(child2.position.x).toBe(10);
    });

    test("should propagate rotations to children", () => {
      const manager = new EntityManager();
      const child = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 1, g: 0, b: 0, a: 1 });
      
      manager.entities.push(child);
      child.init(engineHelper.engineHelper);
      
      manager.angleY(90);
      
      expect(child.position.ay).toBe(90);
    });

    test("should propagate scaling to children", () => {
      const manager = new EntityManager();
      const child = new PlaneColour(new Rect3d(0, 0, 0, 5, 5, 5), { r: 1, g: 0, b: 0, a: 1 });
      
      manager.entities.push(child);
      child.init(engineHelper.engineHelper);
      
      manager.scale(2, 2, 2);
      
      expect(child.position.width).toBe(2);
      expect(child.position.height).toBe(2);
      expect(child.position.length).toBe(2);
    });
  });

  describe("Model Matrix Validity", () => {
    test("should have valid initial model matrix", () => {
      const model = Array.from(entity.getModel());
      
      expect(model).toBeDefined();
      expect(model.length).toBe(16);
      
      const hasNaN = model.some(v => isNaN(v));
      expect(hasNaN).toBe(false);
    });

    test("should maintain valid matrix after transformations", () => {
      entity.translate(50, 50, 50);
      entity.angleY(90);
      entity.scale(2, 2, 2);
      
      const model = Array.from(entity.getModel());
      
      const hasNaN = model.some(v => isNaN(v));
      const hasInfinity = model.some(v => !isFinite(v));
      
      expect(hasNaN).toBe(false);
      expect(hasInfinity).toBe(false);
    });

    test("should handle extreme transformations", () => {
      entity.translate(10000, 10000, 10000);
      entity.angleY(3600);
      entity.scale(100, 100, 100);
      
      const model = Array.from(entity.getModel());
      
      const hasNaN = model.some(v => isNaN(v));
      const hasInfinity = model.some(v => !isFinite(v));
      
      expect(hasNaN).toBe(false);
      expect(hasInfinity).toBe(false);
    });
  });
});
