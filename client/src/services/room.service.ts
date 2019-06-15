import {
  IRoom,
  IMember,
  IRoomConfiguration,
} from 'team-generator-packages/interfaces';
import { IResponse } from '../interfaces/response.interface';
import { httpService } from './http.service';

export const roomService = new (class Service {
  private controller = 'room';

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
})();
