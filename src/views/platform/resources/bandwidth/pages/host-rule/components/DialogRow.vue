<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="限速规则"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 主机带宽优先级大于单个业务IP带宽<br >
      2. 带宽为0表示不限速
    </DmAlert>
    <el-form ref="Form" :model="form" :rules="formRules" label-position="right" label-width="100px">
      <el-form-item
        label="限速类型"
        prop="speed_limit_type"
      >
        <yd-form-radio v-model="form.speed_limit_type" :radios="bandwidthLabel.record_type" @change="handleChangeType" />
      </el-form-item>
      <el-form-item label="限速对象" prop="speed_limit_obj">
        <template v-if="form.speed_limit_type === CHILD_IP">
          <yd-form-select v-if="mode === 'Create'" :selects="selectHostIp" v-model="form.speed_limit_obj" multiple collapse-tags filterable />
          <yd-form-select v-else :selects="selectHostIp" v-model="form.speed_limit_obj" filterable />
        </template>
        <template v-else>
          <el-input v-model="form.speed_limit_obj" placeholder="限速对象" style="width: 280px" />
        </template>
      </el-form-item>
      <el-form-item label="限速大小" prop="speed_limit_size">
        <el-input v-model="form.speed_limit_size" placeholder="限速大小" style="width: 280px" >
          <template slot="append">Mbps</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <yd-form-radio v-model="form.status" :radios="bandwidthLabel.STATUS"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="备注" style="width: 280px" />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import bandwidthMixins from '@/views/platform/resources/bandwidth/mixins/bandwidth'

const CHILD_IP = 1
const MAIN_IP = 2

export default createDialog({
  mixins: [bandwidthMixins],

  data() {
    return {
      CHILD_IP,
      MAIN_IP,
      formDefault: {
        speed_limit_type: 1,
        speed_limit_obj: '',
        speed_limit_size: '',
        status: 1,
        remark: ''
      },
      formRules: {
        speed_limit_type: { required: true, message: '请填写' },
        speed_limit_size: { required: true, message: '请填写' },
        speed_limit_obj: { required: true, message: '请填写' }
      },
      selectHostIp: []
    }
  },

  methods: {
    handleChangeType(type) {
      let speed_limit_obj
      if (type === CHILD_IP) {
        this.fetchHostIP()
        if (this.mode === 'Create') {
          speed_limit_obj = []
        } else {
          speed_limit_obj = ''
        }
      } else {
        speed_limit_obj = this.$route.query.speed_limit_obj
      }

      this.form.speed_limit_obj = speed_limit_obj
    },

    beforeOpen(form) {
      this.mode = form.id ? 'Edit' : 'Create'
    },

    initOptions(form, options) {
      this.fetchHostIP()
    },

    async fetchHostIP() {
      const list = await this.InvokeAllApi.get('/fd/V4/bandwidth.const.list', {
        get_type: 'server_ip',
        parent_id: this.$route.params.id,
        parent_ip: this.$route.query.speed_limit_obj
      })
      this.selectHostIp = list.map(_ => {
        return {
          label: _,
          value: _
        }
      })
    },

    async fetchSubmit() {
      await this.validateForm()
      const form = {
        ...this.form,
        parent_id: this.$route.params.id
      }
      try {
        if (this.mode === 'Create') {
          const result = await this.InvokeAllApi.post('/fd/V4/bandwidthhost.operate.record', form)
          const { fail_count = 0, fail_list } = result
          if (fail_count) {
            this.$notify.warning('部分添加失败：' + fail_list.join(','))
          }
        } else {
          await this.InvokeAllApi.put('/fd/V4/bandwidthhost.operate.record', form)
        }
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
