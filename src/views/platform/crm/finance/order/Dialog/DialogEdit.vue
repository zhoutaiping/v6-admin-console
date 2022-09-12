<style lang="scss" scoped>
  .input-box {
    width: 175px;
  }
  .item-box-1 {
    margin-bottom: 0px;
  }
  .item-box {
    display: inline-block;
    width: 45%;
    margin-bottom: 5px;
  }
  .m-10 {
    margin: 10px 0;
  }
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSaveEdit"
    :title="DialogEdit.title"
    aside
    width="750px"
    class="el-dialog--DialogEdit"
  >
    <DmScroll>
      <el-form :model="DialogEdit" label-position="left" label-width="140px" size="mini">
        <div class="detailInfo" >
          <h3> 概览信息</h3>
          <el-divider class="m-10"/>
          <el-form-item label-width="0">
            <el-form-item label="订单ID" class="item-box">
              {{ DialogEdit.rowData.id }}
            </el-form-item>
            <el-form-item label="订单类型" class="item-box">
              {{ DialogEdit.listMap.map_buy_type[DialogEdit.rowData.buy_type] }}
            </el-form-item>
            <el-form-item label="订单状态" class="item-box">
              <el-select v-model="DialogEdit.rowData.status" disabled placeholder="请选择" class="input-box">
                <el-option
                  v-for="(item, index) in DialogEdit.listMap.map_order_status"
                  :key="index"
                  :label="item.text"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="订单目的" class="item-box">
              {{ ORDER_TYPE[DialogEdit.rowData.order_type] }}
            </el-form-item>
            <el-form-item label="所属销售" class="item-box">
              <el-select v-model="DialogEdit.sales" multiple collapse-tags placeholder="请选择" class="input-box">
                <el-option
                  v-for="item in DialogEdit.sale_user_ids"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="所属技术支持" class="item-box">
              <el-select v-model="DialogEdit.supports" multiple collapse-tags placeholder="请选择" class="input-box">
                <el-option
                  v-for="item in DialogEdit.support_user_ids"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="用户邮箱" class="item-box">
              {{ DialogEdit.rowData.email }}
            </el-form-item>
            <el-form-item label="内部测试" class="item-box">
              {{ DialogEdit.rowData.test_user ==='1'? '是' :'不是' }}
            </el-form-item>
            <el-form-item label="创建时间" class="item-box">
              {{ DialogEdit.rowData.created_at }}
            </el-form-item>
            <el-form-item label="支付时间" class="item-box">
              {{ DialogEdit.rowData.pay_time }}
            </el-form-item>
          </el-form-item>
          <h3>套餐详情</h3><el-divider class="m-10"/>
          <el-form-item label-width="0">
            <el-form-item v-for="(_, _index) in DialogEdit.MealInfo" :key="_index" :label="_.title" label-width="140px" class="item-box">
              {{ _.value }} {{ _.unit }}
            </el-form-item>
          </el-form-item>
          <h3>支付详情</h3><el-divider class="m-10"/>
          <el-form-item label-width="0">
            <el-form-item label="支付方式" class="item-box">
              {{ PAYTYPE[DialogEdit.rowData.pay_type] }}
            </el-form-item>
            <el-form-item label="订单标价" class="item-box">
              {{ Number(DialogEdit.rowData.buy_type) === 3? Number(DialogEdit.rowData.total_price) *(-1):DialogEdit.rowData.total_price || 0 }} 元
            </el-form-item>
            <el-form-item label="默认优惠" class="item-box">
              {{ DialogEdit.rowData.diff_price_time || 0 }} 元
            </el-form-item>
            <el-form-item label="产品折扣" class="item-box">
              {{ DialogEdit.rowData.diff_price_act || 0 }} 元
            </el-form-item>
            <el-form-item label="优惠码优惠" class="item-box">
              {{ DialogEdit.rowData.diff_price_coupon || 0 }} 元
            </el-form-item>
            <el-form-item label="销售优惠" class="item-box">
              <el-input-number v-model="DialogEdit.rowData.diff_price_sale" class="input-number input-box" controls-position="right" @change="handleChangPrice"/>
            </el-form-item>
            <el-form-item label="应付金额" class="item-box">
              {{ DialogEdit.rowData.pay_price || 0 }} 元
            </el-form-item>
            <el-form-item label="实付金额" class="item-box">
              {{ DialogEdit.rowData.pay_off_price || 0 }} 元
            </el-form-item>
            <el-form-item label="销售业绩比例" class="item-box">
              <el-input-number v-model="DialogEdit.rowData.sales_performance" :precision="2" :step="0.1" :max="1" class="input-number input-box" controls-position="right"/>
            </el-form-item>
            <el-form-item label="销售部分提成比例" class="item-box">
              <el-input-number v-model="DialogEdit.rowData.sales_commission" :precision="2" :step="0.1" :max="1" class="input-number input-box" controls-position="right"/>
            </el-form-item>
            <el-form-item label="公司业绩比例" class="item-box">
              <el-input-number v-model="DialogEdit.rowData.company_performance" :precision="2" :step="0.1" :max="1" class="input-number input-box" controls-position="right"/>
            </el-form-item>
            <el-form-item label="公司部分提成比例" class="item-box">
              <el-input-number v-model="DialogEdit.rowData.company_commission" :precision="2" :step="0.1" :max="1" class="input-number input-box" controls-position="right"/>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="DialogEdit.rowData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="订单备注信息" style="display: inline-block; width:400px"/>
            </el-form-item>
          </el-form-item>
        </div>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import FinanceResource from '@/api/finance/financeApi'
