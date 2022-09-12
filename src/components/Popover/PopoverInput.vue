<style lang="scss">
.PopoverInput {
  &__text {
    cursor: pointer;
    &:hover,
    &.is-edit {
      color: $--color-primary;
      border-bottom: 1px dotted $--color-primary;
      .PopoverInput {
        &__icon {
          display: inline;
        }
      }
    }
  }

  &__icon {
    display: none;
  }

  &__popover {
    .el-popover__title {
      font-size: 15px;
    }
  }
}
</style>

<template>
  <div :class="b()">
    <popover
      v-model="visible"
      :placement="placement"
      trigger="click"
      @confirm="handleSubmit"
      @visibleChange="visibleChange"
    >
      <template slot="content">
        <el-form>
          <el-form-item>
            <el-input
              ref="Input"
              v-model="content"
              :placeholder="placeholder"
              :maxlength="255"
              clearable
            />
          </el-form-item>
        </el-form>
        <div style="text-align: right;">
          <el-button
            size="mini"
            @click="handleClose"
          >取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleSubmit"
          >确定</el-button>
        </div>
      </template>
      <div>
        <span :class="[b('text'), {'is-edit': visible}]">{{ value || defaultValue }}
          <span
            :class="b('icon')"
            class="el-icon-edit"
          />
        </span>
      </div>
    </popover>
  </div>
</template>

<script>
import popover from 'ant-design-vue/lib/popover'
import create from '@/utils/create-basic'

export default create({
  name: 'PopoverInput',

  components: { popover },

  props: {
    value: [String, Number],
    defaultValue: String,
    placeholder: {
      type: String,
      default: '输入内容'
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  },

  data() {
    return {
      visible: false,
      content: this.value
    }
  },

  watch: {
    value(val) {
      this.content = val
    }
  },

  methods: {
    visibleChange(e) {
      if (e) {
        this.content = this.value
        setTimeout(() => {
          this.$refs.Input.focus()
        }, 0)
      }
    },

    handleClose() {
      this.visible = false
    },

    handleSubmit() {
      this.visible = false
      // 未修改或已清空
      if (!this.content || this.value === this.content) {
        this.handleClose()
        return
      }
      this.$emit('submit', this.content)
    }
  }
})
</script>
