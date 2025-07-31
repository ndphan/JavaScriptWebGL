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
  Light,
  Moveable
} from "synaren-engine";
import Cube from "./Cube";
import Sphere from "./Sphere";

interface RacingBot {
  car: Moveable;  // Use Moveable for physics-based movement
  position: { x: number, y: number, z: number };
  speed: number;
  currentWaypoint: number;
  name: string;
  rotation: number;
  nameText: FontReference | any; // Allow any type for font fallback
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
  waypointTiles: Cube[] = [];

  // Movement speeds
  crowd: Object3d[] = []; // Low poly girls as crowd
  trees: Object3d[] = []; // Low poly trees for nature scenery

  // Race track waypoints (defines the racing line) - Simplified track
  waypoints: Waypoint[] = [
    { x: 0, z: 0 },     // Start line
    { x: 20, z: 0 },    // First turn
    { x: 30, z: 15 },   // Corner 1
    { x: 30, z: 30 },   // Straight
    { x: 15, z: 40 },   // Corner 2
    { x: 0, z: 40 },    // Back straight
    { x: -15, z: 40 },  // Corner 3
    { x: -30, z: 30 },  // Left side
    { x: -30, z: 15 },  // Corner 4
    { x: -20, z: 0 },   // Return to start
    { x: 0, z: 0 }      // Complete loop
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
      console.log('Creating game objects...');

      // Create simple ground plane
      this.ground = new Plane3d(
        new Rect3d(0.0, 0.0, 0.0, 100, 0, 100),
        this.engineHelper.newVertexModel("grass", PlaneType.XZ)
      );
      this.addEntity(this.ground);

      // Create sky sphere
      this.sky = new Sphere(
        new Rect3d(0.0, 10.0, 0.0, 200.0, 200.0, 200.0),
        "background"
      );
      this.addEntity(this.sky);

      // Create player car
      this.createPlayerCar();

      // Create bot cars
      this.createBotCars();

      // Create fewer crowd members to reduce complexity
      this.createSimpleCrowd();

      // Create trees for atmosphere
      this.createTrees();

      console.log('🏎️ Game objects created successfully!');
    } catch (error) {
      console.error('Error creating game objects:', error);
    }
  }

  createSimpleCrowd() {
    // Create a simple crowd around the center
    const crowdPositions = [
      { x: 0, z: 20 },
      { x: 10, z: 20 },
      { x: -10, z: 20 },
      { x: 0, z: 30 },
      { x: 15, z: 15 },
      { x: -15, z: 15 }
    ];

    crowdPositions.forEach((pos, index) => {
      try {
        const crowdMember = new Object3d(
          new Rect3d(pos.x, 1.5, pos.z, 2, 2, 2),
          "low_poly_girl"
        );
        
        crowdMember.scale(1, 1, 1);
        crowdMember.angleY(Math.random() * 360);
        
        this.crowd.push(crowdMember);
        this.addEntity(crowdMember);
      } catch (error) {
        console.warn('Failed to create crowd member:', error);
      }
    });

    console.log(`Created ${this.crowd.length} crowd members`);
  }

  createTrees() {
    // Create bigger trees for natural scenery around the track - more and bigger trees
    const treePositions = [
      // Trees around the track perimeter - outer ring
      { x: -50, z: -10 }, { x: -50, z: 0 }, { x: -50, z: 10 }, { x: -50, z: 20 }, { x: -50, z: 30 }, { x: -50, z: 40 }, { x: -50, z: 50 },
      { x: 50, z: -10 }, { x: 50, z: 0 }, { x: 50, z: 10 }, { x: 50, z: 20 }, { x: 50, z: 30 }, { x: 50, z: 40 }, { x: 50, z: 50 },
      
      // Trees along the north and south edges
      { x: -40, z: -25 }, { x: -30, z: -25 }, { x: -20, z: -25 }, { x: -10, z: -25 }, { x: 0, z: -25 }, { x: 10, z: -25 }, { x: 20, z: -25 }, { x: 30, z: -25 }, { x: 40, z: -25 },
      { x: -40, z: 65 }, { x: -30, z: 65 }, { x: -20, z: 65 }, { x: -10, z: 65 }, { x: 0, z: 65 }, { x: 10, z: 65 }, { x: 20, z: 65 }, { x: 30, z: 65 }, { x: 40, z: 65 },
      
      // Trees in clusters around the track
      { x: -35, z: 5 }, { x: -38, z: 8 }, { x: -32, z: 12 },
      { x: 35, z: 5 }, { x: 38, z: 8 }, { x: 32, z: 12 },
      { x: -35, z: 35 }, { x: -38, z: 32 }, { x: -32, z: 38 },
      { x: 35, z: 35 }, { x: 38, z: 32 }, { x: 32, z: 38 },
      
      // Trees in center areas (outside the track)
      { x: -12, z: 20 }, { x: -15, z: 25 }, { x: -10, z: 30 },
      { x: 12, z: 20 }, { x: 15, z: 25 }, { x: 10, z: 30 },
      
      // Additional scattered trees for atmosphere
      { x: -25, z: -15 }, { x: -28, z: -10 }, { x: -22, z: -18 },
      { x: 25, z: -15 }, { x: 28, z: -10 }, { x: 22, z: -18 },
      { x: -25, z: 55 }, { x: -28, z: 58 }, { x: -22, z: 52 },
      { x: 25, z: 55 }, { x: 28, z: 58 }, { x: 22, z: 52 }
    ];

    treePositions.forEach((pos, index) => {
      try {
        const tree = new Object3d(
          new Rect3d(pos.x, 0, pos.z, 6, 6, 6), // Trees at y=3 (half height above ground = 3 units tall)
          "low_poly_tree"
        );
        
        // Make trees even bigger and more varied
        const scale = 2.0 + Math.random() * 1.5; // Scale between 2.0 and 3.5 (much bigger)
        tree.scale(scale, scale, scale);
        tree.angleY(Math.random() * 360);
        
        this.trees.push(tree);
        this.addEntity(tree);
      } catch (error) {
        console.warn('Failed to create tree:', error);
      }
    });

    console.log(`Created ${this.trees.length} bigger trees`);
  }

 
  createPlayerCar() {
    this.playerCar = new Object3d(
      new Rect3d(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z, 1.5, 1.5, 1.5),
      "racing_car"
    );
    this.playerCar.scale(1.5, 1.5, 1.5); // Bigger player car - was 0.5, now 0.8
    this.addEntity(this.playerCar);
  }

  createBotCars() {
    const botNames = ['Speed Demon', 'Thunder Bolt', 'Turbo Racer', 'Lightning Fast'];

    for (let i = 0; i < 4; i++) {
      // Create simple bot name text (may not render if font system has issues)
      let nameText: any = { center: () => {}, render: () => {} }; // Default fallback
      
      try {
        nameText = FontReference.newFont(
          new Coordinate(0.1 + (i * 0.2), 0.9, 0),
          `bot-${i}-name`
        );
        nameText.setText(botNames[i])
          .setFontSize(18)
          .setTop(true);
      } catch (error) {
        console.warn('Font creation failed, using fallback:', error);
      }

      // Position bots in a line behind the start, spread out
      const startX = -5 + (i * 2); // Spread bots across starting line
      const startZ = -5; // Behind the start line

      // Create the car as an Object3d
      const carObject = new Object3d(
        new Rect3d(startX, 0, startZ, 1.5, 1.5, 1.5),
        "racing_car"
      );
      carObject.scale(0.6, 0.6, 0.6); // Slightly larger for visibility

      // Create a Moveable wrapper for physics-based movement
      const moveableCar = new Moveable();
      moveableCar.entities.push(carObject);
      moveableCar.center(startX, 0.5, startZ);
      moveableCar.setRect(new Rect3d(startX, 0.5, startZ, 1.5, 1.5, 1.5)); // Set 3D collision bounds
      moveableCar.updatePhysicsPosition();

      const bot: RacingBot = {
        car: moveableCar,
        position: { x: startX, y: 0, z: startZ },
        speed: 0.12 + (Math.random() * 0.03), // Consistent moderate speed
        currentWaypoint: 0, // Start with waypoint 0 (origin)
        name: botNames[i],
        rotation: 0, // Start facing forward
        nameText: nameText
      };

      this.bots.push(bot);
      this.addEntity(bot.car);

      console.log(`Created bot ${bot.name} at position (${startX}, ${startZ})`);
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

  createWaypointTiles() {
    try {
      // Create bigger tiles to visualize the waypoint path
      for (let i = 0; i < this.waypoints.length - 1; i++) { // -1 to avoid duplicate at start/end
        const waypoint = this.waypoints[i];
        
        // Create a bigger cube tile at each waypoint
        const tile = new Cube(
          new Rect3d(waypoint.x, 0.2, waypoint.z, 5, 0.2, 5), // Bigger tiles: 5x5 instead of 3x3
          "sky",
          ["sky", "sky", "sky", "sky", "sky", "sky"]
        );
        
        this.waypointTiles.push(tile);
        this.addEntity(tile);
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
        
        // Create bigger tiles along the path between waypoints
        const tilesPerSegment = Math.floor(distance / 4); // One tile every 4 units (was 3)
        for (let j = 1; j < tilesPerSegment; j++) {
          const progress = j / tilesPerSegment;
          const x = current.x + dx * progress;
          const z = current.z + dz * progress;
          
          const pathTile = new Cube(
            new Rect3d(x, 0.1, z, 4, 0.1, 4), // Bigger path tiles: 4x4 instead of 3x3
            "ground",
            ["ground", "ground", "ground", "ground", "ground", "ground"]
          );
          
          this.waypointTiles.push(pathTile);
          this.addEntity(pathTile);
          pathTile.init(this.engineHelper);
        }
      }
      
      // Create course walls around the track edges
      this.createCourseWalls();
      
      console.log(`Created ${this.waypointTiles.length} bigger waypoint path tiles and course walls`);
    } catch (error) {
      console.error('Error creating waypoint tiles:', error);
    }
  }

  createCourseWalls() {
    // Create walls around the course perimeter
    const wallHeight = 2;
    const wallThickness = 1;
    
    // Outer walls - create a rectangular boundary around the track
    const outerWalls = [
      // North wall
      { x: 0, z: -10, width: 70, height: wallHeight, depth: wallThickness },
      // South wall  
      { x: 0, z: 55, width: 70, height: wallHeight, depth: wallThickness },
      // West wall
      { x: -35, z: 22.5, width: wallThickness, height: wallHeight, depth: 65 },
      // East wall
      { x: 35, z: 22.5, width: wallThickness, height: wallHeight, depth: 65 }
    ];

    outerWalls.forEach((wall, index) => {
      try {
        const wallCube = new Cube(
          new Rect3d(wall.x, wall.height / 2, wall.z, wall.width, wall.height, wall.depth),
          "rock", // Use a distinct texture for walls
          ["rock", "rock", "rock", "rock", "rock", "rock"]
        );
        
        this.trackBarriers.push(wallCube);
        this.addEntity(wallCube);
        wallCube.init(this.engineHelper);
      } catch (error) {
        console.warn('Failed to create course wall:', error);
      }
    });

    // Inner walls - create some barriers around key sections of the track
    const innerBarriers = [
      // Barriers around turns
      { x: 25, z: 5, width: 2, height: wallHeight, depth: 8 },
      { x: 25, z: 35, width: 2, height: wallHeight, depth: 8 },
      { x: -25, z: 5, width: 2, height: wallHeight, depth: 8 },
      { x: -25, z: 35, width: 2, height: wallHeight, depth: 8 },
      // Center barriers
      { x: 0, z: 15, width: 8, height: wallHeight, depth: 2 },
      { x: 0, z: 25, width: 8, height: wallHeight, depth: 2 }
    ];

    innerBarriers.forEach((barrier, index) => {
      try {
        const barrierCube = new Cube(
          new Rect3d(barrier.x, barrier.height / 2, barrier.z, barrier.width, barrier.height, barrier.depth),
          "rock",
          ["rock", "rock", "rock", "rock", "rock", "rock"]
        );
        
        this.trackBarriers.push(barrierCube);
        this.addEntity(barrierCube);
        barrierCube.init(this.engineHelper);
      } catch (error) {
        console.warn('Failed to create inner barrier:', error);
      }
    });

    console.log(`Created ${outerWalls.length + innerBarriers.length} course walls and barriers`);
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

    // Handle acceleration/deceleration
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

    // Handle turning
    if (this.keys['keya']) {
      this.playerRotation += this.turnSpeed;
    }
    if (this.keys['keyd']) {
      this.playerRotation -= this.turnSpeed;
    }

    // Update position based on rotation and speed
    this.playerPosition.x -= Math.sin(this.playerRotation) * this.playerSpeed;
    this.playerPosition.z -= Math.cos(this.playerRotation) * this.playerSpeed;

    // Update player car visual position and rotation
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

    this.bots.forEach((bot, index) => {
      const targetWaypoint = this.waypoints[bot.currentWaypoint];

      // Calculate direction to target waypoint
      const dx = targetWaypoint.x - bot.position.x;
      const dz = targetWaypoint.z - bot.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // Debug logging for first bot (reduced frequency)
      if (index === 0 && Math.random() < 0.01) { // Less frequent logging
        console.log(`Bot ${bot.name}: pos(${bot.position.x.toFixed(1)}, ${bot.position.z.toFixed(1)}) -> waypoint ${bot.currentWaypoint} at (${targetWaypoint.x}, ${targetWaypoint.z}) distance: ${distance.toFixed(1)}`);
      }

      // Check if reached waypoint
      if (distance < 5) { // Larger threshold for more reliable waypoint detection
        bot.currentWaypoint = (bot.currentWaypoint + 1) % this.waypoints.length;
        console.log(`Bot ${bot.name} reached waypoint, moving to waypoint ${bot.currentWaypoint}`);
      }

      // Direct movement for reliable bot AI
      if (distance > 0.1 && distance < 200) { // Prevent extreme movements
        // Normalize direction vector
        const normalizedDx = dx / distance;
        const normalizedDz = dz / distance;
        
        // Move bot towards target waypoint
        bot.position.x += normalizedDx * bot.speed;
        bot.position.z += normalizedDz * bot.speed;

        // Calculate rotation to face movement direction
        // Fix the rotation calculation - use correct coordinate system
        bot.rotation = Math.atan2(normalizedDx, normalizedDz) * (180 / Math.PI); // Fixed: removed negative from dz

        // Update the Moveable car's position to match bot position
        bot.car.center(bot.position.x, bot.position.y, bot.position.z);
        bot.car.angleY(bot.rotation);
        
        // Also update the internal Object3d position for proper rendering
        if (bot.car.entities.length > 0) {
          const carObject = bot.car.entities[0];
          carObject.center(bot.position.x, bot.position.y, bot.position.z);
          carObject.angleY(bot.rotation);
        }
      }

      // Update name text position (screen overlay)
      if (bot.nameText) {
        try {
          const screenX = 0.1 + (index * 0.2); // Spread names across top
          const screenY = 0.9; // Near top of screen
          bot.nameText.center(screenX, screenY);
        } catch (error) {
          // Font system may not be ready, ignore silently
        }
      }
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

    // Update camera to follow player - Fixed camera that rotates properly
    if (this.playerCar) {
      const cameraOffset = 12;  // Distance behind car (increased for better view)
      const cameraHeight = 5;   // Height above ground
      
      // Calculate camera position behind the player car (fixed direction)
      const cameraX = this.playerPosition.x - Math.sin(this.playerRotation) * cameraOffset;
      const cameraZ = this.playerPosition.z + Math.cos(this.playerRotation) * cameraOffset;

      // Calculate look-at point in front of the car (fixed direction)
      const lookAtX = this.playerPosition.x + Math.sin(this.playerRotation) * 5;
      const lookAtZ = this.playerPosition.z - Math.cos(this.playerRotation) * 5;

      // Position camera behind car
      this.engineHelper.camera.camera3d.center(cameraX, cameraHeight, cameraZ);
      
      // Look at a point in front of the car to match car's direction
      this.engineHelper.camera.camera3d.lookAt(
        lookAtX, 
        this.playerPosition.y + 1, 
        lookAtZ
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
    // Simplified initialization
    console.log('🏎️ Initializing Racing Game...');

    // Set up basic lighting
    this.engineHelper.setLighting(
      new Light({
        pos: [0.0, 20, 0],
        in: [1.0, 1.0, 1.0],
        attenuation: 0.02,
        ambientCoeff: 0.4,
        at: [0.0, 0.0, 0.0]
      })
    );

    // Position camera for initial view
    this.engineHelper.camera.camera3d.center(0, 5, 10);
    this.engineHelper.camera.camera3d.lookAt(0, 0, 0);
    this.engineHelper.camera.camera3d.updateProjectionView();
    this.engineHelper.camera.camera3d.commitProjectionView();
    
    // Create game objects
    this.createGameObjects();
    super.init();
    
    // Create waypoint tiles for visual debugging
    this.createWaypointTiles();
    
    console.log('🏎️ Racing Game initialized! Press SPACE to start racing!');
    console.log('🎮 Controls: W/S - Accelerate/Brake, A/D - Turn Left/Right');
    
    // Auto-start the race after 2 seconds
    setTimeout(() => {
      if (!this.gameStarted) {
        console.log('🚀 Auto-starting race...');
        this.startRace();
      }
    }, 2000);
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
