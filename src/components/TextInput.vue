<template>
  <input type="text" :value="value" :class="$style.root" @input="$emit('input', $event.target.value)" />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    value: String,
  },
});
</script>
<style lang="scss" module>
.root {
  appearance: none;
  padding: 5px;
  background-color: transparent;
  border: none;
  color: inherit;
  border-radius: 0;

  &:focus {
    outline: none;
  }
}
</style>
