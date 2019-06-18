import { IMember } from './member.interface';
import { IRoomConfiguration } from './roomConfiguration.interface';

export interface IRoom {
  codes: {
    admin: string;
    spectator: string;
  };
  teams: IMember[][];
  members: IMember[];
  configuration: IRoomConfiguration;
}
