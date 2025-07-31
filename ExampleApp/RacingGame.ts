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

  // Race track waypoints (defines the racing line) - Simplified track within 1000x1000 ground
  waypoints: Waypoint[] = [
    // Start/Finish line
    { x: 0, z: 0 },
    
    // First sector - right turn
    { x: 150, z: 0 },
    { x: 250, z: 100 },
    { x: 250, z: 200 },
    
    // Second sector - top straight and left turn
    { x: 200, z: 300 },
    { x: 50, z: 350 },
    { x: -100, z: 300 },
    
    // Third sector - left side and hairpin
    { x: -200, z: 200 },
    { x: -250, z: 50 },
    { x: -200, z: -100 },
    
    // Fourth sector - bottom straight and return
    { x: -50, z: -150 },
    { x: 100, z: -100 },
    { x: 0, z: -50 },
    
    // Complete the loop back to start
    { x: 0, z: 0 }
  ];

  // Player controls - Slower for better visibility
  playerSpeed: number = 0;
  maxSpeed: number = 0.4;  // Reduced from 0.8 to 0.4
  acceleration: number = 0.015;  // Reduced acceleration
  deceleration: number = 0.02;   // Reduced deceleration
  turnSpeed: number = 0.025;     // Reduced turn speed
  playerRotation: number = 0;
  playerPosition: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }; // Better starting position on ground
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
        new Rect3d(0.0, 0.0, 0.0, 1000, 0, 1000),
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
    // Create minimal crowd dynamically based on waypoints for performance
    const crowdPositions: {x: number, z: number}[] = [];
    
    // Calculate the center point of the track
    const centerX = this.waypoints.reduce((sum, wp) => sum + wp.x, 0) / this.waypoints.length;
    const centerZ = this.waypoints.reduce((sum, wp) => sum + wp.z, 0) / this.waypoints.length;
    
    // Place crowd members around key waypoints (every 5th waypoint to reduce crowd)
    for (let i = 0; i < this.waypoints.length; i += 5) {
      const waypoint = this.waypoints[i];
      
      // Calculate direction from waypoint to track center
      const dx = centerX - waypoint.x;
      const dz = centerZ - waypoint.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance > 0) {
        // Normalize direction
        const normalizedDx = dx / distance;
        const normalizedDz = dz / distance;
        
        // Place crowd members on the inside of the track (toward center)
        const crowdDistance = 15; // Distance from waypoint toward center
        const crowdX = waypoint.x + normalizedDx * crowdDistance;
        const crowdZ = waypoint.z + normalizedDz * crowdDistance;
        
        crowdPositions.push({ x: crowdX, z: crowdZ });
        
        // Add only one variation around each main position (was 2)
        crowdPositions.push(
          { x: crowdX + (Math.random() - 0.5) * 12, z: crowdZ + (Math.random() - 0.5) * 12 }
        );
      }
    }
    
    // Add minimal crowd in the calculated center area (reduced from 8 to 4)
    for (let i = 0; i < 4; i++) {
      crowdPositions.push({
        x: centerX + (Math.random() - 0.5) * 30,
        z: centerZ + (Math.random() - 0.5) * 30
      });
    }

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

    console.log(`Created ${this.crowd.length} crowd members dynamically based on waypoints`);
    console.log(`Track center calculated at: (${centerX.toFixed(1)}, ${centerZ.toFixed(1)})`);
  }

  createTrees() {
    // Create minimal trees dynamically based on waypoints for performance
    const treePositions: {x: number, z: number}[] = [];
    
    // Calculate track bounds from waypoints
    const minX = Math.min(...this.waypoints.map(wp => wp.x));
    const maxX = Math.max(...this.waypoints.map(wp => wp.x));
    const minZ = Math.min(...this.waypoints.map(wp => wp.z));
    const maxZ = Math.max(...this.waypoints.map(wp => wp.z));
    
    // Calculate track center
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    
    // Create fewer perimeter trees around the track bounds (increased spacing)
    const perimeterPadding = 60;
    const treeSpacing = 50; // Increased from 25 to 50 for fewer trees
    
    // North and South perimeter (fewer trees)
    for (let x = minX - perimeterPadding; x <= maxX + perimeterPadding; x += treeSpacing) {
      treePositions.push(
        { x: x, z: minZ - perimeterPadding },  // North
        { x: x, z: maxZ + perimeterPadding }   // South
      );
    }
    
    // East and West perimeter (fewer trees)
    for (let z = minZ - perimeterPadding; z <= maxZ + perimeterPadding; z += treeSpacing) {
      treePositions.push(
        { x: minX - perimeterPadding, z: z },  // West
        { x: maxX + perimeterPadding, z: z }   // East
      );
    }
    
    // Create minimal trees around waypoints (every 4th waypoint instead of every 2nd)
    for (let i = 0; i < this.waypoints.length - 1; i += 4) { // Reduced frequency
      const current = this.waypoints[i];
      const next = this.waypoints[i + 1];
      
      // Calculate perpendicular direction for placing trees beside the track
      const dx = next.x - current.x;
      const dz = next.z - current.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      
      if (length > 0) {
        // Normalize direction vector
        const normalizedDx = dx / length;
        const normalizedDz = dz / length;
        
        // Perpendicular vectors for track sides
        const perpX = -normalizedDz;
        const perpZ = normalizedDx;
        
        const treeDistance = 25 + Math.random() * 10; // 25-35 units from track
        
        // Only one tree per side (not both sides)
        treePositions.push({
          x: current.x + perpX * treeDistance,
          z: current.z + perpZ * treeDistance
        });
      }
    }
    
    // Create fewer forest clusters (reduced from 8 to 4 clusters)
    const clusterCenters = [
      { x: centerX + 120, z: centerZ + 120 },
      { x: centerX - 120, z: centerZ + 120 },
      { x: centerX + 120, z: centerZ - 120 },
      { x: centerX - 120, z: centerZ - 120 }
    ];
    
    clusterCenters.forEach(cluster => {
      // Create fewer trees per cluster (3-5 instead of 8-12)
      const treesPerCluster = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < treesPerCluster; i++) {
        treePositions.push({
          x: cluster.x + (Math.random() - 0.5) * 30,
          z: cluster.z + (Math.random() - 0.5) * 30
        });
      }
    });
    
    // Filter out trees that are too close to the racing line
    const filteredTreePositions = treePositions.filter(treePos => {
      // Check distance to all waypoints
      return this.waypoints.every(waypoint => {
        const distance = Math.sqrt(
          Math.pow(treePos.x - waypoint.x, 2) + 
          Math.pow(treePos.z - waypoint.z, 2)
        );
        return distance > 12; // Minimum 12 units from racing line
      });
    });

    filteredTreePositions.forEach((pos, index) => {
      try {
        const tree = new Object3d(
          new Rect3d(pos.x, 0.5, pos.z, 6, 6, 6), // Trees at ground level
          "low_poly_tree"
        );
        
        // Make trees bigger and more varied
        const scale = 2.5 + Math.random() * 2.0; // Scale between 2.5 and 4.5 (bigger trees)
        tree.scale(scale, scale, scale);
        tree.angleY(Math.random() * 360);
        
        this.trees.push(tree);
        this.addEntity(tree);
      } catch (error) {
        console.warn('Failed to create tree:', error);
      }
    });

    console.log(`Created ${this.trees.length} trees dynamically around the track`);
    console.log(`Track bounds: X(${minX.toFixed(1)} to ${maxX.toFixed(1)}), Z(${minZ.toFixed(1)} to ${maxZ.toFixed(1)})`);
    console.log(`Filtered ${treePositions.length - filteredTreePositions.length} trees too close to racing line`);
  }

 
  createPlayerCar() {
    this.playerCar = new Object3d(
      new Rect3d(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z, 1.5, 1.5, 1.5),
      "racing_car"
    );
    this.playerCar.scale(1.5, 1.5, 1.5); // Bigger player car - was 0.5, now 0.8
    this.playerCar.angleY(90); // Start facing forward (0 degrees)
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

      // Position bots in a line behind the start, spread out more
      const startX = -12 + (i * 6); // Increased spread: was (i * 4), now (i * 6) for more separation
      const startZ = -10 - (i * 2); // Stagger Z positions more: each bot further back

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
        speed: 0.08 + (Math.random() * 0.08), // Increased variance: 0.08 to 0.16 (wider spread)
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
    // Create walls derived from waypoints
    const wallHeight = 2;
    const wallThickness = 1;
    const trackWidth = 8; // Distance from track center to wall
    
    // Calculate bounding box from waypoints
    let minX = Math.min(...this.waypoints.map(wp => wp.x));
    let maxX = Math.max(...this.waypoints.map(wp => wp.x));
    let minZ = Math.min(...this.waypoints.map(wp => wp.z));
    let maxZ = Math.max(...this.waypoints.map(wp => wp.z));
    
    // Add padding around the track
    const padding = 15;
    minX -= padding;
    maxX += padding;
    minZ -= padding;
    maxZ += padding;
    
    // Create outer boundary walls based on waypoint extents
    const outerWalls = [
      // North wall (top)
      { x: (minX + maxX) / 2, z: minZ, width: maxX - minX, height: wallHeight, depth: wallThickness },
      // South wall (bottom)
      { x: (minX + maxX) / 2, z: maxZ, width: maxX - minX, height: wallHeight, depth: wallThickness },
      // West wall (left)
      { x: minX, z: (minZ + maxZ) / 2, width: wallThickness, height: wallHeight, depth: maxZ - minZ },
      // East wall (right)
      { x: maxX, z: (minZ + maxZ) / 2, width: wallThickness, height: wallHeight, depth: maxZ - minZ }
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

    // Create inner barriers along the track path
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const current = this.waypoints[i];
      const next = this.waypoints[i + 1];
      
      // Calculate perpendicular direction for track width
      const dx = next.x - current.x;
      const dz = next.z - current.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      
      if (length > 0) {
        // Normalize direction vector
        const normalizedDx = dx / length;
        const normalizedDz = dz / length;
        
        // Perpendicular vectors for track sides
        const perpX = -normalizedDz;
        const perpZ = normalizedDx;
        
        // Create barriers on both sides of track segments at turns
        if (i % 3 === 0) { // Only at some waypoints to avoid cluttering
          // Left side barrier
          const leftBarrierX = current.x + perpX * trackWidth;
          const leftBarrierZ = current.z + perpZ * trackWidth;
          
          // Right side barrier  
          const rightBarrierX = current.x - perpX * trackWidth;
          const rightBarrierZ = current.z - perpZ * trackWidth;
          
          [
            { x: leftBarrierX, z: leftBarrierZ },
            { x: rightBarrierX, z: rightBarrierZ }
          ].forEach((barrierPos) => {
            try {
              const barrierCube = new Cube(
                new Rect3d(barrierPos.x, wallHeight / 2, barrierPos.z, 2, wallHeight, 2),
                "rock",
                ["rock", "rock", "rock", "rock", "rock", "rock"]
              );
              
              this.trackBarriers.push(barrierCube);
              this.addEntity(barrierCube);
              barrierCube.init(this.engineHelper);
            } catch (error) {
              console.warn('Failed to create track barrier:', error);
            }
          });
        }
      }
    }

    console.log(`Created ${this.trackBarriers.length} course walls and barriers derived from ${this.waypoints.length} waypoints`);
    console.log(`Track bounds: X(${minX.toFixed(1)} to ${maxX.toFixed(1)}), Z(${minZ.toFixed(1)} to ${maxZ.toFixed(1)})`);
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

    // Handle turning - this will rotate the camera direction
    if (this.keys['keya']) {
      this.playerRotation += this.turnSpeed;
    }
    if (this.keys['keyd']) {
      this.playerRotation -= this.turnSpeed;
    }

    // Position player car directly in front of camera based on camera direction
    if (this.playerCar && this.engineHelper.camera.camera3d) {
      const camera = this.engineHelper.camera.camera3d;
      
      // Calculate forward direction from camera rotation
      const forwardX = -Math.sin(this.playerRotation);
      const forwardZ = -Math.cos(this.playerRotation);
      
      // Move position forward based on speed
      this.playerPosition.x += forwardX * this.playerSpeed;
      this.playerPosition.z += forwardZ * this.playerSpeed;
      
      // Position car directly in front of camera
      const carDistance = 5; // Distance in front of camera
      this.playerCar.position.x = this.playerPosition.x + forwardX * carDistance;
      this.playerCar.position.y = this.playerPosition.y;
      this.playerCar.position.z = this.playerPosition.z + forwardZ * carDistance;
      this.playerCar.angleY(this.playerRotation * (180 / Math.PI));
    }

    // Check waypoint progress
    this.checkWaypoints();
  }

  updateBots() {
    if (!this.gameStarted || this.raceFinished) return;

    this.bots.forEach((bot, index) => {
      const baseWaypoint = this.waypoints[bot.currentWaypoint];
      
      // Add variance to target waypoint to prevent bots from clustering
      const lateralOffset = (index - 1.5) * 3; // Spread bots across track width (-4.5 to 4.5)
      const randomVariance = (Math.sin(Date.now() * 0.002 + index * 3) * 2); // Small random movement
      
      // Calculate perpendicular direction for lateral positioning
      const nextWaypointIndex = (bot.currentWaypoint + 1) % this.waypoints.length;
      const nextWaypoint = this.waypoints[nextWaypointIndex];
      const trackDx = nextWaypoint.x - baseWaypoint.x;
      const trackDz = nextWaypoint.z - baseWaypoint.z;
      const trackLength = Math.sqrt(trackDx * trackDx + trackDz * trackDz);
      
      let perpX = 0, perpZ = 0;
      if (trackLength > 0) {
        // Perpendicular to track direction for lateral offset
        perpX = -trackDz / trackLength;
        perpZ = trackDx / trackLength;
      }
      
      // Create varied target waypoint
      const targetWaypoint = {
        x: baseWaypoint.x + perpX * (lateralOffset + randomVariance),
        z: baseWaypoint.z + perpZ * (lateralOffset + randomVariance)
      };

      // Calculate direction to varied target waypoint
      const dx = targetWaypoint.x - bot.position.x;
      const dz = targetWaypoint.z - bot.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // Debug logging for first bot (reduced frequency)
      if (index === 0 && Math.random() < 0.01) { // Less frequent logging
        console.log(`Bot ${bot.name}: pos(${bot.position.x.toFixed(1)}, ${bot.position.z.toFixed(1)}) -> varied waypoint ${bot.currentWaypoint} at (${targetWaypoint.x.toFixed(1)}, ${targetWaypoint.z.toFixed(1)}) distance: ${distance.toFixed(1)}`);
      }

      // Check if reached base waypoint (use original waypoint for progression)
      const baseDistance = Math.sqrt(
        Math.pow(bot.position.x - baseWaypoint.x, 2) + 
        Math.pow(bot.position.z - baseWaypoint.z, 2)
      );
      if (baseDistance < 5) { // Larger threshold for more reliable waypoint detection
        bot.currentWaypoint = (bot.currentWaypoint + 1) % this.waypoints.length;
        console.log(`Bot ${bot.name} reached waypoint, moving to waypoint ${bot.currentWaypoint}`);
      }

      // Direct movement for reliable bot AI with left-right variance
      if (distance > 0.1 && distance < 200) { // Prevent extreme movements
        // Normalize direction vector
        const normalizedDx = dx / distance;
        const normalizedDz = dz / distance;
        
        // Add left-right variance to prevent bots driving on top of each other
        const lateralVariance = (Math.sin(Date.now() * 0.001 + index * 2) * 0.3) + (index - 1.5) * 0.1; // Different pattern per bot
        const perpX = -normalizedDz; // Perpendicular to direction
        const perpZ = normalizedDx;
        
        // Move bot towards target waypoint with lateral variance
        bot.position.x += (normalizedDx * bot.speed) + (perpX * lateralVariance * 0.05);
        bot.position.z += (normalizedDz * bot.speed) + (perpZ * lateralVariance * 0.05);

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

    // Update camera to follow player - Fixed camera system
    if (this.playerCar) {
      const cameraOffset = 15;  // Distance behind car
      const cameraHeight = 8;   // Height above car
      
      // Calculate camera position based on player position and rotation
      const cameraX = this.playerPosition.x - Math.sin(this.playerRotation) * cameraOffset;
      const cameraZ = this.playerPosition.z + Math.cos(this.playerRotation) * cameraOffset;
      const cameraY = this.playerPosition.y + cameraHeight;

      // Position camera behind player
      this.engineHelper.camera.camera3d.center(cameraX, cameraY, cameraZ);
      
      // Look at the player position (not the car position which is offset)
      this.engineHelper.camera.camera3d.lookAt(
        this.playerPosition.x, 
        this.playerPosition.y + 1, 
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
