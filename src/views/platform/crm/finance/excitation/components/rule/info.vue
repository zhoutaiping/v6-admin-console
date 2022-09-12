<template>
  <DmDialog
    ref="dmdialog"
    :title="'详情'"
    :footer="false"
    width="700px"
    aside
  >
    <el-form
      ref="Form"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <DmCardPanel title="基本信息">
        <el-form-item
          label="规则类别"
          class="item-box"
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
  </DmDialog>
</template>

<script>
import { ORDER_TYPE, RISK_LEVEL } from '../../utils'
export default {
  data() {
    return {
      loading: false,
      form: {
        name: '',
        order_type: [],
        rules: [],
        order_appoint_time_num: 1,
        order_appoint_time_type: 'day',
        risk_level: ''
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
      rowData: {}
    }
  },
  methods: {
    handleOpen(data, option) {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.form = Object.assign({}, data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-divider--horizontal {
  margin: 5px 0;
}
.item-box {
  margin-bottom: 5px;
}
</style>
