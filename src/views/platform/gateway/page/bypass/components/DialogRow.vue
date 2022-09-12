<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    title-label="应用"
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
        label="应用名称"
        prop="app_name"
      >
        <el-input
          v-model="form.app_name"
          placeholder="应用名称"
        />
      </el-form-item>
      <el-form-item
        label="IP"
        prop="ips"
        class="item-box"
      >
        <el-input
          :rows="4"
          v-model="form.ips"
          type="textarea"
          placeholder="0.0.0.0"
        />
      </el-form-item>
      <el-form-item
        label="域名"
        prop="domain"
      >
        <el-input
          v-model="form.domain"
          placeholder="www.xxx.com"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remarks"
          placeholder="备注"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      mode: 'Create',
      form: {
        app_name: '',
        ips: '',
        domain: '',
        remarks: ''
      },
      rules: {
        app_name: {
          required: true,
          message: '请填写应用名称'
        }
      }
    }
  },
  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      const form = this.form
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      try {
        console.log(form.ips)
        const ips = form.ips ? form.ips.split('\n') : []

        if (this.mode === 'Create') {
          await this.FetchGateWay.post('/bypass/create', {
            ...form,
            ips
          })
        } else {
          await this.FetchGateWay.post('/bypass/update', {
            ...form,
            ips,
            app_id: form.id
          })
        }
      } catch (e) {
        throw new Error()
      }

      this.$refs.Dialog.handleClose()
      this.$emit('init')
    }
  }
})
</script>
