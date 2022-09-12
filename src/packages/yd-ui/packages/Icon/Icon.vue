<template>
  <span :class="name" class="yd-icon"/>
</template>

<script>
/*
+-----------------------------------------------------------------------------------------------------------------------
| Yundun
+-----------------------------------------------------------------------------------------------------------------------
| yd-icon
| 图标组件
*/

const NAME = 'yd-icon'

export default {
  name: NAME,

  props: {
    name: String
  }
}
</script>

<style lang="postcss">
.yd-icon {
  &:before {
    color: inherit;
  }
}
</style>
