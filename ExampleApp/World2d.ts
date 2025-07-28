import {
  Colour,
  EngineEvent,
  EngineObject,
  Events,
  ObjectManager,
  PlaneColour,
  Rect2d
} from "synaren-engine";

export default class World2d extends ObjectManager {
  plane1: PlaneColour;
  plane2: PlaneColour;
  
  constructor() {
    super();
  }

  render() {
    this.entities.forEach((ent: EngineObject) => {
      ent.render(this.engineHelper);
    });
  }

  update() {
    this.entities.forEach((ent: EngineObject) => {
      if (ent) ent.update(this.engineHelper);
    });
  }

  event(event: EngineEvent) {
    super.event(event);
    if (event.eventType === Events.DRAG) {
      // In 2D mode, use camera2d for panning
      console.log('2D Camera drag event:', { dx: -event.dxRaw, dy: event.dyRaw });
      this.engineHelper.camera.camera2d.pan2d(100, 
        this.engineHelper.camera.camera2d.position.x - event.dxRaw * 0.01,
        this.engineHelper.camera.camera2d.position.y + event.dyRaw * 0.01
      );
    }
    return undefined;
  }

  loadResources() {
    console.log('Loading 2D resources...');
    // No complex resources needed for 2D demo
  }

  init() {
    console.log('World2d init() called');
    super.init();
    
    // Create some simple 2D colored rectangles
    this.plane1 = new PlaneColour(
      new Rect2d(0.1, 0.1, 0.3, 0.3),
      new Colour(255, 0, 0, 255) // Red rectangle
    );
    this.addEntity(this.plane1);

    this.plane2 = new PlaneColour(
      new Rect2d(0.6, 0.1, 0.3, 0.3),
      new Colour(0, 255, 0, 255) // Green rectangle
    );
    this.addEntity(this.plane2);

    console.log('2D entities added, total:', this.entities.length);
    super.init();
  }
}
