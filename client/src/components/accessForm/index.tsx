import React from 'react';
import './styles.css';

interface IProps {
  onCodeSubmit: (code: string) => Promise<any>;
  onCreateRoom: () => Promise<any>;
}

interface IState {}

export default class AccessForm extends React.Component<IProps, IState> {
  render() {
    return (
      <form className="access-form-component">
        <label>Enter room code</label>
      </form>
    );
  }
}
