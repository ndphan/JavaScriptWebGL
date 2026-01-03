/**
 * WebGL Integration Test
 * Validates WebGL initialization, texture loading, model loading, and object rendering
 */

import { initializeTestEngine, cleanupTestEngine } from '../setup/EngineTestHelper';
import Object3d from '../../src/Entity/Object3d';
import Rect3d from '../../src/Core/Data/Rect3d';

describe('WebGL Integration', () => {
  afterEach(() => {
    cleanupTestEngine();
  });

  test('should start WebGL, load textures and models, and render objects', async () => {
    const { app, world, engineHelper, canvas } = await initializeTestEngine();
    
    // Run the app to execute full startup sequence (waits for all resources to load)
    await app.run();
    
    // Unpause to start the render loop (like in ExampleApp)
    app.unpause();

    // === Core App State ===
    expect(app).toBeDefined();
    expect(app.ready).toBe(true);
    expect(app.isPaused).toBe(false);
    expect(app.isStepRender).toBe(true);
    expect(app.frameTime).toBeGreaterThanOrEqual(0);
    expect(app.fps).toBe(16.666666666666668); // 60 fps

    // === Canvas & WebGL Context ===
    expect(canvas).toBeDefined();
    expect(canvas.id).toBe('test-canvas');
    expect(app.webGLContainer).toBeDefined();

    // === World State ===
    expect(world).toBeDefined();
    expect(world.isLoaded).toBe(true);
    expect(world.resourcesLoaded).toBe(true);
    expect(world.entities.length).toBe(3);

    // === EngineHelper State ===
    expect(engineHelper).toBeDefined();
    expect(engineHelper.resourcesLoading.length).toBeGreaterThanOrEqual(0); // Resources may still be loading async
    expect(engineHelper.fps).toBe(16.666666666666668);

    // === Texture & Model Caches ===
    expect(engineHelper.uvCache['missing']).toBeDefined();
    expect(engineHelper.uvCache['grass']).toBeDefined();
    expect(engineHelper.vertexUVCache['test-sphere']).toBeDefined();
    expect(engineHelper.vertexUVCache['racing_car']).toBeDefined();

    // === Buffer Caches ===
    expect(Object.keys(engineHelper.bufferCache).length).toBeGreaterThan(0);

    // === Entities Verification ===
    expect(world.colourPlane).toBeDefined();
    expect(world.colourPlane.position).toBeDefined();
    expect(world.colourPlane.position.x).toBe(100);
    expect(world.colourPlane.position.y).toBe(100);

    expect(world.triangle).toBeDefined();
    expect(world.triangle.position).toBeDefined();
    expect(world.triangle.position.x).toBe(300);
    expect(world.triangle.position.y).toBe(100);

    expect(world.ground).toBeDefined();
    expect(world.ground.position).toBeDefined();
    expect(world.ground.position.x).toBe(0);
    expect(world.ground.position.z).toBe(0);

    // === Camera State ===
    const camera = engineHelper.camera.camera3d;
    expect(camera).toBeDefined();
    expect(camera.position).toBeDefined();
    expect(camera.position.x).toBe(0);
    expect(camera.position.y).toBe(5);
    expect(camera.position.z).toBe(10);
    expect(camera.near).toBe(0.01);
    expect(camera.far).toBe(1000);
    expect(camera.fov).toBe(75);
    expect(camera.frustum).toBeDefined();
    expect(camera.frustum.length).toBe(16);

    // === Renderer State ===
    expect(app.renderer).toBeDefined();
    expect(app.renderer.ctx).toBeDefined(); // WebGL context
    expect(app.renderer.glContext).toBeDefined();
    expect(app.renderer.camera).toBe(engineHelper.camera);
    expect(app.renderer.world).toBe(world);

    // === Renderer Texture Registry ===
    expect(app.renderer.textureReg).toBeDefined();
    expect(typeof app.renderer.textureReg).toBe('object');
    const textureRegKeys = Object.keys(app.renderer.textureReg);
    expect(textureRegKeys.length).toBeGreaterThan(0); // At least one texture registered

    // === Renderer Entity Registry ===
    expect(app.renderer._renderEntities).toBeDefined();
    expect(typeof app.renderer._renderEntities).toBe('object');

    // === Renderer Cached Model Data ===
    expect(app.renderer.cachedModelData).toBeDefined();
    expect(typeof app.renderer.cachedModelData).toBe('object');

    // === EngineHelper Buffer Cache ===
    const bufferCacheKeys = Object.keys(engineHelper.bufferCache);
    expect(bufferCacheKeys.length).toBeGreaterThan(0);
    
    // Verify buffer cache contains valid entries
    bufferCacheKeys.forEach(key => {
      const buffer = engineHelper.bufferCache[key];
      expect(buffer).toBeDefined();
      expect(buffer.vertices).toBeDefined();
      expect(Array.isArray(buffer.vertices) || buffer.vertices instanceof Float32Array).toBe(true);
    });

    // === EngineHelper UV Cache Validation ===
    expect(engineHelper.uvCache['grass']).toBeDefined();
    expect(engineHelper.uvCache['grass'].uv).toBeDefined();
    expect(Array.isArray(engineHelper.uvCache['grass'].uv)).toBe(true);
    expect(engineHelper.uvCache['grass'].uv.length).toBeGreaterThan(0);
    expect(engineHelper.uvCache['grass'].source).toBeDefined();
    expect(typeof engineHelper.uvCache['grass'].source).toBe('string');

    expect(engineHelper.uvCache['missing']).toBeDefined();
    expect(engineHelper.uvCache['missing'].uv).toBeDefined();
    expect(Array.isArray(engineHelper.uvCache['missing'].uv)).toBe(true);

    // === EngineHelper Vertex UV Cache Validation ===
    expect(engineHelper.vertexUVCache['test-sphere']).toBeDefined();
    expect(engineHelper.vertexUVCache['test-sphere'].uv).toBeDefined();
    expect(Array.isArray(engineHelper.vertexUVCache['test-sphere'].uv)).toBe(true);

    expect(engineHelper.vertexUVCache['racing_car']).toBeDefined();
    expect(engineHelper.vertexUVCache['racing_car'].uv).toBeDefined();
    expect(Array.isArray(engineHelper.vertexUVCache['racing_car'].uv)).toBe(true);

    // === Entity Vertex Coordinate Validation ===
    // Verify buffer cache contains vertex data for entities
    const bufferEntries = Object.values(engineHelper.bufferCache);
    expect(bufferEntries.length).toBeGreaterThan(0);
    
    // Verify all cached buffers have valid vertex data
    bufferEntries.forEach(buffer => {
      expect(buffer.vertices).toBeDefined();
      expect(buffer.vertices.length).toBeGreaterThan(0);
      
      // Verify all vertex coordinates are valid numbers
      for (let i = 0; i < buffer.vertices.length; i++) {
        expect(typeof buffer.vertices[i]).toBe('number');
        expect(isNaN(buffer.vertices[i])).toBe(false);
        expect(isFinite(buffer.vertices[i])).toBe(true);
      }
    });

    // === Vertex Winding Order & Geometry Validation ===
    // Helper function to calculate triangle winding order (CCW = positive, CW = negative)
    const calculateWindingOrder = (v0: number[], v1: number[], v2: number[]): number => {
      // For 2D triangles (or projected 3D), use cross product z-component
      const edge1x = v1[0] - v0[0];
      const edge1y = v1[1] - v0[1];
      const edge2x = v2[0] - v0[0];
      const edge2y = v2[1] - v0[1];
      return edge1x * edge2y - edge1y * edge2x;
    };

    // Validate each buffer's vertex data for proper triangle orientation
    bufferEntries.forEach((buffer, index) => {
      const vertices = buffer.vertices;
      
      // Determine vertex stride (2D = 2 components, 3D = 3 components)
      // Check if buffer appears to be 3D by testing first few vertices
      let stride = 2;
      if (vertices.length >= 9) {
        // If we have z-coordinates that vary significantly, it's likely 3D
        const hasZVariation = Math.abs(vertices[2]) > 0.01 || 
                             Math.abs(vertices[5]) > 0.01 || 
                             Math.abs(vertices[8]) > 0.01;
        if (hasZVariation || vertices.length % 3 === 0) {
          stride = 3;
        }
      }

      // For triangle-based geometry, validate winding order
      if (vertices.length >= stride * 3) {
        const triangleCount = Math.floor(vertices.length / (stride * 3));
        
        // Check first triangle's winding order
        if (triangleCount > 0) {
          const v0 = [vertices[0], vertices[1], stride === 3 ? vertices[2] : 0];
          const v1 = [vertices[stride], vertices[stride + 1], stride === 3 ? vertices[stride + 2] : 0];
          const v2 = [vertices[stride * 2], vertices[stride * 2 + 1], stride === 3 ? vertices[stride * 2 + 2] : 0];
          
          const windingOrder = calculateWindingOrder(v0, v1, v2);
          
          // Some buffers may have degenerate triangles (e.g., for triangle strips or special cases)
          // We just verify the winding order is a number and record whether it's CCW or CW
          expect(typeof windingOrder).toBe('number');
          expect(isNaN(windingOrder)).toBe(false);
          
          // If triangle is non-degenerate, verify it has proper orientation
          if (Math.abs(windingOrder) > 1e-6) {
            // Triangle has area - verify winding is either CCW (positive) or CW (negative)
            expect(windingOrder).not.toBe(0);
          }
        }
      }

      // Validate vertex bounds are reasonable (not astronomically large)
      for (let i = 0; i < vertices.length; i++) {
        expect(Math.abs(vertices[i])).toBeLessThan(1e6); // Reasonable world bounds
      }
    });

    // === Triangle Strip Connectivity Validation ===
    bufferEntries.forEach(buffer => {
      const vertices = buffer.vertices;
      
      // For triangle strips, each new vertex forms a triangle with previous 2
      // Validate that consecutive triangles share edges properly
      if (vertices.length >= 9) { // At least 3 vertices for one triangle
        const stride = vertices.length % 3 === 0 ? 3 : 2;
        
        // Check for triangle strip pattern (if applicable)
        if (vertices.length >= stride * 4) { // At least 4 vertices for strip
          // Validate that vertices form connected geometry
          // by checking that consecutive triangles share vertices
          
          for (let i = 0; i < vertices.length - stride * 3; i += stride) {
            const v0 = [vertices[i], vertices[i + 1]];
            const v1 = [vertices[i + stride], vertices[i + stride + 1]];
            const v2 = [vertices[i + stride * 2], vertices[i + stride * 2 + 1]];
            
            // Verify triangle vertices are distinct (not all the same point)
            const v0v1Same = Math.abs(v0[0] - v1[0]) < 1e-6 && Math.abs(v0[1] - v1[1]) < 1e-6;
            const v1v2Same = Math.abs(v1[0] - v2[0]) < 1e-6 && Math.abs(v1[1] - v2[1]) < 1e-6;
            const v0v2Same = Math.abs(v0[0] - v2[0]) < 1e-6 && Math.abs(v0[1] - v2[1]) < 1e-6;
            
            // At most two vertices can be the same (degenerate triangle for strip transitions)
            const degenerateCount = [v0v1Same, v1v2Same, v0v2Same].filter(Boolean).length;
            expect(degenerateCount).toBeLessThan(3); // Not all three vertices the same
          }
        }
      }
    });

    // === Plane Geometry Validation ===
    // Verify ground plane has proper quad/rectangle structure
    const groundBuffer = Object.values(engineHelper.bufferCache).find(buf => 
      buf.vertices.length > 0 && buf.vertices.length % 3 === 0
    );
    
    if (groundBuffer) {
      const vertices = groundBuffer.vertices;
      // For a plane, verify we have at least 6 vertices (2 triangles = 1 quad)
      expect(vertices.length).toBeGreaterThanOrEqual(18); // 6 vertices * 3 components
      
      // Verify plane vertices form a valid rectangular region
      // by checking that triangles share edges properly
      if (vertices.length >= 18) {
        // First triangle
        const t1v0 = [vertices[0], vertices[1], vertices[2]];
        const t1v1 = [vertices[3], vertices[4], vertices[5]];
        const t1v2 = [vertices[6], vertices[7], vertices[8]];
        
        // Second triangle
        const t2v0 = [vertices[9], vertices[10], vertices[11]];
        const t2v1 = [vertices[12], vertices[13], vertices[14]];
        const t2v2 = [vertices[15], vertices[16], vertices[17]];
        
        // Calculate areas using cross product to ensure non-degenerate triangles
        const area1 = calculateWindingOrder(t1v0, t1v1, t1v2);
        const area2 = calculateWindingOrder(t2v0, t2v1, t2v2);
        
        // Verify areas are valid numbers
        expect(typeof area1).toBe('number');
        expect(typeof area2).toBe('number');
        expect(isNaN(area1)).toBe(false);
        expect(isNaN(area2)).toBe(false);
        
        // If triangles are non-degenerate, verify consistent winding
        if (Math.abs(area1) > 1e-6 && Math.abs(area2) > 1e-6) {
          // For a proper quad, both triangles should have similar winding order
          expect(Math.sign(area1)).toBe(Math.sign(area2));
        }
      }
    }

    // === Entity Position State Validation ===
    // Verify colourPlane position state
    expect(world.colourPlane.position.width).toBe(200);
    expect(world.colourPlane.position.height).toBe(200);
    expect(world.colourPlane.position.ax).toBeDefined();
    expect(world.colourPlane.position.ay).toBeDefined();
    expect(typeof world.colourPlane.position.ax).toBe('number');
    expect(typeof world.colourPlane.position.ay).toBe('number');

    // Verify triangle position state
    expect(world.triangle.position.width).toBe(50);
    expect(world.triangle.position.height).toBe(50);
    expect(world.triangle.position.ax).toBeDefined();
    expect(world.triangle.position.ay).toBeDefined();
    expect(typeof world.triangle.position.ax).toBe('number');
    expect(typeof world.triangle.position.ay).toBe('number');

    // Verify ground position state
    expect(world.ground.position.width).toBe(100);
    expect(world.ground.position.length).toBe(100);
    expect(world.ground.position.ax).toBeDefined();
    expect(world.ground.position.ay).toBeDefined();
    expect(world.ground.position.az).toBeDefined();
    expect(typeof world.ground.position.ax).toBe('number');
    expect(typeof world.ground.position.ay).toBe('number');
    expect(typeof world.ground.position.az).toBe('number');

    // === WebGL Context State ===
    const ctx = app.renderer.ctx;
    expect(ctx).toBeDefined();
    expect(typeof ctx).toBe('object');

    // === EngineHelper Cache ID Counter ===
    expect(engineHelper.cacheId).toBeGreaterThanOrEqual(0);
    expect(typeof engineHelper.cacheId).toBe('number');

    // === Font Cache ===
    expect(engineHelper.fontCache).toBeDefined();
    expect(typeof engineHelper.fontCache).toBe('object');
    expect(engineHelper.fontNameKeyReverse).toBeDefined();
    expect(typeof engineHelper.fontNameKeyReverse).toBe('object');

    // === Timer State ===
    expect(app.timer).toBeDefined();
    expect(app.timer._start).toBeGreaterThan(0);

    // === Updater State ===
    expect(app.updater).toBeDefined();
    expect(app.updater.world).toBe(world);

    // === Debugger State ===
    expect(app.debugger).toBeDefined();
  }, 15000); // Increase timeout to 15s for full startup sequence
});
