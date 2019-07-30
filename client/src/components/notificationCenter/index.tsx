import React from 'react';
import { Transition } from 'react-spring/renderprops';
import { Subscription } from 'rxjs';
import { INotification } from '../../interfaces/notification.interface';
import { notificationService } from '../../services/notification.service';
import Notification from '../notification';
import './styles.css';

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
        <Transition
          items={this.state.notifications}
          keys={item => item.id || 0}
          from={{ opacity: 0, marginTop: '-80px' }}
          enter={{ opacity: 1, marginTop: '0' }}
          leave={{ opacity: 0 }}
        >
          {item => props => (
            <div style={props}>
              <Notification
                notification={item}
                onDelete={notification =>
                  this.removeNotification(notification.id!)
                }
              />
            </div>
          )}
        </Transition>
      </div>
    );
  }

  /**
   * Adds a new notification to the view
   * @param notification
   */
  private addNotification(notification: INotification): void {
    const notifications = [notification, ...this.state.notifications];
    setTimeout(
      () => this.removeNotification(notification.id!),
      notification.duration || 5000,
    );

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
