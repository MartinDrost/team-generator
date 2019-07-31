import React from 'react';
import { IMember } from 'team-generator-packages/interfaces';
import TeamMemberCard from '../teamMemberCard';
import './styles.css';

interface IProps {
  pool: IMember[];
}
interface IState {
  index: number;
}

export default class GeneratingCard extends React.Component<IProps> {
  private interval: number = 0;
  public state: IState = {
    index: 0,
  };

  componentDidMount() {
    this.interval = window.setInterval(() => this.nextMember(), 100);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <TeamMemberCard
        member={{ ...this.props.pool[this.state.index], name: '' }}
      />
    );
  }

  private nextMember() {
    const index =
      this.state.index < this.props.pool.length - 1 ? this.state.index + 1 : 0;

    this.setState({ index });
  }
}
