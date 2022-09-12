const myBackToTopStyle = {
  right: '50px',
  bottom: '40px',
  width: '40px',
  height: '40px',
  'z-index': '999',
  'border-radius': '4px',
  'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
  background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
}
// 流水状态 1-正常，2-作废.
const FLOW_STATUS = [
  { label: '全部流水状态', value: '' },
  { label: '正常', value: '1' },
  { label: '作废', value: '2' }
]
const FLOW_STATUS_TEXT = { 1: '正常', 2: '作废' }
// '流水来源： 1- 线下银行转，2-线下支付宝，3-线下微信，4-线上支付宝，5-线上微信, 6-线下转账余额，7-线上充值余额，8-直接到银行，9-直接到支付宝，10-直接到微信'
const FLOW_SOURCE = [
  { label: '云盾银行转帐', value: '1' },
  { label: '云盾支付宝转账', value: '2' },
  { label: '云盾支付宝充值', value: '4' },
  { label: '云盾微信充值', value: '5' }
]
const FLOW_SOURCE_BS = [
  { label: '白山支付宝充值', value: '11' },
  { label: '白山微信充值', value: '12' }
]
const FLOW_SOURCE_TEXT = {
  1: '云盾银行转帐', 2: '云盾支付宝转账', 3: '云盾微信转账', 4: '云盾支付宝充值', 5: '云盾微信充值', 6: '云盾线下转账余额',
  7: '云盾线上充值余额', 8: '直接退款到银行', 9: '直接退款到支付宝', 10: '直接退款到微信', 11: '白山支付宝充值', 12: '白山微信充值', 13: '云盾网银充值'
}
const FLOW_TYPE = [
  { label: '全部流水类型', value: '' },
  { label: ' 回款', value: '3' },
  { label: ' 退款', value: '4' }
]
// 流水类型：1-收款 ，2-打款，3-回款，4-退款. 多个用,分割
const FLOW_TYPE_TEXT = {
  1: '收款', 2: '打款', 3: '回款', 4: '退款', 5: '提现'
}
const LIST_SEARCH = {
  id: '',
  flow_source: '',
  sale: '',
  member_email: '',
  flow_time: '',
  flow_time_start: '',
  flow_time_end: '',
  flow_status: '',
  flow_type: '',
  sales_id: [],
  sales: ''
}

const COLUMN_YD = [
  { label: 'ID', prop: 'id' },
  { label: '流水号', prop: 'flow_code', width: '250' },
  { label: '流水类型', prop: 'flow_type', width: '150' },
  { label: '流水状态', prop: 'flow_status', width: '' },
  { label: '关联订单ID', prop: 'order_id', width: '120' },
  { label: '订单状态', prop: 'order_status', width: '120' },
  { label: '客户名称', prop: 'member_basic_name', width: '150' },
  { label: '所属销售', prop: 'sale_users', width: '150' },
  { label: '用户邮箱', prop: 'member_email', width: '200' },
  { label: '回款方式/退款路线', prop: 'flow_source', width: '150' },
  { label: '回款/退款时间', prop: 'flow_time', width: '180' },
  { label: '回款金额', prop: 'payback_money', width: '150' },
  { label: '退款金额', prop: 'refund_money', width: '150' },
  { label: '回款/退款后余额', prop: 'total_balance_after', width: '140' },
  { label: '回款/退款后微信充值余额', prop: 'online_balance_wx_after', width: '200' },
  { label: '回款/退款后支付宝充值余额', prop: 'online_balance_alipay_after', width: '200' },
  { label: '回款/退款后支付宝转账余额', prop: 'offline_balance_alipay_after', width: '200' },
  { label: '回款/退款后银行转账余额', prop: 'offline_balance_bank_after', width: '200' }

]
const COLUMN_BS = [
  { label: 'ID', prop: 'id' },
  { label: '流水号', prop: 'flow_code', width: '250' },
  { label: '流水类型', prop: 'flow_type', width: '150' },
  { label: '流水状态', prop: 'flow_status', width: '120' },
  { label: '关联订单ID', prop: 'order_id', width: '120' },
  { label: '订单状态', prop: 'order_status', width: '120' },
  { label: '客户名称', prop: 'member_basic_name', width: '150' },
  { label: '所属销售', prop: 'sale_users', width: '150' },
  { label: '用户邮箱', prop: 'member_email', width: '200' },
  { label: '回款路线', prop: 'flow_source', width: '120' },
  { label: '回款时间', prop: 'flow_time', width: '180' },
  { label: '回款金额', prop: 'payback_money', width: '120' },
  { label: '退款金额', prop: 'refund_money', width: '120' },
  { label: '回款后余额', prop: 'total_balance_baishan_after', width: '150' },
  { label: '回款后白山微信充值余额', prop: 'baishan_online_balance_wx_after', width: '200' },
  { label: '回款后白山支付宝充值余额', prop: 'baishan_online_balance_alipay_after', width: '200' }
]

