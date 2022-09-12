
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      detail: state => state.meal.detail,
      info: state => state.meal.info,
      kuorong_key: state => state.meal.kuorong_key,
      user_kuorong: state => state.meal.user_kuorong,
      webaqjs_user_kuorong: state => state.meal.webaqjs_user_kuorong_info
    })
  },

  methods: {
    ...mapActions({
      getDetail: 'detail',
      OderPlan: 'OderPlan',
      userKuorong: 'userKuorong',
      setShrink: 'setShrink'
    }),

    params() {
      const data = {
        'order_type': 'normal',
        'buy_type': 'kuorong',
        'member_id': this.rowData.member_id,
        'product_flag': this.rowData.product_flag,
        'meal_flag': this.rowData.meal_flag,
        'plan_id': this.rowData.id,
        'remark': this.form.remark,
        'from': 'user',
        'coupon_code': '',
        'discount_sale_type': this.form.discount_sale_type,
        'discount_sale_amount': this.form.discount_sale_amount,
        'discount_used': 'sale',
        'pay_type': this.form.pay_type,
        'no_fee': '0',
        'kuorong': this.kuorong(this.kuorong_key, this.form)
      }
      return data
    },
    kuorong(kuorong_key = this.kuorong_key, form = this.form) {
      const data = {}
      Object.keys(kuorong_key).forEach(i => {
        data[i] = {
          buy_num: form[i] * -1 || 0
        }
      })
      return data
    }

  }
}
