<template>
  <DmDialog ref="Dialog" :fetch-submit="handleRenew" title="套餐退订" aside >
    <DmScroll>
      <el-form
        v-loading="MealCancelDialog.loading"
        ref="MealCancelDialog"
        :model="MealCancelDialog"
        :rules="rules"
        size="mini"
        label-position="left"
        label-width="100px"
      >
        <CardInfo
          :data="Meal_INFO"
          title="基本信息"
        />
        <CardLayout title="退订操作">
          <div slot="layout">
            <el-form-item
              label="订单目的："
              class="cancelForm-item"
              prop="order_type"
            >
              <el-select
                v-model="MealCancelDialog.order_type"
                disabled
                placeholder="请选择订单目的"
                class="cancelForm-input"
                @change="changOderType"
              >
                <el-option
                  v-for="item in ordertype"
                  :key="item.checked"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="退订时间"
              class="cancelForm-item"
            >
              <el-radio-group
                v-model="expire_time_status"
                @change="endTypeChange"
              >
                <el-radio-button :label="1">立即退订</el-radio-button>
                <el-radio-button :label="2">定时退订</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-if="expire_time_status === 2"
                v-model="MealCancelDialog.expire_time"
                :picker-options="pickerOptions"
                type="datetime"
                placeholder="选择日期时间"
                default-time="23:59:59"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-left:15px;"
                @change="changeEndTime"
              />
            </el-form-item>
            <el-form-item
              v-if="expire_time_status === 2 && MealCancelDialog.expire_time"
              class="cancelForm-item"
            >
              <span style="color:red">( 预计剩余时间：{{ MealCancelDialog.end_time_text }} )</span>
            </el-form-item>
            <el-form-item
              label="定价"
              class="cancelForm-item"
            >
              {{ (Number(MealCancelDialog.total_price) || 0) }} 元
            </el-form-item>
          </div>
        </CardLayout>
        <CardLayout title="订单金额">
          <div slot="layout">
            <el-form-item
              label="减免金额："
              class="cancelForm-item"
            >
              <a-input
                v-model="MealCancelDialog.sales_amount"
                :disabled="MealCancelDialog.order_type === 'user_refund'"
                placeholder=""
                class="cancelForm-input"
                @change="getRenewPrice"
              >
                <el-select
                  slot="addonBefore"
                  v-model="MealCancelDialog.discount_sale_type"
                  :disabled="MealCancelDialog.order_type === 'user_refund'"
                  style="width: 100px;"
                  @change="SaleTypeChange"
                >
                  <el-option
                    v-for="item in discount_sale_type"
                    :key="item.checked"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </a-input>
              <span
                v-if="MealCancelDialog.discount_sale_amount > 0"
                style="margin-left:20px; width: 150px; color:green"
              >
                (优惠金额：{{ MealCancelDialog.discount_sale_amount }} 元)
              </span>
            </el-form-item>
            <el-form-item
              label="应退金额："
              class="cancelForm-item"
            >
              <a-input-number
                v-model="MealCancelDialog.pay_price"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                class="cancelForm-input"
                @change="changePayPrice"
              />
              元
            </el-form-item>
          </div>
        </CardLayout>
        <CardLayout title="支付相关">
          <div slot="layout">
            <el-form-item
              label="支付方式："
              class="cancelForm-item"
              prop="pay_type"
            >
              <el-radio
                v-model="MealCancelDialog.pay_type"
                label="6"
              >欠款支付</el-radio>
            </el-form-item>
            <el-form-item
              label-width="0px"
              style="margin-bottom:0"
            >
              <el-form-item
                label="流失原因"
                prop="reason_top"
                class="cancelForm-item"
                style="display: inline-block;"
              >
                <el-select
                  v-model="MealCancelDialog.reason_top"
                  clearable
                  placeholder="流失原因"
                  @change="changeReason"
                >
                  <el-option
                    v-for="(item, key) in REASON_TOP"
                    :key="key"
                    :label="item"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="MealCancelDialog.reason_top !==''"
                label-width="0px"
                prop="reason_second"
                class="cancelForm-item"
                style="display: inline-block;"
              >
                <el-select
                  v-model="MealCancelDialog.reason_second"
                  clearable
                  placeholder="流失原因"
                >
                  <el-option
                    v-for="(item, key) in REASON_SECOND"
                    :key="key"
                    :label="item.second"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item
              label="流失备注"
              prop="remark"
              class="cancelForm-item"
            >
              <el-input
                v-model="MealCancelDialog.remark"
                type="textarea"
                placeholder="请输入流失备注"
                class="cancelForm-input"
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
import moment from 'moment'
import { CountDown } from '@/utils/utils'
export default {
  data() {
    var validateNull = (rule, value, callback) => {
      if (!this.MealCancelDialog.remark) {
        callback(new Error('请输入流失原因备注'))
      } else {
        callback()
      }
    }
    return {
      MealCancelDialog: new Form(FORM.FORM_CANCEL, {}),
      rules: {
        pay_type: [],
        order_type: [],
        reason_top: [{ required: true, message: '请选择退订原因' }],
        reason_second: [{ required: true, message: '请选择退订原因' }],
        remark: [{ required: true, validator: validateNull, trigger: ['change', 'blur'] }]
      },
      is_pay_type_status3: false,
      is_pay_type_status6: false,
      rate: 1,
      expire_time_status: 1,
      timetype: [
        { text: '日', value: 'd', status: 1 }, { text: '月', value: 'm', status: 1 }, { text: '年', value: 'y', status: 1 }
      ],
      ordertype: [
        { text: '正式开通', value: 'normal' }, { text: '试用开通', value: 'user_refund' }
      ],
      discount_sale_type: [
        { text: '折扣', value: 'rate' }, { text: '金额', value: 'amount' }
      ],
      meal_config: [],
      MealInfo: [],
      useCoupon: false,
      pickerOptions: {
        disabledDate(time) {
          var date = new Date()
          date.setDate(date.getDate() - 1)
          return time.getTime() < date
        }
      },
      Meal_INFO: [],
      timetype_default: [
        { text: '日', value: 'd', status: 1 },
        { text: '月', value: 'm', status: 1 },
        { text: '年', value: 'y', status: 1 }
      ],
      REASON_TOP: [],
      REASON_SECOND: [],
      REASON_SECOND_All: []
    }
  },
  methods: {
    handleOpen(data, REASON_TOP, REASON_SECOND_All) {
      this.$nextTick(() => {
        this.MealCancelDialog.reset()
        setTimeout(() => { if (this.$refs.MealCancelDialog) this.$refs.MealCancelDialog.resetFields() }, 0)
        this.REASON_TOP = REASON_TOP
        this.REASON_SECOND = []
        this.REASON_SECOND_All = REASON_SECOND_All
        this.$refs.Dialog.handleOpen()
        this.MealCancelDialog.loading = true
        this.expire_time_status = 1
        this.MealInfo = []
        this.meal_config = []
        this.getExcTime = ''
        this.timetype = this.timetype_default
        this.getDetailInfo(data)
      })
    },
    async getDetailInfo(val) { // 获取订单详情
      const params = { id: val.id }
      await MealResource.customerInfo(params).then(response => {
        const data = response
        data['product_name'] = data['plan_setting']['meal_latest'] && data['plan_setting']['meal_latest']['product_name'] || '--'
        this.MealCancelDialog.old_expire_time = data.expire_time // 默认到期时间
        const Expiredate = CountDown(data.expire_time)
        data['expire_time'] = Expiredate
        this.MealCancelDialog.data = data
        this.MealCancelDialog.order_type = Number(data.phase) === 0 ? 'user_refund' : 'normal'
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
      const that = this
      if (!product_flag || !meal_flag) return true
      const Meal = default_meal
      setTimeout(() => { that.MealCancelDialog.loading = false }, 1000)
      if (Meal) {
        const meal_detail = Meal['meal_detail'] // JSON.parse(Meal['meal_detail'])
        this.MealCancelDialog['product_meal_id'] = Meal['id']
        this.MealCancelDialog['buy_time'] = meal_detail['meal_price']['min_buy'] ? meal_detail['meal_price']['min_buy'] || 1 : 1 // 最小购买时长
        this.MealCancelDialog['time_unit'] = meal_detail['meal_price']['time_unit']
        this.getRenewPrice() // 时长价格区间
      }
    },
    changeReason(val) {
      this.MealCancelDialog.reason_second = ''
      let reason_second = []
      reason_second = this.REASON_SECOND_All.filter(i => Number(i.top) === Number(val))
      this.REASON_SECOND = reason_second
    },
    changOderType(val) {
      this.MealCancelDialog.sales_amount = 0
      if (val === 'user_refund') {
        this.MealCancelDialog.discount_sale_type = 'rate'
      } else if (val === 'normal') {
        this.MealCancelDialog.discount_sale_type = 'amount'
      }
      setTimeout(() => { if (this.MealCancelDialog.data.meal_flag) this.getRenewPrice() }, 500)
    },
    endTypeChange(val) { // 退订类型
      if (val === 2) {
        this.MealCancelDialog.expire_time = this.MealCancelDialog.old_expire_time
        const Expiredate = CountDown(this.MealCancelDialog.old_expire_time)
        this.MealCancelDialog.end_time_text = Expiredate
      } else {
        this.MealCancelDialog.expire_time = ''
      }
      this.MealCancelDialog.sales_amount = 0
      if (this.MealCancelDialog.order_type === 'user_refund') {
        this.MealCancelDialog.discount_sale_type = 'rate'
      } else if (this.MealCancelDialog.order_type === 'normal') {
        this.MealCancelDialog.discount_sale_type = 'amount'
      }
      this.getRenewPrice()
    },
    changeEndTime(value) { // 到期时间
      const old_expire_time = this.MealCancelDialog.old_expire_time
      if (!moment().isBefore(moment(value))) {
        var date = new Date()
        date.setMinutes(date.getMinutes() + 1)
        this.MealCancelDialog.expire_time = moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      if (!moment(value).isBefore(old_expire_time)) this.MealCancelDialog.expire_time = old_expire_time
      const Expiredate = CountDown(this.MealCancelDialog.expire_time)
      this.MealCancelDialog.end_time_text = Expiredate
      this.MealCancelDialog.discount_sale_type = 'amount'
      this.MealCancelDialog.sales_amount = 0
      this.getRenewPrice()
    },
    changePayPrice(value) {
      const pay_price = this.MealCancelDialog.pay_price
      const total_price = this.MealCancelDialog.total_price
      const sales_amount = Number(total_price) - (Number(pay_price) * (-1))
      this.MealCancelDialog.discount_sale_type = 'amount'
      this.MealCancelDialog.sales_amount = sales_amount.toFixed(2)
      this.getRenewPrice()
    },
    SaleTypeChange(val) {
      if (val === 'rate') {
        this.MealCancelDialog.sales_amount = 1
      } else {
        this.MealCancelDialog.sales_amount = 0
      }
      this.getRenewPrice()
    },
    async getRenewPrice(type) {
      const { no_fee, discount_sale_type, sales_amount } = this.MealCancelDialog
      const rowData = this.MealCancelDialog.data
      if (!this.getCheck(discount_sale_type, sales_amount)) return
      let expire_time = ''
      if (this.expire_time_status === 2) expire_time = this.MealCancelDialog.expire_time
      const data = {
        'order_type': this.MealCancelDialog.order_type,
        'member_id': this.MealCancelDialog.data.member_id,
        'meal_flag': this.MealCancelDialog.data.meal_flag,
        'plan_id': this.MealCancelDialog.data.id,
        'user_id': rowData ? rowData.member.id : '',
        'remark': '退订',
        'from': 'user',
        'expire_time': expire_time,
        'no_fee': no_fee,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      this.$refs.Dialog.resetSubmitLoading(true)
      await MealResource.getEndPrice(data).then(response => {
        this.$refs.Dialog.afterValidate()
        const renew_price = response
        if (!renew_price['discount_sale_type']) this.message.warning('价格计算失败!请检查输入项!')
        this.setFieldPrice(renew_price)
        this.getRate(renew_price.pay_price, renew_price.diff_price_sale, sales_amount, discount_sale_type)
      }).catch(() => {
        this.$refs.Dialog.afterValidate()
      })
    },
    setFieldPrice(renew_price) { // 设置金额
      this.MealCancelDialog.diff_price_act = renew_price.diff_price_act ? renew_price.diff_price_act : 0 // 产品折扣
      this.MealCancelDialog.diff_price_time = renew_price.diff_price_time ? renew_price.diff_price_time : 0 // 默认优惠
      this.MealCancelDialog.discount_sale_amount = renew_price.diff_price_sale ? renew_price.diff_price_sale : 0 // 销售优惠
      this.MealCancelDialog.diff_price_coupon = renew_price.diff_price_coupon ? renew_price.diff_price_coupon : 0 // 优惠券金额
      this.MealCancelDialog.pay_price = Number(renew_price.pay_price) * (-1) || 0 // 优惠券金额
      this.MealCancelDialog.total_price = renew_price.total_price || 0 // 优惠券金额
    },

    handleRenew() {
      const { no_fee, discount_sale_type, remark, sales_amount, pay_type } = this.MealCancelDialog
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.$refs.Dialog.afterValidate()
        return
      }
      let expire_time = ''
      if (this.expire_time_status === 2) expire_time = this.MealCancelDialog.expire_time
      const data = {
        'order_type': this.MealCancelDialog.order_type,
        'member_id': this.MealCancelDialog.data.member.id,
        'plan_id': this.MealCancelDialog.data.id,
        'from': 'user',
        'no_fee': no_fee,
        'pay_type': pay_type,
        'coupon_code': '',
        'expire_time': expire_time,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale',
        reason_top: this.MealCancelDialog.reason_top, // 一级流失原因，
        reason_second: this.MealCancelDialog.reason_second, // 二级流失原因，
        remark: remark // 流失原因备注，

      }
      this.$refs.MealCancelDialog.validate(valid => {
        if (valid) {
          MealResource.getEndOrder(data).then(response => {
            this.Message('ACTION_SUCCESS')
            this.$emit('on-success')
            this.$refs.Dialog.handleClose()
          }).catch(e => {

          })
        } else {
          this.$refs.Dialog.afterValidate()
        }
      })
    },
    getCheck(discount_sale_type, sales_amount) {
      let status = true
      if (discount_sale_type === 'rate' && sales_amount > 1) {
        this.message.warning('折扣不能大于1!')
        this.MealCancelDialog.sales_amount = 1
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
<style lang="scss">
.cancelForm-item {
  margin-bottom: 5px;
}
.cancelForm-input {
  width: 300px;
}
</style>

