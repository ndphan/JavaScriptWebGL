import {
  App,
  ObjectManager,
  EngineHelper,
  EngineEvent,
  EngineObject,
  Events,
  Light,
  Rect3d,
  ResourceResolver,
  FontReference,
  Coordinate
} from "synaren-engine";
import Sphere from "../../Sphere";
import Ground3d from "../../Ground3d";
import CameraFollower from "../../../src/Core/EngineEntity/CameraFollower";

import Player from "./entities/Player";
import Enemy from "./entities/Enemy";
import Powerup from "./entities/Powerup";
import Boss from "./entities/Boss";
import Projectile from "./entities/Projectile";
import WaveSystem from "./systems/WaveSystem";
import SpawnSystem from "./systems/SpawnSystem";
import CollisionSystem from "./systems/CollisionSystem";
import BotSystem from "./systems/BotSystem";
import { LANES } from "./data/waves";

export default class EndlessRunnerWorld extends ObjectManager {
  player: Player;
  gameEntities: any[] = []; // Renamed to avoid conflict
  projectiles: Projectile[] = [];
  waveSystem: WaveSystem;
  spawnSystem: SpawnSystem;
  collisionSystem: CollisionSystem;
  botSystem: BotSystem;
  sky: Sphere;
  ground: Ground3d;
  gameOver: boolean = false;
  score: number = 0;
  lastUpdateTime: number = 0;
  botEnabled: boolean = false;
  frameCount: number = 0;
  actionLog: Array<{frame: number, action: string, lane: number}> = [];
  hud: {
    health: FontReference;
    score: FontReference;
    wave: FontReference;
    message: FontReference;
  } | null = null;
  messageTimer: number = 0;
  messageText: string = "";

  constructor() {
    super();
    this.spawnSystem = new SpawnSystem();
    this.waveSystem = new WaveSystem(this.spawnSystem);
    this.collisionSystem = new CollisionSystem();
    this.botSystem = new BotSystem();
  }

  init() {
    // Setup camera behind and above player looking further ahead
    this.engineHelper.camera.camera3d.center(0, 3, -4);
    this.engineHelper.camera.camera3d.lookAt(0, 1, 5);
    this.engineHelper.camera.camera3d.updateProjectionView();

    // Create sky with camera follower
    this.sky = new Sphere(
      new Rect3d(0.0, 2.0, 0.0, 100.0, 100.0, 100.0),
      "background"
    );
    this.sky.addFeature(new CameraFollower(this.engineHelper.camera));
    this.addEntity(this.sky);

    // Create ground
    this.ground = new Ground3d(
      new Rect3d(0.0, 0.0, 0.0, 50, 0, 100),
      "grass"
    );
    this.addEntity(this.ground);

    // Create player
    this.player = new Player();
    this.addEntity(this.player);
    console.log('Player created at position:', this.player.position);

    // Setup lighting
    this.engineHelper.setLighting(
      new Light({
        pos: [0.0, 10, 0],
        in: [0.2, 0.2, 0.2],
        attenuation: 0.015,
        ambientCoeff: 0.4,
        at: [0.0, 0.0, 10.0]
      })
    );

    super.init();
    this.lastUpdateTime = Date.now() / 1000;
  }

