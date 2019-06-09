export enum SocketEvent {
  /**
   * Attempt to join a room using a code
   */
  JOIN_ROOM,

  /**
   * Notify that the socket has joined a room
   */
  ROOM_JOINED,

  /**
   * Notify that a new member has been added
   */
  MEMBER_ADDED,

  /**
   * Notify admins that a spectator suggested a member
   */
  MEMBER_SUGGESTED,

  /**
   * Notify that a member has been updated
   */
  MEMBER_UPDATED,

  /**
   * Notify that a member has been deleted
   */
  MEMBER_DELETED,

  /**
   * Notify that a member has been assigned to a team
   */
  TEAM_MEMBER_ASSIGNED,

  /**
   * Notify that the team configuration of the server has been changed
   */
  TEAM_CONFIGURATION_CHANGED,

  /**
   * Notify that the server has started generating the teams
   */
  TEAM_GENERATION_STARTED,

  /**
   * Notify that the server has completed generating the teams
   */
  TEAM_GENERATION_COMPLETED,
}
