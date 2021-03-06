import React, { ButtonHTMLAttributes } from 'react';
import './styles.css';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: 'default' | 'pill' | 'large';
}

export default class Button extends React.Component<IProps> {
  render() {
    return (
      <button
        {...{
          type: 'button',
          ...this.props,
          className: `button-component button-${this.props.shape} ${this.props.className}`,
        }}
      >
        {this.props.children}
      </button>
    );
  }
}
