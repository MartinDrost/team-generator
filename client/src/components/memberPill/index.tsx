import React from 'react';
import { IMember } from 'team-generator-packages/interfaces';
import xIcon from '../../assets/x-icon.svg';
import { mediaService } from '../../services/media.service';
import { Circle } from '../circle';
import './styles.css';

interface IProps {
  member: IMember;
  onDelete?: (member: IMember) => any;
}

export default class MemberPill extends React.Component<IProps> {
  render() {
    return (
      <div className="member-pill-component">
        <Circle
          size={15}
          background={
            this.props.member.imagePath
              ? `url(${mediaService.media_endpoint +
                  this.props.member.imagePath}) center center/contain no-repeat`
              : '#4a4a4a'
          }
        />
        <div className="member-name">{this.props.member.name}</div>
        {this.props.onDelete &&
        <a>
          <img
            onClick={() => this.props.onDelete!(this.props.member)}
            src={xIcon}
            height={10}
            alt={'Exit'}
          />
        </a>}
      </div>
    );
  }
}
