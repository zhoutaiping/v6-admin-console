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
    :fetch-submit="handleSave"
    :title="'重出订单'"
    aside
    class="el-dialog--DialogReorder"
  >
    <DmScroll>
      <DmAlert style="margin-bottom: 10px;">
        <i class="el-icon-info primar-color" />
        重出订单将作废原订单 {{ DialogReorder.rowData.id }}，并重新生成相应订单
      </DmAlert>
      <el-form :model="DialogReorder" label-position="left" size="mini" label-width="120px">
        <div class="detailInfo" >
          <h3> 概览信息 </h3>
          <el-divider class="m-10"/>
          <el-form-item label-width="0">
            <el-form-item label="用户邮箱" class="item-box">
              {{ DialogReorder.rowData.email }}
            </el-form-item>
            <el-form-item label="内部测试" class="item-box">
              {{ DialogReorder.rowData.test_user ==='1'? '是' :'不是' }}
            </el-form-item>
            <el-form-item label="所属销售" class="item-box">
              <el-select v-model="DialogReorder.sales" multiple collapse-tags placeholder="请选择" class="input-box">
                <el-option
                  v-for="item in DialogReorder.sale_user_ids"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="所属技术支持" class="item-box">
              <el-select v-model="DialogReorder.supports" multiple collapse-tags placeholder="请选择" class="input-box">
                <el-option
                  v-for="item in DialogReorder.support_user_ids"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-form-item>
          <h3> 配置详情 </h3><el-divider class="m-10"/>
          <el-form-item label-width="0">
            <el-form-item v-for="(_, _index) in DialogReorder.MealInfo" :key="_index" :label="_.title" label-width="140px" class="item-box">
              {{ _.value }} {{ _.unit }}
            </el-form-item>
          </el-form-item>
          <h3>支付详情</h3><el-divider class="m-10"/>
          <el-form-item label-width="0">
            <el-form-item label="支付方式" class="item-box">
              {{ PAYTYPE[DialogReorder.rowData.pay_type] }}
            </el-form-item>
            <el-form-item label="订单标价" class="item-box">
              {{ DialogReorder.rowData.total_price || 0 }} 元
            </el-form-item>
            <el-form-item label="默认优惠" class="item-box">
              {{ DialogReorder.rowData.diff_price_time || 0 }} 元
            </el-form-item>
            <el-form-item label="默认优惠" class="item-box">
              {{ DialogReorder.rowData.diff_price_act || 0 }} 元
            </el-form-item>
            <el-form-item label="优惠码优惠" class="item-box">
              {{ DialogReorder.rowData.diff_price_coupon || 0 }} 元
            </el-form-item>
            <el-form-item label="销售优惠" class="item-box">
              <el-input-number
                v-model="DialogReorder.rowData.diff_price_sale"
                controls-position="right"
                class="input-box input-number"
                @change="handleChangPrice"/>
            </el-form-item>
            <el-form-item label="应付金额" class="item-box">
              {{ DialogReorder.rowData.pay_price }} 元
            </el-form-item>
            <el-form-item label="实付金额" class="item-box">
              {{ DialogReorder.rowData.pay_off_price || 0 }} 元
            </el-form-item>
            <el-form-item label="备注信息" >
              <el-input v-model="DialogReorder.rowData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="重出订单备注信息" style="display: inline-block; width:400px"/>
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
      DialogReorder: new Form(FORM.FORM_EDIT, FORM.FORM_EDIT_RULE),
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
      },
      is_detail: false
    }
  },
  methods: {
    handleOpen(rowData) {
      this.$refs.dmdialog.handleOpen()
      this.DialogReorder.reset()
      this.DialogReorder.loading = true
      this.DialogReorder.order_code = rowData.order_code
      this.getDetail(rowData)
      const member_id = rowData.member_id
      this.getMemberList(member_id)
    },

    async getDetail(rowData) {
      await FinanceResource.getOrderDetail({ order_id: rowData.id }).then(response => {
        const data = response
        this.DialogReorder.rowData = data['data']
        this.DialogReorder.listMap.map_buy_type = data.map_buy_type
        this.DialogReorder.listMap.map_meal = data.map_meal
        this.DialogReorder.sales = FORM.arrNumToStr(data['data']['sale_user_ids'])
        this.DialogReorder.supports = FORM.arrNumToStr(data['data']['support_user_ids'])
        const order_type = []
        const order_status = []
        const map_order_type = data.map_order_type
        const map_order_status = data.map_order_status
        Object.keys(map_order_type).forEach(i => {
          order_type.push({
            text: map_order_type[i], value: i
          })
        })
        Object.keys(map_order_status).forEach(i => {
          order_status.push({
            text: map_order_status[i], value: i
          })
        })
        this.DialogReorder.listMap.map_order_status = order_status
        this.DialogReorder.listMap.map_order_type = order_type
        this.DialogReorder.listMap.map_product = data.map_product

        this.DialogReorder.listMap.members = data.members
        this.DialogReorder.rowData.email = data.members[data.data.member_id]['email']
        this.DialogReorder.rowData.test_user = data.members[data.data.member_id]['test_user']
        this.DialogReorder.MealInfo = this.getMeal(data['data']['detail']['meal'])
        setTimeout(() => { this.DialogReorder.loading = false }, 500)
      }).catch((e) => {
        this.DialogReorder.loading = false
      })
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
        salesList = response['memberList']['CRM_NORMAL_MARKET'] || []// 销售列表
        const pre_sales = response['memberList']['CPM_PRE_SALES'] || [] // 售前支持
        const after_sales = response['memberList']['CRM_AFTER_SALES'] || [] // 售后支持
        // 合并后技术支持
        skill_sales = FORM.arrMerge(pre_sales, after_sales)
        this.DialogReorder.sale_user_ids = salesList
        this.DialogReorder.support_user_ids = skill_sales
      })
    },
    handleChangPrice() {
      const params = {
        'order_code': this.DialogReorder.rowData.order_code,
        'sale_user_ids': this.DialogReorder.sales,
        'support_user_ids': this.DialogReorder.supports,
        'discount_sale_type': 'amount',
        'discount_sale_amount': this.DialogReorder.rowData.diff_price_sale
      }
      this.InvokeApi.post('fd/V4/order.recreateprice', params).then(res => {
        this.DialogReorder.rowData.pay_price = res.pay_price.toFixed(2) || 0
        this.DialogReorder.rowData.diff_price_sale = res.diff_price_sale.toFixed(2)
      })
    },

    async handleSave() {
      const params = {
        'order_id': this.DialogReorder.rowData.id,
        'sale_user_ids': this.DialogReorder.sales,
        'support_user_ids': this.DialogReorder.supports,
        'discount_sale_type': 'amount',
        'discount_sale_amount': this.DialogReorder.rowData.diff_price_sale,
        'remark': this.DialogReorder.rowData.remark
      }
      this.InvokeApi.post('fd/V4/order.recreateorder', params).then(res => {
        this.$emit('on-success')
        this.Message('ACTION_SUCCESS')
        this.$refs.dmdialog.handleClose()
      }).catch(() => {
        this.$refs.dmdialog.afterValidate()
      })
    }
  }
}
</script>
