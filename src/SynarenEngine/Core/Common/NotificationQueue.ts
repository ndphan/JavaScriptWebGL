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

class NotificationQueue {
  queueMap: { [key: string]: NotificationPayload[] };

  constructor() {
    this.queueMap = {};
  }

  clearQueue() {
    this.queueMap = {};
  }

  pushPayload(notification: NotificationPayload) {
    const key = notification.key;
    if (!this.queueMap[key]) {
      this.queueMap[key] = [];
    }
    this.queueMap[key].push(notification);
  }

  push(notification: Notification, data?: any) {
    if (notification instanceof NotificationPayload) {
      console.error("please use pushPayload");
    }
    this.pushPayload(
      new NotificationPayload(notification.key, notification.action, data)
    );
  }

  pushNotification(key: string, action: string) {
    this.push(new Notification(key, action));
  }

  take(key: string): NotificationPayload[] {
    const notification = this.queueMap[key];
    delete this.queueMap[key];
    return notification || [];
  }

  peak(key: string): NotificationPayload[] {
    return this.queueMap[key] || [];
  }
}

export default NotificationQueue;
