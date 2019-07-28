import React from 'react';
import { IMember } from 'team-generator-packages/interfaces';
import vaderIcon from '../../assets/darth-vader.svg';
import { mediaService } from '../../services/media.service';
import './styles.css';

interface IProps {
  member: IMember | null;
  generating: boolean;
  pool: IMember[];
}

export default class TeamMemberCard extends React.Component<IProps> {
  render() {
    return (
      <div className="team-member-card-component" style={this.getStyle()}>
        {this.props.member && (
          <div className="member-name">{this.props.member.name}</div>
        )}
      </div>
    );
  }

  private getStyle() {
    const base = {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };
    if (this.props.member) {
      return {
        ...base,

        backgroundImage: `url(${
          this.props.member.imagePath
            ? mediaService.media_endpoint + this.props.member.imagePath
            : 'https://picsum.photos/1000?name=' + this.props.member.name
        })`,
        backgroundSize: 'cover',
        border: 0,
      };
    }
    return {
      ...base,
      backgroundImage: `url(${vaderIcon})`,
      backgroundSize: '40px',
    };
  }
}
