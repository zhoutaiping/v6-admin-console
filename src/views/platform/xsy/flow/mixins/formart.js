export default {
  methods: {
    formartValue(row, prop) {
      let _text = ''
      switch (prop) {
        case 'buy_type':
          _text = this.buy_type[row[prop]] || ''
          break
        case 'payment_mode':
          _text = this.platform_text[row[prop]] || ''
          break
        case 'flow_type':
          _text = this.FLOW_TYPE_TEXT[row[prop]] || ''
          break
        case 'status':
          _text = this.order_status[row[prop]] || ''
          break
        case 'xsy_member_pri_id' :
          _text = row[prop] ? '已同步' : '未同步'
          break
        case 'order_match_opportunity' :
          _text = this.match_opportunity_text[row[prop]] || ''
          break
        case 'order_rsync_status' :
          _text = this.rsync_text[row[prop]] || ''
          break
        case 'flow_rsync_status' :
          _text = this.rsync_text[row[prop]] || ''
          break
        case 'flow_confirm_status' :
          _text = this.flow_confirm_status[row[prop]] || ''
          break
        default :
          _text = row[prop]
          break
      }
      return _text
    },
    mealText(val) {
      let _text = ''
      if (val === '') {
        return _text
      } else {
        let meal = null
        meal = this.meal_list.find(i => {
          return i.meal_flag === val
        })
        _text = meal ? meal.product_name + '【' + meal.meal_name + '】' : val
      }
      return _text
    },
    saleText(val) {
      let _text = ''
      if (val === '') {
        return _text
      } else {
        const ids = val ? val.split(',') : []
        const sale = []
        ids.forEach(_ => {
          if (this.conf.user_list.find(i => {
            return Number(i.user_id) === Number(_)
          })) {
            sale.push(this.conf.user_list.find(i => {
              return Number(i.user_id) === Number(_)
            }).name)
          }
        })
        _text = sale.join(',')
      }
      return _text
    }
  }
}
