<template>
  <vue-particles
    :particle-opacity="0.8"
    :particles-number="70"
    :particle-size="4"
    :lines-width="1"
    :line-linked="true"
    :line-opacity="0.6"
    :lines-distance="150"
    :move-speed="3"
    :hover-effect="true"
    :click-effect="true"
    :color="color"
    :lines-color="color"
    shape-type="circle"
    hover-mode="grab"
    click-mode="push"
  />
</template>

<script>
import Vue from 'vue'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
export default {
  name: 'Particles',
  props: {
    color: {
      type: String,
      default: '#FFFFFF'
    }
  }
}
</script>

<style>
#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