  update() {
    this.entities.forEach((ent: any) => ent.update(this.engineHelper));
    
    if (this.gameOver) return;

    // Initialize HUD on first update when engine is ready
    if (!this.hud) {
      this.initHUD();
    }

    this.frameCount++;

    // Update wave system
    this.waveSystem.update(this.engineHelper, this.gameEntities, this.player.speedMultiplier * 5);

    // Update all entities
    this.gameEntities.forEach(entity => {
      if (entity.update) {
        entity.update(this.engineHelper);
      }
    });

    // Update projectiles
    this.projectiles.forEach(proj => proj.update(this.engineHelper));

    // Check projectile collisions
    this.projectiles.forEach(proj => {
      if (proj.isDestroyed) return;
      
      const hitEntity = this.collisionSystem.checkProjectileCollisions(proj, this.gameEntities);
      if (hitEntity) {
        proj.isDestroyed = true;
        
        if (hitEntity instanceof Enemy && hitEntity.takeDamage(this.player.damage)) {
          this.score += 5;
          this.showMessage("Enemy destroyed +5");
        } else if (hitEntity instanceof Boss && hitEntity.takeDamage(this.player.damage)) {
          this.score += 25;
          this.showMessage("Boss defeated +25");
        } else if (hitEntity instanceof Powerup) {
          hitEntity.collect();
          this.applyPowerup(hitEntity);
        }
      }
    });

    // Remove off-screen projectiles (keep for reuse, just mark)
    // No filtering needed - reuse in place

    // Log game state every 60 frames (1 second at 60fps)
    if (this.frameCount % 60 === 0) {
      this.logGameState();
    }

    // Remove off-screen entities
    this.gameEntities = this.gameEntities.filter(entity => {
      return !((entity.isOffScreen && entity.isOffScreen()) || entity.isDestroyed);
    });

    // Check collisions
    const collisions = this.collisionSystem.checkCollisions(this.player, this.gameEntities);
    
    // Handle enemy collisions
    collisions.hitEnemies.forEach(enemy => {
      enemy.isDestroyed = true;
      if (this.player.takeDamage(enemy.damage)) {
        this.gameOver = true;
        this.showMessage("GAME OVER");
      } else {
        this.showMessage(`Hit! Health: ${this.player.health}`);
      }
    });

    // Handle boss collisions
    collisions.hitBosses.forEach(boss => {
      if (this.player.takeDamage(boss.damage)) {
        this.gameOver = true;
        this.showMessage("GAME OVER");
      } else {
        this.showMessage(`Boss hit! Health: ${this.player.health}`);
      }
    });

    // Handle powerup collisions
    collisions.hitPowerups.forEach(powerup => {
      powerup.collect();
      this.applyPowerup(powerup);
      this.score += 10;
    });

    // Bot AI
    if (this.botEnabled) {
      const currentTime = Date.now() / 1000;
      const botAction = this.botSystem.update(this.player, this.gameEntities, currentTime);
      if (botAction) {
        this.executeBotAction(botAction);
      }
    }

    // Auto-fire at rate of fire
    const currentTime = Date.now() / 1000;
    if (this.player.canShoot(currentTime)) {
      this.player.lastShotTime = currentTime;
      this.spawnProjectile();
    }

    this.updateHUD();
    super.update();
  }

  private applyPowerup(powerup: Powerup) {
    switch (powerup.type) {
      case "speed":
        this.player.speedMultiplier += 0.2;
        this.score += 10;
        // Risk: increase ALL enemy speeds
        this.gameEntities.forEach(entity => {
          if (entity instanceof Enemy || entity instanceof Boss) {
            entity.speed *= 1.15;
          }
        });
        this.showMessage("Speed boost!");
        break;
      case "fireRate":
        this.player.fireRate = Math.max(0.1, this.player.fireRate - 0.05);
        this.score += 10;
        this.showMessage("Fire rate up!");
        break;
      case "score":
        this.score += 50;
        this.showMessage("Bonus +50!");
        break;
    }
  }

  event(event: EngineEvent) {
    super.event(event);
    
    if (this.gameOver) return undefined;

    if (event.eventType === Events.KEY_DOWN) {
      const code = (event as any).code;
      console.log('Key pressed:', code);
      switch (code) {
        case 'KeyA':
        case 'ArrowLeft':
          if (!this.botEnabled) {
            this.player.moveRight();
            this.actionLog.push({frame: this.frameCount, action: 'moveRight', lane: this.player.currentLane});
          }
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (!this.botEnabled) {
            this.player.moveLeft();
            this.actionLog.push({frame: this.frameCount, action: 'moveLeft', lane: this.player.currentLane});
          }
          break;
        case 'Space':
          // Space key removed - auto-fire enabled
          break;
        case 'KeyB':
          this.botEnabled = !this.botEnabled;
          this.showMessage(`Bot: ${this.botEnabled ? 'ON' : 'OFF'}`);
          break;
      }
    }
    
    return undefined;
  }

  private executeBotAction(action: string) {
    switch (action) {
      case 'moveLeft':
        this.player.moveLeft();
        break;
      case 'moveRight':
        this.player.moveRight();
        break;
      case 'shoot':
        if (this.player.shoot(Date.now() / 1000)) {
          this.spawnProjectile();
        }
        break;
    }
  }

  private spawnProjectile() {
    // Reuse off-screen projectile
    const offscreen = this.projectiles.find(p => p.isDestroyed || p.isOffScreen());
    if (offscreen) {
      offscreen.isDestroyed = false;
      offscreen.laneIndex = this.player.currentLane;
      offscreen.position.z = this.player.position.z;
      if (offscreen.cube) {
        offscreen.cube.center(LANES[this.player.currentLane], 1, this.player.position.z);
      }
      return;
    }
    
    if (this.projectiles.length >= 20) return;
    
    const projectile = new Projectile(this.player.currentLane, this.player.position.z);
    projectile.init(this.engineHelper);
    this.projectiles.push(projectile);
  }

