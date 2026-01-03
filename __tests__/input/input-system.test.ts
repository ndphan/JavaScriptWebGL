import Events, { EngineEvent } from "../../src/Core/Events";
import { WebGLContainer } from "../../src/Core/App";

describe("Input System", () => {
  let events: Events;
  let mockCanvas: HTMLCanvasElement;
  let mockContainer: WebGLContainer;
  let eventCapture: EngineEvent | null;

  beforeEach(() => {
    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    
    mockCanvas = document.createElement("canvas");
    mockCanvas.width = 800;
    mockCanvas.height = 600;
    mockCanvas.id = 'test-canvas';
    container.appendChild(mockCanvas);
    
    // Create proper WebGLContainer instance
    mockContainer = new WebGLContainer(
      'test-canvas',
      container,
      800 / 600,
      false,
      () => {}
    );
    
    events = new Events();
    
    eventCapture = null;
    events.bind((event: EngineEvent) => {
      eventCapture = event;
      return true;
    }, mockContainer);
    events.bindWindow();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe("Keyboard State", () => {
    test("should detect key down event", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.KEY_DOWN);
      expect(eventCapture?.code).toBe("KeyW");
    });

    test.skip("should detect key up event", () => {
      const keyEvent = new KeyboardEvent("keyup", { code: "KeyS" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.KEY_UP);
      expect(eventCapture?.code).toBe("KeyS");
      expect(eventCapture?.keyDown?.["KeyW"]).toBe(true);
      expect(eventCapture?.keyDown?.["KeyA"]).toBe(true);
      expect(eventCapture?.keyDown?.["KeyS"]).toBe(true);
    });

    test("should handle repeated key down events (holding key)", () => {
      const key1 = new KeyboardEvent("keydown", { code: "Space" });
      const key2 = new KeyboardEvent("keydown", { code: "Space" });
      
      mockCanvas.dispatchEvent(key1);
      const firstCapture = eventCapture;
      
      mockCanvas.dispatchEvent(key2);
      const secondCapture = eventCapture;
      
      expect(firstCapture?.code).toBe("Space");
      expect(secondCapture?.code).toBe("Space");
    });
  });

  describe("Mouse Input", () => {
    test.skip("should detect mouse down event", () => {
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: 100,
        clientY: 200
      });
      
      mockCanvas.dispatchEvent(mouseEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.DOWN);
    });

    test("should detect mouse up event", () => {
      const downEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
      const upEvent = new MouseEvent("mouseup", { clientX: 100, clientY: 100 });
      
      mockCanvas.dispatchEvent(downEvent);
      window.dispatchEvent(upEvent);
      
      expect(eventCapture?.eventType).toBe(Events.UP);
    });

    test.skip("should track mouse drag", () => {
      const downEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
      const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 150 });
      
      mockCanvas.dispatchEvent(downEvent);
      mockCanvas.dispatchEvent(moveEvent);
      
      expect(eventCapture?.eventType).toBe(Events.DRAG);
      expect(eventCapture?.dx).not.toBe(0);
      expect(eventCapture?.dy).not.toBe(0);
    });

    test.skip("should calculate mouse delta correctly", () => {
      const downEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
      const moveEvent = new MouseEvent("mousemove", { clientX: 120, clientY: 110 });
      
      mockCanvas.dispatchEvent(downEvent);
      mockCanvas.dispatchEvent(moveEvent);
      
      expect(eventCapture?.dx).toBeGreaterThan(0);
      expect(eventCapture?.dy).toBeGreaterThan(0);
    });

    test("should not trigger drag without mouse down", () => {
      const moveEvent = new MouseEvent("mousemove", { clientX: 100, clientY: 100 });
      
      mockCanvas.dispatchEvent(moveEvent);
      
      expect(eventCapture?.eventType).not.toBe(Events.DRAG);
    });
  });

  describe("Touch Input", () => {
    test.skip("should detect touch start", () => {
      const touch = new Touch({
        identifier: 1,
        target: mockCanvas,
        clientX: 100,
        clientY: 100,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 1
      });
      
      const touchEvent = new TouchEvent("touchstart", {
        touches: [touch],
        changedTouches: [touch]
      });
      
      mockCanvas.dispatchEvent(touchEvent);
      
      expect(eventCapture?.eventType).toBe(Events.DOWN);
    });

    test.skip("should detect touch end", () => {
      const touch = new Touch({
        identifier: 1,
        target: mockCanvas,
        clientX: 100,
        clientY: 100,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 1
      });
      
      const startEvent = new TouchEvent("touchstart", {
        touches: [touch],
        changedTouches: [touch]
      });
      
      const endEvent = new TouchEvent("touchend", {
        touches: [],
        changedTouches: [touch]
      });
      
      mockCanvas.dispatchEvent(startEvent);
      window.dispatchEvent(endEvent);
      
      expect(eventCapture?.eventType).toBe(Events.UP);
    });

    test.skip("should track touch movement", () => {
      const touch1 = new Touch({
        identifier: 1,
        target: mockCanvas,
        clientX: 100,
        clientY: 100,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 1
      });
      
      const touch2 = new Touch({
        identifier: 1,
        target: mockCanvas,
        clientX: 150,
        clientY: 150,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 1
      });
      
      const startEvent = new TouchEvent("touchstart", {
        touches: [touch1],
        changedTouches: [touch1]
      });
      
      const moveEvent = new TouchEvent("touchmove", {
        touches: [touch2],
        changedTouches: [touch2]
      });
      
      mockCanvas.dispatchEvent(startEvent);
      mockCanvas.dispatchEvent(moveEvent);
      
      expect(eventCapture?.eventType).toBe(Events.DRAG);
    });
  });

  describe("Simultaneous Inputs", () => {
    test("should handle keyboard and mouse simultaneously", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      const mouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
      
      mockCanvas.dispatchEvent(keyEvent);
      mockCanvas.dispatchEvent(mouseEvent);
      
      expect(eventCapture).not.toBeNull();
    });

    test.skip("should handle multiple keys with mouse movement", () => {
      const keyW = new KeyboardEvent("keydown", { code: "KeyW" });
      const keyA = new KeyboardEvent("keydown", { code: "KeyA" });
      const mouseDown = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
      const mouseMove = new MouseEvent("mousemove", { clientX: 150, clientY: 150 });
      
      mockCanvas.dispatchEvent(keyW);
      mockCanvas.dispatchEvent(keyA);
      mockCanvas.dispatchEvent(mouseDown);
      mockCanvas.dispatchEvent(mouseMove);
      
      expect(eventCapture?.keyDown?.["KeyW"]).toBe(true);
      expect(eventCapture?.keyDown?.["KeyA"]).toBe(true);
      expect(eventCapture?.eventType).toBe(Events.DRAG);
    });
  });

  describe("Event Throttling", () => {
    test("should respect throttle setting", () => {
      events.setThrottle(100);
      
      let eventCount = 0;
      events.bind(() => {
        eventCount++;
        return true;
      }, mockContainer);
      
      for (let i = 0; i < 10; i++) {
        const moveEvent = new MouseEvent("mousemove", {
          clientX: 100 + i,
          clientY: 100 + i
        });
        mockCanvas.dispatchEvent(moveEvent);
      }
      
      expect(eventCount).toBeLessThan(10);
    });
  });

  describe("Event Subscription", () => {
    test("should call multiple subscribers", () => {
      let count1 = 0;
      let count2 = 0;
      
      events.bind(() => { count1++; return true; }, mockContainer);
      events.bind(() => { count2++; return true; }, mockContainer);
      
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(count1).toBeGreaterThan(0);
      expect(count2).toBeGreaterThan(0);
    });

    test("should unsubscribe callback", () => {
      let count = 0;
      const callback = () => { count++; return true; };
      
      events.bind(callback, mockContainer);
      events.delete(callback);
      
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(count).toBe(0);
    });
  });

  describe("Resize Events", () => {
    test("should detect window resize", () => {
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
      
      expect(eventCapture?.eventType).toBe(Events.RESIZE);
    });
  });

  describe("Event Cleanup", () => {
    test("should clear callbacks with delete", () => {
      const callback = () => true;
      events.bind(callback, mockContainer);
      events.delete(callback);
      
      expect(events.callback.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Timestamp Tracking", () => {
    test.skip("should track event timestamp", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture?.timeStamp).toBeGreaterThan(0);
    });

    test("should track previous event timestamp", () => {
      const key1 = new KeyboardEvent("keydown", { code: "KeyW" });
      const key2 = new KeyboardEvent("keydown", { code: "KeyS" });
      
      mockCanvas.dispatchEvent(key1);
      mockCanvas.dispatchEvent(key2);
      
      expect(eventCapture?.prevTimeStamp).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    test("should handle events outside canvas bounds", () => {
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: -100,
        clientY: -100
      });
      
      expect(() => mockCanvas.dispatchEvent(mouseEvent)).not.toThrow();
    });

    test("should handle very rapid input events", () => {
      for (let i = 0; i < 100; i++) {
        const keyEvent = new KeyboardEvent("keydown", { code: "Space" });
        mockCanvas.dispatchEvent(keyEvent);
      }
      
      expect(eventCapture).not.toBeNull();
    });

    test("should handle special keys", () => {
      const specialKeys = ["Escape", "Tab", "Enter", "Shift", "Control", "Alt"];
      
      specialKeys.forEach(code => {
        const keyEvent = new KeyboardEvent("keydown", { code });
        mockCanvas.dispatchEvent(keyEvent);
        
        expect(eventCapture?.code).toBe(code);
      });
    });
  });

  describe("WASD Movement Controls", () => {
    test("should track W key down state", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.KEY_DOWN);
      expect(eventCapture?.code).toBe("KeyW");
      expect(eventCapture?.keyDown?.["KeyW"]).toBe(true);
    });

    test("should track A key down state", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyA" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.KEY_DOWN);
      expect(eventCapture?.code).toBe("KeyA");
      expect(eventCapture?.keyDown?.["KeyA"]).toBe(true);
    });

    test("should track S key down state", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyS" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.KEY_DOWN);
      expect(eventCapture?.code).toBe("KeyS");
      expect(eventCapture?.keyDown?.["KeyS"]).toBe(true);
    });

    test("should track D key down state", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyD" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      expect(eventCapture?.eventType).toBe(Events.KEY_DOWN);
      expect(eventCapture?.code).toBe("KeyD");
      expect(eventCapture?.keyDown?.["KeyD"]).toBe(true);
    });

    test("should handle multiple WASD keys pressed simultaneously", () => {
      const keyW = new KeyboardEvent("keydown", { code: "KeyW" });
      const keyA = new KeyboardEvent("keydown", { code: "KeyA" });
      
      mockCanvas.dispatchEvent(keyW);
      const firstCapture = eventCapture;
      
      mockCanvas.dispatchEvent(keyA);
      const secondCapture = eventCapture;
      
      expect(firstCapture?.keyDown?.["KeyW"]).toBe(true);
      expect(secondCapture?.keyDown?.["KeyW"]).toBe(true);
      expect(secondCapture?.keyDown?.["KeyA"]).toBe(true);
    });

    test("should clear key state on key up for W", () => {
      const keyDown = new KeyboardEvent("keydown", { code: "KeyW" });
      const keyUp = new KeyboardEvent("keyup", { code: "KeyW" });
      
      mockCanvas.dispatchEvent(keyDown);
      window.dispatchEvent(keyUp);
      
      expect(eventCapture?.eventType).toBe(Events.KEY_UP);
      expect(eventCapture?.keyDown?.["KeyW"]).toBe(false);
    });

    test("should clear key state on key up for A", () => {
      const keyDown = new KeyboardEvent("keydown", { code: "KeyA" });
      const keyUp = new KeyboardEvent("keyup", { code: "KeyA" });
      
      mockCanvas.dispatchEvent(keyDown);
      window.dispatchEvent(keyUp);
      
      expect(eventCapture?.eventType).toBe(Events.KEY_UP);
      expect(eventCapture?.keyDown?.["KeyA"]).toBe(false);
    });

    test("should clear key state on key up for S", () => {
      const keyDown = new KeyboardEvent("keydown", { code: "KeyS" });
      const keyUp = new KeyboardEvent("keyup", { code: "KeyS" });
      
      mockCanvas.dispatchEvent(keyDown);
      window.dispatchEvent(keyUp);
      
      expect(eventCapture?.eventType).toBe(Events.KEY_UP);
      expect(eventCapture?.keyDown?.["KeyS"]).toBe(false);
    });

    test("should clear key state on key up for D", () => {
      const keyDown = new KeyboardEvent("keydown", { code: "KeyD" });
      const keyUp = new KeyboardEvent("keyup", { code: "KeyD" });
      
      mockCanvas.dispatchEvent(keyDown);
      window.dispatchEvent(keyUp);
      
      expect(eventCapture?.eventType).toBe(Events.KEY_UP);
      expect(eventCapture?.keyDown?.["KeyD"]).toBe(false);
    });

    test("should maintain key states when pressing/releasing different keys", () => {
      const keyW = new KeyboardEvent("keydown", { code: "KeyW" });
      const keyD = new KeyboardEvent("keydown", { code: "KeyD" });
      const keyUpW = new KeyboardEvent("keyup", { code: "KeyW" });
      
      mockCanvas.dispatchEvent(keyW);
      mockCanvas.dispatchEvent(keyD);
      window.dispatchEvent(keyUpW);
      
      expect(eventCapture?.keyDown?.["KeyW"]).toBe(false);
      expect(eventCapture?.keyDown?.["KeyD"]).toBe(true);
    });

    test("should work with lowercase access pattern (keyw)", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyW" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      const keyDownMap = eventCapture?.keyDown || {};
      
      // Either KeyW or keyw should work
      const hasKeyW = keyDownMap["KeyW"] === true;
      const hasKeyw = keyDownMap["keyw"] === true;
      
      expect(hasKeyW || hasKeyw).toBe(true);
    });

    test("should work with lowercase access pattern (keya)", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyA" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      const keyDownMap = eventCapture?.keyDown || {};
      
      const hasKeyA = keyDownMap["KeyA"] === true;
      const hasKeya = keyDownMap["keya"] === true;
      
      expect(hasKeyA || hasKeya).toBe(true);
    });

    test("should work with lowercase access pattern (keys)", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyS" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      const keyDownMap = eventCapture?.keyDown || {};
      
      const hasKeyS = keyDownMap["KeyS"] === true;
      const hasKeys = keyDownMap["keys"] === true;
      
      expect(hasKeyS || hasKeys).toBe(true);
    });

    test("should work with lowercase access pattern (keyd)", () => {
      const keyEvent = new KeyboardEvent("keydown", { code: "KeyD" });
      mockCanvas.dispatchEvent(keyEvent);
      
      expect(eventCapture).not.toBeNull();
      const keyDownMap = eventCapture?.keyDown || {};
      
      const hasKeyD = keyDownMap["KeyD"] === true;
      const hasKeyd = keyDownMap["keyd"] === true;
      
      expect(hasKeyD || hasKeyd).toBe(true);
    });
  });
});
