import React from 'react';
import './styles.css';

export default class Separator extends React.Component {
  render() {
    return (
      <div className="separator-component">
        <div className="line" />
        {this.props.children && (
          <div className="content">{this.props.children}</div>
        )}
        <div className="line" />
      </div>
    );
  }
}
