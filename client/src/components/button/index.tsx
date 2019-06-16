import React, { ButtonHTMLAttributes } from 'react';
import './styles.css';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default class Button extends React.Component<IProps> {
  render() {
    return (
      <button
        {...{ type: 'button', ...this.props, className: 'button-component' }}
      >
        {this.props.children}
      </button>
    );
  }
}
