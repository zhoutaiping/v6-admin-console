<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    :title="title[type]"
    width="600px"
  >
    <div>
      <DmAlert>
        <div style="display:flex;">
          <div style="width:100px;">
            域名
          </div>
          <div style="flex:1;">
            <el-tag
              v-for="item in check"
              :key="item.id"
              style="margin:2px;"
            >
              {{ item.domain }}
            </el-tag>
          </div>
        </div>
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          v-if="type === 'fail'"
          label="回源原因"
          prop="back_source_reason"
        >
          <el-select
            v-model="form.back_source_reason"
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
        back_source_reason: ''
      },
      title: {
        'ok': '审核通过',
        'fail': '审核不通过'
      },
      rules: {
        ids: [],
        back_source_reason: [{ required: true, message: ' ' }]
      },
      check: [],
      type: ''
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.check = data
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
            domain_ids: this.check.map(e => { return e.id }),
            user_id: this.$store.state.user.info.id,
            do: this.type
          }
          if (this.type === 'fail') {
            params.back_source_reason = this.form.back_source_reason
          }

          this.Fetch.post('/V4/WebCdnProtection.Domain.batchHandAudit', params).then(res => {
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
