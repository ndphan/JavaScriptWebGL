import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Powerup from "../entities/Powerup";
import Boss from "../entities/Boss";
import Projectile from "../entities/Projectile";
import { CollisionDetection } from "../../../../src/Core/Physics/CollisionDetection";

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

  checkProjectileCollisions(projectile: Projectile, entities: (Enemy | Boss | Powerup)[]): Enemy | Boss | null {
    for (const entity of entities) {
      if ((entity instanceof Enemy || entity instanceof Boss) && !entity.isDestroyed) {
        if (this.checkCollision(projectile, entity, 0.8)) {
          return entity;
        }
      }
    }
    return null;
  }

  private checkCollision(entity1: Player | Projectile, entity2: Enemy | Boss | Powerup, radius: number): boolean {
    const pos1 = entity1.sprite?.position || entity1.position;
    const pos2 = entity2.sprite?.position || entity2.position;
    return CollisionDetection.getLength(pos1.x, pos1.z, pos2.x, pos2.z) < radius;
  }
}