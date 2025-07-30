import {
  App,
  EngineEvent,
  EngineObject,
  Events,
  Object3d,
  ObjectManager,
  Plane3d,
  PlaneType,
  Rect3d,
  ResourceResolver,
  FontReference,
  Coordinate,
  Light
} from "synaren-engine";
import Cube from "./Cube";
import Sphere from "./Sphere";

interface RacingBot {
  car: Object3d;
  position: { x: number, y: number, z: number };
  speed: number;
  currentWaypoint: number;
  name: string;
  rotation: number;
  nameText: FontReference; // Add text display for bot name
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
  ground: Plane3d;
  sky: Sphere;
  trackBarriers: Cube[] = [];
  waypointTiles: Cube[] = []; // Visual tiles for waypoint path
  crowd: Object3d[] = []; // Low poly girls as crowd
  trees: Object3d[] = []; // Low poly trees for nature scenery

  // Race track waypoints (defines the racing line) - Much bigger track
  waypoints: Waypoint[] = [
    { x: 0, z: 0 },
    { x: 25, z: 0 },
    { x: 40, z: 15 },
    { x: 40, z: 40 },
    { x: 25, z: 55 },
    { x: 0, z: 55 },
    { x: -25, z: 55 },
    { x: -40, z: 40 },
    { x: -40, z: 15 },
    { x: -25, z: 0 },
    { x: 0, z: 0 }  // Back to start
  ];

  // Player controls - Slower for better visibility
  playerSpeed: number = 0;
  maxSpeed: number = 0.4;  // Reduced from 0.8 to 0.4
  acceleration: number = 0.015;  // Reduced acceleration
  deceleration: number = 0.02;   // Reduced deceleration
  turnSpeed: number = 0.025;     // Reduced turn speed
  playerRotation: number = 0;
  playerPosition: { x: number, y: number, z: number } = { x: 0, y: 0.5, z: 0 }; // Better starting position on ground
  keys: { [key: string]: boolean } = {};

  // Game timer
  lastWaypoint: number = 0;

  constructor() {
    super();
  }

