<style lang="postcss">
.yd-card-list {
  .yd-card {
    &:not(:last-child) {
      margin-bottom: 12px;
      border-bottom: 1px solid rgb(230, 230, 240);
    }
  }
}
</style>
<template>
  <div class="yd-card-list">
    <slot/>
  </div>
</template>

<script>
const NAME = 'yd-card-list'
export default {
  name: NAME,
  props: {}
}
</script>
