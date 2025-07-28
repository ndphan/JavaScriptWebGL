import { App } from "synaren-engine";
import World2d from "./World2d";

const createApp2d = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const args = {
    world: new World2d(),
    elementId: "app",
    canvasId: "app-game",
    error: undefined,
    subscribe: undefined,
    renderMode: '2d', // Enable 2D mode
    camera: {
      near: 0.1,
      far: 100.0,
      fov: 45.0,
      renderMode: '2d', // Explicitly set 2D mode in camera options
      aspect,
    },
    aspectRatio: aspect,
    eventThrottle: 1000.0 / 60.0,
    fps: 30,
    isStepRender: false,
  };
  
  console.log('Creating 2D app with args:', args);
  const app = new App(args);
  app.run().catch(console.error);
  app.unpause();
  
  window.onresize = () => {
    location.reload();
  };
};

window.onload = function () {
  try {
    createApp2d();
  } catch (error) {
    console.error(error);
  }
};
