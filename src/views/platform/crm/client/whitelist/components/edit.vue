<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :close-on-click-modal="false"
    title="用户白名单操作"
    width="600px"
    @submit="handleSubmit"
  >
    <el-form
      v-loading="loading"
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="100px"
    >
      <el-form-item
        label="白名单"
        prop="status"
      >
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"/>
        <span
          v-show="form.status === 1"
          style="margin-left:10px"
          class="color--primary"
        >启用</span>
        <span
          v-show="form.status === 0"
          style="margin-left:10px"
          class="color--waring"
        >禁用</span>
      </el-form-item>
      <template v-if="form.status === 1">
        <el-form-item label="白名单范围">
          <el-radio-group
            v-model="form.ip_type"
            @change="e =>{
              if(e === 'hand') {
                form.ip = default_ip
              } else {
                form.ip = ''
              }
            }"
          >
            <el-radio label="all">全局白名单</el-radio>
            <el-radio label="hand">手动输入白名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.ip_type === 'hand'"
          :prop="form.ip_type === 'hand'?'ip':[]"
          label="IP白名单"
        >
          <el-input
            v-model="form.ip"
            type="textarea"
            placeholder="请输入IP白名单，支持单IP、IP段、CIDR，多个请换行"
          />
        </el-form-item>
      </template>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      loading: true,
      rowData: {},
      rules: {
        ip: [{ required: true, message: '请输入' }],
        status: [{ required: true, message: '请选择' }]
      },
      default_ip: '',
      form: {
        plant_id: '',
        status: 1,
        ip_type: 'all',
        ip: ''
      }
    }
  },

  methods: {
    initOptions(form) {
      this.rowData = Object.assign({}, JSON.parse(JSON.stringify(form)))
      this.default_ip = Array.isArray(this.rowData.ip) ? this.rowData.ip.join('\n') : ''
      this.form = {
        plant_id: this.rowData.plant_id || '',
        status: Number(this.rowData.status),
        ip_type: this.rowData.ip_type ? this.rowData.ip_type : 'all',
        ip: this.default_ip || ''
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    async fetchSubmit() {
      await this.validateForm()
      const data = {
        plant_id: this.rowData.plant_id,
        status: this.form.status,
        ip_type: this.form.ip_type
      }

      if (this.form.ip_type === 'all') {
        data.ip = []
      } else {
        let ip = this.form.ip.trim()
        ip = (ip).split('\n')
        const lsit = []
        ip.forEach(_ => {
          if (_) {
            lsit.push(_)
          }
        })
        data.ip = lsit
      }
      try {
        await this.InvokeAllApi.post('/fd/V4/ip.white.save', data)
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
