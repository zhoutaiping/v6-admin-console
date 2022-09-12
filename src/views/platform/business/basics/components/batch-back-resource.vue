<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    :title="title"
    width="600px"
  >
    <div>
      <DmAlert>
        批量回源信息
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="回源原因" prop="reason">
          <el-select
            v-model="form.reason"
            filterable
            allow-create
            clearable
            default-first-option
            placeholder="回源原因"
            class="input-box"
          >
            <el-option
              v-for="item in reason"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
export default {
  props: {
    reason: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      open: false,
      form: {
        domain_ids: [],
        user_id: '',
        ip: '',
        reason: ''
      },
      title: '回源原因',
      API: {
        'domain-forward': '/V4/WebCdnProtection.Domain.batchBackResource'
      },
      rules: {
        ids: [],
        reason: [{ required: true, message: ' ' }]
      },
      check: [],
      type: ''
    }
  },
  methods: {
    handleOpen(data, option) {
      function setData(_data) {
        if (_data && Array.isArray(_data)) {
          return _data
        }
        return []
      }
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.check = setData(data)
        this.type = option
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
      })
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const params = {
            reason: this.form.reason
          }

          if (this.type === 'domain-forward') {
            params.domain_ids = this.check.map(e => { return e.id })
            params.user_id = this.$store.state.user.info.id
          }

          if (!this.type || !this.API[this.type]) {
            this.message.warning('操作失败！请联系管理员')
            return
          }
          this.Fetch.put(this.API[this.type], params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.Dialog.afterValidate()
            this.$refs.Dialog.handleClose()
            this.$emit('init')
          }).catch(e => {
            this.$refs.Dialog.afterValidate()
          })
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}
</script>
