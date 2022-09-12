<style lang="postcss" scoped>
.el-dialog--DialogConfirm {
  .detail-from {
    margin: 5px;
  }
  .detail-from-item2 {
    margin-bottom: 5px;
  }
  .detail-from-input {
    width: 350px;
  }
  .color-1 {
    color: $--color-primary;
  }
  .color-2 {
    color: red;
  }
}
</style>
<template>
  <FDialog
    :close-on-click-modal="true"
    :title="DialogConfirm.title"
    :visible.sync="DialogConfirm.visible"
    class="el-dialog--DialogConfirm"
    width="600px"
  >
    <DmScroll>
      <DmAlert style="margin-bottom: 10px;">
        <i class="el-icon-info primar-color" /> 订单确认后将会进行应收账单拆分，请谨慎操作<br>
        <i class="el-icon-info primar-color" /> 若未匹配CRM信息，将无法同步至销售易CRM中进行业绩统计，请联系销售运营处理
      </DmAlert>
      <el-form
        v-loading="DialogConfirm.loading"
        ref="dialogConfirm"
        :model="DialogConfirm"
        :rules="rules"
        label-position="left"
        label-width="130px"
        class="detail-from"
      >
        <template v-if="false">
          <el-form-item label="业绩不计提成" prop="is_no_commission" >
            <el-select v-model="DialogConfirm.is_no_commission" clearable class="detail-from-input" >
              <ElOption v-for="(item, index) in IS_NO_COMMISSION" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否战略用户" prop="is_strategic_coustomer" >
            <el-select v-model="DialogConfirm.is_strategic_coustomer" clearable class="detail-from-input" >
              <ElOption v-for="(item, index) in IS_STRATEGIC_COUSTOMER" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="订单ID" class="detail-from-item2  ">
          {{ DialogConfirm.rowData.id }}
        </el-form-item>
        <el-form-item label="用户邮箱" class="detail-from-item2  ">
          {{ DialogConfirm.rowData.member_email }}
        </el-form-item>
        <el-form-item label="产品名称" class="detail-from-item2  ">
          {{ meal }}
        </el-form-item>
        <el-form-item label="订单类型" class="detail-from-item2  ">
          {{ buy_type[DialogConfirm.rowData.buy_type] }}
        </el-form-item>
        <el-form-item label="应付金额" class="detail-from-item2  ">
          {{ DialogConfirm.rowData.pay_price }}
        </el-form-item>
        <!-- <el-form-item label="CRM客户名称" prop="xsy_customer_id">
          <el-select v-model="DialogConfirm.xsy_customer_id" disabled placeholder="" class="detail-from-input " >
            <el-option v-for="(_, _index) in customersMap" :key="_index" :value="_.value" :label="_.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="CRM商机名称" prop="xsy_opportunity_id">
          <el-select v-model="DialogConfirm.xsy_opportunity_id" placeholder="" class="detail-from-input " >
            <el-option v-for="(_, _index) in opportunitysMap" :key="_index" :value="_.value" :label="_.label"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注" class="detail-from-item2" >
          <el-input
            v-model="DialogConfirm.remark"
            :autosize="{ minRows: 2}"
            class="detail-from-input"
            type="textarea"
            placeholder="备注~"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
    <div slot="footer" class="dialog-footer" >
      <el-button type="info" @click="handleClose" >取 消</el-button>
      <el-button type="primary" @click="handleSubmint" >确 定</el-button>
    </div>
  </FDialog>
</template>

