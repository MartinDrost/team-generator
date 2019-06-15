import React, { InputHTMLAttributes } from 'react';
import './styles.css';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

export default class Input extends React.Component<IProps> {
  render() {
    return <input {...{ ...this.props, className: 'input-component' }} />;
  }
}
