<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :mode="mode"
      title-label="CDN-IP"
      width="600px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="IP"
          prop="ip"
          class="item-box"
        >
          <el-input
            v-model="form.ip"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="IP类型"
          prop="type"
          class="item-box"
        >
          <DmSelect
            v-model="form.type"
            :selects="option.type"
            clearable
            placeholder="IP类型"
            class="input-box-2"
          />
        </el-form-item>
        <el-form-item
          label="IP归属地"
          prop="location"
          class="item-box"
        >
          <el-input
            v-model="form.location"
            class="input-box"
          />
        </el-form-item>

      </el-form>
    </dm-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mode: 'Create',
      form: {
        ip: '',
        type: '',
        location: ''
      },
      rules: {
        ip: [{ required: true, message: ' ' }],
        type: [{ required: true, message: ' ' }],
        location: []
      },
      option: {
        type: [
          { label: '大陆节点', value: 'mainland' },
          { label: '海外节点', value: 'oversea' }
        ]
      }
    }
  },
  methods: {
    handleOpen(data, option = 'Create') {
      this.mode = option
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }

        if (option === 'Edit') {
          this.form = Object.assign({}, data)
        }
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.Fetch.post('/fd/V4/cdn.high.defense.ip.add', { ...this.form }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dialog.handleClose()
          }).catch(e => {
            this.$refs.dialog.afterValidate()
          })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
