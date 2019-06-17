import {
  IRoom,
  IMember,
  IRoomConfiguration,
  ITeamMemberAssignedPayload,
  IJoinRoomPayload,
} from 'team-generator-packages/interfaces';
import { IResponse } from '../interfaces/response.interface';
import { httpService } from './http.service';
import { environment } from '../constants/environment.constants';
import { Subject } from 'rxjs';
import { SocketEvent } from 'team-generator-packages/enums';
import io from 'socket.io-client';

export const roomService = new (class Service {
  private controller = 'room';
  private socket: SocketIOClient.Socket = io(environment.api_url);

  public onRoomJoined = new Subject<IRoom>();
  public onMemberAdded = new Subject<IMember>();
  public onMemberSuggested = new Subject<IMember>();
  public onMemberUpdated = new Subject<IMember>();
  public onMemberDeleted = new Subject<IMember>();
  public onTeamMemberAssigned = new Subject<ITeamMemberAssignedPayload>();
  public onRoomConfigurationChanged = new Subject<IRoomConfiguration>();
  public onTeamGenerationStarted = new Subject<void>();
  public onTeamGenerationCompleted = new Subject<void>();

  constructor() {
    this.initSocketListeners();
  }

  /**
   * Join the socket channel of a room
   * @param code
   */
  joinRoomSocket(code: string): void {
    this.socket.emit(SocketEvent.JOIN_ROOM.toString(), {
      accessCode: code,
    } as IJoinRoomPayload);
  }

  /**
   * Creates a new room
   */
  createRoom(): Promise<IResponse<IRoom>> {
    return httpService.post(this.controller, null);
  }

  /**
   * Adds a member to a room
   * @param code
   * @param member
   */
  addMember(code: string, member: IMember): Promise<IResponse<IMember>> {
    return httpService.post([this.controller, code].join('/'), member);
  }

  /**
   * Update a room member
   * @param code
   * @param memberId
   * @param member
   */
  updateMember(
    code: string,
    memberId: string,
    member: IMember,
  ): Promise<IResponse<IMember>> {
    return httpService.put(
      [this.controller, code, 'member', memberId].join('/'),
      member,
    );
  }

  /**
   * Delete a member from a room
   * @param code
   * @param memberId
   */
  deleteMember(code: string, memberId: string): Promise<IResponse<IMember>> {
    return httpService.delete(
      [this.controller, code, 'member', memberId].join('/'),
    );
  }

  /**
   * Starts generating the teams for the provided room
   * @param code
   */
  startGeneration(code: string): Promise<IResponse<void>> {
    return httpService.post(
      [this.controller, code, 'generate'].join('/'),
      null,
    );
  }

  /**
   * Applies a new configuration to a room
   * @param code
   * @param configuration
   */
  configureRoom(
    code: string,
    configuration: Promise<IResponse<IRoomConfiguration>>,
  ): Promise<IResponse<IRoom>> {
    return httpService.put(
      [this.controller, code, 'configuration'].join('/'),
      configuration,
    );
  }

  /**
   * Returns the room by the given accesscode
   * @param code
   */
  getRoom(code: string): Promise<IResponse<IRoom>> {
    return httpService.get([this.controller, code].join('/'));
  }

  /**
   * Initializes the socket listeners
   */
  private initSocketListeners(): void {
    const eventListenerPair: { [event: string]: Subject<any> } = {
      [SocketEvent.ROOM_JOINED]: this.onRoomJoined,
      [SocketEvent.MEMBER_ADDED]: this.onMemberAdded,
      [SocketEvent.MEMBER_SUGGESTED]: this.onMemberSuggested,
      [SocketEvent.MEMBER_UPDATED]: this.onMemberUpdated,
      [SocketEvent.MEMBER_DELETED]: this.onMemberDeleted,
      [SocketEvent.TEAM_MEMBER_ASSIGNED]: this.onTeamMemberAssigned,
      [SocketEvent.ROOM_CONFIGURATION_CHANGED]: this.onRoomConfigurationChanged,
      [SocketEvent.TEAM_GENERATION_STARTED]: this.onTeamGenerationStarted,
      [SocketEvent.TEAM_GENERATION_COMPLETED]: this.onTeamGenerationCompleted,
    };

    /**
     * Map the listeners to socket events
     */
    Object.keys(eventListenerPair).forEach(event => {
      this.socket.on(event, (data: any) => eventListenerPair[event].next(data));
    });
  }
})();
