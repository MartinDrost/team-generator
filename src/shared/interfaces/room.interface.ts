import { ITeam } from './team.interface';
import { IMember } from './member.interface';
import { IRoomConfiguration } from './roomConfiguration.interface';

export interface IRoom {
  codes: {
    admin: string;
    spectator: string;
  };
  teams: ITeam[];
  members: IMember[];
  configuration: IRoomConfiguration;
}