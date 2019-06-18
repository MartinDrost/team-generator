import React from 'react';
import './styles.css';
import { Singleton } from 'react-singletons';

interface IProps {
  refElement: HTMLElement;
  children: React.ReactNode;
}

interface IState {
  left: number;
  bottom: number;
}

export const Popover = new Singleton<IProps>(
  class Popover extends React.Component<IProps, IState> {
    private ref = React.createRef<HTMLDivElement>();

    public state: IState = {
      left: 0,
      bottom: 0,
    };

    componentDidMount() {
      this.calcPosition();
    }

    render() {
      return (
        <div
          ref={this.ref}
          className="popover-component"
          style={{
            left: this.state.left + 'px',
            bottom: this.state.bottom + 'px',
          }}
        >
          {this.props.children}
        </div>
      );
    }

    /**
     * Calculate the offsets to position the popover above the target
     */
    private calcPosition() {
      let popoverWidth = 0;
      let popoverHeight = 0;
      if (this.ref.current) {
        popoverWidth = this.ref.current.offsetWidth;
        popoverHeight = this.ref.current.offsetHeight;
      }

      const boundingRect = this.props.refElement.getBoundingClientRect();
      const bottom = document.body.clientHeight - boundingRect.top;
      const left =
        boundingRect.left +
        this.props.refElement.offsetWidth / 2 -
        popoverWidth / 2;

      this.setState({ left, bottom });
    }
  },
);
