<style lang='postcss'>
@keyframes dialog-aside-in {
  0% {
    transform: translate3d(120px, 0, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-aside-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(120px, 0, 0);
    opacity: 0;
  }
}

.fd-dialog {
  &--order {
    .fd-dialog {
      &__title {
      }
      &__stitle {
        margin-top: 10px;
      }
      &__sitem {
        margin: 15px 0px 0px 0px;
      }
      &__sinput2 {
        width: 295px;
      }
      &__sinput {
        width: 205px;
        .el-input-group__append {
          background-color: #ffffff;
        }
        .el-input-group__prepend {
          background-color: #ffffff;
        }
      }
    }
  }

  .el-dialog {
    border-radius: 0px !important;
    &__header {
      .el-dialog__close {
        font-size: 10px;
      }
    }

    &__footer {
      padding: 10px !important;
      overflow: hidden;
    }
  }
  .yd-input-safe-code {
    text-align: center;
    margin: 20px auto;
  }

  &.is-aside {
    &.size--small {
      .el-dialog {
        width: 600px;
      }
    }

    &.size--mini {
      .el-dialog {
        width: 400px;
      }
    }

    &.size--500 {
      .el-dialog {
        width: 500px;
      }
    }

    &.size--600 {
      .el-dialog {
        width: 600px;
      }
    }
    .el-dialog {
      position: absolute;
      display: flex;
      flex-direction: column;
      overflow: auto;
      right: 0px !important;
      top: 0px !important;
      bottom: 0px;
      width: 750px;
      left: auto;
      transform: translateX(0%);
      margin: 0px !important;

      &__header {
        padding: 10px;
        margin-bottom: 0px;
        border-bottom: 1px solid #eee;
      }

      &__title {
        font-size: 16px;
        padding-top: 5px;
        padding-bottom: 5px;
        border-left: 3px solid #409eff;
        padding-left: 10px;
      }
      &__headerbtn {
        top: 12px !important;
      }
      &__body {
        padding: 0 10px;
        flex: 1;
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        overflow-x: auto;
        padding-bottom: 60px;
      }
    }
    &.dialog-fade-enter-active {
      animation: ease-in-out dialog-aside-in 0.18s !important;
    }

    &.dialog-fade-leave-active {
      animation: ease-in-out dialog-aside-out 0.18s !important;
    }

    &.fd-dialog-aside {
      &--top {
        .el-dialog__headerbtn {
          display: none;
        }

        .el-dialog__footer {
          position: absolute;
          right: 0px;
          top: 0px;
          padding: 15px;
          .el-button {
            margin-left: 25px;
            font-size: 13px;

            &--primary {
              background: #fff;
              border: none;
              color: var(--color-primary);
            }
          }
        }
      }
      &--default {
        .el-dialog__footer {
          background: rgb(245, 245, 245);
          position: absolute;
          overflow: auto;
          padding: 5px;
          right: 0px;
          left: 0px;
          bottom: 0px;
        }
      }
    }
  }
  &__footer {
    .pull-left {
      float: left;
    }
  }
}
</style>

<template>
  <el-dialog
    :class="[
      { 'is-aside': aside },
      'fd-dialog-aside--' + asideType,
      'size--' + size
    ]"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :title="title"
    :width="width"
    :append-to-body="append"
    :visible.sync="open"
    class="fd-dialog"
    @close="handleClose"
  >
    <slot />
    <div slot="footer">
      <slot name="footer" />
    </div>
  </el-dialog>
</template>

<script>
/*
+-----------------------------------------------------------------------------------------------------------------------
| Yundun
+-----------------------------------------------------------------------------------------------------------------------
| fd-dialog
| 弹框组件，支持 aside
*/

const NAME = 'FDialog'

export default {
  name: NAME,

  props: {
    title: String,
    visible: Boolean,
    size: String,
    asideType: {
      type: String,
      default: 'default'
    },
    aside: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    append: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      closeOnPressEscape: false,
      open: this.visible
    }
  },

  computed: {},

  watch: {
    visible(val) {
      if (val) {
        this.open = true
      } else {
        this.open = false
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>
