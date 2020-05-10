<template>
  <transition
    :class="$style.root"
    :enter-active-class="$style.fadeEnter"
    :leave-active-class="$style.fadeLeave"
    :duration="900"
  >
    <slot :class="$style.target" />
  </transition>
</template>
<style module lang="scss">
:global {
  .animationControl--modalRoot,
  .animationControl--modalContent {
    will-change: transform; // Prevent text shifting.
  }
}

.fadeEnter,
.fadeLeave {
  animation-duration: 0.25s;
  animation-fill-mode: both;
  animation-name: modalBackground;
  animation-timing-function: linear;

  :global(.animationControl--modalContent) {
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-name: modalForeground;
  }
}

.fadeEnter {
  :global(.animationControl--modalContent) {
    animation-delay: 0.15s;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  }
}

.fadeLeave {
  animation-delay: 0.15s;
  animation-direction: reverse;

  :global(.animationControl--modalContent) {
    animation-direction: reverse;
    animation-timing-function: cubic-bezier(0.78, 0, 0.81, 0);
  }
}

@keyframes modalBackground {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalForeground {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
