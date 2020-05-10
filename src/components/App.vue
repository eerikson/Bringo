<template>
  <div :class="$style.root">
    <Users :users="users" />
    <Log :messages="logMessages" :class="$style.log" />
    <ModalTransition>
      <Modal v-if="!userRegistered">
        <form @submit="handleWelcomeFormSubmit" :class="$style.form">
          <input type="text" placeholder="Enter a name." ref="usernameInput" />
          <button type="submit">Go</button>
        </form>
      </Modal>
    </ModalTransition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Log from './Log.vue';
import Modal from './Modal.vue';
import Users from './Users.vue';
import ModalTransition from './ModalTransition.vue';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { NotificationEvent, NotificationEventType, User } from '../types/base';

interface Data {
  output: string;
  logMessages: string[];
  userRegistered: boolean;
  users: User[] | undefined;
  userId: string;
  socket: null | WebSocket;
  userName: string;
}

export default Vue.extend({
  components: {
    Log,
    Modal,
    ModalTransition,
    Users,
  },
  data(): Data {
    return {
      output: '',
      logMessages: [],
      users: [],
      userRegistered: false,
      socket: null,
      userId: '',
      userName: '',
    };
  },
  methods: {
    setUpWebsocketBindings() {
      const HOST = location.origin.replace(/^http/, 'ws');
      this.socket = new WebSocket(HOST);

      this.socket.onmessage = (event) => {
        this.output = event.data;
        const data: NotificationEvent = JSON.parse(event.data);
        this.logMessages.push(event.data);

        if (data.type === NotificationEventType.UserListUpdated) {
          this.users = data.users;
        }
      };
    },

    async handleWelcomeFormSubmit($event: Event) {
      $event.preventDefault();
      const userName = (this.$refs.usernameInput as HTMLInputElement).value;
      const userId = uuidv4();
      const event: NotificationEvent = { type: NotificationEventType.UserJoinAttempt, userName, userId };
      await this.socket?.send(JSON.stringify(event));
      this.userId = userId;
      this.userName = userName;
      this.userRegistered = true;
    },

    async sendProofOfLife() {
      if (!this.userId) {
        return;
      }
      const event: NotificationEvent = {
        type: NotificationEventType.UserCheckedIn,
        userId: this.userId,
        userName: this.userName,
      };
      await this.socket?.send(JSON.stringify(event));
    },
  },
  mounted() {
    this.setUpWebsocketBindings();
    window.setInterval(this.sendProofOfLife, 1000);
  },
});
</script>
<style module lang="scss">
@import '../scss/normalize';

.root {
  position: relative;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, Arial;
}

.log {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 500px;
}

.form {
  margin-block-end: unset;
}
</style>
