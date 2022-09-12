<template>
  <el-form
    ref="Form"
    :model="form"
    :rules="rules"
    label-width="120px"
    class="form-box "
    label-position="left"
  >
    <el-form-item
      label="开通目的"
      prop="order_type"
      class="item-box"
    >
      <DmSelect
        v-model="form.order_type"
        :selects="option.order_type"
        placeholder="开通目的"
        class="input-box"
        @change="e =>{
          if (e === 'user_refund') {
            form.discount_sale_type = 'rate' // 销售优惠类型
            form.discount_sale_amount = 0 // 销售优惠-金额
          } else {
            form.discount_sale_type = 'amount' // 销售优惠类型
            form.discount_sale_amount = 0 // 销售优惠-金额
          }

          if(form.product_flag !=='' && form.meal_flag !=='') {
            getPrice()
          }
        }"
      />
    </el-form-item>
    <el-form-item
      label="产品"
      prop="product_flag"
      class="item-box"
    >
      <DmSelect
        v-model="form.product_flag"
        :selects="product"
        :option-params="option.product_params"
        filterable
        placeholder="产品"
        class="input-box"
        @change="e=>{
          form.meal_flag = ''
          $store.commit('SET_MEAL',[])
          if(e) {
            option.meal_config = []
            getMeal({product_flag:e, status: '1', page:1,per_page:500})
          }
        }"
      />
    </el-form-item>
    <el-form-item
      label="套餐"
      prop="meal_flag"
      class="item-box"
    >
      <DmSelect
        v-model="form.meal_flag"
        :selects="meal"
        :option-params="option.meal_params"
        filterable
        placeholder="套餐版本"
        class="input-box"
        @change="e=>{
          if(e) {
            changeMeal()
          }
        }"
      />
    </el-form-item>
    <el-form-item
      label="实例名称"
      prop="plan_diy_name"
      class="item-box"
    >
      <el-input
        v-model="form.plan_diy_name"
        placeholder=""
        clearable
        class="input-box"
      />
    </el-form-item>
    <template v-if="form.meal_flag && option.meal_config.length > 0">
      <el-form-item
        v-for="(item, index) in option.meal_config"
        :key="item.key"
        :label="item.title"
        :prop="item.key"
        class="item-box"
      >
        <div v-if="item.key === 'buy_time'">
          <div v-if="item.valueType !== 'array'">
            <el-input
              ref="buy_time"
              v-model="form[item.key]"
              :readonly="item.readonly"
              class="input-box"
              @change="e =>{
                check_buy_time()
                getPrice()
              }"
            >
              <el-select
                slot="append"
                v-model="form.time_unit"
                style="width:100px;"
                @change="e =>{
                  check_buy_time()
                  getPrice()
                }"
              >
                <el-option
                  v-for="time in option.time_option"
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
              v-model="form.buy_time"
              style="width:100px;"
              @change="e =>{
                check_buy_time()
                getPrice()
              }"
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
              v-model="form.time_unit"
              style="width:100px;"
              @change="e =>{
                check_buy_time()
                getPrice()
              }"
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
            v-if="form.product_flag !=='TS'"
            v-model="form[item.key]"
            :min="Number(item.beishu) || 0"
            :step="Number(item.beishu)"
            :disabled="item.readonly"
            controls-position="right"
            placeholder="请输入"
            class="input-box input-number"
            @change="e =>{
              form.buy_num = Math.ceil(form[item.key] / Number(item.beishu)) * Number(item.beishu)
              getPrice()
            }"
          />
          <span
            v-if="form.product_flag !=='TS'"
            style="margin-left:10px;"
          >{{ item.unit =='num' ? '个' : item.unit }}</span>
          <span v-if="item.default_value">基础配置：{{ "&nbsp;&nbsp;"+ item.default_value+"&nbsp;&nbsp;" }}{{ item.unit }}</span>
        </div>
        <div v-else>
          <div v-if="item.valueType === 'array'">
            <el-select
              v-model="form[item.key]"
              class="input-box input-number"
              @change="getPrice"
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
              v-model="form[item.key]"
              :readonly="item.readonly"
              placeholder="请输入"
              class="input-box input-number"
              @change="getPrice"
            />
            <span style="margin-left:5px;">{{ item.unit =='min' ? '分钟' : item.unit }}</span>
          </div>
        </div>
      </el-form-item>
      <template v-if="form.product_flag ==='TS' && form.meal_flag ">
        <el-form-item
          label="基础容量"
          class="item-box"
        >
          {{ option.TS.value }} {{ "&nbsp;&nbsp;"+ option.TS.unit }}
        </el-form-item>
      </template>
      <template v-if="['LS', 'DX'].indexOf(form.product_flag) <0 && form.meal_flag && form.expire_time ">
        <el-form-item
          label="到期时间"
          prop="expire_time"
          class="item-box"
        >
          {{ form.expire_time }}
        </el-form-item>
      </template>
    </template>
    <template v-if="form.product_flag && form.product_flag==='WEBAQJS' && form.order_type === 'normal' && form.meal_flag">
      <kuorongItem
        ref="kuorongPage"
        @change="getPrice"
      />
    </template>
    <el-form-item
      label="订单标价"
      prop="total_price"
      class="item-box"
    >
      {{ form.total_price }}
    </el-form-item>
    <el-form-item
      label="默认优惠"
      prop="diff_price_time"
      class="item-box"
    >
      {{ form.diff_price_time }}
    </el-form-item>
    <el-form-item
      label="产品折扣"
      prop="diff_price_act"
      class="item-box"
    >
      {{ form.diff_price_act }}
    </el-form-item>
    <el-form-item
      label="优惠码"
      prop="coupon_code"
      class="item-box"
    >
      <el-input
        v-model="form.coupon_code"
        class="input-box"
        @change="e =>{
          if(e && form.use_coupon === '1') {
            getPrice()
          }
        }"
      >
        <el-select
          slot="append"
          v-model="form.use_coupon"
          style="width:100px;"
          @change="e =>{
            if(form.coupon_code !== '') {
              if(e === 1) {
                form.discount_used = 'sale,time,act,coupon'
              } else {
                form.discount_used = 'sale,time,act'
              }
              getPrice()
            }
          }"
        >
          <el-option
            v-for="(item, index) in option.coupon"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-input>
      <div v-show="form.diff_price_coupon !=='' && form.diff_price_coupon !==0">
        <span class="color--primary">优惠金额：{{ form.diff_price_coupon }}</span>
      </div>
    </el-form-item>
    <el-form-item
      label="销售优惠"
      prop="discount_sale_amount"
      class="item-box"
    >
      <el-input
        v-model="form.discount_sale_amount"
        placeholder=""
        class="input-box"
        @change="e =>{
          getPrice()
        }"
      >
        <el-select
          slot="prepend"
          v-model="form.discount_sale_type"
          :disabled="form.order_type === 'user_refund'"
          :clearable="false"
          style="width:100px;"
          @change="e=>{
            if (e === 'amount') {
              form.discount_sale_amount = 0
            } else if (e === 'rate') {
              if(form.order_type === 'user_refund') {
                form.discount_sale_amount = 0
              } else {
                form.discount_sale_amount = 1
              }
            }
            getPrice()
          }"
        >
          <el-option
            v-for="item in option.sale_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-input>
      <div v-show="form.diff_price_sale !=='' && form.diff_price_sale !==0">
        <span class="color--primary">优惠金额：{{ form.diff_price_sale }}</span>
      </div>
    </el-form-item>
    <el-form-item
      label="应付金额"
      prop="pay_price"
      class="item-box"
    >
      <a-input-number
        v-model="form.pay_price"
        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        class="input-box"
        @blur="e =>{
          if(e) {
            form.discount_sale_type = 'amount'
            form.discount_sale_amount = Number(form.total_price - form.diff_price_time - form.diff_price_act - form.diff_price_coupon - form.pay_price)
            getPrice()
          }
        }"
      />
    </el-form-item>
    <el-form-item
      label="说明"
      prop="remark"
      class="item-box"
    >
      <el-input
        v-model="form.remark"
        type="textarea"
        class="input-box"
      />
    </el-form-item>
    <el-form-item label="">
      <a-button
        type="primary"
        style="margin-right: 8px"
        @click="$emit('change','del')"
      >上一步</a-button>
      <a-button
        type="primary"
        style="margin-right: 8px"
        @click="next"
      >下一步</a-button>
      <a-button
        style="margin-right: 8px"
        @click="e =>{
          $refs.Form.resetFields()
        }"
      >重置</a-button>
      <a-button @click="$emit('close')">返回列表</a-button>
    </el-form-item>
    <el-divider />
    <DmAlert>
      <div class="step-form-style-desc">
        <h3>说明</h3>
        <h4>销售优惠类型为<strong>金额</strong>时，请输入优惠金额（数字类型），可为负数，<strong>需谨慎操作！！</strong></h4>
        <h4>销售优惠类型为<strong>折扣</strong>时，请输入优惠折扣（0-1）</h4>
        <h4>可直接输入<strong>应付金额</strong>，系统为你自动计算优惠</h4>
      </div>
    </DmAlert>
  </el-form>
