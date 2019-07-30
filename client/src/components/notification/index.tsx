import React from 'react';
import { INotification } from '../../interfaces/notification.interface';
import { mediaService } from '../../services/media.service';
import './styles.css';

interface IProps {
  notification: INotification;
  onDelete?: (notification: INotification) => any;
}

export default class Notification extends React.Component<IProps> {
  componentDidMount() {}

  render() {
    return (
      <div className="notification-component">
        {this.props.notification.imagePath ? (
          <div
            className="notification-image"
            style={{
              backgroundImage: `url(${mediaService.media_endpoint +
                this.props.notification.imagePath})`,
            }}
          />
        ) : (
          <div
            className={`severity-indicator severity-${this.props.notification.severity}`}
          />
        )}
        {this.props.notification.message}
        {this.props.notification.action && (
          <div
            className="notification-action"
            onClick={() =>
              this.props.onDelete &&
              this.props.onDelete(this.props.notification)
            }
          >
            {this.props.notification.action}
          </div>
        )}
      </div>
    );
  }
}
