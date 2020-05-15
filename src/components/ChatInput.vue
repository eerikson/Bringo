<template>
  <div :class="[$style.root, { [$style.disabled]: chatMessage.length < 1 }]">
    <form ref="form" @submit="handleSubmit" :class="$style.form">
      <TextInput placeholder="Say something to everybody…" :class="$style.textInput" v-model="chatMessage" /><div
        :class="$style.send"
        @click="$emit('submitChatMessage', { message: chatMessage })"
        ><Send :class="$style.sendIcon"
      /></div>
    </form>
  </div>
</template>
<script lang="ts">
import TextInput from './TextInput.vue';
import Send from './svg/Send.vue';
import Vue from 'vue';
export interface MessageEvent {
  message: string;
}
export default Vue.extend({
  components: {
    TextInput,
    Send,
  },
  data() {
    return {
      chatMessage: '',
    };
  },
  methods: {
    handleSubmit($event: Event) {
      $event.preventDefault();
      this.$emit('submitChatMessage', { message: this.chatMessage } as MessageEvent);
      this.chatMessage = '';
    },
  },
});
</script>
<style lang="scss" module>
$enabled: #1d1d1d;
$disabled: #adadad;
.root {
  padding: 15px;

  &.disabled {
    .textInput {
      border-color: $disabled;
    }
    .send {
      border-color: $disabled;
    }

    .sendIcon {
      fill: $disabled;
    }
  }
}

.form {
  display: flex;
  margin-block-end: unset;
}

.textInput {
  transition: border-color 0.15s linear;
  border-bottom: 1px solid $enabled;
  font-size: 14px;
  flex: 1;
}

.send {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  border: 1px solid $enabled; // disabled color
  padding: 5px;
  border-radius: 3px;
  transition: border-color 0.15s linear;
}

.sendIcon {
  fill: $enabled;
  transition: fill 0.15s linear;
}
</style>
