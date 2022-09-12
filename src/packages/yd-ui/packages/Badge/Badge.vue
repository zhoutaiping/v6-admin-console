<template>
  <div class="yd-badge">
    <span :class="'yd-badge-status--' + status" class="yd-badge__dot"/>
    <span v-if="text" class="yd-badge__text">{{ text }}</span>
    <slot/>
  </div>
</template>

<script>
const NAME = 'yd-badge'
export default {
  name: NAME,
  components: {},
  props: {
    status: String,
    text: String
  },
  data() {
    return {}
  },
  computed: {},

  methods: {}
}
</script>

<style lang="postcss">
@keyframes antStatusProcessing {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  to {
    transform: scale(2.4);
    opacity: 0;
  }
}

.yd-badge {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  font-size: 0px;

  &-status {
    &--success {
      background-color: var(--status-success);
    }
    &--error {
      background-color: var(--status-error);
    }
    &--default {
      background-color: var(--status-default);
    }
    &--processing {
      background-color: var(--status-processing);
      &:after {
        position: absolute;
        top: -1px;
        left: -2px;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #1890ff;
        content: '';
        animation: antStatusProcessing 1.2s infinite ease-in-out;
      }
    }
    &--warning {
      background-color: var(--status-warning);
    }
  }
  &__dot {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 50%;
    position: relative;
  }
  &__text {
    color: rgba(0, 0, 0, 0.65);
    margin-left: 6px;
    font-size: 12px;
  }
}
</style>
