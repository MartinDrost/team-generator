import React from 'react';
import './styles.css';
import { RouteComponentProps } from 'react-router';
import { roomService } from '../../services/room.service';
import { IRoom } from 'team-generator-packages/interfaces';
import { json } from '../../utils/statics.utils';
import { notificationService } from '../../services/notification.service';
import { Severity } from '../../enums/severity.enum';
import { IErrorResponse } from '../../interfaces/errorResponse.interface';
import RoomInfoBar from '../../components/roomInfoBar';
import TeamTable from '../../components/teamTable';

interface IParams {
  accessCode: string;
}

interface IState {
  room: IRoom | null;
  generating: boolean;
}

export default class RoomView extends React.Component<
  RouteComponentProps<IParams>,
  IState
> {
  private accessCode: string = '';
  public state: IState = {
    room: null,
    generating: false,
  };

  componentDidMount() {
    this.accessCode = this.props.match.params.accessCode;
    this.accessRoom();
  }

  componentWillUnmount() {
    this.unbindListeners();
  }

  render() {
    if (!this.state.room) {
      return <div className="room-view"></div>;
    }
    return (
      <div className="room-view">
        <RoomInfoBar room={this.state.room} />
        <TeamTable room={this.state.room} generating={this.state.generating} />
      </div>
    );
  }

  /**
   * Attempts to access a room
   */
  private async accessRoom() {
    try {
      const room = await json<IRoom>(roomService.getRoom(this.accessCode));
      roomService.joinRoomSocket(room.codes.admin || room.codes.spectator);
      this.bindListeners();

      this.setState({ room });
    } catch (err) {
      const error = await json<IErrorResponse>(err);
      notificationService.add(error.message, Severity.ALERT);

      this.props.history.push('');
    }
  }

  /**
   * Binds the socket listeners for this view
   */
  private bindListeners() {}

  /**
   * Unbinds the socket listeners for this view
   */
  private unbindListeners() {}
}
