import IMember from '../member.interface';

export interface ITeamMemberAssignedPayload {
  teamIndex: number;
  member: IMember;
}
