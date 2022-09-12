<template>
  <DmDialog ref="Dialog" :fetch-submit="handlePay" title="套餐增值" aside >
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="formNewPackage"
        :model="MealRaiseDialog"
        size="mini"
        label-position="left"
        label-width="150px"
      >
        <CardInfo
          :data="Meal_INFO"
          title="基本信息"
        />
        <CardLayout title="增值操作">
          <div slot="layout">
            <el-form-item
              label="订单目的"
              class="raiseForm-item"
            >
              <DmSelect
                v-model="MealRaiseDialog.order_type"
                :selects="order_type"
                placeholder="订单目的"
                class="raiseForm-input"
                @change="changOderType"
              />
            </el-form-item>
            <template v-if="MealRaiseDialog.data.meal_flag">
              <el-form-item
                label="购买时长"
                class="raiseForm-item"
              >
                <el-input
                  v-model="MealRaiseDialog.buy_time"
                  placeholder=""
                  class="raiseForm-input"
                  @change="getPrice('code')"
                >
                  <el-select
                    slot="append"
                    v-model="MealRaiseDialog.time_unit"
                    style="width:100px;"
                  >
                    <el-option
                      v-for="item in timetype"
                      :key="item.checked"
                      :label="item.text"
                      :value="item.value"
                      :disabled="item.status == '1' ? false :true"
                    />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item
                v-for="(item, index) in MealRaiseDialog.meal_config"
                :key="index"
                :label="item.title"
                class="raiseForm-item"
              >
                <DmSelect
                  v-model="MealRaiseDialog.zengzhi[item.key].price_level"
                  :selects="item.price_levels"
                  :option-params="{
                    label:'text',
                    value:'value'
                  }"
                  placeholder=""
                  class="raiseForm-input"
                  @change="changeZengzi"
                />
              </el-form-item>
            </template>
          </div>
        </CardLayout>
        <CardLayout title="订单金额">
          <div slot="layout">
            <el-form-item
              label="订单标价"
              class="raiseForm-item"
            >
              {{ MealRaiseDialog.total_price || 0 }} 元
            </el-form-item>
            <el-form-item
              label="销售优惠"
              class="raiseForm-item"
            >
              <a-input
                v-model="MealRaiseDialog.sales_amount"
                :disabled="MealRaiseDialog.order_type === 'user_refund'"
                placeholder=""
                class="raiseForm-input"
                @change="getPrice('code')"
              >
                <DmSelect
                  slot="addonBefore"
                  v-model="MealRaiseDialog.discount_sale_type"
                  :selects="sale_type"
                  :disabled="MealRaiseDialog.order_type === 'user_refund'"
                  :clearable="false"
                  placeholder=" "
                  style="width: 100px;"
                  @change="SaleTypeChange"
                />
              </a-input>
              <span
                v-if="MealRaiseDialog.diff_price_sale > 0"
                style="margin-left:20px; width: 150px; color:green"
              >
                (优惠金额:{{ MealRaiseDialog.diff_price_sale }} 元,折扣:{{ rate }})
              </span>
            </el-form-item>
            <el-form-item
              label="应付金额"
              class="raiseForm-item"
            >
              <a-input-number
                v-model="MealRaiseDialog.pay_price"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                class="raiseForm-input"
                @change="changePayPrice"
              />
            </el-form-item>
          </div>
        </CardLayout>
        <CardLayout title="支付相关">
          <div slot="layout">
            <el-form-item
              label="支付方式"
              class="raiseForm-item"
            >
              <el-radio
                v-model="MealRaiseDialog.pay_type"
                label="6"
              >欠款支付</el-radio>
            </el-form-item>
            <el-form-item
              label="订单备注"
              class="raiseForm-item"
            >
              <el-input
                v-model="MealRaiseDialog.remark"
                type="textarea"
                placeholder="请输入备注"
                class="raiseForm-input"
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
import { CountDown } from '@/utils/utils'
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      loading: false,
      MealRaiseDialog: new Form(FORM.FORM_RAISE, FORM.FORM_RAISE_RULE),
      useCoupon: false,
      is_pay_type_status3: false,
      is_pay_type_status6: false,
      rate: 1,
      order_type: defaultSetting.order_type,
      sale_type: defaultSetting.sale_type,
      timetype: [
        { text: '天', value: 'd', status: 1 }
      ],
      Meal_INFO: []
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.MealRaiseDialog.reset()
        this.$refs.Dialog.handleOpen()
        this.loading = true
        this.getDetailInfo(data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    // 获取订单详情
    async getDetailInfo(data) {
      const params = { id: data.id }
      await MealResource.customerInfo(params).then(res => {
        res['product_name'] = res['plan_setting']['meal']['product_name']
        const Expiredate = CountDown(res.expire_time, 1)
        res['expire_time'] = Expiredate
        this.MealRaiseDialog.data = res
        this.MealRaiseDialog.order_type = Number(res.phase) === 0 ? 'user_refund' : 'normal'
        const Meal = res['plan_setting']['meal_latest']
        const cfg_kuorong = res['plan_setting']['cfg']['kuorong']
        this.getMeal(Meal, cfg_kuorong)
        this.Meal_INFO = [
          { title: '套餐ID', value: res.id, unit: '' },
          { title: '关联账号', value: res.member.email, unit: '' },
          { title: '产品名称', value: res.product_name, unit: '' },
          { title: '套餐名称', value: res.plan_name, unit: '' },
          { title: '剩余时间', value: res.expire_time, unit: '' },
          { title: '套餐状态', value: res.plan_status === '2' ? '已到期' : '未到期', unit: '' }
        ]
      })
    },
    async getMeal(default_meal, cfg_kuorong) {
      const Meal = default_meal
      if (Meal) {
        const meal_detail = Meal['meal_detail']
        const zengzhi = meal_detail['zengzhi']
        const default_unit = meal_detail['meal_price']['count_unit']
        const { zengzhiList, zengzhiFiled } = FORM.getMealZengzhi(zengzhi, cfg_kuorong, default_unit)
        this.MealRaiseDialog.meal_config = zengzhiList
        this.MealRaiseDialog.zengzhi = zengzhiFiled
      }
    },
    changOderType(val) {
      this.MealRaiseDialog.sales_amount = 0
      if (val === 'user_refund') {
        this.MealRaiseDialog.discount_sale_type = 'rate'
      } else if (val === 'normal') {
        this.MealRaiseDialog.discount_sale_type = 'amount'
      }
      setTimeout(() => { if (this.MealRaiseDialog.res.meal_flag) this.getPrice() }, 500)
    },
    changeZengzi() {
      setTimeout(() => {
        this.MealRaiseDialog.sales_amount = 0
        if (this.MealRaiseDialog.order_type === 'user_refund') {
          this.MealRaiseDialog.discount_sale_type = 'rate'
        } else if (this.MealRaiseDialog.order_type === 'normal') {
          this.MealRaiseDialog.discount_sale_type = 'amount'
        }
        this.getPrice()
      }, 100)
    },
    changePayPrice(value) {
      const pay_price = this.MealRaiseDialog.pay_price
      const total_price = this.MealRaiseDialog.total_price
      const sales_amount = Number(total_price) - Number(pay_price)

      this.MealRaiseDialog.discount_sale_type = 'amount'
      this.MealRaiseDialog.sales_amount = sales_amount.toFixed(2)
      this.getPrice()
    },
    SaleTypeChange(val) {
      if (val === 'rate') {
        this.MealRaiseDialog.sales_amount = 1
      } else {
        this.MealRaiseDialog.sales_amount = 0
      }
      this.getPrice()
    },
    async getPrice(type) {
      const { no_fee, coupon_code, discount_sale_type, sales_amount, buy_time, time_unit } = this.MealRaiseDialog
      const { zengzhi, is_zengzhi } = this.getZengzhiParms()
      if (!this.getCheck(discount_sale_type, sales_amount, buy_time, is_zengzhi)) {
        this.setFieldPrice(null, false)
        return
      }
      const params = {
        'order_type': this.MealRaiseDialog.order_type,
        'buy_type': 'zengzhi',
        'buy_num': 1,
        'buy_time': parseInt(buy_time),
        'time_unit': time_unit,
        'member_id': this.MealRaiseDialog.data.member_id,
        'meal_flag': this.MealRaiseDialog.data.meal_flag,
        'plan_id': this.MealRaiseDialog.data.id,
        'remark': '增值',
        'from': 'user',
        'no_fee': no_fee,
        'zengzhi': zengzhi,
        'coupon_code': coupon_code,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      this.$refs.Dialog.resetSubmitLoading(true)
      await MealResource.getZengzhiPrice(params).then(response => {
        this.$refs.Dialog.afterValidate()
        const data = response
        if (!data['discount_sale_type']) {
          this.message.warning('价格计算失败!请检查输入项!')
        }
        this.setFieldPrice(data, true)
        this.getRate(data.pay_price, data.diff_price_sale, sales_amount, discount_sale_type)
      }).catch(() => {
        this.$refs.Dialog.afterValidate()
      })
    },
    getRate(pay_price, diff_price_sale, sales_amount, discount_sale_type) {
      let rate
      if (discount_sale_type === 'rate') {
        rate = sales_amount
      } else {
        rate = parseFloat(sales_amount / (Number(pay_price) + Number(diff_price_sale))).toFixed(4)
      }
      this.rate = (rate * 100).toFixed(2) + ' %'
    },
    // 设置金额
    setFieldPrice(data, status) {
      this.MealRaiseDialog.total_price = status ? data.total_price : 0
      this.MealRaiseDialog.pay_price = status ? data.pay_price : 0
      this.MealRaiseDialog.meal_price = status ? data.meal_price : 0
      this.MealRaiseDialog.diff_price_act = status ? data.diff_price_act : 0 // 产品折扣
      this.MealRaiseDialog.diff_price_time = status ? data.diff_price_time : 0 // 默认优惠
      this.MealRaiseDialog.diff_price_sale = status ? data.diff_price_sale : 0 // 销售优惠
      this.MealRaiseDialog.discount_sale_type = status ? data.discount_sale_type : 'amount' // 销售折扣类型
      this.MealRaiseDialog.diff_price_coupon = status ? data.diff_price_coupon : 0 // 优惠券金额
    },
    getZengzhiParms() {
      const nweZenzhi = this.MealRaiseDialog.zengzhi
      const zengzhi = {}
      let is_zengzhi = false
      for (var record in nweZenzhi) {
        if (nweZenzhi[record].price_level !== '') {
          is_zengzhi = true
          zengzhi[record] = nweZenzhi[record]
        }
      }
      return { zengzhi, is_zengzhi }
    },
    async handlePay() {
      const { no_fee, coupon_code, discount_sale_type, remark, sales_amount, pay_type, buy_time, time_unit } = this.MealRaiseDialog
      const { zengzhi, is_zengzhi } = this.getZengzhiParms()
      if (!this.getCheck(discount_sale_type, sales_amount, buy_time, is_zengzhi)) {
        this.$refs.Dialog.afterValidate()
        return
      }
      const data = {
        'order_type': this.MealRaiseDialog.order_type,
        'buy_type': 'zengzhi',
        'buy_num': 1,
        'buy_time': parseInt(buy_time),
        'time_unit': time_unit,
        'member_id': this.MealRaiseDialog.data.member_id,
        'meal_flag': this.MealRaiseDialog.data.meal_flag,
        'plan_id': this.MealRaiseDialog.data.id,
        'remark': remark,
        'from': 'user',
        'no_fee': no_fee,
        'pay_type': pay_type,
        'zengzhi': zengzhi,
        'coupon_code': this.useCoupon ? coupon_code : '',
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': this.useCoupon ? 'sale,coupon' : 'sale'
      }
      await MealResource.SaveZengzhi(data).then(response => {
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    },
    getCheck(discount_sale_type, sales_amount, buy_time, is_zengzhi) {
      let status = true
      if (discount_sale_type === 'rate' && sales_amount > 1) {
        this.message.warning('折扣不能大于1!')
        this.MealRenewDialog.sales_amount = 1
        status = false
      }
      if (isNaN(parseInt(buy_time)) || !parseInt(buy_time)) {
        this.message.warning('时长大于0的整数!')
        status = false
      }
      if (!is_zengzhi) {
        this.message.warning('请选择增值配置!')
        status = false
      }
      return status
    }
  }
}
</script>
<style lang="scss" scoped>
.raiseForm-item {
  margin-bottom: 15px;
}
.raiseForm-input {
  width: 300px;
}
</style>

