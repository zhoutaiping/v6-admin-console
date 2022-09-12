<style lang="postcss">
.yd-card {
  position: relative;
  padding: 16px;
  &__title {
    font-weight: 500;
    color: rgb(47, 48, 51);
    font-size: 16px;
  }
  &__text--tips {
    color: rgb(94, 97, 102);
    font-size: 14px;
    margin-bottom: 20px;
  }
  &.is-horizontal {
    display: flex;

    .yd-card {
      &__header {
        width: 280px;
      }
      &__body {
        flex: 1;
      }
    }
  }
  &.is-grey {
    padding: 12px;
    background: #f7f7f7;
    .el-card__body {
      padding: 0px;
    }
  }
  .loader-wp {
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
      margin-top: -25px;
      width: 100px;
      height: 50px;
    }
  }
}
</style>

<template>
  <div :class="{'is-grey': grey, 'is-horizontal': horizontal}" class="yd-card">
    <yd-loading v-if="loading" class="loader-wp"/>
    <div v-if="$slots.header || header" class="yd-card__header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="yd-card__body">
      <slot/>
    </div>
  </div>
</template>

<script>
/*
+-----------------------------------------------------------------------------------------------------------------------
| Yundun
+-----------------------------------------------------------------------------------------------------------------------
| yd-card
| 卡片组件
*/

const NAME = 'yd-card'

export default {
  name: NAME,

  props: {
    header: {
      type: String,
      default: ''
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    grey: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

