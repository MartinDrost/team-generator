import React from 'react';
import Button from '../button';
import InputSequence from '../inputSequence';
import Separator from '../separator';
import './styles.css';

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
          length={4}
          onComplete={values => this.enterRoomCode(values)}
        />
        <Separator>or</Separator>
        <Button
          disabled={this.state.disabled}
          onClick={() => this.createRoom()}
          shape="large"
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
      this.setState({ disabled: false });
    }
  }
}