import Form from '@/utils/form'
import * as FORM from './dialogForm'
export default {
  data() {
    return {
      DialogEdit: new Form(FORM.FORM_EDIT, FORM.FORM_EDIT_RULE),
      ORDER_TYPE: {
        'normal': '正式开通',
        'user_test': '测试开通',
        'user_refund': '试用开通'
      },
      order_type_index: {
        0: 'normal',
        1: 'user_refund',
        2: 'user_test'
      },
      PAYTYPE: {
        0: '默认', 1: '现金', 2: '银行转账 ', 3: '余额', 4: '微信', 5: '支付宝', 6: '欠款支付'
      }
    }
  },
  methods: {
    handleOpen(rowData) {
      this.$refs.dmdialog.handleOpen()
      this.DialogEdit.reset()
      this.DialogEdit.loading = true
      this.DialogEdit.order_code = rowData.order_code
      this.getDetail(rowData)
      const member_id = rowData.member_id
      this.getMemberList(member_id)
    },

    async getDetail(rowData) {
      const params = { order_id: rowData.id }
      await FinanceResource.getOrderDetail(params).then(response => {
        const data = response
        // this.template = data.detail.template.template || {}
        this.DialogEdit.rowData = data['data']
        this.DialogEdit.listMap.map_buy_type = data.map_buy_type
        this.DialogEdit.listMap.map_meal = data.map_meal
        this.DialogEdit.sales = FORM.arrNumToStr(data['data']['sale_user_ids'])
        this.DialogEdit.supports = FORM.arrNumToStr(data['data']['support_user_ids'])
        const order_type = []
        const order_status = []
        const map_order_type = data.map_order_type
        const map_order_status = data.map_order_status
        for (var i in map_order_type) {
          order_type.push({
            text: map_order_type[i], value: i
          })
        }
        for (var op in map_order_status) {
          order_status.push({
            text: map_order_status[op], value: op
          })
        }
        this.DialogEdit.listMap.map_order_status = order_status
        this.DialogEdit.listMap.map_order_type = order_type
        this.DialogEdit.listMap.map_product = data.map_product
        this.DialogEdit.listMap.members = data.members
        this.DialogEdit.rowData.email = data.members[data.data.member_id]['email']
        this.DialogEdit.rowData.test_user = data.members[data.data.member_id]['test_user']
        this.DialogEdit.MealInfo = this.getMeal(data['data']['detail']['meal'])
      }).catch((e) => {})
      setTimeout(() => { this.DialogEdit.loading = false }, 500)
    },
    // 获取套餐详情
    getMeal(detail) {
      const filter = ['meal_price', 'kuorong', 'zengzi', 'backstage_show', 'default_fields']
      const info = [
        { title: '产品名称', value: detail.product_name, unit: '' },
        { title: '套餐名称', value: detail.meal_name, unit: '' }
      ]
      Object.keys(detail).forEach(item => {
        if (filter.indexOf(item) < 0 && typeof detail[item] === 'object' && !!detail[item]) {
          if (detail[item].title && detail[item].value) {
            info.push({
              title: detail[item].title,
              value: detail[item].value,
              unit: detail[item].unit
            })
          }
        }
      })
      return info
    },

    async getMemberList(member_id) {
      const params = {
        member_id: member_id,
        status: 2
      }
      let salesList = []
      let skill_sales
      await FinanceResource.getMemberList(params).then(response => {
        salesList = response['memberList']['CRM_NORMAL_MARKET'] || [] // 销售列表
        const pre_sales = response['memberList']['CPM_PRE_SALES'] || [] // 售前支持
        const after_sales = response['memberList']['CRM_AFTER_SALES'] || [] // 售后支持
        // 合并后技术支持
        skill_sales = FORM.arrMerge(pre_sales, after_sales)
        this.DialogEdit.sale_user_ids = salesList
        this.DialogEdit.support_user_ids = skill_sales
      })
    },

    handleChangPrice() {
      const params = {
        'order_code': this.DialogEdit.rowData.order_code,
        'sale_user_ids': this.DialogEdit.sales,
        'support_user_ids': this.DialogEdit.supports,
        'discount_sale_type': 'amount',
        'discount_sale_amount': this.DialogEdit.rowData.diff_price_sale
      }

      FinanceResource.EditPrice(params).then(res => {
        this.DialogEdit.rowData.pay_price = res.pay_price.toFixed(2)
        this.DialogEdit.rowData.diff_price_sale = res.diff_price_sale.toFixed(2)
      }).catch(e => { })
    },

    async handleSaveEdit() {
      const params = {
        'order_code': this.DialogEdit.rowData.order_code,
        'sale_user_ids': this.DialogEdit.sales,
        'support_user_ids': this.DialogEdit.supports,
        'discount_sale_type': 'amount',
        'discount_sale_amount': this.DialogEdit.rowData.diff_price_sale,
        'sales_performance': this.DialogEdit.rowData.sales_performance,
        'sales_commission': this.DialogEdit.rowData.sales_commission,
        'company_performance': this.DialogEdit.rowData.company_performance,
        'company_commission': this.DialogEdit.rowData.company_commission,
        'remark': this.DialogEdit.rowData.remark
      }
      await FinanceResource.SaveEdit(params).then(response => {
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.$emit('handleload')
        this.$refs.dmdialog.handleClose()
      }).catch(e => {
        this.Message('ACTION_ERROR')
        this.$refs.dmdialog.afterValidate()
      })
    }
  }
}
</script>
