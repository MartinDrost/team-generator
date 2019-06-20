import React from 'react';
import './styles.css';
import Input from '../input';

interface IProps {
  disabled: boolean;
  length: number;
  onComplete: (sequence: string[]) => any;
}

export default class InputSequence extends React.Component<IProps> {
  private value: string[] = [];
  private containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    this.value = Array(this.props.length).fill('');
  }

  render() {
    return (
      <div className="input-sequence-component" ref={this.containerRef}>
        {this.getInputs()}
      </div>
    );
  }

  /**
   * Build and return the inputs
   */
  private getInputs(): JSX.Element[] {
    return Array(this.props.length)
      .fill(null)
      .map((x, i) => (
        <Input
          shape="large"
          disabled={this.props.disabled}
          key={i}
          onKeyUpCapture={e =>
            this.setValue(i, e.currentTarget.value, e.keyCode)
          }
          onFocus={e => e.target.select()}
          maxLength={1}
        />
      ));
  }

  /**
   * Sets a new value on the target value index
   * @param index
   * @param value
   */
  private setValue(index: number, value: string, keyCode: number): void {
    // make sure the  value consists of max 1 character
    value = value[0] || '';

    const direction =
      this.value[index] && !value ? 0 : !this.value[index] && !value ? -1 : 1;

    this.value[index] = value;

    // call the onComplete event if all values are set
    if (this.value.every(value => !!value)) {
      this.props.onComplete(this.value);
    }

    // move to the next/previous input
    if (this.containerRef.current) {
      if ([9, 16, 17, 18, 20].includes(keyCode)) {
        return; // return if a function key has been pressed (shift, ctrl etc.)
      }

      const nodes = this.containerRef.current.getElementsByTagName('input');
      const targetNode = nodes[index + direction];
      if (targetNode) {
        targetNode.select();
      }
      nodes[index].value = value;
    }
  }
}
