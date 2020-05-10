// import { EVENT_TYPES } from '../lib.js';

// type NotificationEventTypes = 'USER_JOIN' |
export enum NotificationEventType {
  UserJoined,
  UserListUpdated,
  UserCheckedIn,
  UserJoinAttempt,
}

export interface User {
  id: string;
  username: string;
}

export interface NotificationEvent {
  type: NotificationEventType;
  userId?: string;
  userName?: string;
  users?: User[];
  label?: string;
}
