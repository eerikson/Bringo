<template>
  <div :class="$style.root">
    <div :class="[$style.content, 'animationControl--modalContent']">
      <slot />
    </div>
  </div>
</template>
<style lang="scss" module>
.root {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  // width: 500px;
  // min-height: 250px;
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  padding: 10px;
}
</style>
