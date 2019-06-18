import React from 'react';
import './styles.css';
import { IRoom, IMember } from 'team-generator-packages/interfaces';
import TeamMemberCard from '../teamMemberCard';

interface IProps {
  room: IRoom;
  generating: boolean;
}

export default class TeamTable extends React.Component<IProps> {
  render() {
    return <div className="team-table-component">{this.getTeams()}</div>;
  }

  /**
   * Builds the team overview and returns it as JSX elements
   */
  private getTeams(): JSX.Element[] {
    const elements: JSX.Element[] = [];
    for (let i = 0; i < this.props.room.configuration.teams; i++) {
      for (let j = 0; j < this.props.room.configuration.teamMembers; j++) {
        let member: IMember | null = null;
        if (this.props.room.teams[i]) {
          member = this.props.room.teams[i][j];
        }

        elements.push(
          <TeamMemberCard
            key={[i, j].join()}
            member={member}
            generating={this.props.generating}
            pool={this.props.room.members}
          />,
        );
      }
      elements.push(
        <div key={`${i}-sep`} className="team-separator">
          vs.
        </div>,
      );
    }

    // remove the last separator
    elements.pop();

    return elements;
  }
}
