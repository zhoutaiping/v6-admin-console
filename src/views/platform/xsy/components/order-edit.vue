<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
.input-box {
  width: 300px;
}
</style>
<template>
  <div>
    <DmDialog
      ref="Dialog"
      :fetch-submit="fetchSubmit"
      title="编辑"
      width="600px"
      @submit="handleSubmit"
    >
      <DmAlert>
        CRM订单关联销售易系统商机，请谨慎操作！
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="formRules" label-position="right" label-width="100px">
        <el-form-item label="订单ID" class="item-box ">
          {{ rowData.order_id }}
        </el-form-item>
        <el-form-item label="用户邮箱" class="item-box ">
          {{ rowData.email }}
        </el-form-item>
        <el-form-item label="产品名称" class="item-box ">
          {{ rowData.mealText }}
        </el-form-item>
        <el-form-item label="订单类型" class="item-box ">
          {{ buy_type[rowData.buy_type] }}
        </el-form-item>
        <el-form-item label="应付金额" class="item-box ">
          {{ rowData.pay_price }}
        </el-form-item>
        <el-form-item label="客户名称" prop="xsy_customer_id">
          <el-select v-model="form.xsy_customer_id" disabled placeholder="" class="input-box " >
            <el-option v-for="(_, _index) in customersMap" :key="_index" :value="_.value" :label="_.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商机名称" prop="xsy_opportunity_id">
          <el-select v-model="form.xsy_opportunity_id" placeholder="" class="input-box ">
            <el-option v-for="(_, _index) in opportunitysMap" :key="_index" :value="_.value" :label="_.label"/>
          </el-select>
        </el-form-item>
      </el-form>
    </DmDialog>
  </div>
</template>
<script>
import createDialog from '@/utils/createDialog'
import { mapArr } from '@/utils/util'
export default createDialog({
  data() {
    return {
      rowData: {},
      default: {
        order_ids: [],
        order_match_opportunity: 2, // 云平台订单是否匹配商机 1-匹配 2-未匹配
        xsy_customer_id: '',
        xsy_opportunity_id: ''
      },
      form: {},
      formRules: {
        order_match_opportunity: { required: true, message: '请填写' },
        xsy_customer_id: { required: true, message: '请填写' },
        xsy_opportunity_id: { required: true, message: '请填写' }
      },
      customersMap: [],
      opportunitysMap: [],
      buy_type: [
        '购买', '升级', '续费', '降级', '扩容', '增值', '退订', '更改配置',
        '变更计费规则', '套餐配置修改', '试用延期', '试用转正', '试用开通', '启用付费版', '停用付费版'
      ],
      options: {
        order_confirm_status: [
          { label: '未确认', value: 1 },
          { label: '确认通过', value: 2 },
          { label: '确认不通过', value: 3 }
        ]
      }
    }
  },
  computed: {
    order_match_opportunity() {
      if (this.form && (Number(this.form.xsy_customer_id) === 0 || Number(this.form.xsy_opportunity_id) === 0)) {
        return 2
      } else {
        return 1
      }
    }
  },
  methods: {
    handleOpen(data, mealText) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.rowData = Object.assign({}, JSON.parse(JSON.stringify(data)))
        this.rowData.mealText = mealText
        this.form = Object.assign({}, this.default)
        this.form.order_ids = [Number(data.order_id)]
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (data.member_id) {
          this.getOpportunity(data.member_id)
        }
        this.form.xsy_customer_id = data.xsy_customer_id
        this.form.xsy_opportunity_id = data.xsy_opportunity_id
      })
    },

    async getOpportunity(member_id) {
      this.customersMap = [{ label: '未匹配', value: 0 }]
      this.opportunitysMap = [{ label: '未匹配', value: 0 }]
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
        this.customersMap = [{ label: '未匹配', value: 0 }]
        this.opportunitysMap = [{ label: '未匹配', value: 0 }]
      } else {
        if (data.customersMap && data.customersMap !== [] && Object.keys(data.customersMap).length) {
          this.customersMap = mapArr(data.customersMap, { label: '未匹配', value: 0 })
        } else {
          this.customersMap = [{ label: '未匹配', value: 0 }]
        }
        if (data.opportunitysMap && data.opportunitysMap !== [] && Object.keys(data.opportunitysMap).length) {
          this.opportunitysMap = mapArr(data.opportunitysMap, { label: '未匹配', value: 0 })
        } else {
          this.opportunitysMap = [{ label: '未匹配', value: 0 }]
        }
      }
    },

    async fetchSubmit() {
      await this.validateForm()
      this.form.order_match_opportunity = this.order_match_opportunity
      const form = {
        ...this.form
      }
      try {
        await this.InvokeAllApi.post('/V4/xsy.order.update.sale', form)
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
