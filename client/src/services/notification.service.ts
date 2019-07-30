import { Subject } from 'rxjs';
import { INotification } from '../interfaces/notification.interface';

export const notificationService = new (class Service {
  private idCounter = 0;

  /**
   * Listener for new notifications
   */
  public onNotification = new Subject<INotification>();

  /**
   * Distributes a notification through all subscribers
   * @param message
   * @param severity
   */
  public add(notification: INotification): void {
    this.onNotification.next({
      ...notification,
      id: ++this.idCounter,
    });
  }
})();
