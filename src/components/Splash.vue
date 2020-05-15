<template>
  <div :class="$style.root" @click="$emit('done')">
    <div :class="$style.layers">
      <div :class="[$style.layer, $style.layer1]" />
      <div :class="[$style.layer, $style.layer2]" />
      <div :class="[$style.layer, $style.layer3]" />
      <div :class="[$style.layer, $style.layer4]">
        <div :class="[$style.layer, $style.lockup]">
          <Bringo :class="$style.logo" />
          <button :class="$style.button">Click anywhere to start</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bringo from './svg/Bringo.vue';
export default {
  components: {
    Bringo,
  },
  mounted() {
    // setTimeout(() => this.$emit('done'), 2000);
  },
};
</script>
<style lang="scss" module>
$initial-layer-transform: rotate(10deg);
.root {
}

.button {
  appearance: none;
  font-weight: 700;
  text-align: center;
  display: block;

  margin: 20px auto 0;
  font-family: 'nunito';
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 3px;
  padding: 5px 10px;
  animation: slideIn 0.5s 1.5s forwards cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateY(-20%);
  opacity: 0;
  will-change: transform;
}

.layer,
.layers {
  position: absolute;
  top: -25vh;
  left: -10vw;
  bottom: -25vh;
  right: -10vw;
}
.layers {
  transform: rotate(10deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer1 {
  background-color: #590202;
}

.layer2,
.layer3,
.layer4 {
  animation: layer2 1.5s forwards cubic-bezier(0.835, 0.005, 0.19, 1);
  top: 150vh;
}

.lockup {
  position: fixed;
  overflow: hidden;
  width: 450px;
  height: 165px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-10deg);
}

.logo {
  width: 100%;
}

.layer2 {
  background-color: #8c2703;
}

.layer3 {
  background-color: #f23005;
  animation-delay: 0.15s;
}

.layer4 {
  background-color: #bf1304;
  animation-delay: 0.3s;
  clip: rect(auto, auto, auto, auto);
}

@keyframes layer2 {
  from {
    top: 150vh;
  }

  to {
    top: -10vh;
  }
}

@keyframes slideIn {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
