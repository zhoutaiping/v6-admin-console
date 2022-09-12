<style lang="scss" scoped>
.form-input {
  width: 300px;
}
</style>
<template>
  <el-dialog
    :close-on-press-escape="true"
    :visible="open"
    title="流失确认"
    width="600px"
    @close="handleClose"
  >
    <div style="padding:5px;">
      <el-form
        v-loading="loading"
        ref="checkForm"
        :model="checkForm"
        :rules="rules"
        size="mini"
        label-width="120px"
        label-position="left"
      >
        <el-form-item
          v-if="Object.keys(basic_conf).length"
          label="主要流失原因"
          prop="reason_top"
        >
          <el-select
            v-model="checkForm.reason_top"
            clearable
            class="form-input"
            @change="changeReason"
          >
            <el-option
              v-for="(item, index) in Object.keys(basic_conf.lose_cause)"
              :key="index"
              :value="item"
              :label="basic_conf.lose_cause[item].desc"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="checkForm.reason_top"
          label=""
          prop="reason_second"
        >
          <el-select
            v-model="checkForm.reason_second"
            clearable
            class="form-input"
          >
            <el-option
              v-for="(item, index) in basic_conf.lose_cause[checkForm.reason_top].list"
              :key="index"
              :value="item.key"
              :label="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="Object.keys(basic_conf).length"
          label="次要流失原因"
          prop="reason_top_2"
        >
          <el-select
            v-model="checkForm.reason_top_2"
            clearable
            class="form-input"
            @change="e =>{checkForm.reason_second_2 = ''}"
          >
            <el-option
              v-for="(item, index) in Object.keys(basic_conf.lose_cause)"
              :key="index"
              :value="item"
              :label="basic_conf.lose_cause[item].desc"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="checkForm.reason_top_2"
          label=""
          prop="reason_second_2"
        >
          <el-select
            v-model="checkForm.reason_second_2"
            clearable
            class="form-input"
          >
            <el-option
              v-for="(item, index) in basic_conf.lose_cause[checkForm.reason_top_2].list"
              :key="index"
              :value="item.key"
              :label="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="流失时间"
          prop="loss_date"
        >
          <el-date-picker
            v-model="checkForm.loss_date"
            :default-value="new Date()"
            type="datetime"
            placeholder="创建开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="form-input"
          />
        </el-form-item>
        <el-form-item
          label="备注"
        >
          <el-input
            v-model="checkForm.remark"
            type="textarea"
            placeholder="流失原因备注"
            class="form-input"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="info"
        size="mini"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        size="mini"
        @click="handleSubmit('checkForm')"
      >保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      open: false,
      loading: false,
      rowData: {},
      checkForm: {
        reason_top: '',
        reason_second: '',
        reason_top_2: '',
        reason_second_2: '',
        loss_date: '',
        remark: ''
      },
      rules: {
        reason_top: [{ required: true, message: '请选择原因', trigger: ['change', 'blur'] }],
        reason_second: [{ required: true, message: '请选择原因', trigger: ['change', 'blur'] }],
        loss_date: [{ required: true, message: '请选择时间', trigger: ['change', 'blur'] }],
        remark: [{ required: true, message: '请输入备注', trigger: ['change', 'blur'] }],
        reason_top_2: [],
        reason_second_2: []
      },
      basic_conf: {}
    }
  },
  methods: {
    handleOpen(data, basic_conf) {
      this.loading = true
      this.basic_conf = Object.assign(basic_conf, {})
      this.$nextTick(() => {
        this.rowData = Object.assign({}, data)
        setTimeout(() => {
          this.resetForm('checkForm')
          this.checkForm.loss_date = data.member_status_date && data.member_status_date !== '0000-00-00 00:00:00' ? data.member_status_date : moment().format('YYYY-MM-DD HH:mm:ss')
        }, 100)

        this.open = true
        setTimeout(() => { this.loading = false }, 500)
      })
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    },
    changeReason() {
      this.checkForm.reason_second = ''
    },
    handleClose() {
      this.open = false
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            'member_id': this.rowData.member_id,
            'loss_remark': this.checkForm.remark,
            'reason_top': this.checkForm.reason_top,
            'reason_second': this.checkForm.reason_second,
            'reason_top_2': this.checkForm.reason_top_2,
            'reason_second_2': this.checkForm.reason_second_2,
            'loss_date': this.checkForm.loss_date,
            'member_status': 6
          }
          this.loading = true
          this.InvokeAllApi.post('/fd/V4/customer.manage.updatememberstatus', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('handleload')
            this.open = false
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
