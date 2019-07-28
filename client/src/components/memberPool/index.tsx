import React from 'react';
import { IMember } from 'team-generator-packages/interfaces';
import Button from '../button';
import MemberForm from '../memberForm';
import MemberPill from '../memberPill';
import { Popover } from '../popover';
import './styles.css';

interface IProps {
  members: IMember[];
  onCreate?: (member: FormData) => any;
  onDelete?: (member: IMember) => any;
}

export default class MemberPool extends React.Component<IProps> {
  render() {
    return (
      <div className="member-pool-component">
        {this.props.members.map(member => (
          <MemberPill
            key={member.id}
            member={member}
            onDelete={this.props.onCreate ? (member => this.props.onDelete!(member)) : undefined}
          />
        ))}
        {this.props.onCreate && <Button
          shape="pill"
          onClick={event =>
            Popover.mount({
              children: (
                <div style={{ maxWidth: '230px' }}>
                  <MemberForm
                    onSubmit={async member => {
                      await this.props.onCreate!(member);
                      Popover.unmount();
                    }}
                  />
                </div>
              ),
              refElement: event.currentTarget,
            })
          }
        >
          Member +
        </Button>}
      </div>
    );
  }
}
