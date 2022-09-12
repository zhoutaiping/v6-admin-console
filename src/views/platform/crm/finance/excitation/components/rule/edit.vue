<style lang="scss" scoped>
.input-box {
  width: 300px;
}
/deep/ .el-divider--horizontal {
  margin: 5px 0;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    :title="'管理激励规则'"
    width="700px"
    aside
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <DmCardPanel title="基本信息">
          <el-form-item
            label="规则类别"
            class="item-box"
            prop="name"
          >
            <el-input
              v-model="form.name"
              readonly
              class="input-box"
            />
          </el-form-item>
        </DmCardPanel>
        <DmCardPanel title="有效推广订单">
          <el-form-item
            label="关联建立后指定时间内下单"
            class="item-box"
            label-width="200px"
            prop="order_appoint_time_num"
          >
            <el-input-number
              v-model="form.order_appoint_time_num"
              :min="1"
              :precision="0"
              style="width:175px"
            />
            <DmSelect
              v-model="form.order_appoint_time_type"
              :selects="option.order_appoint_time_type"
              :clearable="false"
              placeholder="单位"
              style="width:120px"
            />
          </el-form-item>
          <el-form-item
            label="订单类别"
            class="item-box"
            prop="order_type"
            label-width="200px"
          >
            <DmSelect
              v-model="form.order_type"
              :selects="option.order_type"
              multiple
              placeholder=" "
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="同人风控等级小于等于"
            class="item-box"
            prop="risk_level"
            label-width="200px"
          >
            <DmSelect
              v-model="form.risk_level"
              :selects="option.risk_level"
              placeholder=" "
              class="input-box"
            />
          </el-form-item>
        </DmCardPanel>
        <DmCardPanel title="激励机制">
          <el-divider />
          <el-table :data="form.rules">
            <el-table-column label="激励方式">
              <template slot-scope="{ row }">
                <DmSelect
                  v-model="row.incentive_type"
                  :selects="option.incentive_type"
                  :clearable="false"
                  placeholder="单位"
                  style="width:180px"
                />
              </template>
            </el-table-column>
            <el-table-column label="激励对象">
              <template slot-scope="{ row }">
                <DmSelect
                  v-model="row.incentive_obj"
                  :selects="option.incentive_obj"
                  :clearable="false"
                  placeholder="单位"
                  style="width:180px"
                />
              </template>
            </el-table-column>
            <el-table-column label="佣金比例">
              <template slot-scope="{ row }">
                <el-input-number
                  v-model="row.commission_mode"
                  :min="1"
                  :precision="0"
                />
                <span v-show="row.incentive_type === 'commission'">
                  %
                </span>
              </template>
            </el-table-column>
          </el-table>
        </DmCardPanel>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import { ORDER_TYPE, RISK_LEVEL } from '../../utils'

export default {
  data() {
    return {
      form: {
        name: '',
        order_type: [],
        rules: [],
        order_appoint_time_num: 1,
        order_appoint_time_type: 'day',
        risk_level: ''
      },
      rules: {
        order_appoint_time_num: [{ required: true, message: ' ' }],
        order_type: [{ required: true, message: ' ' }],
        risk_level: [{ required: true, message: ' ' }],
        name: [{ required: true, message: ' ' }],
        order_appoint_time_type: [],
        rules: []
      },
      option: {
        order_type: ORDER_TYPE,
        risk_level: RISK_LEVEL,
        order_appoint_time_type: [{ label: '天', value: 'day' }, { label: '月', value: 'month' }, { label: '年', value: 'year' }],
        incentive_type: [
          { label: '佣金', value: 'commission' }
        ],
        incentive_obj: [{ label: '大使渠道', value: 'cbms' }, { label: '终端用户', value: 'termin' }]
      },
      rowData: {},
      mode: 'Create'
    }
  },

  methods: {

    handleOpen(data, option) {
      this.$nextTick(() => {
        this.mode = option
        this.rowData = Object.assign({}, data)
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.form = Object.assign({}, data)
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = ''
          const data = { ...this.form }
          if (this.mode === 'Create') {
            api = '/V4/cbms.incentive.manage.add'
          } else if (this.mode === 'Edit') {
            api = '/V4/cbms.incentive.manage.edit'
          }
          this.Fetch.post(api, data).then(res => {
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
