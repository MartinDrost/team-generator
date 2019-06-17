import React from 'react';
import './styles.css';
import { IMember } from 'team-generator-packages/interfaces';
import vaderIcon from '../../assets/darth-vader.svg';

interface IProps {
  member: IMember | null;
  generating: boolean;
  pool: IMember[];
}

export default class TeamMemberCard extends React.Component<IProps> {
  render() {
    return (
      <div className="team-member-card-component" style={passiveStyle}></div>
    );
  }
}

const passiveStyle: React.CSSProperties = {
  background: `url(${vaderIcon})`,
  backgroundSize: '40px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
};
