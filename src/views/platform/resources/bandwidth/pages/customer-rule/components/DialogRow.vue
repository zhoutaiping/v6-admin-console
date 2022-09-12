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
      1. 客户业务维度相关限速优先级：<br >
      账号限速 > 套餐限速 > 域名限速 > 单URL限速 > 全局默认值<br >
      账号限速 > 分组限速 > 域名限速 > 单URL限速 > 全局默认值<br >
      2. 总带宽优先级大于具体类型带宽<br >
      3. 带宽为 0 表示不限速<br >
    </DmAlert>
    <el-form ref="Form" :model="form" :rules="formRules" label-position="right" label-width="100px">
      <el-form-item
        label="限速类型"
        prop="speed_limit_type"
      >
        <yd-form-select v-model="form.speed_limit_type" :selects="bandwidthLabel.speed_limit_type_user" @change="handleChangeType"/>
      </el-form-item>
      <el-form-item label="限速对象" prop="speed_limit_obj">
        <template v-if="form.speed_limit_type === 'PACKAGEID'">
          <yd-form-select v-model="form.speed_limit_obj" :selects="bandwidthSelectMeal" style="width: 280px" />
        </template>
        <template v-else-if="form.speed_limit_type === 'USERID'">
          <el-input v-if="mode === 'Edit'" v-model="form.speed_limit_obj_name" disabled="" style="width: 280px" />
          <el-input v-else v-model="form.speed_limit_obj" placeholder="限速对象" style="width: 280px" />
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

export default createDialog({
  mixins: [bandwidthMixins],

  data() {
    return {
      formDefault: {
        speed_limit_type: '',
        speed_limit_obj: '',
        speed_limit_size: '',
        status: 1,
        remark: ''
      },
      formRules: {
        speed_limit_type: { required: true, message: '请填写' },
        speed_limit_size: { required: true, message: '请填写' },
        speed_limit_obj: { required: true, message: '请填写' }
      }
    }
  },

  methods: {
    handleChangeType(type) {
      let speed_limit_obj = ''
      if (type === 'USERID') {
        speed_limit_obj = this.$route.query.speed_limit_obj
      } else if (type === 'PACKAGEID') {
        this.bandwidthFetchMeal()
      }

      this.form.speed_limit_obj = speed_limit_obj
    },

    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      await this.validateForm()
      const form = {
        ...this.form,
        parent_id: this.$route.params.id
      }
      try {
        if (this.mode === 'Create') {
          await this.InvokeAllApi.post('/fd/V4/bandwidthuser.operate.record', form)
        } else {
          await this.InvokeAllApi.put('/fd/V4/bandwidthuser.operate.record', form)
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
