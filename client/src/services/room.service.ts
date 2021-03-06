import { Subject } from 'rxjs';
import io from 'socket.io-client';
import { SocketEvent } from 'team-generator-packages/enums';
import {
  IJoinRoomPayload,
  IMember,
  IRoom,
  IRoomConfiguration,
  ITeamMemberAssignedPayload,
} from 'team-generator-packages/interfaces';
import { environment } from '../constants/environment.constants';
import { IHttpOptions } from '../interfaces/httpOptions.interface';
import { IResponse } from '../interfaces/response.interface';
import { httpService } from './http.service';

export const roomService = new (class Service {
  private controller = 'room';
  private socket: SocketIOClient.Socket = io(
    environment.api_url.replace('/api', ''),
  );

  public onRoomJoined = new Subject<IRoom>();
  public onRoomLeft = new Subject<IRoom>();
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
   * Leave the socket channel of a room
   * @param code
   */
  leaveRoomSocket(code: string): void {
    this.socket.emit(SocketEvent.LEAVE_ROOM.toString(), {
      accessCode: code,
    } as IJoinRoomPayload);
  }

  /**
   * Creates a new room
   */
  createRoom(options?: IHttpOptions): Promise<IResponse<IRoom>> {
    return httpService.post(this.controller, null, options);
  }

  /**
   * Adds a member to a room
   * @param code
   * @param member
   */
  addMember(
    code: string,
    member: IMember,
    options?: IHttpOptions,
  ): Promise<IResponse<IMember>> {
    return httpService.post(
      [this.controller, code, 'member'].join('/'),
      member,
      options,
    );
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
    options?: IHttpOptions,
  ): Promise<IResponse<IMember>> {
    return httpService.put(
      [this.controller, code, 'member', memberId].join('/'),
      member,
      options,
    );
  }

  /**
   * Delete a member from a room
   * @param code
   * @param memberId
   */
  deleteMember(
    code: string,
    memberId: string,
    options?: IHttpOptions,
  ): Promise<IResponse<IMember>> {
    return httpService.delete(
      [this.controller, code, 'member', memberId].join('/'),
      options,
    );
  }

  /**
   * Starts generating the teams for the provided room
   * @param code
   */
  startGeneration(
    code: string,
    options?: IHttpOptions,
  ): Promise<IResponse<void>> {
    return httpService.post(
      [this.controller, code, 'generate'].join('/'),
      null,
      options,
    );
  }

  /**
   * Applies a new configuration to a room
   * @param code
   * @param configuration
   */
  configureRoom(
    code: string,
    configuration: IRoomConfiguration,
    options?: IHttpOptions,
  ): Promise<IResponse<IRoom>> {
    return httpService.put(
      [this.controller, code, 'configuration'].join('/'),
      configuration,
      options,
    );
  }

  /**
   * Returns the room by the given accesscode
   * @param code
   */
  getRoom(code: string, options?: IHttpOptions): Promise<IResponse<IRoom>> {
    return httpService.get([this.controller, code].join('/'), options);
  }

  /**
   * Initializes the socket listeners
   */
  private initSocketListeners(): void {
    const eventListenerPair: { [event: string]: Subject<any> } = {
      [SocketEvent.ROOM_JOINED]: this.onRoomJoined,
      [SocketEvent.ROOM_LEFT]: this.onRoomLeft,
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
