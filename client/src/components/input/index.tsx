import React, { InputHTMLAttributes } from 'react';
import './styles.css';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  shape?: 'small' | 'normal' | 'large';
}

export default class Input extends React.Component<IProps> {
  render() {
    return (
      <input
        {...{
          ...this.props,
          className: `input-component input-${this.props.shape || 'normal'}`,
        }}
      />
    );
  }
}
