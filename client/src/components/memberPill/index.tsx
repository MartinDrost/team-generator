import React from 'react';
import './styles.css';
import { IMember } from 'team-generator-packages/interfaces';

interface IProps {
  member: IMember;
  onUpdate: (member: IMember) => any;
}

export default class MemberPill extends React.Component<IProps> {
  render() {
    return (
      <div className="member-pill-component">{this.props.member.name}</div>
    );
  }
}
