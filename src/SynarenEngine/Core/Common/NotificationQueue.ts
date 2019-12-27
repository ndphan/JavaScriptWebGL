export class Notification {
  key: string;
  action: string;

  constructor(key: string, action: string) {
    this.key = key;
    this.action = action;
  }
}

export class NotificationPayload extends Notification {
  data?: any;

  constructor(key: string, action: string, data?: any) {
    super(key, action);
    this.data = data;
  }

  static from(notification: Notification, data?: any): NotificationPayload {
    return new NotificationPayload(notification.key, notification.action, data);
  }
}

class LinkedList {
  next?: LinkedList;
  data: NotificationPayload;

  constructor(data: NotificationPayload) {
    this.data = data;
  }
}

class NotificationQueue {
  queueMap: { [key: string]: { bottom?: LinkedList; top?: LinkedList } };

  constructor() {
    this.queueMap = {};
  }

  clearQueue() {
    this.queueMap = {};
  }

  pushPayload(notification: NotificationPayload) {
    const key = notification.key;
    let nodes = this.queueMap[key];
    if (!nodes) {
      this.queueMap[key] = { bottom: undefined, top: undefined };
      nodes = this.queueMap[key];
    }
    if (!nodes.bottom) {
      nodes.bottom = new LinkedList(notification);
      nodes.top = nodes.bottom;
    } else if (nodes.top) {
      nodes.top.next = new LinkedList(notification);
      nodes.top = nodes.top.next;
    } else {
      throw new Error("Unexpected state for notification push payload");
    }
  }

  push(notification: Notification, data?: any) {
    if (notification instanceof NotificationPayload) {
      console.error("Please use pushPayload");
    }
    this.pushPayload(
      new NotificationPayload(notification.key, notification.action, data)
    );
  }

  pushNotification(key: string, action: string) {
    this.push(new Notification(key, action));
  }

  take(key: string): NotificationPayload | undefined {
    const bottom = this.getBottom(key);
    if (!bottom) {
      return undefined;
    }
    const data = this.peak(key);
    if (!data) {
      throw new Error(
        "Expected data to appear when reading data from notification"
      );
    }
    this.shiftQueue(key);
    return data;
  }

  shiftQueue(key: string) {
    const nodes = this.queueMap[key];
    const bottom = nodes.bottom;
    if (bottom) {
      nodes.bottom = bottom.next;
      if (!nodes.bottom) {
        nodes.top = undefined;
      }
    } else {
      throw new Error("Trying to shift queue with bottom undefined");
    }
  }

  getBottom(key: string): LinkedList | undefined {
    return this.queueMap[key] ? this.queueMap[key].bottom : undefined;
  }

  peak(key: string): NotificationPayload | undefined {
    const bottom = this.getBottom(key);
    return (bottom && bottom.data) || undefined;
  }
}

export default NotificationQueue;
