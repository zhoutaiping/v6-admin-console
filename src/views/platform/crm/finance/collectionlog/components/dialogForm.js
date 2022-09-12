
// 流水状态 1-正常，2-作废.
const FLOW_STATUS = [
  { label: '正常', value: '1' },
  { label: '作废', value: '2' }
]
const FLOW_STATUS_TEXT = { 1: '正常', 2: '作废' }
// '流水来源： 1- 线下银行转，2-线下支付宝，3-线下微信，4-线上支付宝，5-线上微信, 6-线下转账余额，7-线上充值余额，8-直接到银行，9-直接到支付宝，10-直接到微信'

const FLOW_SOURCE = [
  // { label: '全部收款来源', value: '' },
  { label: '云盾银行转帐', value: '1' },
  { label: '云盾支付宝转账', value: '2' },
  // { label: ' 线下微信', value: '3' },
  { label: '云盾支付宝充值', value: '4' },
  { label: '云盾微信充值', value: '5' },
  { label: '云盾网银充值', value: '13' },
  // { label: ' 线下转账余额', value: '6' },
  // { label: ' 线上充值', value: '7' },
  // { label: '直接到银行', value: '8' },
  // { label: '直接到支付宝', value: '9' },
  // { label: '直接到微信', value: '10' },
  { label: '白山支付宝充值', value: '11' },
  { label: '白山微信充值', value: '12' }

]
const FLOW_SOURCE_TEXT = {
  1: '云盾银行转帐', 2: '云盾支付宝转账', 3: '云盾微信转账', 4: '云盾支付宝充值', 5: '云盾微信充值', 6: '云盾线下转账余额',
  7: '云盾线上充值余额', 8: '直接退款到银行', 9: '直接退款到支付宝', 10: '直接退款到微信', 11: '白山支付宝充值', 12: '白山微信充值', 13: '云盾网银充值'
}

const detailForm = {
  visible: false,
  loading: false,
  flow_source: '1',
  member_email: '',
  member_id: '',
  flow_code: '',
  flow_money: 0,
  flow_time: '',
  screen_pic_img: '',
  screen_pic: '',
  flow_status: '',
  flow_type: '',
  flow_people: '',
  remark: ''
}

const rules = {
  flow_source: [{ required: true, message: '请选择收款来源', trigger: ['change', 'blur'] }],
  flow_money: [{ required: true, message: '请填写发票税号', trigger: ['change', 'blur'] }],
  flow_people: [{ required: true, message: '请填写收款人', trigger: ['change', 'blur'] }],
  screen_pic: [{ required: true, message: '请上传收款截图', trigger: ['change'] }],
  flow_time: [{ required: true, message: '请选择收款时间', trigger: ['change', 'blur'] }],
  remark: [], // [{ required: true, message: '请填写备注', trigger: ['change', 'blur'] }],
  flow_code: [{ required: true, message: '请填写流水号', trigger: ['change', 'blur'] }]
}
export {
  detailForm, rules, FLOW_STATUS, FLOW_STATUS_TEXT, FLOW_SOURCE, FLOW_SOURCE_TEXT
}
