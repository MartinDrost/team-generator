import React from 'react';
import { IMember, IRoom } from 'team-generator-packages/interfaces';
import GeneratingCard from '../generatingCard';
import TeamMemberCard from '../teamMemberCard';
import './styles.css';

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
    let genCardAssigned = false;
    const nextTeam =
      this.props.room.teams.length -
      this.props.room.teams.filter(
        (x, i) =>
          this.props.room.teams[i].length <=
          (this.props.room.teams[i + 1]
            ? this.props.room.teams[i + 1].length
            : Infinity),
      ).length;

    for (let i = 0; i < this.props.room.configuration.teams; i++) {
      for (let j = 0; j < this.props.room.configuration.teamMembers; j++) {
        let member: IMember | null = null;
        if (this.props.room.teams[i]) {
          member = this.props.room.teams[i][j];
        }

        // assign a generating card if applicable
        if (
          this.props.generating &&
          !genCardAssigned &&
          i === nextTeam &&
          !member
        ) {
          elements.push(
            <GeneratingCard
              pool={this.props.room.members}
              key={[i, j].join()}
            />,
          );
          genCardAssigned = true;
          continue;
        }

        elements.push(<TeamMemberCard key={[i, j].join()} member={member} />);
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
