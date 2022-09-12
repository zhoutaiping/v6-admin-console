import * as FORM from './financeFrom'
import * as Utils from '@/utils/index'
import DialogPayback from './Dialog/DialogPayback'
import DialogDetail from './Dialog/DialogDetail'
import DialogEdit from './Dialog/DialogEdit'
import DialogRefund from './Dialog/DialogRefund'
import DialogConfirm from './Dialog/DialogConfirm'
import DialogReorder from './Dialog/DialogReorder'
import DialogAdjustOrder from './Dialog/DialogAdjustOrder'
import Performance from './Dialog/edit-performance'
import Form from './form'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    DialogPayback,
    DialogDetail,
    DialogRefund,
    DialogEdit,
    DialogConfirm,
    DialogReorder,
    DialogAdjustOrder,
    Performance,
    Form
  },
  data() {
    return {
      pannel_name: 'finance_order_list',
      // 默认值
      PLATFORM: FORM.PLATFORM,
      PLATFORM_TEXT: FORM.PLATFORM_TEXT,
      PAYMENT_MODE: FORM.PAYMENT_MODE,
      PAYMENT_MODE_TEXT: FORM.PAYMENT_MODE_TEXT,
      NO_PAY: FORM.NO_PAY,
      ROWOPTION: FORM.ROWOPTION,
      CONFIRM: FORM.CONFIRM,
      HAS_RECEIVE: FORM.HAS_RECEIVE,
      TEST_USER: FORM.TEST_USER,
      STATUS: FORM.STATUS,
      PAYTYPE: FORM.PAYTYPE,
      BUYTYPE: FORM.BUYTYPE,
      myBackToTopStyle: FORM.myBackToTopStyle,
      column: FORM.column, // 列-列表
      // tabs
      actionTab: 'all',
      orderTabs: FORM.orderTabs,
      // 列表
      listLoading: false,
      listMap: FORM.listMap,
      orderList: [],
      selectRecord: [],
      // 价格
      pay_price: 0,
      pay_off_price: 0,
      pay_price_select: 0,
      pay_off_price_select: 0,
      performance_over: {
        '0': '未知',
        '1': '否',
        '2': '是'
      },
      tabPanels: {
        items: [
          {
            key: 'all',
            title: '全部订单'
          },
          {
            key: 'payed',
            title: '己支付订单'
          },
          {
            key: 'unpayback',
            title: '待回款订单'
          },
          {
            key: 'unrefund',
            title: '待退款订单'
          }
        ],
        activeModel: 'all',
        callback: (key) => {
          this.handleTabs(key)
        }
      }
    }
  },
  computed: {
    ...mapState({
      conf: (state) => state.finance.conf,
      agent_emails: (state) => state.finance.agent_emails
    }),
    SALES() {
      return this.conf.group
    }
  },
  async created() {
    await Promise.all([this.getbasicconf(), this.agent_email(), this.$store.dispatch('getMeal')])
  },
  methods: {
    ...mapActions({
      getbasicconf: 'getbasicconf',
      agent_email: 'agent_email'
    }),

    async init(params = this.$refs.dmData.getParams()) {
      await Promise.all([this.fetchData(), this.getSum()])
    },
    async getSum(params = this.$refs.dmData.getParams()) {
      const data = {
        calc_sum: 1,
        ...this.getParams(params)
      }
      await this.InvokeAllApi.get('/fd/V4/order.list', data)
        .then((res) => {
          this.pay_off_price = res.sum_pay_off_price || 0
          this.pay_price = res.sum_pay_price || 0
          this.$refs.dmData.init({ total: parseInt(res.total || 0, 10) })
        })
        .catch((e) => {})
    },

    async fetchData(params = this.$refs.dmData.getParams()) {
      this.listLoading = true
      const data = await this.InvokeAllApi.post(
        '/fd/V4/order.list',
        this.getParams(params)
      )
      this.orderList = data.list
      this.setDataMap(data)
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },

    setDataMap(data) {
      if (Object.keys(data).length) {
        this.orderList = data.list
        const map = [
          'map_buy_type',
          'map_meal',
          'map_order_status',
          'map_order_type',
          'map_product',
          'map_meal_name',
          'members',
          'users',
          'channel_end_relation'
        ]
        map.forEach((_) => {
          this.$set(this.listMap, _, data[_])
        })
      }
    },

    getParams(params = {}) {
      params = {
        ...params
      }
      if (this.$refs.Form) {
        params = Object.assign(params, this.$refs.Form.params())
      }
      return params
    },

    formatValue(row, prop) {
      let row_value = ''
      switch (prop) {
        case 'meal':
          row_value = this.mealText(row.meal_flag)
          break
        case 'meal_flag_before':
          row_value = this.mealText(row.meal_flag_before)
          break
        case 'member_email':
          row_value =
            row[prop] || this.listMap.members[row.member_id].email || '--'
          break
        case 'sales':
          row_value = this.formatSalesName(row)
          break
        case 'sales_performance':
          row_value = (Number(row[prop]) * 1000) / 10 + ' %'
          break
        case 'company_performance':
          row_value = (Number(row[prop]) * 1000) / 10 + ' %'
          break
        case 'company_commission':
          row_value = (Number(row[prop]) * 1000) / 10 + ' %'
          break
        case 'sales_commission':
          row_value = (Number(row[prop]) * 1000) / 10 + ' %'
          break
        case 'order_type':
          row_value = FORM.ORDER_TYPE_TEXT[row.order_type]
          break
        case 'buy_type':
          row_value = this.listMap.map_buy_type[parseInt(row.buy_type)] || '--'
          break
        case 'pay_type':
          row_value = this.formatPayType(row)
          break
        case 'platform':
          row_value = this.PLATFORM_TEXT[row[prop]]
          break
        case 'payment_mode':
          row_value = this.PAYMENT_MODE_TEXT[row[prop]]
          break
        case 'performance_over':
          row_value = this.performance_over[row[prop]]
          break
        case 'channel_end_relation':
          row_value = this.listMap.channel_end_relation[row[prop]]
          break
        default:
          row_value = row[prop]
          break
      }
      return row_value || ''
    },

    changeTabs(val) {
      const map = { '': 'all', 1: 'payed', 4: 'unpayback', 5: 'unrefund' }
      if (map[val]) {
        this.actionTab = map[val] || 'all'
      } else {
        this.actionTab = 'all'
      }
    },

    handleTabs(key) {
      const status = {
        all: '',
        payed: '1',
        unpayback: '4',
        unrefund: '5'
      }
      if (this.$refs.Form) {
        this.$refs.Form.setForm('status', status[key])
      }
      this.$refs.dmData.initPage()
    },

    handleRowClick(data, type) {
      const row_data = (data && Utils.deepClone(data)) || {}
      switch (type) {
        case 'Reorder': // 重出
          this.$refs.dialogReorder.handleOpen(row_data)
          break
        case 'edit': // 编辑
          this.$refs.dialogEdit.handleOpen(row_data)
          break
        case 'Refund': // 退款
          this.$refs.dialogRefund.handleOpen(
            row_data,
            this.listMap.members[row_data.member_id].email || ''
          )
          break
        case 'Receipt': // 回款
          this.$refs.dialogPayback.handleOpen(
            row_data,
            this.listMap.members[row_data.member_id].email || ''
          )
          break
        case 'Details': // 详情
          this.$refs.dialogDetail.handleOpen(row_data)
          break
        case 'Confirm': // 确定订单
          this.$refs.dialogConfirm.handleOpen(row_data, this.mealText(row_data.meal_flag))
          break
        case 'setColumn': // 自定义列
          this.$refs.tabAutoClumn.handleOpen(this.columns, this.checkColumns)
          break
        case 'deserted': // 作废
          this.handleDeserted(row_data)
          break
      }
    },

    handleDeserted(data) {
      this.$confirm('订单确认后将会作废订单，是否确认操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.InvokeAllApi.post('/fd/V4/order.deserted', {
            order_id: data.id
          }).then((res) => {
            this.Message('ACTION_SUCCESS')
            this.$refs.dmData.initPage()
          })
        })
        .catch((e) => {
          return true
        })
    },

    handleExcel() {
      const params = { id: [], order: {}}
      const select = JSON.parse(JSON.stringify(this.selectRecord))
      select.forEach((item, index) => {
        params.id.push(item.id)
      })
      if (!select.length) {
        const searchParams = JSON.parse(
          JSON.stringify(this.$refs.Form.params())
        )
        delete searchParams.page
        delete searchParams.per_page
        delete searchParams.pagesize
        params.order = { ...searchParams }
      }
      this.$confirm('导出订单，是否确认操作？', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.InvokeAllApi.post('/V4/order.export', params)
            .then((res) => {
              if (res.url) {
                const a = document.createElement('a')
                a.setAttribute('href', res.url)
                document.body.appendChild(a)
                a.click()
                a.style.display = 'none'
                this.Message('ACTION_SUCCESS')
              }
            })
            .catch((e) => {
              this.Message('ACTION_ERROR')
            })
        })
        .catch((e) => {
          return true
        })
    },

    formatPayType(row) {
      const payTypeList = [
        '默认', '现金', '银行转账', '余额', '微信', '支付宝', '欠款支付'
      ]
      return payTypeList[Number(row.pay_type)] || ''
    },

    formatSalesName(row) {
      const sale_user_ids = row.sale_user_ids
      const userMap = this.listMap.users
      const text = []
      if (!sale_user_ids.length) {
        return '暂无'
      } else {
        sale_user_ids.forEach((item, index) => {
          const user = userMap.find((record) => {
            return parseInt(record.user_id) === parseInt(item)
          })
          if (user && user.name !== '') {
            text.push(user.name)
          }
        })
        return text.join(',') || '暂无'
      }
    }
  }
}
