<template>
  <div :class="$style.root">
    <ul :class="$style.list">
      <li
        :class="[$style.user, { [$style.currentUser]: currentUser.id === user.id }]"
        v-for="(user, index) in users"
        :key="index"
      >
        <h5 :class="$style.username">{{ user.username }}</h5
        ><span :class="$style.itYou" v-if="currentUser.id === user.id">that’s you!</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
// import { User } from '../types/base';
import Vue from 'vue';
export default Vue.extend({
  props: {
    users: {
      type: Array,
    },
    currentUser: {
      type: Object,
    },
  },
});
</script>
<style lang="scss" module>
.root {
}

.currentUser .username {
  // color: red;
}
.list {
  padding: 0;
  list-style-type: none;
  margin: 0;
}

.user {
  padding: 15px;
  position: relative;

  &:not(:last-child) {
    border-bottom: 1px solid #d2d2d2;
  }
}

.username {
  margin: 0;
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
}

.itYou {
  font-style: italic;
  font-size: 12px;
  color: #868686;
}
</style>
