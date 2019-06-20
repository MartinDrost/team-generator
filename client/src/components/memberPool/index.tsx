import React from 'react';
import './styles.css';
import { IMember } from 'team-generator-packages/interfaces';
import MemberPill from '../memberPill';
import Button from '../button';
import { Popover } from '../popover';
import MemberForm from '../memberForm';

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
        <Button
          shape="pill"
          onClick={event =>
            Popover.mount({
              children: (
                <div style={{ maxWidth: '230px' }}>
                  <MemberForm />
                </div>
              ),
              title: 'Add member',
              refElement: event.currentTarget,
            })
          }
        >
          Member +
        </Button>
      </div>
    );
  }
}
