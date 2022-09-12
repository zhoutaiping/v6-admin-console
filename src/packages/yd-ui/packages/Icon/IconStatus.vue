<template>
  <div :class="['yd-icon-status--' + status, {'is-active': active, 'is-default': !active}]" class="yd-icon-status">
    <yd-icon :class="icon"/>
    <span v-if="text" class="yd-icon-status__text">{{ text }}</span>
  </div>
</template>

<script>
/*
+-----------------------------------------------------------------------------------------------------------------------
| Yundun
+-----------------------------------------------------------------------------------------------------------------------
| yd-icon-status
| 图标状态颜色 + 文字组件
*/

const NAME = 'yd-icon-status'

export default {
  name: NAME,
  props: {
    icon: String,
    status: String,
    text: String,
    active: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {}
  }
}
</script>

<style lang="postcss">
.yd-icon-status {
  display: inline-block;
  font-size: 12px;

  &__text {
    margin-left: 8px;
    color: rgba(0, 0, 0, 0.65);
  }

  i:before {
    color: inherit;
  }

  &--success {
    color: var(--status-success);
  }

  &--warning {
    color: var(--status-warning);
  }

  &--processing {
    color: var(--status-processing);
  }

  &--error {
    color: var(--status-error);
  }

  &--default {
    color: var(--status-default);
  }

  &.is-default {
    >.yd-icon {
      color: var(--status-default) !important;
    }
  }
}
</style>
