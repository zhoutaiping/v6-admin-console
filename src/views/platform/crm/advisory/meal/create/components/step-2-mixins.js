import { mapActions, mapState } from 'vuex'
import defaultSetting from '@/core/defaultSetting'
import FILTERMEAL from '@/utils/filterMeal'
// import Rul from '@/utils/verify'
export default {
  props: {
    member_id: {
      type: String,
      default: ''
    }
  },
  data() {
    const check_sale = (rule, value, callback) => {
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
    const check_pay = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error(' '))
      } else if (isNaN(Number(value))) {
        callback(new Error(' '))
      } else {
        callback()
      }
    }
    return {
      option: {
        product_params: {
          label: 'product_name',
          value: 'product_flag'
        },
        meal_params: {
          label: 'meal_name',
          value: 'meal_flag'
        },
        order_type: defaultSetting.order_type,
        sale_type: defaultSetting.sale_type,
        coupon: defaultSetting.coupon,
        TS: {
          value: '',
          unit: ''
        },
        meal_config: [],
        price_level: [],
        time_option: []
      },

      rules: {
        order_type: [{ required: true, message: ' ' }],
        product_flag: [{ required: true, message: ' ' }],
        meal_flag: [{ required: true, message: ' ' }],
        plan_diy_name: [],
        product_meal_id: [],
        expire_time: [],
        buy_time: [],
        time_unit: [],
        coupon_code: [],
        use_coupon: [],
        discount_used: [],
        total_price: [],
        diff_price_time: [],
        diff_price_act: [],
        discount_sale_amount: [
          { required: true, type: 'number', validator: check_sale }
        ],
        pay_price: [{ required: true, type: 'number', validator: check_pay }]
      }
    }
  },
  computed: {
    ...mapState({
      product_list: (state) => state.finance.product_list,
      meal_list: (state) => state.finance.meal_list
    }),

    product() {
      let list = []
      if (this.product_list && this.product_list.length) {
        list = JSON.parse(JSON.stringify(this.product_list)) || []
        list = list.filter((i) => FILTERMEAL.indexOf(i.meal_flag) < 0) // 过滤套餐
        list = defaultSetting.handleUpMeal(
          list,
          defaultSetting.upProduct,
          'product_flag'
        )
      }
      return list
    },

    meal() {
      let list = []
      if (this.meal_list && this.meal_list.length) {
        list = JSON.parse(JSON.stringify(this.meal_list)) || []
        list = defaultSetting.handleUpMeal(
          list,
          defaultSetting.upMeal,
          'meal_flag'
        )
      }
      return list
    }
  },

  watch: {
    member_id(val) {
      this.form.member_id = val
    }
  },
  methods: {
    ...mapActions({
      getMeal: 'getMeal',
      setOption: 'setOption'
    }),

    init() {
      this.$nextTick(() => {
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
          this.form.member_id = this.member_id
        }
      })
    },

    check_buy_time() {
      const buy_time = this.form.buy_time
      const time_unit = this.form.time_unit
      defaultSetting.validatorBuyTime(buy_time, time_unit, this.form)
    },

    apiParams() {
      const data = {
        order_type: this.form.order_type,
        buy_time: this.form.buy_time || 1,
        time_unit: this.form.time_unit,
        member_id: this.form.member_id || this.member_id,
        meal_flag: this.form.meal_flag,
        plan_diy_name: this.form.plan_diy_name,
        pay_type: this.form.pay_type,
        no_fee: this.form.no_fee,
        from: 'user',
        remark: this.form.remark,
        meal: {
          buy_num: this.form.buy_num || parseInt(this.form.meal.buy_num, 10),
          price_level: getSortPriceLevel(
            this.option.price_level,
            this.form.buy_time
          ),
          unit: this.form.meal.unit
        },
        coupon_code: this.form.use_coupon === '1' ? this.form.coupon_code : '',
        discount_sale_type: this.form.discount_sale_type,
        discount_sale_amount: this.form.discount_sale_amount,
        discount_used: this.form.discount_used
      }
      if (this.form.product_flag === 'WEBAQJS' && this.form.meal_flag && this.form.order_type === 'normal') {
        data.kuorong = this.$refs.kuorongPage.getParams()
      }

      return data
    },

    set_prices(data = null) {
      const prices = [
        'expire_time',
        'total_price',
        'pay_price',
        'diff_price_sale',
        'diff_price_act',
        'diff_price_time',
        'diff_price_coupon',
        'discount_sale_amount',
        'discount_sale_type'
      ]
      prices.forEach((key) => {
        let val = data && data[key] && data[key] !== '' ? data[key] : 0
        if (key === 'discount_sale_type' && (!data[key] || data[key] === '')) {
          val = 'amount'
        } else if (key === 'expire_time' && (!data[key] || data[key] === '')) {
          val = ''
        }
        this.$set(this.form, key, val)
      })
    }
  }
}

function getSortPriceLevel(arr = [], number = 1) {
  let level = 0
  let newArr = []
  newArr = arr.concat()
  newArr.push(parseInt(number, 10))
  newArr = newArr.sort(function(a, b) {
    return a - b
  })
  newArr.forEach((value, index) => {
    if (value === number) {
      if (index === 0) {
        level = newArr[index + 1]
      } else if (value > arr[index - 1] && value < arr[index + 1]) {
        level = newArr[index - 1]
      } else if (value === arr[index - 1]) {
        level = newArr[index - 1]
      } else if (value === arr[index + 1]) {
        level = newArr[index + 1]
      } else if (index === arr.length - 1) {
        level = newArr[index - 1]
      }
    }
  })
  return level
}
