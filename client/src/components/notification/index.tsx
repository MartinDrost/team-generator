import React from 'react';
import './styles.css';
import { INotification } from '../../interfaces/notification.interface';

interface IProps {
  notification: INotification;
}

export default class Notification extends React.Component<IProps> {
  componentDidMount() {}

  render() {
    return (
      <div className="notification-component">
        <div
          className={`severity-indicator severity-${this.props.notification.severity}`}
        />
        {this.props.notification.message}
      </div>
    );
  }
}
