import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Powerup from "../entities/Powerup";
import Boss from "../entities/Boss";
import Projectile from "../entities/Projectile";
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
        if (this.checkCollision(player, entity, 0.8)) {
          hitEnemies.push(entity);
        }
      } else if (entity instanceof Powerup && !entity.isDestroyed) {
        if (this.checkCollision(player, entity, 0.7)) {
          hitPowerups.push(entity);
        }
      } else if (entity instanceof Boss && !entity.isDestroyed) {
        if (this.checkCollision(player, entity, 1.2)) {
          hitBosses.push(entity);
        }
      }
    });

    return { hitEnemies, hitPowerups, hitBosses };
  }

  checkProjectileCollisions(projectile: Projectile, entities: any[]): any | null {
    for (const entity of entities) {
      if ((entity instanceof Enemy || entity instanceof Boss || entity instanceof Powerup) && !entity.isDestroyed) {
        if (this.checkCollision(projectile, entity, 0.8)) {
          return entity;
        }
      }
    }
    return null;
  }

  private checkCollision(entity1: any, entity2: any, radius: number): boolean {
    const dx = entity1.position.x - entity2.position.x;
    const dy = entity1.position.y - entity2.position.y;
    const dz = entity1.position.z - entity2.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance < radius;
  }
}