  createGameObjects() {
    try {
      // Create optimized ground - use single large plane instead of many small ones
      this.ground = new Plane3d(
        new Rect3d(0.0, 0.0, 0.0, 200, 0, 200), // Single 1x1 unit that will be scaled
        this.engineHelper.newVertexModel("grass", PlaneType.XZ)
      );
      // Scale it up to cover the area we need
      this.addEntity(this.ground);

      // Create bigger sky
      this.sky = new Sphere(
        new Rect3d(0.0, 10.0, 0.0, 300.0, 300.0, 300.0), // Much bigger sky
        "background"
      );
      this.addEntity(this.sky);

      // Create player car
      this.createPlayerCar();

      // Create bot cars
      this.createBotCars();

      // Create crowd and trees for atmosphere
      this.createCrowd();
      this.createTrees();

      console.log('🏎️ Game objects created successfully!');
    } catch (error) {
      console.error('Error creating game objects:', error);
    }
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
      // Create bot name text with simpler initialization
      const nameText = FontReference.newFont(
        new Coordinate(0.1 + (i * 0.2), 0.9, 0), // Position directly
        `bot-${i}-name`
      );
      nameText.setText(botNames[i])
        .setFontSize(18) // Smaller font size
        .setTop(true); // Render on top of 3D scene

      const bot: RacingBot = {
        car: new Object3d(
          new Rect3d(-3 + (i * 1.5), 0.5, -3, 1.5, 1.5, 1.5), // Better spacing and on ground
          "racing_car"
        ),
        position: { x: -3 + (i * 1.5), y: 0.5, z: -3 },
        speed: 0.15 + (Math.random() * 0.05), // Increased speed for testing - was 0.08-0.13
        currentWaypoint: 1, // Start at waypoint 1 instead of 0, since they start behind the start line
        name: botNames[i],
        rotation: 0,
        nameText: nameText
      };

      bot.car.scale(0.5, 0.5, 0.5);
      this.bots.push(bot);
      this.addEntity(bot.car);
    }
  }

  createCrowd() {
    // Create crowd of low poly girls around the center of the track
    const centerX = 0;
    const centerZ = 27.5; // Center of the track loop
    const crowdPositions = [
      // Inner crowd circle
      { x: centerX - 8, z: centerZ - 8 },
      { x: centerX + 8, z: centerZ - 8 },
      { x: centerX - 8, z: centerZ + 8 },
      { x: centerX + 8, z: centerZ + 8 },
      { x: centerX, z: centerZ - 10 },
      { x: centerX, z: centerZ + 10 },
      { x: centerX - 10, z: centerZ },
      { x: centerX + 10, z: centerZ },
      // Additional crowd around the track
      { x: -15, z: 10 },
      { x: 15, z: 10 },
      { x: -15, z: 45 },
      { x: 15, z: 45 },
    ];

    crowdPositions.forEach((pos, index) => {
      const crowdMember = new Object3d(
        new Rect3d(pos.x, 1.7, pos.z, 2, 2, 2),
        "low_poly_girl"
      );
      
      // Vary the scale and rotation for diversity
      const scale = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2
      crowdMember.scale(scale, scale, scale);
      crowdMember.angleY(Math.random() * 360); // Random rotation
      
      this.crowd.push(crowdMember);
      this.addEntity(crowdMember);
    });

    console.log(`Created ${this.crowd.length} crowd members`);
  }

  createTrees() {
    // Create trees for natural scenery around the track perimeter and center
    const treePositions = [
      // Trees in the center area
      { x: -5, z: 25 },
      { x: 5, z: 30 },
      { x: -3, z: 32 },
      { x: 3, z: 22 },
      // Trees around the outer perimeter
      { x: -50, z: 0 },
      { x: -50, z: 27 },
      { x: -50, z: 55 },
      { x: 50, z: 0 },
      { x: 50, z: 27 },
      { x: 50, z: 55 },
      { x: 0, z: -15 },
      { x: -25, z: -15 },
      { x: 25, z: -15 },
      { x: 0, z: 70 },
      { x: -25, z: 70 },
      { x: 25, z: 70 },
      // Trees along the sides
      { x: -60, z: 15 },
      { x: -60, z: 40 },
      { x: 60, z: 15 },
      { x: 60, z: 40 },
    ];

    treePositions.forEach((pos, index) => {
      const tree = new Object3d(
        new Rect3d(pos.x, 1, pos.z, 3, 3, 3),
        "low_poly_tree"
      );
      
      // Vary the scale and rotation for natural diversity
      const scale = 1.0 + Math.random() * 0.8; // Scale between 1.0 and 1.8
      tree.scale(scale, scale, scale);
      tree.angleY(Math.random() * 360); // Random rotation
      
      this.trees.push(tree);
      this.addEntity(tree);
    });

    console.log(`Created ${this.trees.length} trees`);
  }

  createWaypointTiles() {
    try {
      // Create small tiles to visualize the waypoint path
      for (let i = 0; i < this.waypoints.length - 1; i++) { // -1 to avoid duplicate at start/end
        const waypoint = this.waypoints[i];
        
        // Create a small cube tile at each waypoint
        const tile = new Cube(
          new Rect3d(waypoint.x, 0.1, waypoint.z, 3, 0.1, 3), // Small, flat tiles
          "sky", // Use grass texture from atlas instead of missing-texture
          ["sky", "sky", "sky", "sky", "sky", "sky"]
        );
        
        this.waypointTiles.push(tile);
        this.addEntity(tile);
        // Initialize the cube entity immediately
        tile.init(this.engineHelper);
      }
      
      // Create path connection tiles between waypoints
      for (let i = 0; i < this.waypoints.length - 1; i++) {
        const current = this.waypoints[i];
        const next = this.waypoints[i + 1];
        
        // Calculate distance and direction between waypoints
        const dx = next.x - current.x;
        const dz = next.z - current.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Create tiles along the path between waypoints
        const tilesPerSegment = Math.floor(distance / 3); // One tile every 3 units
        for (let j = 1; j < tilesPerSegment; j++) {
          const progress = j / tilesPerSegment;
          const x = current.x + dx * progress;
          const z = current.z + dz * progress;
          
          const pathTile = new Cube(
            new Rect3d(x, 0.05, z, 3, 0.1, 3), // Even smaller path tiles
            "ground", // Use ground texture from atlas
            ["ground", "ground", "ground", "ground", "ground", "ground"]
          );
          
          this.waypointTiles.push(pathTile);
          this.addEntity(pathTile);
          // Initialize the cube entity immediately
          pathTile.init(this.engineHelper);
        }
      }
      
      console.log(`Created ${this.waypointTiles.length} waypoint path tiles`);
    } catch (error) {
      console.error('Error creating waypoint tiles:', error);
    }
  }

  startRace() {
    this.gameStarted = true;
    console.log('🏁 Race started! Use WASD to control your car.');
    console.log('Bot initial positions and targets:');
    this.bots.forEach((bot, index) => {
      const target = this.waypoints[bot.currentWaypoint];
      console.log(`Bot ${index} (${bot.name}): pos(${bot.position.x}, ${bot.position.z}) -> waypoint ${bot.currentWaypoint} at (${target.x}, ${target.z})`);
    });
  }

  updatePlayerMovement() {
    if (!this.gameStarted || this.raceFinished) return;

    // Handle acceleration/deceleration - Fixed key mapping
    if (this.keys['keyw']) {
      this.playerSpeed = Math.min(this.playerSpeed + this.acceleration, this.maxSpeed);
    } else if (this.keys['keys']) {
      this.playerSpeed = Math.max(this.playerSpeed - this.deceleration, -this.maxSpeed * 0.5);
    } else {
      // Natural deceleration
      if (this.playerSpeed > 0) {
        this.playerSpeed = Math.max(0, this.playerSpeed - this.deceleration * 0.5);
      } else {
        this.playerSpeed = Math.min(0, this.playerSpeed + this.deceleration * 0.5);
      }
    }

    // Handle turning - Fixed left/right direction
    if (this.keys['keya']) {
      this.playerRotation += this.turnSpeed; // A key = turn left = increase rotation
    }
    if (this.keys['keyd']) {
      this.playerRotation -= this.turnSpeed; // D key = turn right = decrease rotation
    }

    // Update position based on rotation and speed - Fixed forward/backward direction
    this.playerPosition.x -= Math.sin(this.playerRotation) * this.playerSpeed; // Changed to -= for correct forward direction
    this.playerPosition.z -= Math.cos(this.playerRotation) * this.playerSpeed; // Changed to -= for correct forward direction

    // Update player car position and rotation
    if (this.playerCar) {
      this.playerCar.position.x = this.playerPosition.x;
      this.playerCar.position.z = this.playerPosition.z;
      // Fix car rotation to face movement direction
      this.playerCar.angleY(this.playerRotation * (180 / Math.PI)); // Removed +180 offset for correct facing
    }

    // Check waypoint progress
    this.checkWaypoints();
  }

  updateBots() {
    if (!this.gameStarted || this.raceFinished) return;

    this.bots.forEach((bot, index) => {
      const targetWaypoint = this.waypoints[bot.currentWaypoint];

      // Calculate direction to target waypoint
      const dx = targetWaypoint.x - bot.position.x;
      const dz = targetWaypoint.z - bot.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // Debug first bot only
      if (index === 0 && Math.random() < 0.01) { // Log occasionally
        console.log(`Bot ${index}: pos(${bot.position.x.toFixed(1)}, ${bot.position.z.toFixed(1)}) -> waypoint(${targetWaypoint.x}, ${targetWaypoint.z}) distance: ${distance.toFixed(1)}`);
      }

      if (distance < 3) { // Increased threshold for better waypoint detection
        // Move to next waypoint
        bot.currentWaypoint = (bot.currentWaypoint + 1) % this.waypoints.length;
        if (index === 0) {
          console.log(`Bot ${index} reached waypoint ${bot.currentWaypoint - 1}, moving to ${bot.currentWaypoint}`);
        }
      }

      // Move towards waypoint
      if (distance > 0) {
        // Normalize direction vector
        const normalizedDx = dx / distance;
        const normalizedDz = dz / distance;
        
        bot.position.x += normalizedDx * bot.speed;
        bot.position.z += normalizedDz * bot.speed;

        // Update bot rotation to face direction of movement
        // Using same coordinate system as player: 0 degrees = negative Z direction
        bot.rotation = Math.atan2(normalizedDx, -normalizedDz) * (180 / Math.PI);
      }

      // Update bot car position and rotation
      bot.car.position.x = bot.position.x;
      bot.car.position.z = bot.position.z;
      bot.car.angleY(bot.rotation);

      // Position bot name text in top area of screen (simple UI overlay)
      // Each bot gets positioned horizontally across the top
      const screenX = 0.1 + (index * 0.2); // Spread names across top
      const screenY = 0.9; // Near top of screen
      
      bot.nameText.center(screenX, screenY);
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
    
    // Temporarily disable font rendering to focus on bot movement
    // TODO: Re-enable when font system is stable
    // if (this.gameStarted) {
    //   this.bots.forEach((bot) => {
    //     try {
    //       bot.nameText.render(this.engineHelper);
    //     } catch (error) {
    //       console.warn('Font rendering error:', error);
    //     }
    //   });
    // }
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

    // Update camera to follow player - Fixed rotation origin to keep car in view
    if (this.playerCar) {
      const cameraOffset = 8;  // Distance behind car
      const cameraHeight = 3;  // Height above ground

      // Calculate camera position behind the player car
      const cameraX = this.playerPosition.x - Math.sin(this.playerRotation) * cameraOffset;
      const cameraZ = this.playerPosition.z + Math.cos(this.playerRotation) * cameraOffset;

      // Position camera behind car
      this.engineHelper.camera.camera3d.center(cameraX, cameraHeight, cameraZ);
      
      // Set camera to look at the player car (fixed rotation origin)
      this.engineHelper.camera.camera3d.lookAt(
        this.playerPosition.x, 
        this.playerPosition.y + 1, // Look slightly above the car
        this.playerPosition.z
      );
      
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
    // Position camera behind the player car's starting position
    const cameraOffset = 8;
    const cameraHeight = 3;
    const cameraX = this.playerPosition.x - Math.sin(this.playerRotation) * cameraOffset;
    const cameraZ = this.playerPosition.z + Math.cos(this.playerRotation) * cameraOffset;
    
    this.engineHelper.setLighting(
      new Light({
        pos: [0.0, 20, 0],
        // intensity and color in rgb
        in: [1.0, 1.0, 1.0],
        // rate of loss in light intensity from source pos
        attenuation: 0.015,
        // ambient lighting 0 - 1 where 0 is complete darkness
        ambientCoeff: 0.3,
        // the direction of light from pos to at to direct the shadowing
        // note that it is only in one direction.
        at: [0.0, 0.0, 0.0]
      })
    );

    this.engineHelper.camera.camera3d.center(cameraX, cameraHeight, cameraZ);
    // Initial camera look at player
    this.engineHelper.camera.camera3d.lookAt(
      this.playerPosition.x,
      this.playerPosition.y + 1,
      this.playerPosition.z
    );
    this.engineHelper.camera.camera3d.updateProjectionView();
    // Force the camera to commit its projection and view matrices before anything else
    this.engineHelper.camera.camera3d.commitProjectionView();
    
    this.createGameObjects(); // Create objects after resources are loaded
    super.init();
    
    // Create waypoint tiles after initialization
    this.createWaypointTiles();
    
    console.log('🏎️ Racing Game initialized! Press SPACE to start racing!');
    console.log('🎮 Controls: W/S - Accelerate/Brake, A/D - Turn Left/Right');
    
    // Auto-start the race after 3 seconds for testing
    setTimeout(() => {
      if (!this.gameStarted) {
        console.log('🚀 Auto-starting race for testing...');
        this.startRace();
      }
    }, 3000);
  }

  loadResources() {
    console.log('Loading Racing game resources...');

    // Load font for bot names first
    this.engineHelper
      .getResource("assets/paprika.fnt")
      .then(ResourceResolver.bmFontResolver(this.engineHelper))
      .then(() => {
        console.log('Font resources loaded');
        // Initialize bot fonts after font is loaded
        this.bots.forEach((bot, index) => {
          try {
            bot.nameText.center(0.1 + (index * 0.2), 0.9);
          } catch (error) {
            console.warn('Font initialization warning:', error);
          }
        });
      })
      .catch(err => console.error('Font resource error:', err));

    // Load missing texture fallback for cubes
    this.engineHelper
      .getResource("assets/missing-texture.txt")
      .then(ResourceResolver.bitmapResolver(this.engineHelper, 1184, 1184, 0))
      .then(() => console.log('Missing texture fallback loaded'))
      .catch(err => console.error('Missing texture resource error:', err));

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

    // Load low poly girl for crowd
    this.engineHelper
      .getResource("assets/low_poly_girl.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/low_poly_girl.png",
          "low_poly_girl"
        )
      ).then(() => console.log('Low poly girl resources loaded'))
      .catch(err => console.error('Low poly girl resource error:', err));

    // Load low poly tree for nature scenery
    this.engineHelper
      .getResource("assets/low_poly_tree.txt")
      .then(
        ResourceResolver.objResolver(
          this.engineHelper,
          "assets/low_poly_tree.png",
          "low_poly_tree"
        )
      ).then(() => console.log('Low poly tree resources loaded'))
      .catch(err => console.error('Low poly tree resource error:', err));

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
      fov: 60.0,
      maxFov: 60.0,
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
