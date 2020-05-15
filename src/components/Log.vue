<template>
  <div :class="$style.root">
    <ul :class="$style.messageList" ref="list">
      <li :class="$style.message" v-for="(message, index) in messages" :key="index">
        {{ message }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
// @ts-ignore
import smoothHeight from 'vue-smooth-height';

export default Vue.extend({
  mixins: [smoothHeight],
  props: {
    messages: Array,
  },
  mounted() {
    // @ts-ignore
    this.$smoothElement({
      el: this.$refs.list,
    });
  },
});
</script>
<style lang="scss" module>
.root {
}

.messageList {
  padding: 0;
  margin: 0;
  list-style-type: none;
  transition: all 0.25s ease;
}

.message {
  padding: 15px;
  border-radius: 3px;
  background-color: #dedede;
  color: #1d1d1d;
  margin: 5px;
}
</style>
