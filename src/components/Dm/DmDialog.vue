<style lang="scss">
.DmDialog {
  .form-create {
    padding: 0px;
  }

  .el-dialog__body {
    position: relative;

    .ant-skeleton {
      display: flex;
      position: absolute;
      padding: 16px;
      padding-top: 0px;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 1;
      background: #fff;
    }
  }

  .yd-alert {
    margin-bottom: 16px;
  }
  &--aside {
    .DmDialog__header {
      margin-top: 12px;
    }
  }
}
</style>

<template>
  <yd-dialog
    :class="b([aside])"
    :title="titleShow"
    :visible.sync="visible"
    :aside="aside"
    :width="width"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    aside-type="top"
    @close="onClose"
  >
    <a-skeleton
      v-if="loading"
      active
    />
    <slot />
    <slot name="after" />
    <div
      v-if="footer"
      slot="footer"
    >
      <el-button
        v-show="closeShow"
        :type="aside ? 'text' : 'default'"
        @click="handleClose"
      >取消</el-button>
      <el-button
        v-show="submitShow"
        :loading="submitLoading"
        :type="aside ? 'text' : 'primary'"
        @click="handleSubmit"
      >{{ submitText }}</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import dialogBase from '@/mixins/dialogBase'

export default create({
  name: 'DmDialog',

  mixins: [dialogBase],
  props: {
    width: String,
    submitText: {
      type: String,
      default: '保存'
    },
    appendToBody: Boolean,
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeShow: {
      type: Boolean,
      default: true
    },
    submitShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    footer: {
      type: Boolean,
      default: true
    },
    aside: Boolean,
    titleLabel: {
      type: String,
      default: ''
    },
    loading: Boolean,
    fetchSubmit: Function,
    mode: {
      type: String,
      default: 'Create'
    },
    option: {
      type: Object
    }
  },

  data() {
    return {
      form: {},
      submitLoading: false
    }
  },

  computed: {
    titleShow() {
      if (this.title) {
        return this.title
      } else {
        return this.mode === 'Edit' ? `修改${this.titleLabel}` : `创建${this.titleLabel}`
      }
    }
  },

  methods: {
    onClose() {
      this.$emit('close')
    },
    // 重置提交 Loading
    resetSubmitLoading(val = false) {
      this.submitLoading = val || false
    },
    // hook: 打开前
    beforeOpen(form) {
      this.resetSubmitLoading()
    },
    // hook: 提交前
    async handleSubmit() {
      this.submitLoading = true
      if (this.fetchSubmit) {
        try {
          await this.fetchSubmit()
        } catch (e) {
          this.resetSubmitLoading()
          return
        }
      }
      this.$emit('submit')
    },
    // hook: 验证后
    afterValidate(valid) {
      // 验证不通过
      if (!valid) this.resetSubmitLoading()
    }
  }
})
</script>
