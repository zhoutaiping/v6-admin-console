import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      pannel_name: 'xsy_order_list',
      initPage: false,
      API_INDEX: '/V4/xsy.order.list',
      sale_user_id: [],
      bindParams: {
        order_id: '',
        email: '',
        sale_ids: '',
        order_match_opportunity: 0,
        order_rsync_status: 0,
        order_confirm_status: ''
      },
      selectRow: [],
      column: [
        { label: '订单ID', prop: 'order_id', width: 100 },
        { label: '用户邮箱', prop: 'email', width: 150 },
        { label: '订单号', prop: 'order_code', width: 200 },
        { label: '产品套餐', prop: 'meal_flag', width: 200 },
        { label: '订单类型', prop: 'buy_type' },
        { label: '订单状态', prop: 'status' },
        { label: '确认状态', prop: 'confirm' },
        { label: '销售', prop: 'sales' },
        { label: 'CRM客户', prop: 'xsy_customer_name', width: 200 },
        { label: 'CRM商机', prop: 'xsy_opportunity_name', width: 200 },
        { label: 'CRM商机匹配', prop: 'order_match_opportunity', width: 120 },
        { label: 'CRM同步状态', prop: 'order_rsync_status', width: 120 },
        { label: 'CRM审核状态', prop: 'order_confirm_status', width: 120 },
        { label: '所属平台', prop: 'payment_mode' },
        { label: '应付金额', prop: 'pay_price', width: 120 },
        { label: '实付金额/元', prop: 'pay_off_price', width: 120 },
        { label: '销售业绩比例', prop: 'sales_performance', width: 120 },
        { label: '公司业绩比例', prop: 'company_performance', width: 120 },
        { label: '订单开始时间', prop: 'order_start_time', width: 160 },
        { label: '订单结束时间', prop: 'order_end_time', width: 160 },
        { label: '创建时间', prop: 'order_created_at', width: 160 },
        { label: '更新时间', prop: 'order_updated_at', width: 160 },
        { label: '同步时间', prop: 'order_sync_time', width: 160 }
      ],
      match_opportunity_text: {
        1: '匹配', 2: '未匹配'
      },
      platform_text: {
        1: '云盾',
        2: '白山云'
      },
      rsync_text: {
        1: '未同步', 2: '已同步', 3: '已更新待同步'
      },
      confirm_text: {
        1: '未审核', 2: '审核通过', 3: '审核不通过'
      },
      order_status: {
        0: '未支付',
        1: '已支付',
        2: '已取消',
        3: '已过期',
        4: '待回款',
        5: '待退款',
        6: '已退款',
        7: '已作废',
        8: '后付费',
        10: '已完成',
        '-1': '删除',
        '-2': '标记删除'
      },
      buy_type: [
        '购买', '升级', '续费', '降级', '扩容', '增值', '退订', '更改配置',
        '变更计费规则', '套餐配置修改', '试用延期', '试用转正', '试用开通', '启用付费版', '停用付费版'
      ],
      options: {
        order_match_opportunity: [
          { label: '全部商机匹配', value: 0 },
          { label: '匹配', value: 1 },
          { label: '未匹配', value: 2 }
        ],
        order_rsync_status: [
          { label: '全部同步状态', value: 0 },
          { label: '未同步', value: 1 },
          { label: '已同步', value: 2 },
          { label: '已更新待同步', value: 3 }
        ],
        order_confirm_status: [
          { label: '全部审核状态', value: '' },
          { label: '未审核', value: 1 },
          { label: '审核通过', value: 2 },
          { label: '审核不通过', value: 3 }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      meal_list: state => state.finance.meal_list,
      conf: state => state.finance.conf
    })
  },
  async created() {
    await Promise.all([await this.getMeal({ page: '1', per_page: '9999' }), await this.getbasicconf()])
  },
  methods: {
    ...mapActions({
      getMeal: 'getMeal',
      getbasicconf: 'getbasicconf'
    })
  }
}
