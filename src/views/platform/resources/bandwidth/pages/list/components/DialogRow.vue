<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="600px"
    title-label="限速"
    @submit="handleSubmit"
  >
    <DmAlert style="margin-bottom: 10px;">
      限速对象限速维度为客户业务维度时限速对象为客户账号，限速维度为主机维度时请填写主机主IP
    </DmAlert>
    <el-form :model="form" label-width="100px" label-position="left">
      <el-form-item
        label="限速名称"
        prop="speed_limit_name"
      >
        <el-input v-model="form.speed_limit_name" placeholder="限速名称" style="width: 280px" />
      </el-form-item>
      <el-form-item
        label="限速维度"
        prop="speed_limit_type"
      >
        <yd-form-radio v-model="form.speed_limit_type" :radios="bandwidthLabel.SPEED_LIMIT_TYPE" />
      </el-form-item>
      <el-form-item
        label="限速对象"
        prop="speed_limit_obj"
      >
        <template v-if="form.speed_limit_type === bandwidthLabel.SPEED_LIMIT_TYPE_VAR.CUSTOMER">
          <template v-if="mode==='Edit'">
            <el-input v-model="form.email" style="width: 280px" disabled />
          </template>
          <template v-else>
            <InputMember v-model="form.speed_limit_obj"/>
          </template>
        </template>
        <template v-else>
          <InputHost v-model="form.speed_limit_obj"/>
        </template>
      </el-form-item>
      <el-form-item
        label="记录类型"
        prop="record_type"
      >
        <yd-form-radio v-model="form.record_type" :radios="bandwidthLabel.RECORD_TYPE"/>
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
import InputMember from './InputMember'
import InputHost from './InputHost'
import bandwidth from '@/views/platform/resources/bandwidth/mixins/bandwidth'

export default createDialog({
  mixins: [bandwidth],

  components: { InputMember, InputHost },

  data() {
    return {
      speedLimitList: [],
      formDefault: {
        speed_limit_name: '',
        speed_limit_type: 1,
        record_type: 1,
        status: 1,
        speed_limit_obj: '',
        remark: ''
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      const form = {
        ...this.form
      }
      try {
        if (this.mode === 'Create') {
          await this.InvokeAllApi.post('/fd/V4/bandwidth.operate.record', form)
        } else {
          await this.InvokeAllApi.put('/fd/V4/bandwidth.operate.record', form)
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