<script>
import * as FORM from './dialogForm'
import { mapArr } from '@/utils/util'
export default {
  data() {
    const NOT_3 = (rule, value, callback) => {
      if (Number(value) === 3 || value === '') {
        callback(new Error('请选择是否战略客户类型'))
      } else {
        callback()
      }
    }
    return {
      DialogConfirm: FORM.DialogConfirm,
      IS_NO_COMMISSION: [
        { label: '是', value: '1' }, { label: '否', value: '2' }, { label: '未选择', value: '3' }
      ],
      IS_STRATEGIC_COUSTOMER: [
        { label: '是', value: '1' }, { label: '否', value: '2' }, { label: '未选择', value: '3' }
      ],
      IS_FIND_IS_NO_COMMISSION: false,
      IS_FIND_IS_STRATEGIC_COUSTOMER: false,
      IS_CONTRACT: [
        { label: '是', value: '1' }, { label: '否', value: '0' }
      ],
      IS_INVOICE: [
        { label: '是', value: '1' }, { label: '否', value: '0' }
      ],
      rules: {
        contract_code: [{ required: true, message: '请输入合同编号' }],
        contract_time: [{ required: true, message: '请选择合同时间' }],
        is_no_commission: [{ required: true, message: '请选择业绩不计提成类型' }],
        is_strategic_coustomer: [{ required: true, validator: NOT_3 }],
        remark: [{ required: true, message: '请填写备注' }],
        xsy_customer_id: { required: true, message: '请选择' },
        xsy_opportunity_id: { required: true, message: '请选择' }
      },
      customersMap: [],
      opportunitysMap: [],
      buy_type: [
        '购买', '升级', '续费', '降级', '扩容', '增值', '退订', '更改配置',
        '变更计费规则', '套餐配置修改', '试用延期', '试用转正', '试用开通', '启用付费版', '停用付费版'
      ],
      meal: ''
    }
  },
  computed: {
    order_match_opportunity() {
      if (this.DialogConfirm && (Number(this.DialogConfirm.xsy_customer_id) === 0 || Number(this.DialogConfirm.xsy_opportunity_id) === 0)) {
        return 2
      } else {
        return 1
      }
    }
  },
  methods: {
    handleOpen(data, meal = '') {
      const that = this
      this.$nextTick(async() => {
        this.DialogConfirm = FORM.DialogConfirm
        this.DialogConfirm.visible = true
        this.DialogConfirm.loading = true
        this.meal = meal
        this.DialogConfirm.rowData = data
        if (data.member_id) {
          await Promise.all([
            this.getMemberInvoice({ 'member_id': data.member_id }),
            this.getOpportunity(data.member_id)
          ])
        }
        setTimeout(function() {
          that.DialogConfirm.loading = false
        }, 1000)
      })
    },
    async getOpportunity(member_id) {
      this.customersMap = []
      this.opportunitysMap = []
      this.DialogConfirm.xsy_customer_id = ''
      this.DialogConfirm.xsy_opportunity_id = ''
      try {
        const data = await this.Fetch.get('/V4/xsy.member.customer.opportunity', { member_ids: [member_id] })
        this.initMap(data)
      } catch (error) {
        this.initMap(null)
        return
      }
    },
    initMap(data = null) {
      if (!data) {
        this.customersMap = []
        this.opportunitysMap = []
      } else {
        if (data.customersMap && data.customersMap !== [] && Object.keys(data.customersMap).length) {
          this.customersMap = mapArr(data.customersMap)
          this.DialogConfirm.xsy_customer_id = this.customersMap[0].value
        } else {
          this.customersMap = []
        }
        if (data.opportunitysMap && data.opportunitysMap !== [] && Object.keys(data.opportunitysMap).length) {
          this.opportunitysMap = mapArr(data.opportunitysMap)
        } else {
          this.opportunitysMap = []
        }
      }
    },
    getMemberInvoice(params) {
      this.InvokeAllApi.post('/fd/V4/order.member.invoice', params).then(res => {
        this.DialogConfirm.invoice_info = res.info || {}
        this.IS_FIND_IS_NO_COMMISSION = Number(res.basicInfo.is_no_commission) !== 3
        this.IS_FIND_IS_STRATEGIC_COUSTOMER = Number(res.basicInfo.is_strategic_coustomer) !== 3
        this.DialogConfirm.is_no_commission = res.basicInfo.is_no_commission || ''
        this.DialogConfirm.is_strategic_coustomer = res.basicInfo.is_strategic_coustomer || ''
      }).catch(e => {
      })
    },
    changeContract(val) {
      if (val === '0') {
        this.DialogConfirm.contract_code = ''
        this.DialogConfirm.contract_time = ''
      }
    },
    handleClose() {
      this.DialogConfirm.visible = false
      this.$refs.dialogConfirm && this.$refs.dialogConfirm.resetFields()
    },
    async confim() {
      const data = {
        'order_id': this.DialogConfirm.rowData.id,
        'member_id': this.DialogConfirm.rowData.member_id,
        'contract_order': this.DialogConfirm.contract_order,
        'contract_code': this.DialogConfirm.contract_code,
        'contract_start_time': this.DialogConfirm.contract_time[0] || '',
        'contract_end_time': this.DialogConfirm.contract_time[1] || '',
        'invoice': this.DialogConfirm.invoice,
        'is_no_commission': this.DialogConfirm.is_no_commission,
        'is_strategic_coustomer': this.DialogConfirm.is_strategic_coustomer,
        'remark': this.DialogConfirm.remark
      }
      try {
        await this.InvokeAllApi.post('/fd/V4/order.confirm', data)
      } catch (error) {
        return
      }
    },

    async xsyUpdata() {
      const form = {
        order_ids: [this.DialogConfirm.rowData.id],
        xsy_customer_id: this.DialogConfirm.xsy_customer_id,
        xsy_opportunity_id: this.DialogConfirm.xsy_opportunity_id,
        order_match_opportunity: this.order_match_opportunity
      }
      try {
        await this.InvokeAllApi.post('/V4/xsy.order.update', form)
      } catch (error) {
        return
      }
    },
    handleSubmint() {
      this.$refs.dialogConfirm.validate(async(valid) => {
        if (valid) {
          try {
            await Promise.all([
              await this.confim()
              //  await this.xsyUpdata()
            ])
            this.Message('ACTION_SUCCESS')
            this.$emit('on-success')
            this.handleClose()
          } catch (error) {
            return
          }
        }
      })
    }
  }
}
</script>
