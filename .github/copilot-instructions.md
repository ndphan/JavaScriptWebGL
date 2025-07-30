# Synaren Engine - WebGL Game Development

## Architecture Overview

This is a **TypeScript WebGL 3D game engine** with two main repositories:
- **JavaScriptWebGL**: Core engine library (`synaren-engine` package)
- **Synaren-Games**: Game implementations and examples

### Core Engine Components

**Entity Hierarchy**: All game objects inherit from `EngineObject` → `EntityManager` → `ObjectManager`
- `ObjectManager`: Base for game worlds, manages entity collections
- `EntityManager`: Handles 3D transformations (scale, rotate, translate)
- `EngineObject`: Core rendering and update lifecycle

**App Initialization Pattern**:
```typescript
const args = {
  world: new MyGameWorld(),
  elementId: "app",
  canvasId: "app-game", 
  renderMode: '3d',
  camera: { near: 0.01, far: 1000.0, fov: 75.0, projection: 'perspective' }
};
const app = new App(args);
app.run().catch(console.error);
```

## Essential Development Patterns

### Game World Structure
Every game extends `ObjectManager` with this lifecycle:
```typescript
class MyGame extends ObjectManager {
  init() { /* Initialize camera, call createGameObjects() */ }
  loadResources() { /* Load .obj models, textures via ResourceResolver */ }
  createGameObjects() { /* Create and addEntity() all objects */ }
  render() { /* Call entity.render(engineHelper) for each */ }
  update() { /* Game logic, physics, camera following */ }
  event(event: EngineEvent) { /* Handle keyboard/mouse input */ }
}
```

### 3D Entity Creation
- **Objects**: `Object3d` for .obj models, `Plane3d` for grounds, `Sphere` for skyboxes
- **Positioning**: `new Rect3d(x, y, z, width, height, depth)`
- **Resources**: Use `ResourceResolver.objResolver()` for models, `bitmapResolver()` for textures
- **Performance**: Use single large `Plane3d` instead of multiple small ones (see RacingGame ground optimization)

### Camera Controls
```typescript
// Following camera (3rd person)
const cameraX = playerPos.x - Math.sin(rotation) * offset;
const cameraZ = playerPos.z + Math.cos(rotation) * offset;
this.engineHelper.camera.camera3d.center(cameraX, height, cameraZ);
this.engineHelper.camera.camera3d.lookAt(playerPos.x, playerPos.y, playerPos.z);
```

## Build & Development

**Commands**:
- `npm run serve:example` - Development server for ExampleApp demos
- `npm run build:example` - Production build for examples
- `npm run build` - Build engine library
- `npm run link` - Link engine for local development

**Project Structure**:
- `src/` - Core engine source
- `ExampleApp/` - Game examples and demos
- `public/assets/` - 3D models (.obj), textures (.png), configurations (.txt)
- `dist/` - Compiled engine output

## Key Conventions

**Asset Loading**: Models use `.txt` vertex files + `.png` textures loaded via `getResource()` promises
**Entity Management**: Always call `addEntity()` and `init(engineHelper)` for proper rendering pipeline
**Movement/Physics**: Use `Math.sin(rotation)` for X movement, `Math.cos(rotation)` for Z movement
**Game Registry**: Register games in `ExampleApp/index.ts` with `createFunction` pattern

**Resource Patterns**:
```typescript
this.engineHelper.getResource("assets/model.txt")
  .then(ResourceResolver.objResolver(this.engineHelper, "assets/texture.png", "cacheId"))
```

This engine powers 3D games with AI, physics, and complex 3D scenes - focus on the entity lifecycle and WebGL rendering pipeline.
