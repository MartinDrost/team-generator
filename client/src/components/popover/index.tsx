import React from 'react';
import { Singleton } from 'react-singletons';
import './styles.css';

interface IProps {
  refElement: HTMLElement;
  children: React.ReactNode;
  title?: React.ReactNode | string;
}

interface IState {
  left: number;
  bottom: number;
}

export const Popover = new Singleton<IProps>(
  class PopoverComponent extends React.Component<IProps, IState> {
    private ref = React.createRef<HTMLDivElement>();
    private onClick: any;

    public state: IState = {
      left: 0,
      bottom: 0,
    };

    constructor(props: IProps) {
      super(props);
      this.onClick = this.hideOnClick.bind(this);
    }

    componentDidMount() {
      this.calcPosition();
      document.addEventListener('click', this.onClick);
    }
    componentWillUnmount() {
      document.removeEventListener('click', this.onClick);
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
          {this.props.title && <div className="title">{this.props.title}</div>}
          {this.props.children}
        </div>
      );
    }

    /**
     * Calculate the offsets to position the popover above the target
     */
    private calcPosition() {
      let popoverWidth = 0;
      if (this.ref.current) {
        popoverWidth = this.ref.current.offsetWidth;
      }
      const boundingRect = this.props.refElement.getBoundingClientRect();
      const bottom =
        document.body.clientHeight - (boundingRect.top + window.scrollY);
      const left = Math.max(
        0,
        boundingRect.left +
          this.props.refElement.offsetWidth / 2 -
          popoverWidth / 2,
      );

      this.setState({ left, bottom });
    }

    private hideOnClick(e: MouseEvent) {
      const clickInBounds = this.ref.current!.contains(e.target as any);
      if (!clickInBounds) {
        Popover.unmount();
      }
    }
  },
);
