import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      pannel_name: 'xsy_flow_list',
      initPage: false,
      API_INDEX: '/V4/xsy.flow.list',
      bindParams: {
        order_id: '',
        flow_confirm_status: '',
        flow_type: [3, 4]
      },
      selectRow: [],
      sale_user_id: [],
      column: [
        { label: '流水ID', prop: 'flow_id', width: 100 },
        { label: '流水类型', prop: 'flow_type', width: 100 },
        { label: '流水状态', prop: 'flow_status', width: '' },
        { label: '关联订单ID', prop: 'order_id', width: 100 },
        { label: '订单状态', prop: 'status' },
        { label: '销售', prop: 'sales' },
        { label: '支付邮箱', prop: 'email', width: 150 },
        { label: '回款退款路线', prop: 'flow_source', width: 150 },
        { label: '回款退款时间', prop: 'flow_time', width: 150 },
        { label: '回款金额', prop: 'flow_money', width: 150 },
        { label: '更新时间', prop: 'flow_updated_at', width: 160 },
        { label: '关联订单同步状态', prop: 'order_rsync_status', width: 160 },
        { label: '关联用户拉取状态', prop: 'xsy_member_pri_id', width: 160 },
        { label: 'CRM流水同步状态', prop: 'flow_rsync_status', width: 160 },
        { label: 'CRM流水审核状态', prop: 'flow_confirm_status', width: 160 }
      ],
      FLOW_TYPE_TEXT: {
        1: '收款', 2: '打款', 3: '回款', 4: '退款', 5: '提现'
      },
      FLOW_SOURCE_TEXT: {
        1: '云盾银行转帐', 2: '云盾支付宝转账', 3: '云盾微信转账', 4: '云盾支付宝充值', 5: '云盾微信充值', 6: '云盾线下转账余额',
        7: '云盾线上充值余额', 8: '直接退款到银行', 9: '直接退款到支付宝', 10: '直接退款到微信', 11: '白山支付宝充值', 12: '白山微信充值'
      },
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
      flow_confirm_status: {
        1: '未确认', 2: '确认通过', 3: '确认不通过'
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
        flow_rsync_status: [
          { label: '全部流水同步状态', value: 0 },
          { label: '未同步', value: 1 },
          { label: '已同步', value: 2 },
          { label: '已更新待同步', value: 3 }
        ],
        flow_confirm_status: [
          { label: '全部流水确认状态', value: '' },
          { label: '未确认', value: 1 },
          { label: '确认通过', value: 2 },
          { label: '确认不通过', value: 3 }
        ],
        flow_type: [
          { label: '收款', value: 1 },
          { label: '打款', value: 2 },
          { label: '回款', value: 3 },
          { label: '退款', value: 4 },
          { label: '提现', value: 5 }
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
