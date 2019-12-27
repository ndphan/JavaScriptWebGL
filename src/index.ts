import ExampleApp from "./ExampleApp";
import App from "./SynarenEngine";

window.onload = function() {
  try {
    const args = {
      world: new ExampleApp(),
      elementId: "app",
      canvasId: "app-game",
      error: undefined,
      subscribe: undefined,
      camera: {
        near: 0.1,
        far: 1000.0,
        fov: 45.0,
        maxFov: (Math.atan(0.5) * 360.0) / Math.PI,
        isFovMax: true
      },
      eventThrottle: 1000.0 / 60.0,
      fps: 15,
      isStepRender: false
    };
    const app = new App(args);
    app.run().catch(console.error);
    app.unpause();
    window.onresize = app.resizeScreen;
  } catch (error) {
    console.error(error);
  }
};
