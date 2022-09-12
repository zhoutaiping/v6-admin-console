<style lang="scss" scoped>
.center_div {
  width: 100%;
  float: left;
  .center_div_title {
    width: 90px;
    margin-left: 5px;
    display: inline-block;
  }
  .center_div_value {
    width: 150px;
    height: 35px;
    display: inline-block;
  }
}
.DialogAdjustOrder-form {
  margin: 10px 0;
  .DialogAdjustOrder-item {
    display: inline-block;
  }
  .DialogAdjustOrder-input {
    width: 225px;
  }
  .DialogAdjustOrder-input-250 {
    width: 185px;
  }
  .m-b-5 {
    margin-bottom: 5px;
  }
}
.coupon-list {
  margin-bottom: 24px;
  .coupon-list-divider {
    margin: 0 12px;
  }
  .coupon-list-item {
    margin: 6px 0 6px 2px;
    border-left: 1px solid #dcdfe6;
    border-radius: 0;
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'新增调整订单'"
    width="600px"
    aside
    class="el-dialog--DialogAdjustOrder"
  >
    <DmScroll>
      <el-form
        ref="DialogAdjustOrder"
        :model="DialogAdjustOrder"
        :rules="ADJUSTORDER_RULE"
        label-position="left"
        label-width="90px"
        size="mini"
        class="DialogAdjustOrder-form"
      >
        <h3>基本信息</h3>
        <hr>
        <el-form-item
          label="用户邮箱"
          class="DialogAdjustOrder-item"
          prop="email"
        >
          <el-select
            v-model="DialogAdjustOrder.email"
            :remote-method="remoteMethod"
            :loading="user_type_loading"
            filterable=""
            remote
            clearable
            reserve-keyword
            placeholder="请输入YUNDUN注册报备邮箱"
            class="DialogAdjustOrder-input"
            @change="handleAccount"
          >
            <el-option
              v-for="(item, key) in user_type_list"
              :key="key"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item><br>
        <el-form-item
          label="套餐ID"
          class="DialogAdjustOrder-item"
          prop="id"
        >
          <el-input
            v-model="DialogAdjustOrder.id"
            clearable
            placeholder="请输入套餐ID"
            class="DialogAdjustOrder-input"
            @change="changePlanId"
          />
        </el-form-item><br>
        <el-form-item
          v-show="plan_meal.product_name"
          label="订单套餐"
          class="DialogAdjustOrder-item"
        >
          <span class="DialogAdjustOrder-input">{{ plan_meal.product_name + '--' + plan_meal.meal_name }}</span>
        </el-form-item><br>
        <h3>订单信息</h3>
        <hr>
        <el-form-item
          :rules="[{ required: true, message: '请选择订单类型', trigger: 'change' }]"
          label="订单类型"
          class="DialogAdjustOrder-item"
          prop="buy_type"
        >
          <el-select
            v-model="DialogAdjustOrder.buy_type"
            placeholder="选择订单类型"
            clearable
            class="DialogAdjustOrder-input"
            @change="changeBuytype"
          >
            <el-option
              v-for="(item,key) in BUY_TYPE"
              :key="key"
              :label="item.label"
              :value="item.value"
              :disabled="Number(item.status) === 0"
            />
          </el-select>
        </el-form-item><br>
        <create-model
          v-show="DialogAdjustOrder.buy_type === 'create' && DialogAdjustOrder.id && plan_meal.meal_flag !==''"
          :plan_meal="plan_meal"
          :create_enable="DialogAdjustOrder.buy_type === 'create' && DialogAdjustOrder.id !=='' && plan_meal.meal_flag !=='' && userMember.member_id!=='' "
          :create-model="createModel"
          @changePrice="changePrice"
        />
        <el-form-item
          label="订单标价"
          class="DialogAdjustOrder-item m-b-5"
        >
          <el-input
            v-model="DialogAdjustOrder.total_price"
            :readonly="true"
            placeholder=""
            class="DialogAdjustOrder-input"
          /> 元
        </el-form-item>
        <h3>订单优惠</h3>
        <hr>
        <el-form-item
          label="默认优惠"
          class="DialogAdjustOrder-item m-b-5"
        >
          <el-input
            v-model="DialogAdjustOrder.diff_price_time"
            :readonly="true"
            placeholder="默认优惠"
            class="DialogAdjustOrder-input"
          />
        </el-form-item>
        <el-form-item
          label="活动优惠"
          class="DialogAdjustOrder-item m-b-5"
        >
          <el-input
            v-model="DialogAdjustOrder.diff_price_act"
            :readonly="true"
            placeholder="活动优惠"
            class="DialogAdjustOrder-input"
          />
          <el-checkbox
            v-model="useAct"
            @change="changePrice"
          >使用</el-checkbox>
        </el-form-item><br>
        <el-form-item
          label="销售优惠"
          class="DialogAdjustOrder-item"
          prop="discount_sale_amount"
        >
          <el-input
            v-model="DialogAdjustOrder.discount_sale_amount"
            placeholder="销售优惠"
            class="DialogAdjustOrder-input"
            @change="changeSale"
          >
            <el-select
              slot="prepend"
              v-model="DialogAdjustOrder.discount_sale_type"
              placeholder="请选择"
              style="width:100px;"
              @change="changeSaleType"
            >
              <el-option
                v-for="(item,key) in DISCOUNT_SALE_TYPE"
                :key="key"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-input> {{ DialogAdjustOrder.discount_sale_type ==='amount' ? '元' : '' }}
          <span
            v-if="DialogAdjustOrder.diff_price_sale > 0 "
            style="margin-left:20px; width: 150px; color:green"
          >
            (优惠金额：{{ DialogAdjustOrder.diff_price_sale }} 元)
          </span>
        </el-form-item><br>
        <el-form-item
          label="优惠码优惠"
          class="DialogAdjustOrder-item m-b-5"
        >
          <el-input
            v-model="DialogAdjustOrder.coupon_code"
            placeholder="优惠码优惠"
            class="DialogAdjustOrder-input"
          />
          <el-checkbox
            v-model="useCoupon"
            @change="getCouponPrice(&quot;code&quot;)"
          >使用</el-checkbox>
          <span
            v-if="DialogAdjustOrder.diff_price_coupon > 0 "
            style="margin-left:20px; width: 150px; color:green"
          >
            (优惠金额：{{ DialogAdjustOrder.diff_price_coupon }} 元)
          </span>
        </el-form-item><br>
        <div
          v-if="DialogAdjustOrder.couponList.length > 0"
          class="coupon-list"
        >
          <span>可使用优惠券列表</span><span class="coupon-list-divider" />
          <el-radio-group
            v-model="DialogAdjustOrder.coupon_code"
            size="small"
            @change="getCouponPrice('code')"
          >
            <el-radio-button
              v-for="(v, k) in DialogAdjustOrder.couponList"
              :label="v.coupon_code"
              :key="k"
              class="coupon-list-item"
              border
            >{{ v.coupon_name }}</el-radio-button>
          </el-radio-group>
        </div><br>
        <el-form-item
          label="应付金额"
          class="DialogAdjustOrder-item"
          prop="pay_price"
        >
          <el-input-number
            v-model="DialogAdjustOrder.pay_price"
            controls-position="right"
            clearable
            placeholder="应付金额"
            class="DialogAdjustOrder-input input-number"
            @change="changePayPrice"
          />
        </el-form-item>
        <h3>支付方式</h3>
        <hr>
        <el-form-item
          label="支付方式"
          class="DialogAdjustOrder-item"
          prop="pay_type"
        >
          <el-input
            v-show="false"
            v-model="DialogAdjustOrder.pay_type"
            class="DialogAdjustOrder-input"
          />欠款支付
        </el-form-item><br>
        <el-form-item
          label="备注信息"
          class="DialogAdjustOrder-item m-b-5"
        >
          <el-input
            v-model="DialogAdjustOrder.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注信息"
            class="DialogAdjustOrder-input"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import CreateModel from '../components/createModel'
import ExpansionModelView from '../components/expansionModel'
import * as FORM from './dialogForm'
import MealResource from '@/api/mealApi'
import { throttle } from 'throttle-debounce'
import Rul from '@/utils/verify'
import FilterFlag from '@/config/filterFlag'

export default {
  components: { CreateModel, ExpansionModelView },
  data() {
    const validatePrice = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    const validateSalesPrice = (rule, value, callback) => {
      const discount_sale_type = this.DialogAdjustOrder.discount_sale_type
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字'))
      } else if (Number(value) && !isNaN(value) && discount_sale_type === 'amount') {
        callback()
      } else if (Number(value) && !isNaN(value) && discount_sale_type === 'rate') {
        if (Number(value) < 0 || Number(value) > 1) {
          callback(new Error('请输入0到1的数字'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      visible: false,
      user_type_loading: false,
      user_type_list: [],
      PAYTYPE: { 0: '默认', 1: '现金', 2: '银行转账 ', 3: '余额', 4: '微信', 5: '支付宝', 6: '欠款支付' },
      DialogAdjustOrder: { couponList: [], pay_type: '6' },
      buy_type: '', // 调整单类型
      createModel: {},
      expansionModel: {},
      BUY_TYPE: FORM.ADJUSTORDER_BUY_TYPE,
      DISCOUNT_SALE_TYPE: [
        { text: '金额', value: 'amount' }, { text: '折扣', value: 'rate' }
      ],
      ADJUSTORDER_RULE: {
        email: [{ required: true, message: '请输入YUNDUN注册账号', trigger: 'change' }],
        id: [{ required: true, message: '请输入套餐ID', trigger: 'change' }],
        buy_type: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
        pay_type: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        pay_price: [{ required: true, validator: validatePrice, trigger: 'change' }],
        discount_sale_amount: [{ required: true, validator: validateSalesPrice, trigger: 'change' }]
      },
      userMember: {}, // 用户信息
      user_plan_list: [], // 用户订单
      plan_meal: { product_name: '', meal_name: '' }, // 订单套餐
      useAct: true,
      useCoupon: false,
      is_pay_type_status3: false,
      is_pay_type_status6: false
    }
  },
  methods: {
    handleOpen() {
      this.loading = true
      this.$refs.dmdialog.handleOpen()
      this.initData()
      setTimeout(() => { this.loading = false }, 500)
    },
    initData() {
      this.useCoupon = false
      this.is_pay_type_status3 = false
      this.is_pay_type_status6 = false
      this.userMember = {}
      this.plan_meal = { product_name: '', meal_name: '' }
      this.DialogAdjustOrder = {
        buy_type: '', couponList: [], pay_type: '6',
        diff_price_time: '0', diff_price_act: '0', diff_price_coupon: '0',
        discount_sale_type: 'amount', diff_price_sale: '0', discount_sale_amount: '0'
      }
    },
    changePlanId(id) {
      this.DialogAdjustOrder.id = id.trim()
      let plan = {}
      this.DialogAdjustOrder.buy_type = ''
      this.DialogAdjustOrder.couponList = []
      this.plan_meal = { product_name: '', meal_name: '' }
      const params = {
        plan_id: id.trim()
      }
      if (id.trim()) {
        this.InvokeAllApi.get('/V4/customer.memberplan', params).then(res => {
          plan = res.plan_info
          if (plan) {
            this.plan_meal = plan.plan_setting.meal_latest || plan.plan_setting.meal || null
            // this.init_buy_type(plan)
          }
        })
      }
    },

    init_buy_type(plan) {
      const meal_latest = plan.plan_setting.meal_latest || plan.plan_setting.meal || null
      const filter_flag = FilterFlag.NOT_RENEW_FLAG // 无法续费产品
      if (meal_latest) {
        const meal = meal_latest.meal_detail || meal_latest
        const meal_operate = meal.backstage_show.meal_operate || []
        this.BUY_TYPE.forEach(item => {
          if (item.value === 'renew') { // 续费调整单
            item.status = '0'
            if (filter_flag.indexOf(plan.product_flag) < 0) item.status = '1'
          } else if (item.value !== 'create') { // 非新购调整单
            item.status = '0'
            if (meal_operate.indexOf(item.value) > -1) item.status = '1'
          }
        })
      }
    },

    changeSale(value) {
      if (this.DialogAdjustOrder.discount_sale_type !== 'amount' && (value > 1 || value < 0)) this.DialogAdjustOrder.discount_sale_amount = 1
      this.changePrice()
    },
    changeSaleType(value) {
      if (value === 'amount') {
        this.DialogAdjustOrder.discount_sale_amount = 0
      } else {
        this.DialogAdjustOrder.discount_sale_amount = 1
      }
    },
    remoteMethod(query) {
      const that = this
      if (query) {
        this.user_type_loading = true
        throttle(2000, that.getUserTypeList(query))
      } else {
        this.user_type_loading = false
        this.user_type_list = []
      }
    },

    async getUserTypeList(username) {
      if (!username.trim()) {
        this.user_type_list = []
        this.user_type_loading = false
        return
      }
      const params = {
        'username': username.trim(),
        'type': '1',
        'report': 1
      }
      const list = []
      // 获取用户列表
      const res = await MealResource.getMemberList(params)
      if (res.list !== [] || !res.list) {
        Object.keys(res.list).forEach(item => {
          list.push({
            'label': item,
            'value': res.list[item]
          })
        })
      }
      const user_type_list = username ? list.filter(this.filterMeber(username, 'label')) : []
      this.user_type_list = user_type_list
      this.user_type_loading = false
      if (!user_type_list.length) {
        this.message.warning('未找到报备用户，请确认后输入!')
        return
      }
    },
    filterMeber(username, key) {
      return (restaurant) => {
        const findIndex = restaurant[key].indexOf(username.trim())
        if (findIndex > -1) {
          return restaurant
        }
      }
    },
    handleAccount(value) {
      if (!value.trim()) {
        this.user_type_list = []
        return
      }
      const params = {
        'username': value.trim()
      }
      MealResource.AccountInfo(params).then(res => {
        this.userMember = res
        this.message.success('验证通过!')
      }).catch(e => {
        this.userMember = {}
        this.message.warning('验证不通过!')
      })
    },
    changeBuytype(value) {
      switch (value) {
        case 'create':
          this.createModel = FORM.createModel
          break
        case 'kuorong':
          this.expansionModel = FORM.expansionModel
          break
      }
    },
    getCouponPrice(type) {
      if (type === 'code' && !this.useCoupon) {
        this.useCoupon = false
        this.getCouponPrice()
        return
      }
      // 计算价格
      this.DialogAdjustOrder.discount_sale_type = 'amount' // 销售折扣类型
      this.DialogAdjustOrder.discount_sale_amount = 0
      this.changePrice('coupon')
    },
    changePayPrice(value) {
      const total_price = this.DialogAdjustOrder.total_price
      const diff_price_time = this.DialogAdjustOrder.diff_price_time
      const diff_price_act = this.DialogAdjustOrder.diff_price_act
      const diff_price_coupon = this.DialogAdjustOrder.diff_price_coupon
      const sales_amount = Number(total_price - value - diff_price_time - diff_price_act - diff_price_coupon).toFixed(2)
      this.DialogAdjustOrder.discount_sale_type = 'amount'
      this.DialogAdjustOrder.discount_sale_amount = sales_amount
      this.changePrice()
    },
    isCreateCheck() {
      const discount_sale_type = this.DialogAdjustOrder.discount_sale_type
      const sales_amount = this.diff_price_sale
      const coupon_code = this.DialogAdjustOrder.coupon_code
      const buy_num = this.createModel.meal ? this.createModel.meal.buy_num : ''
      const buy_time = this.createModel.buy_time || ''
      return this.getCheck(discount_sale_type, sales_amount, coupon_code, buy_num, buy_time)
    },
    getCreateParams() {
      const discount_used = this.getDiscountUsed()
      const params = {
        'order_type': 'adjustment',
        'buy_time': this.createModel.buy_time,
        'time_unit': this.createModel.time_unit,
        'member_id': this.userMember.member_id,
        'user_id': '',
        'meal_flag': this.plan_meal.meal_flag,
        'plan_id': this.DialogAdjustOrder.id,
        'no_fee': '0',
        'pay_type': this.DialogAdjustOrder.pay_type,
        'remark': this.DialogAdjustOrder.remark,
        'from': 'user',
        'meal': {
          'buy_num': this.createModel.buy_num || parseInt(this.createModel.meal.buy_num, 10),
          'price_level': this.createModel.meal.price_level,
          'unit': this.createModel.meal.unit
        },
        'coupon_code': this.DialogAdjustOrder.coupon_code || '',
        'discount_sale_type': this.DialogAdjustOrder.discount_sale_type,
        'discount_sale_amount': Number(this.DialogAdjustOrder.discount_sale_amount),
        'discount_used': discount_used,
        'adjustment': {
          'plan_id': this.DialogAdjustOrder.id,
          'order_start_time': this.createModel.start_time,
          'order_end_time': this.createModel.end_time
        }
      }
      return params
    },
    handleSubmit(form = 'DialogAdjustOrde') {
      let params = null
      if (this.DialogAdjustOrder.buy_type === 'create') {
        if (!this.isCreateCheck()) {
          this.setAdjustOrderPrice(false)
          this.$refs.dmdialog.afterValidate()
          return
        } else {
          params = this.getCreateParams()
        }
      }
      if (!params) {
        this.$refs.dmdialog.afterValidate()
        return
      }
      this.InvokeAllApi.post('/fd/V4/order.adjustmentorder', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.$refs.dmdialog.handleClose()
      }).catch(e => { this.$refs.dmdialog.afterValidate() })
    },
    // 计算价格
    changePrice(type) {
      let params = null
      if (this.DialogAdjustOrder.buy_type === 'create') {
        if (!this.isCreateCheck()) {
          this.setAdjustOrderPrice(false)
          return
        } else {
          params = this.getCreateParams()
        }
      }
      if (!params) return
      this.InvokeAllApi.post('/fd/V4/order.adjustmentprice', params).then(res => {
        this.setAdjustOrderPrice(true, res)
        if (type !== 'coupon') {
          // '获取未使用的优惠券'
          this.getCouponUnuse(true)
        }
      }).catch(e => { // 价格计算失败
        this.message.warning('套餐价格计算失败!')
        this.setAdjustOrderPrice(false)
      })
    },
    getCheck(discount_sale_type, sales_amount, coupon_code, buy_num, buy_time) {
      let status = true
      if (discount_sale_type === 'rate' && sales_amount > 1) {
        this.message.warning('折扣不能大于1!')
        this.DialogAdjustOrder.diff_price_sale = 1
        status = false
      }
      if (this.useCoupon && !coupon_code) {
        this.message.warning('请选择或输入优惠码!')
        status = false
      }
      let is_buy_num = true
      let is_buy_time = true
      if (this.createModel.meal_config.length) {
        this.createModel.meal_config.forEach((record) => {
          if (record.key === 'buy_num') is_buy_num = true
          if (record.key === 'buy_time') is_buy_time = true
        })
      }
      if ((parseFloat(buy_num) === 0 || parseFloat(buy_num) < 0) && is_buy_num) {
        this.message.warning('购买数量要大于0!')
        status = false
      }
      if (parseFloat(buy_num) > 0 && !Rul.plusnum.test(parseFloat(buy_num)) && is_buy_num) {
        this.message.warning('购买数量要是整数!')
        status = false
      }
      if ((parseFloat(buy_time) === 0 || parseFloat(buy_time) < 0) && is_buy_time) {
        this.message.warning('购买时间要大于0!')
        status = false
      }
      if (parseFloat(buy_time) > 0 && !Rul.plusnum.test(parseFloat(buy_time)) && is_buy_time) {
        this.message.warning('购买时间要是整数!')
        status = false
      }
      return status
    },
    // 设置价格
    setAdjustOrderPrice(status, res) {
      this.DialogAdjustOrder.total_price = status ? res.total_price || 0 : 0
      this.DialogAdjustOrder.diff_price_act = status ? res.diff_price_act || 0 : 0
      this.DialogAdjustOrder.diff_price_sale = status ? res.diff_price_sale || 0 : 0
      this.DialogAdjustOrder.discount_sale_amount = status ? res.discount_sale_amount || 0 : 0
      this.DialogAdjustOrder.diff_price_time = status ? res.diff_price_time || 0 : 0
      this.DialogAdjustOrder.diff_price_coupon = status ? res.diff_price_coupon || 0 : 0
      this.DialogAdjustOrder.pay_price = status ? res.pay_price || 0 : 0
      this.DialogAdjustOrder.discount_price_act = status ? res.discount_price_act || 0 : 0
      this.DialogAdjustOrder.discount_sale_type = status ? res.discount_sale_type || 'amount' : 'amount'
    },
    // 获取未使用的优惠券
    getCouponUnuse(status) {
      if (!status) return
      const params = {
        'order_total_price': this.DialogAdjustOrder.discount_price_act,
        'meal_flag': this.plan_meal.meal_flag,
        'member_id': this.userMember.member_id
      }
      this.DialogAdjustOrder.couponList = []
      MealResource.getCouponUnuse(params).then(response => {
        const data = response
        if (data) {
          const couponList = []
          Object.keys(data).forEach(item => {
            couponList.push(data[item])
          })
          this.DialogAdjustOrder.couponList = couponList
        }
      })
    },
    getDiscountUsed() {
      let discount_used = 'sale'
      if (this.useCoupon) discount_used = discount_used + ',coupon'
      if (this.useAct) discount_used = discount_used + ',act'
      if (this.discount_used) discount_used = discount_used + ',' + this.discount_used
      return discount_used
    }
  }
}
</script>
