import MailNotificationService from './mail';

export interface NotificationService {
  notify(data: any): Promise<any>;
}

export enum NotificationType {
  mail = 'mail',
}

export class NotificationManager {
  static getService(
    type: NotificationType,
    options?: any,
  ): NotificationService | null {
    switch (type) {
      case NotificationType.mail:
        return new MailNotificationService(options);
      default:
        return null;
    }
  }
}

export default NotificationManager;
