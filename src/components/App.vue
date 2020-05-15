<template>
  <div :class="[$style.root, { [$style.sidebarHidden]: sidebarHidden }]">
    <div v-if="userRegistered" :class="$style.sidebar">
      <div :class="$style.close" @click="sidebarHidden = !sidebarHidden"><Close :class="$style.closeIcon"/></div>
      <div :class="$style.sidebarContent">
        <ChatInput :class="$style.chatInput" @submitChatMessage="handleChatMessageSubmit" />
        <Users :users="users" :class="$style.users" :currentUser="this.currentUser" />
        <Log :messages="logMessages" :class="$style.log" ref="log" />
      </div>
    </div>
    <transition
      :enter-active-class="$style.fadeEnterActive"
      :leave-active-class="$style.fadeLeaveActive"
      :enter-class="$style.fadeEnter"
      :leave-to-class="$style.fadeLeaveTo"
    >
      <Splash v-if="!userRegistered" :class="$style.splash" @done="splashComplete = true" />
    </transition>

    <ModalTransition>
      <Modal v-if="splashComplete && !userRegistered">
        <div :class="$style.registrationForm">
          <h2 :class="$style.formHeader">Please enter your name.</h2>
          <form @submit="handleWelcomeFormSubmit" :class="$style.form">
            <TextInput
              placeholder="Enter a name."
              ref="usernameInput"
              :class="$style.textInput"
              @input="tempUsername = $event"
            />
            <Button type="submit" :disabled="tempUsername.length < 4">Go</Button>
          </form>
        </div>
      </Modal>
    </ModalTransition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Log from './Log.vue';
import Modal from './Modal.vue';
import Users from './Users.vue';
import Button from './Button.vue';
import TextInput from './TextInput.vue';
import Splash from './Splash.vue';
import Close from './svg/Close.vue';
import ModalTransition from './ModalTransition.vue';
import ChatInput, { MessageEvent } from './ChatInput.vue';

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
} from '../types/base';
// @ts-ignore
import io from 'socket.io-client';

interface Data {
  logMessages: string[];
  userRegistered: boolean;
  users: User[] | undefined;
  userId: string;
  socket: any;
  splashComplete: boolean;
  tempUsername: string;
  userName: string;
  currentUser: User;
  sidebarHidden: boolean;
}

export default Vue.extend({
  components: {
    Log,
    Modal,
    ModalTransition,
    Button,
    Users,
    Splash,
    TextInput,
    Close,
    ChatInput,
  },
  data(): Data {
    return {
      logMessages: [],
      users: [],
      userRegistered: false,
      socket: null,
      userId: '',
      userName: '',
      splashComplete: false,
      tempUsername: '',
      currentUser: {
        id: '',
        username: '',
      },
      sidebarHidden: false,
    };
  },
  methods: {
    async handleWelcomeFormSubmit($event: Event) {
      $event.preventDefault();
      this.currentUser.username = this.tempUsername;
      const event: UserJoinAttemptEvent = this.currentUser;
      await this.socket.emit(EventType.UserJoinAttempt, event);
      this.userRegistered = true;
    },
    async handleChatMessageSubmit($event: MessageEvent) {
      await this.socket.emit(EventType.UserChatAttempt, {
        message: $event.message,
        username: this.currentUser.username,
      } as UserChatAttemptEvent);
    },

    // Event handlers for socket.io
    handleConnection(event: ClientConnectionSuccessfulEvent) {
      this.currentUser.id = event.id;
    },

    handleUserJoined(event: UserJoinedEvent) {
      this.logMessages.push(`${event.username} has joined!`);
    },

    handleUsersUpdated(event: UserListUpdatedEvent) {
      this.users = event.users;
    },

    handleUserLeft(event: UserLeftEvent) {
      this.logMessages.push(`${event.username} has left.`);
    },

    handleUserMessage(event: UserMessageEvent) {
      this.logMessages.push(`${event.username}: ${event.message}`);
    },
  },

  mounted() {
    this.socket = io.connect();

    // Map socket handlers
    const handlerMappings = [
      [EventType.ClientConnectionSuccessful, this.handleConnection],
      [EventType.UserJoined, this.handleUserJoined],
      [EventType.UserListUpdated, this.handleUsersUpdated],
      [EventType.UserLeft, this.handleUserLeft],
      [EventType.UserSentMessage, this.handleUserMessage],
    ];

    handlerMappings.forEach((mapping: any) => {
      this.socket.on(mapping[0], mapping[1]);
    });
  },
});
</script>
<style module lang="scss">
@import '../scss/normalize';

body {
  font-family: 'nunito', sans-serif;
}

.root {
  position: relative;
  min-height: 100vh;
  background-color: #151515;
  color: #1d1d1d;
}

.log {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  max-height: 215px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

.form {
  margin-block-end: unset;
}

.formHeader {
  margin: 0 auto 10px;
  font-size: 18px;
}

.splash {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.textInput {
  border-bottom: 2px solid white;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: rgba(255, 255, 255, 0.3);
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: rgba(255, 255, 255, 0.3);
  }
}

.registrationForm {
  text-align: center;
}

.fadeEnterActive,
.fadeLeaveActive {
  transition: opacity 0.25s linear;
}

.fadeLeaveActive {
  transition-delay: 0.25s;
}

.fadeEnter,
.fadeLeaveTo {
  opacity: 0;
}

.users {
  position: relative;
  margin-left: 5px;
}

.sidebar {
  width: 300px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebarContent {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  height: calc(100vh - 45px);
}

.sidebarHidden .sidebar {
  // transform: translateX()
  .sidebarContent {
    transform: translateX(-100%);
  }
}

.close {
  width: 15px;
  height: 15px;
  padding: 10px;
  background-color: #dedede;
  border-radius: 3px;
}

.chatInput,
.close,
.users {
  margin: 5px;
  background-color: #dedede;
  border-radius: 3px;
}
</style>
