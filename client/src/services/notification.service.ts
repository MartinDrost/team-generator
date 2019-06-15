import { Severity } from '../enums/severity.enum';
import { Subject } from 'rxjs';
import { INotification } from '../interfaces/notification.interface';

export const notificationService = new (class Service {
  /**
   * Listener for new notifications
   */
  public onNotification: Subject<INotification> = new Subject();

  /**
   * Distributes a notification through all subscribers
   * @param message
   * @param severity
   */
  public add(message: string, severity: Severity): void {
    this.onNotification.next({
      message,
      severity,
    });
  }
})();
