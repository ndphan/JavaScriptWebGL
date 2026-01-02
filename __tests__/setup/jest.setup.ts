/**
 * Jest Setup File
 * Minimal setup for E2E testing with real WebGL
 */

import { jest } from '@jest/globals';

// Mock Image for texture loading - simulates immediate successful load
global.Image = class MockImage {
  private _onload: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  width: number = 256;
  height: number = 256;
  private _src: string = '';
  crossOrigin: string | null = null;

  get onload() {
    return this._onload;
  }

  set onload(callback: ((event: Event) => void) | null) {
    this._onload = callback;
    // If src was already set, trigger immediately
    if (this._src && callback) {
      queueMicrotask(() => {
        if (this._onload) {
          this._onload(new Event('load'));
        }
      });
    }
  }

  get src() {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
    // Trigger onload after src is set (mimics real image loading)
    if (this._onload) {
      queueMicrotask(() => {
        if (this._onload) {
          this._onload(new Event('load'));
        }
      });
    }
  }
} as any;

// Override document.createElement to return MockImage for 'img' elements
const originalCreateElement = document.createElement.bind(document);
document.createElement = function(tagName: string, options?: any): any {
  if (tagName === 'img') {
    return new (global.Image as any)();
  }
  return originalCreateElement(tagName, options);
};

// Mock HTMLImageElement.prototype methods if needed
if (typeof HTMLImageElement !== 'undefined') {
  HTMLImageElement.prototype.decode = function() {
    return Promise.resolve();
  };
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(Date.now()), 16) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

console.log('✓ Jest setup complete - E2E testing mode');
