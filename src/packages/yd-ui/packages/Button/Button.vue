<template>
  <div :class="['yd-button--' + type, 'size-' + size, { 'is-circle': circle }]" class="yd-button" @click="handleClick">
    <i :class="icon" class="yd-button__icon"/>
  </div>
</template>

<script>
const NAME = 'yd-button'

export default {
  name: NAME,

  components: {},
  props: {
    type: String,
    icon: String,
    size: String,
    circle: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  computed: {},

  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="postcss">
.yd-button {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  &--primary {
    color: #fff;
    background: var(--color-primary);

    &:hover {
      background: rgba(var(--color-primary), 0.8);
    }
  }
  &.is-circle {
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 100%;
    font-size: 14px;
  }

  &.size-medium {
    &.is-circle {
      width: 36px;
      height: 36px;
      line-height: 36px;
    }
  }

  &.size-small {
    &.is-circle {
      width: 32px;
      height: 32px;
      line-height: 32px;
    }
  }

  &.size-mini {
    &.is-circle {
      width: 28px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
  }

  &.size-mini-m1 {
    &.is-circle {
      width: 24px;
      height: 24px;
      line-height: 24px;
      font-size: 10px;
    }
  }

  &.size-mini-m2 {
    &.is-circle {
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 8px;
    }
  }

  &.size-mini-m3 {
    &.is-circle {
      width: 16px;
      height: 16px;
      line-height: 16px;
      font-size: 8px;
    }
  }
}
</style>
