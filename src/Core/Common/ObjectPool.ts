export interface PoolClazz {
  dispose(): void;
  newInstance(...any: any[]): PoolClazz;
}

export class DefaultPoolClazz implements PoolClazz {
  dispose() {}
  newInstance(...any: any[]): PoolClazz {
    return this;
  }
}

export default class ObjectPool {
  private pool: PoolClazz[] = [];

  constructor(private Instance: any) {}

  newInstance(...args: any[]): PoolClazz {
    let instance;
    if (this.pool.length === 0) {
      instance = new this.Instance();
    } else {
      instance = this.pool.pop();
    }
    instance.newInstance(...args);
    return instance;
  }

  release(instance: PoolClazz) {
    instance.dispose();
    this.pool.push(instance);
  }
}
