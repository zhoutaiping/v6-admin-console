import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      pannel_name: 'xsy_flow_receivable_list',
      initPage: false,
      API_INDEX: '/V4/xsy.receivable.list',
      bindParams: {
        order_id: '',
        receivable_id: '',
        email: '',
        order_rsync_status: '',
        receivable_rsync_status: '',
        receivable_confirm_status: '',
        sale_ids: ''
      },
      column: [
        { label: '应收单ID', prop: 'receivable_id', width: 100, fixed: 'left' },
        { label: '应收单标识', prop: 'receivable_code', width: 200 },
        { label: '订单ID', prop: 'order_id', width: 100 },
        { label: '订单标识', prop: 'order_code', width: 200 },
        { label: '套餐实例ID', prop: 'plan_id' },
        { label: '套餐', prop: 'meal_flag', width: 200 },
        { label: '用户邮箱', prop: 'email', width: 200 },
        { label: '客户名称', prop: 'cust_name' },
        { label: '应收账期', prop: 'period' },
        // { label: '账期开始时间', prop: 'period_start' },
        // { label: '账期结束时间', prop: 'period_end' },
        { label: '账单类型', prop: 'type' },
        { label: '回款时间', prop: 'remark' },
        { label: '应收金额', prop: 'total_fee' },
        // { label: '本次服务时长', prop: 'period_service_time' },
        // { label: '本次服务量', prop: 'period_service_num' },
        { label: '支付类型', prop: 'pay_type' },
        { label: '计费开始时间', prop: 'calc_start_time', width: 120 },
        { label: '计费结束时间', prop: 'calc_end_time', width: 120 },
        { label: '所属销售', prop: 'sale_user_ids' },
        { label: '已回款金额', prop: 'pay_back_fee' },
        // { label: '账单创建时间', prop: 'created_at' },
        // { label: '账单更新时间', prop: 'updated_at' },
        // { label: '计费数量', prop: 'calc_num' },
        // { label: '计费单价', prop: 'calc_unit_price' },
        { label: '订单同步状态', prop: 'order_rsync_status' },
        { label: '销售易同步状态', prop: 'receivable_rsync_status' },
        { label: '确认状态', prop: 'receivable_confirm_status' }
      ],

      select: {
        order_rsync_status: [
          { label: '未同步', value: '1' },
          { label: '已同步', value: '2' },
          { label: '已更新待同步', value: '3' }
        ],
        rsync_status: [
          { label: '未同步', value: '1' },
          { label: '已同步', value: '2' },
          { label: '已更新待同步', value: '3' }
        ],
        confirm_status: [
          { label: '未确认', value: '1' },
          { label: '已确认', value: '2' },
          { label: '已确认不通过', value: '3' }
        ]
      },
      sale_ids: []
    }
  },
  computed: {
    ...mapState({
      meal_list: state => state.finance.meal_list,
      conf: state => state.finance.conf
    })
  },
  async created() {
    await Promise.all([await this.getMeal(), await this.getbasicconf()])
  },
  methods: {
    ...mapActions({
      getMeal: 'getMeal',
      getbasicconf: 'getbasicconf'
    })
  }
}

