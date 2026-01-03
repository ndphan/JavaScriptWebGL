import CameraFollower from "../../src/Core/EngineEntity/CameraFollower";
import ObjectManager from "../../src/Manager/ObjectManager";
import Coordinate from "../../src/Core/Data/Coordinate";
import Rect3d from "../../src/Core/Data/Rect3d";
import Camera from "../../src/Core/Camera";
import EngineHelper from "../../src/Core/EngineHelper";
import ModelObject3d from "../../src/Core/EngineEntity/ModelObject3d";
import TextureVertexModel from "../../src/Core/Data/TextureVertexModel";

// Simple test entity that extends ModelObject3d
class TestEntity extends ModelObject3d {
  constructor(rect: Rect3d) {
    super(rect, new TextureVertexModel());
  }
  
  init(engineHelper: EngineHelper) {
    // Simplified init - no shader creation needed for position tests
  }
  
  update(engineHelper: EngineHelper) {
    // Execute all features (mimics EngineObject.update)
    this.features.forEach(feature => feature.update(this, engineHelper));
  }
  
  render(engineHelper: EngineHelper) {
    // No rendering needed for these tests
  }
}

describe("CameraFollower Feature", () => {
  let objectManager: ObjectManager;
  let mockEntity: TestEntity;
  let camera: Camera;
  let mockEngineHelper: EngineHelper;

  beforeEach(() => {
    // Create mock camera with jsdom canvas
    const mockCanvas = document.createElement('canvas');
    mockCanvas.width = 800;
    mockCanvas.height = 600;
    
    camera = new Camera();
    camera.setupCamera(
      {
        near: 0.1,
        far: 1000.0,
        fov: 75.0,
        maxFov: 90.0,
        isFovMax: false,
        projection: 'perspective',
        renderMode: '3d'
      },
      800 / 600,
      mockCanvas,
      '3d'
    );
    
    // Create a minimal mock engine helper
    mockEngineHelper = {
      camera: camera
    } as EngineHelper;
    
    objectManager = new ObjectManager();
    objectManager.init();
    // Set the engine helper so ObjectManager.update() works
    objectManager.engineHelper = mockEngineHelper;
    
    // Create a test entity
    mockEntity = new TestEntity(new Rect3d(0, 0, 0, 1, 1, 1));
    mockEntity.init(mockEngineHelper);
  });

  afterEach(() => {
    // Cleanup
  });

  describe("Feature Initialization", () => {
    test("should mark entity as low priority when feature is added", () => {
      const cameraFollower = new CameraFollower(camera);
      
      expect(mockEntity.isLowPriority).toBe(false);
      
      mockEntity.addFeature(cameraFollower);
      
      expect(mockEntity.isLowPriority).toBe(true);
    });

    test("should add feature to entity's features array", () => {
      const cameraFollower = new CameraFollower(camera);
      
      expect(mockEntity.features.length).toBe(0);
      
      mockEntity.addFeature(cameraFollower);
      
      expect(mockEntity.features.length).toBe(1);
      expect(mockEntity.features[0]).toBe(cameraFollower);
    });

    test("should support multiple features on same entity", () => {
      const cameraFollower1 = new CameraFollower(camera);
      const cameraFollower2 = new CameraFollower(camera, new Coordinate(5, 0, 0));
      
      mockEntity.addFeature(cameraFollower1);
      mockEntity.addFeature(cameraFollower2);
      
      expect(mockEntity.features.length).toBe(2);
    });
  });

  describe("Camera Following Behavior", () => {
    test("should sync entity position to camera position", () => {
      const cameraFollower = new CameraFollower(camera);
      mockEntity.addFeature(cameraFollower);
      
      // Move camera to new position
      camera.camera3d.center(10, 20, 30);
      
      // Update feature
      cameraFollower.update(mockEntity, mockEngineHelper);
      
      // Entity should now match camera position
      expect(mockEntity.position.x).toBe(10);
      expect(mockEntity.position.y).toBe(20);
      expect(mockEntity.position.z).toBe(30);
    });

    test("should apply offset when following camera", () => {
      const offset = new Coordinate(5, 10, 15);
      const cameraFollower = new CameraFollower(camera, offset);
      mockEntity.addFeature(cameraFollower);
      
      // Move camera to position
      camera.camera3d.center(100, 200, 300);
      
      // Update feature
      cameraFollower.update(mockEntity, mockEngineHelper);
      
      // Entity should be at camera position + offset
      expect(mockEntity.position.x).toBe(105);
      expect(mockEntity.position.y).toBe(210);
      expect(mockEntity.position.z).toBe(315);
    });

    test("should continuously track camera movement", () => {
      const cameraFollower = new CameraFollower(camera);
      mockEntity.addFeature(cameraFollower);
      
      // First position
      camera.camera3d.center(10, 10, 10);
      cameraFollower.update(mockEntity, mockEngineHelper);
      expect(mockEntity.position.x).toBe(10);
      
      // Second position
      camera.camera3d.center(20, 20, 20);
      cameraFollower.update(mockEntity, mockEngineHelper);
      expect(mockEntity.position.x).toBe(20);
      
      // Third position
      camera.camera3d.center(30, 30, 30);
      cameraFollower.update(mockEntity, mockEngineHelper);
      expect(mockEntity.position.x).toBe(30);
    });
  });

  describe("ObjectManager Integration", () => {
    test("should update low priority entities after high priority entities", () => {
      const updateOrder: string[] = [];
      
      // Create high priority entity
      const highPriorityEntity = new TestEntity(new Rect3d(0, 0, 0, 1, 1, 1));
      highPriorityEntity.init(mockEngineHelper);
      const originalHighUpdate = highPriorityEntity.update.bind(highPriorityEntity);
      highPriorityEntity.update = (engineHelper) => {
        originalHighUpdate(engineHelper);
        updateOrder.push('high');
      };
      
      // Create low priority entity with camera follower
      const lowPriorityEntity = new TestEntity(new Rect3d(0, 0, 0, 1, 1, 1));
      lowPriorityEntity.init(mockEngineHelper);
      const cameraFollower = new CameraFollower(camera);
      lowPriorityEntity.addFeature(cameraFollower);
      const originalLowUpdate = lowPriorityEntity.update.bind(lowPriorityEntity);
      lowPriorityEntity.update = function(engineHelper) {
        originalLowUpdate(engineHelper);
        updateOrder.push('low');
      };
      
      objectManager.addEntity(highPriorityEntity);
      objectManager.addEntity(lowPriorityEntity);
      
      objectManager.update();
      
      expect(updateOrder).toEqual(['high', 'low']);
    });

    test("should handle multiple low priority entities", () => {
      const entity1 = new TestEntity(new Rect3d(0, 0, 0, 1, 1, 1));
      entity1.init(mockEngineHelper);
      const follower1 = new CameraFollower(camera);
      entity1.addFeature(follower1);
      
      const entity2 = new TestEntity(new Rect3d(0, 0, 0, 1, 1, 1));
      entity2.init(mockEngineHelper);
      const follower2 = new CameraFollower(camera);
      entity2.addFeature(follower2);
      
      objectManager.addEntity(entity1);
      objectManager.addEntity(entity2);
      
      camera.camera3d.center(50, 60, 70);
      objectManager.update();
      
      expect(entity1.position.x).toBe(50);
      expect(entity2.position.x).toBe(50);
    });
  });

  describe("Feature Update Lifecycle", () => {
    test("should call feature update during entity update", () => {
      let featureUpdateCalled = false;
      
      const cameraFollower = new CameraFollower(camera);
      cameraFollower.update = (entity, helper) => {
        featureUpdateCalled = true;
      };
      
      mockEntity.addFeature(cameraFollower);
      mockEntity.update(mockEngineHelper);
      
      expect(featureUpdateCalled).toBe(true);
    });

    test("should execute all features in order", () => {
      const executionOrder: number[] = [];
      
      const feature1 = new CameraFollower(camera);
      feature1.update = () => executionOrder.push(1);
      
      const feature2 = new CameraFollower(camera);
      feature2.update = () => executionOrder.push(2);
      
      const feature3 = new CameraFollower(camera);
      feature3.update = () => executionOrder.push(3);
      
      mockEntity.addFeature(feature1);
      mockEntity.addFeature(feature2);
      mockEntity.addFeature(feature3);
      
      mockEntity.update(mockEngineHelper);
      
      expect(executionOrder).toEqual([1, 2, 3]);
    });
  });

  describe("Edge Cases", () => {
    test("should handle camera at origin", () => {
      const cameraFollower = new CameraFollower(camera);
      mockEntity.addFeature(cameraFollower);
      
      camera.camera3d.center(0, 0, 0);
      cameraFollower.update(mockEntity, mockEngineHelper);
      
      expect(mockEntity.position.x).toBe(0);
      expect(mockEntity.position.y).toBe(0);
      expect(mockEntity.position.z).toBe(0);
    });

    test("should handle negative camera positions", () => {
      const cameraFollower = new CameraFollower(camera);
      mockEntity.addFeature(cameraFollower);
      
      camera.camera3d.center(-100, -200, -300);
      cameraFollower.update(mockEntity, mockEngineHelper);
      
      expect(mockEntity.position.x).toBe(-100);
      expect(mockEntity.position.y).toBe(-200);
      expect(mockEntity.position.z).toBe(-300);
    });

    test("should handle negative offset", () => {
      const offset = new Coordinate(-10, -20, -30);
      const cameraFollower = new CameraFollower(camera, offset);
      mockEntity.addFeature(cameraFollower);
      
      camera.camera3d.center(100, 100, 100);
      cameraFollower.update(mockEntity, mockEngineHelper);
      
      expect(mockEntity.position.x).toBe(90);
      expect(mockEntity.position.y).toBe(80);
      expect(mockEntity.position.z).toBe(70);
    });
  });
});
