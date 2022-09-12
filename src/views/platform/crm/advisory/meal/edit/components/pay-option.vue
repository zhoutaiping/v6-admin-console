<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <el-form ref="Form" :model="form" :rules="rules" label-position="left" label-width="120px">
    <DmCardPanel title="支付信息">
      <el-form-item label="订单价格" prop="total_price">
        {{ form.total_price }}
      </el-form-item>
      <el-form-item label="默认优惠" prop="diff_price_time">
        {{ form.diff_price_time }}
      </el-form-item>
      <el-form-item label="销售优惠" prop="discount_sale_amount">
        <el-input
          v-model="form.discount_sale_amount"
          placeholder=" "
          class="input-box"
          @change="$emit('getPrice')"
        >
          <!-- :disabled="is_user_refund" -->
          <DmSelect
            slot="prepend"
            v-model="form.discount_sale_type"
            :selects="options.sale_type"
            :clearable="false"
            style="width: 100px;"
            @change="e =>{
              if (e === 'amount') {
                form.discount_sale_amount = 0
              } else if (e === 'rate') {
                if (optionParams.order_type === 'user_refund') {
                  form.discount_sale_amount = 0
                } else {
                  form.discount_sale_amount = 1
                }
              }
              $emit('getPrice')
            }"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="应付金额" prop="pay_price">
        <el-input-number
          v-model="form.pay_price"
          class="input-box"
          @blur="e => {
            if (e) {
              form.discount_sale_type = 'amount'
              form.discount_sale_amount = Number(form.total_price - form.diff_price_time - form.diff_price_act - form.diff_price_coupon - form.pay_price)
              $emit('getPrice')
            }
          }"
        />
      </el-form-item>
      <el-form-item label="支付方式" prop="pay_type">
        余额支付
      </el-form-item>
      <el-form-item label="说明-备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" class="input-box" />
      </el-form-item>
    </DmCardPanel>
  </el-form>
</template>
<script>
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error(' '))
      } else if (isNaN(Number(value))) {
        callback(new Error(' '))
      } else if (Number(value) < 0 && this.form.discount_sale_type === 'rate') {
        callback(new Error(' '))
      } else {
        if (
          this.form.discount_sale_type === 'rate' &&
          (Number(value) > 1 || Number(value) < 0)
        ) {
          callback(new Error(' '))
        } else {
          callback()
        }
      }
    }
    return {
      type: '',
      default_form: {
        diff_price_time: 0,
        diff_price_act: 0,
        diff_price_coupon: 0,
        discount_sale_amount: 0,
        discount_sale_type: 'amount',
        discount_used: 'sale',
        pay_price: 0,
        total_price: 0,
        from: 'user',
        no_fee: '0',
        pay_type: 6,
        remark: '' },
      setKey: ['diff_price_time', 'diff_price_act', 'diff_price_coupon', 'pay_price', 'total_price', 'discount_sale_amount', 'discount_sale_type'],
      fliterKey: ['diff_price_time', 'diff_price_act', 'diff_price_coupon', 'pay_price', 'total_price'],
      form: { },
      rules: {
        discount_sale_amount: [
          { type: 'number', validator: validateNumber }
        ],
        discount_sale_type: [],
        pay_price: [],
        remark: []
      },
      options: {
        order_type: defaultSetting.order_type,
        sale_type: defaultSetting.sale_type
      }
    }
  },
  computed: {
    optionParams() {
      return this.type && this.$parent.$refs[this.type].params() || {}
    },
    is_user_refund() {
      return this.optionParams.order_type === 'user_refund'
    },
    priceData() {
      return this.$parent.priceData
    }
  },
  watch: {
    optionParams: {
      handler(val) {
        this.initSale()
      },
      deep: true
    },
    priceData: {
      handler(val) {
        defaultSetting.setKeyValue(val, this.setKey, this.form)
      },
      deep: true
    }
  },
  created() {
    this.type = this.$route.query.type || ''
  },
  methods: {
    init(data) {
      this.form = Object.assign({}, this.default_form)
      this.$nextTick(() => {
        this.initSale()
        this.$refs.Form.clearValidate()
      })
    },

    initSale() {
      if (this.optionParams.order_type) {
        this.form.discount_sale_amount = 0
        this.form.discount_sale_type = this.optionParams.order_type === 'user_refund' ? 'rate' : 'amount'
      }
    },

    params() {
      let data = { ...this.form }
      data = defaultSetting.fliterKey(data, this.fliterKey)
      return data
      // this.$refs.Form.validate((valid) => {
      //   if (valid) {

      //   } else {
      //     return
      //   }
      // })
    }
  }
}
</script>