  private logGameState() {
    const gameState = {
      frame: this.frameCount,
      score: this.score,
      gameOver: this.gameOver,
      player: {
        position: { x: this.player.position.x, y: this.player.position.y, z: this.player.position.z },
        lane: this.player.currentLane,
        health: this.player.health,
        speedMultiplier: this.player.speedMultiplier,
        hasCube: !!this.player.cube,
        cubePosition: this.player.cube ? { x: this.player.cube.position.x, y: this.player.cube.position.y, z: this.player.cube.position.z } : null,
        cubePlanes: this.player.cube?.planes?.length || 0
      },
      camera: {
        position: { x: this.engineHelper.camera.camera3d.position.x, y: this.engineHelper.camera.camera3d.position.y, z: this.engineHelper.camera.camera3d.position.z }
      },
      gameEntities: this.gameEntities.map((entity, i) => {
        const type = entity instanceof Enemy ? 'Enemy' : entity instanceof Boss ? 'Boss' : entity instanceof Powerup ? 'Powerup' : 'Unknown';
        const base: any = {
          index: i,
          type,
          position: { x: entity.position.x, y: entity.position.y, z: entity.position.z },
          destroyed: entity.isDestroyed
        };
        if (entity instanceof Enemy || entity instanceof Boss) {
          base.health = entity.health;
          base.lane = entity.laneIndex;
          base.hasCube = !!entity.cube;
        }
        return base;
      }),
      waveSystem: {
        difficulty: parseFloat(this.waveSystem.getDifficulty().toFixed(2)),
        waveCount: this.waveSystem.getWaveCount(),
        hasCurrentChunk: !!this.spawnSystem.currentChunk
      },
      actionLog: this.actionLog
    };
    console.log('GAME_STATE:', JSON.stringify(gameState, null, 2));
  }

  private initHUD() {
    try {
      const left = 0.02;
      const top = 0.1;
      const line = 0.06;
      
      this.hud = {
        health: FontReference.newFont(new Coordinate(left, top, 0), "hud-health")
          .setText(`Health: ${this.player.health}`)
          .setFontSize(18)
          .setTop(true)
          .setLeft(true),
        score: FontReference.newFont(new Coordinate(left, top + line, 0), "hud-score")
          .setText(`Score: ${this.score}`)
          .setFontSize(18)
          .setTop(true)
          .setLeft(true),
        wave: FontReference.newFont(new Coordinate(left, top + line * 2, 0), "hud-wave")
          .setText(`Wave: ${this.waveSystem.getWaveCount()}`)
          .setFontSize(18)
          .setTop(true)
          .setLeft(true),
        message: FontReference.newFont(new Coordinate(0.5, 0.5, 0), "hud-message")
          .setText("")
          .setFontSize(24)
          .setTop(true)
      };
    } catch (e) {
      console.warn('HUD init failed, will retry');
      this.hud = null;
    }
  }

  private updateHUD() {
    if (!this.hud) return;
    
    this.hud.health.setText(`Health: ${this.player.health}`);
    this.hud.score.setText(`Score: ${this.score}`);
    this.hud.wave.setText(`Wave: ${this.waveSystem.getWaveCount()}`);
    
    if (this.messageTimer > 0) {
      this.messageTimer--;
      this.hud.message.setText(this.messageText);
    } else {
      this.hud.message.setText("");
    }
  }

  private showMessage(msg: string) {
    this.messageText = msg;
    this.messageTimer = 120;
  }

  render() {
    this.entities.forEach((ent: any) => ent.render(this.engineHelper));
    this.gameEntities.forEach(entity => {
      if (entity.render) {
        entity.render(this.engineHelper);
      }
    });
    this.projectiles.forEach(proj => proj.render(this.engineHelper));
    
    if (this.hud) {
      try {
        this.hud.health.render(this.engineHelper);
        this.hud.score.render(this.engineHelper);
        this.hud.wave.render(this.engineHelper);
        this.hud.message.render(this.engineHelper);
      } catch (e) {
        // Font not ready yet
      }
    }
  }

  loadResources() {
    console.log('Loading Endless Runner resources...');
    
    // Reuse existing resources from ExampleApp
    this.engineHelper
      .getResource("assets/sphere.txt")
      .then(ResourceResolver.objResolverMultiple(this.engineHelper, [
        { textureSource: "assets/background.jpg", name: "background" }
      ]))
      .catch(err => console.error('Sphere resource error:', err));

    this.engineHelper
      .getResource("assets/atlas.txt")
      .then(ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3))
      .catch(err => console.error('Atlas resource error:', err));
  }
}

const createEndlessRunnerApp = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const args = {
    world: new EndlessRunnerWorld(),
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
  (window as any).gameInstance = args.world;
  
  app.run().catch(console.error);
  app.unpause();
  
  window.onresize = () => {
    location.reload();
  };
};

export { createEndlessRunnerApp, EndlessRunnerWorld };