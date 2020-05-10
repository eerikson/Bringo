/*
 *
 *  TODO: Get all this Typscript bullshit working with webpack and express.
 *
 *
 */

import express from 'express';
import { Server } from 'ws';
// import path from 'path';
import { NotificationEvent, NotificationEventType, User } from './types/base';
// import { connect } from 'http2';

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
// const __dirname = path.dirname(new URL(import.meta.url).pathname); // Workaround for --enable-experimental-modules

const server = express()
  .use(express.static(__dirname + '/public')) // Serve built files from webpack (doesnt friggin work)
  .get('/', (_req, res) => res.sendFile(INDEX, { root: __dirname })) // Serve root entry file
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

interface BingoServer {
  wss: Server;
  registeredUsers: User[];
  disconnectedRegisteredUsers: User[];
  userCheckins: {
    [key: string]: UserCheckin;
  };
}

interface UserCheckin extends User {
  lastCheckin: number;
}

class BingoServer {
  constructor() {
    this.wss = new Server({ server });
    this.registeredUsers = [];
    this.disconnectedRegisteredUsers = [];
    this.userCheckins = {};
    // Check to see if users are gone long enough to report MIA
    setInterval(() => this.pollForActiveUsers(), 2000);
    this.bindSocketEvents();
  }

  bindSocketEvents() {
    this.wss.on('connection', (ws: Server) => {
      console.log('Client connected');

      ws.on('close', function close(data: CloseEvent) {
        console.info(data);
      });

      ws.on('message', (event: string) => {
        const data: NotificationEvent = JSON.parse(event);

        if (data.type === NotificationEventType.UserJoinAttempt) {
          if (data.userName && data.userId) {
            console.info(data.userName, 'has entered the chat');
            const user: User = { username: data.userName, id: data.userId };
            this.registeredUsers.push(user);

            this.pushEventToAllClients({
              type: NotificationEventType.UserJoined,
              label: `${user.username} has joined!`,
            });

            this.pushEventToAllClients({
              type: NotificationEventType.UserListUpdated,
              users: this.registeredUsers,
            });

            console.info('New user joined:', user.username);
          }
        }

        if (data.type === NotificationEventType.UserCheckedIn) {
          if (data.userId && data.userName) {
            this.userCheckins[data.userId] = { lastCheckin: Date.now(), username: data.userName, id: data.userId };
          }
        }
      });
    });
  }

  pushEventToAllClients(event: NotificationEvent) {
    this.wss.clients.forEach((client) => {
      console.info('sending to clients: ', event);
      client.send(JSON.stringify(event));
    });
  }

  pollForActiveUsers() {
    // @TODO: Make this less bad.
    const checkinsAgainstTime = Object.values(this.userCheckins).map((ping: any) => {
      const deltaInMilliseconds = Date.now() - ping.lastCheckin;
      return { ...ping, now: Date.now(), delta: deltaInMilliseconds };
    });

    const miaUsers = checkinsAgainstTime.filter((checkin) => {
      return checkin.delta / 1000 > 2; // Greater than two-second ghost
    });

    this.disconnectedRegisteredUsers = miaUsers.map((userCheckin) => {
      return { username: userCheckin.username, id: userCheckin.id };
    });

    console.info(
      'MIA Users:',
      miaUsers.map((checkin) => {
        return { username: checkin.username };
      }),
    );
  }
}

new BingoServer();
