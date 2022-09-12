<style lang="scss" scoped>
@import "./form.scss";
</style>
<style lang="scss">
.el-slider__runway {
  margin: 0;
}
</style>
<template>
  <FDialog
    :close-on-click-modal="false"
    :visible.sync="open"
    title="试用延期"
    size="500"
    aside
  >
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="Retry"
        :model="Retry"
        :rules="rules"
        size="mini"
        label-position="left"
        label-width="120px"
        class="form"
      >
        <el-form-item
          class="form-item-b"
          label-width="0px"
        >
          <a-steps
            :current="active"
            size="small"
          >
            <a-step
              v-for="item in stepOp"
              :key="item"
              :title="item"
            />
          </a-steps>
        </el-form-item>
        <div v-show="Number(active) === 1">
          <CardLayout title="用户信息">
            <div slot="layout">
              <el-form-item
                label="用户账号"
                class="form-item"
              >
                <div
                  v-if="basic_info.message"
                  class="title-color-red"
                > {{ basic_info.message }} </div>
                <div v-else> {{ basic_info.email || '--' }} </div>
              </el-form-item>
              <el-form-item
                label="认证名称"
                class="form-item"
              >
                <div
                  v-if="certify_info.message"
                  class="title-color-red"
                > {{ certify_info.message }} </div>
                <div v-else> {{ certify_info.certify_name || '--' }} </div>
              </el-form-item>
              <el-form-item
                label="报备名称"
                class="form-item"
              >
                <div
                  v-if="basic_info.message"
                  class="title-color-red"
                > {{ basic_info.message }} </div>
                <div v-else> {{ basic_info.member_name || '--' }} </div>
              </el-form-item>
              <el-form-item
                label="所属销售"
                class="form-item"
              >{{ getSalesText() }}</el-form-item>
              <el-form-item
                label="客户层级"
                class="form-item"
              >
                <div
                  v-if="!basic_info.member_type"
                  class="title-color-red"
                > -- </div>
                <div v-else> {{ basic_info.member_type || '--' }} </div>
              </el-form-item>
              <el-form-item
                label="渠道邮箱"
                class="form-item"
              >
                <div
                  v-if="Number(agent_flag)=== 0"
                  class="title-color-red"
                > 无 </div>
                <div
                  v-else-if="agent_basic_info.message"
                  class="title-color-red"
                > {{ agent_basic_info.message }} </div>
                <div v-else> {{ agent_basic_info.email || '--' }} </div>
              </el-form-item>
              <el-form-item
                label="渠道认证名称"
                class="form-item"
              >
                <div
                  v-if="Number(agent_flag)=== 0"
                  class="title-color-red"
                > 无 </div>
                <div
                  v-else-if="agent_basic_info.message"
                  class="title-color-red"
                > {{ agent_basic_info.message }} </div>
                <div v-else> {{ agent_basic_info.member_name || '--' }} </div>
              </el-form-item>
            </div>
          </CardLayout>
        </div>
        <div v-show="active === 2">
          <CardLayout title="延期配置">
            <div slot="layout">
              <el-form-item
                label="套餐ID"
                class="form-item"
              >
                {{ rowData.id }}
              </el-form-item>
              <el-form-item
                label="套餐名称"
                class="form-item"
              >
                {{ rowData.product_name +'--' + rowData.plan_name }}
              </el-form-item>
              <el-form-item
                label="到期时间"
                class="form-item"
              >
                <div class="title-color-red">{{ rowData.expire_time }}</div>
              </el-form-item>
              <el-form-item
                label="延期时长"
                prop="buy_time"
                class="form-item"
              >
                {{ Retry.buy_time }} {{ time_unit_text[Retry.time_unit] }}
                <el-slider
                  v-model="Retry.buy_time"
                  :max="max_time[Retry.time_unit]"
                  show-stops
                  class="inline-box"
                  style="width:200px; margin-left: 10px;"
                  @change="getRetryPrice"
                />
                <el-select
                  v-model="Retry.time_unit"
                  style="width:60px; position: relative; margin-left: 10px;"
                  @change="getRetryPrice"
                >
                  <el-option
                    label="日"
                    value="d"
                  />
                  <el-option
                    label="月"
                    value="m"
                  />
                  <el-option
                    label="年"
                    value="y"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="延期标价"
                class="form-item"
              >{{ Retry.total_price }} 元</el-form-item>
              <el-form-item
                label="延期次数"
                class="form-item"
              >{{ try_delay_num }} 次</el-form-item>
            </div>
          </CardLayout>
          <CardLayout title="订单优惠">
            <div slot="layout">
              <el-form-item
                label="默认优惠"
                class="form-item"
                prop="diff_price_time"
              >
                <el-input
                  v-model="Retry.diff_price_time"
                  readonly
                  class="form-input"
                />元
              </el-form-item>
              <el-form-item
                label="产品折扣"
                prop="diff_price_act"
                class="form-item"
              >
                <el-input
                  v-model="Retry.diff_price_act"
                  class="form-input"
                />元
                <el-checkbox
                  v-model="Retry.useAct"
                  @change="changeSale('act')"
                >使用</el-checkbox>
              </el-form-item>
              <el-form-item
                label="优惠码"
                prop="coupon_code"
                class="form-item"
              >
                <el-input
                  v-model="Retry.coupon_code"
                  class="form-input"
                />
                <el-checkbox v-model="Retry.useCoupon">使用</el-checkbox>
              </el-form-item>
              <el-form-item
                label="销售优惠"
                prop="discount_sale_amount"
              >
                <el-input
                  v-model="Retry.discount_sale_amount"
                  type="age"
                  autocomplete="off"
                  class="form-input-200 inline-box"
                  @change="changeSale('amount')"
                />
                {{ Retry.discount_sale_type === 'amount' ? '元':'折' }}
                <el-select
                  v-model="Retry.discount_sale_type"
                  style="width:70px; margin-left: 5px;"
                  @change="changeSale('type')"
                >
                  <el-option
                    label="金额"
                    value="amount"
                  />
                  <el-option
                    label="折扣"
                    value="rate"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="应付金额"
                prop="pay_price"
              >
                <a-input-number
                  v-model="Retry.pay_price"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  class="form-input"
                  @blur="e =>{changeSale('pay')}"
                />
                元
              </el-form-item>
            </div>
          </CardLayout>
        </div>
        <div v-show="active === 3">
          <CardLayout title="延期信息">
            <div slot="layout">
              <el-form-item
                label="用户账号"
                class="form-item"
              >{{ basic_info.email }}</el-form-item>
              <el-form-item
                label="套餐名称"
                class="form-item"
              >{{ rowData.product_name +'--' + rowData.plan_name }}</el-form-item>
              <el-form-item
                label="延期时间"
                class="form-item"
              >{{ Retry.buy_time }} {{ time_unit_text[Retry.time_unit] }}</el-form-item>
            </div>
          </CardLayout>
          <CardLayout title="支付相关">
            <div slot="layout">
              <el-form-item
                label="支付邮箱"
                class="form-item"
              > {{ pay_email }} </el-form-item>
              <el-form-item
                label="应付金额"
                class="form-item"
              > {{ Retry.pay_price }} 元</el-form-item>
              <el-form-item
                label="邮箱余额"
                class="form-item"
              > {{ total_balance }} 元</el-form-item>
              <el-form-item
                label="支付方式"
                prop="pay_type"
                class="form-item"
              >
                <el-radio
                  v-model="Retry.pay_type"
                  :label="6"
                >欠款支付</el-radio>
              </el-form-item>
              <el-form-item
                label="延期说明"
                prop="remark"
                class="form-item"
              >
                <el-input
                  v-model="Retry.remark"
                  type="textarea"
                  class="form-input"
                />
              </el-form-item>
            </div>
          </CardLayout>
        </div>
      </el-form>
    </DmScroll>
    <div slot="footer">
      <el-button
        v-show="active > 1"
        type="primary"
        size="mini"
        @click="nextActive"
      >上一步</el-button>
      <el-button
        v-show="active !== 3"
        type="primary"
        size="mini"
        @click="nextActive('add')"
      >下一步</el-button>
      <el-button
        type="info"
        size="mini"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        v-show="active === 3"
        :disabled="loading"
        type="primary"
        size="mini"
        @click="handleSubmit"
      >确 定</el-button>
    </div>
  </FDialog>
