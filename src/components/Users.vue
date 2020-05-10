<template>
  <div :class="$style.root">
    <ul :class="$style.list">
      <li v-for="(user, index) in users" :key="index">
        {{ user }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    users: Array,
  },
});
</script>
<style lang="scss" module>
.root {
  outline: 2px solid blue;
}
</style>
