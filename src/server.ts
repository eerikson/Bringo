/*
 *
 *  TODO: Get all this Typscript bullshit working with webpack and express.
 *
 *
 */

import express from 'express';
import {
  EventType,
  User,
  ClientConnectionSuccessfulEvent,
  UserJoinAttemptEvent,
  UserJoinedEvent,
  UserListUpdatedEvent,
  UserLeftEvent,
  UserChatAttemptEvent,
  UserMessageEvent,
} from './types/base';
const PORT = process.env.PORT || 3000;
const INDEX = 'public/index.html';

const server = express()
  .use(express.static(__dirname + '/public')) // Serve built files from webpack (doesnt friggin work)
  .get('/', (_req, res) => res.sendFile(INDEX, { root: __dirname })) // Serve root entry file
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//@ts-ignore
import io from 'socket.io';
interface BingoServer {
  registeredUsers: User[];
  unregisteredUsers: User[];
  socket: any;
}
class BingoServer {
  constructor() {
    this.socket = io(server, { serveClient: false });
    this.registeredUsers = [];
    this.unregisteredUsers = [];
    this.bindSocketIoEvents();
  }

  bindSocketIoEvents() {
    this.socket.on('connection', (socket: any) => {
      let socketUser: User;
      socket.emit(EventType.ClientConnectionSuccessful, { id: socket.id } as ClientConnectionSuccessfulEvent);
      socket.on(EventType.UserJoinAttempt, async (data: UserJoinAttemptEvent) => {
        const { username, id } = data;
        if (!username || !id) {
          return;
        }
        let user: User;
        console.info('data:');
        console.dir(data);
        console.info('unregistered users:');
        console.dir(this.unregisteredUsers);
        // First, check to see if someone is coming back.
        const index = this.unregisteredUsers.findIndex((user: User) => {
          console.info('user:');
          console.dir(user);
          return user.username === username;
        });
        if (index !== -1) {
          // In the future, we will want to also re-attach state. For now, just the ID
          user = { username, id: this.unregisteredUsers[index].id };
          this.unregisteredUsers.splice(index, 1);
        } else {
          user = { username, id };
        }

        this.registeredUsers.push(user);
        await this.socket.emit(EventType.UserJoined, { username } as UserJoinedEvent);
        await this.socket.emit(EventType.UserListUpdated, { users: this.registeredUsers } as UserListUpdatedEvent);
        socketUser = { username, id };
      });

      socket.on(EventType.UserChatAttempt, async (event: UserChatAttemptEvent) => {
        console.info('UserChatAttempt');
        console.dir(event);
        await this.socket.emit(EventType.UserSentMessage, {
          message: event.message,
          username: event.username,
        } as UserMessageEvent);
      });

      socket.on('disconnect', async () => {
        if (!socketUser) {
          return;
        }
        this.registeredUsers = this.registeredUsers.filter((user: User) => {
          return user.id !== socketUser.id;
        });
        this.unregisteredUsers.push(socketUser);
        await this.socket.emit(EventType.UserLeft, { username: socketUser?.username } as UserLeftEvent);
        await this.socket.emit(EventType.UserListUpdated, { users: this.registeredUsers } as UserListUpdatedEvent);
      });
    });
  }
}

new BingoServer();
