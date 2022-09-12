<template>
  <DmDialog ref="Dialog" :fetch-submit="handleRenew" title="套餐续费" aside >
    <DmScroll>
      <el-form
        v-loading="MealRenewDialog.loading"
        ref="formRenewalfee"
        :rules="MealRenewDialog.$rules"
        size="mini"
        label-position="left"
        label-width="100px"
      >
        <CardInfo :data="Meal_INFO" title="基本信息" />
        <CardLayout title="续费操作">
          <div slot="layout">
            <el-form-item
              label="订单目的"
              class="renewForm-item"
              prop="order_type"
            >
              <DmSelect
                v-model="MealRenewDialog.order_type"
                :selects="order_type"
                disabled
                placeholder="订单目的"
                class="renewForm-input"
                @change="changOderType"
              />
            </el-form-item>
            <el-form-item
              label="续费时长"
              class="renewForm-item"
            >
              <el-input
                ref="buy_time"
                v-model="MealRenewDialog.buy_time"
                placeholder=""
                class="renewForm-input"
                @change="changeTime"
              >
                <el-select
                  slot="append"
                  v-model="MealRenewDialog.time_unit"
                  style="width:100px;"
                  @change="changeTime"
                >
                  <el-option
                    v-for="item in timetype"
                    :key="item.checked"
                    :disabled="item.status == '1' ? false :true"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="expire_time_2"
              label="续费到期时间"
            > {{ expire_time_2 }} </el-form-item>
          </div>
        </CardLayout>
        <CardLayout title="订单金额">
          <div slot="layout">
            <el-form-item
              label="订单标价"
              class="renewForm-item"
            >
              {{ MealRenewDialog.total_price || 0 }} 元
            </el-form-item>
            <el-form-item
              label="默认优惠"
              class="renewForm-item"
            >
              {{ MealRenewDialog.diff_price_time || 0 }} 元
            </el-form-item>
            <el-form-item
              label="销售优惠"
              class="renewForm-item"
            >
              <a-input
                v-model="MealRenewDialog.sales_amount"
                :disabled="MealRenewDialog.order_type === 'user_refund'"
                placeholder=""
                class="renewForm-input"
                @change="getRenewPrice()"
              >
                <DmSelect
                  slot="addonBefore"
                  :selects="sale_type"
                  v-model="MealRenewDialog.discount_sale_type"
                  :disabled="MealRenewDialog.order_type === 'user_refund'"
                  :clearable="false"
                  style="width: 100px;"
                  @change="e =>{
                    if (e === 'rate') {
                      MealRenewDialog.sales_amount = 1
                    } else {
                      MealRenewDialog.sales_amount = 0
                    }
                    getRenewPrice()
                  }"
                />
              </a-input>
              <span
                v-if="MealRenewDialog.discount_sale_amount > 0"
                style="margin-left:20px; width: 150px; color:green"
              >
                (优惠金额：{{ MealRenewDialog.discount_sale_amount }} 元,折扣：{{ rate }})
              </span>
            </el-form-item>
            <el-form-item
              label="应付金额"
              class="renewForm-item"
            >
              <a-input-number
                v-model="MealRenewDialog.pay_price"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                class="renewForm-input"
                @change="changePayPrice"
              />
              元
            </el-form-item>
          </div>
        </CardLayout>
        <CardLayout title="支付相关">
          <div slot="layout">
            <el-form-item
              label="支付方式"
              class="renewForm-item"
              prop="pay_type"
            >
              <el-radio
                v-model="MealRenewDialog.pay_type"
                label="6"
              >欠款支付</el-radio>
            </el-form-item>
            <el-form-item
              label="订单备注"
              class="renewForm-item"
            >
              <el-input
                v-model="MealRenewDialog.remark"
                type="textarea"
                placeholder="请输入备注"
                class="renewForm-input"
              />
            </el-form-item>
          </div>
        </CardLayout>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import MealResource from '@/api/mealApi'
