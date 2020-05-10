/*
 *
 *  TODO: Get all this Typscript bullshit working with webpack and express.
 *
 *
 */

import express from 'express';
import { Server } from 'ws';
import path from 'path';
import { EVENT_TYPES } from './lib.js';
// import { connect } from 'http2';

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Workaround for --enable-experimental-modules

const server = express()
  .use(express.static(__dirname + '/public')) // Serve built files from webpack (doesnt friggin work)
  .get('/', (_req, res) => res.sendFile(INDEX, { root: __dirname })) // Serve root entry file
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

interface BingoServer {
  wss: Server;
  connectedAndRegisteredUsers: any[];
  disconnectedRegisteredUsers: any[];
  userCheckins: any;
}

class BingoServer {
  constructor() {
    this.wss = new Server({ server });
    this.connectedAndRegisteredUsers = [];
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

      ws.on('message', (event: any) => {
        const data = JSON.parse(event);

        if (data.type === EVENT_TYPES.USER_JOIN) {
          this.connectedAndRegisteredUsers.push({ username: data.username, id: data.id });
          this.pushToAllClients({ label: `${data.username} has joined!` });
          this.pushToAllClients({ type: EVENT_TYPES.USER_LIST_UPDATE, value: this.connectedAndRegisteredUsers });
          console.info('New user joined:', data.username);
        }

        if (data.type === EVENT_TYPES.USER_CHECKIN) {
          // console.info('user checkin:', data);
          this.userCheckins[data.id] = { lastCheckin: Date.now(), username: data.username };
        }
      });
    });
  }

  pushToAllClients(data: any) {
    this.wss.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  }

  pollForActiveUsers() {
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
    // Send a notification about any changes here
    // console.info('registered:', this.connectedAndRegisteredUsers);
    // console.info('registered disconnected:', this.disconnectedRegisteredUsers);
    // console.info(
    //   'Difference:',
    //   this.disconnectedRegisteredUsers.filter((x) => !this.connectedAndRegisteredUsers.includes(x)),
    // );

    console.info(
      'MIA Users:',
      miaUsers.map((checkin) => {
        return { username: checkin.username };
      }),
    );
  }
}

new BingoServer();
