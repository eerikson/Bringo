<template>
  <button :class="$style.root">
    <slot />
  </button>
</template>
<style lang="scss" module>
.root {
  appearance: none;
  background: transparent;
  border: 2px solid white;
  color: inherit;
  border-radius: 3px;
  padding: 5px;
  border-radius: 3px;
  min-width: 50px;
  font-weight: 700;
  transition: opacity 0.15s linear;

  &[disabled] {
    opacity: 0.3;
  }
}
</style>
