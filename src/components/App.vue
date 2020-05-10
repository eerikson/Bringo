<template>
  <div :class="$style.root">
    <h1>Hello</h1>
    <code>Output: {{ output }}</code>
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
import { EVENT_TYPES } from '../lib';

interface Data {
  output: string;
  logMessages: string[];
  userRegistered: boolean;
  users: any[];
  userId: string | null;
  socket: null | WebSocket;
  userName: string | null;
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
      userId: null,
      userName: null,
    };
  },
  methods: {
    setUpWebsocketBindings() {
      const HOST = location.origin.replace(/^http/, 'ws');
      this.socket = new WebSocket(HOST);

      this.socket.onmessage = (event) => {
        this.output = event.data;
        const data = JSON.parse(event.data);
        this.logMessages.push(event.data);
        if (data.type === EVENT_TYPES.USER_LIST_UPDATE) {
          this.users = data.value;
        }
      };
    },

    async handleWelcomeFormSubmit($event: Event) {
      $event.preventDefault();
      const username = (this.$refs.usernameInput as HTMLInputElement).value;
      const id = uuidv4();
      const dataToSend = { type: EVENT_TYPES.USER_JOIN, username, id };
      await this.socket?.send(JSON.stringify(dataToSend));
      this.userId = id;
      this.userName = username;
      this.userRegistered = true;
    },

    async sendProofOfLife() {
      if (!this.userId) {
        return;
      }
      const dataToSend = { type: EVENT_TYPES.USER_CHECKIN, id: this.userId, username: this.userName };
      await this.socket?.send(JSON.stringify(dataToSend));
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
