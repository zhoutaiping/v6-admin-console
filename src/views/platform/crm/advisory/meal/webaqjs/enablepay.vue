<style lang="scss" scoped>
@import "./form.scss";
</style>
<template>
  <FDialog
    :close-on-click-modal="false"
    :visible.sync="open"
    title="启用付费版"
    size="600"
    aside
  >
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="BuyForm"
        :model="BuyForm"
        :rules="rules"
        size="mini"
        label-position="right"
        label-width="120px"
        class="form"
      >
        <el-form-item label-width="0px">
          <a-steps :current="active" size="small" >
            <a-step
              v-for="item in stepOp"
              :key="item"
              :title="item"
            />
          </a-steps>
        </el-form-item>
        <div v-show="Number(active) === 1">
          <CardLayout title="基本信息">
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
                > 暂无，请先完成客户报备 </div>
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
          <CardLayout title="选择套餐">
            <div slot="layout">
              <el-form-item
                label="开通目的"
                prop="order_type"
              >
                <el-select
                  v-model="BuyForm.order_type"
                  class="form-input"
                  @change="changOderType"
                >
                  <el-option
                    label="正式开通"
                    value="normal"
                  />
                  <el-option
                    label="试用开通"
                    value="user_refund"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="选择产品"
                prop="product_flag"
              >
                <el-select
                  v-model="BuyForm.product_flag"
                  class="form-input"
                >
                  <el-option
                    v-for="(item, index) in PRODUCT"
                    :key="index"
                    :label="item.product_name"
                    :value="item.product_flag"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="选择套餐"
                prop="meal_flag"
              >
                <el-select
                  v-model="BuyForm.meal_flag"
                  filterable
                  class="form-input"
                  @change="changeMeal"
                >
                  <el-option
                    v-for="(item, index) in MEAL"
                    :key="index"
                    :label="item.meal_name"
                    :value="item.meal_flag"
                    :disabled="Number(item.status)!== 1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="实例名称"
                prop="plan_diy_name"
                class="form-item"
              >
                <el-input
                  v-model="BuyForm.plan_diy_name"
                  placeholder="请输入实例名称"
                  class="form-input"
                />
              </el-form-item>
              <template v-if="BuyForm.meal_flag.length">
                <el-form-item
                  v-for="(item, index) in BuyForm.meal_config"
                  :key="item.key"
                  :label="item.title"
                  :prop="item.key"
                >
                  <div v-if="item.key === 'buy_time'">
                    <div v-if="item.valueType !== 'array'">
                      <el-input
                        ref="buy_time"
                        v-model="BuyForm[item.key]"
                        :readonly="item.readonly"
                        class="form-input"
                        @change="getMealPrice"
                      >
                        <el-select
                          slot="append"
                          v-model="BuyForm.time_unit"
                          style="width:100px;"
                          @change="getMealPrice"
                        >
                          <el-option
                            v-for="time in timetype"
                            :key="time.checked"
                            :label="time.text"
                            :value="time.value"
                            :disabled="Number(time.status) !==1"
                          />
                        </el-select>
                      </el-input>
                    </div>
                    <div v-if="item.valueType === 'array'">
                      <el-select
                        slot="append"
                        v-model="BuyForm.buy_time"
                        style="width:100px;"
                        @change="getMealPrice"
                      >
                        <el-option
                          v-for="(record, record_index) in item.value"
                          :key="record_index"
                          :label="record"
                          :value="record"
                        />
                      </el-select>
                      <el-select
                        slot="append"
                        v-model="BuyForm.time_unit"
                        style="width:100px;"
                        @change="getMealPrice"
                      >
                        <el-option
                          v-for="time in timetype"
                          :key="time.checked"
                          :label="time.text"
                          :value="time.value"
                          :disabled="Number(time.status) !==1"
                        />
                      </el-select>
                    </div>
                  </div>
                  <div v-else-if="item.key === 'buy_num'">
                    <el-input-number
                      v-if="BuyForm.product_flag !=='TS'"
                      v-model="BuyForm[item.key]"
                      :min="Number(item.beishu) || 0"
                      :step="Number(item.beishu)"
                      :disabled="item.readonly"
                      controls-position="right"
                      placeholder="请输入"
                      class="form-input input-number"
                      @change="fieldValueChange(BuyForm[item.key], Number(item.beishu))"
                    />
                    <span
                      v-if="BuyForm.product_flag !=='TS'"
                      style="margin-left:10px;"
                    >{{ item.unit =='num' ? '个' : item.unit }}</span>
                    <span v-if="item.default_value">基础配置：{{ "&nbsp;&nbsp;"+ item.default_value+"&nbsp;&nbsp;" }}{{ item.unit }}</span>
                  </div>
                  <div v-else>
                    <div v-if="item.valueType === 'array'">
                      <el-select
                        v-model="BuyForm[item.key]"
                        class="form-input input-number"
                        @change="getMealPrice"
                      >
                        <el-option
                          v-for="(record, r_index) in item.value"
                          :key="r_index"
                          :label="record.title"
                          :value="record.value"
                        />
                      </el-select>
                    </div>
                    <div v-if="item.valueType !== 'array'">
                      <el-input-number
                        v-model="BuyForm[item.key]"
                        :readonly="item.readonly"
                        placeholder="请输入"
                        class="form-input input-number"
                        @change="getMealPrice"
                      />
                      <span style="margin-left:5px;">{{ item.unit =='min' ? '分钟' : item.unit }}</span>
                    </div>
                  </div>
                </el-form-item>
              </template>
              <el-form-item
                v-if="BuyForm.product_flag ==='TS' && BuyForm.meal_flag !=='' "
                label="基础容量"
                class="form-item"
              >
                {{ TS_TEST.value || 0 }}{{ '&nbsp;&nbsp;'+ TS_TEST.unit }}
              </el-form-item>
              <el-form-item
                v-if="['LS', 'DX'].indexOf(BuyForm.product_flag) < 0 && expire_time"
                label="到期时间"
                class="form-item"
              >
                {{ expire_time }}
              </el-form-item>
            </div>
          </CardLayout>
          <CardLayout title="订单优惠">
            <div slot="layout">
              <el-form-item
                label="订单标价"
                class="form-item"
                prop="total_price"
              >
                <el-input
                  v-model="BuyForm.total_price"
                  readonly
                  class="form-input"
                /> 元
              </el-form-item>
              <el-form-item
                v-show="discount_used"
                label="默认优惠"
                class="form-item"
                prop="diff_price_time"
              >
                <el-input
                  v-model="BuyForm.diff_price_time"
                  readonly
                  class="form-input"
                /> 元
              </el-form-item>
              <el-form-item
                label="产品折扣"
                prop="diff_price_act"
                class="form-item"
              >
                <el-input
                  v-model="BuyForm.diff_price_act"
                  readonly
                  class="form-input"
                /> 元
                <el-checkbox
                  v-model="BuyForm.useAct"
                  @change="getMealPrice"
                >使用</el-checkbox>
              </el-form-item>
              <el-form-item
                label="优惠码优惠"
                prop="coupon_code"
                class="form-item"
              >
                <el-input
                  v-model="BuyForm.coupon_code"
                  class="form-input"
                  @change="getMealPrice"
                />
                <el-checkbox
                  v-model="BuyForm.useCoupon"
                  @change="getMealPrice"
                >使用</el-checkbox>
                <div
                  v-if="BuyForm.coupon_code && BuyForm.useCoupon"
                  class="inline-box title-color-success"
                >优惠金额：{{ BuyForm.diff_price_coupon }} 元</div>
              </el-form-item>
              <el-form-item
                label="销售优惠"
                prop="discount_sale_amount"
              >
                <el-input
                  v-model="BuyForm.discount_sale_amount"
                  type="age"
                  class="form-input-200 inline-box"
                  @change="changeSale('amount')"
                />
                <el-select
                  v-model="BuyForm.discount_sale_type"
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
                <div class="inline-box title-color-success">优惠金额：{{ BuyForm.diff_price_sale }} 元</div>
              </el-form-item>
              <el-form-item
                label="应付金额"
                prop="pay_price"
              >
                <!-- <el-input
                  v-model="BuyForm.pay_price"
                  type="age"
                  class="form-input"
                  @change="changeSale('pay')"
                /> -->
                <a-input-number
                  v-model="BuyForm.pay_price"
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
          <CardLayout title="开通信息">
            <div slot="layout">
              <el-form-item
                label="用户账号"
                class="form-item"
              >{{ BuyForm.email }}</el-form-item>
              <el-form-item
                label="套餐名称"
                class="form-item"
              >
                {{ getMealText(MEAL, BuyForm.meal_flag) }}
              </el-form-item>
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
              > {{ BuyForm.pay_price }} 元</el-form-item>
              <el-form-item
                label="邮箱余额"
                class="form-item"
              > {{ total_balance }} 元</el-form-item>
              <el-form-item
                label="支付方式"
                prop="pay_type"
              >
                <el-radio
                  v-model="BuyForm.pay_type"
                  :label="6"
                >欠款支付</el-radio>
              </el-form-item>
              <el-form-item
                label="开通说明"
                prop="remark"
              >
                <el-input
                  v-model="BuyForm.remark"
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
import * as Buy from './buy'
export default {
  components: {},
  props: {},
  data() {
    const checkSaleNumber = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入数字'))
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字'))
      } else if (Number(value) < 0 && this.BuyForm.discount_sale_type === 'rate') {
        callback(new Error('请输入大于数字'))
      } else {
        if (this.BuyForm.discount_sale_type === 'rate' && (Number(value) > 1 || Number(value) < 0)) {
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
      stepOp: ['基本信息', '启用详情', '确认启用'],
      time_unit_text: { 'm': '月', 'y': '年' },
      BuyForm: {
        surplus_flow: '', // 帐户余额
        plan_diy_name: '',
        product_meal_id: '', // 套餐id.
        product_flag: '', // 产品标识.
        meal_flag: '', // 套餐标识.
        plan_name: '', // 套餐名称
        email: '',
        order_type: '', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
        buy_type: '', // 试用订单
        buy_num: 1, // 购买时长 数量
        buy_time: '',
        time_unit: 'm', // 购买时长 单位
        user_id: 0,
        member_id: '', // 用户id
        plan_id: '', // 套餐id
        remark: '', // 备注
        from: 'user', // 来源
        no_fee: 0, // 是否免费
        diff_price_sale: 0, // 销售优惠
        diff_price_time: 0, // 默认优惠
        diff_price_act: 0, // 折扣优惠
        useAct: true,
        useCoupon: false,
        discount_sale_type: 'amount', // 销售优惠类型
        discount_sale_amount: 0, // 销售优惠-金额
        discount_used: 'sale,time,act,coupon', // 优惠类型
        diff_price_coupon: 0, // 优惠券优惠金额
        coupon_code: '', // 优惠券号码
        pay_price: 0,
        pay_type: 6, // 支付类型
        meal: {
          buy_num: '',
          price_level: '0',
          unit: ''
        },
        priceLevelMap: [], // 价格区间
        meal_config: [], // 套餐参数配置
        couponList: [] // 优惠券列表
      },
      rules: {
        email: [{ required: true, message: '请选择YUNDUN报备用户' }],
        order_type: [{ required: true, message: '请选择开通目的' }],
        product_flag: [{ required: true, message: '请选择产品' }],
        meal_flag: [{ required: true, message: '请选择套餐' }],
        plan_diy_name: '',
        time_unit: [],
        remark: [],
        coupon_code: [],
        diff_price_sale: [],
        diff_price_time: [],
        diff_price_act: [],
        useAct: [],
        discount_sale_type: [],
        discount_sale_amount: [{ required: true, validator: checkSaleNumber }],
        total_price: [],
        pay_price: [{ required: true, validator: checkNumber }],
        pay_type: [{ required: true, message: '请选择支付方式', trigger: ['change'] }]
      },
      max_time: { 'm': 9, 'y': 3 },
      PRODUCT: [],
      MEAL: [],
      basic_info: {},
      certify_info: {}, // 认证
      agent_basic_info: {}, // 代理
      agent_certify_info: {},
      top_agent_member_email: '', // 代理邮箱
      agent_flag: 0, // 是否报备,
      pay_email: '',
      total_balance: 0,
      TS_TEST: { value: '', unit: '' },
      timetype: [],
      expire_time: '', // 到期时间
      discount_used: '', // 默认优惠
      member_status: 0,
      baisc_flag: false,
      certify_flag: false
    }
  },
  methods: {
    handleOpen(data) {
      this.PRODUCT = [{ product_name: data.product_name, product_flag: data.product_flag }]
      this.getMealList(data.product_flag, this.PRODUCT)
      this.$nextTick(() => {
        this.open = true
        this.resetForm('BuyForm')
        this.loading = true
        this.rowData = Object.assign({}, data)
        this.getCustomerinfo(data.member.email || '')
        this.BuyForm.plan_id = data.id
        this.BuyForm.product_flag = data.product_flag
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

    async getMealList(product_flag) {
      const data = {
        product_flag: product_flag, status: '1', page: 1, per_page: 1000
      }
      const filter_flag = ['YD-WEBAQJS-TY'] // 展示在前面套餐
      await this.InvokeAllApi.post('/V4/product.meal.list', data).then(res => {
        let list = JSON.parse(JSON.stringify(res.data)) || []
        list = list.filter(i => filter_flag.indexOf(i.meal_flag) < 0) // 过滤套餐
        this.MEAL = list
      })
    },

    upMeal(list, filter, key) {
      let new_list = list
      if (key) {
        filter.forEach(_ => {
          const item = new_list.find(i => i[key] === _)
          if (item) {
            new_list = new_list.filter(i => i[key] !== _)
            new_list.splice(0, 0, item)
          }
        })
      }
      return new_list
    },

    nextActive(type) {
      // const is_check = this.getCheck()
      let active = JSON.parse(JSON.stringify(Number(this.active)))
      if (type === 'add') {
        // if (active === 2 && !is_check) return
        active = active + 1
      } else {
        active = active - 1
      }
      this.active = active
    },
    changOderType(val) {
      this.BuyForm.discount_sale_amount = 0
      if (val === 'user_refund') {
        this.BuyForm.discount_sale_type = 'rate'
      } else if (val === 'normal') {
        this.BuyForm.discount_sale_type = 'amount'
      }

      if (this.BuyForm.product_flag !== '' && this.BuyForm.meal_flag !== '') {
        setTimeout(() => {
          this.getMealPrice()
        }, 500)
      }
    },

    changeMeal(val) {
      const check_meal = this.MEAL.filter(i => i.meal_flag === val).length ? this.MEAL.filter(i => i.meal_flag === val)[0] : {}
      const meal_detail = check_meal ? check_meal.meal_detail && Buy.parseJSON(check_meal.meal_detail) || {} : {}
      if (!check_meal && !Object.keys(meal_detail).length) {
        this.message.warning('套餐配置不正确请联系售前！')
        this.setExpireTime() // 设置期时间
        return
      }
      // 设置参数
      this.BuyForm.product_meal_id = check_meal.id
      this.BuyForm.buy_time = 1 // 最小购买时长
      this.BuyForm.time_unit = Object.keys(meal_detail).length && meal_detail.meal_price.time_unit || 'm'
      this.BuyForm.coupon_code = '' // 优惠券
      this.discount_used = meal_detail.backstage_show && meal_detail.backstage_show.discount_used || null
      this.BuyForm.meal = {
        buy_num: 1,
        price_level: '0',
        unit: Object.keys(meal_detail).length && meal_detail.meal_price.time_unit || ''
      }
      if (check_meal.product_flag === 'TS') { // 态势感知 最小单位
        this.TS_TEST = { value: meal_detail.meal_price.min_buy, unit: meal_detail.meal_price.count_unit }
      }
      // 时长价格区间
      if (Object.keys(meal_detail).length) this.BuyForm.priceLevelMap = Buy.getPriceLevelMap(meal_detail.meal_price.count_type, meal_detail.meal_price.config)
      // 套餐购买-配置
      const fields_key = meal_detail.backstage_show ? meal_detail.backstage_show.default_fields : []
      const meal_config = Object.keys(meal_detail).length && this.getMealConfig(meal_detail.default_fields, fields_key, meal_detail.meal_price.count_unit, this.BuyForm, meal_detail) || []
      this.BuyForm.meal_config = meal_config
      setTimeout(() => { this.getMealPrice() }, 100)
    },
    changeSale(type) {
      if (type === 'type') {
        if (this.BuyForm.discount_sale_type === 'rate') this.BuyForm.discount_sale_amount = 1
        if (this.BuyForm.discount_sale_type === 'amount') this.BuyForm.discount_sale_amount = 0
      }
      if (type === 'pay') {
        const total_price = this.BuyForm.total_price
        const diff_price_time = this.BuyForm.diff_price_time
        const diff_price_act = this.BuyForm.diff_price_act
        const diff_price_coupon = this.BuyForm.diff_price_coupon
        const pay_price = this.BuyForm.pay_price
        const sales_amount = Number(total_price - pay_price - diff_price_time - diff_price_act - diff_price_coupon).toFixed(2)
        this.BuyForm.discount_sale_type = 'amount'
        this.BuyForm.discount_sale_amount = sales_amount
      }
      this.getMealPrice()
    },
    getMealPrice() {
      if (!this.getCheck()) {
        this.LoadPrice()
        setTimeout(() => { if (this.getCheck()) this.getMealPrice() }, 1000)
        return
      }
      this.setExpireTime() // 设置期时间
      this.InvokeAllApi.post('/fd//V4/order.payon_price', this.getParams()).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        this.LoadPrice(data)
      })
    },
    LoadPrice(data) {
      this.BuyForm.total_price = data && data.total_price || 0
      this.BuyForm.pay_price = data && data.pay_price || 0
      this.BuyForm.diff_price_act = data && data.diff_price_act || 0// 产品折扣
      this.BuyForm.diff_price_time = data && data.diff_price_time || 0// 默认优惠
      this.BuyForm.diff_price_sale = data && data.diff_price_sale || 0 // 销售优惠
      this.BuyForm.discount_sale_amount = data && data.discount_sale_amount || 0 // 销售优惠
      this.BuyForm.diff_price_coupon = data && data.diff_price_coupon || 0// 优惠券优惠金额
    },
    setExpireTime() {
      this.expire_time = ''
      if (this.BuyForm.product_flag !== 'LS') this.expire_time = Buy.getExcTime(null, this.BuyForm.buy_time, this.BuyForm.time_unit)
    },
    getDiscountUsed() {
      let discount_used = 'sale'
      if (this.BuyForm.useCoupon) discount_used = discount_used + ',coupon'
      if (this.BuyForm.useAct) discount_used = discount_used + ',act'
      if (this.discount_used) discount_used = discount_used + ',' + this.discount_used
      return discount_used
    },
    getCheck() {
      let status = false
      this.$refs.BuyForm.validate((valid) => {
        if (!valid) this.message.warning('请检查输入项！')
        status = valid
      })
      return status
    },
    getMealConfig(default_fields, fields_key, count_unit, form, meal_detail) {
      const config = []
      if (fields_key && Object.keys(default_fields).length && fields_key.length) {
        fields_key.forEach(i => {
          const field = default_fields[i]
          if (field) {
            const item = Buy.getFieldItem(field, i, count_unit)
            const key_value = Buy.getKeyValue(item)
            config.push(item)
            this.$set(form || this.BuyForm, i, key_value || '')
            this.$set(this.rules, i, [{ required: true, message: '必填字段' }])
            this.setTimetype(i, field.unit)// 设置时间类型
          }
        })
      }
      return config
    },
    setTimetype(type, LIST) {
      if (!LIST) return
      if (type !== 'buy_time' && LIST.length > 0) return
      const TEXT = { 'd': '天', 'm': '月', 'y': '年' }
      const Arr = []
      LIST.forEach(i => {
        Arr.push({
          'text': TEXT[i],
          'value': i,
          'status': '1'
        })
      })
      this.timetype = Arr
    },
    fieldValueChange(val, beishu, e) {
      this.BuyForm.buy_num = Math.ceil(val / beishu) * beishu
      this.getMealPrice()
    },
    getSalesText() {
      const basic_info = this.basic_info
      let text = ''
      if (Object.keys(basic_info).length && basic_info.user_name) text = (basic_info.user_name).join('，') || '--'
      return text
    },

    getMealText(list, flag) {
      return Buy.getMealText(list, flag)
    },

    resetForm(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields()
      this.basic_info = {}
      this.certify_info = {}
      this.agent_basic_info = {}
      this.agent_certify_info = {}
      this.top_agent_member_email = ''
      this.active = 1
      this.BuyForm.diff_price_sale = ''
      this.expire_time = ''
      this.agent_flag = 1
      this.TS_TEST = { value: '', unit: '' }
      this.timetype = [
        { text: '日', value: 'd', status: 1 },
        { text: '月', value: 'm', status: 1 },
        { text: '年', value: 'y', status: 1 }
      ]
    },
    handleClose() {
      this.open = false
    },
    getParams() {
      if (this.BuyForm.priceLevelMap.length) { // 获取价格等级
        const price_level = Buy.getSortPriceLevel(this.BuyForm.priceLevelMap, this.BuyForm.buy_time)
        this.BuyForm.meal.price_level = price_level
      }
      const params = {
        'order_type': this.BuyForm.order_type,
        'buy_time': this.BuyForm.buy_time || 1,
        'time_unit': this.BuyForm.time_unit,
        'member_id': this.rowData.member_id,
        'user_id': this.BuyForm.user_id,
        'meal_flag': this.BuyForm.meal_flag,
        'plan_diy_name': this.BuyForm.plan_diy_name,
        'plan_id': this.rowData.id,
        'pay_type': this.BuyForm.pay_type,
        'no_fee': this.BuyForm.no_fee,
        'from': 'user',
        'remark': this.BuyForm.remark,
        'meal': {
          'buy_num': this.BuyForm.buy_num || parseInt(this.BuyForm.meal.buy_num, 10),
          'price_level': this.BuyForm.meal.price_level,
          'unit': this.BuyForm.meal.unit
        },
        'coupon_code': this.BuyForm.useCoupon ? this.BuyForm.coupon_code : '',
        'discount_sale_type': this.BuyForm.discount_sale_type,
        'discount_sale_amount': this.BuyForm.discount_sale_amount,
        'discount_used': this.getDiscountUsed()
      }
      return params
    },
    handleSubmit() {
      if (!this.getCheck()) return
      this.loading = true
      this.InvokeAllApi.post('/fd/V4/order.payon_pay', this.getParams()).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('fetchData')
        this.loading = false
        this.open = false
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
