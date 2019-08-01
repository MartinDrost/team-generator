import React from 'react';
import { IMember } from 'team-generator-packages/interfaces';
import { formUtils } from '../../utils/form.utils';
import Button from '../button';
import Input from '../input';
import './styles.css';

interface IProps {
  member?: IMember;

  onSubmit: (formData: FormData) => any;
}

interface IState {
  member: IMember;
}

export default class MemberForm extends React.Component<IProps, IState> {
  private formRef = React.createRef<HTMLFormElement>();
  private file: File | null = null;
  public state: IState = {
    member: {
      name: '',
      skill: 0,
    },
  };

  componentDidMount() {
    const member = {
      ...this.state.member,
      ...this.props.member,
    };

    this.setState({ member });
  }

  render() {
    return (
      <form
        className="member-form-component"
        ref={this.formRef}
        onSubmit={e => {
          e.preventDefault();
          this.submit();
        }}
      >
        <label>Image</label>
        <Input
          type="file"
          accept="image/x-png,image/gif,image/jpeg"
          onChange={async e => {
            this.file = await formUtils.processImage(e);
            if (this.file) {
              const member = this.state.member;
              member.name = member.name || this.file.name.split('.')[0];
              this.setState({ member });
            }
          }}
          style={{ background: 'transparent' }}
        />

        <label>Name</label>
        <Input
          defaultValue={this.state.member.name}
          name="name"
          placeholder="Name"
          required
        />

        {/* <label>Skill</label>
        <input type="range" defaultValue={this.member.skill.toString()} /> */}

        <Button type="submit">Save</Button>
      </form>
    );
  }

  /**
   * Store the form data in the member attribute
   */
  private storeFormData(callback?: () => any) {
    let member = this.state.member;
    if (this.formRef.current) {
      member = formUtils.getFormDataAsJSON<IMember>(this.formRef.current);
    }
    this.setState({ member }, callback || (() => {}));
  }

  /**
   * submit the form
   */
  private submit() {
    this.storeFormData(() => {
      const formData = formUtils.jsonToFormData(this.state.member);
      if (this.file) {
        formData.append('file', this.file);
      }

      this.props.onSubmit(formData);
    });
  }
}
