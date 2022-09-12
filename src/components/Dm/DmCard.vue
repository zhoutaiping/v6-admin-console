<style lang="scss">
.DmCard {
  border: 1px solid $--border-color-lighter;
  background: #fff;

  &__header {
    position: relative;
    padding: 16px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $--color-text-primary;
  }

  &__action {
    position: absolute;
    right: 16px;
    top: 0px;
    bottom: 0px;
    display: flex;
    align-items: center;
  }

  .DmData {
    box-shadow: none;
  }

  &__body {
    padding: 16px;
  }
}
</style>

<template>
  <div :class="b()">
    <div
      v-if="$slots.header || $slots.title || title"
      ref="header"
      :class="b('header')"
    >
      <h3
        v-if="title || $slots.title"
        :class="b('title')"
      >{{ title }}
        <slot name="title" />
      </h3>
      <slot name="header" />
      <div :class="b('action')">
        <slot name="action" />
      </div>
    </div>
    <div
      v-loading="loading"
      :class="b('body')"
      element-loading-spinner="el-icon-loading"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'DmCard',

  props: {
    title: String,
    loading: true
  }
})
</script>
