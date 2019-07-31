import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Spring } from 'react-spring/renderprops';
import {
  IMember,
  IRoom,
  IRoomConfiguration,
} from 'team-generator-packages/interfaces';
import checkIcon from '../../assets/check-icon.svg';
import MemberPool from '../../components/memberPool';
import RoomConfigurationForm from '../../components/roomConfigurationForm';
import RoomInfoBar from '../../components/roomInfoBar';
import Separator from '../../components/separator';
import TeamTable from '../../components/teamTable';
import { Severity } from '../../enums/severity.enum';
import { notificationService } from '../../services/notification.service';
import { roomService } from '../../services/room.service';
import { json } from '../../utils/statics.utils';
import './styles.css';

interface IParams {
  accessCode: string;
}

interface IState {
  room: IRoom | null;
  generating: boolean;
}

export default class RoomView extends React.Component<
  RouteComponentProps<IParams>,
  IState
> {
  private iteration = 0;
  private accessCode: string = '';
  public state: IState = {
    room: null,
    generating: false,
  };

  componentDidMount() {
    this.accessCode = this.props.match.params.accessCode;
    this.accessRoom();
  }

  componentWillUnmount() {
    this.unbindListeners();
  }

  render() {
    if (!this.state.room) {
      return <div className="room-view"></div>;
    }

    return (
      <Spring
        from={{ opacity: 0, transform: 'translateY(-20px)' }}
        to={{ opacity: 1, transform: 'translateY(0px)' }}
      >
        {props =>
          this.state.room && (
            <div key={this.iteration} className="room-view" style={props}>
              <RoomInfoBar room={this.state.room} />

              <div className="team-section">
                <TeamTable
                  room={this.state.room}
                  generating={this.state.generating}
                />
                <MemberPool
                  members={this.state.room.members}
                  onCreate={member => this.addMember(member)}
                  onDelete={
                    this.state.room.codes.admin
                      ? member => this.deleteMember(member)
                      : undefined
                  }
                />

                {this.state.room.codes.admin && (
                  <>
                    <Separator />

                    <RoomConfigurationForm
                      configuration={this.state.room.configuration}
                      onSubmit={configuration =>
                        this.generateTeams(configuration)
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )
        }
      </Spring>
    );
  }

  /**
   * Attempts to access a room
   */
  private async accessRoom() {
    try {
      const room = await json<IRoom>(
        roomService.getRoom(this.accessCode, { showError: true }),
      );
      roomService.joinRoomSocket(this.accessCode);
      this.bindListeners();

      this.setState({ room });
    } catch (err) {
      this.props.history.push('');
    }
  }

  /**
   * Binds the socket listeners for this view
   */
  private bindListeners() {
    roomService.onMemberAdded.subscribe(() => this.refreshRoom());
    roomService.onMemberDeleted.subscribe(() => this.refreshRoom());
    roomService.onRoomConfigurationChanged.subscribe(() => this.refreshRoom());
    roomService.onTeamMemberAssigned.subscribe(() => this.refreshRoom());
    roomService.onMemberSuggested.subscribe(member =>
      this.suggestMember(member),
    );
  }

  private async refreshRoom() {
    const room = await json<IRoom>(roomService.getRoom(this.accessCode));
    this.iteration++;
    this.setState({ room });
  }

  /**
   * Unbinds the socket listeners for this view
   */
  private unbindListeners() {}

  /**
   * Attempt to add a member
   * @param member
   */
  private async addMember(member: FormData) {
    await json<IMember>(
      roomService.addMember(
        this.state.room!.codes.admin || this.state.room!.codes.spectator,
        member as any,
        { showError: true },
      ),
    );
  }

  /**
   * Delete a member
   * @param member
   */
  private async deleteMember(member: IMember) {
    await roomService.deleteMember(this.state.room!.codes.admin, member.id!, {
      showError: true,
    });
    const room = this.state.room!;
    room.members = room.members.filter(existing => existing.id !== member.id);

    this.setState({ room });
  }

  /**
   * Start generating teams
   * @param configuration
   */
  private async generateTeams(configuration?: IRoomConfiguration) {
    const code = this.state.room!.codes.admin;
    if (configuration) {
      await roomService.configureRoom(code, configuration, { showError: true });
    }
    await roomService.startGeneration(code, {
      showError: true,
    });
    window.scrollTo(0, 0);
  }

  private suggestMember(member: IMember) {
    notificationService.add({
      message: 'Suggested: ' + member.name,
      imagePath: member.imagePath,
      severity: Severity.INFO,
      duration: 10000,
      action: (
        <a>
          <img
            style={{ display: 'block' }}
            onClick={() => {
              this.addMember(member as any);
            }}
            src={checkIcon}
            height={20}
            alt={'Accept'}
          />
        </a>
      ),
    });
  }
}