const orderTabs = [
  { label: '云盾预付费', name: '1' },
  { label: '云盾后付费', name: '2' },
  { label: '白山云预付费', name: '3' },
  { label: '白山云后付费', name: '4' }
]

const rules = {
  op_pass: [{ required: true, message: '请输入操作密码', trigger: ['change', 'blur'] }],
  flow_status: [{ required: true, message: '请选择流水状态', trigger: ['change', 'blur'] }],
  flow_money: [{ required: true, message: '请输入流水金额', trigger: ['change', 'blur'] }],
  flow_time: [{ required: true, message: '请选择流水时间', trigger: ['change', 'blur'] }],
  flow_source: [{ required: true, message: '请选择流水来源', trigger: ['change', 'blur'] }],
  member_id: [{ required: true, message: '请输入用户ID', trigger: ['change', 'blur'] }],
  member_email: [{ required: true, message: '请输入用户邮箱', trigger: ['change', 'blur'] }],
  leaf_member_id: [{ required: true, message: '请输入代理商ID', trigger: ['change', 'blur'] }],
  leaf_member_email: [{ required: true, message: '请输入代理商邮箱', trigger: ['change', 'blur'] }],
  sales_id: [{ required: true, message: '请输入销售', trigger: ['change', 'blur'] }],

  total_balance_before: [{ required: true, message: '请输入回款/退款前余额', trigger: ['change', 'blur'] }],
  total_balance_after: [{ required: true, message: '请输入回款/退款后余额', trigger: ['change', 'blur'] }],
  online_balance_wx_before: [{ required: true, message: '请输入回款/退款前微信充值余额', trigger: ['change', 'blur'] }],
  online_balance_wx_after: [{ required: true, message: '请输入回款/退款后微信充值余额', trigger: ['change', 'blur'] }],
  online_balance_alipay_before: [{ required: true, message: '请输入回款/退款前支付宝充值余额', trigger: ['change', 'blur'] }],
  online_balance_alipay_after: [{ required: true, message: '请输入回款/退款前支付宝充值余额', trigger: ['change', 'blur'] }],
  offline_balance_alipay_before: [{ required: true, message: '请输入回款/退款前支付宝转账余额', trigger: ['change', 'blur'] }],
  offline_balance_alipay_after: [{ required: true, message: '请输入回款/退款后支付宝转账余额', trigger: ['change', 'blur'] }],
  offline_balance_bank_before: [{ required: true, message: '请输入回款/退款前银行转账余额', trigger: ['change', 'blur'] }],
  offline_balance_bank_after: [{ required: true, message: '请输入回款/退款后银行转账余额', trigger: ['change', 'blur'] }],

  total_balance_baishan_before: [{ required: true, message: '请输入回款前余额', trigger: ['change', 'blur'] }],
  total_balance_baishan_after: [{ required: true, message: '请输入回款后余额', trigger: ['change', 'blur'] }],
  baishan_online_balance_wx_before: [{ required: true, message: '请输入回款前白山微信充值余额', trigger: ['change', 'blur'] }],
  baishan_online_balance_wx_after: [{ required: true, message: '请输入回款后白山微信充值余额', trigger: ['change', 'blur'] }],
  baishan_online_balance_alipay_before: [{ required: true, message: '请输入回款前白山支付宝充值余额', trigger: ['change', 'blur'] }],
  baishan_online_balance_alipay_after: [{ required: true, message: '请输入回款后白山支付宝充值余额', trigger: ['change', 'blur'] }],

  sale_id: [{ required: true, message: '请选择销售', trigger: ['change', 'blur'] }]
}
const orderStatusMap = {
  '-1': '删除',
  0: '未支付',
  1: '已支付',
  2: '已取消',
  3: '已过期',
  4: '待回款',
  5: '待退款',
  6: '已退款',
  7: '作废'
}
export {
  myBackToTopStyle, FLOW_STATUS, FLOW_STATUS_TEXT, FLOW_SOURCE,
  FLOW_SOURCE_TEXT, LIST_SEARCH, FLOW_TYPE_TEXT, FLOW_TYPE, COLUMN_YD, COLUMN_BS, orderTabs, FLOW_SOURCE_BS, rules, orderStatusMap
}
