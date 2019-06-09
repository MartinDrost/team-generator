import IMember from 'interfaces/member.interface';

export interface ITeamMemberAssignedPayload {
  teamIndex: number;
  member: IMember;
}
