import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Powerup from "../entities/Powerup";
import Boss from "../entities/Boss";
import { LANES } from "../data/waves";

export default class CollisionSystem {
  
  checkCollisions(player: Player, entities: any[]): {
    hitEnemies: Enemy[];
    hitPowerups: Powerup[];
    hitBosses: Boss[];
  } {
    const hitEnemies: Enemy[] = [];
    const hitPowerups: Powerup[] = [];
    const hitBosses: Boss[] = [];

    entities.forEach(entity => {
      if (entity instanceof Enemy && !entity.isDestroyed) {
        if (this.checkCollision(player, entity)) {
          hitEnemies.push(entity);
        }
      } else if (entity instanceof Powerup && !entity.isDestroyed) {
        if (this.checkCollision(player, entity)) {
          hitPowerups.push(entity);
        }
      } else if (entity instanceof Boss && !entity.isDestroyed) {
        if (this.checkCollision(player, entity)) {
          hitBosses.push(entity);
        }
      }
    });

    return { hitEnemies, hitPowerups, hitBosses };
  }

  checkShootingCollisions(player: Player, entities: any[]): {
    hitEnemies: Enemy[];
    hitBosses: Boss[];
  } {
    const hitEnemies: Enemy[] = [];
    const hitBosses: Boss[] = [];
    const playerLaneX = LANES[player.currentLane];
    const playerZ = player.position.z;

    entities.forEach(entity => {
      if (entity instanceof Enemy && !entity.isDestroyed) {
        const entityLaneX = LANES[entity.laneIndex];
        const entityZ = entity.position.z;
        
        // Check if enemy is in same lane and ahead of player
        if (Math.abs(playerLaneX - entityLaneX) < 0.5 && entityZ > playerZ && entityZ < playerZ + 15) {
          hitEnemies.push(entity);
        }
      } else if (entity instanceof Boss && !entity.isDestroyed) {
        const entityLaneX = LANES[entity.laneIndex];
        const entityZ = entity.position.z;
        
        // Boss has larger hitbox
        if (Math.abs(playerLaneX - entityLaneX) < 1.0 && entityZ > playerZ && entityZ < playerZ + 15) {
          hitBosses.push(entity);
        }
      }
    });

    return { hitEnemies, hitBosses };
  }

  private checkCollision(player: Player, entity: Enemy | Powerup | Boss): boolean {
    const playerX = LANES[player.currentLane];
    const playerZ = player.position.z;
    
    let entityX: number;
    let entityZ: number;
    let radius: number;

    if (entity instanceof Enemy) {
      entityX = LANES[entity.laneIndex];
      entityZ = entity.position.z;
      radius = 0.8;
    } else if (entity instanceof Powerup) {
      entityX = LANES[entity.laneIndex];
      entityZ = entity.position.z;
      radius = 0.7;
    } else if (entity instanceof Boss) {
      entityX = LANES[entity.laneIndex];
      entityZ = entity.position.z;
      radius = 1.2;
    } else {
      return false;
    }

    // Simple distance check in XZ plane
    const dx = playerX - entityX;
    const dz = playerZ - entityZ;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    return distance < radius;
  }
}