import Form from '@/utils/form'
import * as FORM from './dialogForm'
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      MealRenewDialog: new Form(FORM.FORM_RENEWALFEE, FORM.FORM_RENEWALFEE_RULE),
      is_pay_type_status3: false,
      is_pay_type_status6: false,
      rate: 1,
      timetype: [
        { text: '日', value: 'd', status: 1 }, { text: '月', value: 'm', status: 1 }, { text: '年', value: 'y', status: 1 }
      ],
      order_type: defaultSetting.order_type,
      sale_type: defaultSetting.sale_type,
      meal_config: [],
      MealInfo: [],
      expire_time: '',
      expire_time_2: '',
      useCoupon: false,
      Meal_INFO: []
    }
  },
  methods: {
    handleOpen(data) {
      this.MealRenewDialog.reset()
      this.$refs.Dialog.handleOpen()
      this.MealRenewDialog.loading = true
      this.MealInfo = []
      this.meal_config = []
      this.getExcTime = ''
      this.expire_time_2 = ''
      this.timetype = [
        { text: '日', value: 'd', status: 1 }, { text: '月', value: 'm', status: 1 }, { text: '年', value: 'y', status: 1 }
      ]
      this.getDetailInfo(data)
    },
    // 获取订单详情
    async getDetailInfo(rowData) {
      const params = {
        id: rowData.id
      }
      await MealResource.customerInfo(params).then(response => {
        const data = response
        data['product_name'] = Object.keys(data['plan_setting']).length && data['plan_setting']['meal']['product_name'] || ''
        this.MealRenewDialog.data = data
        this.MealRenewDialog.order_type = Number(data.phase) === 0 ? 'user_refund' : 'normal'
        this.getMealAndPrice(data.meal_flag, data.product_flag, data['plan_setting']['meal_latest'])
        this.Meal_INFO = [
          { title: '套餐ID', value: data.id, unit: '' },
          { title: '关联账号', value: data.member.email, unit: '' },
          { title: '产品名称', value: data.product_name, unit: '' },
          { title: '套餐名称', value: data.plan_name, unit: '' },
          { title: '剩余时间', value: data.expire_time, unit: '' },
          { title: '套餐状态', value: data.plan_status === '2' ? '已到期' : '未到期', unit: '' }
        ]
      })
    },
    async getMealAndPrice(meal_flag, product_flag, default_meal) {
      if (!product_flag || !meal_flag) return true
      const Meal = default_meal
      setTimeout(() => { this.MealRenewDialog.loading = false }, 1000)
      if (Meal) {
        const meal_detail = Meal['meal_detail'] // JSON.parse(Meal['meal_detail'])
        this.MealRenewDialog['product_meal_id'] = Meal['id']
        this.MealRenewDialog['buy_time'] = meal_detail['meal_price']['min_buy'] ? meal_detail['meal_price']['min_buy'] || 1 : 1 // 最小购买时长
        this.MealRenewDialog['time_unit'] = meal_detail['meal_price']['time_unit']
        this.getRenewPrice() // 时长价格区间
      }
    },
    changOderType(val) {
      this.MealRenewDialog.sales_amount = 0
      if (val === 'user_refund') {
        this.MealRenewDialog.discount_sale_type = 'rate'
      } else if (val === 'normal') {
        this.MealRenewDialog.discount_sale_type = 'amount'
      }
      setTimeout(() => { if (this.MealRenewDialog.data.meal_flag) this.getRenewPrice() }, 500)
    },
    changeTime() {
      setTimeout(() => {
        this.MealRenewDialog.sales_amount = 0
        if (this.MealRenewDialog.order_type === 'user_refund') {
          this.MealRenewDialog.discount_sale_type = 'rate'
        } else if (this.MealRenewDialog.order_type === 'normal') {
          this.MealRenewDialog.discount_sale_type = 'amount'
        }
        this.getRenewPrice()
      }, 100)
    },
    changePayPrice(value) {
      const pay_price = this.MealRenewDialog.pay_price
      const total_price = this.MealRenewDialog.total_price
      const diff_price_time = this.MealRenewDialog.diff_price_time
      const sales_amount = Number(total_price) - Number(pay_price) - Number(diff_price_time)
      this.MealRenewDialog.discount_sale_type = 'amount'
      this.MealRenewDialog.sales_amount = sales_amount.toFixed(2)
      this.getRenewPrice()
    },

    async getRenewPrice(type) {
      FORM.setMaxTime(this.MealRenewDialog.buy_time, this.MealRenewDialog.time_unit, this.MealRenewDialog, this.$refs['buy_time'])
      const { buy_time, time_unit, no_fee, coupon_code, discount_sale_type, sales_amount } = this.MealRenewDialog
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.setFieldPrice(null, false)
        return
      }
      const data = {
        'order_type': this.MealRenewDialog.order_type,
        'buy_type': 'renew',
        'buy_time': buy_time,
        'time_unit': time_unit,
        'user_id': 0,
        'member_id': this.MealRenewDialog.data.member_id,
        'plan_id': this.MealRenewDialog.data.id,
        'remark': '续费',
        'from': 'user',
        'no_fee': no_fee,
        'coupon_code': this.useCoupon ? coupon_code : '',
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale,time,act'
      }
      this.$refs.Dialog.resetSubmitLoading(true)
      await MealResource.getRenewPrice(data).then(response => {
        this.$refs.Dialog.afterValidate()
        const renew_price = response
        if (!renew_price['discount_sale_type']) this.message.success('价格计算失败!请检查输入项!!')
        this.expire_time_2 = response.expire_time
        this.setFieldPrice(renew_price, true)
        this.getRate(renew_price.pay_price, renew_price.diff_price_sale, sales_amount, discount_sale_type)
      }).catch(() => {
        this.$refs.Dialog.afterValidate()
      })
    },
    setFieldPrice(renew_price, status) { // 设置金额
      this.MealRenewDialog.diff_price_act = status ? renew_price.diff_price_act || 0 : 0 // 产品折扣
      this.MealRenewDialog.diff_price_time = status ? renew_price.diff_price_time || 0 : 0 // 默认优惠
      this.MealRenewDialog.discount_sale_amount = status ? renew_price.diff_price_sale || 0 : 0 // 销售优惠
      this.MealRenewDialog.diff_price_coupon = status ? renew_price.diff_price_coupon || 0 : 0 // 优惠券金额
      this.MealRenewDialog.pay_price = status ? renew_price.pay_price || 0 : 0// 优惠券金额
      this.MealRenewDialog.total_price = status ? renew_price.total_price || 0 : 0 // 优惠券金额
    },

    async handleRenew() {
      const { buy_time, time_unit, no_fee, discount_sale_type, remark, sales_amount, pay_type } = this.MealRenewDialog
      this.MealRenewDialog.submit()
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.$refs.Dialog.afterValidate()
        return
      }
      const data = {
        'order_type': this.MealRenewDialog.order_type,
        'buy_type': 'renew',
        'buy_time': buy_time,
        'time_unit': time_unit,
        'user_id': 0,
        'member_id': this.MealRenewDialog.data.member.id,
        'plan_id': this.MealRenewDialog.data.id,
        'remark': remark,
        'from': 'user',
        'no_fee': no_fee,
        'pay_type': pay_type,
        'coupon_code': '',
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale,act,time'
      }
      await MealResource.SaveRenewPay(data).then(response => {
        this.$emit('on-success')
        this.Message('ACTION_SUCCESS')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    },
    getCheck(discount_sale_type, sales_amount) {
      let status = true
      if (discount_sale_type === 'rate' && sales_amount > 1) {
        this.message.warning('折扣不能大于1!')
        this.MealRenewDialog.sales_amount = 1
        status = false
      }
      return status
    },
    getRate(pay_price, diff_price_sale, sales_amount, discount_sale_type) {
      let rate
      if (discount_sale_type === 'rate') {
        rate = sales_amount
      } else {
        rate = parseFloat(sales_amount / (Number(pay_price) + Number(diff_price_sale))).toFixed(4)
      }
      this.rate = (Number(rate) * 100).toFixed(2) + ' %'
    }
  }
}
</script>
<style lang="scss" scoped>
.renewForm-item {
  margin-bottom: 5px;
}
.renewForm-input {
  width: 300px;
}
</style>

