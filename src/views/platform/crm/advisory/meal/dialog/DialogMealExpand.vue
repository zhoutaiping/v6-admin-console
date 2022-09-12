<template>
  <DmDialog ref="Dialog" :fetch-submit="handlePay" title="套餐扩容" aside class="yd-dialog--order">
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="MealExpandDialog"
        :model="MealExpandDialog"
        :rules="MealExpandDialog.Rules"
        size="mini"
        label-position="left"
        label-width="120px"
      >
        <a-card
          :loading="loading"
          bordered
          title="基本信息"
        >
          <a-descriptions>
            <a-descriptions-item
              v-for="item in Meal_INFO"
              :key="item.$index"
              :label="item.title"
            >{{ item.value }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card
          v-if="MealExpandDialog.data.open_bandwidth_pay === 1"
          :loading="loading"
          style="margin-top:12px;"
          bordered
          title="启用付费配置信息">
          <a-descriptions>
            <a-descriptions-item label="启用付费到期时间">{{ MealExpandDialog.data.expire_time }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card
          :loading="loading"
          style="margin-top:12px;"
          bordered
          title="已付费配置"
        >
          <a-descriptions>
            <a-descriptions-item
              v-for="item in MEAL_CONFIG_INFO"
              :key="item.$index"
              :label="item.title"
            >{{ item.value }}{{ item.unit }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card
          :loading="loading"
          bordered
          title="扩容操作"
          style="margin-top:12px;"
        >
          <el-form-item
            label="订单目的"
            class="ExpandForm-item"
          >
            <DmSelect
              v-model="MealExpandDialog.order_type"
              :selects="order_type"
              placeholder="订单目的"
              class="ExpandForm-input"
              @change="changOderType"
            />
          </el-form-item>
          <template v-if="MealExpandDialog.data.meal_flag">
            <el-form-item
              v-for="(item, index) in MealExpandDialog.meal_config"
              :key="index"
              :rules="MealExpandDialog.Rules[item.key]"
              :prop="'kuorong.' + item.key"
              :label="item.title"
              label-width="250px"
            >
              <el-input-number
                :step="item.beishu"
                :min="0"
                :ref="item.key"
                v-model="MealExpandDialog.kuorong[item.key]"
                :disabled="item.readonly"
                controls-position="right"
                class="ExpandForm-input input-number"
                @change="getRestPrice(item.key,item.beishu)"
              />
              <span style="margin-left:5px;">{{ item.unit =='num' ? '条/个/次' : item.unit }} </span>
              <span
                v-show="item.readonly"
                style="margin-left:5px;color:red;"
              >(当前已扩容到最大值)</span>
            </el-form-item>
          </template>
        </a-card>
        <CardLayout title="订单金额">
          <div slot="layout">
            <el-form-item
              label="订单价格"
              class="ExpandForm-item"
            >
              {{ MealExpandDialog.total_price || 0 }} 元
            </el-form-item>
            <el-form-item
              label="销售优惠"
              class="ExpandForm-item"
            >
              <a-input
                v-model="MealExpandDialog.sales_amount"
                :disabled="MealExpandDialog.order_type === 'user_refund'"
                placeholder=""
                class="ExpandForm-input"
                @change="getPrice('code')"
              >
                <el-select
                  slot="addonBefore"
                  v-model="MealExpandDialog.discount_sale_type"
                  :disabled="MealExpandDialog.order_type === 'user_refund'"
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
                v-if="MealExpandDialog.diff_price_sale > 0"
                style="margin-left:20px; width: 150px; color:green"
              >
                (优惠金额{{ MealExpandDialog.diff_price_sale }} 元,折扣：{{ rate }})
              </span>
            </el-form-item>
            <el-form-item
              label="应付金额"
              class="ExpandForm-item"
            >
              <a-input-number
                v-model="MealExpandDialog.pay_price"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                class="ExpandForm-input"
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
              class="ExpandForm-item"
            >
              <el-radio
                v-model="MealExpandDialog.pay_type"
                label="6"
              >欠款支付</el-radio>
            </el-form-item>
            <el-form-item
              label="订单备注"
              class="ExpandForm-item"
            >
              <el-input
                v-model="MealExpandDialog.remark"
                type="textarea"
                placeholder="请输入备注"
                class="ExpandForm-input"
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
import Rul from '@/utils/verify'
import { CountDown } from '@/utils/utils'
import defaultSetting from '@/core/defaultSetting'
export default {
  components: {},
  data() {
    return {
      MealExpandDialog: new Form(FORM.FORM_NEWPACKAGE, FORM.FORM_NEWPACKAGE_RULE),
      useCoupon: false,
      loading: false,
      is_pay_type_status3: false,
      is_pay_type_status6: false,
      rate: 1,
      order_type: defaultSetting.order_type,
      discount_sale_type: [
        { text: '折扣', value: 'rate' }, { text: '金额', value: 'amount' }
      ],
      Meal_INFO: [],
      MEAL_CONFIG_INFO: []
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.MealExpandDialog.reset()
        this.$refs.Dialog.handleOpen()
        this.loading = true
        this.getDetailInfo(data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    // 获取订单详情
    async getDetailInfo(rowData) {
      this.Meal_INFO = []
      const params = { id: rowData.id }
      await MealResource.customerInfo(params).then(response => {
        const data = response
        data['product_name'] = data['plan_setting']['meal']['product_name']
        const Expiredate = CountDown(data.expire_time, 1)
        data['expire_time'] = Expiredate
        this.MealExpandDialog.data = data
        this.MealExpandDialog.order_type = Number(data.phase) === 0 ? 'user_refund' : 'normal'
        this.getMeal(data.product_flag, data.meal_flag, data['plan_setting']['cfg']['kuorong'], data['plan_setting']['meal_latest'])
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
    async getMeal(product_flag, meal_flag, default_kuorong, default_meal) {
      const Meal = default_meal
      if (Meal) {
        const meal_detail = Meal['meal_detail'] // JSON.parse(Meal['meal_detail'])
        const { meal_config, newKuorong } = await this.setnewPackageMealConfig(meal_detail['kuorong'], meal_detail['meal_price']['count_unit'], this.MealExpandDialog, default_kuorong)
        const rules = await this.SetNewPackageRules(meal_detail['kuorong'], default_kuorong)
        if (rules) {
          this.MealExpandDialog.Rules = rules
          this.MealExpandDialog.kuorong = newKuorong
          this.MealExpandDialog.meal_config = meal_config
          this.MEAL_CONFIG_INFO = FORM.getDefault_Kuorong_Info(meal_detail['kuorong'], default_kuorong) // 套餐配置详情
          this.useCoupon = false
          this.MealExpandDialog.coupon_code = ''
        }
      }
    },
    changOderType(val) {
      this.MealExpandDialog.sales_amount = 0
      if (val === 'user_refund') {
        this.MealExpandDialog.discount_sale_type = 'rate'
      } else if (val === 'normal') {
        this.MealExpandDialog.discount_sale_type = 'amount'
      }
      setTimeout(() => { if (this.MealExpandDialog.data.meal_flag) this.getPrice() }, 500)
    },
    getRestPrice(ref, beishu) {
      setTimeout(() => {
        const refValue = this.MealExpandDialog.kuorong[ref]
        const NewValue = Math.ceil(refValue / beishu) * beishu
        this.MealExpandDialog.kuorong[ref] = NewValue
        this.MealExpandDialog.sales_amount = 0
        if (this.MealExpandDialog.order_type === 'user_refund') {
          this.MealExpandDialog.discount_sale_type = 'rate'
        } else if (this.MealExpandDialog.order_type === 'normal') {
          this.MealExpandDialog.discount_sale_type = 'amount'
        }
        this.getPrice()
      }, 0)
    },
    async getPrice() {
      if (!this.handleRuleItemCheck()) {
        this.setFieldPrice(null, false)
        return
      }
      const { no_fee, coupon_code, discount_sale_type, sales_amount } = this.MealExpandDialog
      if (!this.getCheck(discount_sale_type, sales_amount)) {
        this.setFieldPrice(null, false)
        return
      }
      const { NewkuoRong, is_kuorong } = this.getKuorongParms()
      if (!is_kuorong) {
        this.message.warning('请输入要扩容的配置!')
        this.MealExpandDialog.pay_price = 0
        this.setFieldPrice(null, false)
        return
      }
      const data = {
        'order_type': this.MealExpandDialog.order_type,
        'buy_type': 'kuorong',
        'member_id': this.MealExpandDialog.data.member_id,
        'meal_flag': this.MealExpandDialog.data.meal_flag,
        'plan_id': this.MealExpandDialog.data.id,
        'remark': '扩容',
        'from': 'user',
        'no_fee': no_fee,
        'kuorong': NewkuoRong,
        'coupon_code': coupon_code,
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': 'sale'
      }
      this.$refs.Dialog.resetSubmitLoading(true)
      await MealResource.getKuorongPrice(data).then(res => {
        this.$refs.Dialog.afterValidate()
        if (!res['discount_sale_type']) this.message.warning('价格计算失败!请检查输入项!')
        this.setFieldPrice(res, true)
        this.getRate(res.pay_price, res.diff_price_sale, sales_amount, discount_sale_type)
      }).catch(() => {
        this.$refs.Dialog.afterValidate()
      })
    },

    // 设置金额
    setFieldPrice(data, status) {
      this.MealExpandDialog.total_price = status ? data.total_price || 0 : 0
      this.MealExpandDialog.pay_price = status ? data.pay_price || 0 : 0
      this.MealExpandDialog.meal_price = status ? data.meal_price || 0 : 0
      this.MealExpandDialog.diff_price_act = status ? data.diff_price_act || 0 : 0// 产品折扣
      this.MealExpandDialog.diff_price_time = status ? data.diff_price_time || 0 : 0// 默认优惠
      this.MealExpandDialog.diff_price_sale = status ? data.diff_price_sale || 0 : 0 // 销售优惠
      this.MealExpandDialog.discount_sale_type = status ? data.discount_sale_type || 'amount' : 'amount' // 销售折扣类型
      this.MealExpandDialog.diff_price_coupon = status ? data.diff_price_coupon || 0 : 0 // 优惠券金额
      if (!status) return
    },
    // 支付金额  销售优惠 销售折扣 优惠类型
    getRate(pay_price, diff_price_sale, sales_amount, discount_sale_type) {
      let rate
      if (discount_sale_type === 'rate') {
        rate = sales_amount
      } else {
        rate = parseFloat(sales_amount / (Number(pay_price) + Number(diff_price_sale))).toFixed(4)
      }
      this.rate = (Number(rate) * 100).toFixed(2) + ' %'
    },

    // 获取未使用的优惠券
    getCouponUnuse(status) {
      // '获取未使用的优惠券')
      if (!status) return
      const params = {
        'order_total_price': this.MealExpandDialog.total_price,
        'meal_flag': this.MealExpandDialog.data.meal_flag,
        'member_id': this.MealExpandDialog.data.member_id
      }
      MealResource.getCouponUnuse(params).then(response => {
        const data = response
        this.MealExpandDialog.couponList = []
        if (data) {
          const couponList = []
          Object.keys(data).forEach(item => {
            couponList.push(data[item])
          })
          this.MealExpandDialog.couponList = couponList
        }
      })
    },

    getCouponPrice(type) {
      if (!this.useCoupon && type === 'code') return
      if (type === 'code' && !this.MealExpandDialog.coupon_code) {
        this.message.warning('请选择或输入优惠码!')
        return
      }
      // 计算价格
      this.getPrice('coupon')
    },
    async SetNewPackageRules(default_fields, default_kuorong) {
      const rules = {}
      const that = this
      if (default_fields) {
        Object.keys(default_fields).forEach(record => {
          const field = default_fields[record]
          const default_buy_num = default_kuorong[record] ? default_kuorong[record]['buy_num'] : 0
          if (field) {
            const max = parseFloat(field['limit_max']) > 0 ? parseFloat(field['limit_max']) * field['limit_beishu'] - default_buy_num : 0
            const text = max ? '可扩容数量' + max : ''
            const min = field['limit_beishu']
            const rulesObj = [
              {
                validator:
                  that.validatorNumber(field['default'], field['limit_beishu'], max, record),
                message: '请填写' + field['limit_beishu'] + '的倍数!' + text + '最小数量' + min,
                trigger: 'blur'
              }
            ]
            rules[record] = rulesObj
          }
        })
      }
      return rules
    },

    validatorNumber(min, beishu, max, record) {
      return function intvalValidate(rule, value, callback) {
        const val = parseFloat(value)
        const val_plusnum = Rul.plusnum.test(val)
        if (val < 0 || val > 0 && !val_plusnum) callback(new Error())
        if (max && max > 0 && val > max) {
          callback(new Error())
        } else {
          if (val > min) {
            if (val % beishu === 0) {
              callback()
            } else {
              callback(new Error())
            }
          } else if (val === min * beishu) {
            callback()
          } else {
            callback(new Error())
          }
        }
      }
    },

    async setnewPackageMealConfig(default_fields, default_unit, form, default_kuorong) {
      const meal_config = []
      const newKuorong = {}
      if (default_fields && Object.keys(default_fields)) {
        Object.keys(default_fields).forEach(record => {
          const field = default_fields[record]
          const default_buy_num = default_kuorong[record] ? parseFloat(default_kuorong[record]['buy_num']) : 0
          if (field && Object.keys(field)) {
            const max_buy_num = parseFloat(field['limit_max']) > 0 ? parseFloat(field['limit_max']) * field['limit_beishu'] - default_buy_num : 0
            const config_item = {
              title: field['title'],
              beishu: Number(field['limit_beishu'] || 1),
              value: Number(field['default'] || 0),
              key: record,
              unit: field['unit'] || '',
              readonly: parseFloat(field['limit_max']) > 0 ? max_buy_num <= 0 : false
            }
            newKuorong[record] = Number(field['default'] || 0)
            meal_config.push(config_item)
          }
        })
      }
      return { meal_config, newKuorong }
    },

    async handlePay() {
      const { no_fee, coupon_code, discount_sale_type, remark, sales_amount, pay_type } = this.MealExpandDialog
      if (!this.getCheck(discount_sale_type, sales_amount)) return
      if (!this.handleRuleItemCheck()) return
      const { NewkuoRong, is_kuorong } = this.getKuorongParms()
      if (!is_kuorong) {
        this.message.warning('请输入要扩容的配置!')
        this.$refs.Dialog.afterValidate()
        return
      }
      const data = {
        'order_type': this.MealExpandDialog.order_type,
        'buy_type': 'kuorong',
        'member_id': this.MealExpandDialog.data.member_id,
        'meal_flag': this.MealExpandDialog.data.meal_flag,
        'plan_id': this.MealExpandDialog.data.id,
        'remark': remark,
        'from': 'user',
        'no_fee': no_fee,
        'kuorong': NewkuoRong,
        'pay_type': pay_type,
        'coupon_code': this.useCoupon ? coupon_code : '',
        'discount_sale_type': discount_sale_type,
        'discount_sale_amount': sales_amount,
        'discount_used': this.useCoupon ? 'sale,coupon' : 'sale'
      }
      await MealResource.SaveKuorongPay(data).then(response => {
        this.loading = false
        this.message.success('扩容成功!')
        this.$emit('on-success')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    },
    handleRuleItemCheck() {
      try {
        this.$refs['MealExpandDialog'].validate(valid => {
          if (!valid) throw new Error()
        })
      } catch (e) {
        return false
      }
      return true
    },
    getKuorongParms() {
      const NewkuoRong = {}
      let is_kuorong = false
      const kuorongObj = this.MealExpandDialog.kuorong
      if (kuorongObj && Object.keys(kuorongObj).length) {
        Object.keys(kuorongObj).forEach(record => {
          if (kuorongObj[record]) is_kuorong = true
          NewkuoRong[record] = { buy_num: kuorongObj[record] || 0 }
        })
      }
      return { NewkuoRong, is_kuorong }
    },

    changePayPrice(value) {
      // 支付金额  销售优惠 销售折扣 优惠类型
      const pay_price = this.MealExpandDialog.pay_price
      const total_price = this.MealExpandDialog.total_price
      const sales_amount = Number(total_price) - Number(pay_price)
      this.MealExpandDialog.discount_sale_type = 'amount'
      this.MealExpandDialog.sales_amount = sales_amount.toFixed(2)
      this.MealExpandDialog.diff_price_sale = sales_amount.toFixed(2)
      this.getPrice()
    },

    SaleTypeChange(val) {
      if (val === 'rate') {
        this.MealExpandDialog.sales_amount = 1
      } else {
        this.MealExpandDialog.sales_amount = 0
      }
      this.getPrice()
    },

    getCheck(discount_sale_type, sales_amount) {
      let status = true
      if (discount_sale_type === 'rate' && sales_amount > 1) {
        this.message.warning('折扣不能大于1!')
        this.MealExpandDialog.sales_amount = 1
        status = false
      }
      return status
    }
  }
}
</script>
<style lang="scss" scoped>
.ExpandForm-item {
  margin-bottom: 5px;
}
.ExpandForm-input {
  width: 300px;
}
</style>

