<style lang="scss">
.ColumnListMore{
  &__item{
    display: inline-block;
  }
}
</style>

<template>
  <span :class="b()">
    <template v-for="(item, index) in value">
      <el-divider
        v-if="index > 0"
        :key="index"
        direction="vertical"
      />
      <span
        :key="index"
        :class="b('item')"
      >
        {{ item }}
      </span>
    </template>
  </span>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnListMore',

  props: {
    value: [Array]
  }
})
</script>
