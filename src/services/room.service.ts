import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IRoomConfiguration } from 'src/shared/interfaces';
import charSet from '../constants/charSet.constants';
import { RoomGateway } from '../gateways/room.gateway';
import { SocketEvent } from '../shared/enums/socketEvent.enum';
import { IMember } from '../shared/interfaces/member.interface';
import { IRoom } from '../shared/interfaces/room.interface';
import { ITeamMemberAssignedPayload } from '../shared/interfaces/teamMemberAssignedPayload.interface';
import { SecurityUtils } from '../utils/security.utils';
import { ImageService } from './image.service';

@Injectable()
export class RoomService {
  private rooms: IRoom[] = [];
  private generationIntervals: { [code: string]: NodeJS.Timeout } = {};

  constructor(
    private readonly securityUtils: SecurityUtils,
    @Inject(forwardRef(() => RoomGateway))
    private readonly roomGateway: RoomGateway,
    private readonly imageService: ImageService,
  ) {}

  /**
   * Creates a new room
   */
  public createRoom(): IRoom {
    // retrieve a list of all existing room codes
    const existingCodes = [].concat(
      ...this.rooms.map(room => Object.values(room.codes)),
    );

    // set up a basic room
    let room: IRoom = {
      codes: {
        admin: this.securityUtils.generateHash(
          4,
          existingCodes,
          charSet.upperCaseSafe,
        ),
        spectator: this.securityUtils.generateHash(
          4,
          existingCodes,
          charSet.upperCaseSafe,
        ),
      },
      teams: [],
      members: [],
      configuration: {
        suspenseMs: 1000,
        teamMembers: 5,
        teams: 2,
      },
    };

    this.rooms.push(room);

    // apply the given settings
    room = this.applyConfiguration(room.codes.admin, room.configuration);

    return room;
  }

  /**
   * Apply the room configuration
   * @param room
   */
  public applyConfiguration(
    code: string,
    configuration: IRoomConfiguration,
  ): IRoom {
    const room = this.getRoom(code);

    configuration.teams = +configuration.teams;
    configuration.teamMembers = room.members.length
      ? Math.ceil(room.members.length / configuration.teams)
      : 5;

    room.configuration = { ...room.configuration, ...configuration };

    this.resetTeams(code);

    // notify the room members
    this.notifyRoom(
      room.codes.spectator,
      SocketEvent.ROOM_CONFIGURATION_CHANGED,
      room,
    );

    return room;
  }

  /**
   * reset the teams of a room
   * @param code
   */
  public resetTeams(code: string) {
    const room = this.getRoom(code);
    room.teams = Array(room.configuration.teams)
      .fill(null)
      .map(x => []);
  }

  /**
   * Returns the room by the given accesscode
   * @param code
   */
  public getRoom(code: string): IRoom {
    const room = this.rooms.find(room =>
      Object.values(room.codes).includes(code),
    );

    if (!room) {
      throw new HttpException(
        'No room matching that code',
        HttpStatus.NOT_FOUND,
      );
    }

    return room;
  }

  /**
   * Adds a member to a room
   * @param code
   * @param member
   */
  public async addMember(
    code: string,
    member: IMember,
    image: string,
  ): Promise<IMember> {
    const room = this.getRoom(code);
    if (!room) {
      return null;
    }

    // if the requested code is a spectator code, merely suggest the member to admins
    if (room.codes.spectator === code) {
      this.roomGateway.server
        .to(room.codes.admin)
        .emit(SocketEvent.MEMBER_SUGGESTED.toString(), member);
      return member;
    }

    // merge default values
    member = {
      skill: 50,
      ...member,
    };

    // upload the image if provided
    if (image) {
      member.imagePath = await this.imageService.addImage(image);
    }

    // generate a unique id
    member.id = this.securityUtils.generateHash(
      10,
      room.members.map(member => member.id),
    );

    // add the member and notify the room
    room.members.push(member);
    this.notifyRoom(code, SocketEvent.MEMBER_ADDED, member);

    return member;
  }

  /**
   * Update a room member
   * @param code
   * @param id
   * @param member
   */
  public updateMember(code: string, id: string, member: IMember): IMember {
    const room = this.getRoom(code);
    let updated: IMember = null;
    if (room) {
      room.members = room.members.map(existing => {
        if (existing.id === id) {
          updated = {
            ...existing,
            ...member,
          };
          return updated;
        }
        return existing;
      });
    }

    if (updated) {
      this.notifyRoom(code, SocketEvent.MEMBER_UPDATED, updated);
    }

    return updated;
  }

  /**
   * Delete a member from a room
   * @param code
   * @param id
   */
  public deleteMember(code: string, id: string): IMember {
    const room = this.getRoom(code);
    let deleted: IMember = null;
    room.members = room.members.filter(member => {
      if (member.id === id) {
        deleted = member;
      }
      return member.id !== id;
    });

    if (deleted) {
      this.notifyRoom(code, SocketEvent.MEMBER_DELETED, deleted);
    }

    return deleted;
  }

  /**
   * Notify the room clients through their sockets
   * @param code
   * @param event
   * @param payload
   */
  private notifyRoom(code: string, event: number, payload: any) {
    const room = this.getRoom(code);
    Object.values(room.codes).forEach(code =>
      this.roomGateway.server.to(code).emit(event.toString(), payload),
    );
  }

  /**
   * Starts generating the teams for the provided room
   * @param code
   */
  public generateTeams(code: string): void {
    const room = this.getRoom(code);
    this.resetTeams(code);

    // stop previously started generations if applicable
    if (this.generationIntervals[room.codes.admin]) {
      this.stopTeamGeneration(room.codes.admin);
    }

    this.notifyRoom(code, SocketEvent.TEAM_GENERATION_STARTED, null);

    // assign new team members intervalled by the room suspense
    this.generationIntervals[room.codes.admin] = setInterval(
      () => this.assignTeamMember(room.codes.admin),
      room.configuration.suspenseMs,
    );
  }

  /**
   * Stop generating teams for a room
   * @param code
   */
  public stopTeamGeneration(code: string) {
    clearInterval(this.generationIntervals[code]);
    delete this.generationIntervals[code];
    this.notifyRoom(code, SocketEvent.TEAM_GENERATION_COMPLETED, null);
  }

  /**
   * Assign a new team member to a room
   * @param code
   */
  public assignTeamMember(code: string) {
    const room = this.getRoom(code);

    // get the already assigned member ids
    const assignedMembers: string[] = [].concat(
      ...room.teams.map(team => [].concat(...team.map(member => member.id))),
    );

    const availableMembers = room.members.filter(
      member => !assignedMembers.includes(member.id),
    );

    // stop generating if the limit has been reached
    if (
      assignedMembers.length >= room.members.length ||
      assignedMembers.length >=
        room.configuration.teamMembers * room.configuration.teams
    ) {
      return this.stopTeamGeneration(room.codes.admin);
    }

    // get the first team with the least members
    let teamIndex = 0;
    room.teams.forEach((team, i) => {
      if (room.teams[teamIndex].length > team.length) {
        teamIndex = i;
      }
    });

    // find a possible member and assign it
    const member =
      availableMembers[Math.floor(Math.random() * availableMembers.length)];
    room.teams[teamIndex].push(member);

    this.notifyRoom(code, SocketEvent.TEAM_MEMBER_ASSIGNED, {
      teamIndex,
      member,
    } as ITeamMemberAssignedPayload);
  }
}
