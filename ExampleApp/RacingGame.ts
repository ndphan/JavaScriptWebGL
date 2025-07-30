import {
  App,
  EngineEvent,
  EngineObject,
  Events,
  Object3d,
  ObjectManager,
  Rect3d,
  ResourceResolver
} from "synaren-engine";
import Cube from "./Cube";
import Ground3d from "./Ground3d";
import Sphere from "./Sphere";

interface RacingBot {
  car: Object3d;
  position: { x: number, y: number, z: number };
  speed: number;
  currentWaypoint: number;
  name: string;
  rotation: number;
}

interface Waypoint {
  x: number;
  z: number;
}

export default class RacingGame extends ObjectManager {
  // Game state
  gameStarted: boolean = false;
  gameEnded: boolean = false;
  raceTime: number = 0;
  currentLap: number = 1;
  totalLaps: number = 3;
  raceFinished: boolean = false;

  // Racing objects
  playerCar: Object3d;
  bots: RacingBot[] = [];
  ground: Ground3d;
  sky: Sphere;
  trackBarriers: Cube[] = [];

  // Race track waypoints (defines the racing line)
  waypoints: Waypoint[] = [
    { x: 0, z: 0 },
    { x: 8, z: 0 },
    { x: 12, z: 4 },
    { x: 12, z: 12 },
    { x: 8, z: 16 },
    { x: 0, z: 16 },
    { x: -8, z: 16 },
    { x: -12, z: 12 },
    { x: -12, z: 4 },
    { x: -8, z: 0 },
    { x: 0, z: 0 }  // Back to start
  ];

  // Player controls
  playerSpeed: number = 0;
  maxSpeed: number = 0.3;
  acceleration: number = 0.01;
  deceleration: number = 0.02;
  turnSpeed: number = 0.05;
  playerRotation: number = 0;
  playerPosition: { x: number, y: number, z: number } = { x: 0, y: 0.5, z: -2 };
  keys: { [key: string]: boolean } = {};

  // Game timer
  lastWaypoint: number = 0;

  constructor() {
    super();
  }

  createGameObjects() {
    try {
      // Create ground with proper cache ID
      this.ground = new Ground3d(
        new Rect3d(0.0, 0.0, 0.0, 30, 0, 30),
        "grass"
      );
      this.addEntity(this.ground);

      // Create sky with proper background texture
      this.sky = new Sphere(
        new Rect3d(0.0, 2.0, 0.0, 100.0, 100.0, 100.0),
        "background"
      );
      this.addEntity(this.sky);

      // Create track barriers
      this.createTrackBarriers();

      // Create player car
      this.createPlayerCar();

      // Create bot cars
      this.createBotCars();

      console.log('🏎️ Game objects created successfully!');
    } catch (error) {
      console.error('Error creating game objects:', error);
    }
  }

  createTrackBarriers() {
    // Create barriers around the track using cubes
    const barrierPositions = [
      // Outer barriers
      { x: 15, z: 8, w: 1, h: 2, d: 20 },
      { x: -15, z: 8, w: 1, h: 2, d: 20 },
      { x: 0, z: 20, w: 30, h: 2, d: 1 },
      { x: 0, z: -4, w: 30, h: 2, d: 1 },

      // Inner barriers for track definition
      { x: 5, z: 8, w: 1, h: 1, d: 8 },
      { x: -5, z: 8, w: 1, h: 1, d: 8 },
    ];

    barrierPositions.forEach(barrier => {
      const cube = new Cube(
        new Rect3d(barrier.x, barrier.h / 2, barrier.z, barrier.w, barrier.h, barrier.d),
        "assets/atlas.png",
        ["rock", "rock", "rock", "rock", "rock", "rock"]
      );
      this.trackBarriers.push(cube);
      this.addEntity(cube);
    });
  }

  createPlayerCar() {
    this.playerCar = new Object3d(
      new Rect3d(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z, 1.5, 1.5, 1.5),
      "racing_car"
    );
    this.playerCar.scale(0.5, 0.5, 0.5);
    this.addEntity(this.playerCar);
  }

