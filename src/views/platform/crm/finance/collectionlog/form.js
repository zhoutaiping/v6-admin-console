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
  { label: '正常', value: '1' },
  { label: '作废', value: '2' }
]
const FLOW_STATUS_TEXT = { 1: '正常', 2: '作废' }

// '流水来源： 1- 线下银行转，2-线下支付宝，3-线下微信，4-线上支付宝，5-线上微信, 6-线下转账余额，7-线上充值余额，8-直接到银行，9-直接到支付宝，10-直接到微信',11-白山支付宝充值，12-白山微信充值'

const FLOW_SOURCE = [
  { label: ' 云盾银行转帐', value: '1' },
  { label: ' 云盾支付宝转账', value: '2' },
  { label: ' 云盾支付宝充值', value: '4' },
  { label: ' 云盾微信充值', value: '5' },
  { label: '云盾网银充值', value: '13' },
  { label: '白山支付宝充值', value: '11' },
  { label: '白山微信充值', value: '12' }

]
const FLOW_SOURCE_TEXT = {
  1: '云盾银行转帐', 2: '云盾支付宝转账', 3: '云盾微信转账', 4: '云盾支付宝充值', 5: '云盾微信充值', 6: '线下转账余额',
  7: '线上充值余额', 8: '直接退款到银行', 9: '直接退款到支付宝', 10: '直接退款到微信', 11: '白山支付宝充值', 12: '白山微信充值', 13: '网银充值'
}
const LIST_SEARCH = {
  id: '',
  flow_source: '',
  member_email: '',
  flow_time: '',
  flow_time_start: '',
  flow_time_end: '',
  flow_status: '',
  flow_type: '',
  sales: '',
  sales_id: [],
  relationMember: '1'
}

const COLUMN = [
  { label: 'ID', prop: 'id', width: '100', fixed: 'left' },
  { label: '收款流水号', prop: 'flow_code', width: '250' },
  { label: '用户邮箱', prop: 'member_email', width: '200' },
  { label: '销售', prop: 'sale_users', width: '200' },
  { label: '收款来源', prop: 'flow_source', width: '200' },
  { label: '收款金额', prop: 'flow_money', width: '200' },
  { label: '收款时间', prop: 'flow_time', width: '200' },
  { label: '状态', prop: 'flow_status', width: '120' },
  { label: '审核状态', prop: 'act_pay_status', width: '120' },
  { label: '收款人', prop: 'flow_people', width: '200' },
  { label: '收款截图', prop: 'screen_pic', width: '' }
]

export {
  myBackToTopStyle, FLOW_STATUS, FLOW_STATUS_TEXT, FLOW_SOURCE, FLOW_SOURCE_TEXT, LIST_SEARCH, COLUMN
}
