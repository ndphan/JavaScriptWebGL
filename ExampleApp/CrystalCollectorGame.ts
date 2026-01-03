import {
  App,
  EngineEvent,
  EngineObject,
  Events,
  Light,
  ObjectManager,
  Rect3d,
  ResourceResolver
} from "synaren-engine";
import Cube from "./Cube";
import Ground3d from "./Ground3d";
import Sphere from "./Sphere";

interface Crystal {
  sphere: Sphere;
  collected: boolean;
  glowIntensity: number;
  glowDirection: number;
}

interface Obstacle {
  cube: Cube;
  rotationSpeed: number;
}

export default class CrystalCollectorGame extends ObjectManager {
  // Game state
  score: number = 0;
  timeLeft: number = 60; // 60 seconds game time
  gameStarted: boolean = false;
  gameEnded: boolean = false;
  
  // Game objects
  player: Sphere;
  crystals: Crystal[] = [];
  obstacles: Obstacle[] = [];
  ground: Ground3d;
  sky: Sphere;
  
  // Player movement
  playerSpeed: number = 0.1;
  playerPosition: { x: number, y: number, z: number } = { x: 0, y: 1, z: 0 };
  keys: { [key: string]: boolean } = {};
  
  // Game timer
  gameTimer: number | null = null;

  constructor() {
    super();
  }

  startGame() {
    this.gameStarted = true;
    this.gameEnded = false;
    this.score = 0;
    this.timeLeft = 60;
    
    // Start countdown timer
    this.gameTimer = window.setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
    
    // Reset crystals
    this.crystals.forEach(crystal => {
      crystal.collected = false;
      // Reset crystal position to original
      crystal.sphere.center(crystal.sphere.position.x, 1, crystal.sphere.position.z);
    });
    
    // Reset player position
    this.playerPosition = { x: 0, y: 1, z: 0 };
    this.player.center(0, 1, 0);
    
    // Update camera to follow player
    this.engineHelper.camera.camera3d.center(0, 3, 5);
    this.engineHelper.camera.camera3d.updateProjectionView();
  }

  endGame() {
    this.gameEnded = true;
    this.gameStarted = false;
    
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }

  restartGame() {
    this.gameEnded = false;
    this.startGame();
  }

  checkCollisions() {
    if (!this.gameStarted || this.gameEnded) return;
    
    // Check crystal collection
    this.crystals.forEach((crystal, index) => {
      if (!crystal.collected) {
        const distance = Math.sqrt(
          Math.pow(this.playerPosition.x - crystal.sphere.position.x, 2) +
          Math.pow(this.playerPosition.y - crystal.sphere.position.y, 2) +
          Math.pow(this.playerPosition.z - crystal.sphere.position.z, 2)
        );
        
        if (distance < 1.5) {
          crystal.collected = true;
          // Move crystal far away instead of hiding it
          crystal.sphere.center(1000, 1000, 1000);
          this.score += 10;
          
          // Check if all crystals collected
          if (this.crystals.every(c => c.collected)) {
            this.score += this.timeLeft * 2; // Bonus points for time left
            this.endGame();
          }
        }
      }
    });
    
    // Check obstacle collisions
    this.obstacles.forEach(obstacle => {
      const distance = Math.sqrt(
        Math.pow(this.playerPosition.x - obstacle.cube.position.x, 2) +
        Math.pow(this.playerPosition.y - obstacle.cube.position.y, 2) +
        Math.pow(this.playerPosition.z - obstacle.cube.position.z, 2)
      );
      
      if (distance < 2) {
        // Penalty for hitting obstacle
        this.score = Math.max(0, this.score - 5);
        // Push player away
        const dx = this.playerPosition.x - obstacle.cube.position.x;
        const dz = this.playerPosition.z - obstacle.cube.position.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        if (length > 0) {
          this.playerPosition.x += (dx / length) * 2;
          this.playerPosition.z += (dz / length) * 2;
        }
      }
    });
  }

