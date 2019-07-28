import React from 'react';
import { IRoomConfiguration } from 'team-generator-packages/interfaces';
import { formUtils } from '../../utils/form.utils';
import Button from '../button';
import Input from '../input';
import './styles.css';

interface IProps {
  configuration?: IRoomConfiguration;

  onSubmit: (configuration: IRoomConfiguration) => any;
}

interface IState {
  configuration: IRoomConfiguration;
}

export default class RoomConfigurationForm extends React.Component<
  IProps,
  IState
> {
  private formRef = React.createRef<HTMLFormElement>();
  public state: IState = {
    configuration: {
      suspenseMs: 1000,
      teamMembers: 5,
      teams: 2,
    },
  };

  componentDidMount() {
    const configuration = {
      ...this.state.configuration,
      ...this.props.configuration,
    };

    this.setState({ configuration });
  }

  render() {
    return (
      <form
        key={Object.values(this.state.configuration).join('-')}
        className="configuration-form-component"
        ref={this.formRef}
        onSubmit={e => {
          e.preventDefault();
          this.submit();
        }}
      >
        <div>
          <label>Nr. of teams</label>
          <Input
            defaultValue={this.state.configuration.teams.toString()}
            type="number"
            name="teams"
          />
        </div>
        <div>
          <label>Members per team</label>
          <Input
            defaultValue={this.state.configuration.teamMembers.toString()}
            type="number"
            name="teamMembers"
          />
        </div>

        <Button type="submit">Generate</Button>
      </form>
    );
  }

  /**
   * Store the form data in the configuration attribute
   */
  private storeFormData(callback?: () => any) {
    let configuration = this.state.configuration;
    if (this.formRef.current) {
      configuration = formUtils.getFormDataAsJSON<IRoomConfiguration>(
        this.formRef.current,
      );
    }
    this.setState({ configuration }, callback || (() => {}));
  }

  /**
   * submit the form
   */
  private submit() {
    this.storeFormData(() => {
      this.props.onSubmit(this.state.configuration);
    });
  }
}
