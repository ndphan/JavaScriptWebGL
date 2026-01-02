/**
 * Entity Test Helper
 * Fixtures for creating and managing test entities
 * Follows patterns from ExampleApp games
 */

import Coordinate from '../../src/Core/Data/Coordinate';
import Rect3d from '../../src/Core/Data/Rect3d';
import EngineHelper from '../../src/Core/EngineHelper';
import Object3d from '../../src/Entity/Object3d';
import Plane3d from '../../src/Entity/Plane3d';
import PlaneType from '../../src/Core/Data/PlaneType';

/**
 * Helper to create test Object3d instances
 * Ensures vertex cache exists before creating the object
 */
export function createTestObject3d(
  engineHelper: EngineHelper,
  position?: Rect3d,
  vertexUvCacheId: string = 'test-texture'
): Object3d {
  // Ensure vertex cache exists (mimics resource loading)
  if (!engineHelper.vertexUVCache[vertexUvCacheId]) {
    engineHelper.vertexUVCache[vertexUvCacheId] = {
      uv: [],
      source: 'test'
    };
  }

  const rect = position || new Rect3d(0, 0, 0, 1, 1, 1);
  const obj = new Object3d(rect, vertexUvCacheId);
  obj.init(engineHelper);
  return obj;
}

/**
 * Helper to create test Plane3d instances
 * Uses newVertexModel like in RacingGame
 */
export function createTestPlane3d(
  engineHelper: EngineHelper,
  position?: Rect3d,
  textureName: string = 'test-texture'
): Plane3d {
  const rect = position || new Rect3d(0, 0, 0, 10, 0, 10);
  const vertexModel = engineHelper.newVertexModel(textureName, PlaneType.XZ);
  const plane = new Plane3d(rect, vertexModel);
  plane.init(engineHelper);
  return plane;
}

/**
 * Helper to create Rect3d for testing
 */
export function createTestRect3d(
  x: number = 0,
  y: number = 0,
  z: number = 0,
  width: number = 1,
  height: number = 1,
  depth: number = 1
): Rect3d {
  return new Rect3d(x, y, z, width, height, depth);
}

/**
 * Entity test fixture - manages test entities
 * Follows the ObjectManager pattern from games
 */
export class EntityTestFixture {
  engineHelper: EngineHelper;
  entities: Map<string, Object3d | Plane3d>;

  constructor(engineHelper: EngineHelper) {
    this.engineHelper = engineHelper;
    this.entities = new Map();
    
    // Ensure test vertex cache exists
    if (!this.engineHelper.vertexUVCache['test-texture']) {
      this.engineHelper.vertexUVCache['test-texture'] = {
        uv: [],
        source: 'test'
      };
    }
  }

  /**
   * Add ground plane like in games
   */
  addGround(width: number = 20, depth: number = 20): Plane3d {
    const ground = createTestPlane3d(
      this.engineHelper,
      new Rect3d(0, 0, 0, width, 0, depth)
    );
    this.entities.set('ground', ground);
    return ground;
  }

  /**
   * Add player object like in CrystalCollectorGame
   */
  addPlayer(x: number = 0, y: number = 1, z: number = 0): Object3d {
    const player = createTestObject3d(
      this.engineHelper,
      new Rect3d(x, y, z, 1, 1, 1)
    );
    this.entities.set('player', player);
    return player;
  }

  /**
   * Add obstacle object
   */
  addObstacle(x: number, y: number, z: number): Object3d {
    const obstacle = createTestObject3d(
      this.engineHelper,
      new Rect3d(x, y, z, 1, 1, 1)
    );
    const key = `obstacle-${this.entities.size}`;
    this.entities.set(key, obstacle);
    return obstacle;
  }

  /**
   * Cleanup all entities
   */
  cleanup(): void {
    this.entities.clear();
  }
}

/**
 * Helper to validate entity position
 */
export function expectEntityPosition(
  entity: Object3d | Plane3d,
  x: number,
  y: number,
  z: number,
  tolerance: number = 0.001
): void {
  const pos = entity.position;
  expect(Math.abs(pos.x - x)).toBeLessThan(tolerance);
  expect(Math.abs(pos.y - y)).toBeLessThan(tolerance);
  expect(Math.abs(pos.z - z)).toBeLessThan(tolerance);
}

/**
 * Helper to validate entity scale
 */
export function expectEntityScale(
  entity: Object3d | Plane3d,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  tolerance: number = 0.001
): void {
  const pos = entity.position;
  expect(Math.abs(pos.scaleX - scaleX)).toBeLessThan(tolerance);
  expect(Math.abs(pos.scaleY - scaleY)).toBeLessThan(tolerance);
  expect(Math.abs(pos.scaleZ - scaleZ)).toBeLessThan(tolerance);
}

/**
 * Creates a coordinate for testing
 */
export function createTestCoordinate(x: number = 0, y: number = 0, z: number = 0): Coordinate {
  return new Coordinate(x, y, z);
}