  updatePlayer() {
    if (!this.gameStarted || this.gameEnded) return;
    
    const newPosition = { ...this.playerPosition };
    
    // WASD movement using keyboard codes
    if (this.keys['keyw']) newPosition.z -= this.playerSpeed;
    if (this.keys['keys']) newPosition.z += this.playerSpeed;
    if (this.keys['keya']) newPosition.x -= this.playerSpeed;
    if (this.keys['keyd']) newPosition.x += this.playerSpeed;
    
    // Boundary checking (keep player in play area)
    const boundary = 15;
    newPosition.x = Math.max(-boundary, Math.min(boundary, newPosition.x));
    newPosition.z = Math.max(-boundary, Math.min(boundary, newPosition.z));
    
    this.playerPosition = newPosition;
    this.player.center(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z);
    
    // Update camera to follow player
    this.engineHelper.camera.camera3d.center(
      this.playerPosition.x,
      this.playerPosition.y + 3,
      this.playerPosition.z + 5
    );
    this.engineHelper.camera.camera3d.updateProjectionView();
  }

  updateCrystals() {
    this.crystals.forEach(crystal => {
      if (!crystal.collected) {
        // Glow effect
        crystal.glowIntensity += crystal.glowDirection * 0.02;
        if (crystal.glowIntensity >= 1) {
          crystal.glowDirection = -1;
        } else if (crystal.glowIntensity <= 0.3) {
          crystal.glowDirection = 1;
        }
        
        // Floating animation
        const time = Date.now() * 0.001;
        const floatOffset = Math.sin(time * 2) * 0.2;
        crystal.sphere.position.y = 1 + floatOffset;
        
        // Slow rotation
        crystal.sphere.angleY(time * 50);
      }
    });
  }

  updateObstacles() {
    this.obstacles.forEach(obstacle => {
      obstacle.cube.position.ay += obstacle.rotationSpeed;
      obstacle.cube.planes?.forEach(plane => {
        plane.angleY(obstacle.cube.position.ay);
      });
    });
  }

  updateUI() {
    if (this.gameEnded) {
      const allCrystalsCollected = this.crystals.every(c => c.collected);
      if (allCrystalsCollected) {
        console.log(`🎉 YOU WIN! Final Score: ${this.score} | Press R to restart`);
      } else {
        console.log(`⏰ TIME'S UP! Final Score: ${this.score} | Press R to restart`);
      }
    }
  }

  render() {
    this.entities.forEach((ent: EngineObject, index: number) => ent.render(this.engineHelper));
  }

  update() {
    this.entities.forEach((ent: EngineObject) => ent.update(this.engineHelper));
    
    this.updatePlayer();
    this.updateCrystals();
    this.updateObstacles();
    this.checkCollisions();
    this.updateUI();

    const { x, y, z } = this.engineHelper.camera.camera3d.position;
    if (this.sky) {
      this.sky.center(x, y, z);
    }
    
  }

  event(event: EngineEvent) {
    console.log(`Event: ${event.eventType}, Time: ${event.timeStamp} ms, keys: ${JSON.stringify(event)}`);
    // Handle keyboard events
    if (event.eventType === Events.KEY_DOWN) {
      const keyEvent = event as any; // Cast to access keyboard properties
      if (keyEvent.code) {
        this.keys[keyEvent.code.toLowerCase()] = true;
        
        // Start game on spacebar
        if (keyEvent.code === 'Space' && !this.gameStarted && !this.gameEnded) {
          this.startGame();
        }
        
        // Restart game on R
        if (keyEvent.code === 'KeyR' && this.gameEnded) {
          this.restartGame();
        }
      }
    }
    
    if (event.eventType === Events.KEY_UP) {
      const keyEvent = event as any; // Cast to access keyboard properties
      if (keyEvent.code) {
        this.keys[keyEvent.code.toLowerCase()] = false;
      }
    }
    
    // Mouse look controls
    if (event.eventType === Events.DRAG) {
      this.engineHelper.camera.camera3d.angleY(-event.dxRaw * 0.5);
      this.engineHelper.camera.camera3d.angleX(event.dyRaw * 0.5);
      this.engineHelper.camera.camera3d.updateProjectionView();
    }
    
    return undefined;
  }

