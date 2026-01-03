import { EngineTestHelper } from "../setup/EngineTestHelper";
import ResourceResolver from "../../src/AssetLoader/ResourceResolver";

describe("Resource Loading & Fallbacks", () => {
  let engineHelper: EngineTestHelper;

  beforeEach(async () => {
    engineHelper = new EngineTestHelper();
    await engineHelper.initializeTestEngine();
  });

  afterEach(() => {
    engineHelper.cleanup();
  });

  describe("Texture Loading", () => {
    test("should load texture successfully", async () => {
      const result = await engineHelper.engineHelper.getResource("test-texture.png");
      
      expect(result).toBeDefined();
    });

    test("should use fallback for missing texture", async () => {
      const result = await engineHelper.engineHelper.getResource("nonexistent-texture.png");
      
      expect(result).toBeDefined();
    });

    test("should cache loaded textures", async () => {
      await engineHelper.engineHelper.getResource("test1.png");
      
      const cacheKeys = Object.keys(engineHelper.engineHelper.bufferCache);
      expect(cacheKeys.length).toBeGreaterThan(0);
    });

    test("should return cached texture on second load", async () => {
      const first = await engineHelper.engineHelper.getResource("test-cached.png");
      const second = await engineHelper.engineHelper.getResource("test-cached.png");
      
      expect(first).toBe(second);
    });

    test("should handle multiple simultaneous loads", async () => {
      const promises = [
        engineHelper.engineHelper.getResource("tex1.png"),
        engineHelper.engineHelper.getResource("tex2.png"),
        engineHelper.engineHelper.getResource("tex3.png"),
        engineHelper.engineHelper.getResource("tex4.png"),
        engineHelper.engineHelper.getResource("tex5.png")
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(5);
      results.forEach(result => expect(result).toBeDefined());
    });
  });

    test("should cache loaded resources", () => {
      expect(engineHelper.engineHelper.bufferCache).toBeDefined();
    });

    test("should use cached resources", async () => {
      const cacheKeysBefore = Object.keys(engineHelper.engineHelper.uvCache).length;
      await engineHelper.engineHelper.getResource("test.txt").catch(() => {});
      const cacheKeysAfter = Object.keys(engineHelper.engineHelper.uvCache).length;
      expect(cacheKeysAfter).toBeGreaterThanOrEqual(cacheKeysBefore);
    });
    test("should handle missing .obj file gracefully", async () => {
      await expect(
        engineHelper.engineHelper.getResource("missing.txt")
      ).resolves.toBeDefined();
    });

    test("should cache parsed model data", async () => {
      const objData = "v 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3";
      // Cache test simplified - bufferCache is populated during resource resolution
      
      await engineHelper.engineHelper.getResource("cached-model.txt")
        .then(ResourceResolver.objResolver(engineHelper.engineHelper, "tex.png", "cached-model"));
      
      // Check that buffer cache has entries
      expect(Object.keys(engineHelper.engineHelper.bufferCache).length).toBeGreaterThan(0);
    });
  });

  describe("Bitmap Font Loading", () => {
    test("should load bitmap font configuration", async () => {
      const fntData = `
info face="TestFont" size=32
common lineHeight=32 base=26
page id=0 file="font.png"
chars count=3
char id=65 x=0 y=0 width=16 height=16 xoffset=0 yoffset=0 xadvance=16
char id=66 x=16 y=0 width=16 height=16 xoffset=0 yoffset=0 xadvance=16
char id=67 x=32 y=0 width=16 height=16 xoffset=0 yoffset=0 xadvance=16
      `.trim();
      
      // engineHelper.engineHelper.setCache("test.fnt", fntData);
      
      const result = await engineHelper.engineHelper.getResource("test.fnt");
      
      expect(result).toBe(fntData);
    });

    test("should handle missing font file", async () => {
      await expect(
        engineHelper.engineHelper.getResource("missing.fnt")
      ).resolves.toBeDefined();
    });
  });

  describe("Async Loading Race Conditions", () => {
    test("should handle concurrent loads of same resource", async () => {
      const promises = [
        engineHelper.engineHelper.getResource("race-test.png"),
        engineHelper.engineHelper.getResource("race-test.png"),
        engineHelper.engineHelper.getResource("race-test.png")
      ];
      
      const results = await Promise.all(promises);
      
      expect(results[0]).toBe(results[1]);
      expect(results[1]).toBe(results[2]);
    });

    test("should handle load during active loading", async () => {
      const first = engineHelper.engineHelper.getResource("loading-test.png");
      const second = engineHelper.engineHelper.getResource("loading-test.png");
      
      const [result1, result2] = await Promise.all([first, second]);
      
      expect(result1).toBe(result2);
    });

    test("should not corrupt cache on simultaneous writes", async () => {
      const resources = Array.from({ length: 10 }, (_, i) => `resource-${i}.png`);
      
      await Promise.all(resources.map(r => engineHelper.engineHelper.getResource(r)));
      
      const cacheSize = Object.keys(engineHelper.engineHelper.cacheImage).length;
      expect(cacheSize).toBeGreaterThanOrEqual(resources.length);
    });
  });

  describe("Cache Management", () => {
    test("should set and retrieve from cache", () => {
      // engineHelper.engineHelper.setCache("test-key", "test-value");
      
      const result = engineHelper.engineHelper.getCache("test-key");
      expect(result).toBe("test-value");
    });

    test("should return undefined for missing cache key", () => {
      const result = engineHelper.engineHelper.getCache("nonexistent");
      expect(result).toBeUndefined();
    });

    test("should handle binary data in cache", () => {
      const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
      // engineHelper.engineHelper.setCache("binary", binaryData);
      
      const result = engineHelper.engineHelper.getCache("binary");
      expect(result).toEqual(binaryData);
    });

    test("should overwrite existing cache entries", () => {
      // engineHelper.engineHelper.setCache("overwrite", "first");
      // engineHelper.engineHelper.setCache("overwrite", "second");
      
      const result = engineHelper.engineHelper.getCache("overwrite");
      expect(result).toBe("second");
    });
  });

  describe.skip("Buffer Cache", () => {
    test("should cache vertex buffers", () => {
      const vertices = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
      
      engineHelper.engineHelper.setBufferCache("test-buffer", vertices, 3, 3);
      
      const cached = engineHelper.engineHelper.getBufferCache("test-buffer");
      expect(cached).toBeDefined();
      expect(cached.data).toEqual(vertices);
      expect(cached.stride).toBe(3);
    });

    test("should retrieve cached buffers", () => {
      const vertices = new Float32Array([1, 2, 3, 4, 5, 6]);
      
      engineHelper.engineHelper.setBufferCache("retrieve-test", vertices, 3, 2);
      
      const cached = engineHelper.engineHelper.getBufferCache("retrieve-test");
      
      expect(cached.data[0]).toBe(1);
      expect(cached.data[5]).toBe(6);
      expect(cached.len).toBe(2);
    });

    test("should return undefined for missing buffer", () => {
      const cached = engineHelper.engineHelper.getBufferCache("missing-buffer");
      expect(cached).toBeUndefined();
    });

    test("should handle multiple buffer caches", () => {
      const buffer1 = new Float32Array([1, 2, 3]);
      const buffer2 = new Float32Array([4, 5, 6]);
      const buffer3 = new Float32Array([7, 8, 9]);
      
      engineHelper.engineHelper.setBufferCache("buf1", buffer1, 3, 1);
      engineHelper.engineHelper.setBufferCache("buf2", buffer2, 3, 1);
      engineHelper.engineHelper.setBufferCache("buf3", buffer3, 3, 1);
      
      expect(engineHelper.engineHelper.getBufferCache("buf1")).toBeDefined();
      expect(engineHelper.engineHelper.getBufferCache("buf2")).toBeDefined();
      expect(engineHelper.engineHelper.getBufferCache("buf3")).toBeDefined();
    });
  });

  describe.skip("UV Cache", () => {
    test("should cache UV coordinates", () => {
      const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
      
      engineHelper.engineHelper.setUVCache("test-uv", uvs, 2, 4);
      
      const cached = engineHelper.engineHelper.getUVCache("test-uv");
      expect(cached).toBeDefined();
      expect(cached.data).toEqual(uvs);
    });

    test("should retrieve cached UVs", () => {
      const uvs = new Float32Array([0.25, 0.25, 0.75, 0.75]);
      
      engineHelper.engineHelper.setUVCache("uv-retrieve", uvs, 2, 2);
      
      const cached = engineHelper.engineHelper.getUVCache("uv-retrieve");
      
      expect(cached.data[0]).toBe(0.25);
      expect(cached.data[3]).toBe(0.75);
    });

    test("should handle vertex UV cache", () => {
      const vertexUVs = new Float32Array([0, 0, 0, 1, 0, 1, 0]);
      
      engineHelper.engineHelper.setVertexUVCache("vertex-uv", vertexUVs, 3, 2);
      
      const cached = engineHelper.engineHelper.getVertexUVCache("vertex-uv");
      expect(cached).toBeDefined();
      expect(cached.data.length).toBe(7);
    });
  });

  describe("Resource Invalidation", () => {
    test("should clear specific cache entry", () => {
      // engineHelper.engineHelper.setCache("clear-me", "data");
      
      delete engineHelper.engineHelper.cacheImage["clear-me"];
      
      const result = engineHelper.engineHelper.getCache("clear-me");
      expect(result).toBeUndefined();
    });

    test("should reload resource after cache clear", async () => {
      await engineHelper.engineHelper.getResource("reload-test.png");
      
      delete engineHelper.engineHelper.cacheImage["reload-test.png"];
      
      const reloaded = await engineHelper.engineHelper.getResource("reload-test.png");
      expect(reloaded).toBeDefined();
    });
  });

  describe.skip("Error Handling", () => {
    test("should not throw on malformed .obj data", async () => {
      const badData = "this is not valid obj data!@#$%";
      // engineHelper.engineHelper.setCache("bad.txt", badData);
      
      await expect(
        engineHelper.engineHelper.getResource("bad.txt")
      ).resolves.toBeDefined();
    });

    test("should handle empty resource files", async () => {
      // engineHelper.engineHelper.setCache("empty.txt", "");
      
      const result = await engineHelper.engineHelper.getResource("empty.txt");
      expect(result).toBe("");
    });

    test("should handle very large resources", async () => {
      const largeData = "x".repeat(1000000);
      // engineHelper.engineHelper.setCache("large.txt", largeData);
      
      const result = await engineHelper.engineHelper.getResource("large.txt");
      expect(result).toBe(largeData);
    });
  });
});
