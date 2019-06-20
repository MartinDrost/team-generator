import React from 'react';
import './styles.css';
import Input from '../input';
import Button from '../button';
import { IMember } from 'team-generator-packages/interfaces';

interface IProps {}

export default class MemberForm extends React.Component<IProps> {
  private member: IMember = {
    name: '',
    skill: 0,
  };

  render() {
    return (
      <form className="member-form-component">
        <label>Image</label>
        <input type="file" />

        <label>Name</label>
        <Input defaultValue={this.member.name} placeholder="Name" />

        <label>Skill</label>
        <input type="range" defaultValue={this.member.skill.toString()} />

        <Button>Save</Button>
      </form>
    );
  }
}
