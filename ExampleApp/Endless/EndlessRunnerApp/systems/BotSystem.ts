import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Powerup from "../entities/Powerup";
import Boss from "../entities/Boss";
import { LANES } from "../data/waves";

export default class BotSystem {
  private lastActionTime: number = 0;
  private actionCooldown: number = 0.5; // seconds between actions

  update(player: Player, entities: any[], currentTime: number): string | null {
    if (currentTime - this.lastActionTime < this.actionCooldown) {
      return null;
    }

    const action = this.decideAction(player, entities);
    if (action) {
      this.lastActionTime = currentTime;
    }
    
    return action;
  }

  private decideAction(player: Player, entities: any[]): string | null {
    const playerLane = player.currentLane;
    const playerZ = player.position.z;
    
    // Check for immediate threats in current lane
    const immediateThreats = entities.filter(entity => {
      if (entity instanceof Enemy || entity instanceof Boss) {
        const entityZ = entity.position.z;
        const entityLane = entity.laneIndex;
        return entityLane === playerLane && 
               entityZ > playerZ && 
               entityZ < playerZ + 8 && 
               !entity.isDestroyed;
      }
      return false;
    });

    // If there's an immediate threat, shoot
    if (immediateThreats.length > 0) {
      return 'shoot';
    }

    // Check for safe powerups
    const safePowerups = entities.filter(entity => {
      if (entity instanceof Powerup && !entity.isDestroyed) {
        const entityZ = entity.position.z;
        const entityLane = entity.laneIndex;
        
        // Check if powerup is reachable and no enemies are blocking
        if (entityZ > playerZ && entityZ < playerZ + 10) {
          const blockingEnemies = entities.filter(blocker => {
            if (blocker instanceof Enemy || blocker instanceof Boss) {
              return blocker.laneIndex === entityLane && 
                     blocker.position.z > playerZ && 
                     blocker.position.z < entityZ &&
                     !blocker.isDestroyed;
            }
            return false;
          });
          
          return blockingEnemies.length === 0;
        }
      }
      return false;
    });

    // Move to collect safe powerup
    if (safePowerups.length > 0) {
      const closestPowerup = safePowerups.reduce((closest, current) => {
        const closestDist = Math.abs(closest.position.z - playerZ);
        const currentDist = Math.abs(current.position.z - playerZ);
        return currentDist < closestDist ? current : closest;
      });

      const targetLane = closestPowerup.laneIndex;
      if (targetLane < playerLane) {
        return 'moveLeft';
      } else if (targetLane > playerLane) {
        return 'moveRight';
      } else {
        return 'shoot'; // Collect the powerup
      }
    }

    // Check for enemies ahead that can be shot
    const shootableEnemies = entities.filter(entity => {
      if (entity instanceof Enemy || entity instanceof Boss) {
        const entityZ = entity.position.z;
        const entityLane = entity.laneIndex;
        return entityLane === playerLane && 
               entityZ > playerZ && 
               entityZ < playerZ + 15 && 
               !entity.isDestroyed;
      }
      return false;
    });

    if (shootableEnemies.length > 0) {
      return 'shoot';
    }

    // Dodge incoming enemies by moving to safest lane
    const incomingEnemies = entities.filter(entity => {
      if (entity instanceof Enemy || entity instanceof Boss) {
        const entityZ = entity.position.z;
        return entityZ > playerZ && entityZ < playerZ + 12 && !entity.isDestroyed;
      }
      return false;
    });

    if (incomingEnemies.length > 0) {
      const safestLane = this.findSafestLane(playerLane, incomingEnemies);
      if (safestLane < playerLane) {
        return 'moveLeft';
      } else if (safestLane > playerLane) {
        return 'moveRight';
      }
    }

    return null; // No action needed
  }

  private findSafestLane(currentLane: number, enemies: any[]): number {
    const laneDanger = [0, 0, 0, 0]; // Danger score for each lane
    
    enemies.forEach(enemy => {
      if (enemy.laneIndex >= 0 && enemy.laneIndex < laneDanger.length) {
        laneDanger[enemy.laneIndex]++;
      }
    });

    // Find lane with least danger, preferring lanes closer to current position
    let safestLane = currentLane;
    let minDanger = laneDanger[currentLane];
    
    for (let i = 0; i < laneDanger.length; i++) {
      const danger = laneDanger[i];
      const distance = Math.abs(i - currentLane);
      
      // Prefer lanes with less danger, with slight preference for closer lanes
      if (danger < minDanger || (danger === minDanger && distance < Math.abs(safestLane - currentLane))) {
        minDanger = danger;
        safestLane = i;
      }
    }
    
    return safestLane;
  }
}