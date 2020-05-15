// import { EVENT_TYPES } from '../lib.js';

// type NotificationEventTypes = 'USER_JOIN' |
export enum NotificationEventType {
  UserJoined,
  UserListUpdated,
  UserCheckedIn,
  UserJoinAttempt,
  UserDropped,
  ServerRequestedCheckin,
}

export enum EventType {
  ClientConnectionSuccessful,
  UserJoinAttempt,
  UserJoined,
  UserListUpdated,
  UserLeft,
  UserChatAttempt,
  UserSentMessage,
}
export interface User {
  id: string;
  username: string;
  isMissing?: boolean;
  lastCheckin?: number;
}

export interface NotificationEvent {
  type: NotificationEventType;
  userId?: string;
  userName?: string;
  users?: User[];
  label?: string;
}

export interface ClientConnectionSuccessfulEvent {
  id: string;
}

export interface UserJoinAttemptEvent {
  id: string;
  username: string;
}

export interface UserJoinedEvent {
  username: string;
}
export interface UserListUpdatedEvent {
  users: User[];
}

export interface UserLeftEvent {
  username: string;
}

export interface UserChatAttemptEvent {
  message: string;
  username: string;
}

export interface UserMessageEvent {
  message: string;
  username: string;
}