</template>
<script>
import * as Retry from './Retry'
export default {
  components: {},
  props: {},
  data() {
    const checkTime = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('请选择延期时长'))
      } else {
        callback()
      }
    }
    const checkSaleNumber = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入数字'))
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字'))
      } else if (Number(value) < 0 && this.Retry.discount_sale_type === 'rate') {
        callback(new Error('请输入大于数字'))
      } else {
        if (this.Retry.discount_sale_type === 'rate' && (Number(value) > 1 || Number(value) < 0)) {
          callback(new Error('请输入0~1的数字'))
        } else {
          callback()
        }
      }
    }
    const checkNumber = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入数字'))
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      open: false,
      loading: false,
      rowData: {},
      active: 1,
      stepOp: ['基本信息', '延期详情', '确认开通'],
      time_unit_text: { 'm': '月', 'y': '年' },
      Retry: {
        order_type: 'user_refund', // 试用订单
        buy_type: 'retry', // 试用订单
        buy_time: 1, // 购买时长 数量
        time_unit: 'm', // 购买时长 单位
        user_id: 0,
        member_id: '', // 用户id
        plan_id: '', // 套餐id
        remark: '', // 备注
        from: 'user', // 来源
        no_fee: 0, // 是否免费
        diff_price_time: 0, // 默认优惠
        diff_price_act: 0, // 折扣优惠
        useAct: true,
        discount_sale_type: 'rate', // 销售优惠类型
        discount_sale_amount: 0, // 销售优惠-金额
        discount_used: '', // 优惠类型
        coupon_code: '', // 优惠券号码
        useCoupon: false,
        pay_price: 0,
        total_price: 0,
        pay_type: 6 // 支付类型
      },
      rules: {
        order_type: [],
        buy_time: [{ type: 'number', validator: checkTime, required: true }],
        time_unit: [],
        remark: [],
        coupon_code: [],
        diff_price_time: [],
        diff_price_act: [],
        useAct: [],
        useCoupon: [],
        discount_sale_type: [],
        discount_sale_amount: [{ required: true, validator: checkSaleNumber }],
        total_price: [],
        pay_price: [{ required: true, validator: checkNumber }],
        pay_type: [{ required: true, message: '请选择支付方式', trigger: ['change'] }]
      },
      max_time: { 'd': 30, 'm': 10, 'y': 10 },
      Retry_TIEM_OP: Retry.Retry_TIEM_OP, // 延期转正时长
      basic_info: {},
      certify_info: {}, // 认证
      agent_basic_info: {}, // 代理
      agent_certify_info: {},
      top_agent_member_email: '', // 代理邮箱
      agent_flag: 0, // 是否报备,
      try_delay_num: 0,
      pay_email: '',
      total_balance: 0
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.open = true
        setTimeout(() => { this.resetForm('Retry') }, 0)
        this.loading = true
        this.rowData = Object.assign({}, data)
        this.active = 1
        this.getCustomerinfo(data.member.email || '')
        this.getRetryNum({ plan_id: data.id })
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    async getCustomerinfo(email) { // 客户信息
      if (!email) return
      await this.InvokeAllApi.post('/fd/V4/order.customerinfo', {
        email: email
      }).then(res => {
        const basic_info = res.basic_info
        this.agent_flag = res.agent_flag
        this.basic_info = Object.assign({}, basic_info.message || basic_info.info || {})
        this.certify_info = Object.assign({}, res.certify_info)
        this.agent_basic_info = Object.assign({}, res.agent_basic_info.info || {})
        this.agent_certify_info = Object.assign({}, res.agent_certify_info)
        this.top_agent_member_email = res.top_agent_member_email
        this.pay_email = res.pay_email
        this.total_balance = res.total_balance
      })
    },
    async getRetryNum(params) {
      await this.InvokeAllApi.post('/fd/V4/order.retry_num', params).then(res => {
        this.try_delay_num = res.try_delay_num || 0
      })
    },
    getSalesText() {
      const basic_info = this.basic_info
      let text = ''
      if (Object.keys(basic_info).length && basic_info.user_name) text = (basic_info.user_name).join('，') || '--'
      return text
    },
    nextActive(type) {
      const is_check = this.getCheck()
      let active = JSON.parse(JSON.stringify(Number(this.active)))
      if (type === 'add') {
        if (active === 2 && !is_check) {
          return
        }
        active = active + 1
        this.active = active
      } else {
        active = active - 1
        this.active = active
      }
      if (this.active === 2 && type === 'add') this.getRetryPrice()
    },
    getCheck() {
      let status = false
      this.$refs['Retry'].validate((valid) => {
        status = valid
      })
      return status
    },
    getRetryPrice() {
      const params = {
        'order_type': 'user_refund', // 试用订单
        'buy_type': 'retry', // 试用
        'buy_time': this.Retry.buy_time, // 购买时长 数量
        'time_unit': this.Retry.time_unit, // 购买时长 单位
        'user_id': 0,
        'member_id': this.rowData.member_id, // 用户id
        'plan_id': this.rowData.id, // 套餐id
        'from': 'user', // 来源
        'no_fee': 0, // 是否免费
        'coupon_code': this.Retry.coupon_code, // 优惠券号码
        'discount_sale_type': this.Retry.discount_sale_type, // 销售优惠 - 数量
        'discount_sale_amount': this.Retry.discount_sale_amount, // 销售优惠 - 金额
        'discount_used': this.getDiscountUsed() // 优惠类型
      }
      if (this.Retry.buy_time === 0) return
      if (!this.getCheck()) return
      this.InvokeAllApi.post('/fd/V4/order.retry_price', params).then(res => {
        this.Retry.diff_price_time = res.diff_price_time
        this.rowData.expire_time = res.expire_time
        this.Retry.diff_price_act = res.diff_price_act
        this.Retry.diff_price_coupon = res.diff_price_coupon
        this.Retry.discount_sale_amount = res.discount_sale_amount
        this.Retry.total_price = res.total_price
        this.Retry.pay_price = res.pay_price
        // if (!this.Retry.coupon_code) this.getCouponUnuse() // 获取优惠券
      })
    },
    changeSale(type) {
      if (type === 'type') {
        if (this.Retry.discount_sale_type === 'rate') this.Retry.discount_sale_amount = 0
        if (this.Retry.discount_sale_type === 'amount') this.Retry.discount_sale_amount = this.Retry.total_price
      }
      if (type === 'pay') {
        const total_price = this.Retry.total_price
        const diff_price_time = this.Retry.diff_price_time
        const diff_price_act = this.Retry.diff_price_act
        const diff_price_coupon = this.Retry.diff_price_coupon
        const pay_price = this.Retry.pay_price
        const sales_amount = Number(total_price - pay_price - diff_price_time - diff_price_act - diff_price_coupon).toFixed(2)
        this.Retry.discount_sale_type = 'amount'
        this.Retry.discount_sale_amount = sales_amount
      }
      this.getRetryPrice()
    },
    async getCouponUnuse() { // 获取优惠券
      const params = {
        'order_total_price': this.Retry.discount_price_act,
        'meal_flag': this.Retry.meal_flag,
        'member_id': this.rowData.member_id
      }
      await this.InvokeAllApi.post('/fd/V4/order.coupon.unuse', params).then(res => {
      })
    },
    getDiscountUsed() { // 价格优惠类型
      const discount_used = ['sale', 'time']
      if (this.Retry.useAct) discount_used.push('act')
      if (this.Retry.useCoupon) discount_used.push('coupon')
      return discount_used.join(',')
    },
    resetForm(formName) {
      if (this.$refs.Retry) {
        this.$refs.Retry.resetFields()
        this.basic_info = {}
        this.certify_info = {}
        this.agent_basic_info = {}
        this.agent_certify_info = {}
        this.agent_flag = 0
        this.top_agent_member_email = ''
        this.try_delay_num = 0
        this.pay_email = ''
        this.total_blance = 0
        this.Retry.discount_sale_type = 'rate' // 销售优惠类型
        this.Retry.discount_sale_amount = 0
      }
    },
    handleClose() {
      this.open = false
    },
    handleSubmit() {
      const params = {
        'order_type': 'user_refund', // 试用订单
        'buy_type': 'retry', // 试用
        'buy_time': this.Retry.buy_time, // 购买时长 数量
        'time_unit': this.Retry.time_unit, // 购买时长 单位
        'user_id': 0,
        'member_id': this.rowData.member_id, // 用户id
        'plan_id': this.rowData.id, // 套餐id
        'from': 'user', // 来源
        'no_fee': 0, // 是否免费
        'remark': this.Retry.remark, // 是否免费
        'coupon_code': this.Retry.coupon_code, // 优惠券号码
        'discount_sale_type': this.Retry.discount_sale_type, // 销售优惠 - 数量
        'discount_sale_amount': this.Retry.discount_sale_amount, // 销售优惠 - 金额
        'discount_used': this.getDiscountUsed() // 优惠类型
      }
      if (this.Retry.buy_time === 0) return
      if (!this.getCheck()) return
      this.loading = true
      this.InvokeAllApi.post('/fd/V4/order.retry_pay', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('fetchData')
        this.loading = false
        this.open = false
      }).catch(e => { this.loading = false })
    }
  }
}
</script>
