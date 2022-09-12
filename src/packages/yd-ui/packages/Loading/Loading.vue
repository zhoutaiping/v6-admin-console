<template>
  <div class="yd-loading">
    <div class="bouncing-loader">
      <!-- <div></div>
      <div></div>
      <div></div> -->
    </div>
  </div>
</template>

<script>
const NAME = 'yd-loading'

export default {
  name: NAME
}
</script>

<style lang="postcss">
@keyframes bouncing-loader {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.1;
  }
}

.yd-loading {
  position: absolute;
  z-index: 100;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(255, 255, 255, 0.5);
  .bouncing-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -4px;
    width: 100px;
    height: 8px;
    display: flex;
    justify-content: center;
  }

  .bouncing-loader > div {
    width: 8px;
    height: 8px;
    margin: 0px 5px;
    background: $--color-primary;
    border-radius: 100%;
    animation: bouncing-loader 0.6s infinite alternate;
  }
  .bouncing-loader > div:nth-child(2) {
    animation-delay: 0.2s;
  }
  .bouncing-loader > div:nth-child(3) {
    animation-delay: 0.4s;
  }
}
</style>
