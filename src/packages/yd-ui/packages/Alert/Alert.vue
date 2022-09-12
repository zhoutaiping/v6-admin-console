<template>
  <div :class="'yd-alert--' + status" class="yd-alert">
    <h3 v-if="title" class="yd-alert__title">{{ title }}</h3>
    <div class="yd-alert__content">
      <slot/>
    </div>
  </div>
</template>

<script>
const NAME = 'yd-alert'

export default {
  name: NAME,

  props: {
    title: String,
    status: String
  }
}
</script>
<style lang="postcss">
.yd-alert {
  background-color: var(--tip-background);
  border: 1px solid var(--tip-border);
  padding: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #333;

  &__btn{
    margin-top: 12px;
  }

  strong{
    font-size: 14px;
    color: var(--color-primary);
  }
  &__title {
    font-size: 12px;
    color: #000;
    font-weight: 100;
    margin-bottom: 4px;
  }

  &--warning {
    background-color: #fdf6ec;
    border-color:  #e6a23c;
    color: #e6a23c;
  }
}
</style>
