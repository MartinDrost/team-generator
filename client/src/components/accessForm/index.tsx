import React from 'react';
import './styles.css';
import Separator from '../separator';
import Button from '../button';
import InputSequence from '../inputSequence';

interface IProps {
  onCodeSubmit: (code: string) => any;
  onCreateRoom: () => any;
}

interface IState {}

export default class AccessForm extends React.Component<IProps, IState> {
  render() {
    return (
      <form className="access-form-component">
        <label>Enter room code</label>
        <InputSequence length={5} onComplete={values => console.log} />
        <Separator>or</Separator>
        <Button onClick={() => this.props.onCreateRoom()}>Create room</Button>
      </form>
    );
  }
}
