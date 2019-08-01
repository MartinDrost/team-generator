export enum SocketEvent {
  /**
   * Attempt to join a room using a code
   * @param IJoinRoomPayload
   * @returns void
   */
  JOIN_ROOM,

  /**
   * Notify that the socket has joined a room
   * @returns IRoom
   */
  ROOM_JOINED,

  /**
   * Attempt to leave a room using a code
   * @param IJoinRoomPayload
   * @returns void
   */
  LEAVE_ROOM,

  /**
   * Notify that the socket has left a room
   * @returns IRoom
   */
  ROOM_LEFT,

  /**
   * Notify that a new member has been added
   * @returns IMember
   */
  MEMBER_ADDED,

  /**
   * Notify admins that a spectator suggested a member
   * @returns IMember
   */
  MEMBER_SUGGESTED,

  /**
   * Notify that a member has been updated
   * @returns IMember
   */
  MEMBER_UPDATED,

  /**
   * Notify that a member has been deleted
   * @returns IMember
   */
  MEMBER_DELETED,

  /**
   * Notify that a member has been assigned to a team
   * @returns ITeamMemberAssignedPayload
   */
  TEAM_MEMBER_ASSIGNED,

  /**
   * Notify that the team configuration of the room has been changed
   * @returns IROOM
   */
  ROOM_CONFIGURATION_CHANGED,

  /**
   * Notify that the room has started generating the teams
   * @returns void
   */
  TEAM_GENERATION_STARTED,

  /**
   * Notify that the room has completed generating the teams
   * @returns void
   */
  TEAM_GENERATION_COMPLETED,
}
