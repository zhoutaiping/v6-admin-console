<style lang="postcss">
@keyframes antZoomDownIn {
  0% {
    opacity: 0;
    transform-origin: 50% 0%;
    transform: scale(0.8);
  }
  100% {
    transform-origin: 50% 0%;
    transform: scale(1);
  }
}

.zoom-big-fast {
  &-enter {
    animation-duration: 0.1s;
    animation-fill-mode: both;
    animation-play-state: paused;
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  &-enter-active {
    animation-name: antZoomDownIn;
    animation-duration: 0.2s;
  }
}

.yd-button-checkbox {
  > .yd-button {
    border-radius: 2px;
    transition: 0.15s;
    &:hover {
      border-color: var(--color-primary);
    }
  }
}

.popover--checkboxs {
  padding: 0px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: 0.1s;

  .popper__arrow {
    background: #fff;
    width: 8.48528137px;
    height: 8.48528137px;
    transform: rotate(45deg);
    position: absolute;
    display: block;
    border-color: transparent;
    border-style: solid;

    left: 50%;
    transform: translateX(-50%) rotate(45deg);

    top: 0px !important;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }

  .popover__footer {
    text-align: center;
    border-top: 1px solid #eee;
    padding: 10px;
    button {
      width: 80px;
    }
  }
  .checkbox {
    &-list {
      &-wrap {
        position: relative;
        z-index: 1;
        padding: 8px 0;
        background: #fff;
      }
      &__scroll {
        flex-direction: column;
        max-height: 250px;
        overflow-x: auto;
        display: flex;
      }
    }

    &-item {
      .el-checkbox {
        display: block;
        padding: 8px 12px;
      }
      &:hover {
        background: rgb(250, 250, 250);
      }
    }
  }
}
</style>
<template>
  <span class="yd-button-checkbox">
    <el-popover ref="popover" v-model="visible" transition="zoom-big-fast" popper-class="popover--checkboxs" placement="bottom-start" width="230" trigger="click">
      <div class="checkbox-list-wrap">
        <div class="checkbox-list">
          <div class="checkbox-item">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" class="checkbox-item" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <div class="checkbox-list__scroll">
            <yd-scroll>
              <el-checkbox-group v-model="val" @change="handleChange">
                <div v-for="(item, index) in checks" :key="index" class="checkbox-item">
                  <el-checkbox :label="item.value" :value="item.value">{{ item.label }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </yd-scroll>
          </div>
        </div>
      </div>
      <div class="popover__footer">
        <yd-button type="default" @click="handleReset">清空已选</yd-button>
        <el-button :disabled="totalValue === 0" type="primary" @click="handleSubmit">{{ textSubmit }}</el-button>
      </div>
    </el-popover>
    <yd-button v-popover:popover type="default">
      <template v-if="val && val.length > 0">
        <!-- {{text}} -->
        已选{{ totalValue }}{{ unit }}(共{{ totalList }}{{ unit }}){{ itemName }}
      </template>
      <template v-else>
        选择{{ itemName }}
      </template>
      <!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
    </yd-button>
  </span>
</template>

<script>

const NAME = 'yd-button-checkbox'

export default {
  name: NAME,

  props: {
    value: [Array, String],
    checks: Array,
    unit: {
      type: String,
      default: '个'
    },
    itemName: {
      type: String,
      default: '网站'
    },
    textAll: {
      type: String,
      default: '选择网站'
    },
    textSubmit: {
      type: String,
      default: '确认查询'
    }
  },

  data() {
    return {
      checkAll: false,
      val: this.value,
      text: '',
      visible: false,
      isIndeterminate: true
    }
  },

  computed: {
    totalList() {
      const { checks } = this
      if (checks && checks.length > 0) {
        return checks.length
      } else {
        return '--'
      }
    },
    totalValue() {
      const { val } = this
      if (val && val.length > 0) {
        return val.length
      } else {
        return 0
      }
    }
  },

  watch: {
    value(val) {
      this.val = val
      this.handleChange()
    },
    checks(val) {
      if (val && this.val && this.val.length === 0) {
        // console.log(val)
        this.checkAll = true
        this.handleCheckAllChange(true)
      }
    }
  },

  mounted() {
    this.handleChange()
  },

  methods: {
    handleCheckAll() {
      this.checkAll = true
      this.handleCheckAllChange()
    },
    handleCheckAllChange() {
      const { checkAll } = this
      this.val = checkAll ? this.checks.map(_ => _.value) : []
      this.isIndeterminate = false
      this.handleChange()
    },
    handleChange() {
      const { val = [] } = this
      let text

      const selectTotal = val.length
      if (val.length === 0) {
        text = this.textAll
      } else {
        text = this.checks.find(_ => _.value === val[0]).label
        text += ` 等 ${val.length} 个`
      }

      this.checkAll = selectTotal === this.checks.length

      this.isIndeterminate = selectTotal > 0 && selectTotal < this.checks.length
      this.text = text
    },
    handleReset() {
      this.isIndeterminate = false
      this.val = []
      this.checkAll = false
      // this.handleSubmit()
    },
    handleSubmit() {
      this.$emit('input', this.val)
      this.$emit('submit', this.val)

      this.visible = false
      this.handleChange()
    }
  }
}
</script>
