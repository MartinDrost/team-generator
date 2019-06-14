import React from 'react';
import './styles.css';
import AccessForm from '../../components/accessForm';
import { RouterProps } from 'react-router';

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
  private async enterRoomCode(code: string): Promise<void> {}

  /**
   * Create a new room
   */
  private async createRoom(): Promise<void> {}
}
