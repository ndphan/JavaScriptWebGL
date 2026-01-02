# Synaren Engine Test Suite

Comprehensive test suite for the Synaren WebGL 3D Game Engine.

## Setup Complete ✅

The test framework has been successfully configured with:
- Jest test runner with TypeScript support (ts-jest)
- JSDOM environment for browser API mocking
- WebGL context mocking for headless testing
- Comprehensive test fixtures and helpers
- 4 test suites covering different aspects of the engine

## Test Structure

```
__tests__/
├── setup/                      # Test configuration and helpers
│   ├── jest.setup.ts          # Jest global setup with WebGL mocks
│   ├── EngineTestHelper.ts    # Common engine initialization fixtures
│   └── EntityTestHelper.ts    # Entity creation and management fixtures
├── core/                       # Core engine tests
│   └── engine.test.ts         # App initialization, camera, lifecycle
├── entity/                     # Entity management tests
│   ├── entity-manager.test.ts # Entity creation, transformations, lifecycle
│   └── 3d-objects.test.ts     # Object3d, Plane3d, Sphere tests
└── physics/                    # Physics and collision tests
    └── physics.test.ts        # Movement, collision detection, camera following
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

## Test Categories

### Core Engine Tests (`core/engine.test.ts`)
- ✓ App initialization with default and custom configurations
- ✓ Canvas creation with specified dimensions
- ✓ 2D and 3D render mode support
- ✓ World initialization and resource loading
- ✓ Rendering lifecycle (render/update methods)
- ✓ WebGL context creation
- ✓ Camera configuration (perspective/orthographic)
- ✓ Error handling for missing elements

### Entity Management Tests (`entity/entity-manager.test.ts`)
- ✓ Entity creation (Object3d, Plane3d)
- ✓ Position, scale, and rotation transformations
- ✓ Entity lifecycle (init, render, update)
- ✓ Multiple entity management
- ✓ Entity properties and bounds
- ✓ Collection management and cleanup
- ✓ Edge cases (negative positions, large coordinates, zero/small dimensions)

### 3D Objects Tests (`entity/3d-objects.test.ts`)
- ✓ Object3d creation and transformations
- ✓ Plane3d (ground) creation and positioning
- ✓ Multiple objects in scenes
- ✓ Independent transformations
- ✓ Game scenario layouts (racing, platformer, crystal collector)
- ✓ Bounding box validation
- ✓ Performance patterns (single large plane vs. multiple small ones)
- ✓ Many objects handling (50+ objects)

### Physics and Collision Tests (`physics/physics.test.ts`)
- ✓ Movement patterns with rotation (forward, backward, strafing)
- ✓ AABB collision detection (overlap, separation, edge cases)
- ✓ 3D distance calculations
- ✓ Range-based detection
- ✓ Camera following (3rd person view offset calculations)
- ✓ Boundary checking and clamping
- ✓ Velocity and acceleration simulation
- ✓ Friction/dampening effects

## Test Fixtures

### EngineTestHelper
Common setup for engine initialization:

```typescript
import { initializeTestEngine, cleanupTestEngine } from '../setup/EngineTestHelper';

// Initialize engine with config
const { app, world, canvas } = await initializeTestEngine({
  width: 800,
  height: 600,
  renderMode: '3d',
  near: 0.01,
  far: 1000.0,
  fov: 75.0,
  projection: 'perspective'
});

// Clean up after test
cleanupTestEngine();
```

### EntityTestHelper
Fixtures for creating and managing entities:

```typescript
import { EntityTestFixture } from '../setup/EntityTestHelper';

const fixture = new EntityTestFixture();

// Add entities
const ground = fixture.addGround(50, 50);
const player = fixture.addPlayer(0, 1, 0);
const obstacle = fixture.addObstacle(10, 1, 5);

// Render and update all
fixture.renderAll();
fixture.updateAll();

// Clean up
fixture.cleanup();
```

## WebGL Mocking

The test suite uses comprehensive WebGL mocks to simulate the rendering context without requiring a real GPU. All WebGL methods are mocked with Jest functions, allowing tests to run in Node.js/jsdom environment.

Key mocked features:
- WebGL context creation
- Buffer operations
- Shader compilation
- Texture loading
- Rendering commands
- Image loading

## Writing New Tests

### Pattern for New Test Files

```typescript
import { EntityTestFixture } from '../setup/EntityTestHelper';
import { cleanupTestEngine } from '../setup/EngineTestHelper';

describe('Feature Name', () => {
  let fixture: EntityTestFixture;

  beforeEach(() => {
    fixture = new EntityTestFixture();
  });

  afterEach(() => {
    fixture.cleanup();
    cleanupTestEngine();
  });

  test('should do something', () => {
    const entity = fixture.addPlayer();
    // Test assertions
    expect(entity).toBeDefined();
  });
});
```

### Helper Functions

Use helper functions for common assertions:

```typescript
import { expectEntityPosition, expectEntityScale } from '../setup/EntityTestHelper';

// Validate position with tolerance
expectEntityPosition(entity, x, y, z, tolerance);

// Validate scale
expectEntityScale(entity, width, height, depth, tolerance);
```

## Coverage Goals

Target coverage metrics:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View coverage report:
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## Continuous Integration

Tests are designed to run in CI/CD environments. They:
- ✓ Run in headless mode (no GPU required)
- ✓ Use deterministic mocks (no random failures)
- ✓ Complete quickly (< 10 seconds total)
- ✓ Clean up resources properly
- ✓ Have isolated test cases (no shared state)

## Troubleshooting

### Tests Timing Out
Increase timeout in jest.config.js:
```javascript
testTimeout: 20000  // 20 seconds
```

### WebGL Mock Issues
Check `__tests__/setup/jest.setup.ts` for WebGL mock implementation. Add missing methods as needed.

### Memory Leaks
Ensure `cleanupTestEngine()` is called in `afterEach` hooks to remove DOM elements.

## Contributing

When adding new features to the engine:
1. Write tests first (TDD approach)
2. Use existing fixtures when possible
3. Follow the established test structure
4. Ensure tests pass before submitting PR
5. Maintain or improve code coverage
