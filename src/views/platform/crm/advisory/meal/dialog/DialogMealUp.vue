<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleClick"
    title="更换套餐"
    aside
    class="orderinfo"
  >
    <DmScroll>
      <el-form
        v-loading="MealUpDialog.loading"
        ref="formRenewalfee"
        :rules="MealUpDialog.$rules"
        size="mini"
        label-position="left"
        label-width="120px"
      >
        <CardInfo
          :data="Meal_INFO"
          title="基本信息"
        />
        <CardInfo
          v-if="MEAL_CONFIG_INFO.length"
          :data="MEAL_CONFIG_INFO"
          title="已扩容配置"
        />
        <CardLayout title="切换套餐">
          <div slot="layout">
            <el-form-item
              label="订单目的："
              class="mealUpForm-item"
            >
              <el-select
                v-model="MealUpDialog.order_type"
                disabled
                class="mealUpForm-input"
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
              label="切换套餐"
              class="mealUpForm-item"
            >
              <el-select
                v-model="MealUpDialog.meal_flag"
                placeholder=""
                class="mealUpForm-input"
                @change="handleChangeMeal"
              >
                <el-option
                  v-for="(item, index) in meal_list"
                  :key="index"
                  :label="item.meal_name"
                  :value="item.meal_flag"
                  :disabled="item.status == '1' ? false :true"
                />
              </el-select>
            </el-form-item>
          </div>
        </CardLayout>
        <CardInfo
          v-if="MealInfo.length"
          :data="MealInfo"
          title="套餐配置"
        />
        <CardLayout title="订单金额">
          <div slot="layout">
            <el-form-item label="订单标价">
              {{ formartPrice(MealUpDialog.total_price) }} 元
            </el-form-item>
            <el-form-item
              label="销售优惠"
              class="mealUpForm-item"
            >
              <a-input
                v-model="MealUpDialog.sales_amount"
                :disabled="MealUpDialog.order_type === 'user_refund'"
                placeholder=""
                class="mealUpForm-input"
                @change="getUpPrice"
              >
                <el-select
                  slot="addonBefore"
                  v-model="MealUpDialog.discount_sale_type"
                  :disabled="MealUpDialog.order_type === 'user_refund'"
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
                v-if="MealUpDialog.discount_sale_amount > 0"
                style="margin-left:20px; width: 150px; color:green"
              >
                (优惠金额：{{ MealUpDialog.discount_sale_amount }} 元,折扣：{{ rate }})
              </span>
            </el-form-item>
            <el-form-item
              :label="TYPE==='DOWN'?'应退金额':'应付金额'"
              class="mealUpForm-item"
            >
              <!-- <el-input-number
                v-model="MealUpDialog.pay_price"
                :step="1"
                controls-position="right"
                class="mealUpForm-input input-number"
                @change="changePayPrice"
              /> -->

              <a-input-number
                v-model="MealUpDialog.pay_price"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                class="mealUpForm-input"
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
              class="mealUpForm-item"
            >
              <el-radio
                v-model="MealUpDialog.pay_type"
                label="6"
              >欠款支付</el-radio>
            </el-form-item>
            <el-form-item
              label="订单备注"
              class="mealUpForm-item"
            >
              <el-input
                v-model="MealUpDialog.remark"
                type="textarea"
                placeholder="请输入备注"
                class="mealUpForm-input"
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
import FILTERMEAL from '@/utils/filterMeal'
import { CountDown } from '@/utils/utils'
export default {
  data() {
    return {
      MealUpDialog: new Form(FORM.FORM_UPLEVEL, FORM.FORM_UPLEVEL_RULE),
      timetype: [
        { text: '日', value: 'd', status: 1 }, { text: '月', value: 'm', status: 1 }, { text: '年', value: 'y', status: 1 }
      ],
      meal_list: [],
      time_unit: 'm',
      meal_config: [],
      MEAL_CONFIG_INFO: [],
      MealInfo: [],
      is_pay_type_status3: false,
      is_pay_type_status6: false,
      discount_sale_type: [
        { text: '折扣', value: 'rate' }, { text: '金额', value: 'amount' }
      ],
      ordertype: [
        { text: '正式开通', value: 'normal' }, { text: '试用开通', value: 'user_refund' }
      ],
      rate: 1,
      useCoupon: false,
      default_meal_flag: '',
      default_meal_level: 0,
      TYPE: '',
      Meal_INFO: []
    }
  },
  methods: {
    handleOpen(data) {
      this.$refs.Dialog.handleOpen()
      this.default_meal_flag = ''
      this.default_meal_level = 0
      this.time_unit = 'm'
      this.TYPE = ''
      this.timetype = [
        { text: '日', value: 'd', status: 1 }, { text: '月', value: 'm', status: 1 }, { text: '年', value: 'y', status: 1 }
      ]
      this.meal_config = []
      this.MealInfo = []
      this.MealUpDialog.reset()
      this.MealUpDialog.loading = true
      this.getDetailInfo(data)
      const Meal = data['plan_setting']['meal_latest']
      const meal_detail = Meal['meal_detail']
      const default_kuorong = data['plan_setting']['cfg']['kuorong']
      this.MEAL_CONFIG_INFO = FORM.getDefault_Kuorong_Info(meal_detail['kuorong'], default_kuorong) // 套餐配置详情
    },
    initMealFlag() {
      this.MealUpDialog.meal_flag = this.default_meal_flag
    },
    async getDetailInfo(rowData) { // 获取订单详情
      const params = { id: rowData.id }
      await MealResource.customerInfo(params).then(res => {
        const data = res
        data['product_name'] = data['plan_setting']['meal']['product_name'] // 到期时间 处理
        const Expiredate = CountDown(data.expire_time, 1)
        data['expire_time'] = Expiredate
        const meal_flag = data.meal_flag || ''
        const product_flag = data.product_flag
        const meal_level = data.plan_setting.meal_latest.level
        this.MealUpDialog.order_type = Number(data.phase) === 0 ? 'user_refund' : 'normal'
        this.default_meal_flag = meal_flag // 默认赋值
        this.default_meal_level = Number(meal_level)
        this.MealUpDialog.data = data
        this.getMeal(meal_flag, product_flag, meal_level) // 获取套餐列表
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
    async getMeal(meal_flag, product_flag, meal_level) {
      const that = this
      if (!product_flag || !meal_flag) return true
      const params = { product_flag: product_flag, page: 1, per_page: 1000 }
      let newList = []
      await MealResource.getProductMeal(params).then(res => {
        let list = JSON.parse(JSON.stringify(res)) || []
        list = list.filter(i => FILTERMEAL.indexOf(i.meal_flag) < 0 && i.meal_flag !== meal_flag && i.level !== meal_level)
        newList = list
      })

      if (product_flag === 'WEBAQJS') {
        newList = newList.filter(i => i.meal_flag !== 'YD-WEBAQJS-TY')
      }

      this.meal_list = newList
      setTimeout(() => { that.MealUpDialog.loading = false }, 100)
    },
    formartPrice(value) {
      const price = Number(0)
      if (Number(value) === 0) {
        return price
      } else if (Number(value) && this.TYPE === 'UP') {
        return Math.abs(Number(value))
      } else if (Number(value) && this.TYPE === 'DOWN') {
        return (Number(value) || 0) * (-1)
      } else {
        return value
      }
    },
    async handleClose() {
      this.MealUpDialog.reset()
      this.MealUpDialog.visible = false
    },
    handleClick() {
      if (this.TYPE === 'UP') {
        this.handleUp()
      } else if (this.TYPE === 'DOWN') {
        this.handleDown()
      }
    },
    async handleUp() {
      const { meal_flag, no_fee, discount_sale_type, remark, sales_amount, pay_type } = this.MealUpDialog
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.$refs.Dialog.afterValidate()
        return
      }
      const data = {
        'order_type': this.MealUpDialog.order_type,
        'buy_type': 'up',
        'member_id': this.MealUpDialog.data.member_id,
        'meal_flag': meal_flag,
        'plan_id': this.MealUpDialog.data.id,
        'user_id': this.MealUpDialog.data.user_id,
        'remark': remark,
        'from': 'user',
        'no_fee': no_fee,
        'pay_type': pay_type,
        'coupon_code': '',
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      if (!meal_flag) {
        this.message.warning('请选择升级套餐!!')
        this.$refs.Dialog.afterValidate()
        return
      }
      await MealResource.orderUp(data).then(response => {
        this.$emit('on-success')
        this.Message('ACTION_SUCCESS')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    },
    async getUpPrice(value) {
      if (!value) return true
      if (this.MealUpDialog.meal_flag) this.initMealPrice(this.MealUpDialog.meal_flag)
    },
    changOderType(val) {
      this.MealUpDialog.sales_amount = 0
      if (val === 'user_refund') {
        this.MealUpDialog.discount_sale_type = 'rate'
      } else if (val === 'normal') {
        this.MealUpDialog.discount_sale_type = 'amount'
      }
      setTimeout(() => { if (this.MealUpDialog.meal_flag) this.initMealPrice(this.MealUpDialog.meal_flag) }, 500)
    },
    handleChangeMeal(meal_flag) {
      if (!meal_flag) return true
      this.useCoupon = false
      this.MealUpDialog.coupon_code = ''
      this.MealUpDialog.sales_amount = 0
      this.gettMeaDefaultConfig(meal_flag)
      this.initMealPrice(meal_flag)
    },
    initMealPrice(meal_flag) { // 计算价格
      const Meal = this.meal_list.find(meal => meal.meal_flag === meal_flag)
      const newMealLevel = Number(Meal.level)
      // this.MealUpDialog.sales_amount = 0
      if (this.MealUpDialog.order_type === 'user_refund') {
        this.MealUpDialog.discount_sale_type = 'rate'
      } else if (this.MealUpDialog.order_type === 'normal') {
        this.MealUpDialog.discount_sale_type = 'amount'
      }
      if (newMealLevel > this.default_meal_level) {
        this.TYPE = 'UP'
        this.getMealUpPrice(meal_flag)
      } else if (newMealLevel < this.default_meal_level) {
        this.TYPE = 'DOWN'
        this.getMealDownPrice(meal_flag)
      }
    },
    async gettMeaDefaultConfig(meal_flag) {
      const Meal = this.meal_list.find(meal => meal.meal_flag === meal_flag)
      const meal_detail = Meal ? JSON.parse(Meal['meal_detail']) : {}
      const default_fields = meal_detail['backstage_show'] ? meal_detail['backstage_show']['default_fields'] : []
      const { meal_config, time_type } = FORM.getMealConfig(meal_detail['default_fields'], default_fields, meal_detail['meal_price']['count_unit'])
      this.meal_config = meal_config
      this.timetype = time_type
      this.time_unit = meal_detail['meal_price']['time_unit']
      const mealInfo = FORM.getMealInfo(meal_detail)
      this.MealInfo = mealInfo
    },
    changePayPrice(value) {
      if (!this.MealUpDialog.meal_flag) return
      const pay_price = this.MealUpDialog.pay_price
      const total_price = this.MealUpDialog.total_price
      const diff_price_time = this.MealUpDialog.diff_price_time
      const diff_price_act = this.MealUpDialog.diff_price_act
      const new_value = this.TYPE === 'DOWN' ? (Number(pay_price)) * (-1) : Number(pay_price)
      const sales_amount = Number(total_price - new_value - diff_price_time - diff_price_act).toFixed(2)
      this.MealUpDialog.discount_sale_type = 'amount'
      this.MealUpDialog.sales_amount = sales_amount
      // if (this.MealUpDialog.meal_flag) this.initMealPrice(this.MealUpDialog.meal_flag)
    },
    SaleTypeChange(val) {
      if (val === 'rate') {
        this.MealUpDialog.sales_amount = 1
      } else {
        this.MealUpDialog.sales_amount = 0
      }
      if (this.MealUpDialog.meal_flag) this.initMealPrice(this.MealUpDialog.meal_flag)
    },
    async getMealUpPrice(type) {
      const { meal_flag, coupon_code, no_fee, discount_sale_type, sales_amount } = this.MealUpDialog
      const rowData = this.MealUpDialog.data
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.setFieldPrice(null, false)
        return
      }
      const data = {
        'order_type': this.MealUpDialog.order_type,
        'buy_type': 'up',
        'member_id': rowData ? rowData.member_id : '',
        'meal_flag': meal_flag,
        'plan_id': rowData ? rowData.id : '',
        'user_id': rowData ? rowData.member.id : '',
        'remark': '升级',
        'from': 'user',
        'no_fee': no_fee,
        'coupon_code': coupon_code,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      this.$refs.Dialog.resetSubmitLoading(true)
      await MealResource.orderupprice(data).then(response => {
        this.$refs.Dialog.afterValidate()
        if (!response['discount_sale_type']) this.message.warning('价格计算失败!请检查输入项!')
        if (response) {
          this.setFieldPrice(response, true)
          this.getRate(response.pay_price, response.diff_price_sale, sales_amount, discount_sale_type)
        }
      }).catch(() => {
        this.$refs.Dialog.afterValidate()
      })
    },
    setFieldPrice(data, status) { // 设置金额
      this.MealUpDialog.diff_price_act = status ? data.diff_price_act || 0 : 0 // 产品折扣
      this.MealUpDialog.diff_price_time = status ? data.diff_price_time || 0 : 0 // 默认优惠
      this.MealUpDialog.discount_sale_amount = status ? data.diff_price_sale || 0 : 0 // 销售优惠
      this.MealUpDialog.diff_price_coupon = status ? data.diff_price_coupon || 0 : 0 // 优惠券金额
      this.MealUpDialog.pay_price = status ? this.TYPE === 'DOWN' ? Number(data.pay_price) * (-1) : Number(data.pay_price) || 0 : 0 // 优惠券金额
      this.MealUpDialog.total_price = status ? data.total_price || 0 : 0 // 优惠券金额
    },
    getRate(pay_price, diff_price_sale, sales_amount, discount_sale_type) {
      let rate
      if (discount_sale_type === 'rate') {
        rate = sales_amount
      } else {
        rate = parseFloat(sales_amount / (Number(pay_price) + Number(diff_price_sale))).toFixed(4)
      }
      this.rate = (Number(rate) * 100).toFixed(2) + ' %'
    },
    getCouponUnuse(status) { // 获取未使用的优惠券
      if (!status) return
      const params = {
        'order_total_price': this.MealUpDialog.total_price,
        'meal_flag': this.MealUpDialog.meal_flag,
        'member_id': this.MealUpDialog.data.member_id
      }
      MealResource.getCouponUnuse(params).then(response => {
        const data = response
        this.MealUpDialog.couponList = []
        if (data) {
          const couponList = []
          for (var item in data) {
            couponList.push(data[item])
          }
          this.MealUpDialog.couponList = couponList
        }
      })
    },
    getCouponPrice(type) {
      if (!this.useCoupon && type === 'code') return
      if (type === 'code' && !this.MealUpDialog.coupon_code) {
        this.message.warning('请选择或输入优惠码!')
        return
      }
      if (this.MealUpDialog.meal_flag) this.initMealPrice(this.MealUpDialog.meal_flag)
    },
    getCheck(discount_sale_type, sales_amount) {
      let status = true
      if (discount_sale_type === 'rate' && sales_amount > 1) {
        this.message.warning('折扣不能大于1!')
        this.MealUpDialog.sales_amount = 1
        status = false
      }
      return status
    },
    async handleDown() {
      const { meal_flag, coupon_code, no_fee, remark, pay_type, discount_sale_type, sales_amount } = this.MealUpDialog
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.$refs.Dialog.afterValidate()
        return
      }
      const data = {
        'order_type': this.MealUpDialog.order_type,
        'buy_type': 'down',
        'member_id': this.MealUpDialog.data.member_id,
        'meal_flag': meal_flag,
        'plan_id': this.MealUpDialog.data.id,
        'user_id': this.MealUpDialog.data.user_id,
        'remark': remark,
        'from': 'user',
        'no_fee': no_fee,
        'pay_type': pay_type,
        'coupon_code': coupon_code,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      await MealResource.SaveDownPay(data).then(response => {
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    },
    async getMealDownPrice(type) {
      const { meal_flag, coupon_code, no_fee, discount_sale_type, sales_amount } = this.MealUpDialog
      const rowData = this.MealUpDialog.data
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.setFieldPrice(null, false)
        return
      }
      const data = {
        'order_type': this.MealUpDialog.order_type,
        'buy_type': 'down',
        'member_id': rowData ? rowData.member_id : '',
        'meal_flag': meal_flag,
        'plan_id': rowData ? rowData.id : '',
        'user_id': rowData ? rowData.member.id : '',
        'remark': '降级',
        'from': 'user',
        'no_fee': no_fee,
        'coupon_code': coupon_code,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      if (!meal_flag) {
        this.message.success('请选择降级套餐')
        return
      }
      this.$refs.Dialog.resetSubmitLoading(true)
      await MealResource.getDownPrice(data).then(res => {
        this.$refs.Dialog.afterValidate()
        if (!res['discount_sale_type']) {
          this.message.success('价格计算失败!请检查输入项!')
        }
        this.setFieldPrice(res, true)
        this.getRate(res.pay_price, res.diff_price_sale, sales_amount, discount_sale_type)
      }).catch(() => {
        this.$refs.Dialog.afterValidate()
      })
    }
  }
}
</script>
<style lang="scss">
.mealUpForm-item {
  margin-bottom: 5px;
}
.mealUpForm-input {
  width: 300px;
}
</style>

