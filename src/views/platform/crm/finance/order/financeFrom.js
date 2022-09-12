import Rul from '@/utils/verify'

const FORM_SEARCH = {
  id: '',
  email: '',
  plan_id: '',
  type: '',
  order_type: '',
  buy_type: [],
  pay_time: '',
  pay_type: '',
  created_at: '',
  created_at_start: '',
  created_at_end: '',
  agent_member_emails: [],
  order_start_time_start: '', // 订单开始时间 - 起始时间
  order_start_time_end: '', // 订单开始时间 - 截止时间
  order_end_time_start: '', // 订单结束时间 - 起始时间
  order_end_time_end: '', // 订单结束时间 - 截止时间
  sale_user_id: '',
  sales: [],
  status: '',
  has_receive: '',
  confirm: '',
  platform: '',
  payment_mode: '',
  test_user: '',
  no_pay: '',
  order_hw2web: 0
}
const FORM_SEARCH_RULE = {}
const HAS_RECEIVE = [
  { label: '全部拆分状态', value: '' },
  { label: '未拆分', value: '0' },
  { label: '已拆分', value: '1' }
]

const CONFIRM = [
  { label: '全部确认状态', value: '' },
  { label: '未确认', value: '0' },
  { label: '已确认', value: '1' }
]
const TEST_USER = [
  { label: '全部用户', value: '' },
  { label: '非测试用户', value: '0' },
  { label: '测试用户', value: '1' }
]
const ORDER_TYPE = [
  { lable: '全部订单目的', value: '' },
  { lable: '正式开通', value: 'normal' },
  { lable: '测试开通', value: 'user_test' },
  { lable: '试用开通', value: 'user_refund' },
  { lable: '调整单', value: 'adjustment' }
]

const ORDER_TYPE_TEXT = {
  normal: '正式开通',
  user_test: '测试开通',
  user_refund: '试用开通',
  adjustment: '调整单'
}
//   订单状态:-1删除, 0未支付, 1已支付, 2已取消, 3已过期, 4待回款, 5待退款, 6已回款,
const STATUS = [
  { lable: '全部订单状态', value: '' },
  { lable: '未支付', value: '0' },
  { lable: '已支付', value: '1' },
  { lable: '已取消', value: '2' },
  { lable: '已过期', value: '3' },
  { lable: '待回款', value: '4' },
  { lable: '待退款', value: '5' },
  { lable: '已回款', value: '6' },
  { lable: '已作废', value: '7' },
  { lable: '后付费', value: '8' },
  { lable: '删除', value: '-1' },
  { lable: '标记删除', value: '-2' }
]

const PLATFORM = [
  { lable: '全部所属平台', value: '' },
  { lable: '云盾', value: '1' },
  { lable: '白山云', value: '2' },
  { label: 'Canvas用户端', value: '3' }
]

const PLATFORM_TEXT = {
  1: '云盾',
  2: '白山云',
  3: 'Canvas用户端'
}

const PAYMENT_MODE = [
  { lable: '全部订单模式', value: '' },
  { lable: '预付费', value: '1' },
  { lable: '后付费', value: '2' }
]

const PAYMENT_MODE_TEXT = {
  1: '预付费',
  2: '后付费'
}

// 0默认 1现金 2银行转账 3余额 4微信 5支付宝 6白条
const PAYTYPE = [
  { lable: '默认支付', value: '' },
  { lable: '现金支付', value: '1' },
  { lable: '银行转账 ', value: '2' },
  { lable: '余额支付', value: '3' },
  { lable: '微信支付', value: '4' },
  { lable: '支付宝支付', value: '5' },
  { lable: '欠款支付', value: '6' }
]
// :0购买, 1升级, 2续费, 3降级, 4扩容, 5增值
const BUYTYPE = [
  { lable: '购买', value: '0' },
  { lable: '升级 ', value: '1' },
  { lable: '续费', value: '2' },
  { lable: '降级', value: '3' },
  { lable: '扩容', value: '4' },
  { lable: '增值', value: '5' },
  { lable: '退订', value: '6' }
]
// 搜索类型 all(全部) payed(己支付), unpayback(未回款), unrefund(未退款), other(其他,如email/order_code)
const orderTabs = [
  { label: '全部订单', type: 'all', name: 'all' },
  { label: '己支付订单', type: 'payed', name: 'payed' },
  { label: '待回款订单', type: 'unpayback', name: 'unpayback' },
  { label: '待退款订单', type: 'unrefund', name: 'unrefund' }
]

