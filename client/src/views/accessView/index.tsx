import React from 'react';
import './styles.css';
import AccessForm from '../../components/accessForm';
import { RouterProps } from 'react-router';
import { roomService } from '../../services/room.service';
import { IRoom } from 'team-generator-packages/interfaces';
import { json } from '../../utils/statics.utils';

export default class AccessView extends React.Component<RouterProps> {
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
    await roomService.getRoom(code);
    this.props.history.push(`/room/${code}`);
  }

  /**
   * Create a new room
   */
  private async createRoom(): Promise<void> {
    const room = await json<IRoom>(roomService.createRoom());
    this.props.history.push(`/room/${room.codes.admin}`);
  }
}