</template>
<script>
import mixins from './step-2-mixins'
import kuorongItem from './kuorong-item'
export default {
  components: { kuorongItem },
  mixins: [mixins],
  data() {
    return {
      form: {
        order_type: '',
        product_flag: '',
        meal_flag: '',
        plan_diy_name: '',
        product_meal_id: '',
        buy_time: 1,
        time_unit: 'm',
        meal: {
          buy_num: 1,
          price_level: '0',
          unit: ''
        },
        expire_time: '',
        coupon_code: '', // 优惠码
        use_coupon: '2',
        diff_price_sale: 0, // 销售优惠
        diff_price_time: 0, // 默认优惠
        diff_price_act: 0, // 折扣优惠
        diff_price_coupon: 0,
        discount_sale_type: 'amount', // 销售优惠类型
        discount_sale_amount: 0, // 销售优惠-金额
        discount_used: 'sale,time,act', // 优惠类型
        total_price: 0, // 订单标价
        pay_price: 0, // 应付价格
        pay_type: 6, // 支付类型
        no_fee: 0, // 是否免费
        from: 'user',
        remark: ''
      }

    }
  },

  methods: {
    changeMeal() {
      this.setOption({
        vm: this,
        form: this.form,
        rules: this.rules
      })
      setTimeout(() => {
        if (this.$refs.kuorongPage) {
          this.$refs.kuorongPage.init()
        }
        this.getPrice()
      }, 1000)
    },

    getPrice() {
      this.$refs.Form.validate(async (valid) => {
        if (valid) {
          let api = ''
          if (this.form.order_type === 'normal') {
            api = '/fd/V4/order.create_price'
          } else if (this.form.order_type === 'user_refund') {
            api = '/fd/V4/order.try_price'
          }
          try {
            const data = await this.Fetch.post(api, this.apiParams())
            this.set_prices(data)
          } catch (error) {
            this.set_prices()
            return
          }
        } else {
          this.set_prices()
        }
      })
    },

    next() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.$emit('change', 'add')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  max-width: 600px;
  margin: 0 auto;
}
.input-box {
  width: 400px;
}
.item-box {
  margin-bottom: 10px;
}
</style>