  createBotCars() {
    const botNames = ['Speed Demon', 'Thunder Bolt', 'Turbo Racer', 'Lightning Fast'];

    for (let i = 0; i < 4; i++) {
      const bot: RacingBot = {
        car: new Object3d(
          new Rect3d(-2 + (i * 1), 0.5, -2, 1.5, 1.5, 1.5),
          "racing_car"
        ),
        position: { x: -2 + (i * 1), y: 0.5, z: -2 },
        speed: 0.15 + (Math.random() * 0.1), // Random speed variation
        currentWaypoint: 0,
        name: botNames[i],
        rotation: 0
      };

      bot.car.scale(0.5, 0.5, 0.5);
      bot.car.angleY(Math.random() * 360); // Random starting rotation
      this.bots.push(bot);
      this.addEntity(bot.car);
    }
  }

  startRace() {
    this.gameStarted = true;
    console.log('🏁 Race started! Use WASD to control your car.');
  }

  updatePlayerMovement() {
    if (!this.gameStarted || this.raceFinished) return;

    // Handle acceleration/deceleration
    if (this.keys['keys']) {
      this.playerSpeed = Math.min(this.playerSpeed + this.acceleration, this.maxSpeed);
    } else if (this.keys['keyw']) {
      this.playerSpeed = Math.max(this.playerSpeed - this.deceleration, -this.maxSpeed * 0.5);
    } else {
      // Natural deceleration
      if (this.playerSpeed > 0) {
        this.playerSpeed = Math.max(0, this.playerSpeed - this.deceleration * 0.5);
      } else {
        this.playerSpeed = Math.min(0, this.playerSpeed + this.deceleration * 0.5);
      }
    }

    // Handle turning
    if (this.keys['keya']) {
      this.playerRotation += this.turnSpeed;
    }
    if (this.keys['keyd']) {
      this.playerRotation -= this.turnSpeed;
    }

    // Update position based on rotation and speed
    this.playerPosition.x += Math.sin(this.playerRotation) * this.playerSpeed;
    this.playerPosition.z += Math.cos(this.playerRotation) * this.playerSpeed;

    // Update player car position and rotation
    if (this.playerCar) {
      this.playerCar.position.x = this.playerPosition.x;
      this.playerCar.position.z = this.playerPosition.z;
      this.playerCar.angleY(this.playerRotation * (180 / Math.PI));
    }

    // Check waypoint progress
    this.checkWaypoints();
  }

