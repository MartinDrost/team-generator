import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IRoom } from 'team-generator-packages/interfaces';
import AccessForm from '../../components/accessForm';
import { roomService } from '../../services/room.service';
import { json } from '../../utils/statics.utils';
import './styles.css';

export default class AccessView extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div className="access-view">
        <AccessForm
          onCodeSubmit={(code: string) => this.enterRoomCode(code)}
          onCreateRoom={() => this.createRoom()}
        />
      </div>
    );
  }

  /**
   * Attempt to join a room by its code
   * @param code
   */
  private async enterRoomCode(code: string): Promise<void> {
    await roomService.getRoom(code, { useTimeout: true, showError: true });
    this.props.history.push(`/room/${code}`);
  }

  /**
   * Create a new room
   */
  private async createRoom(): Promise<void> {
    const room = await json<IRoom>(
      roomService.createRoom({ useTimeout: true, showError: true }),
    );
    this.props.history.push(`/room/${room.codes.admin}`);
  }
}