  loadResources() {
    console.log('Loading Crystal Collector game resources...');
    
    this.engineHelper
      .getResource("assets/sphere.txt")
      .then(
        ResourceResolver.objResolverMultiple(this.engineHelper, [
          { textureSource: "assets/background.jpg", name: "background" },
          { textureSource: "assets/sun.png", name: "crystal" }
        ])
      ).then(() => console.log('Sphere resources loaded'))
      .catch(err => console.error('Sphere resource error:', err));

    this.engineHelper
      .getResource("assets/atlas.txt")
      .then(
        ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3)
      ).then(() => console.log('Atlas resources loaded'))
      .catch(err => console.error('Atlas resource error:', err));
  }

  init() {
    const length = 30;
    const width = 30;

    // Initialize camera
    this.engineHelper.camera.camera3d.center(0, 3, 5);
    this.engineHelper.camera.camera3d.updateProjectionView();

    // Create sky
    this.sky = new Sphere(
      new Rect3d(0.0, 2.0, 0.0, 100.0, 100.0, 100.0),
      "background"
    );
    this.addEntity(this.sky);

    // Create ground
    this.ground = new Ground3d(
      new Rect3d(0.0, 0.0, 0.0, width, 0, length),
      "grass"
    );
    this.addEntity(this.ground);

    // Create player (blue sphere)
    this.player = new Sphere(new Rect3d(0, 1, 0, 0.8, 0.8, 0.8), "crystal");
    this.player.scale(0.5, 0.5, 0.5);
    this.addEntity(this.player);

    // Create crystals to collect (8 crystals placed around the map)
    const crystalPositions = [
      { x: 5, z: 5 }, { x: -5, z: 5 }, { x: 5, z: -5 }, { x: -5, z: -5 },
      { x: 8, z: 0 }, { x: -8, z: 0 }, { x: 0, z: 8 }, { x: 0, z: -8 }
    ];
    
    crystalPositions.forEach((pos, index) => {
      const crystal = new Sphere(new Rect3d(pos.x, 1, pos.z, 0.6, 0.6, 0.6), "crystal");
      const crystalData: Crystal = {
        sphere: crystal,
        collected: false,
        glowIntensity: 0.5,
        glowDirection: 1
      };
      this.crystals.push(crystalData);
      this.addEntity(crystal);
    });

    // Create rotating obstacles (spinning cubes)
    const obstaclePositions = [
      { x: 3, z: 3 }, { x: -3, z: 3 }, { x: 3, z: -3 }, { x: -3, z: -3 },
      { x: 6, z: -2 }, { x: -6, z: 2 }
    ];
    
    obstaclePositions.forEach((pos, index) => {
      const obstacle = new Cube(
        new Rect3d(pos.x, 1, pos.z, 1.2, 1.2, 1.2), 
        "assets/atlas.png", 
        ["rock", "rock", "rock", "rock", "rock", "rock"]
      );
      
      const obstacleData: Obstacle = {
        cube: obstacle,
        rotationSpeed: 2 + Math.random() * 3 // Random rotation speed
      };
      
      this.obstacles.push(obstacleData);
      this.addEntity(obstacle);
    });

    // Initialize all engine objects
    super.init();

    // Set up lighting
    this.engineHelper.setLighting(
      new Light({
        pos: [0.0, 15, 0],
        in: [1.0, 1.0, 1.0],
        attenuation: 0.01,
        ambientCoeff: 0.4,
        at: [0.0, 0.0, 0.0]
      })
    );
  }
}

const createCrystalCollectorApp = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const args = {
    world: new CrystalCollectorGame(),
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

// Export for use in other files
export { createCrystalCollectorApp, CrystalCollectorGame };

