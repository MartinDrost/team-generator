import React from 'react';
import { IMember } from 'team-generator-packages/interfaces';
import vaderIcon from '../../assets/darth-vader.svg';
import { mediaService } from '../../services/media.service';
import './styles.css';

interface IProps {
  member: IMember | null;
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
    if (this.props.member) {
      return {
        border: 0,

        background: `url(${
          this.props.member.imagePath
            ? mediaService.media_endpoint + this.props.member.imagePath
            : 'https://picsum.photos/1000?name=' +
              encodeURIComponent(this.props.member.name)
        }) center/cover`,
      };
    }
    return {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url(${vaderIcon})`,
      backgroundSize: '40px',
    };
  }
}
