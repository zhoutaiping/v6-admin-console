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
// 流水来源： 1- 线下银行转，2-线下支付宝，3-线下微信，4-线上支付宝，5-线上微信.
const FLOW_SOURCE = [
  { label: ' 打款到银行', value: '1' },
  { label: ' 打款到支付宝', value: '4' },
  { label: ' 打款到微信', value: '5' }

]
const FLOW_SOURCE_TEXT = {
  1: '银行转帐', 2: '支付宝转账', 3: '微信转账', 4: '支付宝充值', 5: '微信充值', 6: '线下转账余额',
  7: '线上充值余额', 8: '直接退款到银行', 9: '直接退款到支付宝', 10: '直接退款到微信', 11: '白山支付宝充值', 12: '白山微信充值', 13: '云盾网银充值'
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
  plat: 'yd'
}
export {
  myBackToTopStyle, FLOW_STATUS, FLOW_STATUS_TEXT, FLOW_SOURCE, FLOW_SOURCE_TEXT, LIST_SEARCH
}
