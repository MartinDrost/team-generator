import React from 'react';
import './styles.css';
import { INotification } from '../../interfaces/notification.interface';
import { Subscription } from 'rxjs';
import Notification from '../notification';
import { notificationService } from '../../services/notification.service';
import { Spring } from 'react-spring/renderprops';

interface IProps {}

interface IState {
  notifications: INotification[];
}

export default class NotificationCenter extends React.Component<
  IProps,
  IState
> {
  public state: IState = {
    notifications: [],
  };

  private notificationSubscription?: Subscription;

  componentDidMount() {
    // subscribe on new notifications
    this.notificationSubscription = notificationService.onNotification.subscribe(
      notification => this.addNotification(notification),
    );
  }

  componentWillUnmount() {
    // unsubscribe from Subject
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  render() {
    return (
      <div className="notification-center-component">
        {this.state.notifications.map(notification => (
          <Spring
            key={notification.id}
            from={{ opacity: 0, marginTop: '-80px' }}
            to={{ opacity: 1, marginTop: '0' }}
          >
            {props => (
              <div style={props}>
                <Notification notification={notification} />
              </div>
            )}
          </Spring>
        ))}
      </div>
    );
  }

  /**
   * Adds a new notification to the view
   * @param notification
   */
  private addNotification(notification: INotification): void {
    const notifications = [notification, ...this.state.notifications];
    setTimeout(() => this.removeNotification(notification.id), 5000);

    this.setState({ notifications });
  }

  /**
   * Removes a notificatio by its id
   * @param id
   */
  private removeNotification(id: number): void {
    const notifications = this.state.notifications.filter(
      item => item.id !== id,
    );

    this.setState({ notifications });
  }
}
