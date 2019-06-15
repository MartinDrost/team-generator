import React from 'react';
import './styles.css';
import Separator from '../separator';
import Button from '../button';
import InputSequence from '../inputSequence';
import { json } from '../../utils/statics.utils';
import { IErrorResponse } from '../../interfaces/errorResponse.interface';
import { notificationService } from '../../services/notification.service';
import { Severity } from '../../enums/severity.enum';

interface IProps {
  onCodeSubmit: (code: string) => any;
  onCreateRoom: () => any;
}

interface IState {
  disabled: boolean;
}

export default class AccessForm extends React.Component<IProps, IState> {
  public state: IState = {
    disabled: false,
  };

  render() {
    return (
      <form className="access-form-component">
        <label>Enter room code</label>
        <InputSequence
          disabled={this.state.disabled}
          length={5}
          onComplete={values => this.enterRoomCode(values)}
        />
        <Separator>or</Separator>
        <Button
          disabled={this.state.disabled}
          onClick={() => this.createRoom()}
        >
          Create room
        </Button>
      </form>
    );
  }

  /**
   * Attempt to join a room by its code
   * @param code
   */
  private async enterRoomCode(code: string[]): Promise<void> {
    try {
      this.setState({ disabled: true });
      await this.props.onCodeSubmit(code.join(''));
    } catch (err) {
      const error: IErrorResponse = await json(err);
      notificationService.add(error.message, Severity.ALERT);

      this.setState({ disabled: false });
    }
  }

  /**
   * Create a new room
   */
  private async createRoom(): Promise<void> {
    try {
      this.setState({ disabled: true });
      await this.props.onCreateRoom();
    } catch (err) {
      const error: IErrorResponse = await json(err);
      notificationService.add(error.message, Severity.ALERT);

      this.setState({ disabled: false });
    }
  }
}
