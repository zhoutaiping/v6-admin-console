<style lang="scss" scoped>
.footer {
  position:absolute;
  width: 100%;
  background-image: linear-gradient(-45deg,#2179dd,#00289c);
}
</style>

<template>
  <div class="footer">
    <footEnd/>
  </div>
</template>

<script>
import footEnd from './foot-end'
export default {
  components: { footEnd },
  data() {
    return {
    }
  },
  computed: {
  }
}
</script>
