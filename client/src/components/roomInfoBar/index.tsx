import React from 'react';
import './styles.css';
import { IRoom } from 'team-generator-packages/interfaces';
import exitIcon from '../../assets/exit-icon.svg';
import { Link } from 'react-router-dom';

interface IProps {
  room: IRoom;
}

export default class RoomInfoBar extends React.Component<IProps> {
  render() {
    return (
      <div className="room-info-bar-component">
        <div
          className="room-code"
          title={
            this.props.room.codes.admin
              ? `Admin: ${this.props.room.codes.admin}`
              : undefined
          }
        >
          Room <strong>{this.props.room.codes.spectator}</strong>
        </div>
        <Link to="/" className="exit-button">
          <img src={exitIcon} height={20} alt={'Exit'} />
        </Link>
      </div>
    );
  }
}