const ROWOPTION = [
  { type: 'info', text: '详情', status: 1 },
  { type: 'payback', text: '确认回款', status: 4 },
  { type: 'refund', text: '确认退款', status: 5 },
  { type: 'edit', text: '编辑', status: 1 }
]
// 整数类型
function is_plusnum(rule, value, callback) {
  const plusnum = Rul.plusnum.test(value)
  if (plusnum) {
    callback()
  } else {
    callback(new Error())
  }
}
const listMap = {
  map_buy_type: [],
  map_meal: [],
  map_order_status: [],
  agent_emails: [],
  map_order_type: [],
  map_product: [],
  members: [],
  map_meal_name: {},
  users: []
}
const myBackToTopStyle = {
  right: '50px',
  bottom: '40px',
  width: '40px',
  height: '40px',
  'z-index': '999',
  'border-radius': '4px',
  'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
  background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
}
const column = [
  { label: '订单ID', prop: 'id', width: 100, fixed: 'left' },
  { label: '套餐ID', prop: 'plan_id', width: 100 },
  { label: '套餐', prop: 'meal', width: 250 },
  { label: '操作前套餐', prop: 'meal_flag_before', width: 250 },
  { label: '客户名称', prop: 'member_basic_name', width: 150 },
  { label: '所属销售', prop: 'sales' },
  { label: '用户邮箱', prop: 'member_email', width: 200 },
  { label: '代理商邮箱', prop: 'agent_member_email', width: 200 },
  { label: '支付邮箱', prop: 'pay_member_email', width: 200 },
  { label: '渠道邮箱', prop: 'channel_member_email', width: 200 },
  { label: '渠道关联类型', prop: 'channel_end_relation', width: 120 },
  { label: '订单目的', prop: 'order_type' },
  { label: '订单类型', prop: 'buy_type' },
  { label: '订单状态', prop: 'status' },
  { label: '拆分状态', prop: 'has_receive' },
  { label: '确认状态', prop: 'confirm', width: 150 },
  { label: '支付方式', prop: 'pay_type' },
  { label: '所属平台', prop: 'platform', width: 120 },
  { label: '订单模式', prop: 'payment_mode' },
  { label: '应付金额/元', prop: 'pay_price', width: 120 },
  { label: '实付金额/元', prop: 'pay_off_price', width: 120 },
  { label: '销售业绩比例', prop: 'sales_performance', width: 120 },
  { label: '公司业绩比例', prop: 'company_performance', width: 120 },
  { label: '公司部分提成比例', prop: 'company_commission', width: 150 },
  { label: '销售部分提成比例', prop: 'sales_commission', width: 150 },
  { label: '订单时间', prop: 'order_time', width: 160 },
  { label: '创建时间', prop: 'created_at', width: 160 },
  { label: '业绩时间', prop: 'performance_time', width: 160 },
  { label: '是否超出业绩时间', prop: 'performance_over', width: 140 }
]

const NO_PAY = [
  { label: '全部金额订单', value: '' },
  { label: '0元订单', value: '1' },
  { label: '非0元订单', value: '2' }
]
const created_at = ''
const order_time = ''
const order_end_time = ''
export {
  created_at,
  order_time,
  order_end_time,
  FORM_SEARCH,
  FORM_SEARCH_RULE,
  is_plusnum,
  ROWOPTION,
  TEST_USER,
  listMap,
  column,
  myBackToTopStyle,
  ORDER_TYPE,
  ORDER_TYPE_TEXT,
  STATUS,
  PAYTYPE,
  BUYTYPE,
  orderTabs,
  CONFIRM,
  HAS_RECEIVE,
  PLATFORM,
  PLATFORM_TEXT,
  PAYMENT_MODE,
  PAYMENT_MODE_TEXT,
  NO_PAY
}
