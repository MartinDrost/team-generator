import React from 'react';
import './styles.css';
import { IMember } from 'team-generator-packages/interfaces';
import MemberPill from '../memberPill';
import Button from '../button';

interface IProps {
  members: IMember[];
  onCreate: (member: IMember) => any;
  onUpdate: (member: IMember) => any;
}

export default class MemberPool extends React.Component<IProps> {
  render() {
    return (
      <div className="member-pool-component">
        {this.props.members.map(member => (
          <MemberPill
            key={member.id}
            member={member}
            onUpdate={member => this.props.onUpdate(member)}
          />
        ))}
        <Button shape="pill">Member +</Button>
      </div>
    );
  }
}