  updateBots() {
    if (!this.gameStarted || this.raceFinished) return;

    this.bots.forEach(bot => {
      const targetWaypoint = this.waypoints[bot.currentWaypoint];

      // Calculate direction to target waypoint
      const dx = targetWaypoint.x - bot.position.x;
      const dz = targetWaypoint.z - bot.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 2) {
        // Move to next waypoint
        bot.currentWaypoint = (bot.currentWaypoint + 1) % this.waypoints.length;
      }

      // Move towards waypoint
      if (distance > 0) {
        bot.position.x += (dx / distance) * bot.speed;
        bot.position.z += (dz / distance) * bot.speed;

        // Update bot rotation to face direction of movement
        bot.rotation = Math.atan2(dx, dz) * (180 / Math.PI);
      }

      // Update bot car position and rotation
      bot.car.position.x = bot.position.x;
      bot.car.position.z = bot.position.z;
      bot.car.angleY(bot.rotation);
    });
  }

  checkWaypoints() {
    const currentWaypoint = this.waypoints[this.lastWaypoint];
    const dx = this.playerPosition.x - currentWaypoint.x;
    const dz = this.playerPosition.z - currentWaypoint.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 3) {
      this.lastWaypoint = (this.lastWaypoint + 1) % this.waypoints.length;

      // Check if completed a lap
      if (this.lastWaypoint === 0) {
        this.currentLap++;
        console.log(`🏁 Lap ${this.currentLap - 1} completed!`);

        if (this.currentLap > this.totalLaps) {
          this.finishRace();
        }
      }
    }
  }

  finishRace() {
    this.raceFinished = true;
    console.log('🏆 Race finished!');
  }

  render() {
    this.entities.forEach((ent: EngineObject, index: number) => ent.render(this.engineHelper));
  }

  update() {
    if (this.gameStarted && !this.raceFinished) {
      this.raceTime += 1 / 60; // Assuming 60 FPS
    }

    this.updatePlayerMovement();
    this.updateBots();

    this.entities.forEach((ent: EngineObject) => ent.update(this.engineHelper));

    // Update sky position to follow camera
    const { x, y, z } = this.engineHelper.camera.camera3d.position;
    if (this.sky) {
      this.sky.center(x, y, z);
    }

    // Update camera to follow player
    if (this.playerCar && this.gameStarted) {
      const cameraOffset = 5;
      const cameraHeight = 3;

      const cameraX = this.playerPosition.x - Math.sin(this.playerRotation) * cameraOffset;
      const cameraZ = this.playerPosition.z - Math.cos(this.playerRotation) * cameraOffset;

      this.engineHelper.camera.camera3d.center(cameraX, cameraHeight, cameraZ);
      this.engineHelper.camera.camera3d.updateProjectionView();
    }
  }

  event(event: EngineEvent) {
    // Handle keyboard events
    if (event.eventType === Events.KEY_DOWN) {
      const keyEvent = event as any;
      if (keyEvent.code) {
        this.keys[keyEvent.code.toLowerCase()] = true;

        // Start game on spacebar
        if (keyEvent.code === 'Space' && !this.gameStarted && !this.gameEnded) {
          this.startRace();
        }
      }
    }

    if (event.eventType === Events.KEY_UP) {
      const keyEvent = event as any;
      if (keyEvent.code) {
        this.keys[keyEvent.code.toLowerCase()] = false;
      }
    }

    return undefined;
  }

  init() {
    this.engineHelper.camera.camera3d.center(0, 3, 5);
    this.engineHelper.camera.camera3d.updateProjectionView();
    this.createGameObjects(); // Create objects after resources are loaded
    super.init();
    console.log('🏎️ Racing Game initialized! Press SPACE to start racing!');
    console.log('🎮 Controls: W/S - Accelerate/Brake, A/D - Turn Left/Right');
  }

  loadResources() {
    console.log('Loading Racing game resources...');

    this.engineHelper
      .getResource("assets/racing_car.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/racing_car.png",
          "racing_car"
        )
      ).then(() => {
        console.log('Racing car resources loaded');
      })
      .catch(err => console.error('Racing car resource error:', err));

    this.engineHelper
      .getResource("assets/atlas.txt")
      .then(
        ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3)
      ).then(() => console.log('Atlas resources loaded'))
      .catch(err => console.error('Atlas resource error:', err));

    this.engineHelper
      .getResource("assets/background.jpg")
      .then(ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 0))
      .then(() => console.log('Background resources loaded'))
      .catch(err => console.error('Background resource error:', err));

    this.engineHelper
      .getResource("assets/sphere.txt")
      .then(
        ResourceResolver.objResolverMultiple(this.engineHelper, [
          { textureSource: "assets/background.jpg", name: "background" },
          { textureSource: "assets/sun.png", name: "sun" }
        ])
      ).then(() => console.log('Sphere resources loaded'))
      .catch(err => console.error('Sphere resource error:', err));

  }
}

// Export function to create and launch the racing game
export const createRacingGame = (): void => {
  console.log('🏎️ Starting Racing Game...');

  const aspect = window.innerWidth / window.innerHeight;
  const args = {
    world: new RacingGame(),
    elementId: "app",
    canvasId: "app-game",
    error: undefined,
    subscribe: undefined,
    renderMode: '3d',
    camera: {
      near: 0.01,
      far: 1000.0,
      fov: 75.0,
      maxFov: 75.0,
      isFovMax: false,
      projection: 'perspective',
      aspect
    },
    aspectRatio: aspect,
    eventThrottle: 1000.0 / 60.0,
    fps: 60,
    isStepRender: false,
  };
  const app = new App(args);

  // Expose game instance globally for UI updates
  (window as any).gameInstance = args.world;

  app.run().catch(console.error);
  app.unpause();
  window.onresize = () => {
    location.reload();
  };
};
