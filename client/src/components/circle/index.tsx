import React, { CSSProperties } from 'react';
import './styles.css';

interface IProps {
  size?: number;
  style?: CSSProperties;
  background?: string;
}

export const Circle: React.FC<IProps> = props => {
  const style: CSSProperties = {
    ...props.style,
  };
  if (props.size) {
    style.width = `${props.size}px`;
    style.height = `${props.size}px`;
  }
  if (props.background) {
    style.background = props.background;
  }

  return <div className="circle-component" style={style} />;
};
