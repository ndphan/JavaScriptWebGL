export class Subscription {
  key: string;

  constructor(key: string) {
    this.key = key;
  }
}

export class SubscriptionListeners extends Subscription {
  listeners: { [key: number]: (data: any) => void } = {};
  subscriptionId = 0;

  constructor(key: string) {
    super(key);
  }

  listen(callback: (data: any) => void): number {
    this.listeners[this.subscriptionId++] = callback;
    return this.subscriptionId - 1;
  }

  unlisten(subscriptionId: number) {
    delete this.listeners[subscriptionId];
  }

  publish(data: any) {
    Object.values(this.listeners).forEach(listener => listener(data));
  }

  flush() {
    this.listeners = {};
  }
}

class SubscriberPool {
  subscribers: { [key: string]: SubscriptionListeners };

  constructor() {
    this.subscribers = {};
  }

  listen(subscription: Subscription, callback: (data: any) => void): number {
    return this.getSubscriptionListeners(subscription).listen(callback);
  }

  getSubscriptionListeners(subscription: Subscription) {
    const key = subscription.key;
    if (!this.subscribers[key]) {
      this.subscribers[key] = new SubscriptionListeners(key);
    }
    return this.subscribers[key];
  }

  publish(subscription: Subscription, data?: any) {
    this.getSubscriptionListeners(subscription).publish(data);
  }
}

export default SubscriberPool;
